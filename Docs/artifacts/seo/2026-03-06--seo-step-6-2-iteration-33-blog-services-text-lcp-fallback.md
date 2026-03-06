# SEO Step 6.2 — Iteration 33 (`/blog` + `/services` Text LCP Fallback Class)

Date: 2026-03-06  
Owner: Codex

## Goal

Test one single-variable text paint fallback experiment by applying `lcp-heading` to above-fold text LCP candidates on `/blog` and `/services`.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
- `/services` p50:
  - `lcp=2728ms`
  - `renderDelay=1309ms`
- `/blog` p50:
  - `lcp=2659ms`
  - `renderDelay=1280ms`
- `/` p50:
  - `lcp=2522ms`
  - `renderDelay=1332ms`

## Change

- Commit: `77921bf`
- Files:
  - `src/app/blog/page.tsx`
  - `src/app/services/page.tsx`
- Single-variable intent:
  - add `lcp-heading` fallback class to above-fold heading candidates only.
  - no analytics, routing, layout, or asset-loading changes.

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22744099680`
- Result: `success`

3. Post-change isolated production gate
- Summary: `.health/perf-gate-2026-03-06T01-19-48-431Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-06T01-19-48-431Z.json`
- `/services` p50:
  - `lcp=2430ms`
  - `renderDelay=717ms`
- `/blog` p50:
  - `lcp=2611ms`
  - `renderDelay=1311ms`
- `/` p50:
  - `lcp=2312ms`
  - `renderDelay=270ms`

## Delta vs Baseline

- `/services` LCP: `2728ms -> 2430ms` (`-298ms`)
- `/services` renderDelay: `1309ms -> 717ms` (`-592ms`)
- `/blog` LCP: `2659ms -> 2611ms` (`-48ms`, non-material)
- `/blog` renderDelay: `1280ms -> 1311ms` (`+31ms`, non-material)
- `/` LCP: `2522ms -> 2312ms` (`-210ms`)
- `/` renderDelay: `1332ms -> 270ms` (`-1062ms`)

## Decision

- Result: **Accepted (keep live)**
- Acceptance rule check:
  - at least one target route improved by `>=150ms`: **PASS** (`/services -298ms`)
  - no `/` regression worse than `+150ms`: **PASS** (`/` improved by `-210ms`)

## Next Optimal Step

Run one `/blog`-only single-variable pass focused on above-fold render delay (for example: remove `reveal-on-scroll` from first-render library cards only), then re-measure with the same isolated 5-run p50 command.
