# SEO Step 6.2 Iteration 7 (CI Conversion Guardrail Automation)

Date: 2026-03-03  
Scope: production deployment workflow  
Objective: prevent conversion-route LCP regressions from reaching production unnoticed.

## Change

Updated `.github/workflows/deploy-production.yml` to run an automated post-deploy conversion performance gate.

Added steps after production deploy:

1. `Wait for production alias propagation` (`sleep 20`)
2. `Post-deploy conversion performance guardrail (isolated p50)`
   - command:
     - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 5 --percentile 50 --lcp-threshold-ms 2600 --seo-threshold 100 --isolate --diagnostics --path /contact --path /quote --path /book`
   - fail condition:
     - any conversion route with p50 `LCP > 2600ms` or `SEO < 100`.
3. `Upload performance artifacts`
   - uploads `.health/perf-gate-*` and `.health/lcp-diagnostics-*.json` on every run (`if: always()`).

## Why this is process-optimal

- Locks in the currently passing conversion baseline with automatic enforcement.
- Avoids repeated manual validation loops after each deploy.
- Keeps evidence attached to each CI run for fast root-cause triage when a regression appears.

## Notes

- This iteration is workflow automation only; no runtime UX/layout changes were made.
- First full validation of this CI guardrail will occur on the next deploy workflow execution.
