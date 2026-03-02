# SEO Step 6 - Service Mobile Hero Pilot (Balanced, Pilot First)

Date: 2026-03-02  
Owner: Codex  
Scope: Pilot mobile hero optimization for 3 flagship service detail routes while preserving current premium layout and desktop presentation.

## Goal
Improve mobile LCP on:
- `/services/ring-sizing`
- `/services/watch-repair`
- `/services/custom-design`

without changing page copy, structure, CTA hierarchy, or desktop hero visuals.

## Changes Implemented

### 1) Mobile hero AVIF pipeline update
- File: `scripts/perf/generate-mobile-hero-avif.mjs`
- Added CLI support for:
  - `--slugs` (comma-separated service slugs, required)
  - `--min-kb`, `--max-kb`, `--width`
- Updated balanced defaults:
  - `width=720`
  - `min-kb=35`
  - `max-kb=55`
- Updated quality ladder to high-to-mid range (`92` down to `50`).
- Script now targets service hero sources only:
  - `public/images/services/<slug>-hero.jpg`
  - outputs `public/images/services/<slug>-hero-mobile.avif`
- Added manifest output:
  - `.health/service-mobile-hero-manifest-step6-pilot.json`

### 2) Pilot mobile hero assets generated
- `public/images/services/ring-sizing-hero-mobile.avif`
- `public/images/services/watch-repair-hero-mobile.avif`
- `public/images/services/custom-design-hero-mobile.avif`

Manifest result (`.health/service-mobile-hero-manifest-step6-pilot.json`):
- `ring-sizing`: `q56`, `50.3KB` (in range)
- `watch-repair`: `q84`, `54.7KB` (in range)
- `custom-design`: `q80`, `51.7KB` (in range)

### 3) Explicit pilot map for mobile hero routing
- File: `src/lib/constants.ts`
- Added:
  - `SERVICE_MOBILE_HERO_IMAGE_BY_SLUG`
  - includes only:
    - `ring-sizing`
    - `watch-repair`
    - `custom-design`

### 4) Service template hero source selection update
- File: `src/app/services/[slug]/page.tsx`
- Replaced ring-only hardcoded override with map lookup.
- Implemented art-direction behavior to preserve desktop source:
  - mobile viewport uses pilot AVIF source (via `<picture><source media="(max-width: 767px)">`)
  - desktop/tablet keeps existing desktop hero source.
- Kept existing hero composition, gradients, text stack, CTA styling, and responsive `sizes` behavior.

## Verification

### Build
- `npm run build` PASS.
- Service routes remain static/ISR-backed (`/services` and `/services/[slug]` at `1h` revalidate).

### Local functional + visual QA
- Hero smoke artifact:
  - `.health/service-hero-local-smoke-step6.json`
- Required screenshots captured (3 breakpoints x 3 routes):
  - `.health/screenshots/step6-service-pilot/ring-sizing-390x844.png`
  - `.health/screenshots/step6-service-pilot/ring-sizing-768x1024.png`
  - `.health/screenshots/step6-service-pilot/ring-sizing-1440x900.png`
  - `.health/screenshots/step6-service-pilot/watch-repair-390x844.png`
  - `.health/screenshots/step6-service-pilot/watch-repair-768x1024.png`
  - `.health/screenshots/step6-service-pilot/watch-repair-1440x900.png`
  - `.health/screenshots/step6-service-pilot/custom-design-390x844.png`
  - `.health/screenshots/step6-service-pilot/custom-design-768x1024.png`
  - `.health/screenshots/step6-service-pilot/custom-design-1440x900.png`

Visual QA notes:
- No obvious artifacting observed in jewelry/watch focal edges.
- Metal gradients and shadow transitions remain visually clean at required breakpoints.
- Hero overlay readability and CTA contrast preserved.

Routing behavior verified:
- Mobile viewport requests only `*-hero-mobile.avif` for pilot routes.
- Tablet/desktop viewports request desktop hero source.
- No 4xx/5xx image or route errors in smoke checks.

### About page local layout confirmation
- Artifact:
  - `.health/about-local-layout-check-step6.json`
- Screenshots:
  - `.health/screenshots/about-local/about-390x844.png`
  - `.health/screenshots/about-local/about-1440x900.png`
- Result:
  - Title and primary hero composition render correctly with zero network errors in local checks.

## Production Deploy
- Command: `npx vercel deploy --prod --yes`
- Production deployment URL:
  - `https://sjr-new-website-aiproject-lwar1vjil.vercel.app`
- Inspector:
  - `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/8KhnAvHj1ZEpgU46brhHq4rRvSAn`
- Alias verification:
  - `https://susiesjewelryrepair.com`

Production smoke:
- `.health/service-hero-prod-smoke-step6.json`
- Result:
  - Correct mobile-vs-desktop hero source routing on all 3 pilot routes.
  - No network/image errors.

## Performance Results (Production)

### Baseline source
- `.health/perf-gate-2026-03-02T21-51-16-231Z/summary.json`
- p50 LCP baseline:
  - `/services/ring-sizing`: `2980ms`
  - `/services/watch-repair`: `3050ms`
  - `/services/custom-design`: `2902ms`

### Post-deploy pilot gate runs
- Run 1:
  - `.health/perf-gate-2026-03-02T22-31-49-882Z/summary.json`
- Run 2 (latest):
  - `.health/perf-gate-2026-03-02T22-39-15-498Z/summary.json`

Latest p50 comparison vs baseline:
- `/services/ring-sizing`: `2980ms -> 3123ms` (`+143ms`)
- `/services/watch-repair`: `3050ms -> 3199ms` (`+149ms`)
- `/services/custom-design`: `2902ms -> 2826ms` (`-76ms`)
- SEO: `100` on all pilot routes.

### Guardrail checks
- Single-run guard files:
  - `.health/prod-lh-step6-guard-about.json`
  - `.health/prod-lh-step6-guard-contact.json`
  - `.health/prod-lh-step6-guard-contact-rerun2.json`
- Additional 3-run p50 guard snapshot:
  - `.health/perf-gate-2026-03-02T22-49-39-525Z/summary.json`
- Result summary:
  - `/about` stayed within a comparable range.
  - `/contact` showed significant LCP regression in current lab runs and requires a dedicated follow-up root-cause pass.

Note: Lighthouse emitted known Windows temp cleanup `EPERM` warnings after run completion; JSON artifacts were still produced and parsed.

## Acceptance Criteria Evaluation
- Quality criteria: PASS  
  (visual guardrails met for pilot routes at required breakpoints)
- Performance criteria: FAIL  
  (did not achieve `>=250ms` LCP improvement on at least 2/3 pilot routes)
- Guardrail criteria: FAIL  
  (`/contact` regression observed in repeated step-6 guard checks)

## Outcome
Step 6 pilot implementation is complete and deployed with correct source-routing behavior and preserved premium visual quality.  
The pilot did not deliver the required LCP improvement targets in production and exposed a contact-route guardrail regression that needs immediate targeted performance diagnosis before Step 6B expansion.

