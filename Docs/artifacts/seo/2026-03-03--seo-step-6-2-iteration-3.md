# SEO Step 6.2 Iteration 3 (Post-Load Tracker Deferral)

Date: 2026-03-03  
Scope: pilot service routes only (`/services/ring-sizing`, `/services/watch-repair`, `/services/custom-design`)  
Objective: reduce mobile LCP render-path contention without changing visual composition.

## Change Applied

- File updated: `src/components/analytics/service-interaction-tracker.tsx`
- Adjustment:
  - moved tracker initialization from immediate idle scheduling to **post-`window.load` + idle** scheduling
  - kept event semantics unchanged (`service_section_view`, `service_faq_open`, delegated `service_cta_click` events)
- Rationale:
  - latest diagnostics show image load is already fast and bottleneck is render-side (`elementRenderDelay` + main-thread work), so non-critical observer wiring should not compete with LCP window.

## Verification

- Local build:
  - `npm run build` -> PASS

## Production Deploy

- Deployment URL: `https://sjr-new-website-aiproject-q7qgmxuom.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/4dSRkPUzDXcWn6iGSsUKC9MNprix`
- Alias: `https://susiesjewelryrepair.com`

## Performance Evidence

### Comparison Source

- Prior rollback baseline:
  - `.health/perf-gate-2026-03-03T16-32-13-218Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T16-32-13-218Z.json`
- Iteration 3 result:
  - `.health/perf-gate-2026-03-03T16-54-36-560Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T16-54-36-560Z.json`

### 5-run p50 deltas vs prior rollback baseline

- `/services/ring-sizing`: `3117ms -> 3040ms` (`-77ms`)
- `/services/watch-repair`: `3127ms -> 3113ms` (`-14ms`)
- `/services/custom-design`: `2812ms -> 2755ms` (`-57ms`)
- SEO remained `100` on all three routes.

### LCP phase notes (median)

- `/services/ring-sizing` render delay improved in this run set (`2161ms -> 1320ms`), but still above target LCP.
- `/services/watch-repair` render delay stayed essentially flat (`1309ms -> 1332ms`).
- `/services/custom-design` render delay stayed near prior band (`1226ms -> 1261ms`).

## Decision

- Keep this change (no regression observed).
- Step 6.2 target still not met (`<=2500ms` p50 remains failed on all 3 pilot routes), so this is a marginal improvement only.

## Next Diagnostic Direction

- Run a route-specific deep trace on `/services/watch-repair` to attribute:
  - large `Script Evaluation` / `Style & Layout` buckets
  - long-task sources (notably `/_next/static/chunks/ab387ecb63af78f3.js` and document task windows)
- Use that trace to choose one additional micro-change with direct attribution rather than another broad UI change.

