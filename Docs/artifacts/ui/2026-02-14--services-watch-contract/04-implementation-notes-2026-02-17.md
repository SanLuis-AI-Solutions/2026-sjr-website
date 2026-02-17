# Implementation Notes (2026-02-17)

Scope:
- `src/app/services/page.tsx`
- `src/app/services/[slug]/page.tsx`

What changed:
- Ran a Web Interface Guidelines + mobile accessibility review and fixed high-impact issues:
  - Added visible `focus-visible` treatment to primary/secondary CTAs and key navigational links.
  - Added global skip-link support via `SiteShell` (`#main-content`) for keyboard users.
  - Normalized Services hub category semantics (category heading is now a heading; description moved to supporting paragraph).
- Standardized timing wording to **“Same Day/Next Day service”** where it is used as service/timing UI copy.
- Upgraded `/services/ring-sizing` to the flagship detail pattern:
  1. Hero
  2. How it works
  3. What to expect
  4. Pricing & timing
  5. Why customers choose us
  6. FAQs
  7. Related services + CTA band
- Preserved `custom-design` timing exception (`7 business days`) in the shared detail template.
- Strengthened FAQ quality for ring sizing with intent-driven supplemental Q&A and dedupe keys; minimum FAQ enforcement now treats ring sizing as flagship (target 7).
- For flagship services (Watch Repair + Ring Sizing), removed the mid-page Service Area block so section order remains contract-compliant.

Verification:
- `npm run lint` (PASS; warnings only in non-critical scripts)
- `npm run test` (PASS)
  - Includes existing mobile smoke tests + new ring-sizing flagship section smoke test.
- `pwsh -File scripts/verify.ps1` (PASS)
- Direct URL image audit on services/watch/ring assets (all HTTP 200).
