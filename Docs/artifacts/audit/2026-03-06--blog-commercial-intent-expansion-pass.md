# Blog Commercial-Intent Expansion Pass

## Metadata

- branch: `master`
- base commit reviewed: `5d206fb`
- artifact path: `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass.md`
- implementation date: `2026-03-06`

## Goal

Improve SEO, GEO, AEO, and conversion readiness on the highest-intent existing blog posts before creating new net-new content.

## Chosen Posts

The first expansion pass focused on the most commercial local-intent articles already live in the site:

1. `/blog/cost-to-resize-gold-ring-pasadena`
2. `/blog/where-to-get-watch-battery-replaced-pasadena`
3. `/blog/can-a-severely-bent-ring-prong-be-fixed`

Reasoning:

- they sit closest to quote and booking intent
- they map directly to core revenue services
- they were the thinnest high-intent entries in the current blog inventory

## Implemented Changes

### Data model expansion

- `src/lib/blog.ts`
  - added optional article FAQ support
  - added optional in-article next-step links

### Article template expansion

- `src/app/blog/[slug]/page.tsx`
  - renders an in-body FAQ block when article FAQ data exists
  - emits `FAQPage` JSON-LD for those articles
  - renders a dedicated next-step internal-link block in the article body

### Content expansion

- expanded the 3 target posts with:
  - more local detail for Pasadena / Deer Park intent
  - more decision-support content
  - clearer repair-vs-replace guidance
  - stronger internal routing into service pages, quote, and booking flows

### Regression coverage

- `tests/smoke.spec.ts`
  - added a targeted smoke check for the commercial ring-sizing article
  - verifies the in-body FAQ block and next-step links render

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

Reasoning:

- this is a low-risk depth improvement on existing high-intent pages
- it strengthens answer extraction and internal conversion paths without changing route structure
- it creates a reusable article pattern for the rest of the content library

## Next Optimal Step

Apply the same pattern to the next tier of local/commercial content:

1. expand `safe-to-clean-vintage-diamond-ring-at-home`
2. expand `heirloom-jewelry-restoration-repair-or-redesign`
3. then build the first geo-expansion service-area pages for Deer Park and La Porte
