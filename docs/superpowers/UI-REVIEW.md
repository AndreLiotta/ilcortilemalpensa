# SEO Phase -- UI Review

**Audited:** 2026-03-26
**Baseline:** Abstract 6-pillar standards (no UI-SPEC exists)
**Screenshots:** Not captured (no dev server detected on ports 3000, 5173, or 8080)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Good i18n coverage; a few untranslated hardcoded strings remain |
| 2. Visuals | 3/4 | Strong visual hierarchy with hero, cards, and sections; minor accessibility gaps |
| 3. Color | 3/4 | Consistent 5-color palette with good accent restraint; some hardcoded values bypass tokens |
| 4. Typography | 4/4 | Clean 2-font system (display + body) with consistent responsive sizing |
| 5. Spacing | 3/4 | Consistent Chakra spacing tokens; a few hardcoded pixel values in CSS |
| 6. Experience Design | 2/4 | No loading states, no error boundaries, no empty states, and missing focus management |

**Overall: 18/24**

---

## Top 3 Priority Fixes

1. **No loading or error states anywhere in the app** -- Users see nothing if images fail to load or translations are unavailable. Add a Suspense fallback in App.tsx and an ErrorBoundary wrapping the route tree. For images, add `onError` handlers or `fallback` props to critical Image components (Hero, RoomCard, Gallery).

2. **Contact buttons in Info.tsx use `Flex` with `onClick` instead of semantic `button` or `a` elements** -- Screen readers and keyboard users cannot activate these "buttons" reliably. At `Info.tsx:79-115`, wrap each contact action in a `<Button>` or `<Link>` with proper `href` for email/tel/whatsapp actions instead of using `onClick` on a non-interactive `Flex`.

3. **Hardcoded color values scattered across components bypass the Colors.tsx token system** -- Makes future palette changes error-prone. Replace `bg="#FAF7F2"` in Hero.tsx:120, Rooms.tsx:61, Where.tsx:24, and `borderColor="#E8E3D8"` in Services.tsx:154 and Gallery.tsx:96 with the `backgroundBrown` and a new `border` token from Colors.tsx.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Strengths:**
- Full i18n coverage for both IT and EN via translation JSON files (43 keys each)
- CTAs are contextual and descriptive: "Scopri" / "See more", "Vedi su Google Maps" / "Open in Google Maps"
- Room descriptions include pricing information clearly
- The Borges quote adds personality and warmth to the intro section

**Issues found:**

- **Hardcoded Italian string in Footer.tsx:179**: `"Sito realizzato da: Andrea Liotta"` is not translated. EN users see Italian text.
- **Hardcoded B&B name variations**: Hero.tsx:74 uses "B&B Il Cortile" while SideBar.tsx:270 uses "Il cortile B&B" -- inconsistent casing and order.
- **"Outsides" in EN translation (translation.json:40)**: The gallery section header translates "Esterni" as "Outsides" which is not natural English. Should be "Outdoor Areas" or "Garden & Exterior".
- **Info section contact label**: `Info.tsx:30` uses inline conditional `i18n.language === "it" ? "Chiama" : "Call"` instead of a translation key -- breaks if more languages are added.
- **Missing skip-to-content link**: No mechanism for keyboard users to bypass the navbar.

### Pillar 2: Visuals (3/4)

**Strengths:**
- Clear focal point: Full-viewport hero image with centered title and gradient overlay
- Consistent section pattern: decorative accent line + title + body text + content
- Room cards with hover overlay and zoom effect provide engaging interaction feedback
- Service cards use ScaleFade animation on viewport entry for progressive disclosure
- Mobile-responsive design with distinct layouts (mobile overlay card in Hero, column stacking)
- Gallery uses consistent 4:3 aspect ratio (`style={{ aspectRatio: "4/3" }}`) for all images

**Issues found:**

- **Gallery back button (Gallery.tsx:107)**: Icon-only button with no `aria-label` or visible text tooltip. The `Flex` wrapper is not a semantic button element.
- **Scroll indicator (Hero.tsx:112)**: ChevronDown icon has no aria-label or sr-only text explaining its purpose.
- **Room card clickability (RoomCard.tsx:37-45)**: The entire card is clickable via `onClick` on a `Box`, but there is no keyboard focus indicator or `role="button"` / `tabIndex`. Keyboard users cannot discover or activate room modals.
- **Carousel arrow labels**: `aria-label="left-arrow"` and `aria-label="right-arrow"` in Carousel.tsx:43,59 are not descriptive. Should be "Previous slide" and "Next slide".
- **Mobile nav hide-on-scroll**: SideBar.tsx:238 uses `window.pageYOffset` (deprecated) and the `useEffect` on line 235 has no dependency array, re-registering the scroll listener on every render.

### Pillar 3: Color (3/4)

**Strengths:**
- Well-defined 5-color palette in Colors.tsx:
  - `headings` (#3B4A2B, dark olive) -- used for titles, footer background, nav
  - `backgroundBrown` (#FAF7F2, warm off-white) -- primary backgrounds
  - `light` (#F0ECE3, warm cream) -- alternate section backgrounds
  - `accent` (#C4724E, terracotta) -- decorative lines, CTAs, icons, price text
  - `textColor` (#2D2A26, near-black) -- body copy
- Accent usage is restrained: decorative separator lines, service icons, CTA buttons, price labels. Not overused.
- Good dark/light alternation between sections (backgroundBrown and light alternate)
- Footer uses inverted scheme (dark olive bg with light text) for visual closure

**Issues found:**

- **Hardcoded hex values bypass tokens**: `bg="#FAF7F2"` appears in Hero.tsx:120, Rooms.tsx:61, Where.tsx:24 instead of using the `backgroundBrown` import. `borderColor="#E8E3D8"` in Services.tsx:154 and Gallery.tsx:96 is not defined in Colors.tsx at all.
- **Hardcoded rgba in CSS files**: Gallery.css:3 has `background-color: #FAF7F2 !important`, Sidebar.css:13 has `background-color: #C4724E`. These should reference the token values.
- **Inline rgba color values**: `bg="rgba(59, 74, 43, 0.65)"` in Hero.tsx:54, `bg="rgba(59, 74, 43, 0.5)"` in SideBar.tsx:80 and RoomCard.tsx:83 -- these are alpha variants of the `headings` color but not tokenized.
- **Hover state hardcoded**: `_hover={{ bg: "#b5633f" }}` in Where.tsx:94 and RoomCard.tsx:97 is a darker accent variant not in the token system.

### Pillar 4: Typography (4/4)

**Strengths:**
- Clean 2-font system: DM Serif Display (display/headings) and Source Sans 3 (body text)
- Fonts are consistently referenced via `displayFont` and `bodyFont` tokens from Colors.tsx
- Responsive font sizing is well-handled:
  - Hero: `7xl`/`8xl` desktop, `2xl` mobile
  - Section headings: `5xl` desktop, `3xl` mobile
  - Body text: `lg` desktop, `md` mobile
  - Footer/small: `sm`/`xs`
- Font weights are minimal and purposeful: `400` for body, `600` for contact button labels, display font has inherent weight
- Line heights are explicitly set for readability: `1.8` for body text, `1.2` for headings, `1.6` for compact text

**Minor note:**
- Rooms.css:1 imports `Proza Libre` font from Google Fonts but it is never used anywhere in the codebase. This is dead CSS that adds an unnecessary network request.

### Pillar 5: Spacing (3/4)

**Strengths:**
- Consistent use of Chakra spacing tokens across all components
- Section vertical padding follows a pattern: `py={{ base: "12", md: "20" }}` for all main sections (Rooms, Services, Where, Info)
- Horizontal page padding consistent: `px="6"` across sections
- Grid gaps are responsive: `gap={{ base: "4", md: "6" }}` for services, `gap={{ base: "2", md: "4" }}` for gallery
- Content max-width consistently set: `maxW="1200px"` for main content, `maxW="1000px"` for service grid, `maxW="800px"` for intro text

**Issues found:**

- **Carousel slide positioning uses hardcoded pixel-like breakpoint values**: Carousel.tsx:24 `side = useBreakpointValue({ base: "7em", md: "1em" })` -- uses `em` units that do not align with Chakra's spacing scale.
- **Inconsistent padding in RoomCard modal**: ModalHeader uses `pt="8" pb="2"` while ModalBody uses `pb="8"`. The asymmetry between header top and bottom is non-standard.
- **Service card minH**: `minH={{ base: "auto", md: "220px" }}` at Services.tsx:160 uses a hardcoded pixel value rather than Chakra tokens.
- **Decorative line widths**: `w="40px"` and `w="30px"` (Gallery section titles) use hardcoded pixel values instead of tokens like `w="10"`.

### Pillar 6: Experience Design (2/4)

**Strengths:**
- Language switcher works bidirectionally with flag icons and proper URL routing
- Mobile nav has auto-hide on scroll-down / show on scroll-up behavior
- Room cards open full-screen modals with carousel for immersive viewing
- Gallery hover effects provide visual affordance for interactive items
- Service cards have scroll-triggered entrance animations via `useInViewport`
- Contact methods (email, phone, WhatsApp) open correct native handlers

**Issues found:**

- **No loading states**: No Suspense boundaries, no skeleton screens, no loading spinners anywhere. The i18n setup and image-heavy pages would benefit from loading indicators.
- **No error boundaries**: If any component throws, the entire app crashes with a white screen. No ErrorBoundary component exists.
- **No empty states**: If translations fail to load, the raw keys (e.g., "rooms", "services") would render as-is with no user-friendly fallback.
- **Gallery images have no lazy loading**: All 28+ images in Gallery.tsx load eagerly. No `loading="lazy"` attribute or intersection observer approach for off-screen images.
- **Carousel loads external CSS at runtime**: Carousel.tsx:32-41 injects `<link>` tags for slick-carousel CSS from a CDN inside the component body. This causes a flash of unstyled content every time the modal opens and is a render-blocking pattern inside a component.
- **MobileNav scroll handler leaks**: SideBar.tsx:235 `useEffect` has no dependency array, meaning the scroll event listener is removed and re-added on every single render. This is a performance issue and potential source of stale closures.
- **No confirmation for external navigation**: "Open in Google Maps" button (Where.tsx:87) opens a new tab without warning the user they are leaving the site.
- **Privacy Policy link is not accessible**: Footer.tsx:154 uses `Link` with `onClick` but no `href`, so it is not keyboard navigable by default and screen readers cannot determine the target.

---

## Files Audited

- `src/Colors.tsx` -- Design tokens (colors, fonts)
- `src/App.tsx` -- Route structure and layout
- `src/components/Hero/Hero.tsx` + `Hero.css` -- Hero section
- `src/components/Rooms/Rooms.tsx` + `Rooms.css` -- Rooms section
- `src/components/Services/Services.tsx` -- Services section
- `src/components/Where/Where.tsx` + `Where.css` -- Location section
- `src/components/Info/Info.tsx` -- Contact/info section
- `src/components/Footer/Footer.tsx` -- Footer
- `src/components/Gallery/Gallery.tsx` + `Gallery.css` -- Gallery page
- `src/components/SideBar/SideBar.tsx` + `Sidebar.css` -- Navbar (desktop + mobile)
- `src/components/RoomCard/RoomCard.tsx` + `RoomCard.css` -- Room card component
- `src/components/Carousel/Carousel.tsx` -- Image carousel
- `src/components/SEOHead/SEOHead.tsx` -- SEO metadata
- `src/components/Fonts.css` -- Font imports
- `src/Translation/English/translation.json` -- EN copy
- `src/Translation/Italian/translation.json` -- IT copy
