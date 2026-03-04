# SEO Step 6.2 Iteration 9 (Service CI Guardrail Added + Validated)

Date: 2026-03-03  
Scope: production deployment workflow (`deploy-production.yml`)  
Objective: enforce pilot service-route LCP quality in CI alongside conversion-route guardrails.

## Change

Added a second post-deploy performance gate in `.github/workflows/deploy-production.yml`:

- `Post-deploy service performance guardrail (isolated p50)`
  - base URL: `https://www.susiesjewelryrepair.com`
  - runs: `5`
  - percentile: `50`
  - thresholds: `LCP <= 2500ms`, `SEO = 100`
  - isolate mode + diagnostics enabled
  - routes:
    - `/services/ring-sizing`
    - `/services/watch-repair`
    - `/services/custom-design`

Also updated diagnostics extraction step to iterate all generated `.health/perf-gate-*` directories in a run (captures both conversion and service gate outputs).

## Validation Run

Workflow run:
- `22648411605`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22648411605`
- head: `2d33e4b`
- conclusion: `success`

Step-level validation:
- `Post-deploy conversion performance guardrail (isolated p50)`: PASS
- `Post-deploy service performance guardrail (isolated p50)`: PASS
- `Extract LCP diagnostics from gate runs`: PASS
- `Upload performance artifacts`: PASS

## Metrics From CI Run (p50)

Conversion guardrail:
- `/contact`: `2130ms` (`seo=100`)
- `/quote`: `2156ms` (`seo=100`)
- `/book`: `2119ms` (`seo=100`)

Service guardrail:
- `/services/ring-sizing`: `2419ms` (`seo=100`)
- `/services/watch-repair`: `2113ms` (`seo=100`)
- `/services/custom-design`: `2271ms` (`seo=100`)

## Artifact Upload Evidence

GitHub artifact API for run `22648411605`:
- artifact count: `1`
- artifact name: `perf-gate-22648411605`
- artifact id: `5751238154`
- size: `6,143,002 bytes`

## Result

- CI now enforces both conversion and service p50 guardrails after every production deploy.
- Diagnostics and raw perf artifacts are captured and attached reliably for triage/audits.
