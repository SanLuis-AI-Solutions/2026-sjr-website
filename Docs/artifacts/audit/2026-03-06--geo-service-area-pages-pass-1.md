# Geo Service-Area Pages Pass 1

## Metadata

- branch: `master`
- base commit reviewed: `c660d89`
- artifact path: `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-1.md`
- implementation date: `2026-03-06`

## Goal

Launch the first substantive local service-area landing pages without creating thin doorway content.

## Implemented Pages

1. `/services/deer-park`
2. `/services/la-porte`

## Why These Cities First

- both are already named in the business service-area language
- both are geographically adjacent to the Pasadena storefront
- both are lower-risk, higher-intent GEO targets than a broad city like Houston
- both can be written with credible, useful local framing instead of generic city-name substitution

## Why Houston Did Not Ship In This Pass

Houston is much broader and more competitive. A good Houston page would need tighter positioning, stronger supporting proof, and more differentiated local intent framing to avoid reading like a thin catch-all city page.

Working rollout order:

1. Deer Park
2. La Porte
3. Webster / Friendswood if the first pattern performs well
4. Houston only after the smaller adjacent-city pattern is proven and the page can be truly substantive

## Implemented Changes

- `src/lib/service-areas.ts`
  - added shared structured content for Deer Park and La Porte
- `src/components/service-area-page.tsx`
  - added a reusable local landing-page renderer
  - includes `BreadcrumbList`, `FAQPage`, and `Service` schema
  - includes quick actions and internal service links
- `src/app/services/deer-park/page.tsx`
  - new static Deer Park geo page
- `src/app/services/la-porte/page.tsx`
  - new static La Porte geo page
- `src/app/services/page.tsx`
  - added an internal-link section for nearby service areas
- `tests/smoke.spec.ts`
  - added smoke coverage for both geo pages

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

Reasoning:

- the pages are substantive enough to be useful to users
- they strengthen GEO / AEO coverage around the actual storefront radius
- they are internally linked from the main services hub

## Next Optimal Step

Choose one of the following, in order:

1. build Webster and Friendswood using the same pattern if you want the next suburban ring
2. add supporting internal links from relevant blog posts into the new geo pages
3. defer Houston until there is a stronger, truly differentiated angle for a broader city page
