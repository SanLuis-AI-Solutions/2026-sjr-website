# SEO Step 6.2 Iteration 11 (Blog Outlier Hero Optimization)

Date: 2026-03-04  
Scope: blog detail hero delivery for previously slow routes + outlier verification.

## What Changed

1. Blog hero rendering switched to Next-optimized responsive art-direction:
- File: `src/app/blog/[slug]/page.tsx`
- Replaced unoptimized hero image path with `getImageProps` + `<picture>` source selection.
- Preserved existing premium layout, overlay, typography, and CTA composition.

2. Added explicit mobile hero mapping for target blog slugs:
- File: `src/lib/blog.ts`
- New export: `BLOG_MOBILE_HERO_IMAGE_BY_SLUG`.

3. Generated new mobile blog hero assets:
- `public/images/blog/stone-security-checklist-cover-mobile.avif`
- `public/images/blog/custom-design-timeline-guide-cover-mobile.avif`
- `public/images/blog/watch-battery-replacement-cover-mobile.avif`

## Build + Deploy Verification

1. Local build:
- `npm run build` PASS.

2. Production deploy workflow:
- Run id: `22651204423`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22651204423`
- Result: PASS.

3. CI guardrails in same run:
- Conversion gate + delta check: PASS
  - `/contact`: `2279ms`
  - `/quote`: `2188ms`
  - `/book`: `2265ms`
- Service gate + delta check: PASS
  - `/services/ring-sizing`: `2428ms`
  - `/services/watch-repair`: `2268ms`
  - `/services/custom-design`: `2273ms`
- Artifact uploaded:
  - `perf-gate-22651204423` (artifact id `5752314154`)

## Targeted Outlier Verification (Isolated 5-run p50)

Source:
- `.health/perf-gate-2026-03-04T01-58-49-945Z/summary.json`
- `.health/lcp-diagnostics-2026-03-04T01-58-49-945Z.json`

Before reference:
- `.health/perf-gate-2026-03-04T00-23-13-383Z/summary.json`

Results:
- `/services`: `2615ms -> 2468ms` (`-147ms`)
- `/blog/cost-to-resize-gold-ring-pasadena`: `2916ms -> 2245ms` (`-671ms`)
- `/blog/can-a-severely-bent-ring-prong-be-fixed`: `2614ms -> 2101ms` (`-513ms`)
- `/blog/custom-design-timeline-guide`: `2613ms -> 2315ms` (`-298ms`)
- `/blog/stone-security-checklist`: `2612ms -> 2313ms` (`-299ms`)
- `/blog/watch-battery-replacement`: `2537ms -> 2245ms` (`-292ms`)

Decision:
- Easy-win outlier pass succeeded; all 6 target routes now pass `<=2500ms` in isolated 5-run p50 evidence.

## Full-Site Breadth Check (Post-fix)

Source:
- `.health/perf-gate-2026-03-04T02-10-38-904Z/summary.json`
- `.health/lcp-diagnostics-2026-03-04T02-10-38-904Z.json`

Summary:
- 30 routes, 1-run p50 breadth scan.
- Overall: `avg lcp=2299ms`, `avg perf=98`, `seo=100`.
- `28/30` routes at `<=2500ms`.
- Single-run outliers: `/blog` (`2667ms`), `/services` (`2606ms`).

Noise check:
- Isolated 5-run p50 confirmation (`.health/perf-gate-2026-03-04T02-17-34-958Z/summary.json`):
  - `/blog`: `2228ms`
  - `/services`: `2409ms`
- Interpretation: breadth scan outliers were volatility/noise, not persistent misses.

