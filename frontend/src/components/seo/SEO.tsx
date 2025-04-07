import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  schemaJSON?: Record<string, unknown>;
}

const SEO = ({
  title = 'Baxoq.Store - Premium Swords & Knives Marketplace',
  description = 'Discover our exquisite collection of traditional and modern blades from around the world.',
  keywords = 'swords, knives, daggers, collectible swords, blade marketplace',
  ogImage = '/og-image.jpg',
  ogUrl,
  canonical,
  type = 'website',
  schemaJSON
}: SEOProps) => {
  const siteUrl = 'https://baxoq.store';
  const defaultImage = `${siteUrl}/images/og-image.jpg`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={ogUrl || siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl || siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      
      {/* Structured Data / JSON-LD */}
      {schemaJSON && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJSON)}
        </script>
      )}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEO; 