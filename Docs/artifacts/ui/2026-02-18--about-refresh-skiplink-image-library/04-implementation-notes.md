# Implementation Notes — About Refresh + Skip-Link Fix + Service Visual Library
Date: 2026-02-18

## Scope
- Redesign `/about` to a less basic, premium editorial composition while preserving mobile CTA clarity.
- Fix reported skip-link visual flash overlapping the brand text during route navigation.
- Replace ad-hoc service-detail image rotation with a dedicated per-service visual mapping to reduce repeated image patterns.

## Inputs
- User feedback: About page looked "too boring and basic".
- User feedback: "Skip to Main Content" banner was flashing over the header during navigation.
- Existing asset constraints: Supabase `site-assets` currently exposes 15 public images.

## What Changed
- `src/app/about/page.tsx`
  - Rebuilt page structure with a hero mosaic, standards section, timeline, and stronger contact/visit layout.
  - Kept the primary H1 and mobile-first `Get Fast Quote`/`Book Repair` CTA hierarchy.
  - Added a distinct `Visit quick actions` region label to avoid duplicate landmark ambiguity.

- `src/components/site-shell.tsx`
  - Updated skip-link reveal behavior from generic `focus` to `focus-visible` only.
  - Result: skip link still supports keyboard users while preventing mouse/touch navigation flash behavior.

- `src/lib/service-visuals.ts` (new)
  - Added explicit slug-based visual blueprints for each service detail page.
  - Replaced dynamic "next services" image rotation logic with deterministic, intentional image composition.

- `src/app/services/[slug]/page.tsx`
  - Removed inline image-rotation function.
  - Imported and used centralized `buildServiceVisualSet` from `src/lib/service-visuals.ts`.

- `tests/smoke.spec.ts`
  - Updated core-pages quick-action region locator to exact landmark label matching for About page changes.

## Verification Evidence
- `npm run lint` -> PASS (0 errors, 3 pre-existing warnings in airtable scripts).
- `npm test` -> PASS (`13 passed`).
- `pwsh -File scripts/verify.ps1` -> PASS (exit code 0).
- `pwsh -File scripts/audit-images.ps1` -> PASS (`OK: 15/15`).

## Notes / Constraints
- Current image-library quality ceiling remains: only 15 public `site-assets` images are currently available.
- Final premium polish still requires a dedicated per-service photo upload set (3-4 unique photos per service).
