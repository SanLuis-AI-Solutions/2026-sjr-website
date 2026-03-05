# SEO Step 6.2 - Iteration 26 (`/services` Hero Image Request-Path Sizes Tuning)

Date: 2026-03-05
Owner: Codex

## Goal
Execute one isolated request-path optimization for `/services` hero image delivery by tightening the mobile `sizes` hint to the actual container width.

## Baseline (Locked)
- Summary: `.health/perf-gate-2026-03-05T05-48-37-467Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T05-48-37-467Z.json`
- Route: `/services`
- p50 LCP: `2653ms`
- Median diagnostics:
  - `ttfb=129ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=307ms`

## Change
- Commit: `41e5a9b`
- File: `src/app/services/page.tsx`
- Single change:
  - hero image `sizes` hint:
    - from: `"(max-width: 768px) 100vw, 50vw"`
    - to: `"(max-width: 768px) calc(100vw - 3rem), 50vw"`

## Verification
1. Local
- `npm run build`: PASS
- Focused smoke tests:
  - `services hub: featured detail link routes to service detail`: PASS
  - `mobile services pages: quick actions are clear and image assets load`: PASS

2. Production deploy
- Workflow run: `22704419397`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22704419397`
- Result: PASS (deploy + conversion/service guardrails + baseline-delta checks + diagnostics extraction)

3. Post-deploy isolated measurement
- Summary: `.health/perf-gate-2026-03-05T06-09-51-807Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T06-09-51-807Z.json`
- Route: `/services`
- p50 LCP: `2426ms`
- Median diagnostics:
  - `ttfb=131ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=293ms`
- LCP node sample (run3): `h1.lcp-heading` (hero heading)

## Delta vs Baseline
- LCP: `2653ms -> 2426ms` (`-227ms`)
- elementRenderDelay: `307ms -> 293ms` (`-14ms`)

## Decision
- Keep change live.
- Rationale:
  - material p50 improvement on target route,
  - single isolated change with clean CI/deploy pass,
  - premium visual layout unchanged.

## Next Optimal Step
Run a full-site breadth refresh (30 routes, isolated 1-run) and update scorecard to confirm whether `/services` exits the outlier list and identify final remaining bottleneck route(s) for the 2-day closeout.
