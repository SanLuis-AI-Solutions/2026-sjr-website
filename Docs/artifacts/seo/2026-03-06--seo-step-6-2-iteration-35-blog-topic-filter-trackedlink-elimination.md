# SEO Step 6.2 — Iteration 35 (`/blog` Topic Filter TrackedLink Boundary Elimination)

Date: 2026-03-06  
Owner: Codex

## Goal

Run one single-variable experiment on `/blog` to reduce above-fold hydration density by replacing topic-filter `TrackedLink` client boundaries with server-rendered `Link` plus delegated analytics tracking.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-06T00-18-19-987Z/summary.json`
- `/services` p50:
  - `lcp=2728ms`
- `/blog` p50:
  - `lcp=2659ms`
- `/` p50:
  - `lcp=2522ms`

## Change

- Commits:
  - `dc10326` (diagnostics selector recovery required to extract text-LCP nodes reliably)
  - `53bc042` (iteration variable change)
- Files:
  - `src/app/blog/page.tsx`
  - `src/components/analytics/blog-topic-filter-tracker.tsx`
- Single-variable intent:
  - replace `/blog` topic-filter `TrackedLink` usage with plain `Link` + `data-track-*`.
  - preserve click analytics via one delegated tracker client component initialized after load/idle.
  - no image, font, animation, or layout redesign changes.

## Verification

1. Local checks
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22747534882`
- Result: `success`

3. Post-change isolated production gate
- Command:
  - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 10000 --seo-threshold 100 --isolate --diagnostics --path /services --path /blog --path /`
- Summary: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- `/services` p50:
  - `lcp=2724ms`
  - `lcp-element=section.relative > div.relative > div > h1.lcp-heading`
- `/blog` p50:
  - `lcp=2246ms`
  - `lcp-element=main#main-content > section.relative > div.relative > p.mt-4`
- `/` p50:
  - `lcp=2536ms`
  - `lcp-element=main#main-content > section.relative > div.absolute > img.absolute`

## Delta vs Baseline

- `/services` LCP: `2728ms -> 2724ms` (`-4ms`, noise)
- `/blog` LCP: `2659ms -> 2246ms` (`-413ms`, material)
- `/` LCP: `2522ms -> 2536ms` (`+14ms`, noise)

## Decision

- Result: **Accepted (keep live)**
- Acceptance rule check:
  - target-route material improvement (`>=150ms`): **PASS** (`/blog -413ms`)
  - no `/` regression worse than `+150ms`: **PASS** (`/ +14ms`)

## Next Optimal Step

Run one `/services`-only above-fold render-delay decomposition pass focused on text LCP variability (no asset-format changes): isolate and test one hydration-boundary reduction candidate in the hero CTA/filter region, then re-measure with the same isolated 5-run p50 command.
