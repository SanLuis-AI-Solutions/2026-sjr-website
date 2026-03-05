# SEO Step 6.2 — Iteration 31 (`/` Home Trust-Dot Pulse Animation Test)

Date: 2026-03-05  
Owner: Codex

## Goal

Test one micro animation-cost variable in the home hero trust badge by removing `animate-pulse` from the small gold status dot, then validate isolated production impact with repeat diagnostics to avoid one-run noise.

## Baseline (Locked)

- Source summary: `.health/perf-gate-2026-03-05T20-55-53-977Z/summary.json`
- Source diagnostics: `.health/lcp-diagnostics-2026-03-05T20-55-53-977Z.json`
- Home route (`/`) diagnostics median:
  - `lcp=2522ms`
  - `elementRenderDelay=1249ms`
  - `ttfb=129ms`
  - `resourceLoadDelay=23ms`
  - `resourceLoadDuration=78ms`

## Change

- Commit: `3ccf790`
- File: `src/components/hero.tsx`
- Single variable change:
  - trust-dot class changed from `h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse`
  - to `h-1.5 w-1.5 rounded-full bg-brand-gold`

## Verification

1. Local
- `npm run build`: PASS
- `npm run test -- --grep "mobile smoke: repeated nav to Home is stable"`: PASS
- `npm run test -- --grep "mobile nav: menu opens and can reach Services"`: PASS

2. Production deploy
- Workflow run: `22736590605`
- URL: `https://github.com/SanLuis-AI-Solutions/2026-sjr-website/actions/runs/22736590605`
- Result: PASS

3. Post-change isolated measurements
- run A:
  - Summary: `.health/perf-gate-2026-03-05T21-19-28-749Z/summary.json`
  - Diagnostics: `.health/lcp-diagnostics-2026-03-05T21-19-28-749Z.json`
  - diagnostics median: `lcp=2516ms`, `elementRenderDelay=387ms`
- run B (repeat confirmation):
  - Summary: `.health/perf-gate-2026-03-05T21-24-21-447Z/summary.json`
  - Diagnostics: `.health/lcp-diagnostics-2026-03-05T21-24-21-447Z.json`
  - diagnostics median: `lcp=2315ms`, `elementRenderDelay=258ms`

## Delta vs Baseline (Diagnostics Median)

Using repeat-confirmed run B as decision source:
- `lcp`: `2522ms -> 2315ms` (`-207ms`)
- `elementRenderDelay`: `1249ms -> 258ms` (`-991ms`)
- `ttfb`: `129ms -> 129ms` (`0ms`)
- `resourceLoadDelay`: `23ms -> 21ms` (`-2ms`)
- `resourceLoadDuration`: `78ms -> 76ms` (`-2ms`)

## Decision

- Result: **Accepted (keep live)**.
- Reason: repeat run confirms a strong render-delay state shift with meaningful LCP improvement while preserving layout and visual styling.
- Premium feel guardrail: no typography, spacing, color, CTA, or composition changes.

## Notes

- This pass removed a non-essential micro animation only; all core visual hierarchy and luxury lighting overlays remain unchanged.
- The home route remains volatile by run shape, but this variable is now evidence-backed as a positive lever and is retained for subsequent site-level audits.
