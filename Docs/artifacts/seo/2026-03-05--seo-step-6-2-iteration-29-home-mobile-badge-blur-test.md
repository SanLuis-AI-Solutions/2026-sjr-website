# SEO Step 6.2 — Iteration 29 (`/` Home Mobile Badge Blur Test)

Date: 2026-03-05  
Owner: Codex

## Goal

Run one mobile-only paint-cost experiment on the home hero by removing blur from the small trust badge pill (desktop unchanged), then measure isolated production impact with the same 10-run diagnostics setup.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-05T16-39-58-127Z/summary.json`
- Source diagnostics: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json`
- Home route (`/`) diagnostics median:
  - `lcp=2539ms`
  - `elementRenderDelay=1240ms`
  - `ttfb=131ms`
  - `resourceLoadDelay=28ms`
  - `resourceLoadDuration=78ms`

## Change

- Commit: `6705ea3`
- File: `src/components/hero.tsx`
- Single variable change:
  - trust badge class changed from `backdrop-blur-sm` to `md:backdrop-blur-sm`
  - effect: blur disabled on mobile, preserved on desktop.

## Verification

1. Local
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22731973024`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22731973024`
- Result: PASS

3. Post-change isolated measurement
- Summary: `.health/perf-gate-2026-03-05T19-15-40-163Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T19-15-40-163Z.json`
- Home route (`/`) diagnostics median:
  - `lcp=2538ms`
  - `elementRenderDelay=1227ms`
  - `ttfb=127ms`
  - `resourceLoadDelay=29ms`
  - `resourceLoadDuration=78ms`

## Delta vs Baseline (Diagnostics Median)

- `lcp`: `2539ms -> 2538ms` (`-1ms`)
- `elementRenderDelay`: `1240ms -> 1227ms` (`-13ms`)
- `ttfb`: `131ms -> 127ms` (`-4ms`)
- `resourceLoadDelay`: `28ms -> 29ms` (`+1ms`)
- `resourceLoadDuration`: `78ms -> 78ms` (`0ms`)

## Decision

- Result: **Rejected as non-material**.
- Reason: improvement is within run noise and does not shift home LCP behavior materially.
- Premium feel guardrail: mobile blur was restored after test to preserve the intended luxury look.

## Rollback

- Commit: `e652ee8` (`src/components/hero.tsx` restored `backdrop-blur-sm` on mobile trust badge).
- Deploy run: `22732836047` (success)
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22732836047`

## Next Optimal Step

Run a diagnostics-only lane focused on the exact render-delay trigger:
1. per-run long-task + style/layout extraction from Lighthouse report JSON for `/`;
2. rank one single-variable code change that targets the dominant pre-LCP main-thread category;
3. execute only that one change in the next iteration.

