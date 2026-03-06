# Handoff Snapshot — 2026-03-06 (CST)

## Current State
- Branch: `master`
- Workspace: clean
- Canonical domain: `https://www.susiesjewelryrepair.com`
- Primary status ledger: `Docs/STATUS.md`

## Session Summary (Most Recent)
1. Locked the required same-window control baseline for iteration 38 with two back-to-back isolated 5-run p50 diagnostics on live production.
   - control #1: `.health/perf-gate-2026-03-06T20-57-37-196Z/summary.json`
   - control #2: `.health/perf-gate-2026-03-06T21-04-20-268Z/summary.json`
   - `/services` control midpoint: `2751ms`
2. Executed iteration 38 (`/services` mobile quick-actions shell deferral).
   - experiment commit on `master`: `fecc9fa`
   - workflow run: `22782377938` (`success`)
   - post-change evidence: `.health/perf-gate-2026-03-06T21-35-38-602Z/summary.json`
   - result: rejected (`/services +49ms` vs locked midpoint; guardrails stable but non-material)
3. Rolled back iteration 38 immediately.
   - rollback commit: `fdf9710`
   - rollback deploy run: `22783142526` (`success`)
   - rollback evidence: `.health/perf-gate-2026-03-06T21-59-25-510Z/summary.json`
4. Iteration 37 remains documented as the prior rejected shell-adjacent blur-only test and should stay eliminated.
5. Current artifact set now includes:
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-35-blog-topic-filter-trackedlink-elimination.md`
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-36-services-font-serif-removal.md`
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-37-services-mobile-quick-actions-blur-removal.md`
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-38-services-mobile-quick-actions-shell-deferral.md`
   - `Docs/STATUS.md`

## Locked Context (Do Not Regress)
- Iteration 32 (`/services` TrackedLink elimination) was tested, rejected, and rolled back.
- Iteration 35 (`/blog` topic-filter TrackedLink elimination) is accepted and should remain live.
- Iteration 36 (`/services` hero `font-serif` removal) is rejected and rolled back.
- Iteration 37 (`/services` mobile quick-actions blur removal) is rejected and rolled back.
- Iteration 38 (`/services` mobile quick-actions shell deferral) is rejected and rolled back.
- `/services` remains the primary unstable bottleneck with text-LCP render-delay volatility.

## Evidence Pointers
- Iteration 35 pre-change lock: `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
- Iteration 35 accepted run: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- Iteration 36 pre-change lock: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- Iteration 36 experiment run: `.health/perf-gate-2026-03-06T18-57-48-001Z/summary.json`
- Iteration 36 rollback run: `.health/perf-gate-2026-03-06T19-22-02-949Z/summary.json`
- Iteration 37 control #1: `.health/perf-gate-2026-03-06T19-42-30-823Z/summary.json`
- Iteration 37 control #2: `.health/perf-gate-2026-03-06T19-48-46-123Z/summary.json`
- Iteration 37 experiment run: `.health/perf-gate-2026-03-06T20-06-23-964Z/summary.json`
- Iteration 37 rollback run: `.health/perf-gate-2026-03-06T20-30-37-523Z/summary.json`
- Iteration 38 control #1: `.health/perf-gate-2026-03-06T20-57-37-196Z/summary.json`
- Iteration 38 control #2: `.health/perf-gate-2026-03-06T21-04-20-268Z/summary.json`
- Iteration 38 experiment run: `.health/perf-gate-2026-03-06T21-35-38-602Z/summary.json`
- Iteration 38 rollback run: `.health/perf-gate-2026-03-06T21-59-25-510Z/summary.json`

## Next Optimal Step
Run another strict same-window elimination pass, but move beyond blur-only treatment and shell deferral:
1. Lock the control baseline again with the same two back-to-back isolated 5-run p50 diagnostics on current live `master` (`/services`, `/blog`, `/`).
2. Choose one new `/services` fixed quick-actions shell simplification lever that removes the outer shell container while keeping two fixed CTA pills available.
3. Explicitly do not repeat:
   - services TrackedLink elimination
   - services hero `font-serif` removal
   - services mobile quick-actions blur removal
   - services mobile quick-actions shell deferral
4. Run the same verify/deploy/measure loop and rollback immediately if the result is non-material.

## External-Agent Output Rule (Mandatory)
When delegating to Gemini or Claude, require persistent artifacts:
1. They must save findings to a file under `Docs/artifacts/` (or a specified artifact path).
2. Response must include: branch, commit, artifact path, run IDs, exact commands, and pass/fail decision.
3. No “done” claim is valid without a file path plus at least one metric/run evidence reference.

## GPT-5.4 New Chat Kickoff Prompt
```text
Continue from current master state of:
C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject

Read first (in order):
1) Docs/HANDOFF.md
2) Docs/STATUS.md
3) Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-35-blog-topic-filter-trackedlink-elimination.md
4) Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-36-services-font-serif-removal.md
5) Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-37-services-mobile-quick-actions-blur-removal.md
6) Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-38-services-mobile-quick-actions-shell-deferral.md
7) Docs/PERF-LCP-FIX.md

Context to respect:
- Iteration 32 (/services TrackedLink elimination) is rejected and rolled back.
- Iteration 35 (/blog topic-filter TrackedLink elimination) is accepted and live.
- Iteration 36 (/services hero font-serif removal) is rejected and rolled back.
- Iteration 37 (/services mobile quick-actions blur removal) is rejected and rolled back.
- Iteration 38 (/services mobile quick-actions shell deferral) is rejected and rolled back.
- Use strict process-of-elimination; do not repeat rejected hypotheses.

Task:
1) Lock same-window baseline:
   - run isolated diagnostics twice back-to-back:
     node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /
2) Choose one non-repeated single-variable /services render-delay experiment.
   - do not repeat TrackedLink elimination, hero font-serif removal, quick-actions blur removal, or quick-actions shell deferral
3) Verify locally:
   - npm run build
   - npm run test -- --grep "mobile smoke: repeated nav to Home is stable"
   - npm run test -- --grep "mobile nav: menu opens and can reach Services"
4) Deploy production and rerun isolated diagnostics.
5) Document under Docs/artifacts/seo/ (next iteration number) and update Docs/STATUS.md + Docs/HANDOFF.md.
6) If non-material, rollback immediately and document rollback evidence.

Required output:
- commits
- deploy workflow run IDs
- baseline vs after metric table
- accept/reject decision
- next optimal step
```
