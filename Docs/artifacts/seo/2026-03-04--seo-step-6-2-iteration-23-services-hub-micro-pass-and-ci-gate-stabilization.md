# SEO Step 6.2 - Iteration 23 (`/services` Hub Micro-Pass + CI Gate Stabilization)

Date: 2026-03-04
Owner: Codex

## Goal
Run the planned `/services` process-of-elimination step with one low-risk micro-change, measure with isolated production diagnostics, and keep deployment gates stable.

## Baseline (Locked Before Change)
- Source: `.health/perf-gate-2026-03-04T22-23-03-693Z/summary.json`
- Route: `/services`
- Isolated 5-run p50: `2693ms`
- Diagnostics (median):
  - `ttfb=134ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=1355ms`
- LCP node evidence (`lighthouse-services-run4.json`):
  - selector: `section.relative > div.relative > div > h1.lcp-heading`
  - node label: `A curated menu of in-house repairs.`

## Changes Implemented
1. `/services` hub micro-pass (layout-preserving)
- Commit: `78ef2f4`
- File: `src/app/services/page.tsx`
- Change:
  - Added `cv-section` to below-fold sections:
    - Featured section
    - Directory/listing section

2. CI gate stability fix (false broken-image detection)
- Commit: `1a2a98f`
- File: `tests/smoke.spec.ts`
- Change:
  - `assertNoBrokenImages` now flags only actual decode/load failures:
    - from: `!img.complete || img.naturalWidth === 0`
    - to: `img.complete && img.naturalWidth === 0`
  - This prevents false failures from in-flight lazy images while preserving true broken asset detection.

## Verification
1. Local verification
- `npm run build`: PASS
- `npx playwright test tests/smoke.spec.ts --project=mobile-chromium`: PASS (`17/17`)

2. Production deployment
- Workflow: `Deploy Production (Vercel)`
- Run: `22692703231`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22692703231`
- Result: PASS (smoke + deploy + conversion/service guardrails + delta checks + diagnostics extraction)

3. Post-deploy `/services` measurement
- Source: `.health/perf-gate-2026-03-04T22-54-31-275Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-04T22-54-31-275Z.json`
- Route: `/services`
- Isolated 5-run p50: `2667ms`
- Diagnostics (median):
  - `ttfb=131ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=1299ms`

## Delta vs Baseline
- LCP: `2693ms -> 2667ms` (`-26ms`)
- elementRenderDelay: `1355ms -> 1299ms` (`-56ms`)

## Decision
- Keep iteration 23 changes live (safe, non-regressive, and gate-stabilizing).
- Mark the `/services` micro-pass as **not material** for LCP recovery.
- Root constraint remains `h1.lcp-heading` render delay; next step must target above-fold hero text paint path directly.

## Next Optimal Step
Run a single mobile-only hero text paint experiment on `/services` (one change only), then re-measure isolated 5-run p50:
- Keep premium visual direction intact.
- Apply one of:
  - reduce first-frame heading paint complexity (mobile-only typography clamp/line-height), or
  - remove one mobile-only hero decorative paint layer (not structure/copy/CTA).
- Accept only if `>=150ms` improvement; otherwise rollback and move to next isolated hypothesis.
