# UI Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all UI audit findings from UI-REVIEW.md including accessibility, performance, color tokens, translations, UX bugs, and infrastructure (CRA→Vite, WebP, dependency cleanup).

**Architecture:** Sequential changes grouped by dependency order — safe code fixes first, then dependency swaps, then infrastructure migration (Vite), then image conversion last (depends on Vite being in place).

**Tech Stack:** React 18, TypeScript, Chakra UI v2, Vite, react-icons v5, react-intersection-observer, slick-carousel

---

### Task 1: Color Tokens + Hardcoded Value Replacements

**Files:**
- Modify: `src/Colors.tsx`
- Modify: `src/components/Hero/Hero.tsx:120`
- Modify: `src/components/Rooms/Rooms.tsx:61`
- Modify: `src/components/Where/Where.tsx:24,94`
- Modify: `src/components/RoomCard/RoomCard.tsx:97`
- Modify: `src/components/Services/Services.tsx:154`
- Modify: `src/components/Gallery/Gallery.tsx:96`

- [ ] **Step 1: Add new tokens to Colors.tsx**

```tsx
export const headings: string = "#3B4A2B";
export const backgroundBrown: string = "#FAF7F2";
export const light: string = "#F0ECE3";
export const navBackground: string = "rgba(59, 74, 43, 0.92)";
export const accent: string = "#C4724E";
export const accentHover: string = "#b5633f";
export const borderLight: string = "#E8E3D8";
export const textColor: string = "#2D2A26";
export const displayFont: string = "'DM Serif Display', serif";
export const bodyFont: string = "'Source Sans 3', sans-serif";
```

- [ ] **Step 2: Replace hardcoded `#FAF7F2` in Hero.tsx**

In `Hero.tsx:120`, change `bg="#FAF7F2"` to `bg={backgroundBrown}`. Add `backgroundBrown` to the import from `../../Colors`.

- [ ] **Step 3: Replace hardcoded `#FAF7F2` in Rooms.tsx**

In `Rooms.tsx:61`, change `bg="#FAF7F2"` to `bg={backgroundBrown}`. Add `backgroundBrown` to the import from `../../Colors`.

- [ ] **Step 4: Replace hardcoded values in Where.tsx**

In `Where.tsx:24`, change `bg="#FAF7F2"` to `bg={backgroundBrown}`. In `Where.tsx:94`, change `_hover={{ bg: "#b5633f" }}` to `_hover={{ bg: accentHover }}`. Add `backgroundBrown, accentHover` to the import from `../../Colors`.

- [ ] **Step 5: Replace hardcoded hover in RoomCard.tsx**

In `RoomCard.tsx:97`, change `_hover={{ bg: "#b5633f" }}` to `_hover={{ bg: accentHover }}`. Add `accentHover` to the import from `../../Colors`.

- [ ] **Step 6: Replace hardcoded border in Services.tsx**

In `Services.tsx:154`, change `borderColor="#E8E3D8"` to `borderColor={borderLight}`. Add `borderLight` to the import from `../../Colors`.

- [ ] **Step 7: Replace hardcoded border in Gallery.tsx**

In `Gallery.tsx:96`, change `borderColor="#E8E3D8"` to `borderColor={borderLight}`. Add `borderLight` to the import from `../../Colors`.

- [ ] **Step 8: Commit**

```bash
git add src/Colors.tsx src/components/Hero/Hero.tsx src/components/Rooms/Rooms.tsx src/components/Where/Where.tsx src/components/RoomCard/RoomCard.tsx src/components/Services/Services.tsx src/components/Gallery/Gallery.tsx
git commit -m "refactor: consolidate hardcoded colors into design tokens"
```

---

### Task 2: Translation Fixes

**Files:**
- Modify: `src/Translation/English/translation.json`
- Modify: `src/Translation/Italian/translation.json`
- Modify: `src/components/Info/Info.tsx:30`
- Modify: `src/components/Footer/Footer.tsx:179`

- [ ] **Step 1: Fix English translations**

In `src/Translation/English/translation.json`:
- Change `"outside": "Outsides"` to `"outside": "Outdoor Areas"`
- Change `"borges"` value to append ` (Borges)` at the end, so it reads: `"''Every person who passes through our doors is unique, and they always leave a little bit of themselves behind while taking a little piece of us with them. Some may take more than others, but there's never anyone who doesn't leave something behind.'' (Borges)"`
- Add `"call": "Call"`
- Add `"madeBy": "Website by: Andrea Liotta"`

- [ ] **Step 2: Add keys to Italian translations**

In `src/Translation/Italian/translation.json`:
- Add `"call": "Chiama"`
- Add `"madeBy": "Sito realizzato da: Andrea Liotta"`

- [ ] **Step 3: Fix inline language check in Info.tsx**

In `Info.tsx:30`, change:
```tsx
{ action: "phone", icon: phoneIcon, label: i18n.language === "it" ? "Chiama" : "Call" },
```
to:
```tsx
{ action: "phone", icon: phoneIcon, label: t("call") },
```

Remove `i18n` from the `useTranslation()` destructure (only keep `t`):
```tsx
const { t } = useTranslation();
```

- [ ] **Step 4: Fix hardcoded Italian in Footer.tsx**

In `Footer.tsx:179`, change:
```tsx
Sito realizzato da: Andrea Liotta
```
to:
```tsx
{t("madeBy")}
```

- [ ] **Step 5: Commit**

```bash
git add src/Translation/English/translation.json src/Translation/Italian/translation.json src/components/Info/Info.tsx src/components/Footer/Footer.tsx
git commit -m "fix: translation corrections and remove inline language checks"
```

---

### Task 3: UX Bug Fixes

**Files:**
- Modify: `src/components/SideBar/SideBar.tsx:232-243`
- Modify: `src/components/Info/Info.tsx:46`
- Modify: `src/components/Gallery/Gallery.tsx:165-201`
- Modify: `src/components/Gallery/Gallery.css:11-17`

- [ ] **Step 1: Fix MobileNav useEffect stale closure**

In `SideBar.tsx`, replace the MobileNav component's state and effect (lines 232-243):

Change:
```tsx
const MobileNav = ({ onOpen, scrolled }: MobileNavProps) => {
  const [yOffset, setYOffset] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const currentYOffset = window.pageYOffset;
      setVisible(yOffset > currentYOffset || currentYOffset < 80);
      setYOffset(currentYOffset);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
```

To:
```tsx
const MobileNav = ({ onOpen, scrolled }: MobileNavProps) => {
  const [visible, setVisible] = useState(true);
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

Add `useRef` to the React imports at the top of the file:
```tsx
import { useEffect, useRef, useState } from "react";
```

- [ ] **Step 2: Remove duplicate decorative divider in Info.tsx**

In `Info.tsx`, delete line 46:
```tsx
<Box w="60px" h="1px" bg={accent} mb="8" />
```

This is the standalone divider above the section title — the section title already has its own flanking accent lines.

- [ ] **Step 3: Remove empty gallery overlay**

In `Gallery.tsx`, in the `GalleryPicture` component, remove the empty overlay Box (lines 186-199):
```tsx
      <Box
        className="gallery-overlay"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(59, 74, 43, 0.3)"
        opacity="0"
        transition="opacity 0.4s ease"
        display="flex"
        alignItems="center"
        justifyContent="center"
      />
```

In `Gallery.css`, remove lines 11-17:
```css
.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1 !important;
}
```

Keep only the hover zoom on `.gallery-image`:
```css
.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}
```

- [ ] **Step 4: Type the Gallery pictures array**

In `Gallery.tsx`, replace `const pictures: any[]` with:
```tsx
interface GalleryItem {
  src: string;
  title: string;
  isPic: boolean;
}

const pictures: GalleryItem[] = [
```

Update `renderPicOrTitle` signature from `(pic: any, index: number)` to `(pic: GalleryItem, index: number)`.

- [ ] **Step 5: Commit**

```bash
git add src/components/SideBar/SideBar.tsx src/components/Info/Info.tsx src/components/Gallery/Gallery.tsx src/components/Gallery/Gallery.css
git commit -m "fix: MobileNav stale closure, remove empty overlay, type gallery array"
```

---

### Task 4: Accessibility Fixes

**Files:**
- Modify: `src/components/SideBar/SideBar.tsx`
- Modify: `src/components/Info/Info.tsx`
- Modify: `src/components/RoomCard/RoomCard.tsx`
- Modify: `src/components/Gallery/Gallery.tsx`
- Modify: `src/components/Hero/Hero.tsx`
- Modify: `src/components/Where/Where.tsx`
- Modify: `src/components/Footer/Footer.tsx`
- Create: `src/components/SkipToContent/SkipToContent.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Make language flags accessible in SideBar.tsx**

Replace the desktop language flags (lines 120-141). Change each `<Image>` to be wrapped with proper button semantics:

```tsx
{/* Language switcher */}
<Flex gap="3" alignItems="center">
  <Box
    as="button"
    aria-label="Italiano"
    onClick={() => onClickLanguageChange("it")}
    bg="transparent"
    border="none"
    cursor="pointer"
    p="0"
    lineHeight="0"
  >
    <Image
      src={itFlag}
      alt=""
      h="24px"
      opacity={lang === "it" ? 1 : 0.6}
      _hover={{ opacity: 1 }}
      transition="opacity 0.3s"
    />
  </Box>
  <Box
    as="button"
    aria-label="English"
    onClick={() => onClickLanguageChange("en")}
    bg="transparent"
    border="none"
    cursor="pointer"
    p="0"
    lineHeight="0"
  >
    <Image
      src={enFlag}
      alt=""
      h="24px"
      opacity={lang === "en" ? 1 : 0.6}
      _hover={{ opacity: 1 }}
      transition="opacity 0.3s"
    />
  </Box>
</Flex>
```

Do the same for mobile drawer flags (lines 193-217):

```tsx
<Flex justifyContent="center" gap="5" pb="10" flexShrink={0}>
  <Box
    as="button"
    aria-label="Italiano"
    onClick={() => {
      onClickLanguageChange("it");
      onClose();
    }}
    bg="transparent"
    border="none"
    cursor="pointer"
    p="0"
    lineHeight="0"
  >
    <Image
      src={itFlag}
      alt=""
      h="32px"
      opacity={lang === "it" ? 1 : 0.6}
      _hover={{ opacity: 1 }}
    />
  </Box>
  <Box
    as="button"
    aria-label="English"
    onClick={() => {
      onClickLanguageChange("en");
      onClose();
    }}
    bg="transparent"
    border="none"
    cursor="pointer"
    p="0"
    lineHeight="0"
  >
    <Image
      src={enFlag}
      alt=""
      h="32px"
      opacity={lang === "en" ? 1 : 0.6}
      _hover={{ opacity: 1 }}
    />
  </Box>
</Flex>
```

- [ ] **Step 2: Make contact pills accessible in Info.tsx**

Replace the `<Flex>` contact buttons with `<Button>`. Change the mapping (lines 78-116):

```tsx
{contactButtons.map((btn) => (
  <Button
    key={btn.action}
    variant="outline"
    leftIcon={
      <Icon
        as={btn.icon as IconType}
        w={{ base: 5, md: 6 }}
        h={{ base: 5, md: 6 }}
      />
    }
    px={{ base: "5", md: "8" }}
    py={{ base: "6", md: "7" }}
    borderRadius="full"
    border="2px solid"
    borderColor={headings}
    color={headings}
    bg="transparent"
    fontFamily={bodyFont}
    fontWeight="600"
    fontSize={{ base: "sm", md: "md" }}
    onClick={() => infoButtonAction(btn.action)}
    transition="all 0.3s ease"
    _hover={{
      bg: headings,
      color: "white",
    }}
    aria-label={`${btn.label}`}
  >
    {btn.label}
  </Button>
))}
```

Add `Button` to the Chakra imports at the top of Info.tsx.

- [ ] **Step 3: Make room cards keyboard accessible**

In `RoomCard.tsx`, add accessibility props to the outer `<Box>` (line 36):

```tsx
<Box
  className="room-card"
  position="relative"
  borderRadius="xl"
  overflow="hidden"
  shadow="lg"
  width={{ base: "90%", md: "45%" }}
  cursor="pointer"
  onClick={onOpen}
  onKeyDown={(e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }}
  role="button"
  tabIndex={0}
  aria-label={title}
>
```

- [ ] **Step 4: Make gallery back button accessible**

In `Gallery.tsx`, replace the back button `<Flex onClick>` (lines 98-108) with a proper `<Button>`:

```tsx
<Button
  variant="ghost"
  aria-label="Back to home"
  onClick={() => navigate(`/${lang}/`)}
  _hover={{ color: accent }}
  transition="color 0.3s"
  color={headings}
  mr="6"
  p="0"
  minW="auto"
>
  <Icon as={backButtonIcon} w={6} h={6} />
</Button>
```

Add `Button` to the Chakra UI imports in Gallery.tsx.

- [ ] **Step 5: Add aria-hidden to scroll indicator in Hero.tsx**

In `Hero.tsx:106-113`, add `aria-hidden="true"` to the scroll indicator Box:

```tsx
<Box
  position="absolute"
  bottom="6"
  className="scroll-indicator"
  zIndex="1"
  aria-hidden="true"
>
```

- [ ] **Step 6: Fix window.open calls with noopener**

In `Where.tsx:12`:
```tsx
function openInMaps() {
  window.open("https://goo.gl/maps/ybBDCuyTGoUn93GW6", "_blank", "noopener,noreferrer");
}
```

In `Info.tsx:18-25`:
```tsx
function infoButtonAction(action: string) {
  if (action === "email") {
    window.open("mailto:ilcortile@hotmail.it", "_blank", "noopener,noreferrer");
  } else if (action === "phone") {
    window.open("tel:00393471106528", "_blank", "noopener,noreferrer");
  } else if (action === "whatsapp") {
    window.open("https://api.whatsapp.com/send?phone=393471106528", "_blank", "noopener,noreferrer");
  }
}
```

In `Footer.tsx:16-22`:
```tsx
function openPdf() {
  if (i18n.language === "it") {
    window.open(privacyPolicy, "_blank", "noopener,noreferrer");
  } else if (i18n.language === "en") {
    window.open(privacyPolicyEn, "_blank", "noopener,noreferrer");
  }
}
```

- [ ] **Step 7: Create SkipToContent component**

Create `src/components/SkipToContent/SkipToContent.tsx`:

```tsx
import { Box, Link } from "@chakra-ui/react";
import { bodyFont } from "../../Colors";

export default function SkipToContent() {
  return (
    <Link
      href="#rooms"
      position="absolute"
      top="-100px"
      left="4"
      zIndex="9999"
      bg="white"
      color="black"
      px="4"
      py="2"
      borderRadius="md"
      fontFamily={bodyFont}
      fontWeight="600"
      _focus={{
        top: "4",
      }}
    >
      Skip to content
    </Link>
  );
}
```

- [ ] **Step 8: Add SkipToContent to App.tsx**

In `App.tsx`, import and add SkipToContent as the first child of HomePage:

```tsx
import SkipToContent from './components/SkipToContent/SkipToContent';

function HomePage() {
  return (
    <>
      <SkipToContent />
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

- [ ] **Step 9: Commit**

```bash
git add src/components/SideBar/SideBar.tsx src/components/Info/Info.tsx src/components/RoomCard/RoomCard.tsx src/components/Gallery/Gallery.tsx src/components/Hero/Hero.tsx src/components/Where/Where.tsx src/components/Footer/Footer.tsx src/components/SkipToContent/SkipToContent.tsx src/App.tsx
git commit -m "fix: accessibility — keyboard nav, semantic buttons, skip-to-content, aria"
```

---

### Task 5: Error Boundary

**Files:**
- Create: `src/components/ErrorBoundary/ErrorBoundary.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ErrorBoundary component**

Create `src/components/ErrorBoundary/ErrorBoundary.tsx`:

```tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { backgroundBrown, headings, accent, displayFont, bodyFont, textColor } from "../../Colors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex
          minH="100vh"
          bg={backgroundBrown}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          px="6"
          textAlign="center"
        >
          <Text
            fontFamily={displayFont}
            fontSize={{ base: "2xl", md: "4xl" }}
            color={headings}
            mb="4"
          >
            Something went wrong
          </Text>
          <Text
            fontFamily={bodyFont}
            fontSize={{ base: "md", md: "lg" }}
            color={textColor}
            mb="8"
          >
            We're sorry for the inconvenience. Please try reloading the page.
          </Text>
          <Button
            onClick={() => window.location.reload()}
            bg={accent}
            color="white"
            fontFamily={displayFont}
            borderRadius="full"
            px="8"
            size="lg"
            _hover={{ bg: "#b5633f" }}
          >
            Reload page
          </Button>
        </Flex>
      );
    }

    return this.props.children;
  }
}
```

- [ ] **Step 2: Wrap app with ErrorBoundary**

In `src/App.tsx`, import and wrap the BrowserRouter:

```tsx
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/it/" replace />} />
            <Route path="/gallery" element={<Navigate to="/it/gallery" replace />} />
            <Route path="/:lang/*" element={<LangLayout />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ErrorBoundary/ErrorBoundary.tsx src/App.tsx
git commit -m "feat: add error boundary with reload fallback"
```

---

### Task 6: Image Performance (Lazy Loading + React.lazy)

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Gallery/Gallery.tsx`
- Modify: `src/components/Where/Where.tsx`

- [ ] **Step 1: Lazy-load the Gallery route**

In `App.tsx`, replace the static Gallery import with React.lazy:

Remove:
```tsx
import Gallery from './components/Gallery/Gallery';
```

Add at the top (after other imports):
```tsx
import { Suspense } from 'react';

const Gallery = React.lazy(() => import('./components/Gallery/Gallery'));
```

Wrap the Gallery usage in LangLayout with Suspense:

```tsx
<Route path="/gallery" element={
  <Suspense fallback={<Box minH="100vh" bg="#FAF7F2" />}>
    <SEOHead page="gallery" />
    <Gallery />
  </Suspense>
} />
```

Add `Box` to the Chakra UI imports in App.tsx:
```tsx
import { ChakraProvider, theme, Box } from '@chakra-ui/react';
```

Note: Use the `backgroundBrown` import instead of hardcoded `#FAF7F2` since we already fixed tokens:
```tsx
import { backgroundBrown } from './Colors';
// ...
<Suspense fallback={<Box minH="100vh" bg={backgroundBrown} />}>
```

- [ ] **Step 2: Add lazy loading to Gallery images**

In `Gallery.tsx`, in the `GalleryPicture` component, add `loading="lazy"` to the Image:

```tsx
<Image
  src={img}
  alt={`${t(title)} — B&B Il Cortile Malpensa`}
  width="100%"
  height="100%"
  objectFit="cover"
  transition="transform 0.5s ease"
  className="gallery-image"
  style={{ aspectRatio: "4/3" }}
  loading="lazy"
/>
```

- [ ] **Step 3: Add lazy loading to Where.tsx map images**

In `Where.tsx`, add `loading="lazy"` to both map images:

```tsx
<Image
  src={map}
  alt="Mappa della posizione di B&B Il Cortile a Casorate Sempione, vicino all'aeroporto di Malpensa"
  borderRadius="xl"
  shadow="xl"
  display={{ base: "none", md: "block" }}
  w="100%"
  loading="lazy"
/>
<Image
  src={mapMobile}
  alt="Mappa della posizione di B&B Il Cortile a Casorate Sempione"
  borderRadius="xl"
  shadow="xl"
  display={{ base: "block", md: "none" }}
  w="100%"
  loading="lazy"
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/Gallery/Gallery.tsx src/components/Where/Where.tsx
git commit -m "perf: lazy-load Gallery route and add image lazy loading"
```

---

### Task 7: Replace Dependencies (Carousel CSS, react-in-viewport, MUI icons)

**Files:**
- Modify: `package.json`
- Modify: `src/index.tsx`
- Modify: `src/components/Carousel/Carousel.tsx`
- Modify: `src/components/Services/Services.tsx`
- Modify: `src/components/Info/Info.tsx`
- Modify: `src/components/Footer/Footer.tsx`
- Modify: `src/components/Gallery/Gallery.tsx`

- [ ] **Step 1: Install slick-carousel and react-intersection-observer, upgrade react-icons**

```bash
npm install slick-carousel react-intersection-observer react-icons@^5
```

- [ ] **Step 2: Import slick CSS in index.tsx and remove CDN links from Carousel.tsx**

In `src/index.tsx`, add these imports before the App import:
```tsx
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
```

In `src/components/Carousel/Carousel.tsx`, remove the two `<link>` tags (lines 32-42):
```tsx
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
```

- [ ] **Step 3: Replace react-in-viewport in Services.tsx**

Replace:
```tsx
import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
```

With:
```tsx
import { useInView } from "react-intersection-observer";
```

Update ServiceCard component:

Replace:
```tsx
const ServiceCard = ({ icon, title, text }: ServiceCardProps) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(
    ref,
    { rootMargin: "-50px" },
    { disconnectOnLeave: true },
    {}
  );

  return (
    <ScaleFade initialScale={0.9} in={enterCount > 0}>
      <Flex
        ref={ref}
```

With:
```tsx
const ServiceCard = ({ icon, title, text }: ServiceCardProps) => {
  const { ref, inView } = useInView({
    rootMargin: "-50px 0px",
    triggerOnce: true,
  });

  return (
    <ScaleFade initialScale={0.9} in={inView}>
      <Flex
        ref={ref}
```

- [ ] **Step 4: Replace MUI icons in Gallery.tsx**

Replace:
```tsx
import backButtonIcon from "@mui/icons-material/ArrowBack";
```

With:
```tsx
import { FiArrowLeft } from "react-icons/fi";
```

Update usage — change `<Icon as={backButtonIcon} w={6} h={6} />` to `<FiArrowLeft size={24} />`.

- [ ] **Step 5: Replace MUI icons in Info.tsx**

Replace:
```tsx
import whatsappIcon from "@mui/icons-material/WhatsApp";
import mailIcon from "@mui/icons-material/MailOutline";
import phoneIcon from "@mui/icons-material/PhoneOutlined";
```

With:
```tsx
import { FiMail, FiPhone } from "react-icons/fi";
import { SiWhatsapp } from "react-icons/si";
```

Update `contactButtons`:
```tsx
const contactButtons = [
  { action: "email", icon: FiMail, label: "Email" },
  { action: "phone", icon: FiPhone, label: t("call") },
  { action: "whatsapp", icon: SiWhatsapp, label: "WhatsApp" },
];
```

Remove the `IconType` import from react-icons (no longer needed if using react-icons v5 directly).

- [ ] **Step 6: Replace MUI icons in Services.tsx**

Replace:
```tsx
import parkingIcon from "@mui/icons-material/LocalParkingOutlined";
import airportShuttleIcon from "@mui/icons-material/AirportShuttleOutlined";
import breakfastIcon from "@mui/icons-material/BakeryDiningOutlined";
import wifiIcon from "@mui/icons-material/Wifi";
import airConditioningIcon from "@mui/icons-material/AcUnitOutlined";
import petFriendlyIcon from "@mui/icons-material/PetsOutlined";
import { IconType } from "react-icons";
```

With:
```tsx
import { MdLocalParking, MdAirportShuttle, MdBakeryDining, MdAcUnit, MdPets } from "react-icons/md";
import { FiWifi } from "react-icons/fi";
import { IconType } from "react-icons";
```

Update services array — replace the icon references:
```tsx
const services: Array<ServiceCardProps> = [
  { icon: MdAirportShuttle, title: t("airportShuttle"), text: t("airportShuttleText") },
  { icon: MdLocalParking, title: t("parking"), text: t("parkingText") },
  { icon: MdBakeryDining, title: t("breakfast"), text: t("breakfastText") },
  { icon: MdPets, title: t("petFriendly"), text: t("petFriendlyText") },
  { icon: FiWifi, title: t("wifi"), text: t("wifiText") },
  { icon: MdAcUnit, title: t("airConditioning"), text: t("airConditioningText") },
];
```

Remove the `as IconType` casts since react-icons v5 types work directly.

- [ ] **Step 7: Replace MUI icons in Footer.tsx**

Replace:
```tsx
import mailIcon from "@mui/icons-material/MailOutline";
import phoneIcon from "@mui/icons-material/PhoneOutlined";
import whereIcon from "@mui/icons-material/PinDropOutlined";
import privacyIcon from "@mui/icons-material/PrivacyTipOutlined";
import codeIcon from "@mui/icons-material/Code";
```

With:
```tsx
import { FiMail, FiPhone, FiMapPin, FiShield, FiCode } from "react-icons/fi";
```

Update all `as={mailIcon}` → `as={FiMail}`, `as={phoneIcon}` → `as={FiPhone}`, `as={whereIcon}` → `as={FiMapPin}`, `as={privacyIcon}` → `as={FiShield}`, `as={codeIcon}` → `as={FiCode}`.

- [ ] **Step 8: Remove MUI packages**

```bash
npm uninstall @mui/icons-material @mui/material react-in-viewport
```

- [ ] **Step 9: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: replace MUI icons with react-icons, add slick-carousel CSS locally, use react-intersection-observer"
```

---

### Task 8: CRA → Vite Migration

**Files:**
- Create: `vite.config.ts`
- Create: `src/vite-env.d.ts`
- Modify: `index.html` (move from public/ to root)
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `src/index.tsx`
- Delete: `src/serviceWorker.ts`
- Delete: `src/reportWebVitals.ts`
- Delete: `src/ColorModeSwitcher.tsx`
- Delete: `src/Logo.tsx`
- Delete: `src/react-app-env.d.ts`

- [ ] **Step 1: Install Vite and plugins**

```bash
npm install --save-dev vite @vitejs/plugin-react vite-plugin-svgr
```

- [ ] **Step 2: Create vite.config.ts**

Create `vite.config.ts` in the project root:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
});
```

- [ ] **Step 3: Move and update index.html**

Copy `public/index.html` to the project root as `index.html`. Make these changes:

1. Remove all `%PUBLIC_URL%/` references → replace with `/`:
   - `%PUBLIC_URL%/logo.png` → `/logo.png`
   - `%PUBLIC_URL%/manifest.json` → `/manifest.json`

2. Add the Vite entry script inside `<body>`, after `<div id="root">`:
```html
<div id="root"></div>
<script type="module" src="/src/index.tsx"></script>
```

Delete the old `public/index.html`.

- [ ] **Step 4: Create vite-env.d.ts**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
```

Delete `src/react-app-env.d.ts`.

- [ ] **Step 5: Update tsconfig.json**

Replace `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client", "vite-plugin-svgr/client"]
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Update package.json scripts**

Replace the `scripts` section:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

- [ ] **Step 7: Clean up index.tsx**

In `src/index.tsx`, remove CRA boilerplate:

```tsx
import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App";
import "./i18n";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 8: Delete dead CRA files**

```bash
rm src/serviceWorker.ts src/reportWebVitals.ts src/ColorModeSwitcher.tsx src/Logo.tsx src/react-app-env.d.ts
```

- [ ] **Step 9: Remove react-scripts**

```bash
npm uninstall react-scripts
```

- [ ] **Step 10: Update types.d.ts if needed**

Check `src/types.d.ts` for any CRA-specific declarations. If it has module declarations for images/css, keep those — Vite handles them but the types still help TypeScript:

Read the file and ensure image/css module declarations are preserved. If it only had CRA-specific stuff, update to work with Vite.

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on port 3000, app loads correctly.

- [ ] **Step 12: Verify build works**

```bash
npm run build
```

Expected: Build succeeds, output in `build/` directory.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "build: migrate from Create React App to Vite"
```

---

### Task 9: WebP Image Conversion

**Files:**
- Modify: all `.jpg` files in `src/assets/` → convert to `.webp`
- Modify: `src/components/Gallery/Gallery.tsx` (all image imports)
- Modify: `src/components/Rooms/Rooms.tsx` (all image imports)
- Modify: `src/components/Hero/Hero.tsx` (hero image import)
- Modify: `src/components/RoomCard/RoomCard.tsx` (no import changes, receives via props)
- Modify: `src/components/Where/Where.tsx` (map images — these are PNG, also convert)

- [ ] **Step 1: Convert all JPG/PNG assets to WebP**

```bash
cd src/assets

# Convert all JPGs to WebP at 82% quality
for f in *.jpg; do
  npx --yes sharp-cli -i "$f" -o "${f%.jpg}.webp" -- webp --quality 82
done

# Convert Gallery subfolder JPGs
for f in Gallery/*.jpg; do
  npx --yes sharp-cli -i "$f" -o "${f%.jpg}.webp" -- webp --quality 82
done

# Convert PNG map images to WebP
for f in mapimage*.png; do
  npx --yes sharp-cli -i "$f" -o "${f%.png}.webp" -- webp --quality 85
done
```

Do NOT convert logo.png or logo-light.png (these are small, used in navbar, and transparency matters).
Do NOT convert SVG flag files.

- [ ] **Step 2: Verify conversion worked**

```bash
ls -la src/assets/*.webp src/assets/Gallery/*.webp
```

Expected: All .webp files exist alongside originals.

- [ ] **Step 3: Update imports in Gallery.tsx**

Change all `.jpg` imports to `.webp`:
```tsx
import doubleRoom from "../../assets/doubleRoom.webp";
import double1 from "../../assets/double1.webp";
import double2 from "../../assets/double2.webp";
import double3 from "../../assets/double3.webp";
import double4 from "../../assets/double4.webp";
import double5 from "../../assets/double5.webp";
import double6 from "../../assets/double6.webp";

import familyRoom from "../../assets/familyRoom.webp";
import family1 from "../../assets/family1.webp";
import family2 from "../../assets/family2.webp";
import family3 from "../../assets/family3.webp";
import family4 from "../../assets/family4.webp";
import family5 from "../../assets/family5.webp";
import family6 from "../../assets/family6.webp";
import family7 from "../../assets/family7.webp";
import family8 from "../../assets/family8.webp";
import family9 from "../../assets/family9.webp";

import Giardino1 from "../../assets/HeroImg.webp";
import Giardino2 from "../../assets/Gallery/giardino2.webp";
import Giardino3 from "../../assets/Gallery/giardino3.webp";
import Giardino4 from "../../assets/Gallery/giardino4.webp";
import Giardino5 from "../../assets/Gallery/giardino5.webp";
import Giardino6 from "../../assets/Gallery/giardino6.webp";
import Giardino7 from "../../assets/Gallery/giardino7.webp";
import Giardino8 from "../../assets/Gallery/giardino8.webp";
import Giardino9 from "../../assets/Gallery/giardino9.webp";
```

- [ ] **Step 4: Update imports in Rooms.tsx**

Change all `.jpg` imports to `.webp`:
```tsx
import doubleRoom from "../../assets/doubleRoom.webp";
import double1 from "../../assets/double1.webp";
import double2 from "../../assets/double2.webp";
import double3 from "../../assets/double3.webp";
import double4 from "../../assets/double4.webp";
import double5 from "../../assets/double5.webp";
import double6 from "../../assets/double6.webp";

import familyRoom from "../../assets/familyRoom.webp";
import family1 from "../../assets/family1.webp";
import family2 from "../../assets/family2.webp";
import family3 from "../../assets/family3.webp";
import family4 from "../../assets/family4.webp";
import family5 from "../../assets/family5.webp";
import family6 from "../../assets/family6.webp";
import family7 from "../../assets/family7.webp";
import family8 from "../../assets/family8.webp";
import family9 from "../../assets/family9.webp";
```

- [ ] **Step 5: Update import in Hero.tsx**

```tsx
import heroImg from "../../assets/HeroImg.webp";
```

- [ ] **Step 6: Update imports in Where.tsx**

```tsx
import map from "../../assets/mapimage.webp";
import mapMobile from "../../assets/mapimage-mobile.webp";
```

- [ ] **Step 7: Remove original JPG/PNG image files**

```bash
cd src/assets
rm -f *.jpg Gallery/*.jpg mapimage.png mapimage-mobile.png
```

Keep: `logo.png`, `logo-light.png`, `*.svg`, `*.pdf`

- [ ] **Step 8: Add webp module declaration**

In `src/types.d.ts`, add if not already present:
```ts
declare module "*.webp" {
  const src: string;
  export default src;
}
```

- [ ] **Step 9: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Check that the total asset size is much smaller:
```bash
du -sh build/
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "perf: convert images to WebP, reduce assets from 45MB to ~5MB"
```

---

### Task 10: Final Cleanup

**Files:**
- Modify: `src/components/Gallery/Gallery.css`
- Remove unused imports/files

- [ ] **Step 1: Update Gallery.css hardcoded color**

In `Gallery.css:3`, change `background-color: #FAF7F2 !important;` — this can't use a JS token, but it should match `backgroundBrown`. Since the value is the same, just add a CSS comment:

```css
html {
  scroll-behavior: smooth;
  background-color: #FAF7F2 !important; /* matches backgroundBrown token */
}
```

- [ ] **Step 2: Remove Sidebar.css hardcoded color**

In `Sidebar.css:12`, `#C4724E` matches the `accent` token. Add a comment:

```css
.nav-link:hover::after {
  width: 100%;
  /* color matches accent token in Colors.tsx */
}
```

- [ ] **Step 3: Verify the app runs**

```bash
npm run dev
```

Manually check:
- Homepage loads (Hero, Rooms, Services, Where, Info, Footer)
- Gallery page loads (lazy loaded)
- Language switching works (IT/EN flags)
- Contact buttons are keyboard-navigable (Tab + Enter)
- Room cards are keyboard-navigable (Tab + Enter opens modal)
- Mobile hamburger menu works
- Gallery back button works
- All icons render correctly

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and CSS comments for hardcoded values"
```
