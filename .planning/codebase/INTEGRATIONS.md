# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

**Maps:**
- Mapbox GL JS - Interactive map display for B&B location
  - SDK/Client: `mapbox-gl` ^2.13.0, `react-map-gl` ^7.0.21
  - CSS: Loaded from CDN in `public/index.html` (`https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css`)
  - Auth: Requires Mapbox access token (likely via environment variable; no `.env` files committed)
  - Note: The `Where` component (`src/components/Where/Where.tsx`) currently uses a static map image instead of the interactive Mapbox component, but the dependency is still installed

**Google Maps:**
- External link to Google Maps for directions: `https://goo.gl/maps/ybBDCuyTGoUn93GW6`
  - Used in: `src/components/Where/Where.tsx` (openInMaps function)
  - No API key required (simple link, not embedded)

## Fonts (External CDN)

**Google Fonts:**
- DM Serif Display - Display/heading font
  - Loaded in: `public/index.html` via `fonts.googleapis.com`
  - Preconnect configured for `fonts.googleapis.com` and `fonts.gstatic.com`
- Source Sans 3 - Body text font
  - Loaded in: `public/index.html` via `fonts.googleapis.com`
  - Weights: 300, 400, 600, 700 (normal + italic 400, 600)

## Data Storage

**Databases:**
- None - This is a static informational website with no backend

**File Storage:**
- Local filesystem only - All images bundled in `src/assets/`
- Room photos: `src/assets/double*.jpg`, `src/assets/family*.jpg`
- Gallery images: `src/assets/Gallery/`
- Map images: `src/assets/mapimage.png`, `src/assets/mapimage-mobile.png`
- Static assets in `public/`: `logo.png`, `og-image.jpg`

**Caching:**
- Browser caching only (Vercel default headers)
- Service worker available but unregistered (`src/serviceWorker.ts` - `unregister()` called)

## Authentication & Identity

**Auth Provider:**
- None - Public informational website with no user accounts

## SEO & Structured Data

**Schema.org JSON-LD:**
- LodgingBusiness schema in `public/index.html` with business details (address, geo, amenities, check-in/out times)
- BreadcrumbList schema generated dynamically in `src/components/SEOHead/SEOHead.tsx`
- ImageGallery schema for gallery page in `src/components/SEOHead/SEOHead.tsx`

**Open Graph & Twitter Cards:**
- Configured per-page in `src/components/SEOHead/SEOHead.tsx`
- OG image: `https://www.ilcortilemalpensa.com/og-image.jpg`
- Locale support: `it_IT` and `en_GB` with alternates

**Sitemap & Robots:**
- `public/sitemap.xml` - Static sitemap
- `public/robots.txt` - Allows all crawlers, references sitemap URL

**Geo Meta Tags:**
- Region: IT-VA (Varese province)
- Place: Casorate Sempione
- Coordinates: 45.5985, 8.7572

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated

**Performance Monitoring:**
- Web Vitals (`src/reportWebVitals.ts`) - CLS, FID, FCP, LCP, TTFB
  - Currently configured but no reporting endpoint (logs to console only if callback provided)
  - Not actively sending data anywhere

**Analytics:**
- None detected - No Google Analytics, Plausible, or other analytics service

## CI/CD & Deployment

**Hosting:**
- Vercel - Static site hosting
  - Config: `vercel.json` with SPA rewrite rule (`/(.*) -> /index.html`)
  - Domain: `www.ilcortilemalpensa.com`

**CI Pipeline:**
- None detected - No GitHub Actions, Vercel build hooks, or CI config files
- Likely relies on Vercel's automatic GitHub integration for deploys

**Build Command:**
- `react-scripts build` (standard CRA build)

## Environment Configuration

**Required env vars:**
- Mapbox access token (if interactive map is re-enabled) - var name not confirmed, no `.env` files committed

**Secrets location:**
- No `.env` files in repository (gitignored)
- Likely managed via Vercel environment variables dashboard

## External Links (Outbound)

**Booking Platforms:**
- Booking.com: Referenced in JSON-LD `sameAs` (`https://www.booking.com/hotel/it/b-amp-b-il-cortile-malpensa.it.html`)

**Contact:**
- Phone: +393471106528 (in JSON-LD schema)
- Email: ilcortile@hotmail.it (in JSON-LD schema)

**Maps:**
- Google Maps: `https://maps.app.goo.gl/zy4bpTwGeNBsN1PD6` (in JSON-LD and Where component)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-03-26*
