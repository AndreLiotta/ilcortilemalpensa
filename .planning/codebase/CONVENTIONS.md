# Coding Conventions

**Analysis Date:** 2026-03-26

## Naming Patterns

**Files:**
- Components: PascalCase directory with matching PascalCase `.tsx` file (e.g., `src/components/RoomCard/RoomCard.tsx`)
- CSS: Mixed casing — some match component name (`RoomCard.css`), some lowercase (`Sidebar.css` for `SideBar/` directory). Use the component name casing for new CSS files.
- Config/utility files at `src/` root: camelCase (e.g., `reportWebVitals.ts`, `serviceWorker.ts`)
- Translation files: PascalCase directories (`Translation/English/`, `Translation/Italian/`) with lowercase `translation.json`
- Type declarations: lowercase `types.d.ts`

**Functions:**
- Components: PascalCase function names matching their file (e.g., `function Hero()`, `function RoomCard()`)
- Helper functions inside components: camelCase (e.g., `openPdf()`, `infoButtonAction()`, `onClickLanguageChange()`)
- Sub-components: PascalCase, defined in the same file as the parent (e.g., `ServiceCard` in `Services.tsx`, `MobileNav` in `SideBar.tsx`, `GalleryPicture` in `Gallery.tsx`)

**Variables:**
- camelCase for all variables and state (e.g., `scrolled`, `linkItems`, `contactButtons`)
- Color/design token exports: camelCase (`headings`, `backgroundBrown`, `displayFont`) in `src/Colors.tsx`
- Image imports: camelCase (e.g., `doubleRoom`, `family1`, `heroImg`)
- Constants: camelCase, not UPPER_SNAKE_CASE (e.g., `const settings = {...}` in Carousel, `const SUPPORTED_LANGS` in App.tsx is the one exception)

**Types/Interfaces:**
- PascalCase with `Props` suffix for component props (e.g., `ServiceCardProps`, `MobileNavProps`, `SEOHeadProps`, `LinkItemProps`)
- Inline prop types used for simpler components instead of extracted interfaces (e.g., `RoomCard` uses `{ img: string; text: string; ... }` inline)

## Component Patterns

**Pattern:** All components are functional components using `function` declarations with `export default`.

**Standard component structure:**
```typescript
import { /* Chakra components */ } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { headings, textColor, accent, displayFont, bodyFont } from "../../Colors";
import "../Fonts.css";

export default function ComponentName() {
  const { t } = useTranslation();
  return (
    <Flex /* section wrapper props */ id="section-id">
      {/* Section title with decorative accent lines */}
      <Flex alignItems="center" gap="4" mb="4">
        <Box w="40px" h="1px" bg={accent} />
        <Text fontSize={{ base: "3xl", md: "5xl" }} fontFamily={displayFont} color={headings}>
          {t("sectionKey")}
        </Text>
        <Box w="40px" h="1px" bg={accent} />
      </Flex>
      {/* Section content */}
    </Flex>
  );
}
```

**Key conventions:**
- Use `export default function` for all top-level components — no named exports, no arrow function components at the top level
- Sub-components use `const` arrow functions (e.g., `const ServiceCard = ({ ... }: Props) => { ... }`)
- No `forwardRef` usage anywhere
- No custom hooks (all hook usage is inline)
- `useTranslation()` hook called at the top of every component that needs translated text
- State management: local `useState` only, no global state library

**Hooks used:**
- `useState` — for local UI state (scroll position, slider ref)
- `useEffect` — for scroll event listeners
- `useLayoutEffect` — for language synchronization (prevents flash)
- `useDisclosure` — Chakra UI hook for modal/drawer open/close
- `useBreakpointValue` — Chakra UI responsive values
- `useRef` — for viewport detection refs
- `useInViewport` — third-party hook for scroll-triggered animations
- `useTranslation` — i18next translations
- `useParams`, `useNavigate`, `useLocation` — React Router hooks

## Styling Approach

**Primary:** Chakra UI inline props for all layout, spacing, color, and responsive design.

**Responsive pattern:** Use Chakra's responsive object syntax consistently:
```typescript
fontSize={{ base: "md", md: "lg" }}
py={{ base: "12", md: "20" }}
direction={{ base: "column", md: "row" }}
display={{ base: "flex", md: "none" }}
```

**Design tokens:** Imported from `src/Colors.tsx` — never hardcode color values inline. The tokens are:
- `headings` — dark olive green `#3B4A2B`
- `backgroundBrown` — warm cream `#FAF7F2`
- `light` — light beige `#F0ECE3`
- `navBackground` — semi-transparent olive `rgba(59, 74, 43, 0.92)`
- `accent` — terracotta `#C4724E`
- `textColor` — dark brown `#2D2A26`
- `displayFont` — `'DM Serif Display', serif`
- `bodyFont` — `'Source Sans 3', sans-serif`

**Exception:** Some components hardcode `#FAF7F2` and `rgba(59, 74, 43, ...)` variants directly instead of using the token. New code should always use the token imports.

**CSS files:** Used sparingly for things Chakra props cannot handle:
- Keyframe animations (`src/components/Hero/Hero.css`)
- Hover state on child elements via parent class (`src/components/RoomCard/RoomCard.css`, `src/components/Gallery/Gallery.css`)
- Global scroll behavior and base styles (`src/components/Gallery/Gallery.css`)
- CSS class names use kebab-case (e.g., `hero-fade-in`, `room-card-image`, `gallery-item`)

**Shared CSS:** `src/components/Fonts.css` is imported by most components but contains only a comment (fonts are loaded via `<link>` tags in `public/index.html`). Continue importing it in new components for consistency.

**Icons:** Two icon libraries are used:
- `@mui/icons-material` — for service/utility icons (parking, wifi, mail, etc.), imported as default imports
- `react-icons` — for UI chrome icons (`FiMenu`, `FiChevronDown`, `BiLeftArrowAlt`), imported as named imports
- MUI icons are cast to `IconType` from `react-icons` when passed to Chakra's `Icon` component `as` prop

## Import Organization

**Order (observed pattern):**
1. React imports (`import * as React from 'react'`, `import { useState, useEffect } from "react"`)
2. React Router imports (`useNavigate`, `useParams`, etc.)
3. Chakra UI imports (destructured from `@chakra-ui/react`)
4. Third-party library imports (`react-i18next`, `react-slick`, `react-in-viewport`)
5. MUI icon imports (individual default imports from `@mui/icons-material/*`)
6. react-icons imports (named imports)
7. Local color/design token imports from `../../Colors`
8. CSS imports (`./Component.css`, `../Fonts.css`)
9. Asset imports (images, PDFs)
10. Local component imports

**Quote style:** Double quotes for all imports (no single quotes except in `src/Colors.tsx` export values and some newer files like `SEOHead.tsx` and `i18n.tsx` which use single quotes).

**Path style:** Relative paths only — no path aliases configured. Typically `../../` for shared files.

**Export style:** `export default function` for all components. No barrel files (`index.ts`). No named exports for components.

## TypeScript Usage

**Strictness:** `strict: true` in `tsconfig.json`, target ES5, JSX react-jsx.

**Type annotations:**
- Interfaces defined for component props when they have 2+ non-trivial props (e.g., `ServiceCardProps`, `MobileNavProps`, `LinkItemProps`, `SEOHeadProps`)
- Inline type annotations for simple components (e.g., `RoomCard` uses `{ img: string; text: string; ... }` inline in function params)
- Array type annotations explicit: `const familyRoomCards: string[] = [...]`
- Type parameter on `useParams<{ lang: string }>` consistently used

**Weak spots:**
- `any` used in `src/components/Gallery/Gallery.tsx`: `const pictures: any[] = [...]` and `function renderPicOrTitle(pic: any, ...)`
- MUI icons cast as `IconType` which is a type mismatch workaround
- `types.d.ts` only declares `*.pdf` module — no other custom type declarations

**Patterns:**
- Use `type` for simple aliases (e.g., `type Page = 'home' | 'gallery'`)
- Use `interface` for object shapes and component props
- `Record<string, Record<Page, SEOMeta>>` used for typed lookup maps

## Error Handling

**Strategy:** Minimal explicit error handling.

- `src/index.tsx` has a null check: `if (!container) throw new Error("Failed to find the root element")`
- `src/App.tsx` uses `<Navigate>` for invalid language routes — redirects to `/it/`
- No try/catch blocks anywhere in the codebase
- No error boundaries
- No loading states or fallback UI
- External links use `window.open()` without error handling

## Logging

**Framework:** None. No `console.log`, `console.error`, or logging library used in component code.

**Web Vitals:** `reportWebVitals.ts` exists (CRA default) but is called without a callback function, so it effectively does nothing.

## Comments

**When used:**
- Section markers within JSX: `{/* Section title */}`, `{/* Hero content */}`, `{/* Desktop title */}`
- Brief explanations: `{/* Dark gradient overlay */}`, `{/* Pill-shaped contact buttons */}`

**Style:** JSX comment syntax `{/* ... */}` for inline section markers. No JSDoc or TSDoc on any function or interface.

**Guideline for new code:** Add JSX section comments for major visual blocks within a component. No function-level documentation expected.

## Function Design

**Size:** Components range from 20-200 lines. No explicit limit but components are generally single-section views.

**Parameters:** Props are destructured in the function signature. Use interface for 3+ props; inline for fewer.

**Return values:** Components always return JSX. Helper functions (e.g., `openPdf`, `infoButtonAction`) return void and trigger side effects via `window.open()`.

## Module Design

**Exports:** One default export per file. No barrel files. No re-exports.

**Shared modules:**
- `src/Colors.tsx` — design tokens (named exports)
- `src/i18n.tsx` — i18next configuration (default export, imported for side effects)
- `src/test-utils.tsx` — custom render wrapper (named export)

---

*Convention analysis: 2026-03-26*
