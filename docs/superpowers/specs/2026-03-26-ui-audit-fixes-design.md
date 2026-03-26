# UI Audit Fixes — Design Spec

**Date:** 2026-03-26
**Scope:** Fix all findings from UI-REVIEW.md + infrastructure improvements

## 1. Color Token System

**File:** `src/Colors.tsx`

Add three new tokens:
- `accentHover: "#b5633f"` — darker accent for hover states
- `borderLight: "#E8E3D8"` — light border color used on cards and dividers
- `headingsOverlay: (opacity: number) => \`rgba(59, 74, 43, \${opacity})\`` — helper for the olive overlay variants

Replace hardcoded values:
- `Hero.tsx:120` — `#FAF7F2` → `backgroundBrown`
- `Rooms.tsx:61` — `#FAF7F2` → `backgroundBrown`
- `Where.tsx:24` — `#FAF7F2` → `backgroundBrown`
- `Where.tsx:94` — `#b5633f` → `accentHover`
- `RoomCard.tsx:97` — `#b5633f` → `accentHover`
- `Services.tsx:154` — `#E8E3D8` → `borderLight`
- `Gallery.tsx:96` — `#E8E3D8` → `borderLight`

## 2. Accessibility

### Language flags (SideBar.tsx)
Wrap each `<Image onClick>` flag in a `<Box as="button">` with:
- `aria-label` (e.g., "Switch to Italian")
- Keyboard handler (`onKeyDown` Enter/Space)
- Remove `cursor="pointer"` from Image (button handles it)

### Contact pills (Info.tsx)
Replace `<Flex role="group" onClick>` with `<Button variant="outline">` styled to match current pill design. This gives us semantic HTML, keyboard focus, and screen reader support for free.

### Room cards (RoomCard.tsx)
Add to the outer `<Box>`:
- `role="button"`
- `tabIndex={0}`
- `aria-label={title}`
- `onKeyDown` handler for Enter/Space → `onOpen()`

### Gallery back button (Gallery.tsx)
Replace `<Flex onClick>` with `<Button variant="ghost">` with `aria-label="Back to home"`.

### Skip-to-content link (App.tsx)
Add visually hidden `<a href="#rooms">` as first child inside `HomePage`, visible on focus.

### Scroll indicator (Hero.tsx)
Add `aria-hidden="true"` to the chevron `<Box>`.

### window.open() calls
Add `rel` equivalent: use `window.open(url, '_blank', 'noopener,noreferrer')` in:
- `Where.tsx:12`
- `Info.tsx:19-24`
- `Footer.tsx:17-21`

## 3. Image Performance

### Lazy loading
Add `loading="lazy"` to all `<Image>` in:
- `Gallery.tsx` — GalleryPicture component
- `Where.tsx` — map images

Do NOT lazy-load:
- Hero image (above the fold, needs immediate load)
- Room card main images in Rooms.tsx (above fold on many viewports)

### React.lazy Gallery route
In `App.tsx`, lazy-import Gallery with `React.lazy()` + `<Suspense>` fallback.

### Carousel CSS
Install `slick-carousel` as a dependency. Import CSS in `index.tsx`:
```
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
```
Remove the CDN `<link>` tags from `Carousel.tsx`.

## 4. Translation Fixes

### English translation.json
- `"outside"`: "Outsides" → "Outdoor Areas"
- `"borges"`: Append ` (Borges)` to match Italian
- Add `"call"`: "Call"
- Add `"madeBy"`: "Website by: Andrea Liotta"

### Italian translation.json
- Add `"call"`: "Chiama"
- Add `"madeBy"`: "Sito realizzato da: Andrea Liotta"

### Info.tsx
Replace inline `i18n.language === "it" ? "Chiama" : "Call"` with `t("call")`.

### Footer.tsx
Replace hardcoded `"Sito realizzato da: Andrea Liotta"` with `t("madeBy")`.

## 5. UX / Bug Fixes

### MobileNav useEffect (SideBar.tsx:235)
Add `[yOffset]` dependency array. Use a ref for yOffset to avoid stale closure:
```tsx
const yOffsetRef = useRef(window.pageYOffset);
useEffect(() => {
  function handleScroll() {
    const currentYOffset = window.pageYOffset;
    setVisible(yOffsetRef.current > currentYOffset || currentYOffset < 80);
    yOffsetRef.current = currentYOffset;
  }
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### Gallery overlay (Gallery.tsx:186-199)
Remove the empty hover overlay `<Box className="gallery-overlay">` — it provides visual feedback but has no action. Also remove the `.gallery-overlay` and `.gallery-item:hover .gallery-overlay` CSS rules from `Gallery.css`.

### Info.tsx duplicate divider (line 46)
Remove `<Box w="60px" h="1px" bg={accent} mb="8" />` — the section title already has flanking accent lines.

### Error boundary (new: src/components/ErrorBoundary/ErrorBoundary.tsx)
Simple class component that catches errors and renders a "Something went wrong" message with a reload button. Wrap the app in App.tsx.

### Gallery types (Gallery.tsx)
Replace `any[]` with:
```tsx
interface GalleryItem {
  src: string;
  title: string;
  isPic: boolean;
}
```

## 6. Infrastructure

### CRA → Vite migration
- Install vite, @vitejs/plugin-react, vite-plugin-svgr
- Create vite.config.ts with React plugin and path aliases
- Move index.html from public/ to root, update script tags
- Rename react-app-env.d.ts → vite-env.d.ts
- Update tsconfig.json for Vite compatibility
- Update package.json scripts: start→dev, build→build (vite)
- Remove react-scripts, react-app-env dependencies
- Remove CRA boilerplate: serviceWorker.ts, reportWebVitals.ts, ColorModeSwitcher.tsx, Logo.tsx

### WebP image conversion
- Convert all .jpg assets to .webp at 80-85% quality using cwebp
- Update all image imports to reference .webp files
- Remove original .jpg files after conversion
- Target: 45MB → ~5-8MB

### Replace @mui/icons-material with react-icons
MUI icons pull in ~300KB of runtime. Replace with react-icons equivalents:
- `@mui/icons-material/ArrowBack` → `react-icons/fi` FiArrowLeft
- `@mui/icons-material/WhatsApp` → `react-icons/fi` FiMessageCircle (or `react-icons/si` SiWhatsapp)
- `@mui/icons-material/MailOutline` → `react-icons/fi` FiMail
- `@mui/icons-material/PhoneOutlined` → `react-icons/fi` FiPhone
- `@mui/icons-material/LocalParkingOutlined` → `react-icons/md` MdLocalParking
- `@mui/icons-material/AirportShuttleOutlined` → `react-icons/md` MdAirportShuttle
- `@mui/icons-material/BakeryDiningOutlined` → `react-icons/md` MdBakeryDining (or FiCoffee)
- `@mui/icons-material/Wifi` → `react-icons/fi` FiWifi
- `@mui/icons-material/AcUnitOutlined` → `react-icons/md` MdAcUnit
- `@mui/icons-material/PetsOutlined` → `react-icons/md` MdPets
- `@mui/icons-material/PinDropOutlined` → `react-icons/fi` FiMapPin
- `@mui/icons-material/PrivacyTipOutlined` → `react-icons/fi` FiShield
- `@mui/icons-material/Code` → `react-icons/fi` FiCode

After replacing, remove `@mui/icons-material` and `@mui/material` from dependencies.

Update react-icons from v3 to latest (v5) since the project already has it.

### Replace react-in-viewport
Replace alpha-version `react-in-viewport` with `react-intersection-observer` (stable, widely used). Update `ServiceCard` in Services.tsx to use `useInView` hook.

## Out of Scope

- Carousel responsive width redesign (needs UX decision on mobile layout)
- 404 page design (needs design direction)
- Font `font-display: swap` optimization (minor, requires index.html Google Fonts URL change)
