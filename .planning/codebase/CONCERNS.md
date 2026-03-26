# Codebase Concerns

**Analysis Date:** 2026-03-26

## Tech Debt

**Create React App (CRA) is deprecated:**
- Issue: The project uses `react-scripts@5.0.1` (Create React App) which has been officially deprecated since early 2025. It no longer receives security patches, dependency updates, or bug fixes.
- Files: `package.json`
- Impact: Growing vulnerability surface, inability to use modern build features (faster HMR, ESM-native builds), increasingly difficult dependency upgrades. CRA bundles everything into a single JS chunk (727KB unminified main bundle) with no code splitting.
- Fix approach: Migrate to Vite. The codebase is small enough (~2100 lines of TS/TSX) that migration would be straightforward. Replace `react-scripts` with `vite` + `@vitejs/plugin-react`, convert `index.html` to Vite format, update scripts in `package.json`.

**Dual UI library dependencies (Chakra UI + MUI):**
- Issue: Both `@chakra-ui/react@^2.5.1` and `@mui/material@^5.11.10` are installed. MUI is used solely for icon imports across 4 components. This pulls in the entire MUI runtime (~300KB) for icons that could come from a lighter source.
- Files: `src/components/Services/Services.tsx`, `src/components/Footer/Footer.tsx`, `src/components/Gallery/Gallery.tsx`, `src/components/Info/Info.tsx`
- Impact: Significantly inflated bundle size. MUI icons are imported directly from individual modules (e.g., `@mui/icons-material/LocalParkingOutlined`) which helps tree-shaking, but the MUI core runtime is still bundled.
- Fix approach: Replace `@mui/icons-material` imports with `react-icons` (already a dependency) equivalents, then remove `@mui/material` and `@mui/icons-material` from `package.json`.

**Dead / boilerplate code from CRA scaffold:**
- Issue: `src/serviceWorker.ts` (146 lines), `src/reportWebVitals.ts`, `src/Logo.tsx`, `src/ColorModeSwitcher.tsx` are unused CRA boilerplate. The service worker is explicitly unregistered in `src/index.tsx` line 23.
- Files: `src/serviceWorker.ts`, `src/reportWebVitals.ts`, `src/Logo.tsx`, `src/ColorModeSwitcher.tsx`
- Impact: Confusing codebase, unnecessary code in bundle.
- Fix approach: Delete these files and remove their imports from `src/index.tsx`.

**`any` type usage in Gallery:**
- Issue: The `pictures` array in Gallery is typed as `any[]`, and the `renderPicOrTitle` function accepts `pic: any`.
- Files: `src/components/Gallery/Gallery.tsx` (lines 48, 135)
- Impact: No type safety for gallery picture data; refactoring errors would not be caught at compile time.
- Fix approach: Define a `GalleryItem` interface (e.g., `{ src: string; title: string; isPic: boolean }`) and use it for the array and function parameter.

**MUI icon type casting:**
- Issue: MUI icon components are force-cast to `IconType` (a react-icons type) to satisfy Chakra UI's `Icon` component `as` prop. This is a type-level hack.
- Files: `src/components/Services/Services.tsx` (lines 36-49), `src/components/Info/Info.tsx` (line 98)
- Impact: TypeScript cannot validate that MUI icons are compatible with the Chakra `Icon` component. If MUI or Chakra changes their icon API, the cast would silently mask errors.
- Fix approach: Switch to `react-icons` equivalents which are natively compatible with the `IconType` interface.

## Performance Bottlenecks

**45MB of unoptimized images bundled in src/assets:**
- Problem: 30 JPEG/PNG images totaling 45MB are statically imported in `src/assets/`. Many individual images are 1.5-3.3MB. CRA includes all statically imported images in the build output.
- Files: `src/assets/` (all .jpg and .png files), `src/components/Gallery/Gallery.tsx`, `src/components/Rooms/Rooms.tsx`
- Cause: Raw, uncompressed photos from camera. No image optimization pipeline. No lazy loading for gallery images. All 30 gallery images are imported eagerly at module level in `Gallery.tsx`.
- Improvement path: (1) Compress images to WebP format (target ~100-200KB each). (2) Use lazy loading for gallery images (e.g., `loading="lazy"` on `<Image>` tags). (3) Consider serving images from a CDN or using `srcSet` for responsive sizes. (4) For the hero image, use a blurred placeholder.

**No code splitting:**
- Problem: The entire app is a single JS bundle (727KB). Gallery page code and all 30 image imports load even when the user only visits the home page.
- Files: `src/App.tsx`
- Cause: CRA with no `React.lazy()` usage. All routes are eagerly imported.
- Improvement path: Use `React.lazy()` and `Suspense` for the `Gallery` component in `src/App.tsx`. This would defer loading ~30 image imports until the gallery route is visited.

**MobileNav scroll handler re-registers on every render:**
- Problem: The `useEffect` in `MobileNav` has no dependency array, causing the scroll event listener to be removed and re-added on every single render cycle.
- Files: `src/components/SideBar/SideBar.tsx` (lines 235-243)
- Cause: Missing dependency array in `useEffect`. The handler also creates a stale closure over `yOffset` state, which means scroll direction detection relies on re-rendering to get updated values.
- Improvement path: Add `[yOffset]` dependency array, or better, use a `useRef` to track the previous offset and add an empty `[]` dependency array.

**CDN stylesheet loaded inline in Carousel component:**
- Problem: Slick carousel CSS is loaded via `<link>` tags inside the component render, meaning stylesheets are fetched every time the Carousel mounts (inside room card modals).
- Files: `src/components/Carousel/Carousel.tsx` (lines 32-42)
- Cause: CSS for `react-slick` was not imported properly via the module system.
- Improvement path: Import slick CSS files at the app level: `import "slick-carousel/dist/slick.css"` and `import "slick-carousel/dist/slick-theme.css"` in `src/index.tsx`.

## Security Considerations

**External links open without `rel="noopener noreferrer"`:**
- Risk: `window.open()` calls in `src/components/Where/Where.tsx` (line 12), `src/components/Info/Info.tsx` (lines 19-25), and `src/components/Footer/Footer.tsx` (lines 16-22) open external URLs without security attributes. The Google Maps link in Footer uses `<Link href=...>` without `target="_blank"` protection attributes.
- Files: `src/components/Where/Where.tsx`, `src/components/Info/Info.tsx`, `src/components/Footer/Footer.tsx`
- Current mitigation: None.
- Recommendations: Add `rel="noopener noreferrer"` to all external `<Link>` components. For `window.open()` calls, these are generally safe from the opener vulnerability in modern browsers, but adding the `noopener` feature string is best practice.

**No Content Security Policy headers:**
- Risk: The app loads external CSS from `cdnjs.cloudflare.com` (slick carousel) without CSP headers, making it vulnerable to CDN compromise.
- Files: `src/components/Carousel/Carousel.tsx` (lines 32-42), `public/index.html`
- Current mitigation: None.
- Recommendations: Add CSP meta tag or configure CSP headers on Vercel. Preferably, bundle slick CSS locally instead of loading from CDN.

## Accessibility Gaps

**Language switcher flags have no keyboard support:**
- Problem: Language flags are `<Image>` elements with `onClick` handlers but no keyboard accessibility. They cannot be reached via Tab key and have no ARIA roles.
- Files: `src/components/SideBar/SideBar.tsx` (lines 121-141, 193-217)
- Fix: Wrap flag images in `<Button>` or add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers.

**Contact buttons in Info section are not semantic buttons:**
- Problem: Contact action elements (Email, Call, WhatsApp) are styled `<Flex>` containers with `onClick` handlers instead of `<Button>` elements. They are not keyboard focusable and have no ARIA labels.
- Files: `src/components/Info/Info.tsx` (lines 79-116)
- Fix: Replace `<Flex>` with `<Button>` components or add `role="button"`, `tabIndex={0}`, `aria-label`, and keyboard event handlers.

**RoomCard uses div-based click for modal trigger:**
- Problem: Room cards are `<Box>` elements with `onClick` to open modals. Not keyboard accessible, no focus indicator, no ARIA attributes.
- Files: `src/components/RoomCard/RoomCard.tsx` (lines 36-44)
- Fix: Use `<Button>` or add `role="button"`, `tabIndex={0}`, `aria-label`, and keyboard handlers.

**Gallery back button has no text label:**
- Problem: The back navigation icon in Gallery has no visible text and relies solely on the icon being recognizable.
- Files: `src/components/Gallery/Gallery.tsx` (lines 98-108)
- Fix: Add `aria-label` to the clickable `<Flex>` and convert to a `<Button>` element.

**No skip-to-content link:**
- Problem: The site has a fixed navigation bar but no skip-to-content link for keyboard and screen reader users.
- Files: `src/App.tsx`, `src/components/SideBar/SideBar.tsx`
- Fix: Add a visually-hidden skip link as the first focusable element in the page that jumps to `#rooms` or a `#main-content` landmark.

**Hero section scroll indicator is not accessible:**
- Problem: The chevron-down scroll indicator at the bottom of the hero has no semantic meaning, ARIA label, or keyboard interactivity.
- Files: `src/components/Hero/Hero.tsx` (lines 106-113)
- Fix: Either make it a button with `aria-label="Scroll to content"` or mark it as `aria-hidden="true"` since it is purely decorative.

## Dependencies at Risk

**Chakra UI v2 approaching end-of-life:**
- Risk: Chakra UI v2 (`@chakra-ui/react@^2.5.1`) is the legacy major version. Chakra UI v3 has been released with a significantly different API (Ark UI-based). v2 will eventually stop receiving patches.
- Impact: All UI components depend on Chakra v2. Migration to v3 would require rewriting most component props.
- Migration plan: Not urgent, but track Chakra v2 deprecation timeline. When migrating, consider if Chakra v3's API changes justify staying or switching to a different library.

**react-icons v3 is severely outdated:**
- Risk: `react-icons@^3.11.0` is installed. The current major version is v5. v3 is from 2020.
- Impact: Missing newer icon sets, potential security issues in transitive dependencies, incompatibility with newer React patterns.
- Migration plan: Upgrade to `react-icons@^5.x`. The API is largely the same; mostly a version bump in `package.json`.

**react-in-viewport alpha version:**
- Risk: `react-in-viewport@^1.0.0-alpha.29` is a pre-release alpha package.
- Impact: Unstable API, no SemVer guarantees, could break without notice.
- Migration plan: Replace with native `IntersectionObserver` API via a simple custom hook (~15 lines of code), or use a stable library like `react-intersection-observer`.

**framer-motion v6 is outdated:**
- Risk: `framer-motion@^6.5.1` is installed. Current version is v11+. The package has been renamed to `motion`.
- Impact: Missing performance improvements, bug fixes, and features from 5 major versions of updates.
- Migration plan: The codebase does not directly import framer-motion (it is used indirectly by Chakra UI v2). This dependency can be updated when Chakra is updated.

**TypeScript 4.x is outdated:**
- Risk: `typescript@^4.9.5` is installed. Current stable is TypeScript 5.7+. TS 4.x is no longer maintained.
- Impact: Missing type-narrowing improvements, `satisfies` operator, decorators, and other TS5 features.
- Migration plan: Upgrade to `typescript@^5.x` in `package.json`. No breaking changes expected for this codebase.

## Missing Critical Features

**No error boundary:**
- Problem: No React error boundary exists. If any component throws during render, the entire app crashes with a white screen.
- Blocks: Production reliability; users see nothing if a runtime error occurs.
- Fix: Add a top-level `ErrorBoundary` component wrapping the main routes in `src/App.tsx`.

**No loading states:**
- Problem: No loading indicators exist for image loading, route transitions, or initial app hydration. The hero image (1.6MB) loads without a placeholder.
- Blocks: Perceived performance; users may see layout shifts or blank areas while images load.

**No 404 page:**
- Problem: Unknown routes redirect silently to the home page via `<Navigate>` in `src/App.tsx` (line 60). There is no user-facing 404 page.
- Blocks: Users who mistype a URL get silently redirected with no feedback.

## Test Coverage Gaps

**Zero test coverage:**
- What's not tested: The entire application. The only test file (`src/App.test.tsx`) is completely commented out (all 10 lines).
- Files: `src/App.test.tsx`, `src/test-utils.tsx` (exists but unused)
- Risk: Any refactoring, dependency upgrade, or feature addition could introduce regressions with no automated detection. The SEO head component, i18n routing, language switching, and modal interactions are all untested.
- Priority: High. At minimum, add tests for: (1) routing and language redirect logic in `src/App.tsx`, (2) SEO metadata generation in `src/components/SEOHead/SEOHead.tsx`, (3) language switcher behavior in `src/components/SideBar/SideBar.tsx`.

## Fragile Areas

**i18n language sync between URL and i18n state:**
- Files: `src/App.tsx` (lines 19-30), `src/i18n.tsx` (lines 17-18)
- Why fragile: Language is detected from the URL at two different points: once during i18n initialization (`src/i18n.tsx` line 17-18) and again via `LangSync` component on every route change (`src/App.tsx` lines 19-30). These two mechanisms must stay in sync. If the URL detection regex in `i18n.tsx` diverges from `SUPPORTED_LANGS` in `App.tsx`, the wrong language could flash.
- Safe modification: Always update both `SUPPORTED_LANGS` in `App.tsx` and the language array in `i18n.tsx` when adding languages. Extract the supported languages list to a shared constant.
- Test coverage: None.

**Gallery data model mixes display logic with data:**
- Files: `src/components/Gallery/Gallery.tsx` (lines 48-78)
- Why fragile: The `pictures` array uses `isPic: boolean` to distinguish between section headers and images. This flat array structure means reordering or adding sections requires careful placement of `{ src: "", isPic: false }` sentinel objects.
- Safe modification: Restructure into nested sections: `{ title: string, images: string[] }[]`.
- Test coverage: None.

---

*Concerns audit: 2026-03-26*
