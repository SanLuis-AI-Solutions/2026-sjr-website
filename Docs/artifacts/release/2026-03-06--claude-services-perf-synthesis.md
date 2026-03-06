# Claude Services Perf Synthesis

- branch: `master`
- commit: `0401274`
- artifact path: `Docs/artifacts/release/2026-03-06--claude-services-perf-synthesis.md`
- source evidence used:
  - `Docs/HANDOFF.md`
  - `Docs/STATUS.md`
  - `Docs/PERF-LCP-FIX.md`
  - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-35-blog-topic-filter-trackedlink-elimination.md`
  - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-36-services-font-serif-removal.md`
  - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-37-services-mobile-quick-actions-blur-removal.md`
  - `Docs/artifacts/seo/2026-03-06--seo-step-6-2-iteration-38-services-mobile-quick-actions-shell-deferral.md`
  - `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
  - `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
  - `.health/perf-gate-2026-03-06T18-57-48-001Z/summary.json`
  - `.health/perf-gate-2026-03-06T20-06-23-964Z/summary.json`
  - `.health/perf-gate-2026-03-06T21-35-38-602Z/summary.json`
- exact commands attempted:
  - `Get-Command claude -ErrorAction SilentlyContinue`
  - `where.exe claude`
  - `where.exe claude-code`

## Execution Note

Direct Claude CLI delegation was not available in the current runtime. The commands above returned no callable Claude binary. To avoid blocking closeout, this artifact records a Codex fallback synthesis against the same evidence set and marks the Claude lane as not executed.

## Eliminated Hypotheses

- Iteration 32: `/services` `TrackedLink` elimination.
- Iteration 36: `/services` hero `font-serif` removal.
- Iteration 37: `/services` mobile quick-actions blur removal.
- Iteration 38: `/services` mobile quick-actions shell deferral.

## Surviving Hypotheses

- Structural fixed-shell redesign on `/services` mobile quick actions remains the only still-plausible family of levers, but current evidence does not justify reopening it during closeout.
- Larger route-architecture changes on `/services` could still move render delay, but those are no longer closeout-safe and do not meet the "single high-conviction next lever" bar for same-day experimentation.

## Recommendation

`close as backlog`

Rationale:

- The accepted wins are already live: iteration 33 materially improved `/services`, and iteration 35 materially improved `/blog`.
- Four recent `/services` follow-up hypotheses have now been eliminated or rejected without a decisive positive signal.
- The remaining plausible levers are structural enough to belong in a deliberate post-launch performance sprint, not a release-closeout loop.

## Done

- Re-synthesized the current `/services` evidence stack.
- Confirmed that the recent rejected experiments are distinct and should remain off-limits.
- Determined that there is no currently documented, non-repeated, high-confidence lever that justifies delaying finish.

## Not Done

- No live Claude-generated artifact was produced because the Claude CLI was unavailable in this environment.
- No new `/services` experiment was run.

## Risks

- `/services` remains slower than target and should stay visible in the post-launch backlog.
- Reopening the elimination loop without a materially different structural hypothesis will likely recreate the same churn pattern.
