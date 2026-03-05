# Prompt: Claude (Home LCP Forensics)

You are working in this repo:
`C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject`

Mission:
Run home-page LCP forensics and produce one evidence-based next-change recommendation (analysis + artifact only, no code edits).

Hard constraints:
- No source code changes.
- No deployment.
- Do NOT edit `Docs/STATUS.md`.
- Only create one artifact file.
- Use measured evidence only (no guessing).

Primary evidence to analyze:
- `.health/perf-gate-2026-03-05T15-02-48-628Z/summary.json`
- `.health/lcp-diagnostics-2026-03-05T15-02-48-628Z.json`
- `.health/perf-gate-2026-03-05T16-07-48-547Z/summary.json`
- `.health/lcp-diagnostics-2026-03-05T16-07-48-547Z.json`
- `Docs/PERF-LCP-FIX.md`
- `src/components/hero.tsx`
- `src/components/home-sections.tsx`

Required command:
```bash
node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 10 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /
```

Then:
```bash
node scripts/perf/extract-lcp-diagnostics.mjs --dir <new perf-gate-dir>
```

Required output file:
- `Docs/artifacts/seo/2026-03-05--claude-home-lcp-forensics.md`

Artifact must include:
1. Objective
2. Commands run
3. New baseline metrics (p50 + per-run table)
4. Bottleneck analysis (ttfb/load/render split)
5. Top 3 hypotheses ranked by confidence and expected ms impact
6. Single best next micro-change (one change only) with exact target file and line area
7. Verification plan (commands + pass/fail criteria)
8. What not to change (preserve brand/layout)

Git/process requirements:
- Branch: `agent/claude-home-lcp-forensics-20260305`
- Commit only the artifact file.
- Final response must follow `Docs/agent-briefs/2026-03-05-home-recovery/INTAKE_CHECKLIST.md` exactly.
