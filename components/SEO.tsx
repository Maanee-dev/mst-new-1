import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'hotel';
  schema?: object;
  // New prop to handle specific organization schema
  isOrganization?: boolean;
}

/**
 * Production-grade SEO Component
 * Optimized for Next.js-style metadata patterns.
 */
const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://maldives-serenitytravels.com/images/Screenshot%202026-02-23%20at%2000.17.04.png', 
  keywords = [
    'Maldives luxury travel', 'private island resorts Maldives', 'overwater villas Maldives', 
    'bespoke Maldives travel', 'Maldives Serenity Travels', 'Maldives honeymoon packages',
    'luxury beach villas Maldives', 'all-inclusive Maldives resorts', 'Maldives diving holidays',
    'Maldives family resorts', 'Southern atolls Maldives', 'Addu City travel'
  ],
  type = 'website',
  schema,
  isOrganization = false
}) => {
  const location = useLocation();
  const canonical = `https://maldives-serenitytravels.com${location.pathname}`;

  useEffect(() => {
    document.title = title;
    
    const setMeta = (attr: string, value: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords.join(', '));
    
    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', type);
    // CRITICAL: Ensure site_name matches the brand name exactly
    setMeta('property', 'og:site_name', 'Maldives Serenity Travels');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Canonical
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // Organization & Custom Schema
    const scriptId = 'schema-jsonld';
    const script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const orgSchema = isOrganization ? {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Maldives Serenity Travels",
      "url": "https://maldives-serenitytravels.com",
      "logo": "https://maldives-serenitytravels.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+960-725-9060",
        "contactType": "customer service",
        "areaServed": "MV",
        "availableLanguage": ["en"]
      }
    } : null;

    const finalSchema = schema ? { ...orgSchema, ...schema } : orgSchema;

    if (finalSchema) {
      if (script) {
        script.textContent = JSON.stringify(finalSchema);
      } else {
        const newScript = document.createElement('script');
        newScript.id = scriptId;
        newScript.type = 'application/ld+json';
        newScript.textContent = JSON.stringify(finalSchema);
        document.head.appendChild(newScript);
      }
    }
  }, [title, description, image, canonical, type, schema, keywords, isOrganization]);

  return null;
};

export default SEO;