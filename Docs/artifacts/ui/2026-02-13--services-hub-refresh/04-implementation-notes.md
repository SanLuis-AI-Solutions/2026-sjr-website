# Implementation Notes (2026-02-13)

## Changes Implemented
- Removed the "Find your service" module to keep the Services hub cleaner (luxury-minimal, less clutter on mobile).
- Removed the mobile-collapsible directory experiment and kept the directory for desktop only (sticky on large screens).
- Standardized mobile sticky conversion bar labels across Services pages:
  - “Get Quote” + “Book”
- Updated Playwright smoke to validate a clean services -> featured detail flow:
  - File: `tests/smoke.spec.ts`
  - Test: click featured "View details" on `/services`, assert Watch Repair detail loads.

## Watch Repair Flagship Pass
- Added an above-the-fold “What happens next” module to `watch-repair`:
  - File: `src/app/services/[slug]/page.tsx`
  - Goal: make the expected flow and timing obvious without scrolling (mobile-first).
- Standardized turnaround display defaults:
  - Default: “Same Day or Next Day”
  - Exception: Custom Design: “7 business days”
- Removed “Last updated” from service detail hero (conversion-first; less visual noise).
- For Watch Repair specifically:
  - Removed the small Includes list in the right rail (kept Common requests + trust items).
  - Redesigned “What to expect” into separate sections (quick service, full service, repairs/parts) and added supporting imagery.

## Why
- 75%+ of traffic is mobile: discovery must be faster than scrolling through grouped sections.
- Reduced cognitive load by:
  - keeping the hero and category jump UI focused and calm,
  - using a single featured path to a flagship service detail page.

## Verification
- Local verification gate: `pwsh -File scripts/verify.ps1` (PASS)
- Playwright: `npm test` (PASS)
