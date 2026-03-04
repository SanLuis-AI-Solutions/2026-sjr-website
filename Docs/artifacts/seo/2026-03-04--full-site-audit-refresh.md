# Full Site Audit Refresh (Evidence-Driven)

Date: 2026-03-04  
Site: `https://www.susiesjewelryrepair.com`

## Scope and Method

- Source run: `.health/perf-gate-2026-03-04T00-23-13-383Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-04T00-23-13-383Z.json`
- Crawl breadth: 30 routes
  - core pages (`/`, `/about`, `/contact`, `/quote`, `/book`, `/services`, `/blog`)
  - all 9 service detail pages
  - all current blog detail slugs from `src/lib/blog.ts`
- Lighthouse mode: mobile, isolated per-route process groups
- Run profile: 1 run per route (`--runs 1`, `--percentile 50`) for breadth scan
- Thresholds were set permissive for data collection (`LCP<=20000`, `SEO>=0`) to avoid early-stop bias.

## Scoring Framework (100)

This score is deterministic from captured evidence:

1. Technical SEO health (30 points)
- Rule: 30/30 if all audited routes have SEO score `100`; else proportional.
- Result: `30/30` (30/30 routes with SEO `100`).

2. Performance coverage (35 points)
- Rule: `35 - count(routes with LCP > 2500ms)`.
- Result: `35 - 6 = 29/35`.

3. Core route UX speed (20 points)
- Rule:
  - avg core LCP `<=2200` => 20
  - `<=2400` => 18
  - `<=2600` => 16
  - else => 12
- Core set: `/`, `/about`, `/contact`, `/quote`, `/book`, `/services`, `/blog`
- Result: avg core LCP `2310ms` => `18/20`.

4. Discoverability and indexability hygiene (15 points)
- Checks:
  - canonical present and valid on sampled critical routes
  - one H1 on sampled critical routes
  - sitemap includes key service and blog detail URLs
  - robots includes sitemap directive
- Result: `14/15` (strong pass; reserved 1 point due to pending outlier performance concentration on content routes).

## Final Score

- **Current score: `91/100`**

## Comparison to Previous Audits

1. Copilot audit baseline (`Docs/Copilot site audit for susiesjewelryrepair.com.md`)
- Reported overall: `7.3/10` (~73/100 directional equivalent)
- Current: `91/100`
- Directional delta: `+18`

2. Gemini audit baseline (`Docs/Gemini site audit for Susiesjewelryrepair.com.md`)
- Reported overall: `88/100`
- Current: `91/100`
- Directional delta: `+3`

Note: scoring models differ across audits; deltas are directional and evidence-aligned, not strict apples-to-apples.

## Great

1. SEO stability is now systemic
- `30/30` audited routes returned SEO score `100`.
- CI now enforces post-deploy conversion + service gates and baseline-delta checks.

2. Core conversion routes are healthy
- `/contact` `2161ms`, `/quote` `2249ms`, `/book` `2158ms`.
- All three remain in a strong mobile LCP band.

3. Service detail template quality improved materially
- All 9 service detail routes landed near the target band in this breadth run.
- Service detail average LCP: `2325ms`.

4. Crawl/index hygiene checks are clean
- Sampled critical routes return status `200`, canonical present, one H1.
- `sitemap.xml` includes key service/blog detail pages and total URL count is `33`.
- `robots.txt` includes sitemap directive.

## Good

1. Site-wide performance is mostly in-target
- Overall average LCP: `2377ms` across 30 routes.
- `24/30` routes are `<=2500ms`.

2. Blog detail performance is close but uneven
- Blog detail average LCP: `2443ms`.
- Most blog pages are in the low-2300ms range, with a small outlier cluster above threshold.

3. Render-path insights are clear enough to prioritize quickly
- Largest remaining delays are render-dominant on a small set of content pages, enabling focused next fixes instead of broad refactors.

## Bad / Needs Improvement

Outlier routes with LCP `>2500ms` (6 routes):

1. `/blog/cost-to-resize-gold-ring-pasadena` — `2916ms`
2. `/services` — `2615ms`
3. `/blog/can-a-severely-bent-ring-prong-be-fixed` — `2614ms`
4. `/blog/custom-design-timeline-guide` — `2613ms`
5. `/blog/stone-security-checklist` — `2612ms`
6. `/blog/watch-battery-replacement` — `2537ms`

Pattern:
- Remaining misses are concentrated in the services hub and a subset of blog detail hero/render paths, not across the entire site.

## Immediate Process-of-Elimination Target (Easy Wins First)

1. Blog outlier hero optimization pass (mobile-first, no design degradation)
- Generate dedicated mobile hero variants for the 5 outlier blog pages.
- Keep desktop source unchanged.
- Route mobile source through Next optimized `getImageProps`/`sizes`.

2. Services hub hero/module ordering micro-pass
- Keep premium visual design intact.
- Defer non-critical above-fold enrichments until after first paint where safe.

3. Re-run isolated 5-run p50 gate on the 6 outliers
- Accept when at least 4/6 improve by `>=200ms` and none regress by `>150ms`.

## Evidence Snippets

- Full-site breadth run summary:
  - `.health/perf-gate-2026-03-04T00-23-13-383Z/summary.json`
- Full-site diagnostics:
  - `.health/lcp-diagnostics-2026-03-04T00-23-13-383Z.json`
- Canonical/H1/schema sample checks:
  - `/`, `/about`, `/contact`, `/quote`, `/book`, `/services`, `/services/ring-sizing`, `/services/watch-repair`, `/blog`, `/blog/ring-sizing-guide`
- Sitemap and robots checks:
  - `https://www.susiesjewelryrepair.com/sitemap.xml`
  - `https://www.susiesjewelryrepair.com/robots.txt`

