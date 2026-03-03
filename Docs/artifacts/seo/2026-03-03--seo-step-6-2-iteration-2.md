# SEO Step 6.2 - Iteration 2 (Hero LCP Decode Sync Test)

Date: 2026-03-03  
Owner: Codex  
Status: Failed experiment, rolled back.

## Goal
Test a single, minimal decode-path change on service hero LCP image and measure isolated production impact.

## Change Tested
File:
- `src/app/services/[slug]/page.tsx`

Change:
- hero LCP image decode hint switched from `decoding="async"` to `decoding="sync"`.

## Local Verification
- `npm run build`: PASS.

## Production Deploy (Test Build)
- URL: `https://sjr-new-website-aiproject-fonn9va56.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/96YR4fycHuSi6Mvg6p236RRkpZG3`
- Alias: `https://susiesjewelryrepair.com`

## Isolated 5-run p50 Results (Decode Sync)
- Summary: `.health/perf-gate-2026-03-03T16-21-58-133Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-03T16-21-58-133Z.json`

p50:
- `/services/ring-sizing`: `3186ms`
- `/services/watch-repair`: `3040ms`
- `/services/custom-design`: `2831ms`

Compared to recent restored baseline (`.health/perf-gate-2026-03-03T01-08-14-035Z/summary.json`):
- `/services/ring-sizing`: `2702 -> 3186` (`+484ms`)
- `/services/watch-repair`: `3045 -> 3040` (`-5ms`)
- `/services/custom-design`: `2743 -> 2831` (`+88ms`)

Result: net regression.

## Rollback
Action:
- reverted decode hint back to `decoding="async"` in `src/app/services/[slug]/page.tsx`.

Rollback deploy:
- URL: `https://sjr-new-website-aiproject-o7v0ixo0x.vercel.app`
- Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/4jz2t7GN5zKZdebuUAV2aJSpHdW5`

Rollback verification:
- Summary: `.health/perf-gate-2026-03-03T16-32-13-218Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-03T16-32-13-218Z.json`

## Decision
Iteration 2 failed and is not a candidate for rollout.

## Next Step
Proceed with a `/debug`-style route-specific above-fold workload isolation pass (watch-repair first), then apply one targeted micro-change tied to the highest repeatable bottleneck.
