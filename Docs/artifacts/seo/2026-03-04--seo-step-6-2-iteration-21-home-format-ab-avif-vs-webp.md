# SEO Step 6.2 — Iteration 21 (Home Hero Format A/B: WebP vs AVIF)

Date: 2026-03-04  
Owner: Codex  
Scope: `/` route only (home hero image decode/render path)

## Objective
Run a controlled, single-variable mobile hero image format test on home (`WebP` baseline vs `AVIF`) with no layout, copy, or style changes.

## Baseline (WebP)
- Source already live before this iteration:
  - `src/components/hero.tsx` -> `/images/home/home-hero-ring-mobile.webp`
- Isolated 10-run p50 evidence:
  - `.health/perf-gate-2026-03-04T20-05-33-804Z/summary.json`
  - `/`: `2590ms`
  - diagnostics median:
    - `ttfb=128ms`
    - `resourceLoadDelay=24ms`
    - `resourceLoadDuration=75ms`
    - `elementRenderDelay=1286ms`
  - LCP image: `/images/home/home-hero-ring-mobile.webp`

## Test Change (AVIF)
- File: `src/components/hero.tsx`
- Commit: `fd14869`
- Change:
  - `/images/home/home-hero-ring-mobile.webp` -> `/images/home/home-hero-ring-mobile.avif`
- Build check:
  - `npm run build` passed.

## Deployment Evidence
- Workflow: `22687190400`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22687190400`
- Result: `success` (deploy + conversion/service guardrails + baseline-delta checks passed)

## Post-Deploy Measurement (AVIF)
- Isolated 10-run p50 evidence:
  - `.health/perf-gate-2026-03-04T20-29-00-373Z/summary.json`
  - `/`: `2523ms`
  - diagnostics median:
    - `ttfb=129ms`
    - `resourceLoadDelay=33ms`
    - `resourceLoadDuration=49ms`
    - `elementRenderDelay=1247ms`
  - LCP image: `/images/home/home-hero-ring-mobile.avif`

## Comparison (WebP -> AVIF)
- LCP p50: `2590ms -> 2523ms` (`-67ms`)
- `elementRenderDelay`: `1286ms -> 1247ms` (`-39ms`)
- `resourceLoadDuration`: `75ms -> 49ms` (`-26ms`)

## Decision
- Accept iteration 21.
- Keep AVIF as the live mobile hero format for home.
- No rollback.

## Next Optimal Step
Run a stabilization verification pass before another code change:
1. Re-run isolated `/` 10-run p50 once more on AVIF to confirm repeatability.
2. Run a full-site breadth audit (1-run scan) to refresh score/outlier list.
3. If `/` remains above `2500ms`, choose one new micro-change with highest render-delay leverage and test in isolation.
