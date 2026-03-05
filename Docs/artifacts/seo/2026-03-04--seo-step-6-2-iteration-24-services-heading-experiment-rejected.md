# SEO Step 6.2 - Iteration 24 (`/services` Mobile Hero Text Paint Experiment)

Date: 2026-03-04
Owner: Codex

## Goal
Execute the next isolated hypothesis from iteration 23:
- one mobile-only `/services` hero text paint adjustment,
- then production re-measurement with isolated 5-run p50,
- keep only if materially better.

## Baseline Used
- Source: `.health/perf-gate-2026-03-04T22-54-31-275Z/summary.json`
- `/services` p50 LCP: `2667ms`
- median diagnostics: `ttfb=131ms`, `resourceLoadDelay=0ms`, `resourceLoadDuration=0ms`, `elementRenderDelay=1299ms`

## Experiment Change
- Commit: `ebd3178`
- File: `src/app/services/page.tsx`
- Change:
  - Mobile-only heading style tune:
    - `text-5xl leading-[1.05]` -> `text-[clamp(2.45rem,9.6vw,2.9rem)] leading-[1.02]`
  - Desktop style unchanged.

## Verification Before Deploy
- `npm run build`: PASS
- Focused smoke:
  - `services hub: featured detail link routes to service detail`: PASS
  - `mobile services pages: quick actions are clear and image assets load`: PASS

## Deploy + Guardrail Outcome
- Workflow run: `22701429100`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22701429100`
- Deploy and guardrails executed, but workflow failed at service baseline-delta compare:
  - `/services/custom-design`: baseline `2271ms`, current `2424ms`, delta `+153ms` vs budget `+150ms` (3ms over budget)

## Post-Deploy Measurement (Target Route)
- Source: `.health/perf-gate-2026-03-05T04-10-00-034Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T04-10-00-034Z.json`
- `/services` p50 LCP: `2677ms`
- median diagnostics: `ttfb=128ms`, `resourceLoadDelay=25ms`, `resourceLoadDuration=76ms`, `elementRenderDelay=1197ms`
- LCP element sampled as hero image (`img.object-cover`) in this run.

## Decision
- Reject iteration 24 change.
- Reason: no material gain on `/services` target (`2667ms -> 2677ms`, `+10ms`), and LCP candidate shifted to hero image.

## Rollback
- Revert commit: `514f730`
- Workflow run (rollback deploy): `22701947161`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22701947161`
- Status: PASS (all deploy/guardrail steps green)

## Post-Rollback Confirmation
- Source: `.health/perf-gate-2026-03-05T04-30-43-567Z/summary.json`
- `/services` p50 LCP: `2692ms`
- median diagnostics: `ttfb=128ms`, `resourceLoadDelay=0ms`, `resourceLoadDuration=0ms`, `elementRenderDelay=1303ms`

## Next Hypothesis (For Iteration 25)
Target render delay with one mobile-only visual paint simplification in `/services` hero container (not typography, not layout):
- remove one decorative mobile paint layer in hero above-fold (keep premium style with remaining layer),
- re-measure isolated 5-run p50,
- keep only if meaningful gain (`>=150ms`) otherwise rollback.
