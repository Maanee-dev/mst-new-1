import express from 'express';
import cors from 'cors';
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
