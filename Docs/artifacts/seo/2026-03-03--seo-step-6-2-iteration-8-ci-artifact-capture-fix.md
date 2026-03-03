# SEO Step 6.2 Iteration 8 (CI Artifact Capture Fix)

Date: 2026-03-03  
Scope: production deployment workflow (`deploy-production.yml`)  
Objective: ensure performance evidence files are reliably attached to each production CI run.

## Problem Observed

- Prior run `22647464399` executed and passed the conversion guardrail, but artifact upload logged:
  - `No files were found with the provided path...`
- Root cause: performance output lives under hidden `.health/` paths, and upload patterns were too narrow.

## Changes Implemented

Updated `.github/workflows/deploy-production.yml`:

1. Added diagnostics extraction step after the conversion gate:
   - `Extract LCP diagnostics from latest gate run`
   - resolves latest `.health/perf-gate-*` directory and runs:
     - `node scripts/perf/extract-lcp-diagnostics.mjs --dir <latest_dir>`

2. Updated artifact upload patterns:
   - from:
     - `.health/perf-gate-*`
     - `.health/lcp-diagnostics-*.json`
   - to:
     - `.health/perf-gate-*/**`
     - `.health/perf-gate-latest.json`
     - `.health/lcp-diagnostics-*.json`

3. Enabled hidden path inclusion:
   - `include-hidden-files: true`

## Expected Outcome

- Every production workflow run now uploads:
  - full perf-gate run folder(s)
  - latest perf summary pointer
  - generated LCP diagnostics JSON
- Evidence remains attached to CI even when gate fails (`if: always()` retained).

## Validation (Completed)

Production workflow run:
- `22647929726`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22647929726`
- head: `9795243`

Step outcomes:
- `Post-deploy conversion performance guardrail (isolated p50)`: PASS
- `Extract LCP diagnostics from latest gate run`: PASS
- `Upload performance artifacts`: PASS

Guardrail p50 metrics from run log:
- `/contact`: `2296ms` (`seo=100`)
- `/quote`: `2319ms` (`seo=100`)
- `/book`: `2320ms` (`seo=100`)

Artifact upload confirmation:
- artifact count: `1`
- artifact name: `perf-gate-22647929726`
- artifact id: `5750988899`
- size: `1,975,645 bytes`

Result:
- CI evidence capture issue is resolved and verified end-to-end.
