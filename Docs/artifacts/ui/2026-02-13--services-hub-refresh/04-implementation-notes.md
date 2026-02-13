# Implementation Notes (2026-02-13)

## Changes Implemented
- Added a mobile-first "Find your service" module to the Services hero:
  - File: `src/components/service-finder.tsx`
  - Integrated in: `src/app/services/page.tsx`
  - Behavior:
    - Empty state shows curated suggestions (all 9 services in scanning order).
    - Typing filters and shows matching service cards (max 9).
- Converted the Services directory sidebar to be mobile-collapsible:
  - Mobile uses a `<details>` accordion so the page doesn’t feel heavy before users reach the content.
  - Desktop keeps the sticky directory for quick category jumping.
- Standardized mobile sticky conversion bar labels across Services pages:
  - “Get Quote” + “Book”
- Updated Playwright smoke to cover the new finder flow:
  - File: `tests/smoke.spec.ts`
  - Test: search "watch" on `/services`, click result, assert Watch Repair detail loads.

## Watch Repair Flagship Pass
- Added an above-the-fold “What happens next” module to `watch-repair`:
  - File: `src/app/services/[slug]/page.tsx`
  - Goal: make the expected flow and timing obvious without scrolling (mobile-first).
- Standardized turnaround display defaults:
  - Default: “Same Day or Next Day”
  - Exception: Custom Design: “7 business days”

## Why
- 75%+ of traffic is mobile: discovery must be faster than scrolling through grouped sections.
- Reduced cognitive load by:
  - collapsing navigation chrome on mobile,
  - adding a single-purpose finder that routes directly to the right service detail.

## Verification
- Local verification gate: `pwsh -File scripts/verify.ps1` (PASS)
- Playwright: `npm test` (PASS)
