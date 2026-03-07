import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cookieSession from 'cookie-session';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Instagram OAuth Routes
  app.get('/api/auth/instagram/url', (req, res) => {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = `${process.env.APP_URL}/auth/instagram/callback`;
    
    if (!clientId) {
      return res.status(500).json({ error: 'INSTAGRAM_CLIENT_ID not configured' });
    }

    const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    res.json({ url });
  });

  app.get('/auth/instagram/callback', async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = `${process.env.APP_URL}/auth/instagram/callback`;

    if (!code) return res.status(400).send('No code provided');

    try {
      const formData = new URLSearchParams();
      formData.append('client_id', clientId!);
      formData.append('client_secret', clientSecret!);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', redirectUri);
      formData.append('code', code as string);

      const tokenRes = await axios.post('https://api.instagram.com/oauth/access_token', formData);
      const shortToken = tokenRes.data.access_token;

      const longTokenRes = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortToken}`);
      const accessToken = longTokenRes.data.access_token;

      if (req.session) {
        req.session.instagramToken = accessToken;
      }

      res.send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fafafa;">
            <div style="text-align: center;">
              <h2 style="color: #0ea5e9;">Connection Successful</h2>
              <p>Your Instagram account has been linked to Maldives Serenity Travels.</p>
              <p>This window will close automatically.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'INSTAGRAM_AUTH_SUCCESS' }, '*');
                  setTimeout(() => window.close(), 2000);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error('Instagram Auth Error:', error.response?.data || error.message);
      res.status(500).send('Authentication failed. Please check your credentials.');
    }
  });

  app.get('/api/instagram/feed', async (req, res) => {
    const token = req.session?.instagramToken;
    if (!token) return res.status(401).json({ error: 'Not connected to Instagram' });

    try {
      const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`);
      res.json(response.data);
    } catch (error: any) {
      console.error('Instagram API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch feed' });
    }
  });

  app.post('/api/auth/instagram/logout', (req, res) => {
    if (req.session) {
      req.session.instagramToken = null;
    }
    res.json({ success: true });
  });

  app.get('/api/auth/instagram/status', (req, res) => {
    res.json({ connected: !!req.session?.instagramToken });
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
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
      if (url.startsWith('/api') || url.startsWith('/auth')) {
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
} catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
