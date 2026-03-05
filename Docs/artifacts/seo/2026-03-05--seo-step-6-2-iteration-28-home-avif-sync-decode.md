# SEO Step 6.2 — Iteration 28 (`/` AVIF Sync Decode Test)

Date: 2026-03-05  
Owner: Codex

## Goal

Test Claude forensic hypothesis H1 on home route only by switching the AVIF LCP hero image decode mode from async to sync, then measure isolated production impact with the same 10-run diagnostics setup.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-05T16-39-58-127Z/summary.json`
- Source diagnostics: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json`
- Home route (`/`) median diagnostics:
  - `lcp=2539ms`
  - `elementRenderDelay=1240ms`
  - `ttfb=131ms`
  - `resourceLoadDelay=28ms`
  - `resourceLoadDuration=78ms`

## Change

- Commit: `d85e414`
- File: `src/components/hero.tsx`
- Single variable change:
  - `decoding="async"` -> `decoding="sync"`

## Verification

1. Build/smoke (pre-deploy)
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow: `22728668937`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22728668937`
- Result: PASS (deploy + conversion/service guardrails + artifact extraction)

3. Post-change isolated production measurement
- Command:

```bash
node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 10 \
  --percentile 50 \
  --lcp-threshold-ms 10000 \
  --seo-threshold 100 \
  --isolate \
  --diagnostics \
  --path /
```

- Summary: `.health/perf-gate-2026-03-05T17-55-13-776Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T17-55-13-776Z.json`
- Home route (`/`) median diagnostics:
  - `lcp=2537ms`
  - `elementRenderDelay=1235ms`
  - `ttfb=127ms`
  - `resourceLoadDelay=35ms`
  - `resourceLoadDuration=77ms`

## Delta vs Baseline (Diagnostics Median)

- `lcp`: `2539ms -> 2537ms` (`-2ms`)
- `elementRenderDelay`: `1240ms -> 1235ms` (`-5ms`)
- `ttfb`: `131ms -> 127ms` (`-4ms`)
- `resourceLoadDelay`: `28ms -> 35ms` (`+7ms`)
- `resourceLoadDuration`: `78ms -> 77ms` (`-1ms`)

## Decision

- Result: **Rejected as non-material**.
- Reason: the change did not produce a meaningful shift in either LCP or render delay on isolated 10-run production evidence; it is within run noise.
- Process outcome: mark H1 (decode mode alone) as eliminated for AVIF on current home hero implementation.

## Next Optimal Step

Run a single-variable H2 test on home by reducing above-fold main-thread contention (mobile-only reveal-on-scroll deferral/removal for the first visible home sections), then re-run the same isolated 10-run diagnostics command.

