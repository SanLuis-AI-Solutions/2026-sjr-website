# SEO Step 6.2 - Iteration 25 (`/services` Mobile Hero Paint-Layer Simplification)

Date: 2026-03-05
Owner: Codex

## Goal
Execute one isolated mobile-only hero paint-layer simplification on `/services`, then measure production impact with isolated 5-run p50 diagnostics.

## Baseline (Locked)
- Summary: `.health/perf-gate-2026-03-05T05-21-04-782Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T05-21-04-782Z.json`
- Route: `/services`
- p50 LCP: `2657ms`
- Median diagnostics:
  - `ttfb=135ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=1294ms`
- LCP node evidence (sample run): hero heading `h1.lcp-heading`.

## Change
- Commit: `ed1e878`
- File: `src/app/services/page.tsx`
- Single change (mobile-only paint-layer simplification):
  - top hero radial background layer changed from always-on to desktop-only.
  - class update:
    - from: `absolute inset-0 bg-[radial-gradient(...)]`
    - to: `absolute inset-0 hidden bg-[radial-gradient(...)] md:block`

## Verification
1. Local
- `npm run build`: PASS
- Focused smoke:
  - `services hub: featured detail link routes to service detail`: PASS
  - `mobile services pages: quick actions are clear and image assets load`: PASS

2. Production deploy
- Workflow run: `22703704711`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22703704711`
- Result: PASS (deploy + conversion/service guardrails + baseline-delta checks + diagnostics extraction)

3. Post-deploy isolated measurement
- Summary: `.health/perf-gate-2026-03-05T05-42-15-933Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T05-42-15-933Z.json`
- Route: `/services`
- p50 LCP: `2533ms`
- Median diagnostics:
  - `ttfb=131ms`
  - `resourceLoadDelay=0ms`
  - `resourceLoadDuration=0ms`
  - `elementRenderDelay=299ms`
- Sample node evidence (run2): still hero heading `h1.lcp-heading`.

## Delta vs Baseline
- LCP: `2657ms -> 2533ms` (`-124ms`)
- elementRenderDelay: `1294ms -> 299ms` (`-995ms`)

## Decision
- Keep change live.
- Rationale:
  - clear improvement on target route,
  - no quality/layout/copy/CTA changes,
  - deploy + CI guardrails all passed.

## Remaining Gap
- `/services` is now close to the historical `2500ms` threshold (`+33ms` over), but inside the broader `<=2600ms` operating band used for conversion/guardrail stability.

## Next Optimal Step (Iteration 26 Candidate)
Run one isolated `/services` hero image-request-path experiment (single change only), then remeasure:
- keep current visual design,
- force more accurate hero image sizing on mobile hero image in `/services` (`sizes` string tuned to actual container width),
- accept only if p50 improves further with no route regressions.
