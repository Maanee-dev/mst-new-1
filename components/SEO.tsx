import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  twitterHandle?: string;
  breadcrumbs?: { name: string; item: string }[];
}

const SEO: React.FC<SEOProps> = ({
  title = "Maldives Serenity Travel | Luxury Maldives Resorts & Experiences",
  description = "Discover the ultimate luxury in the Maldives with Maldives Serenity Travel. We offer curated resort stays, exclusive experiences, and personalized travel planning for your dream Maldivian getaway.",
  keywords = "Maldives, luxury resorts, Maldives travel, Maldives serenity travel, Maldives vacation, honeymoon Maldives, private island Maldives, Maldives experiences",
  image = "https://maldives-serenitytravels.com/og-image.jpg",
  url,
  type = "website",
  schema,
  noindex = false,
  nofollow = false,
  author = "Maldives Serenity Travel",
  publishedTime,
  modifiedTime,
  twitterHandle = "@maldivesserenity",
  breadcrumbs
}) => {
  const location = useLocation();
  const siteName = "Maldives Serenity Travel";
  const baseUrl = "https://maldives-serenitytravels.com";
  const currentUrl = url || `${baseUrl}${location.pathname}`;
  
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  // Robots string
  const robots = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  // Default Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": siteName,
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.png`,
      "width": 600,
      "height": 60
    },
    "sameAs": [
      "https://www.instagram.com/maldivesserenitytravels",
      "https://www.facebook.com/maldivesserenitytravels",
      "https://twitter.com/maldivesserenity"
    ]
  };

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs ? {
    "@type": "BreadcrumbList",
    "@id": `${currentUrl}/#breadcrumb`,
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item.startsWith('http') ? crumb.item : `${baseUrl}${crumb.item}`
    }))
  } : null;

  // WebPage Schema
  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${currentUrl}/#webpage`,
    "url": currentUrl,
    "name": fullTitle,
    "isPartOf": { "@id": `${baseUrl}/#website` },
    "description": description,
    "breadcrumb": breadcrumbSchema ? { "@id": `${currentUrl}/#breadcrumb` } : undefined,
    "inLanguage": "en-US"
  };

  const finalSchema = schema || {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      webpageSchema,
      breadcrumbSchema
    ].filter(Boolean)
  };

  return (
    <Helmet>
      <html lang="en" />
      
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
