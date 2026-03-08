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

  // OTA Prices Route (Amadeus)
  app.get('/api/ota/prices', async (req, res) => {
    const { resortName, checkIn, checkOut } = req.query;
    
    if (!resortName) {
      return res.status(400).json({ error: 'resortName is required' });
    }

    try {
      const token = await getAmadeusToken();
      
      // 1. Search for Hotel ID by Name
      const searchResponse = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-hotels?keyword=${encodeURIComponent(resortName as string)}&subType=HOTEL_GDS`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hotel = searchResponse.data.data?.[0];
      if (!hotel) {
        return res.status(404).json({ error: 'Hotel not found in OTA database' });
      }

      // 2. Get Hotel Offers
      // Amadeus Hotel Search v3
      const offersResponse = await axios.get(
        `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotel.hotelId}&adults=2&checkInDate=${checkIn || ''}&checkOutDate=${checkOut || ''}&roomQuantity=1&paymentPolicy=NONE&bestRateOnly=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const offers = offersResponse.data.data?.[0]?.offers || [];
      
      res.json({
        hotelId: hotel.hotelId,
        name: hotel.name,
        offers: offers.map((o: any) => ({
          id: o.id,
          checkIn: o.checkInDate,
          checkOut: o.checkOutDate,
          roomType: o.room?.typeEstimated?.category,
          price: o.price?.total,
          currency: o.price?.currency,
          provider: 'Amadeus GDS'
        }))
      });
    } catch (error: any) {
      console.error('OTA API Error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to fetch live OTA prices', 
        details: error.response?.data?.errors?.[0]?.detail || error.message 
      });
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

      app.get('*', async (req, res, next) => {
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
      app.get('*', (req, res) => {
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
