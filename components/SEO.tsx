
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({
  title = "Maldives Serenity Travel | Luxury Maldives Resorts & Experiences",
  description = "Discover the ultimate luxury in the Maldives with Maldives Serenity Travel. We offer curated resort stays, exclusive experiences, and personalized travel planning for your dream Maldivian getaway.",
  keywords = "Maldives, luxury resorts, Maldives travel, Maldives serenity travel, Maldives vacation, honeymoon Maldives, private island Maldives, Maldives experiences",
  image = "https://maldives-serenitytravels.com/og-image.jpg",
  url = "https://maldives-serenitytravels.com",
  type = "website",
  schema
}) => {
  const siteName = "Maldives Serenity Travel";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Default JSON-LD for the business
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Maldives Serenity Travel",
    "alternateName": "Maldives Serenity Travels",
    "url": "https://maldives-serenitytravels.com",
    "logo": "https://maldives-serenitytravels.com/logo.png",
    "image": "https://maldives-serenitytravels.com/og-image.jpg",
    "description": "Premium travel agency specializing in luxury Maldives resorts, private island stays, and bespoke Maldivian experiences.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Male",
      "addressCountry": "MV"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.1755,
      "longitude": 73.5093
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.instagram.com/maldivesserenitytravels",
      "https://www.facebook.com/maldivesserenitytravels"
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
