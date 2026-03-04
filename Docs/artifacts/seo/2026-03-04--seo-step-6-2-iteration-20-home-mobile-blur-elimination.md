# SEO Step 6.2 — Iteration 20 (Home Mobile Blur Elimination)

Date: 2026-03-04  
Owner: Codex  
Scope: `/` route only (home hero render-delay stream)

## Objective
Test whether removing mobile-only above-fold `backdrop-blur` effects on hero UI chrome improves home-route median LCP.

## Change Applied
- File: `src/components/hero.tsx`
- Test commit: `5f29cc1`
- Temporary change:
  - Hero badge: `backdrop-blur-sm` -> `backdrop-blur-0 md:backdrop-blur-sm`
  - Secondary CTA button: `backdrop-blur-sm` -> `backdrop-blur-0 md:backdrop-blur-sm`
- Desktop styling preserved.

## Deployment Evidence
- Workflow: `22683881746`
- Result: `failure` on service baseline-delta check only
  - `/services/watch-repair`: baseline `2113ms`, current `2324ms`, delta `+211ms` vs budget `+200ms`.
- Service absolute gate still passed in that run.

## Post-Deploy Measurements

Home (required):
- Isolated 10-run p50:
  - `.health/perf-gate-2026-03-04T19-00-30-010Z/summary.json`
  - `/`: `2611ms`
  - diagnostics median:
    - `ttfb=138ms`
    - `resourceLoadDelay=25ms`
    - `resourceLoadDuration=84ms`
    - `elementRenderDelay=2240ms`

Service sanity:
- `/services/ring-sizing` isolated 5-run p50:
  - `.health/perf-gate-2026-03-04T19-04-59-526Z/summary.json`
  - `2447ms` (pass)
- `/services/watch-repair` isolated 5-run p50:
  - `.health/perf-gate-2026-03-04T19-04-59-720Z/summary.json`
  - `2291ms` (pass)

## Comparison
- Prior stabilized home reference:
  - `.health/perf-gate-2026-03-04T17-34-31-833Z/summary.json`
  - `/`: `2602ms`
- Iteration 20 result:
  - `/`: `2611ms`
- Delta: `+9ms` (worse, not material in desired direction).

## Decision
- Reject iteration 20 as a home recovery path.
- Rollback applied:
  - revert commit: `ee9c610`
- Rollback deploy validation:
  - workflow: `22684848403`
  - URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22684848403`
  - result: `success` (deploy + conversion/service guardrails + baseline-delta checks passed)

## Next Optimal Step
Shift to an image-pipeline experiment that isolates decode complexity without changing page composition:
- generate a WebP variant for `/images/home/home-hero-ring-mobile.webp` at matched visual quality/budget and route only home mobile hero to that asset,
- run isolated `/` 10-run p50 diagnostics and keep whichever format yields lower median `elementRenderDelay`.
