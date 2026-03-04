# SEO Step 6.2 — Iteration 18 (Home Mobile Animation Gating)

Date: 2026-03-04  
Owner: Codex  
Scope: `/` route only (home hero render-delay stream)

## Objective
Reduce mobile above-fold animation/composition work on the home hero text/CTA stack while preserving desktop premium motion.

## Change Applied
- Files:
  - `src/components/hero.tsx`
  - `src/app/globals.css`
- Implementation:
  - Added `home-hero-mobile-static` class to hero badge, H1, paragraph, divider, and CTA wrapper.
  - Added mobile-only override (`max-width: 767px`) to disable animation and force stable paint:
    - `animation: none`
    - `opacity: 1`
    - `transform: none`
- Desktop behavior unchanged (original `animate-fade-up` remains active at `>=768px`).

## Deployment Evidence
- Commit: `8ff958f`
- Workflow: `Deploy Production (Vercel)` run `22680479756`
- Result: `success`
- Existing CI guardrails in same run: PASS
  - Conversion p50:
    - `/contact`: `2254ms`
    - `/quote`: `2138ms`
    - `/book`: `2181ms`
  - Service p50:
    - `/services/ring-sizing`: `2428ms`
    - `/services/watch-repair`: `2267ms`
    - `/services/custom-design`: `2420ms`

## Home Measurements

Baseline before iteration 18:
- `.health/perf-gate-2026-03-04T16-56-49-516Z/summary.json`
- `/` p50: `2593ms`
- median `elementRenderDelay`: `1234ms`

Post-change run A (isolated 5-run p50):
- `.health/perf-gate-2026-03-04T17-30-16-187Z/summary.json`
- `/` p50: `2317ms`
- median `elementRenderDelay`: `295ms`

Post-change run B (isolated 5-run p50 confirmation):
- `.health/perf-gate-2026-03-04T17-32-24-146Z/summary.json`
- `/` p50: `2603ms`
- median `elementRenderDelay`: `1288ms`

Post-change stabilization run (isolated 10-run p50):
- `.health/perf-gate-2026-03-04T17-34-31-833Z/summary.json`
- `/` p50: `2602ms`
- median `elementRenderDelay`: `1277ms`

## Interpretation
- Result is **bimodal** (some runs around `~2.3s`, most around `~2.6s`).
- The 10-run p50 does not show a sustained median improvement vs baseline (`2593ms -> 2602ms`).
- This means mobile text animation gating alone is not a deterministic fix for the persistent home render-delay cluster.

## Decision
- Keep the change (no regressions, preserves desktop premium motion), but mark this iteration as **non-conclusive for median recovery**.
- Do not treat this as the primary fix for `/`.

## Next Optimal Step
Target the remaining high-probability compositor cost on mobile hero visuals:
- simplify mobile hero overlay composition (reduce full-screen overlay layer complexity while preserving look),
- then rerun isolated `/` 10-run p50 diagnostics to verify median shift.

