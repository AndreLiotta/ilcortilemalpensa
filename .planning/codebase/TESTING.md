# Testing Patterns

**Analysis Date:** 2026-03-26

## Test Framework

**Runner:**
- Jest (via `react-scripts test`, CRA default)
- Config: embedded in CRA — no standalone `jest.config.*` file

**Assertion Library:**
- `@testing-library/jest-dom` (v5.16.5) — extended DOM matchers
- `@testing-library/react` (v13.4.0) — React component rendering
- `@testing-library/user-event` (v14.4.3) — user interaction simulation (installed but unused)

**Run Commands:**
```bash
npm test                 # Run tests in watch mode (CRA default)
npm test -- --coverage   # Run with coverage report
npm test -- --watchAll=false  # Run once without watch (CI mode)
```

## Test File Organization

**Location:**
- Co-located pattern: test files sit next to source files at `src/` root level
- Only one test file exists: `src/App.test.tsx`

**Naming:**
- Pattern: `{ComponentName}.test.tsx`

**Structure:**
```
src/
├── App.test.tsx          # Only test file (entirely commented out)
├── setupTests.ts         # Jest DOM import
└── test-utils.tsx         # Custom render with ChakraProvider
```

## Test Structure

**Current state:** The codebase has effectively zero tests. The single test file `src/App.test.tsx` is entirely commented out and exports an empty object to avoid TypeScript errors:

```typescript
// import React from "react"
// import { screen } from "@testing-library/react"
// import { render } from "./test-utils"
// import App from "./App"

// test("renders learn react link", () => {
//   render(<App />)
//   const linkElement = screen.getByText(/learn chakra/i)
//   expect(linkElement).toBeInTheDocument()
// })

export {}
```

**Test utilities setup:**
- `src/setupTests.ts` — imports `@testing-library/jest-dom` for extended matchers
- `src/test-utils.tsx` — provides a custom `render` function that wraps components in `ChakraProvider`:

```typescript
const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }
```

**Note:** The custom render wrapper only includes `ChakraProvider`. It does NOT include:
- `BrowserRouter` (needed for components using `useParams`, `useNavigate`)
- `HelmetProvider` (needed for `SEOHead`)
- i18next provider (needed for `useTranslation`)

Any new tests will need an updated `test-utils.tsx` that wraps all required providers.

## Mocking

**Framework:** Jest built-in mocking (via CRA)

**Patterns:** No mocking patterns established in the codebase.

**What would need mocking for this project:**
- `window.open()` calls in `Footer.tsx`, `Where.tsx`, `Info.tsx`
- `window.scrollTo()` calls in `SideBar.tsx`
- `window.addEventListener("scroll", ...)` in `SideBar.tsx`, `Hero.tsx`
- `react-slick` Slider component in `Carousel.tsx`
- `react-in-viewport` useInViewport hook in `Services.tsx`
- Image/asset imports (CRA handles this via `moduleNameMapper` by default)

## Fixtures and Factories

**Test Data:** None established.

**Translation data:** Translation JSON files at `src/Translation/English/translation.json` and `src/Translation/Italian/translation.json` could serve as fixture data for i18n testing.

## Coverage

**Requirements:** None enforced. No coverage thresholds configured.

**View Coverage:**
```bash
npm test -- --coverage --watchAll=false
```

## Test Types

**Unit Tests:**
- None exist. The infrastructure (Jest + RTL + custom render) is in place but unused.

**Integration Tests:**
- None exist.

**E2E Tests:**
- Not configured. No Cypress, Playwright, or similar framework installed.

## Testing Gaps (Critical)

**Every component is untested.** Priority areas for testing:

**High Priority:**
- `src/App.tsx` — Route handling, language redirect logic, `LangSync` behavior
- `src/components/SEOHead/SEOHead.tsx` — Meta tag generation, structured data, hreflang correctness
- `src/i18n.tsx` — URL-based language detection at init

**Medium Priority:**
- `src/components/SideBar/SideBar.tsx` — Scroll-based navbar visibility, language switching, mobile drawer
- `src/components/RoomCard/RoomCard.tsx` — Modal open/close, carousel integration
- `src/components/Info/Info.tsx` — Contact button actions (`window.open` calls)
- `src/components/Footer/Footer.tsx` — Privacy policy PDF link by language

**Lower Priority (primarily visual):**
- `src/components/Hero/Hero.tsx` — Static display component
- `src/components/Rooms/Rooms.tsx` — Static display with card composition
- `src/components/Services/Services.tsx` — Service card grid with viewport animation
- `src/components/Where/Where.tsx` — Static display with map link
- `src/components/Gallery/Gallery.tsx` — Image grid rendering
- `src/components/Carousel/Carousel.tsx` — Slider wrapper

## Required Test Infrastructure Updates

To write meaningful tests, `src/test-utils.tsx` needs to be updated:

```typescript
import * as React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "../i18n";  // Initialize i18next

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </BrowserRouter>
  </HelmetProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
```

## Common Patterns (to establish)

**Async Testing:** Not yet needed — no async data fetching in the app.

**Error Testing:** No error boundaries or error states exist to test.

**Snapshot Testing:** Could be useful for SEO meta tags (`SEOHead`) to catch regressions in structured data output.

---

*Testing analysis: 2026-03-26*
