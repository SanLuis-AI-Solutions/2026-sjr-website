# SEO Step 6.2 Iteration 5 (Contact Guardrail Recovery: Deferred Live Map)

Date: 2026-03-03  
Scope: `/contact` primary, `/about` guardrail, pilot services non-regression check  
Objective: Recover `/contact` mobile LCP without degrading premium design or service-route gains.

## Hypothesis

- `/contact` LCP stall was driven by below-fold Google Maps embed scripts loading during initial page lifecycle.
- If the map iframe is deferred until near-viewport/user intent, initial render-path contention should drop and `/contact` p50 LCP should recover.

## Single Change Implemented

- Added new client component: `src/components/deferred-google-map-embed.tsx`.
- Updated `src/app/contact/page.tsx`:
  - replaced direct map `<iframe>` with `<DeferredGoogleMapEmbed />`.
  - preserved section framing, heading, CTA style, and premium visual treatment.
  - map now mounts when section is near viewport (`IntersectionObserver`) or on explicit `Load Live Map` click.

## Deployment

- Production deploy URL: `https://sjr-new-website-aiproject-dnag4ly7s.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/Cae3v7boxhmEDjZ6LtvVwzAzouK8`
- Alias: `https://susiesjewelryrepair.com`

## Verification Artifacts

### Contact/About isolated gate (5-run p50)
- `.health/perf-gate-2026-03-03T21-32-54-339Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T21-32-54-339Z.json`

### Service pilot non-regression gate (5-run p50)
- `.health/perf-gate-2026-03-03T21-37-07-906Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T21-37-07-906Z.json`

### Prior comparison baseline
- `.health/perf-gate-2026-03-03T18-01-50-969Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T18-01-50-969Z.json`

## Metrics

### Guardrail delta (p50)

- `/contact`: `5248ms -> 2165ms` (`-3083ms`)
- `/about`: `2473ms -> 2196ms` (`-277ms`)
- SEO: `100` on both routes.

### Service non-regression (same deploy)

- `/services/ring-sizing`: `2449ms`
- `/services/watch-repair`: `2299ms`
- `/services/custom-design`: `2375ms`
- SEO: `100` on all three routes.

## Diagnostics Notes

- Contact median LCP phases improved materially:
  - `ttfb=125ms`, `resourceLoadDelay=0ms`, `resourceLoadDuration=0ms`, `elementRenderDelay=808ms`.
- Representative contact run network check confirms map scripts no longer load in initial page audit window:
  - `mapsRequests = 0` (run file: `.../lighthouse-contact-run2.json`).
- Residual `?_rsc` prefetch requests still exist on contact; they are now secondary because `/contact` is already below target.

## Decision

- **KEEP** deferred map implementation.
- This is the first deterministic `/contact` recovery that meets the `<=2600ms` guardrail with a large margin while preserving premium layout quality.
