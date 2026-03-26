# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Client-side Single Page Application (SPA)

**Key Characteristics:**
- Create React App (CRA) with react-scripts 5.0.1
- Client-side routing with React Router v6 (BrowserRouter)
- Language-prefixed URL structure (`/:lang/*`) with IT/EN support
- No backend/API layer — all content is static (translations + images)
- Deployed to Vercel with SPA rewrite rule (`vercel.json`)
- SEO handled client-side via react-helmet-async

## Layers

**Routing Layer:**
- Purpose: URL-based language detection and page routing
- Location: `src/App.tsx`
- Contains: `App`, `LangLayout`, `LangSync`, `HomePage` components
- Depends on: react-router-dom, react-i18next
- Used by: Entry point (`src/index.tsx`)

**Presentation Layer (Page Sections):**
- Purpose: Render page content as vertically-stacked sections
- Location: `src/components/`
- Contains: Section components (Hero, Rooms, Services, Where, Info, Footer, Gallery)
- Depends on: Chakra UI, Colors module, i18next translations
- Used by: `HomePage` and `Gallery` route components in `src/App.tsx`

**Shared UI Layer:**
- Purpose: Reusable sub-components used across sections
- Location: `src/components/Carousel/`, `src/components/RoomCard/`
- Contains: Carousel (react-slick wrapper), RoomCard (image card with modal)
- Depends on: Chakra UI, react-slick
- Used by: Rooms section, Gallery page

**Design Tokens Layer:**
- Purpose: Centralized color palette and font definitions
- Location: `src/Colors.tsx`
- Contains: Named exports for colors (`headings`, `backgroundBrown`, `light`, `navBackground`, `accent`, `textColor`) and fonts (`displayFont`, `bodyFont`)
- Used by: Every component in the presentation layer

**Internationalization Layer:**
- Purpose: Italian/English translation management
- Location: `src/i18n.tsx`, `src/Translation/`
- Contains: i18next configuration, JSON translation files
- Depends on: i18next, react-i18next
- Used by: All components via `useTranslation()` hook

**SEO Layer:**
- Purpose: Per-page meta tags, Open Graph, structured data
- Location: `src/components/SEOHead/SEOHead.tsx`
- Contains: Helmet-based head management, JSON-LD schema generation
- Depends on: react-helmet-async, react-router-dom
- Used by: `HomePage` and Gallery route in `src/App.tsx`

## Data Flow

**Language Resolution:**

1. User navigates to URL (e.g., `/en/gallery`)
2. `src/i18n.tsx` reads `window.location.pathname` at module load to set initial i18next language (prevents flash)
3. `LangLayout` in `src/App.tsx` validates `:lang` param against `SUPPORTED_LANGS` array
4. `LangSync` component calls `i18n.changeLanguage()` via `useLayoutEffect` to sync router param with i18next
5. Invalid/missing lang redirects to `/it/` (Italian default)

**Language Switching:**

1. User clicks flag icon in `src/components/SideBar/SideBar.tsx`
2. `onClickLanguageChange()` replaces lang segment in URL path via `navigate()`
3. React Router re-renders `LangLayout` -> `LangSync` fires -> i18next language updates
4. All `useTranslation()` consumers re-render with new language

**Content Rendering:**

1. All text content comes from translation JSON files (`src/Translation/{lang}/translation.json`)
2. All images are statically imported as webpack assets (no CMS, no API calls)
3. Room images are defined as arrays in `src/components/Rooms/Rooms.tsx` and `src/components/Gallery/Gallery.tsx`
4. Components read design tokens directly from `src/Colors.tsx` named exports

**State Management:**
- No global state management library (no Redux, Zustand, etc.)
- i18next handles language state globally
- Component-local state only via `useState`:
  - `src/components/SideBar/SideBar.tsx`: scroll position (`scrolled`), mobile nav visibility (`visible`), drawer state (`useDisclosure`)
  - `src/components/Carousel/Carousel.tsx`: slider ref
  - `src/components/RoomCard/RoomCard.tsx`: modal open/close (`useDisclosure`)
  - `src/components/Services/Services.tsx`: viewport intersection tracking (`useInViewport`)

## Key Abstractions

**Section Component Pattern:**
- Purpose: Each homepage section is a self-contained component
- Examples: `src/components/Hero/Hero.tsx`, `src/components/Rooms/Rooms.tsx`, `src/components/Services/Services.tsx`, `src/components/Where/Where.tsx`, `src/components/Info/Info.tsx`
- Pattern: Full-width Flex container with `id` attribute for anchor navigation, imports own CSS file, uses `useTranslation()` for text, imports design tokens from `src/Colors.tsx`

**Decorative Section Title:**
- Purpose: Consistent section heading with accent lines
- Pattern: `<Flex alignItems="center" gap="4"><Box w="40px" h="1px" bg={accent} /><Text ...>{title}</Text><Box ... /></Flex>`
- Used in: Rooms, Services, Where, Info, Gallery section dividers

**RoomCard + Modal + Carousel Composition:**
- Purpose: Room preview card that opens a full-screen modal with image carousel
- Flow: `RoomCard` (clickable card) -> Chakra `Modal` -> `Carousel` (react-slick)
- Files: `src/components/RoomCard/RoomCard.tsx`, `src/components/Carousel/Carousel.tsx`

## Entry Points

**Application Entry:**
- Location: `src/index.tsx`
- Triggers: Browser loads `public/index.html` which mounts React
- Responsibilities: Creates React root, renders `<App />` in StrictMode with `ColorModeScript`

**i18n Initialization:**
- Location: `src/i18n.tsx`
- Triggers: Side-effect import in `src/index.tsx` (`import "./i18n"`)
- Responsibilities: Configures i18next with translation resources, detects initial language from URL path

**Router Root:**
- Location: `src/App.tsx` (`App` component)
- Triggers: Rendered by `src/index.tsx`
- Responsibilities: Wraps app in `HelmetProvider` + `BrowserRouter`, defines top-level routes

## Routing Structure

**Routes defined in `src/App.tsx`:**

| Path | Component | Behavior |
|------|-----------|----------|
| `/` | `Navigate` | Redirects to `/it/` |
| `/gallery` | `Navigate` | Redirects to `/it/gallery` |
| `/:lang/` | `HomePage` | Home page with all sections |
| `/:lang/gallery` | `Gallery` | Photo gallery page |
| `/:lang/*` | `Navigate` | Catch-all redirects to `/:lang/` |

**Anchor Navigation:**
- Sections use `id` attributes: `#rooms`, `#services`, `#where`, `#info`
- Navbar links use `href="/:lang/#section"` format for hash-based scrolling

## Error Handling

**Strategy:** Minimal — no error boundaries, no try/catch blocks

**Patterns:**
- Invalid language parameter redirects to `/it/` via `<Navigate>` in `LangLayout`
- Missing root element throws explicit error in `src/index.tsx`
- No API error handling (no API calls exist)

## Cross-Cutting Concerns

**Logging:** None. No logging framework or console logging in production code.

**Validation:** Language parameter validated against `SUPPORTED_LANGS` array in `src/App.tsx`. No form inputs exist.

**Authentication:** Not applicable. Public-facing website with no user accounts.

**SEO:**
- Static structured data (LodgingBusiness schema) in `public/index.html`
- Dynamic per-page meta tags via `src/components/SEOHead/SEOHead.tsx`
- `public/sitemap.xml` and `public/robots.txt` for crawlers
- hreflang tags for language alternates

**Animations:**
- CSS keyframe animations for hero fade-in (`src/components/Hero/Hero.css`)
- Viewport-triggered `ScaleFade` on service cards via `react-in-viewport` (`src/components/Services/Services.tsx`)
- Scroll-based navbar transitions (`src/components/SideBar/SideBar.tsx`)
- CSS hover effects on room cards and gallery items

---

*Architecture analysis: 2026-03-26*
