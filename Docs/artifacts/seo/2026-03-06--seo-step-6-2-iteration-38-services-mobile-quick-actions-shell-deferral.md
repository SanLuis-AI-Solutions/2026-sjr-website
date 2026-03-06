# SEO Step 6.2 — Iteration 38 (`/services` Mobile Quick-Actions Shell Deferral)

Date: 2026-03-06  
Owner: Codex

## Goal

Run one new non-repeated `/services` render-delay experiment by deferring the mobile quick-actions fixed shell until after hero scroll, while keeping the same quick actions visible inline on first paint.

## Locked Control Baseline

- Control run #1:
  - summary: `.health/perf-gate-2026-03-06T20-57-37-196Z/summary.json`
  - `/services`: `2764ms`
  - `/blog`: `2583ms`
  - `/`: `2528ms`
- Control run #2:
  - summary: `.health/perf-gate-2026-03-06T21-04-20-268Z/summary.json`
  - `/services`: `2738ms`
  - `/blog`: `2634ms`
  - `/`: `2516ms`
- Locked control midpoint (rounded mean of the two same-window controls):
  - `/services`: `2751ms`
  - `/blog`: `2609ms`
  - `/`: `2522ms`

## Change

- Experiment commit: `fecc9fa`
- Files changed:
  - `src/app/services/page.tsx`
  - `src/components/services-hub-mobile-quick-actions.tsx`
  - `tests/smoke.spec.ts`
- Single-variable scope:
  - moved the mobile quick-actions region into the hero content flow for first paint.
  - deferred promotion into the fixed bottom shell until after the hero scroll boundary via `IntersectionObserver`.
  - preserved the same two CTAs, destinations, event name, and quick-actions region contract.
  - did not repeat TrackedLink elimination, hero `font-serif` removal, or blur-only treatment.

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS
- `npm run test -- --grep "mobile services hub: quick actions start inline and pin after hero scroll"`: PASS
- `npm run test -- --grep "mobile services pages: quick actions are clear and image assets load"`: PASS

2. Production deploy
- Workflow run: `22782377938`
- GitHub conclusion: `success`

3. Post-change isolated production gate
- Command:
  - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /`
- Summary: `.health/perf-gate-2026-03-06T21-35-38-602Z/summary.json`
- `/services`: `2800ms`
- `/blog`: `2615ms`
- `/`: `2527ms`

## Delta vs Locked Control

| Route | Control #1 | Control #2 | Locked midpoint | After | Delta vs midpoint |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/services` | `2764ms` | `2738ms` | `2751ms` | `2800ms` | `+49ms` |
| `/blog` | `2583ms` | `2634ms` | `2609ms` | `2615ms` | `+6ms` |
| `/` | `2528ms` | `2516ms` | `2522ms` | `2527ms` | `+5ms` |

## Decision

- Result: **Rejected**
- Reason:
  - target route `/services` missed the `>=150ms` improvement rule by a wide margin and regressed `+49ms` versus the locked midpoint.
  - guardrails held, but the target-route effect was non-material.
  - this eliminates shell deferral as a primary `/services` render-delay lever.

## Rollback

- Rollback commit: `fdf9710`
- Rollback deploy run: `22783142526` (`success`)
- Post-rollback isolated confirmation:
  - `.health/perf-gate-2026-03-06T21-59-25-510Z/summary.json`
  - `/services`: `2812ms`
  - `/blog`: `2607ms`
  - `/`: `2512ms`

## Interpretation

- Keeping the quick-actions CTAs inline first and pinning them later does not create a material `/services` LCP win.
- The page remains dominated by the same text-LCP render-delay profile (`h1.lcp-heading`) rather than the initial shell mode.
- The next lever should simplify the fixed quick-actions shell itself rather than when it appears.

## Next Optimal Step

Test one new `/services` fixed quick-actions shell simplification that is still not a repeat:
1. keep TrackedLink elimination, hero `font-serif` removal, blur-only removal, and shell deferral off-limits;
2. remove the outer mobile quick-actions shell container while keeping the two fixed CTA pills available;
3. run the same double-control baseline lock before measuring the next single-variable experiment.
