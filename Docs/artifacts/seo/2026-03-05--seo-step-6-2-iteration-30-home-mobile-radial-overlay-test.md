# SEO Step 6.2 — Iteration 30 (`/` Home Mobile Radial Overlay Test)

Date: 2026-03-05  
Owner: Codex

## Goal

Test one mobile-only visual-paint variable on the home hero by removing the mobile radial gold overlay, then measure isolated production impact with the same 10-run diagnostics lane.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-05T16-39-58-127Z/summary.json`
- Source diagnostics: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json`
- Home route (`/`) diagnostics median:
  - `lcp=2539ms`
  - `elementRenderDelay=1240ms`
  - `ttfb=131ms`
  - `resourceLoadDelay=28ms`
  - `resourceLoadDuration=78ms`

## Change

- Commit: `7d52bb2`
- File: `src/components/hero.tsx`
- Single variable change:
  - removed mobile radial overlay layer:
    - `bg-[radial-gradient(circle_at_18%_12%,_rgba(209,184,130,0.22)_0%,_rgba(209,184,130,0.05)_34%,_transparent_62%)] md:hidden`

## Verification

1. Production deploy
- Workflow run: `22734742412`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22734742412`
- Result: PASS

2. Post-change isolated measurement
- Summary: `.health/perf-gate-2026-03-05T20-29-38-827Z/summary.json`
- Diagnostics: `.health/lcp-diagnostics-2026-03-05T20-29-38-827Z.json`
- Home route (`/`) diagnostics median:
  - `lcp=2539ms`
  - `elementRenderDelay=1226ms`
  - `ttfb=130ms`
  - `resourceLoadDelay=30ms`
  - `resourceLoadDuration=86ms`

## Delta vs Baseline (Diagnostics Median)

- `lcp`: `2539ms -> 2539ms` (`0ms`)
- `elementRenderDelay`: `1240ms -> 1226ms` (`-14ms`)
- `ttfb`: `131ms -> 130ms` (`-1ms`)
- `resourceLoadDelay`: `28ms -> 30ms` (`+2ms`)
- `resourceLoadDuration`: `78ms -> 86ms` (`+8ms`)

## Decision

- Result: **Rejected as non-material**.
- Reason: no LCP shift and no meaningful render-delay shift; change falls inside run noise band.
- Premium feel guardrail: radial gold lighting layer was restored after test.

## Rollback

- Commit: `797455e` (`src/components/hero.tsx` restored mobile radial overlay).
- Deploy run: `22735705778` (success)
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22735705778`

## Baseline Reset For Next Iteration

- Isolated reset run:
  - Summary: `.health/perf-gate-2026-03-05T20-55-53-977Z/summary.json`
  - Diagnostics: `.health/lcp-diagnostics-2026-03-05T20-55-53-977Z.json`
  - Home diagnostics median: `lcp=2522ms`, `elementRenderDelay=1249ms`
