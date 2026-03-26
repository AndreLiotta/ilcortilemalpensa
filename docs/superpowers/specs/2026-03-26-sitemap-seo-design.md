# Sitemap & SEO Improvements — Il Cortile B&B

## Overview

Comprehensive SEO overhaul for the Il Cortile B&B website (ilcortilemalpensa.com). The site is a React CRA app hosted on Vercel with two pages (homepage and gallery) and Italian/English translations via i18next. Currently, language is detected from the browser with no URL differentiation, meaning Google can only index one language version.

## Goals

- Add language-prefixed URLs so both Italian and English pages are independently indexable
- Add per-route, per-language meta tags (title, description, OG, Twitter)
- Add hreflang tags to signal language variants to search engines
- Improve sitemap with all URLs, hreflang alternates, and lastmod dates
- Enrich structured data (JSON-LD) with business links and additional properties
- Add BreadcrumbList and ImageGallery structured data

## Route Structure

### New routes

| URL | Description |
|-----|-------------|
| `/` | Redirects to `/it/` |
| `/gallery` | Redirects to `/it/gallery` |
| `/it/` | Italian homepage |
| `/en/` | English homepage |
| `/it/gallery` | Italian gallery |
| `/en/gallery` | English gallery |

### Behavior

- `/:lang` prefix on all routes. `lang` is validated against `["it", "en"]`.
- Invalid lang values redirect to `/it/`.
- The `lang` URL param becomes the source of truth for i18next language (replaces browser detection).
- Root `/` redirects to `/it/` (Italian is the default — primary audience is Italian).
- Old `/gallery` URL redirects to `/it/gallery` for backwards compatibility.

### Implementation

- `App.tsx`: restructure routes with `/:lang` prefix. Add `<Navigate>` for `/` → `/it/` and `/gallery` → `/it/gallery`.
- Create a wrapper component or effect that reads `:lang` from URL params and calls `i18next.changeLanguage(lang)`.
- `i18n.tsx`: remove `i18next-browser-languagedetector` and browser detection config. Language is set from URL only.
- All internal links (navbar, footer, gallery links) must include the current lang prefix.

## SEOHead Component

A new `src/components/SEOHead/SEOHead.tsx` component using `react-helmet-async` that renders all `<head>` tags per route and per language.

### Responsibilities

- **Title**: per-route, per-language page titles
- **Meta description**: per-route, per-language descriptions
- **Canonical URL**: based on current lang + route
- **hreflang links**: alternate language versions + x-default
- **Open Graph tags**: title, description, url, image, locale (switches between `it_IT` and `en_GB`)
- **Twitter Card tags**: title, description, image
- **BreadcrumbList JSON-LD**: per-route breadcrumbs
- **ImageGallery JSON-LD**: on gallery page only

### Meta content by route

**Homepage (`/:lang/`):**
- IT title: "B&B Il Cortile — Bed and Breakfast vicino Malpensa"
- EN title: "B&B Il Cortile — Bed and Breakfast near Malpensa"
- IT description: "Bed and Breakfast a Casorate Sempione, a pochi minuti dall'aeroporto di Milano Malpensa. Camere confortevoli, parcheggio gratuito e servizio navetta aeroportuale."
- EN description: "Bed and Breakfast in Casorate Sempione, just minutes from Milan Malpensa Airport. Comfortable rooms, free parking and airport shuttle service."

**Gallery (`/:lang/gallery`):**
- IT title: "Galleria Fotografica — B&B Il Cortile Malpensa"
- EN title: "Photo Gallery — B&B Il Cortile Malpensa"
- IT description: "Scopri le foto delle camere e degli spazi del B&B Il Cortile a Casorate Sempione, vicino all'aeroporto di Malpensa."
- EN description: "Browse photos of rooms and spaces at B&B Il Cortile in Casorate Sempione, near Malpensa Airport."

### hreflang tags (on every page)

```html
<link rel="alternate" hreflang="it" href="https://www.ilcortilemalpensa.com/it/{path}" />
<link rel="alternate" hreflang="en" href="https://www.ilcortilemalpensa.com/en/{path}" />
<link rel="alternate" hreflang="x-default" href="https://www.ilcortilemalpensa.com/it/{path}" />
```

## Sitemap

Replace `public/sitemap.xml` with a version that lists all 4 URLs with hreflang alternates:

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

## robots.txt

No changes needed. Already allows all crawlers and references sitemap.

## Structured Data Enhancements

### Enrich existing LodgingBusiness JSON-LD in index.html

Add these fields to the existing schema:

```json
{
  "sameAs": [
    "https://www.booking.com/hotel/it/b-amp-b-il-cortile-malpensa.it.html",
    "https://maps.app.goo.gl/zy4bpTwGeNBsN1PD6"
  ],
  "availableLanguage": ["Italian", "English"],
  "hasMap": "https://maps.app.goo.gl/zy4bpTwGeNBsN1PD6",
  "numberOfRooms": 2
}
```

### BreadcrumbList JSON-LD (rendered by SEOHead)

Homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilcortilemalpensa.com/{lang}/" }
  ]
}
```

Gallery:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.ilcortilemalpensa.com/{lang}/" },
    { "@type": "ListItem", "position": 2, "name": "Gallery", "item": "https://www.ilcortilemalpensa.com/{lang}/gallery" }
  ]
}
```

### ImageGallery JSON-LD (gallery page only, rendered by SEOHead)

```json
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "B&B Il Cortile — Photo Gallery",
  "description": "Photos of rooms and spaces at B&B Il Cortile near Malpensa Airport",
  "url": "https://www.ilcortilemalpensa.com/{lang}/gallery"
}
```

## Vercel Configuration

Create `vercel.json` at project root for redirect handling:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Note: The in-app `<Navigate>` components handle the `/` → `/it/` and `/gallery` → `/it/gallery` redirects at the React Router level. The Vercel rewrite ensures all routes are served by the SPA.

## Dependencies

### Added
- `react-helmet-async` — per-route `<head>` tag management

### Removed
- `i18next-browser-languagedetector` — no longer needed (URL is language source of truth)

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/App.tsx` | Modified | New `/:lang` route structure with redirects |
| `src/i18n.tsx` | Modified | Remove browser detection, simplify config |
| `src/components/SEOHead/SEOHead.tsx` | Created | Per-route meta, hreflang, canonical, OG, structured data |
| `src/components/CanonicalTag.tsx` | Deleted | Replaced by SEOHead |
| `public/index.html` | Modified | Remove dynamic meta (moved to SEOHead), enrich JSON-LD |
| `public/sitemap.xml` | Modified | All 4 URLs with hreflang alternates and lastmod |
| `vercel.json` | Created | SPA rewrite rule |
| Navbar/Footer/Gallery components | Modified | Internal links prefixed with current lang |
