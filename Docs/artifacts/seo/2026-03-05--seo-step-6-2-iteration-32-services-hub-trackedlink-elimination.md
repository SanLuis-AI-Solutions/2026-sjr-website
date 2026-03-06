# SEO Step 6.2 — Iteration 32 (`/services` TrackedLink Boundary Elimination)

Date: 2026-03-05  
Owner: Codex

## Goal

Test whether replacing `TrackedLink` client boundaries on `/services` with server `Link` + delegated tracking reduces `elementRenderDelay` on the services hub.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-05T23-21-54-278Z/summary.json`
- Source diagnostics: `.health/lcp-diagnostics-2026-03-05T23-21-54-278Z.json`
- `/services` p50:
  - `lcp=2735ms`
  - `renderDelay=1294ms`

## Change

- Commit: `f7e4921`
- Files:
  - `src/app/services/page.tsx`
  - `src/components/analytics/services-hub-interaction-tracker.tsx` (new)
- Single-variable intent:
  - remove `TrackedLink` usage on services hub links
  - preserve event capture via one deferred document click listener (`data-track-*` delegation).

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22741610030`
- Result: `success`

3. Post-change isolated production gate
- Summary: `.health/perf-gate-2026-03-05T23-54-07-095Z/summary.json`
- `/services` p50:
  - `lcp=2725ms`
  - `renderDelay=1303ms`
- Guardrails from same run:
  - `/blog`: `2610ms`
  - `/`: `2617ms`

## Delta vs Baseline

- `/services` LCP: `2735ms -> 2725ms` (`-10ms`, non-material)
- `/services` renderDelay: `1294ms -> 1303ms` (`+9ms`, non-material)

## Decision

- Result: **Rejected**
- Reason: no material improvement on target route.
- Action taken:
  - rollback commit: `82e6f36`
  - rollback deploy run: `22742317989` (`success`)

## Post-Rollback Confirmation

- Summary: `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
- `/services` p50: `2728ms`
- `/blog` p50: `2659ms`
- `/` p50: `2522ms`

## Conclusion

Removing `TrackedLink` boundaries on `/services` is not a winning lever for the current `elementRenderDelay` pattern. Keep the rollback state and move to the next single-variable experiment.
