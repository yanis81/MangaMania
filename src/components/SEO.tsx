import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Composant pour gérer le SEO de manière dynamique
 * Utilise react-helmet-async pour modifier les meta tags
 */
export const SEO: React.FC<SEOProps> = ({
  title = 'MangaMania - Votre Gestionnaire de Collection de Mangas',
  description = 'Gérez votre collection de mangas, suivez votre progression de lecture et découvrez de nouvelles séries',
  keywords = 'manga, collection, lecture, anime, japon, bibliothèque, suivi lecture',
  image = '/assets/og-image.jpg',
  url = 'https://mangamania.app',
  type = 'website'
}) => {
  const fullUrl = url.startsWith('http') ? url : `https://mangamania.app${url}`;
  
  return (
    <Helmet>
      {/* SEO de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}; 