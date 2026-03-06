# Handoff Snapshot — 2026-03-06 (CST)

## Current State
- Branch: `master`
- Workspace: clean
- Canonical domain: `https://www.susiesjewelryrepair.com`
- Primary status ledger: `Docs/STATUS.md`

## Session Summary (Most Recent)
1. Accepted iteration 35 (`/blog` topic-filter TrackedLink boundary elimination).
   - commit: `53bc042`
   - deploy run: `22747534882` (`success`)
   - doc sync commit: `9bbe175`
   - doc deploy run: `22748101732` (`success`)
2. Reviewed external-agent input:
   - Gemini: correctly identified `/services` hydration bimodality, but suggested repeating services TrackedLink elimination (already rejected in iteration 32).
   - Claude: produced one-line isolated test commit to remove `font-serif` from `/services` hero `h1`.
3. Executed Claude single-variable test as iteration 36.
   - experiment commit on `master`: `bb7befc`
   - deploy run: `22777008222` (`success`)
   - post-change evidence: `.health/perf-gate-2026-03-06T18-57-48-001Z/summary.json`
   - result: rejected (no material `/services` gain; negative drift in run set).
4. Rolled back iteration 36 immediately.
   - rollback commit: `09c9d68`
   - rollback deploy run: `22777865461` (`success`)
   - rollback evidence: `.health/perf-gate-2026-03-06T19-22-02-949Z/summary.json`
5. Documentation synced:
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-35-blog-topic-filter-trackedlink-elimination.md`
   - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-36-services-font-serif-removal.md`
   - `Docs/STATUS.md`

## Locked Context (Do Not Regress)
- Iteration 32 (`/services` TrackedLink elimination) was tested, rejected, and rolled back.
- Iteration 35 (`/blog` topic-filter TrackedLink elimination) is accepted and should remain live.
- Iteration 36 (`/services` hero `font-serif` removal) is rejected and rolled back.
- `/services` remains the primary unstable bottleneck with text-LCP render-delay volatility.

## Evidence Pointers
- Iteration 35 pre-change lock: `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
- Iteration 35 accepted run: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- Iteration 36 pre-change lock: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- Iteration 36 experiment run: `.health/perf-gate-2026-03-06T18-57-48-001Z/summary.json`
- Iteration 36 rollback run: `.health/perf-gate-2026-03-06T19-22-02-949Z/summary.json`

## Next Optimal Step
Run a measurement-stabilization gate before any new code change:
1. Execute two back-to-back isolated 5-run p50 diagnostics on current live `master` (`/services`, `/blog`, `/`).
2. Use that same-window control as the only baseline for iteration 37.
3. Select one new non-repeated `/services` render-delay lever (not services TrackedLink elimination, not font-serif removal), then run the standard verify/deploy/measure loop.

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
5) Docs/PERF-LCP-FIX.md

Context to respect:
- Iteration 32 (/services TrackedLink elimination) is rejected and rolled back.
- Iteration 35 (/blog topic-filter TrackedLink elimination) is accepted and live.
- Iteration 36 (/services hero font-serif removal) is rejected and rolled back.
- Use strict process-of-elimination; do not repeat rejected hypotheses.

Task:
1) Lock same-window baseline:
   - run isolated diagnostics twice back-to-back:
     node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /
2) Choose one non-repeated single-variable /services render-delay experiment.
3) Verify locally:
   - npm run build
   - npm run test -- --grep "mobile smoke: repeated nav to Home is stable"
   - npm run test -- --grep "mobile nav: menu opens and can reach Services"
4) Deploy production and rerun isolated diagnostics.
5) Document under Docs/artifacts/seo/ (next iteration number) and update Docs/STATUS.md.
6) If non-material, rollback immediately and document rollback evidence.

Required output:
- commits
- deploy workflow run IDs
- baseline vs after metric table
- accept/reject decision
- next optimal step
```
