# Sitemap & SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add i18n URL routing (`/it/`, `/en/`), per-route SEO meta tags, improved sitemap with hreflang, and enriched structured data to the Il Cortile B&B website.

**Architecture:** Replace browser-based language detection with URL-prefixed routes (`/:lang/`). Use `react-helmet-async` to inject per-route, per-language `<head>` tags. Update the static sitemap with all language variants and hreflang alternates. Enrich JSON-LD with business links.

**Tech Stack:** React 18, TypeScript, React Router v6, react-helmet-async, i18next, Chakra UI, Vercel

**Spec:** `docs/superpowers/specs/2026-03-26-sitemap-seo-design.md`

---

### Task 1: Install react-helmet-async

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

```bash
npm install react-helmet-async
```

- [ ] **Step 2: Verify installation**

```bash
npm ls react-helmet-async
```

Expected: Shows `react-helmet-async@x.x.x` in the tree.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-helmet-async dependency"
```

---

### Task 2: Simplify i18n configuration

Remove browser language detection. The URL will be the source of truth for language.

**Files:**
- Modify: `src/i18n.tsx`

- [ ] **Step 1: Update i18n.tsx**

Replace the entire file with:

```tsx
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEnglish from './Translation/English/translation.json';
import translationItalian from './Translation/Italian/translation.json';

const resources = {
  en: {
    translation: translationEnglish,
  },
  it: {
    translation: translationItalian,
  },
};

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
```

Key changes:
- Removed `i18next-browser-languagedetector` import and usage
- Removed `DETECTION_OPTIONS` config
- Changed `fallbackLng` from `'en'` to `'it'` (matches Italian default routing)
- Language will be set by the URL routing wrapper in Task 3

- [ ] **Step 2: Uninstall the browser language detector**

```bash
npm uninstall i18next-browser-languagedetector
```

- [ ] **Step 3: Verify the app still starts**

```bash
npm start
```

Expected: App starts without errors. Language defaults to Italian.

- [ ] **Step 4: Commit**

```bash
git add src/i18n.tsx package.json package-lock.json
git commit -m "refactor: remove browser language detection from i18n, URL is now source of truth"
```

---

### Task 3: Restructure routes with language prefix

Add `/:lang` prefix to all routes. Create a `LangRouter` wrapper that syncs URL lang param with i18next. Add redirects for `/` and `/gallery`.

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/CanonicalTag.tsx`

- [ ] **Step 1: Rewrite App.tsx**

Replace the entire file with:

```tsx
import * as React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/SideBar/SideBar';
import Hero from './components/Hero/Hero';
import Rooms from './components/Rooms/Rooms';
import Services from './components/Services/Services';
import Where from './components/Where/Where';
import Info from './components/Info/Info';
import Footer from './components/Footer/Footer';
import Gallery from './components/Gallery/Gallery';

const SUPPORTED_LANGS = ['it', 'en'];

function LangSync() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return null;
}

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Rooms />
      <Services />
      <Where />
      <Info />
      <Footer />
    </>
  );
}

function LangLayout() {
  const { lang } = useParams<{ lang: string }>();

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/it/" replace />;
  }

  return (
    <ChakraProvider theme={theme}>
      <LangSync />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Navigate to={`/${lang}/`} replace />} />
      </Routes>
    </ChakraProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/it/" replace />} />
          <Route path="/gallery" element={<Navigate to="/it/gallery" replace />} />
          <Route path="/:lang/*" element={<LangLayout />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
```

Key changes:
- `HelmetProvider` wraps the entire app
- `/:lang/*` route prefix on all pages
- `LangSync` component reads `:lang` param and syncs with i18next
- `LangLayout` validates lang and renders nested routes
- `/` redirects to `/it/`, `/gallery` redirects to `/it/gallery`
- Invalid lang values redirect to `/it/`
- Catch-all `*` route under `/:lang/*` redirects to homepage
- `CanonicalTag` removed (replaced by `SEOHead` in Task 4)
- Note: `SEOHead` is NOT imported yet — it will be added in Task 4 after the component is created

- [ ] **Step 2: Delete CanonicalTag.tsx**

```bash
rm src/components/CanonicalTag.tsx
```

- [ ] **Step 3: Verify routing works**

```bash
npm start
```

Test manually:
- `http://localhost:3000/` → should redirect to `/it/`
- `http://localhost:3000/it/` → Italian homepage
- `http://localhost:3000/en/` → English homepage
- `http://localhost:3000/gallery` → redirects to `/it/gallery`
- `http://localhost:3000/it/gallery` → Italian gallery
- `http://localhost:3000/en/gallery` → English gallery
- `http://localhost:3000/fr/` → redirects to `/it/`

Expected: All redirects work. Pages render in the correct language. (SEOHead doesn't exist yet — browser console will show an error about the missing import. That's expected and will be resolved in Task 4.)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git rm src/components/CanonicalTag.tsx
git commit -m "feat: add i18n URL routing with /:lang prefix and redirects"
```

---

### Task 4: Create SEOHead component

Renders all per-route, per-language `<head>` tags including title, description, canonical, hreflang, OG, Twitter, and structured data.

**Files:**
- Create: `src/components/SEOHead/SEOHead.tsx`

- [ ] **Step 1: Create the SEOHead component**

```bash
mkdir -p src/components/SEOHead
```

Create `src/components/SEOHead/SEOHead.tsx`:

```tsx
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
        'Bed and Breakfast a Casorate Sempione, a pochi minuti dall\'aeroporto di Milano Malpensa. Camere confortevoli, parcheggio gratuito e servizio navetta aeroportuale.',
      path: '/',
    },
    gallery: {
      title: 'Galleria Fotografica — B&B Il Cortile Malpensa',
      description:
        'Scopri le foto delle camere e degli spazi del B&B Il Cortile a Casorate Sempione, vicino all\'aeroporto di Malpensa.',
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
  const alternateLang = currentLang === 'it' ? 'en' : 'it';

  const canonicalUrl = `${BASE_URL}/${currentLang}${meta.path}`;
  const alternateUrl = `${BASE_URL}/${alternateLang}${meta.path}`;
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
```

- [ ] **Step 2: Wire SEOHead into App.tsx**

Add the import to `src/App.tsx`:

```tsx
import SEOHead from './components/SEOHead/SEOHead';
```

Update `HomePage` to include `SEOHead`:

```tsx
function HomePage() {
  return (
    <>
      <SEOHead page="home" />
      <Navbar />
      <Hero />
      <Rooms />
      <Services />
      <Where />
      <Info />
      <Footer />
    </>
  );
}
```

Update the gallery route in `LangLayout` to include `SEOHead`:

Replace `<Route path="/gallery" element={<Gallery />} />` with:

```tsx
<Route path="/gallery" element={<><SEOHead page="gallery" /><Gallery /></>} />
```

- [ ] **Step 3: Verify the app builds and SEOHead renders**

```bash
npm start
```

Test manually:
- Navigate to `/it/` — inspect `<head>`: should see Italian title, description, canonical, hreflang tags, OG tags
- Navigate to `/en/` — should see English meta tags
- Navigate to `/en/gallery` — should see gallery-specific meta + ImageGallery JSON-LD
- Check `<html lang="...">` switches between `it` and `en`

- [ ] **Step 4: Commit**

```bash
git add src/components/SEOHead/SEOHead.tsx src/App.tsx
git commit -m "feat: add SEOHead component with per-route meta, hreflang, OG, and structured data"
```

---

### Task 5: Clean up index.html — remove meta tags moved to SEOHead, enrich JSON-LD

Remove `<title>`, description, OG, and Twitter meta from `index.html` (now handled by SEOHead). Add `sameAs`, `availableLanguage`, `hasMap`, `numberOfRooms` to the LodgingBusiness JSON-LD.

**Files:**
- Modify: `public/index.html`

- [ ] **Step 1: Update index.html**

Replace the entire file with:

```html
<!DOCTYPE html>
<html lang="it" translate="no">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3B4A2B" />
    <meta name="robots" content="index, follow" />
    <!-- Geo meta tags for local SEO -->
    <meta name="geo.region" content="IT-VA" />
    <meta name="geo.placename" content="Casorate Sempione" />
    <meta name="geo.position" content="45.5985;8.7572" />
    <meta name="ICBM" content="45.5985, 8.7572" />

    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet">
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>B&B Il Cortile — Bed and Breakfast vicino Malpensa</title>
    <meta name="description" content="B&B Il Cortile — Bed and Breakfast a Casorate Sempione, vicino all'aeroporto di Milano Malpensa. Camere confortevoli, parcheggio gratuito e navetta aeroportuale." />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "B&B Il Cortile",
      "description": "Bed and Breakfast a Casorate Sempione, a pochi minuti dall'aeroporto di Milano Malpensa. Camere confortevoli, parcheggio gratuito e servizio navetta aeroportuale.",
      "url": "https://www.ilcortilemalpensa.com",
      "telephone": "+393471106528",
      "email": "ilcortile@hotmail.it",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via Torino 63",
        "addressLocality": "Casorate Sempione",
        "addressRegion": "VA",
        "postalCode": "21011",
        "addressCountry": "IT"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.5985,
        "longitude": 8.7572
      },
      "image": "https://www.ilcortilemalpensa.com/og-image.jpg",
      "priceRange": "€€",
      "numberOfRooms": 2,
      "availableLanguage": ["Italian", "English"],
      "hasMap": "https://maps.app.goo.gl/zy4bpTwGeNBsN1PD6",
      "sameAs": [
        "https://www.booking.com/hotel/it/b-amp-b-il-cortile-malpensa.it.html",
        "https://maps.app.goo.gl/zy4bpTwGeNBsN1PD6"
      ],
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Parcheggio gratuito", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Wi-Fi gratuito", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Navetta aeroportuale", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Aria condizionata", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Colazione inclusa", "value": true }
      ],
      "checkinTime": "14:00",
      "checkoutTime": "10:30",
      "starRating": {
        "@type": "Rating",
        "ratingValue": "3"
      }
    }
    </script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

What was removed:
- All `<meta property="og:*">` tags (now in SEOHead)
- All `<meta name="twitter:*">` tags (now in SEOHead)

What stays as fallback (overridden by SEOHead at runtime, but needed for non-JS crawlers):
- `<title>` tag — Italian fallback title
- `<meta name="description">` — Italian fallback description

What was added to JSON-LD:
- `numberOfRooms`: 2
- `availableLanguage`: `["Italian", "English"]`
- `hasMap`: Google Maps link
- `sameAs`: Booking.com and Google Maps links

What stays:
- `lang="it"` on `<html>` as fallback (SEOHead overrides dynamically)
- Geo meta tags
- Font preconnects and stylesheets
- Manifest, favicon, apple-touch-icon
- JSON-LD structured data
- `robots` meta

- [ ] **Step 2: Verify the app renders correctly**

```bash
npm start
```

Navigate to `/it/` and `/en/` — check that:
- Title shows in browser tab (from SEOHead, not index.html)
- No duplicate meta tags in `<head>`

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: clean up index.html meta tags and enrich JSON-LD with business data"
```

---

### Task 6: Update Navbar language switcher and gallery link

The language switcher should navigate to the equivalent URL in the other language instead of just calling `i18n.changeLanguage()`. The gallery link needs the current lang prefix.

**Files:**
- Modify: `src/components/SideBar/SideBar.tsx`

- [ ] **Step 1: Update SideBar.tsx**

Add these imports at the top (alongside existing imports):

```tsx
import { useNavigate, useParams, useLocation } from 'react-router-dom';
```

Remove the existing import:
```tsx
// REMOVE this line if present — it's not currently imported, but verify
```

Inside the `Navbar` component, replace the language switcher logic. The key changes are:

1. Get `lang` from URL params and `navigate` from router:
```tsx
const { lang } = useParams<{ lang: string }>();
const navigate = useNavigate();
const location = useLocation();
```

2. Replace `onClickLanguageChange` with a function that navigates to the other language URL:
```tsx
const onClickLanguageChange = (newLang: string) => {
  const currentPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
  navigate(currentPath);
};
```

3. Update the gallery link in `LinkItems` to be dynamic. Replace the static `LinkItems` array with a computed one inside the component. The hash links (`#rooms`, etc.) need to point to the homepage when on the gallery page, otherwise they resolve to `/gallery#rooms` which doesn't exist:
```tsx
const linkItems: Array<LinkItemProps> = [
  { name: 'rooms', link: `/${lang}/#rooms` },
  { name: 'services', link: `/${lang}/#services` },
  { name: 'where', link: `/${lang}/#where` },
  { name: 'info', link: `/${lang}/#info` },
  { name: 'gallery', link: `/${lang}/gallery` },
];
```

4. Replace all references to `LinkItems` (capital L) with `linkItems` (lowercase l) throughout the component — in both the desktop nav links and the mobile drawer nav links.

5. Update the language flag active state checks from `i18n.language === "it"` to `lang === "it"` (and same for `"en"`) — this uses the URL as the source of truth.

6. In the mobile drawer, preserve the existing `onClose()` calls after language switching. The mobile drawer `onClick` handlers should call both `onClickLanguageChange` and `onClose()`:
```tsx
onClick={() => {
  onClickLanguageChange('it');
  onClose();
}}
```

- [ ] **Step 2: Verify navigation works**

```bash
npm start
```

Test:
- On `/it/` click the English flag → navigates to `/en/` and page switches to English
- On `/en/` click the Italian flag → navigates to `/it/` and page switches to Italian
- On `/it/` click "gallery" → navigates to `/it/gallery`
- On `/en/` click "gallery" → navigates to `/en/gallery`
- Mobile drawer: same tests

- [ ] **Step 3: Commit**

```bash
git add src/components/SideBar/SideBar.tsx
git commit -m "feat: update navbar language switcher to use URL navigation and prefix gallery link"
```

---

### Task 7: Update Gallery back button

The Gallery component uses `navigate(-1)` for the back button. This works but if someone lands directly on the gallery page (no history), it navigates away from the site. Update to navigate to the homepage in the current language.

**Files:**
- Modify: `src/components/Gallery/Gallery.tsx`

- [ ] **Step 1: Update Gallery.tsx**

Add `useParams` to the existing `react-router-dom` import:

```tsx
import { useNavigate, useParams } from 'react-router-dom';
```

Inside the `Gallery` component, get the lang param:

```tsx
const { lang } = useParams<{ lang: string }>();
```

Replace the back button `onClick`:

```tsx
onClick={() => navigate(`/${lang}/`)}
```

This replaces `navigate(-1)` so the back button always goes to the homepage in the current language.

- [ ] **Step 2: Verify**

```bash
npm start
```

Navigate to `/it/gallery` → click back arrow → should go to `/it/`. Same for `/en/gallery`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Gallery/Gallery.tsx
git commit -m "feat: update gallery back button to navigate to lang-prefixed homepage"
```

---

### Task 8: Update sitemap.xml with hreflang alternates

Replace the sitemap with all 4 URLs and proper hreflang annotations.

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Replace sitemap.xml**

Replace the entire file with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.ilcortilemalpensa.com/it/</loc>
    <lastmod>2026-03-26</lastmod>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="it" href="https://www.ilcortilemalpensa.com/it/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://www.ilcortilemalpensa.com/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ilcortilemalpensa.com/it/" />
  </url>
  <url>
    <loc>https://www.ilcortilemalpensa.com/en/</loc>
    <lastmod>2026-03-26</lastmod>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="it" href="https://www.ilcortilemalpensa.com/it/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://www.ilcortilemalpensa.com/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ilcortilemalpensa.com/it/" />
  </url>
  <url>
    <loc>https://www.ilcortilemalpensa.com/it/gallery</loc>
    <lastmod>2026-03-26</lastmod>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="it" href="https://www.ilcortilemalpensa.com/it/gallery" />
    <xhtml:link rel="alternate" hreflang="en" href="https://www.ilcortilemalpensa.com/en/gallery" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ilcortilemalpensa.com/it/gallery" />
  </url>
  <url>
    <loc>https://www.ilcortilemalpensa.com/en/gallery</loc>
    <lastmod>2026-03-26</lastmod>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="it" href="https://www.ilcortilemalpensa.com/it/gallery" />
    <xhtml:link rel="alternate" hreflang="en" href="https://www.ilcortilemalpensa.com/en/gallery" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ilcortilemalpensa.com/it/gallery" />
  </url>
</urlset>
```

- [ ] **Step 2: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: update sitemap with all language URLs and hreflang alternates"
```

---

### Task 9: Create vercel.json for SPA rewrites

Ensure all routes are served by `index.html` so React Router can handle them.

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json at project root**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: add vercel.json with SPA rewrite rule"
```

---

### Task 10: Final verification

Run a full build and verify everything works together.

**Files:** None (verification only)

- [ ] **Step 1: Build the app**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Serve the build locally and test**

```bash
npx serve -s build
```

Test all routes:
- `/` → redirects to `/it/`
- `/it/` → Italian homepage with correct meta tags
- `/en/` → English homepage with correct meta tags
- `/it/gallery` → Italian gallery with gallery-specific meta
- `/en/gallery` → English gallery with gallery-specific meta
- `/gallery` → redirects to `/it/gallery`
- `/fr/` → redirects to `/it/`
- `/it/nonexistent` → redirects to `/it/`

For each page, verify in browser DevTools (`<head>` inspection):
- `<html lang>` matches current language
- `<title>` is correct for the page and language
- `<meta name="description">` is correct
- `<link rel="canonical">` points to the current URL
- hreflang `<link>` tags present (it, en, x-default)
- OG and Twitter meta tags present and correct
- BreadcrumbList JSON-LD present
- ImageGallery JSON-LD present on gallery pages only
- LodgingBusiness JSON-LD in index.html has `sameAs`, `numberOfRooms`, etc.
- No duplicate meta tags

- [ ] **Step 3: Test language switching**

On `/it/`:
- Click English flag → URL changes to `/en/`, page content switches to English, meta tags update
- Click Italian flag → URL changes to `/it/`, everything reverts

On `/en/gallery`:
- Click Italian flag → URL changes to `/it/gallery`, meta tags update
- Click back button → goes to `/it/`

- [ ] **Step 4: Validate sitemap**

Open `build/sitemap.xml` and verify it contains all 4 URLs with hreflang alternates.

- [ ] **Step 5: Validate structured data**

Copy the built `index.html` JSON-LD and test it at https://validator.schema.org/ — verify LodgingBusiness with the new fields parses correctly.
