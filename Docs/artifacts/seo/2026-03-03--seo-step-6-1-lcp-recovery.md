# SEO Step 6.1 - Evidence-Driven LCP Recovery (No Guessing)

Date: 2026-03-03  
Owner: Codex  
Status: Implemented and deployed. Acceptance criteria partially met (see Decision).

## Summary
Step 6.1 was executed with diagnostics-first baselining, isolated route measurements, and production verification.

Delivered:
- diagnostic-capable isolated performance gate
- LCP diagnostics extraction artifact pipeline
- service hero mobile/desktop art direction routed through Next optimization (`getImageProps`)
- conditional contact guardrail stabilization sequence (strict order, measured after each step)

Not delivered by metrics:
- pilot service performance target (`>=250ms` gain on at least 2/3 routes)
- contact stop target (`/contact <=2600ms`)

## Scope Executed
In scope:
- `scripts/perf/launch-performance-gate.mjs` interface + diagnostics updates
- new diagnostics parser script
- service template hero source selection update
- local smoke + screenshot quality guardrail checks
- production deploy(s), isolated 5-run p50 measurements, and diagnostics extraction
- docs + status updates

Out of scope (unchanged):
- copy/layout redesigns
- CTA or brand style changes
- non-service route refactors except conditional `/contact` guardrail fixes from plan

## Implementation Details

### 1) Perf gate script upgrades
File: `scripts/perf/launch-performance-gate.mjs`

Added:
- `--cooldown-ms` (default `12000`)
- `--diagnostics`
- `--isolate`

Behavior:
- emits per-route median LCP phases from `lcp-breakdown-insight`
- captures representative LCP element selector and image URL from `lcp-discovery-insight`
- supports isolated route execution for lower cross-route noise

### 2) New diagnostics extraction script
File: `scripts/perf/extract-lcp-diagnostics.mjs`

Usage:
- `node scripts/perf/extract-lcp-diagnostics.mjs --dir <perf-gate-dir>`

Output:
- `.health/lcp-diagnostics-<label>.json`
- includes route/run LCP/FCP/TBT, phase durations, LCP selector, and LCP image URL

### 3) Service hero template update (Phase 1)
File: `src/app/services/[slug]/page.tsx`

Change:
- replaced direct-file mobile `<source srcSet="/images/...avif">` pathing with Next-optimized responsive source generation via `getImageProps`
- retained pilot map from `src/lib/constants.ts`
- retained desktop hero source
- retained hero composition, typography, overlays, and CTA styling

`size` string now used for both source sets:
- `"(max-width: 768px) calc(100vw - 3rem), 50vw"`

### 4) Local verification
- `npm run build`: PASS
- local smoke + screenshots report:
  - `.health/step6-1-local-smoke-report.json`
- screenshots (required breakpoints x 3 pilot routes):
  - `.health/screenshots/step6-1-service-pilot-local/*`

Local checks passed:
- mobile source selection correct
- desktop source selection correct
- no image 4xx/5xx

## Baseline Artifacts (Phase 0 Locked)
Services baseline:
- `.health/perf-gate-2026-03-02T23-31-37-066Z/summary.json`
- `.health/lcp-diagnostics-2026-03-02T23-31-37-066Z.json`

Contact baseline:
- `.health/perf-gate-2026-03-02T23-39-57-858Z/summary.json`
- `.health/lcp-diagnostics-2026-03-02T23-39-57-858Z.json`

About baseline:
- `.health/perf-gate-2026-03-02T23-43-33-269Z/summary.json`
- `.health/lcp-diagnostics-2026-03-02T23-43-33-269Z.json`

## Deployments
Production deploys executed in Step 6.1:
- Phase 1 deploy: `https://sjr-new-website-aiproject-n91zdh373.vercel.app`
- Phase 2 step-1 deploy: `https://sjr-new-website-aiproject-r4mh4wcbd.vercel.app`
- Phase 2 step-2 deploy (latest): `https://sjr-new-website-aiproject-8fsktv4fp.vercel.app`

Alias verified after each deploy:
- `https://susiesjewelryrepair.com`

## Measurements

### A) Services - Phase 1 immediate post-deploy
Source:
- `.health/perf-gate-2026-03-02T23-54-16-213Z/summary.json`
- `.health/lcp-diagnostics-2026-03-02T23-54-16-213Z.json`

p50 vs isolated baseline:
- `/services/ring-sizing`: `3124 -> 3048` (`-76ms`)
- `/services/watch-repair`: `3118 -> 3030` (`-88ms`)
- `/services/custom-design`: `2964 -> 2666` (`-298ms`)

### B) Contact guardrail - Phase 2 strict sequence

After Step 1 only (remove above-fold reveal wrappers):
- `.health/perf-gate-2026-03-03T00-09-55-388Z/summary.json`
- `/contact`: `5547ms` (regression)

After Step 2 (move trackers out of hero subtree):
- `.health/perf-gate-2026-03-03T00-16-04-239Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T00-16-04-239Z.json`
- `/contact`: `2959ms` (recovered from Step-1 regression, still >2600)

### C) Final Step 6.1 production verification (Phase 3)
Services final:
- `.health/perf-gate-2026-03-03T00-18-54-618Z/summary.json`
- `.health/lcp-diagnostics-2026-03-03T00-18-54-618Z.json`

Guardrails final:
- `/about`: `.health/perf-gate-2026-03-03T00-18-54-942Z/summary.json`
- `/contact`: `.health/perf-gate-2026-03-03T00-16-04-239Z/summary.json`

Final p50 vs isolated baseline:
- `/services/ring-sizing`: `3124 -> 2645` (`-479ms`)
- `/services/watch-repair`: `3118 -> 2969` (`-149ms`)
- `/services/custom-design`: `2964 -> 2826` (`-138ms`)
- SEO on all pilot routes: `100`

Guardrails (latest):
- `/contact`: `4377 -> 2959` (improved vs baseline, still above `<=2600`)
- `/about`: `3287 -> 2697`

## Acceptance Criteria Evaluation

### Quality
- No visual redesign introduced: PASS
- Local screenshot guardrail completed: PASS

### Performance
- `>=250ms` improvement on at least 2/3 pilot routes: FAIL (1/3)
- No pilot route regressed by >150ms: PASS
- SEO `100` on pilot routes: PASS

### Guardrails
- `/contact <=2600ms`: FAIL
- `/about` remained operational and in a similar performance band: PASS (with variance)

## Diagnostics Notes
- Final service run median `elementRenderDelay` values:
  - `/services/ring-sizing`: `656ms`
  - `/services/watch-repair`: `1388ms`
  - `/services/custom-design`: `1368ms`
- No route exceeded the Phase 1B trigger (`>1500ms` median elementRenderDelay), so AVIF->WebP format fallback was not triggered by plan condition.

## Decision
Step 6.1 is complete from an execution and evidence standpoint, but it is a partial performance outcome:
- significant gain achieved on `ring-sizing`
- moderate gains on `watch-repair` and `custom-design`
- contact remains above its stop target

## Next Optimal Step
Open Step 6.2 as a focused mobile-only above-fold DOM simplification pass for the 3 pilot service routes (subtle visual tuning only), using the Step 6.1 diagnostics as the baseline and rerunning isolated 5-run p50 diagnostics after each micro-change.
