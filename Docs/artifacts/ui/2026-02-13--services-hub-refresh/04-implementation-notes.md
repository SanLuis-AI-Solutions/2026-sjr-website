# Implementation Notes (2026-02-13)

## Changes Implemented
- Removed the "Find your service" module to keep the Services hub cleaner (luxury-minimal, less clutter on mobile).
- Removed the mobile-collapsible directory experiment and kept the directory for desktop only (sticky on large screens).
- Standardized mobile sticky conversion bar labels across Services pages:
  - “Get Quote” + “Book”
- Updated Playwright smoke to validate a clean services -> featured detail flow:
  - File: `tests/smoke.spec.ts`
  - Test: click featured "View details" on `/services`, assert Watch Repair detail loads.
- Services hub: simplified per-service cards to look less “buttony”:
  - Make the full card the single, obvious clickable surface.
  - Replace the three mini “stat boxes” with a clean inline meta row (Starting at / Turnaround / Popular).
  - Remove the extra “Get quote →” link from the Featured section (keeps discovery calmer).
- Services hub: removed the small category tiles under the hero image (cleaner, less cluttered).
- Services hub: upgraded each service card to a more “featured-like” split layout:
  - Clearer hierarchy (eyebrow + larger title + summary).
  - Meta chips for Starting at / Turnaround / Popular (scannable, premium).
  - Dedicated image panel with subtle zoom-on-hover.
  - Removed the “Tap anywhere” helper text (felt cheap/technical).
- Services hub: wrapped each category block inside a premium container (rounded card + subtle shadow) so browsing feels more like designed “banners” than a plain directory.

## Watch Repair Flagship Pass
- Added a dedicated “How it works / What happens next” section to `watch-repair` (moved out of the hero):
  - File: `src/app/services/[slug]/page.tsx`
  - Goal: make the flow and approval point obvious with clean sectioning (mobile-first).
- Watch Repair: moved “Why customers choose us” into its own trust section (separate from Pricing & timing).
- Watch Repair: refreshed FAQs to avoid repeated topics and better match high-intent queries (battery cost/time, crystal replacement, crown/stem repair, water resistance testing, mechanical service, appointment).
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
