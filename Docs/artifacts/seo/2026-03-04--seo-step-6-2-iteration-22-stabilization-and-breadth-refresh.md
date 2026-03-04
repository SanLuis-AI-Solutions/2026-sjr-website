# SEO Step 6.2 — Iteration 22 (Stabilization Repeat + Breadth Refresh)

Date: 2026-03-04  
Owner: Codex  
Scope: Production verification only (no code changes)

## Objective
1. Re-run isolated home 10-run p50 on the accepted AVIF config to confirm repeatability.
2. Refresh full-site breadth scan (30 routes) to lock current score/outlier state before the next micro-change.

## Home Repeat Verification (AVIF)
- Source: `.health/perf-gate-2026-03-04T21-01-54-100Z/summary.json`
- Route: `/`
- Result: `2530ms` (p50, 10-run isolated)
- Median diagnostics:
  - `ttfb=137ms`
  - `resourceLoadDelay=28ms`
  - `resourceLoadDuration=74ms`
  - `elementRenderDelay=1270ms`
- LCP image: `/images/home/home-hero-ring-mobile.avif`

## Stability Comparison
- Prior AVIF run: `.health/perf-gate-2026-03-04T20-29-00-373Z/summary.json` -> `2523ms`
- Repeat AVIF run: `2530ms`
- Delta: `+7ms` (within normal run-to-run noise).

- Locked WebP baseline: `.health/perf-gate-2026-03-04T20-05-33-804Z/summary.json` -> `2590ms`
- AVIF repeat vs WebP baseline: `-60ms`.

## Full-Site Breadth Refresh
- Summary: `.health/perf-gate-2026-03-04T21-06-28-437Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-04T21-06-28-437Z.json`
- Method: isolated, mobile, 1 run per route, 30 routes

### Outcomes
- SEO `100`: `30/30`
- Routes `<=2500ms`: `28/30`
- Outliers:
  - `/`: `2591ms`
  - `/services`: `2560ms`
- Average LCP (all routes): `2261ms`
- Core route average LCP (`/`, `/about`, `/contact`, `/quote`, `/book`, `/services`, `/blog`): `2262ms`
- Score model (same framework): `95/100` (held)

## Decision
- Keep AVIF live for home mobile hero.
- No rollback and no additional code changes in this checkpoint.

## Next Optimal Step
Target `/services` hub first with a strict single-variable pass:
1. Lock `/services` isolated 5-run p50 baseline + diagnostics.
2. Apply one mobile-only micro-change above the fold (render-delay focused, no premium visual downgrade).
3. Re-run `/services` isolated 5-run p50 and accept only if improvement is material and no guardrail regressions occur.
