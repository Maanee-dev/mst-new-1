import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Amadeus API Helper
let amadeusToken: string | null = null;
let amadeusTokenExpiry: number = 0;

async function getAmadeusToken() {
  if (amadeusToken && Date.now() < amadeusTokenExpiry) {
    return amadeusToken;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus credentials not configured');
  }

  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  amadeusToken = response.data.access_token;
  amadeusTokenExpiry = Date.now() + response.data.expires_in * 1000;
  return amadeusToken;
}

async function startServer() {
  try {
    console.log('Initializing server...');
    const app = express();
    const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  
  app.get('/health', (req, res) => {
    res.send('OK');
  });

  app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'serenity-secret'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  }));

  // Flight Search Route (Amadeus)
  app.get('/api/flights/search', async (req, res) => {
    const { origin, destination, departureDate, returnDate, adults } = req.query;
    
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'origin, destination, and departureDate are required' });
    }

    try {
      const token = await getAmadeusToken();
      
      // Amadeus Flight Offers Search v2
      const params = new URLSearchParams({
        originLocationCode: origin as string,
        destinationLocationCode: destination as string,
        departureDate: departureDate as string,
        adults: (adults as string) || '1',
        currencyCode: 'USD',
        max: '10'
      });

      if (returnDate) {
        params.append('returnDate', returnDate as string);
      }

      const flightsResponse = await axios.get(
        `https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      res.json(flightsResponse.data);
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.errors?.[0]?.detail || errorData?.message || error.message;
      console.error('Flight API Error:', errorData || error.message);
      res.status(500).json({ 
        error: 'Failed to fetch live flight offers', 
        details: errorMessage 
      });
    }
  });

  // IATA City/Airport Search
  app.get('/api/flights/locations', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.json([]);

    try {
      const token = await getAmadeusToken();
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      res.json(response.data.data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  });

  app.get('/robots.txt', (req, res) => {
    const filePath = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, 'dist', 'robots.txt')
      : path.join(__dirname, 'public', 'robots.txt');
    res.sendFile(filePath);
  });

  app.get('/sitemap.xml', (req, res) => {
    const filePath = process.env.NODE_ENV === 'production' 
      ? path.join(__dirname, 'dist', 'sitemap.xml')
      : path.join(__dirname, 'public', 'sitemap.xml');
    res.sendFile(filePath);
  });

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      console.log('Vite dev server created');
      app.use(vite.middlewares);

      app.get('*any', async (req, res, next) => {
        const url = req.originalUrl;
        console.log(`Handling request for: ${url}`);

        // Skip API and Auth routes
        if (url.startsWith('/api') || url.startsWith('/auth') || url.startsWith('/health')) {
          return next();
        }

        // Skip files with extensions (likely handled by vite.middlewares or missing)
        if (path.extname(url)) {
          return next();
        }

        try {
          const indexPath = path.resolve(__dirname, 'index.html');
          console.log(`Reading index.html from: ${indexPath}`);
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
          console.error('SPA Catch-all Error:', e);
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
    } else {
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('*any', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
