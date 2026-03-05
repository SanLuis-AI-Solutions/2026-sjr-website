# SEO Step 6.2 — Iteration 27 (`/services` Hero Badge Blur Removal)

Date: 2026-03-05  
Owner: Codex

## Goal

Run one mobile-only paint simplification on `/services` above the fold to reduce render-path cost without changing structure, copy, or premium layout.

## Baseline (Locked)

- Source: `.health/perf-gate-2026-03-05T15-02-48-628Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T15-02-48-628Z.json`
- Isolated 5-run p50:
  - `/services`: `2732ms`
  - `/`: `2520ms`

## Change

- Commit: `5653622`
- File: `src/app/services/page.tsx`
- Single change:
  - hero turnaround badge blur changed to desktop-only:
    - from: `backdrop-blur-sm`
    - to: `md:backdrop-blur-sm`

## Verification

1. Local
- `npm run build`: PASS
- Targeted smoke:
  - `services hub: featured detail link routes to service detail`: PASS
  - `mobile services pages: quick actions are clear and image assets load`: PASS

2. Production deploy
- Workflow run: `22725969011`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22725969011`
- Result: PASS (deploy + conversion/service guardrails + baseline-delta checks)

3. Post-deploy isolated measurement
- Summary: `.health/perf-gate-2026-03-05T16-07-48-547Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T16-07-48-547Z.json`
- Isolated 5-run p50:
  - `/services`: `2390ms`
  - `/`: `2524ms`

## Delta vs Baseline

- `/services`: `2732ms -> 2390ms` (`-342ms`)
- `/`: `2520ms -> 2524ms` (`+4ms`, noise band)

## Decision

- Keep change live.
- Rationale:
  - deterministic single-variable pass produced a material gain on the target route,
  - non-target home route remained stable,
  - no regression in deploy guardrails.

## Next Optimal Step

Run home-only elimination next (single-variable, mobile-only), because `/services` is now back under target while `/` remains slightly above threshold:

```bash
node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 5 \
  --percentile 50 \
  --lcp-threshold-ms 10000 \
  --seo-threshold 100 \
  --isolate \
  --diagnostics \
  --path /
```
