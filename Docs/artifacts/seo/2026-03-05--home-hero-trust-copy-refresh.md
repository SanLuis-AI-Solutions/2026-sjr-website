# SEO Step 6.2 — Home Hero Trust-Copy Refresh

Date: 2026-03-05  
Owner: Codex

## Goal

Replace a negatively perceived hero phrase with positive, trust-forward wording that still supports SEO/GEO/AEO intent.

## User Feedback Trigger

- Prior headline: `Your jewelry never leaves our hands.`
- Feedback: reads as negative first impression (possible fear of not getting jewelry back).

## Change Applied

- File: `src/components/hero.tsx`
- Updated headline:
  - from: `Your jewelry never leaves our hands.`
  - to: `Trusted Pasadena Jewelry Repair, Done In-House.`

## Why This Copy

1. Positive sentiment:
- Leads with trust and expertise instead of a negative construction.

2. SEO/GEO intent:
- Includes core local/service phrase `Pasadena Jewelry Repair`.

3. AEO clarity:
- Short, direct answer-style phrasing aligned with common query intent (who to trust + where + what service).

4. Brand consistency:
- Retains in-house craftsmanship positioning without fear-based wording.

## Verification

- `npm run build` passed.
- CI smoke follow-up:
  - `tests/smoke.spec.ts` heading assertions updated to `/Trusted Pasadena Jewelry Repair/i`.
  - targeted mobile smoke rerun passed (`2/2`).
- production deploy:
  - first run `22724191425` failed (stale smoke assertion against old copy).
  - follow-up run `22724417208` passed end-to-end (deploy + conversion/service guardrails + baseline-delta checks).

## Related Evidence (same work session)

- Isolated de-noise baseline run:
  - `.health/perf-gate-2026-03-05T15-02-48-628Z/summary.json`
  - `.health/lcp-diagnostics-2026-03-05T15-02-48-628Z.json`
