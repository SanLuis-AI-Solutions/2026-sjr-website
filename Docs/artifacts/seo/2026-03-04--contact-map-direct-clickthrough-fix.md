# Contact Map UX Fix — Direct Click-Through To Google Maps

Date: 2026-03-04  
Owner: Codex  
Scope: `/contact` map module

## Problem
Visitors could land on a deferred map state that did not clearly show Susie's business marker immediately. This created friction because users had to load/search before getting directions.

## Requirement
1. Business location must be clearly visible in the map section.
2. Clicking anywhere in the map section must open Google Maps / business destination directly.

Target URL:
- `https://maps.app.goo.gl/3ZyG1hF1Y9Z9rcQC8`

## Implementation
Updated: `src/app/contact/page.tsx`

1. Removed deferred map placeholder component from this section.
2. Added a full-width clickable map card (`<a>`) linking to the maps app URL.
3. Embedded map iframe with business-address query:
   - `https://www.google.com/maps?q=Susie's+Jewelry+and+Watch+Repair,+3910+Fairmont+Pkwy+C,+Pasadena,+TX+77504&output=embed`
4. Set iframe to `pointer-events-none` so click/tap always routes to Google Maps via the parent anchor.
5. Added visible overlay label with business name and full address so the destination is explicit even before interaction.
6. Updated secondary "Open in Google Maps" CTA in the contact aside to use the same maps app URL.

## Verification
- Build:
  - `npm run build` ✅
- Contact guardrail check:
  - `.health/perf-gate-2026-03-04T21-38-21-693Z/summary.json`
  - `/contact`: `perf=98`, `seo=100`, `lcp=2167ms`, `tbt=26ms` ✅

## Outcome
- Map destination is now explicit and branded as Susie's location.
- Entire map section is a direct click-through to Google Maps directions/business profile.
- No observed Contact performance regression in isolated p50 validation.
