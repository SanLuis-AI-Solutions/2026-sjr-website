# Geo Page Internal Link Pass

## Metadata

- branch: `master`
- base commit reviewed: `9fc0e38`
- artifact path: `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass.md`
- implementation date: `2026-03-06`

## Goal

Strengthen the first geo service-area pages with contextual internal links from the highest-intent commercial blog posts.

## Implemented Changes

- `src/lib/blog.ts`
  - added Deer Park and La Porte geo-page links inside the existing `nextSteps` blocks for:
    - `cost-to-resize-gold-ring-pasadena`
    - `can-a-severely-bent-ring-prong-be-fixed`
    - `where-to-get-watch-battery-replaced-pasadena`
    - `safe-to-clean-vintage-diamond-ring-at-home`
    - `heirloom-jewelry-restoration-repair-or-redesign`
- `tests/smoke.spec.ts`
  - expanded article regression coverage to assert the new geo links render on mobile

## Why This Pass Matters

- it increases crawl and discovery paths into the new geo pages without adding thin nav clutter
- it ties location pages to real commercial-intent queries instead of leaving them as isolated local landers
- it strengthens GEO and AEO by connecting repair-intent questions to nearby-area guidance

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

## Next Optimal Step

Build the next adjacent-city geo pages:

1. `/services/webster`
2. `/services/friendswood`
3. `/services/clear-lake`

Houston should remain deferred until there is a more differentiated city-level angle.
