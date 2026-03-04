# SEO Step 6.2 — Iteration 17 (Home Hero Decode Async)

Date: 2026-03-04  
Owner: Codex  
Scope: `/` route only (home hero render-delay stream)

## Objective
Run one isolated, low-risk variable change on the home LCP element and measure with the same isolated 5-run p50 method used in Step 6.2.

## Change Applied
- File: `src/components/hero.tsx`
- Change: home hero `<img>` decode mode
  - `decoding="sync"` -> `decoding="async"`
- No copy/layout/brand style changes.

## Deployment Evidence
- Commit: `c8dc480`
- Workflow: `Deploy Production (Vercel)` run `22679162288`
- Result: `success`
- Existing CI guardrails in same run: PASS
  - Conversion p50:
    - `/contact`: `2169ms`
    - `/quote`: `2130ms`
    - `/book`: `2208ms`
  - Service p50:
    - `/services/ring-sizing`: `2424ms`
    - `/services/watch-repair`: `2264ms`
    - `/services/custom-design`: `2267ms`

## Before/After Measurement (Home Isolated 5-run p50)
- Baseline source (before): `.health/perf-gate-2026-03-04T05-40-12-512Z/summary.json`
- Post-change source (after): `.health/perf-gate-2026-03-04T16-56-49-516Z/summary.json`

## Result
- `/` LCP p50:
  - Before: `2617ms`
  - After: `2593ms`
  - Delta: `-24ms`
- `/` median diagnostics:
  - `elementRenderDelay`: `1208ms` -> `1234ms` (`+26ms`)
  - LCP element unchanged: `main#main-content > section.relative > div.absolute > img.absolute`
  - LCP image unchanged: `/images/home/home-hero-ring-mobile.webp`

## Decision
- This change did not produce a meaningful recovery toward `<=2500ms` for `/`.
- Keep this small change in place (no guardrail regressions), but mark it as **insufficient** and do not repeat this path.

## Next Optimal Step
Move to the next highest-probability, still-subtle mobile-only intervention:
- limit above-fold text animation work on `/` to desktop only (`md:`-scoped `animate-fade-up` in hero copy/CTA stack),
- then rerun isolated `/` 5-run p50 diagnostics.

