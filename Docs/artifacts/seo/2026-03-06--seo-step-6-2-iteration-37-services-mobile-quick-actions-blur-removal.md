# SEO Step 6.2 — Iteration 37 (`/services` Mobile Quick-Actions Blur Removal)

Date: 2026-03-06  
Owner: Codex

## Goal

Run one new non-repeated `/services` render-delay experiment by removing backdrop blur from the mobile fixed quick-actions bar while preserving the bar, CTAs, and test-visible contract.

## Locked Control Baseline

- Control run #1:
  - summary: `.health/perf-gate-2026-03-06T19-42-30-823Z/summary.json`
  - `/services`: `2453ms`
  - `/blog`: `2204ms`
  - `/`: `2519ms`
- Control run #2:
  - summary: `.health/perf-gate-2026-03-06T19-48-46-123Z/summary.json`
  - `/services`: `2798ms`
  - `/blog`: `2263ms`
  - `/`: `2311ms`
- Locked control midpoint (rounded mean of the two same-window controls):
  - `/services`: `2626ms`
  - `/blog`: `2234ms`
  - `/`: `2415ms`

## Change

- Experiment commit: `b6675d0`
- File changed:
  - `src/app/services/page.tsx`
- Single-variable scope:
  - changed the mobile quick-actions shell from translucent + `backdrop-blur-sm` to a more opaque non-blurred shell.
  - kept the quick-actions region, CTA labels, links, and overall layout structure intact.
  - did not touch `/services` TrackedLink boundaries, hero heading font family, image sizes, or heading classes.

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22779801382`
- GitHub conclusion: `cancelled`
- Important detail:
  - `Deploy to Vercel (production)` and `Wait for production alias propagation` both completed before the workflow was superseded by the rollback push.
  - post-change measurement below was taken against the live production alias after those steps completed.

3. Post-change isolated production gate
- Command:
  - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /`
- Summary: `.health/perf-gate-2026-03-06T20-06-23-964Z/summary.json`
- `/services`: `2807ms`
- `/blog`: `2611ms`
- `/`: `2514ms`

## Delta vs Locked Control

| Route | Control #1 | Control #2 | Locked midpoint | After | Delta vs midpoint |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/services` | `2453ms` | `2798ms` | `2626ms` | `2807ms` | `+181ms` |
| `/blog` | `2204ms` | `2263ms` | `2234ms` | `2611ms` | `+377ms` |
| `/` | `2519ms` | `2311ms` | `2415ms` | `2514ms` | `+99ms` |

## Decision

- Result: **Rejected**
- Reason:
  - target route `/services` did not improve materially; it was also `+9ms` worse than the slower control run.
  - `/blog` regressed materially in the same run set.
  - no acceptance path exists under the `>=150ms` improvement rule.

## Rollback

- Rollback commit: `c466c4f`
- Rollback deploy run: `22780218192` (`success`)
- Post-rollback isolated confirmation:
  - `.health/perf-gate-2026-03-06T20-30-37-523Z/summary.json`
  - `/services`: `2736ms`
  - `/blog`: `2719ms`
  - `/`: `2539ms`

## Interpretation

- Removing only the mobile quick-actions blur does not behave like a primary `/services` render-delay lever.
- The same-window control lock confirmed ongoing `/services` text-LCP bimodality:
  - one 5-run p50 window landed at `2453ms`
  - the immediate follow-up landed at `2798ms`
- The route still points to broader above-fold main-thread/compositing pressure rather than this one blur layer alone.

## Next Optimal Step

Test one stricter `/services` hub chrome simplification lever that is still not a repeat:
1. keep TrackedLink elimination and hero `font-serif` removal off-limits;
2. target the mobile fixed quick-actions shell itself, not just its blur treatment;
3. treat the next experiment as another single-variable same-window test with the same double-control baseline lock.
