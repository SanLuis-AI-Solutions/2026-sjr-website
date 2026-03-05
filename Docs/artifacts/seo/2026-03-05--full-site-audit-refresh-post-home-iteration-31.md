# Full Site Audit Refresh (Post Home Iteration 31)

Date: 2026-03-05  
Site: `https://www.susiesjewelryrepair.com`

## Scope and Method

- Source run: `.health/perf-gate-2026-03-05T21-32-00-678Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T21-32-00-678Z.json`
- Comparison source: `.health/perf-gate-2026-03-05T14-12-49-741Z/summary.json`
- Crawl breadth: same 30-route set as prior full-site refresh
- Lighthouse mode: mobile, isolated per-route process groups
- Run profile: 1 run per route (`--runs 1`, `--percentile 50`)
- Thresholds for data collection: `LCP<=20000`, `SEO>=0`

Command used:

```bash
node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 1 --percentile 50 --lcp-threshold-ms 20000 --seo-threshold 0 --isolate --diagnostics [30x --path]
```

## Scoring Framework (100)

1. Technical SEO health (30 points)
- Rule: 30/30 if all audited routes have SEO score `100`; else proportional.
- Result: `30/30`.

2. Performance coverage (35 points)
- Rule: `35 - count(routes with LCP > 2500ms)`.
- Result: `35 - 2 = 33/35`.

3. Core route UX speed (20 points)
- Rule:
  - avg core LCP `<=2200` => 20
  - `<=2400` => 18
  - `<=2600` => 16
  - else => 12
- Core set: `/`, `/about`, `/contact`, `/quote`, `/book`, `/services`, `/blog`
- Result: avg core LCP `2330ms` => `18/20`.

4. Discoverability and indexability hygiene (15 points)
- Result: `14/15`.

## Final Score

- **Current score: `95/100`** (unchanged)

## Key Outcomes

1. Technical SEO remains stable:
- `30/30` routes at SEO `100`.

2. Outlier set changed (not widened):
- prior outliers: `/services` (`2797ms`), `/` (`2603ms`)
- current outliers: `/services` (`2846ms`), `/blog` (`2668ms`)

3. Coverage remains stable:
- routes `<=2500ms`: `28/30` (unchanged)

4. Aggregate movement vs prior breadth snapshot:
- overall average LCP: `2301ms -> 2304ms` (`+3ms`)
- core-route average LCP: `2331ms -> 2330ms` (`-1ms`)
- score: `95/100 -> 95/100` (held)

## Great

1. Home route improved out of the outlier set in this breadth pass (`/` now `2313ms`).
2. Technical SEO stayed perfect (`30/30` at SEO `100`).
3. Conversion routes remain healthy (`/contact`, `/quote`, `/book` all ~2.0-2.2s in this snapshot).

## Good

1. Overall coverage remains `28/30` routes at or under `2500ms`.
2. Core-route average held steady despite iterative home tuning.

## Bad / Needs Improvement

1. `/services` remains the top bottleneck route (`2846ms`, `renderDelay=1530ms` in this run).
2. `/blog` surfaced as a single-run outlier (`2668ms`), likely from one-run volatility and needs a short isolated confirmation.

## Next Optimal Step

Run a focused isolated 5-run p50 confirmation on `/services` and `/blog` with diagnostics, then choose the next single-variable fix only if both remain above threshold in multi-run evidence:

```bash
node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 5 \
  --percentile 50 \
  --lcp-threshold-ms 10000 \
  --seo-threshold 100 \
  --isolate \
  --diagnostics \
  --path /services \
  --path /blog
```
