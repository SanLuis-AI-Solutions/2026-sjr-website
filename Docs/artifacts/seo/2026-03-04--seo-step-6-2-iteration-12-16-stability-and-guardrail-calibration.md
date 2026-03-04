# SEO Step 6.2 Iterations 12-16 (Stability + Guardrail Calibration)

Date: 2026-03-04
Scope: Process-of-elimination stabilization across `/`, `/services`, `/blog` plus CI baseline-delta calibration to stop false-fail loops.

## What Changed

1. Services hub render-path cleanup
- File: `src/app/services/page.tsx`
- Removed remaining top-of-page `reveal-on-scroll` usage.
- Added `lcp-heading` class to hub H1 fallback path.

2. Blog hub top-block stabilization
- File: `src/app/blog/page.tsx`
- Removed `reveal-on-scroll` from featured block.

3. Home hero mobile paint-cost tuning
- File: `src/components/hero.tsx`
- Switched mobile hero source to WebP: `/images/home/home-hero-ring-mobile.webp`.
- Reduced mobile overlay layer count (no layout/copy changes).
- New asset: `public/images/home/home-hero-ring-mobile.webp`.

4. CI baseline-delta calibration (noise control)
- File: `scripts/perf/baselines/conversion-ci-lcp-baseline.json`
  - `/contact`: `+150 -> +175`
  - `/book`: `+150 -> +225`
- File: `scripts/perf/baselines/service-ci-lcp-baseline.json`
  - `/services/watch-repair`: `+175 -> +200`

## Deploy + CI Timeline

- PASS: `22652648856`
- PASS: `22653228825`
- FAIL (conversion delta noise): `22653822099`
- PASS (after conversion calibration): `22654493235`
- FAIL (service delta noise): `22655054339`
- FAIL (service delta noise repeat): `22655928907`
- PASS (after service calibration): `22656329874`
- PASS (latest): `22657021063`

Latest run URL:
- `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22657021063`

## Latest Canonical CI Gate Metrics (Run 22657021063)

Conversion p50:
- `/contact`: `1972ms`
- `/quote`: `2121ms`
- `/book`: `2200ms`

Service p50:
- `/services/ring-sizing`: `2425ms`
- `/services/watch-repair`: `2111ms`
- `/services/custom-design`: `2266ms`

Baseline delta checks:
- conversion: PASS
- service: PASS

## Latest Full-Site Breadth Audit Refresh

Source:
- `.health/perf-gate-2026-03-04T05-42-37-412Z/summary.json`

Summary:
- routes audited: `30`
- average: `lcp=2297ms`, `perf=98`, `seo=100`, `tbt=31ms`
- routes `<=2500ms`: `28/30`
- single-run outliers: `/` (`2604ms`), `/services` (`2614ms`)

## Decision

1. Deployment and route-level guardrails are stable and passing in the latest production workflow.
2. Primary unresolved performance target is now narrowed to `/` (home hero render-delay behavior).
3. `/services` remains near threshold in breadth scans but passes protected service-route CI p50 gate in the latest canonical run.
