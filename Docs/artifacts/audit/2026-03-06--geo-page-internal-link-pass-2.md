# Geo Page Internal Link Pass 2

## Metadata

- branch: `master`
- base commit reviewed: `02f2850`
- artifact path: `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass-2.md`
- implementation date: `2026-03-06`

## Goal

Feed the second geo-page ring with contextual internal links from the strongest matching commercial-intent articles.

## Implemented Changes

- `src/lib/blog.ts`
  - added second-ring geo links inside the existing `nextSteps` blocks for:
    - `cost-to-resize-gold-ring-pasadena` -> Friendswood
    - `can-a-severely-bent-ring-prong-be-fixed` -> Webster
    - `where-to-get-watch-battery-replaced-pasadena` -> Clear Lake
    - `safe-to-clean-vintage-diamond-ring-at-home` -> Friendswood
    - `heirloom-jewelry-restoration-repair-or-redesign` -> Clear Lake
- `tests/smoke.spec.ts`
  - expanded the article regression checks to require the new geo links on the relevant pages

## Why This Pass Matters

- it gives Webster, Friendswood, and Clear Lake crawl paths from pages that already target strong repair intent
- it keeps the geo pages tied to real customer problems instead of leaving them as isolated landing pages
- it reuses the live article CTA pattern instead of creating another content block

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

## Next Optimal Step

The next logical branch is measurement and setup work, not another content sprint:

1. wire and validate Google Search Console
2. wire and validate Google Analytics / GA4 conversions
3. then decide whether the next growth asset is:
   - a differentiated Houston strategy page or cluster
   - a local review / trust proof expansion
   - a Pasadena-area FAQ / content cluster refresh
