# Geo Service-Area Pages Pass 2

## Metadata

- branch: `master`
- base commit reviewed: `9e3510d`
- artifact path: `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-2.md`
- implementation date: `2026-03-06`

## Goal

Expand the proven geo-page pattern to the next nearby city ring without introducing a new page system.

## Implemented Pages

1. `/services/webster`
2. `/services/friendswood`
3. `/services/clear-lake`

## Why These Areas Shipped Next

- they are the next logical nearby ring after Deer Park and La Porte
- they extend real repair-intent coverage without jumping straight into a broad Houston page
- they reuse the same substantive local-landing-page pattern instead of creating thin city-name swaps

## Why Houston Still Did Not Ship

Houston is broader, more competitive, and more likely to become thin if treated as a simple adjacent-city page. A Houston asset should be a more differentiated city-level page or cluster, not a copy of the suburban template.

## Implemented Changes

- `src/lib/service-areas.ts`
  - added Webster, Friendswood, and Clear Lake entries
  - added `cardDescription` so the services hub can render the area cards from shared data
  - added `areaSchemaType` support so Clear Lake can use `Place` in structured data instead of `City`
- `src/components/service-area-page.tsx`
  - made `areaServed` schema type data-driven
- `src/app/services/webster/page.tsx`
  - new static Webster geo page
- `src/app/services/friendswood/page.tsx`
  - new static Friendswood geo page
- `src/app/services/clear-lake/page.tsx`
  - new static Clear Lake geo page
- `src/app/services/page.tsx`
  - converted the nearby-area card grid to render from `SERVICE_AREA_PAGES`
- `tests/smoke.spec.ts`
  - expanded geo-page smoke coverage from 2 routes to 5 routes

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

## Next Optimal Step

Strengthen the second geo ring with contextual internal links from matching blog posts and then evaluate whether the next location asset should be:

1. a stronger Houston-area concept
2. a Pasadena-adjacent FAQ/content cluster
3. a local-review / trust proof expansion
