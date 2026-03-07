const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Enhanced Node.js SEO & SPA Server
 * 
 * Intercepts incoming requests to inject dynamic metadata into the index.html shell.
 * This ensures 'View Source' shows unique content and bots can index the site effectively.
 */
const port = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.tsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

// Static SEO Definitions for primary routes
const SEO_MAP = {
  '/': {
    title: 'Serenity Maldives | Luxury Travel Agency & Bespoke Journeys',
    description: 'A bespoke boutique agency crafting unrivaled luxury journeys across the Maldivian atolls. Discover private islands and overwater villas.'
  },
  '/stays': {
    title: 'Luxury Resorts & Overwater Villas | Serenity Maldives Portfolio',
    description: 'Explore our curated selection of the finest luxury resorts and overwater villas in the Maldives. Find your perfect island sanctuary.'
  },
  '/offers': {
    title: 'Exclusive Maldives Holiday Offers | Bespoke Travel Deals',
    description: 'Access the most exclusive holiday deals in the Maldives. Luxury honeymoon packages, early bird discounts, and seasonal privileges.'
  },
  '/experiences': {
    title: 'Curated Maldives Experiences | Diving, Surfing & Private Safaris',
    description: 'Explore bespoke adventures in the Maldives. From whale shark safaris to private sandbank soirées, define your unique perspective.'
  },
  '/stories': {
    title: 'The Serenity Journal | Maldives Travel Blog & Insights',
    description: 'Editorial dispatches from the heart of the archipelago. Insights on luxury travel, local culture, and atoll guides.'
  },
  '/plan': {
    title: 'Bespoke Holiday Planning | Custom Maldives Itineraries',
    description: 'Initiate your bespoke planning journey. Our specialists curate custom Maldivian portfolios tailored to your vision.'
  },
  '/about': {
    title: 'About Us | The Curators of Maldivian Luxury',
    description: 'Serenity Maldives is defined by perspective. Discover our heritage and mission to curate the silence of the archipelago.'
  },
  '/contact': {
    title: 'Contact Us | Initiate the Dialogue',
    description: 'Connect with our Maldivian travel specialists for bespoke holiday planning and luxury concierge services.'
  }
};

/**
 * Helper to generate readable titles from URL slugs
 */
function titleFromSlug(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const server = http.createServer((req, res) => {
  // 1. Normalize path and remove query parameters for routing
  const rawUrl = req.url || '/';
  const urlPath = rawUrl.split('?')[0];
  
  // 2. Resolve local file path
  let relativePath = urlPath === '/' ? 'index.html' : urlPath.substring(1);
  const filePath = path.join(__dirname, relativePath);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // 3. Asset vs Route Handling
  fs.stat(filePath, (err, stats) => {
    // If it's a real asset file (CSS, JS, Images, Sitemap)
    if (!err && stats.isFile() && !urlPath.endsWith('.html') && urlPath !== '/') {
      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Error serving static asset');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      });
    } 
    // If it's a SPA Route or fallback
    else {
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, 'utf-8', (readErr, html) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Critical Error: index.html not found');
          return;
        }

        // 4. Determine SEO Metadata for the specific URL
        let meta = SEO_MAP[urlPath];

        // Handle dynamic deep links (Resort and Story pages)
        if (!meta) {
          if (urlPath.startsWith('/stays/')) {
            const slug = urlPath.split('/').pop();
            const resortName = titleFromSlug(slug);
            meta = {
              title: `${resortName} | Luxury Overwater Villas | Serenity Maldives`,
              description: `Discover ${resortName}, an iconic Maldivian sanctuary featuring luxury overwater villas and private island living. Book your bespoke holiday at ${resortName} with Serenity Travels.`
            };
          } else if (urlPath.startsWith('/stories/')) {
            const slug = urlPath.split('/').pop();
            const storyTitle = titleFromSlug(slug);
            meta = {
              title: `${storyTitle} | The Serenity Journal Dispatch`,
              description: `Read our latest editorial dispatch: ${storyTitle}. Gain unique insights into Maldivian heritage, luxury aesthetics, and travel intelligence.`
            };
          } else {
            // Default to homepage if no match
            meta = SEO_MAP['/'];
          }
        }

        // 5. Dynamic Placeholder Replacement
        const finalHtml = html
          .replace(/__TITLE__/g, meta.title)
          .replace(/__DESCRIPTION__/g, meta.description)
          .replace(/__URL__/g, `https://maldives-serenitytravels.com${urlPath}`);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(finalHtml, 'utf-8');
      });
    }
  });
});

server.listen(port, () => {
  console.log(`SEO-Aware Server running at http://localhost:${port}/`);
});