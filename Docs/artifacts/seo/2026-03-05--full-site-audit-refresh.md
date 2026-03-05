# Full Site Audit Refresh (Evidence-Driven)

Date: 2026-03-05  
Site: `https://www.susiesjewelryrepair.com`

## Scope and Method

- Source run: `.health/perf-gate-2026-03-05T14-12-49-741Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T14-12-49-741Z.json`
- Crawl breadth: 30 routes (same set as the prior breadth audit snapshot)
- Lighthouse mode: mobile, isolated per-route process groups
- Run profile: 1 run per route (`--runs 1`, `--percentile 50`)
- Thresholds set permissive for data collection (`LCP<=20000`, `SEO>=0`) to prevent early-stop bias.

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
- Result: avg core LCP `2331ms` => `18/20`.

4. Discoverability and indexability hygiene (15 points)
- Result: `14/15` (held from prior framework weighting).

## Final Score

- **Current score: `95/100`** (unchanged vs prior breadth snapshot)

## Key Outcomes

1. SEO health remains stable:
- `30/30` routes at SEO `100`.

2. Outlier set is unchanged:
- `/services`: `2797ms`
- `/`: `2603ms`

3. Coverage remains strong:
- routes `<=2500ms`: `28/30` (unchanged)

4. Aggregate movement vs prior breadth snapshot (`.health/perf-gate-2026-03-04T21-06-28-437Z/summary.json`):
- overall average LCP: `2261ms -> 2301ms` (`+40ms`)
- core-route average LCP: `2262ms -> 2331ms` (`+69ms`)
- score: `95/100 -> 95/100` (held)

## Great

1. Technical SEO stayed perfect (`30/30` at SEO `100`).
2. Conversion core routes stayed healthy (`/contact`, `/quote`, `/book` all near ~2.15-2.17s).
3. Blog detail routes remain consistently under threshold in this scan.

## Good

1. Site-wide breadth still holds `28/30` routes at or under `2500ms`.
2. Service detail pages remain mostly stable and in-band (single-run checks mostly low-2300ms to mid-2400ms).

## Bad / Needs Improvement

1. `/services` and `/` remain the only breadth outliers.
2. These two routes show volatility between breadth 1-run scans and isolated multi-run checks, so single-run snapshots alone are not sufficient for code-change decisions.

## Next Optimal Step (Process-of-Elimination)

Run one isolated 5-run p50 gate with diagnostics on `/` and `/services` together to lock a noise-resistant baseline for both routes before any additional UI/perf code changes:

```bash
node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 5 \
  --percentile 50 \
  --lcp-threshold-ms 10000 \
  --seo-threshold 100 \
  --isolate \
  --diagnostics \
  --path / \
  --path /services
```

Decision rule:
- If `/services` p50 remains above `2600ms`, continue services-hub micro-pass.
- If `/services` drops below `2500ms` while `/` remains high, shift priority to home-only render-delay reduction.
