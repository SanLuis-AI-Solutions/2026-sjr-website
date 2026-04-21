# Codex Instructions — April 21, 2026

**Status:** False alarm resolved  
**Priority:** Use valid URLs for GSC inspection, do not treat this as a production blog-routing outage

## Executive Summary

Production verification on 2026-04-21 does **not** support a site-wide `/blog/[slug]` routing failure.

The earlier 404 claim came from inspecting a slug that does not exist in the production blog dataset:

- `/blog/how-much-does-jewelry-repair-cost-pasadena` → `404`

Real published commercial blog URLs are accessible on production:

- `/blog/cost-to-resize-gold-ring-pasadena` → `200`
- `/blog/how-much-does-pearl-restringing-cost-pasadena` → `200`
- `/blog/does-my-watch-need-battery-or-repair-pasadena` → `200`

## What This Means

- Batch 6 blog improvements are live.
- The blog route is working for actual slugs.
- The immediate follow-up should be GSC inspection and indexing requests for **real** URLs.
- Geo-page indexing is still a real monitoring concern.

## Required Actions

1. Use valid blog URLs in Search Console inspections.
2. Stop using `/blog/how-much-does-jewelry-repair-cost-pasadena` as a sample target unless that page is intentionally created later.
3. Keep `Docs/GSC_INSPECTION_FINDINGS_APR21.md` and `Docs/INDEXING_DIAGNOSIS.md` aligned with the real production slugs.
4. Continue monitoring crawl/indexing outcomes after Batch 6 deployment.

## Verification Basis

Production fetch checks on 2026-04-21:

```text
404  https://www.susiesjewelryrepair.com/blog/how-much-does-jewelry-repair-cost-pasadena
200  https://www.susiesjewelryrepair.com/blog/cost-to-resize-gold-ring-pasadena
200  https://www.susiesjewelryrepair.com/blog/how-much-does-pearl-restringing-cost-pasadena
200  https://www.susiesjewelryrepair.com/blog/does-my-watch-need-battery-or-repair-pasadena
```

Repo verification:

- `src/app/blog/[slug]/page.tsx` exists and uses `generateStaticParams()`
- `src/lib/blog.ts` contains the real published blog slugs above
- The nonexistent slug is not defined in the blog dataset

## Decision

Do not spend engineering time on a production blog-route fix unless a **real** published slug starts failing.

Use valid production article URLs for GSC inspection and continue the indexing workflow from there.
