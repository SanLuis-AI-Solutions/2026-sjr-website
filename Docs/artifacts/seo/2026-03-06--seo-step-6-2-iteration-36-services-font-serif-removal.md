# SEO Step 6.2 — Iteration 36 (`/services` Hero `font-serif` Removal Test)

Date: 2026-03-06  
Owner: Codex

## Goal

Test one single-variable text-LCP fallback hypothesis on `/services` by removing `font-serif` from the hero `h1` while retaining `lcp-heading`.

## Baseline (Pre-Change Lock)

- Source summary: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- `/services` p50: `2724ms`
- `/blog` p50: `2246ms`
- `/` p50: `2536ms`

## Change

- Upstream analysis inputs:
  - Gemini forensic note: hydration bimodality confirmed on `/services`; warned font change likely secondary.
  - Claude implementation branch: `perf/iteration-36-services-font-fallback-test`
- Code commit (experiment): `bb7befc`
- File changed:
  - `src/app/services/page.tsx`
- Single-variable scope:
  - hero `h1` class changed from `lcp-heading mt-4 font-serif ...` to `lcp-heading mt-4 ...`
  - no other route, analytics, layout, or asset changes.

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22777008222`
- Result: `success`

3. Post-change isolated production gate
- Command:
  - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /`
- Summary: `.health/perf-gate-2026-03-06T18-57-48-001Z/summary.json`
- `/services` p50: `2765ms`
- `/blog` p50: `2617ms`
- `/` p50: `2592ms`

## Delta vs Baseline

- `/services` LCP: `2724ms -> 2765ms` (`+41ms`)
- `/blog` LCP: `2246ms -> 2617ms` (`+371ms`)
- `/` LCP: `2536ms -> 2592ms` (`+56ms`)

## Decision

- Result: **Rejected**
- Reason:
  - no material improvement on target route `/services`
  - broad negative movement in the same run set.

## Rollback

- Rollback commit: `09c9d68`
- Rollback deploy run: `22777865461` (`success`)
- Post-rollback isolated confirmation:
  - `.health/perf-gate-2026-03-06T19-22-02-949Z/summary.json`
  - `/services`: `2811ms`
  - `/blog`: `2645ms`
  - `/`: `2508ms`

## Interpretation

- The `font-serif` removal did not produce a reliable positive shift and is eliminated as a primary lever.
- `/services` retains high render-delay volatility with text LCP (`h1.lcp-heading`), indicating unresolved main-thread timing pressure.
- `TrackedLink` elimination on services hub remains an already-rejected path (iteration 32) and should not be repeated.

## Next Optimal Step

Run one measurement-stabilization + decomposition pass before the next code experiment:
1. execute two back-to-back isolated 5-run p50 gates on current live `master` (no code change) to lock a same-window control baseline;
2. from that lock, choose one new non-repeated single-variable `/services` render-delay lever (not TrackedLink elimination, not font fallback).
