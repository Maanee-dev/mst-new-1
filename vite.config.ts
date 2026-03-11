import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Custom Prerender Plugin for SEO
function prerenderResorts() {
  return {
    name: 'prerender-resorts',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distPath, 'index.html');
      
      if (!fs.existsSync(indexPath)) return;
      
      const template = fs.readFileSync(indexPath, 'utf-8');
      
      // Static resorts data for prerendering
      const resorts = [
        {
          slug: 'adaaran-prestige-vadoo',
          name: 'Adaaran Prestige Vadoo',
          description: 'Experience ultimate intimacy at Adaaran Prestige Vadoo. Private overwater villas with jacuzzis, butler service, and a vibrant house reef in South Male Atoll.',
          image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=1200'
        },
        {
          slug: 'soneva-jani',
          name: 'Soneva Jani',
          description: 'Discover Soneva Jani, the pinnacle of sustainable luxury in Noonu Atoll. Iconic overwater villas with retractable roofs, private slides, and rare experiences.',
          image: 'https://images.unsplash.com/photo-1505881502353-a1986add3732?auto=format&fit=crop&q=80&w=1200'
        },
        {
          slug: 'gili-lankanfushi',
          name: 'Gili Lankanfushi',
          description: 'Gili Lankanfushi is an eco-friendly resort that blends seamlessly into the environment. Every villa is overwater, crafted from sustainable materials.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200'
        },
        {
          slug: 'waldorf-astoria-ithaafushi',
          name: 'Waldorf Astoria Ithaafushi',
          description: 'Waldorf Astoria Maldives Ithaafushi is a sprawling paradise spanning three islands. It offers 11 world-class dining venues, including a tree-top restaurant.',
          image: 'https://images.unsplash.com/photo-1578922746465-3a805228b223?auto=format&fit=crop&q=80&w=1200'
        }
      ];

      resorts.forEach(resort => {
        const dir = path.join(distPath, 'stays', resort.slug);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        let html = template;
        
        // Replace SEO tags
        html = html.replace(
          /<title>.*?<\/title>/,
          `<title>${resort.name} | Maldives Serenity Travels</title>`
        );
        html = html.replace(
          /<meta name="description" content=".*?">/,
          `<meta name="description" content="${resort.description}">`
        );
        html = html.replace(
          /<meta property="og:title" content=".*?">/,
          `<meta property="og:title" content="${resort.name} | Maldives Serenity Travels">`
        );
        html = html.replace(
          /<meta property="og:description" content=".*?">/,
          `<meta property="og:description" content="${resort.description}">`
        );
        html = html.replace(
          /<meta property="og:image" content=".*?">/,
          `<meta property="og:image" content="${resort.image}">`
        );
        html = html.replace(
          /<meta name="twitter:title" content=".*?">/,
          `<meta name="twitter:title" content="${resort.name} | Maldives Serenity Travels">`
        );
        html = html.replace(
          /<meta name="twitter:description" content=".*?">/,
          `<meta name="twitter:description" content="${resort.description}">`
        );
        
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      });
      console.log('✅ Prerendered resort pages for SEO');
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), prerenderResorts()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.AMADEUS_CLIENT_ID': JSON.stringify(env.AMADEUS_CLIENT_ID),
        'process.env.AMADEUS_CLIENT_SECRET': JSON.stringify(env.AMADEUS_CLIENT_SECRET)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
