# SEO Step 6.2 Iteration 4 (Process-of-Elimination: Prefetch Contention)

Date: 2026-03-03  
Scope: pilot service routes (`/services/ring-sizing`, `/services/watch-repair`, `/services/custom-design`)  
Objective: eliminate repeated LCP misses without repeating failed experiments.

## Elimination Process

### Hypothesis A (iteration 3 carryover)
- Claim: post-load deferral of `ServiceInteractionTracker` may reduce LCP-window contention.
- Result: minor gains only; all 3 pilot routes still above 2500ms in prior run.
- Decision: keep (no regression), but insufficient alone.

### Hypothesis B (new)
- Claim: `next/link` prefetch activity on service pages is competing in the LCP window.
- Evidence before change:
  - isolated diagnostics showed multiple early `?_rsc` fetches to `/quote`, `/book`, and `/` during service-page load.
  - representative run: `.health/perf-gate-2026-03-03T16-54-36-560Z/.../lighthouse-services-watch-repair-run3.json`.
- Change:
  - added `prefetch={false}` to all `Link` instances in `src/app/services/[slug]/page.tsx`.
- Outcome:
  - measurable improvement, especially on `/services/watch-repair`.

### Hypothesis C (new)
- Claim: residual `/?_rsc` prefetches from header home link still add avoidable early work.
- Evidence before change:
  - after Hypothesis B, run-level diagnostics still showed root prefetch requests.
- Change:
  - added `prefetch={false}` to home brand link in `src/components/site-header.tsx`.
- Outcome:
  - `?_rsc` prefetch count dropped to zero in representative service runs.
  - pilot 3-route gate reached pass state at p50 threshold.

### Hypothesis D (guardrail extension, rejected)
- Claim: apply the same `prefetch={false}` tactic to `ConversionQuickActions` links to improve `/contact`.
- Change tested:
  - temporarily set `prefetch={false}` in `src/components/analytics/conversion-quick-actions.tsx`.
  - deploy tested: `https://sjr-new-website-aiproject-q5y1wjjpj.vercel.app`
- Result:
  - `/contact` regressed severely in repeated 5-run p50 checks (around `~5.2s` LCP).
  - no reliable guardrail gain.
- Decision:
  - rejected and rolled back immediately.
  - rollback deploy: `https://sjr-new-website-aiproject-7x9lx0ew9.vercel.app`

## Files Changed

- `src/components/analytics/service-interaction-tracker.tsx` (kept from iteration 3)
- `src/app/services/[slug]/page.tsx` (disable service-route `Link` prefetches)
- `src/components/site-header.tsx` (disable home-link prefetch)

## Deployments

- Iteration 3 deploy:
  - `https://sjr-new-website-aiproject-q7qgmxuom.vercel.app`
  - inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/4dSRkPUzDXcWn6iGSsUKC9MNprix`
- Iteration 4A deploy (service-route prefetch disable):
  - `https://sjr-new-website-aiproject-jqfdfvhnw.vercel.app`
  - inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/FJAnBdzZY4x3F4sVwS6S2nr9TUr2`
- Iteration 4B deploy (header home-link prefetch disable):
  - `https://sjr-new-website-aiproject-flubtwefz.vercel.app`
  - inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/C9uG4SPdRf7cGiecFjsbruWtraXW`
- Iteration 4C test deploy (guardrail extension, rejected):
  - `https://sjr-new-website-aiproject-q5y1wjjpj.vercel.app`
  - inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/7cAtq3p1EeUDB9LxJagz2CxpjP3a`
- Iteration 4C rollback deploy:
  - `https://sjr-new-website-aiproject-7x9lx0ew9.vercel.app`
  - inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/AyHUFWgJYHE2XTkrm2k6MJYamy2T`
- Alias:
  - `https://susiesjewelryrepair.com`

## Verification Artifacts

- Iteration 3 baseline set:
  - `.health/perf-gate-2026-03-03T16-54-36-560Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T16-54-36-560Z.json`
- Iteration 4A set:
  - `.health/perf-gate-2026-03-03T17-13-49-588Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T17-13-49-588Z.json`
- Iteration 4B final stable set (services):
  - `.health/perf-gate-2026-03-03T17-35-38-805Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T17-35-38-805Z.json`
- Guardrails:
  - `.health/perf-gate-2026-03-03T17-42-14-398Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-03T17-42-14-398Z.json`
  - rejected-iteration test: `.health/perf-gate-2026-03-03T17-51-53-615Z/summary.json`
  - post-rollback check: `.health/perf-gate-2026-03-03T18-01-50-969Z/summary.json`
  - post-rollback diagnostics: `.health/lcp-diagnostics-2026-03-03T18-01-50-969Z.json`

## Metrics

### Services: iteration 3 -> iteration 4B (p50)

- `/services/ring-sizing`: `3040ms -> 2447ms` (`-593ms`)
- `/services/watch-repair`: `3113ms -> 2379ms` (`-734ms`)
- `/services/custom-design`: `2755ms -> 2397ms` (`-358ms`)
- SEO remained `100` on all pilot routes.

### Services: Step 6.1 final -> iteration 4B (p50)

- `/services/ring-sizing`: `2645ms -> 2447ms` (`-198ms`)
- `/services/watch-repair`: `2969ms -> 2379ms` (`-590ms`)
- `/services/custom-design`: `2826ms -> 2397ms` (`-429ms`)

### Representative prefetch evidence

- Before full prefetch elimination:
  - service runs showed early `?_rsc` fetches for `/quote`, `/book`, and `/`.
- After full prefetch elimination:
  - representative run showed `rsc_prefetch_count = 0` for service route check.

## Acceptance Status (Pilot Services)

- SEO `100` on all pilot routes: PASS.
- p50 LCP <=2500ms on all three pilot routes in final stable run: PASS.
- Process discipline goal (no repeated blind changes): PASS (each iteration had explicit hypothesis, measurement, and keep/reject decision).

## Remaining Risk / Note

- Guardrail pages are improved from earlier outliers but still above strict 2600ms target in this run:
  - `/about`: `2473ms` (latest check)
  - `/contact`: `5248ms` (latest check, unstable high)
- This did not regress as part of service-page prefetch elimination and should be handled as a separate guardrail workstream.
