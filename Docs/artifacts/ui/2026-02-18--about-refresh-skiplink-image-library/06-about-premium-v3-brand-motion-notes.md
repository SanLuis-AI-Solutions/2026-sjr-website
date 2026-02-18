# About Page Premium v3 — Brand & Motion Polish
Date: 2026-02-18

## Trigger
User feedback on v2:
- Manifesto section color felt off-brand (too dark brown).
- Page still needed stronger motion polish and requested parallax.

## Changes
- `src/app/about/page.tsx`
  - Changed manifesto section to strict brand burgundy treatment.
  - Added reveal-on-scroll animation classes to major sections and cards.
  - Added a new parallax heritage section using `parallax-hero` fixed-background behavior (desktop).
  - Kept CTA hierarchy and accessibility semantics intact.

## Verification
- `npm run lint` PASS (0 errors, 3 existing script warnings)
- `npm test` PASS (13/13)
- `pwsh -File scripts/verify.ps1` PASS

## Notes
- Parallax effect is intentionally desktop-forward; mobile remains stable/readable and does not force fixed background behavior.
- Brand color system remains aligned to `#7A2E3A` / `#5E2230` / `#D1B882` with no off-brand section blocks.
