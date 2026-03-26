# UI Review: Il Cortile Malpensa

**Audited:** 2026-03-26
**Scope:** Full codebase audit — all components in `src/`
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md present)
**Screenshots:** Not captured — no dev server detected on ports 3000 or 5173

---

## Score Summary

| Pillar | Score | Rating |
|--------|-------|--------|
| Copywriting | 3/4 | Good |
| Visuals | 2/4 | Needs work |
| Color | 3/4 | Good |
| Typography | 3/4 | Good |
| Spacing | 3/4 | Good |
| Experience Design | 2/4 | Needs work |
| **Overall** | **16/24** | |

---

## Top Priority Fixes

1. **No image lazy loading on 45MB of assets** — Gallery page eagerly imports all 30 room and garden images at module load, adding several seconds to first load even for users who only visit the homepage. Fix: add `loading="lazy"` to all `<Image>` tags in `Gallery.tsx` and `RoomCard.tsx`, and use `React.lazy()` + `Suspense` for the Gallery route in `App.tsx`.

2. **Critical accessibility gaps on interactive elements** — Six interactive elements (language flags ×4, contact pill buttons ×3, room cards ×2, gallery back button ×1) are non-semantic click targets: no `role="button"`, no `tabIndex`, no `aria-label`, and no keyboard event handlers. This renders contact, navigation, and booking entry points completely unreachable for keyboard users and screen readers. Fix: replace `<Flex onClick>` and `<Image onClick>` with `<Button>` or add `role="button" tabIndex={0} aria-label="..." onKeyDown` on each.

3. **Hardcoded color values bypass the design token system in 6 locations** — `#FAF7F2` is hardcoded directly in `Hero.tsx:120`, `Rooms.tsx:61`, and `Where.tsx:24` instead of using the exported `backgroundBrown` token; `#b5633f` (the hover accent) appears in `Where.tsx:94` and `RoomCard.tsx:97` with no token; `#E8E3D8` (a border shade) is hardcoded in `Services.tsx:154` and `Gallery.tsx:96`. If the palette changes, these are easy to miss. Fix: add a `backgroundBrownHover` or `accentHover` and `borderLight` token to `Colors.tsx` and replace the inline values.

---

## Pillar Details

### 1. Copywriting (3/4)

**Strengths:**
- No generic labels ("Submit", "Click Here", "OK") found anywhere in the codebase. All CTAs are specific: `t("discover")` → "Scopri" / "See more", `t("openInMaps")` → "Vedi su Google Maps" / "Open in Google Maps".
- Italian translation is warm and authentic. Laura's personal intro (`t("intro")`) is a strong hospitality signal.
- Both languages have complete translation parity — all 43 keys are present in both `Italian/translation.json` and `English/translation.json`.
- SEO copy in `SEOHead.tsx` is well-crafted with location keywords and differentiators per language.
- Legal codes (RC, CIN, SC) are correctly localised in the footer.

**Issues:**
- `"outside"` key in `English/translation.json` (line 40) reads "Outsides" — an unnatural plural. The Italian "Esterni" is correct but the English form should be "Exterior" or "Outdoor areas".
- The English Borges quote (`translation.json` line 12) silently drops the attribution "(Borges)" that appears in the Italian version. The attribution is stripped rather than localised, making it appear as original prose.
- `Info.tsx:30` constructs the "Call" label with an inline language check (`i18n.language === "it" ? "Chiama" : "Call"`) instead of using the translation system. This bypasses i18n and would break if a third language were added.
- `Footer.tsx:179` contains hard-coded Italian text ("Sito realizzato da: Andrea Liotta") that is not wrapped in a translation key and will always display in Italian regardless of the selected language.
- The `t("whereText2")` key does not exist — the sequence jumps from `whereText1` to `whereText3` in both the code (`Where.tsx:62-73`) and both translation files, suggesting a paragraph was removed but the key numbering was not cleaned up.

---

### 2. Visuals (2/4)

**Strengths:**
- Section title pattern (accent lines flanking display-font heading) is visually distinctive and applied consistently across all six sections.
- Room cards use a background-image CSS technique that provides correct aspect ratio (`paddingBottom: "62.5%"`) without layout shift.
- Gallery images use an inline `style={{ aspectRatio: "4/3" }}` which correctly overrides Chakra's handling.
- Hero gradient overlay is responsive and appropriately deeper on mobile where text contrast is more critical.
- The mobile hero card (frosted glass with logo) is a thoughtful adaptation of the desktop full-screen title.

**Issues:**
- **45MB of unoptimised JPEG/PNG assets** — `HeroImg.jpg` is 1.6MB, `doubleRoom.jpg` is 1.4MB, `familyRoom.jpg` is 1.2MB. The `Gallery/` subdirectory alone is 18MB. There is zero image optimisation in the pipeline. Users on mobile connections will experience several seconds of blank space or layout shift before key images load.
  - File: `src/assets/` (all JPGs), `src/assets/Gallery/`
- **No lazy loading anywhere** — Neither `<Image loading="lazy">` nor `fetchPriority` is set on any image tag. All 30 gallery images are statically imported at the top of `Gallery.tsx` (lines 10-37), meaning they are bundled into the JS module and eagerly evaluated on every page load.
  - File: `Gallery.tsx:10-37`, `Rooms.tsx:6-23`
- **Gallery hover overlay is empty** — `GalleryPicture` renders a hover overlay `<Box className="gallery-overlay">` (Gallery.tsx:186-199) that fades in on hover but contains no content. The CSS class exists but the overlay shows a semi-transparent tint with nothing inside — no label, no expand icon, no affordance. Users get visual feedback that something is interactive but nothing happens on click.
  - File: `Gallery.tsx:186-199`
- **Carousel CSS loaded from CDN at runtime** — `Carousel.tsx:32-42` injects `<link>` stylesheet tags pointing to `cdnjs.cloudflare.com` inside the component render. This fires a network request every time a room modal opens, creating a flash of unstyled carousel dots/arrows.
- **No hero image placeholder** — The 1.6MB hero image loads with no blurred placeholder or background colour fallback, resulting in a blank dark area until the image arrives.

---

### 3. Color (3/4)

**Strengths:**
- A well-considered 5-token palette is centralised in `Colors.tsx`: olive headings (`#3B4A2B`), warm cream background (`#FAF7F2`), light beige (`#F0ECE3`), terracotta accent (`#C4724E`), and dark brown text (`#2D2A26`). The palette is contextually appropriate for an Italian countryside B&B.
- The 60/30/10 split is broadly respected: cream/beige backgrounds dominate, olive is used for headings and the navbar, terracotta is reserved for CTAs, active states, and decorative lines.
- Section alternation between `backgroundBrown` (#FAF7F2) and `light` (#F0ECE3) creates a subtle rhythm without introducing new colours.
- The dark olive footer provides a strong visual terminus and high contrast for light text.

**Issues:**
- **Hardcoded `#FAF7F2` in three components** — `Hero.tsx:120`, `Rooms.tsx:61`, and `Where.tsx:24` use the literal hex value instead of the `backgroundBrown` token.
- **Hardcoded hover accent in two components** — `Where.tsx:94` and `RoomCard.tsx:97` use `#b5633f` as the hover state of the accent button. This value is not defined anywhere as a token. If `accent` changes, the hover state becomes inconsistent.
- **Hardcoded border colour `#E8E3D8`** — appears in `Services.tsx:154` (service card border) and `Gallery.tsx:96` (gallery top bar border). This mid-tone beige is not in the token system.
- **Multiple `rgba(59, 74, 43, ...)` alpha variants** — The olive base (`headings: #3B4A2B`) is used at 0.5, 0.65, 0.7, and 0.92 opacity across `SideBar.tsx:80`, `SideBar.tsx:257`, `Hero.tsx:54`, `RoomCard.tsx:83`, and `Gallery.tsx:193`. Only the 0.92 variant is tokenised as `navBackground`. The others are inline values.
- **`white` used directly** — `Services.tsx:151` and `RoomCard.tsx:68` use Chakra's `"white"` string rather than a semantic token. Not a critical issue for a light-themed site but inconsistent with the rest of the token approach.

---

### 4. Typography (3/4)

**Font system:**
- Two fonts in use: `DM Serif Display` (display headings and UI chrome) and `Source Sans 3` (body and utility text). This is a restrained and appropriate pairing for a hospitality brand.
- Both fonts are loaded via Google Fonts in `public/index.html` — not font-display optimised but sufficient.

**Sizes in use (Chakra scale):**
- `xs` — footer legal text only (Footer.tsx:194)
- `sm` — service card body, footer links, info button labels
- `md` — body paragraphs (base breakpoint), discover button
- `lg` — body paragraphs (md breakpoint), nav links, where button
- `xl` — room card title overlay, modal price, footer column headers, mobile nav title
- `2xl` — mobile hero title, room card modal header (base), gallery section titles
- `3xl` — section titles (base), gallery page heading
- `4xl` — intro quote heading
- `5xl` — section titles (md breakpoint)
- `7xl` / `8xl` — desktop hero heading

This gives 10 distinct size steps — more than the 4-step maximum for clarity, though the extremes (xs, 7xl, 8xl) are each used in a single highly contextual location, which partially justifies the range.

**Issues:**
- `Services.tsx:163` uses `fontSize={{ base: "32", md: "40" }}` for the icon size on the `Icon` component. These are raw number strings passed to `fontSize`, not Chakra scale tokens (which would be `"2xl"` for 32px). This works via Chakra's pixel conversion but is inconsistent with the rest of the codebase's use of named scale tokens.
- No explicit `fontWeight` is set on most display text — it defaults to the font's own weight (400 for DM Serif Display). This is fine stylistically but `fontWeight="400"` is only explicitly set once (`Hero.tsx:138`), suggesting an inconsistent approach to weight declaration.
- Section headings use `displayFont` everywhere except one instance in `Where.tsx:90` where a `<Button>` uses `fontFamily={displayFont}` with `fontSize={{ base: "md", md: "lg" }}` — mixing the display font into body-sized text is slightly inconsistent with the rest of the system where display font is reserved for prominent headings.
- `lineHeight` values are not standardised via tokens: `1.1`, `1.2`, `1.6`, `1.8`, `2` appear across the codebase as raw numbers without a shared scale.

---

### 5. Spacing (3/4)

**Pattern:**
- Chakra numeric tokens are used consistently for all spacing: `px`, `py`, `gap`, `mb`, `mt`, `mr`, `p` values use Chakra's spacing scale (2, 3, 4, 5, 6, 8, 10, 12, 14, 20).
- Responsive spacing pattern is applied correctly throughout — `py={{ base: "12", md: "20" }}` is the standard section padding, creating a consistent vertical rhythm.
- Section max-widths are consistently capped at `maxW="1200px"` with `maxW="1000px"` for the services grid — logical and consistent.
- The `gap={{ base: "2", md: "4" }}` on the gallery grid is appropriately tight; `gap={{ base: "6", md: "8" }}` on room cards is appropriately generous.

**Issues:**
- `Info.tsx:46` adds a standalone `<Box w="60px" h="1px" bg={accent} mb="8" />` decorative divider *before* the section title, which already has its own flanking accent lines. This doubles up the decorative element and adds unexpected extra spacing above the heading compared to all other sections.
  - File: `Info.tsx:46`
- `Carousel.tsx:29` uses Chakra's T-shirt size `width={"4xl"}` on the carousel container. The `4xl` value in Chakra is `56rem` (896px) — this is a fixed width that may overflow on smaller viewports since no `maxW` or responsive override is present. On a 375px mobile screen inside a full-screen modal, the carousel will overflow horizontally.
  - File: `Carousel.tsx:27-30`
- `Where.tsx:62-63` uses a `<br />` inside a `<Text>` component to force a line break between two translation strings. This mixes layout concerns into the content layer and will produce an awkward mid-sentence break on wider viewports.
  - File: `Where.tsx:62`
- The footer uses `py={{ base: "8", md: "14" }}` while all content sections use `py={{ base: "12", md: "20" }}`. The tighter footer padding is arguably intentional but makes the footer feel compressed relative to the section rhythm above it.

---

### 6. Experience Design (2/4)

**Strengths:**
- Scroll-triggered `ScaleFade` animation on service cards (`Services.tsx:144`) provides a pleasant reveal. The `disconnectOnLeave: true` option correctly prevents re-triggering.
- Navbar transitions on scroll (transparent → solid, height reduction, shadow) are implemented cleanly with CSS transitions. The desktop and mobile navbars both respond.
- Mobile navigation is a full-screen drawer with large touch targets and correct close-on-link-click behaviour.
- React Router language-prefixed URL structure is cleanly implemented with redirect fallbacks.
- SEO layer is thorough: canonical URLs, hreflang alternates, Open Graph, Twitter Card, breadcrumb and gallery JSON-LD structured data.

**Issues:**
- **No loading states anywhere** — No skeleton, spinner, or placeholder exists for: the hero image (1.6MB), room modal opening, carousel images, or map images. Users see blank areas while images download.
  - Files: `Hero.tsx`, `RoomCard.tsx`, `Carousel.tsx`
- **No error boundary** — A single runtime error in any component will crash the entire application to a white screen. There is no fallback UI.
  - File: `App.tsx` (no `<ErrorBoundary>` wrapper)
- **MobileNav `useEffect` has no dependency array** (`SideBar.tsx:235-243`) — The scroll event listener is removed and re-added on every render cycle. The `yOffset` state value used inside `handleScroll` creates a stale closure, meaning scroll direction detection may lag or flicker during rapid scrolling.
  - File: `SideBar.tsx:235-243`
- **Language flag images are not keyboard accessible** — `<Image onClick>` elements at `SideBar.tsx:121-141` (desktop) and `SideBar.tsx:193-217` (mobile drawer) have no `role`, no `tabIndex`, and no `onKeyDown` handler. Language switching is inaccessible via keyboard.
- **Contact buttons are not semantic** — `Info.tsx:79-116` renders pill-shaped contact elements as `<Flex role="group">` with `onClick`. The `role="group"` is incorrect — it marks the element as a group container, not an interactive control. Correct usage is `role="button"` or a `<Button>` element. These elements are not keyboard-focusable.
- **Room cards and gallery back button not keyboard accessible** — `RoomCard.tsx:36-44` uses `<Box onClick={onOpen}>` with no keyboard affordance. `Gallery.tsx:98-108` uses `<Flex onClick={() => navigate(...)}>` with no button role or keyboard handler.
- **Carousel CSS served from CDN** — `Carousel.tsx:32-42` injects CDN stylesheet `<link>` tags inside the render tree. If the CDN is unavailable, carousel dots and navigation arrows will be unstyled. No CSP policy is configured to protect against CDN compromise.
- **No 404 page** — Unknown routes silently redirect to the homepage via `App.tsx:60`. Users who bookmark or mistype a URL receive no feedback.
- **`react-in-viewport` is an alpha package** (`^1.0.0-alpha.29`) — No SemVer guarantees; could break on patch update. Replace with native `IntersectionObserver` or the stable `react-intersection-observer` package.
- **Gallery hover overlay has no action** — `GalleryPicture` renders a hover overlay that fades in but does nothing on click. Users get a visual affordance with no reward — no lightbox, no fullscreen view, nothing. Either add a lightbox/expand action or remove the hover overlay entirely.
  - File: `Gallery.tsx:186-199`

---

## Additional Recommendations

**Performance:**
- Migrate from Create React App to Vite. CRA is deprecated, produces a 727KB single-bundle with no code splitting, and receives no security updates. The codebase is small enough (~2100 lines) for a one-day migration.
- Convert all JPEG assets to WebP at 80-85% quality. Target 100-200KB per image. The current 45MB asset directory is the largest single performance liability.
- Use `React.lazy()` + `Suspense` for the Gallery route in `App.tsx` to defer loading all 30 gallery image imports until the gallery is visited.
- Replace CDN slick-carousel CSS with local npm imports (`import "slick-carousel/slick/slick.css"`) at the `index.tsx` level.

**Accessibility:**
- Add a skip-to-content link as the first focusable element in the page (`<a href="#rooms" className="sr-only">Skip to content</a>`).
- Mark the scroll indicator chevron in `Hero.tsx:106-113` as `aria-hidden="true"` since it is purely decorative.
- Add `rel="noopener noreferrer"` to all `window.open()` calls in `Where.tsx:12`, `Info.tsx:18-25`, and `Footer.tsx:16-22`.

**Code quality:**
- Type the `pictures` array in `Gallery.tsx:48` with a proper `GalleryItem` interface instead of `any[]`.
- Replace `@mui/icons-material` imports (4 files) with `react-icons` equivalents to eliminate the ~300KB MUI runtime from the bundle.
- Extract `SUPPORTED_LANGS` into a shared constant used by both `App.tsx` and `i18n.tsx` to prevent language detection drift.
- Fix the `"outside"` → "Outsides" English translation key and add the Borges attribution back.
- Replace the inline language check for "Call" / "Chiama" in `Info.tsx:30` with proper translation keys.
- Remove `serviceWorker.ts`, `reportWebVitals.ts`, `Logo.tsx`, and `ColorModeSwitcher.tsx` — all are dead CRA boilerplate.

---

## Files Audited

- `src/Colors.tsx`
- `src/App.tsx`
- `src/i18n.tsx` (referenced via architecture docs)
- `src/components/Hero/Hero.tsx` + `Hero.css`
- `src/components/SideBar/SideBar.tsx` + `Sidebar.css`
- `src/components/Rooms/Rooms.tsx`
- `src/components/RoomCard/RoomCard.tsx` + `RoomCard.css`
- `src/components/Services/Services.tsx`
- `src/components/Where/Where.tsx`
- `src/components/Info/Info.tsx`
- `src/components/Footer/Footer.tsx`
- `src/components/Gallery/Gallery.tsx` + `Gallery.css`
- `src/components/Carousel/Carousel.tsx`
- `src/components/SEOHead/SEOHead.tsx`
- `src/Translation/Italian/translation.json`
- `src/Translation/English/translation.json`
- Architecture, stack, conventions, concerns, and structure documents in `.planning/codebase/`
