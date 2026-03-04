# SEO Step 6.2 — Iteration 19 (Home Overlay Merge Elimination)

Date: 2026-03-04  
Owner: Codex  
Scope: `/` route only (home hero render-delay stream)

## Objective
Test whether reducing mobile hero overlay compositing complexity (two overlay elements -> one merged overlay element) improves home-route median LCP.

## Change Applied
- File: `src/components/hero.tsx`
- Temporary change:
  - merged two mobile overlay layers into one combined gradient layer.
  - intent: reduce mobile compositor overhead while preserving premium lighting direction.

## Deployment Evidence
- Test commit: `80aba97`
- Workflow: `Deploy Production (Vercel)` run `22682033617`
- Result: `failure` (service guardrail step failed)
  - failing route in CI run:
    - `/services/ring-sizing`: `2525ms` (`>2500ms` threshold, +25ms)
  - other service routes in same run:
    - `/services/watch-repair`: `2275ms`
    - `/services/custom-design`: `2277ms`

## Home Measurements (Post-Deploy)
- Isolated 10-run p50:
  - `.health/perf-gate-2026-03-04T18-10-32-112Z/summary.json`
  - `/` p50: `2586ms`
  - median phases: `ttfb=130ms`, `loadDelay=22ms`, `loadTime=82ms`, `renderDelay=1228ms`

Comparison to prior stabilized home baseline:
- prior: `.health/perf-gate-2026-03-04T17-34-31-833Z/summary.json`
- prior `/` p50: `2602ms`
- delta: `-16ms` (not material)

## Service Guardrail Sanity Check
Because CI failed on one service route, a direct isolated recheck was run:
- `.health/perf-gate-2026-03-04T18-14-48-917Z/summary.json`
- `/services/ring-sizing` p50: `2445ms` (pass)

Interpretation:
- CI failure appears near-threshold/transient, not a persistent route regression.
- overlay merge still failed the elimination objective due negligible home median gain.

## Decision
- **Reject** iteration 19 as primary recovery path.
- Reverted the overlay-merge change to keep baseline stable:
  - revert commit: `c5314af`

## Rollback Validation
- Rollback deploy workflow: `22683032561` (`success`)
- Service guardrail p50 after rollback:
  - `/services/ring-sizing`: `2479ms`
  - `/services/watch-repair`: `2270ms`
  - `/services/custom-design`: `2343ms`
- Conversion guardrail p50 after rollback:
  - `/contact`: `2288ms`
  - `/quote`: `2277ms`
  - `/book`: `2268ms`
- Result: baseline stability restored with all CI guardrails passing.

## Next Optimal Step
Target a likely remaining compositor hotspot on mobile hero chrome:
- reduce mobile-only `backdrop-blur` usage on above-fold hero UI chips/buttons while preserving desktop premium styling,
- then run isolated `/` 10-run p50 diagnostics.
