# SEO Step 6.2 - Iteration 1 (Mobile Hero Support-Card Simplification)

Date: 2026-03-03  
Owner: Codex  
Status: Failed experiment, rolled back in production.

## Objective
Run a low-risk, mobile-only above-fold simplification on service detail pages and measure isolated 5-run p50 impact.

## Change Attempted
File changed:
- `src/app/services/[slug]/page.tsx`

Change details (mobile only):
- Hid the hero text support card (`Need <service> in <city>?`) on mobile.
- Hid the hero image support card (`In-house assessment`) on mobile.
- Desktop rendering remained unchanged.

## Local Verification
- `npm run build`: PASS
- Local smoke + screenshots: PASS
  - `.health/step6-2-iter1-local-smoke-report.json`
  - `.health/screenshots/step6-2-iter1-local/*`
- No image routing errors detected in local checks.

## Production Deploy (Iteration Build)
- Deploy URL: `https://sjr-new-website-aiproject-jnbz4jpfq.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/CSgdWRDRemYvhkQDc5tzAh5uEpAC`
- Alias: `https://susiesjewelryrepair.com`

## Production Measurements (Isolated 5-run p50)

Run A:
- `.health/perf-gate-2026-03-03T00-51-40-731Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T00-51-40-731Z.json`

Run B (repeat for confirmation):
- `.health/perf-gate-2026-03-03T00-58-34-496Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T00-58-34-496Z.json`

Results vs Step 6.1 final reference (`.health/perf-gate-2026-03-03T00-18-54-618Z/summary.json`):
- `/services/ring-sizing`: `2645ms -> 3117ms` (Run A), `3047ms` (Run B)
- `/services/watch-repair`: `2969ms -> 2966ms` (Run A), `3047ms` (Run B)
- `/services/custom-design`: `2826ms -> 2902ms` (Run A), `2745ms` (Run B)

Observed diagnostic pattern:
- elevated `elementRenderDelay` volatility across pilot routes in repeated runs, with substantial spikes on ring-sizing/watch-repair.

## Decision
Iteration 1 is a net failure for production rollout quality.

Action taken:
- Reverted iteration changes in `src/app/services/[slug]/page.tsx`.
- Redeployed rollback to restore prior behavior.

## Production Rollback
- Deploy URL: `https://sjr-new-website-aiproject-2r1ftjt22.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/FceAuYa2hmMZDseEdgDchfZtNAy9`
- Alias: `https://susiesjewelryrepair.com`

Restore verification run:
- `.health/perf-gate-2026-03-03T01-08-14-035Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T01-08-14-035Z.json`

Restored p50:
- `/services/ring-sizing`: `2702ms`
- `/services/watch-repair`: `3045ms`
- `/services/custom-design`: `2743ms`

## Next Step
Proceed to Step 6.2 micro-change #2 focused on hero decode/render path (no card hiding), then re-run isolated 5-run p50 diagnostics.
