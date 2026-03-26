import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const BASE_URL = 'https://www.ilcortilemalpensa.com';

type Page = 'home' | 'gallery';

interface SEOMeta {
  title: string;
  description: string;
  path: string;
}

const seoData: Record<string, Record<Page, SEOMeta>> = {
  it: {
    home: {
      title: 'B&B Il Cortile — Bed and Breakfast vicino Malpensa',
      description:
        "Bed and Breakfast a Casorate Sempione, a pochi minuti dall'aeroporto di Milano Malpensa. Camere confortevoli, parcheggio gratuito e servizio navetta aeroportuale.",
      path: '/',
    },
    gallery: {
      title: 'Galleria Fotografica — B&B Il Cortile Malpensa',
      description:
        "Scopri le foto delle camere e degli spazi del B&B Il Cortile a Casorate Sempione, vicino all'aeroporto di Malpensa.",
      path: '/gallery',
    },
  },
  en: {
    home: {
      title: 'B&B Il Cortile — Bed and Breakfast near Malpensa',
      description:
        'Bed and Breakfast in Casorate Sempione, just minutes from Milan Malpensa Airport. Comfortable rooms, free parking and airport shuttle service.',
      path: '/',
    },
    gallery: {
      title: 'Photo Gallery — B&B Il Cortile Malpensa',
      description:
        'Browse photos of rooms and spaces at B&B Il Cortile in Casorate Sempione, near Malpensa Airport.',
      path: '/gallery',
    },
  },
};

function getBreadcrumbSchema(lang: string, page: Page) {
  const items: { name: string; item: string }[] = [
    { name: 'Home', item: `${BASE_URL}/${lang}/` },
  ];

  if (page === 'gallery') {
    items.push({ name: 'Gallery', item: `${BASE_URL}/${lang}/gallery` });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

function getGallerySchema(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'B&B Il Cortile — Photo Gallery',
    description:
      'Photos of rooms and spaces at B&B Il Cortile near Malpensa Airport',
    url: `${BASE_URL}/${lang}/gallery`,
  };
}

interface SEOHeadProps {
  page: Page;
}

export default function SEOHead({ page }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang === 'en' ? 'en' : 'it';
  const meta = seoData[currentLang][page];
  const canonicalUrl = `${BASE_URL}/${currentLang}${meta.path}`;
  const ogLocale = currentLang === 'it' ? 'it_IT' : 'en_GB';
  const ogLocaleAlt = currentLang === 'it' ? 'en_GB' : 'it_IT';

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="it" href={`${BASE_URL}/it${meta.path}`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en${meta.path}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/it${meta.path}`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} />

      {/* BreadcrumbList structured data */}
      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbSchema(currentLang, page))}
      </script>

      {/* ImageGallery structured data (gallery page only) */}
      {page === 'gallery' ? (
        <script type="application/ld+json">
          {JSON.stringify(getGallerySchema(currentLang))}
        </script>
      ) : null}
    </Helmet>
  );
}
