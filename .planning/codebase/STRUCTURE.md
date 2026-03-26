# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```
ilcortilemalpensa/
├── public/                 # Static assets served by CRA
│   ├── index.html          # HTML shell with structured data
│   ├── logo.png            # Favicon / touch icon
│   ├── og-image.jpg        # Open Graph share image
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt          # Crawler directives
│   └── sitemap.xml         # XML sitemap
├── src/
│   ├── assets/             # Images (room photos, logos, flags, maps)
│   │   └── Gallery/        # Garden/exterior photos for gallery page
│   ├── components/         # All UI components (section-per-folder)
│   │   ├── Carousel/       # react-slick image carousel wrapper
│   │   ├── Footer/         # Site footer with contacts + legal
│   │   ├── Gallery/        # Gallery page (grid of photos)
│   │   ├── Hero/           # Hero section (full-viewport background)
│   │   ├── Info/           # Contact info section
│   │   ├── RoomCard/       # Room preview card with modal
│   │   ├── Rooms/          # Rooms section
│   │   ├── SEOHead/        # Per-page meta tags via Helmet
│   │   ├── Services/       # Services grid section
│   │   ├── SideBar/        # Navigation bar (desktop + mobile drawer)
│   │   └── Where/          # Location/map section
│   ├── Translation/        # i18next translation JSON files
│   │   ├── English/
│   │   │   └── translation.json
│   │   └── Italian/
│   │       └── translation.json
│   ├── App.tsx             # Root component with routing
│   ├── Colors.tsx          # Design tokens (colors + fonts)
│   ├── i18n.tsx            # i18next configuration
│   ├── index.tsx           # React DOM entry point
│   ├── types.d.ts          # Global type declarations
│   ├── react-app-env.d.ts  # CRA type references
│   ├── reportWebVitals.ts  # Web vitals reporting (CRA default)
│   ├── serviceWorker.ts    # Service worker (unregistered)
│   ├── setupTests.ts       # Test setup
│   ├── test-utils.tsx      # Test utilities
│   ├── App.test.tsx        # App component test
│   ├── Logo.tsx            # Logo component (unused in current app)
│   ├── ColorModeSwitcher.tsx # Dark mode switcher (unused in current app)
│   └── logo.svg            # CRA default logo (unused)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config (SPA rewrites)
└── .gitignore              # Git ignore rules
```

## Directory Purposes

**`public/`:**
- Purpose: Static files served directly without webpack processing
- Contains: HTML shell, favicons, SEO files (sitemap, robots), OG image
- Key files: `public/index.html` (contains JSON-LD LodgingBusiness schema)

**`src/components/`:**
- Purpose: All React UI components, organized one-folder-per-component
- Contains: `.tsx` component file + `.css` companion file per component
- Key files: Each folder has a single main component file matching the folder name

**`src/assets/`:**
- Purpose: Static images bundled by webpack
- Contains: Room photos (`double*.jpg`, `family*.jpg`), hero image, logos, map images, flag SVGs, privacy PDFs
- Key files: `HeroImg.jpg`, `logo.png`, `logo-light.png`, `mapimage.png`

**`src/assets/Gallery/`:**
- Purpose: Garden/exterior photos used only on the gallery page
- Contains: `giardino2.jpg` through `giardino9.jpg`

**`src/Translation/`:**
- Purpose: i18next translation files for Italian and English
- Contains: One `translation.json` per language
- Key files: `src/Translation/Italian/translation.json`, `src/Translation/English/translation.json`

## Key File Locations

**Entry Points:**
- `src/index.tsx`: React DOM root creation and app render
- `src/App.tsx`: Root component with HelmetProvider, BrowserRouter, and all route definitions
- `src/i18n.tsx`: i18next initialization (imported as side-effect in index.tsx)
- `public/index.html`: HTML shell with Google Fonts, Mapbox CSS, and JSON-LD structured data

**Configuration:**
- `package.json`: Dependencies, scripts (`start`, `build`, `test`, `eject`), ESLint config
- `tsconfig.json`: TypeScript strict mode, ES5 target, react-jsx
- `vercel.json`: SPA catch-all rewrite to `index.html`

**Core Logic:**
- `src/App.tsx`: Routing, language validation, page composition
- `src/Colors.tsx`: All design tokens (6 colors + 2 fonts)
- `src/i18n.tsx`: i18next setup with URL-based language detection

**Section Components (homepage order):**
- `src/components/Hero/Hero.tsx`: Full-viewport hero with background image
- `src/components/Rooms/Rooms.tsx`: Room cards section
- `src/components/Services/Services.tsx`: Services grid with animations
- `src/components/Where/Where.tsx`: Location info with static map image
- `src/components/Info/Info.tsx`: Contact buttons (email, phone, WhatsApp)
- `src/components/Footer/Footer.tsx`: Site footer

**Standalone Pages:**
- `src/components/Gallery/Gallery.tsx`: Photo gallery page (separate route)

**Reusable Components:**
- `src/components/RoomCard/RoomCard.tsx`: Clickable room card with modal
- `src/components/Carousel/Carousel.tsx`: react-slick image carousel
- `src/components/SEOHead/SEOHead.tsx`: Per-page SEO meta tags
- `src/components/SideBar/SideBar.tsx`: Navigation bar (desktop top bar + mobile hamburger drawer)

**Testing:**
- `src/App.test.tsx`: Single test file
- `src/setupTests.ts`: Jest/testing-library setup
- `src/test-utils.tsx`: Test utilities

## Naming Conventions

**Files:**
- Components: PascalCase matching folder name (e.g., `Hero/Hero.tsx`, `RoomCard/RoomCard.tsx`)
- CSS: Varies — some match component (`Hero.css`, `Gallery.css`), some differ (`SideBar/Sidebar.css`)
- Assets: camelCase for room photos (`doubleRoom.jpg`, `family1.jpg`), PascalCase for others (`HeroImg.jpg`)
- Translations: lowercase directory names (`English/`, `Italian/`) with `translation.json`

**Directories:**
- Components: PascalCase (`Hero/`, `RoomCard/`, `SideBar/`)
- Other: PascalCase for `Translation/`, `Gallery/` (under assets)

**Exports:**
- Components use default exports: `export default function ComponentName()`
- Colors use named exports: `export const headings = "..."`

## Where to Add New Code

**New Homepage Section:**
- Create folder: `src/components/SectionName/`
- Create files: `SectionName.tsx` + `SectionName.css`
- Add to homepage in `src/App.tsx` inside `HomePage()` function, between existing sections
- Add anchor `id` attribute on root element for navbar linking
- Add navbar link in `src/components/SideBar/SideBar.tsx` `linkItems` array
- Add translation keys in both `src/Translation/Italian/translation.json` and `src/Translation/English/translation.json`

**New Page (separate route):**
- Create component in `src/components/PageName/PageName.tsx`
- Add route in `src/App.tsx` inside `LangLayout`'s `<Routes>` block
- Add SEO data in `src/components/SEOHead/SEOHead.tsx` `seoData` object
- Add `<SEOHead page="pagename" />` to the route element

**New Design Token:**
- Add to `src/Colors.tsx` as a named export

**New Translation Key:**
- Add key to both `src/Translation/Italian/translation.json` and `src/Translation/English/translation.json`

**New Image Asset:**
- Place in `src/assets/` (or `src/assets/Gallery/` for gallery photos)
- Import statically in the component that uses it

**New Shared Component:**
- Create folder: `src/components/ComponentName/`
- Follow existing pattern: single `.tsx` file + optional `.css` file

## Special Directories

**`build/`:**
- Purpose: CRA production build output
- Generated: Yes (via `npm run build`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: Project planning and analysis documents
- Generated: No (manually created)
- Committed: Not yet (currently untracked)

**`docs/`:**
- Purpose: Documentation and specs
- Generated: No
- Committed: Partially (some files untracked)

---

*Structure analysis: 2026-03-26*
