# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- TypeScript 4.9.5 - All application code (`src/**/*.tsx`, `src/**/*.ts`)

**Secondary:**
- CSS - Font declarations (`src/components/Fonts.css`)
- HTML - Single-page app shell (`public/index.html`)
- JSON - Translation files (`src/Translation/English/translation.json`, `src/Translation/Italian/translation.json`)

## Runtime

**Environment:**
- Node.js v20.x (v20.19.0 detected on dev machine)
- Browser target: ES5 (per `tsconfig.json` `"target": "es5"`)

**Package Manager:**
- npm 10.x (10.8.2 detected)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.2.x (`react`, `react-dom`) - UI framework
- Chakra UI v2.5.1 (`@chakra-ui/react`) - Component library and styling system
- React Router v6.9.0 (`react-router-dom`) - Client-side routing with language-prefixed URLs

**Internationalization:**
- i18next 22.4.10 (`i18next`) - Translation engine
- react-i18next 12.2.0 (`react-i18next`) - React bindings for i18next

**Build/Dev:**
- Create React App 5.0.1 (`react-scripts`) - Build toolchain (Webpack, Babel, dev server)

**Testing:**
- Jest (bundled with react-scripts) - Test runner
- React Testing Library 13.4.0 (`@testing-library/react`) - Component testing
- jest-dom 5.16.5 (`@testing-library/jest-dom`) - DOM matchers

## Key Dependencies

**Critical (UI & Interaction):**
- `@chakra-ui/react` ^2.5.1 - Primary UI component library (Flex, Text, Image, Button, Box, Drawer, etc.)
- `@chakra-ui/icons` ^2.0.17 - Chakra icon set
- `@emotion/react` ^11.10.6 - CSS-in-JS runtime (Chakra UI peer dependency)
- `@emotion/styled` ^11.10.6 - Styled components (Chakra UI peer dependency)
- `framer-motion` ^6.5.1 - Animation library (Chakra UI peer dependency, used for transitions)
- `react-slick` ^0.29.0 - Carousel/slider for room image galleries
- `react-in-viewport` ^1.0.0-alpha.29 - Viewport detection for scroll-triggered animations

**Secondary (UI):**
- `@mui/material` ^5.11.10 - Material UI (used alongside Chakra, likely for specific components)
- `@mui/icons-material` ^5.11.9 - Material UI icons
- `react-icons` ^3.11.0 - Additional icon library

**SEO & Meta:**
- `react-helmet-async` ^3.0.0 - Dynamic `<head>` management for SEO meta tags

**Maps:**
- `mapbox-gl` ^2.13.0 - Mapbox GL JS (CSS loaded in `public/index.html`)
- `react-map-gl` ^7.0.21 - React wrapper for Mapbox GL

**Monitoring:**
- `web-vitals` ^2.1.4 - Core Web Vitals measurement (`src/reportWebVitals.ts`)

**Dev Dependencies:**
- `@types/react-slick` ^0.23.10 - TypeScript types for react-slick
- `@types/react` ^18.0.28 - React type definitions
- `@types/react-dom` ^18.0.11 - ReactDOM type definitions
- `@types/jest` ^28.1.8 - Jest type definitions
- `@types/node` ^12.20.55 - Node.js type definitions

## Configuration

**TypeScript (`tsconfig.json`):**
- Strict mode: enabled
- Target: ES5
- Module: ESNext
- JSX: react-jsx
- Module resolution: Node
- Custom type roots: `types.d.ts`

**ESLint:**
- Configured inline in `package.json`: `"extends": "react-app"` (CRA default)
- No standalone ESLint config file

**Browserslist (`package.json`):**
- Production: `>0.2%`, `not dead`, `not op_mini all`
- Development: Last 1 version of Chrome, Firefox, Safari

**No additional config files detected:**
- No `.prettierrc`, `.eslintrc`, `babel.config`, or standalone build configs
- Build configuration is managed entirely by CRA (react-scripts)

## Platform Requirements

**Development:**
- Node.js >= 16 (CRA 5 requirement; v20.x recommended)
- npm (package-lock.json present)
- No `.nvmrc` file

**Production:**
- Static SPA deployed to Vercel
- `vercel.json` configures SPA fallback: all routes rewrite to `/index.html`
- Domain: `www.ilcortilemalpensa.com`

**Build Output:**
- `react-scripts build` produces static files in `/build` directory
- Output is gitignored

---

*Stack analysis: 2026-03-26*
