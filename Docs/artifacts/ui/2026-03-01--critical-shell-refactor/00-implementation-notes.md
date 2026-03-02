# Critical Shell Refactor - Implementation Notes

Date: 2026-03-01 (CST)
Owner: Codex
Scope: Home (`/`) and Service Detail (`/services/[slug]`)

## Objective
Reduce first-flush render pressure on high-traffic landing routes by keeping only critical above-fold content in the initial render and streaming below-fold blocks behind a single deferred boundary.

## Changes Applied
- `src/app/page.tsx`
  - Added `HomeDeferredContent()` server component.
  - Moved all content below `<Hero />` into one `<Suspense fallback={null}>` boundary:
    - `ProofBand`
    - `InHouseBadge`
    - `ProcessSteps`
    - `ServicesGridSection`
    - `CraftStory`
    - `ShowroomBand`
    - `Testimonials`
    - `HomeFaq`
    - `HomeCta`

- `src/app/services/[slug]/page.tsx`
  - Added `DeferredServiceSections()` server component.
  - Wrapped all sections after the hero in one `<Suspense fallback={null}>` boundary:
    - from `data-service-section="how-it-works"` through the mobile quick-actions spacer.
  - Kept `ServiceInteractionTracker` and JSON-LD schema blocks outside the deferred visual boundary.

## Storefront Asset Verification
- Confirmed file exists at required path:
  - `public/images/about/storefront.jpg`
- File metadata:
  - Format: JPEG
  - Dimensions: `4000x3000`
  - Size: `4,692,042` bytes
- `/about` local render check confirms storefront image is visible in "Inside the workshop".

## Verification Evidence
- Build verification:
  - Command: `npm run build`
  - Result: PASS
- Local browser smoke verification (Playwright MCP):
  - `http://localhost:3000/` PASS
  - `http://localhost:3000/services/ring-sizing` PASS
  - `http://localhost:3000/about` PASS

## Follow-Up
- Deploy to production and run the canonical 10-run p75 gate:
  - Command:
    - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 10 --percentile 75 --lcp-threshold-ms 2500 --seo-threshold 100 --path / --path /services/ring-sizing`
- Decide whether to compress `public/images/about/storefront.jpg` (4.7 MB source) for faster mobile payload.

## Deployment + Production Gate (Completed)
- Deploy command:
  - `npx vercel --prod --yes`
- Deployment:
  - Production URL: `https://sjr-new-website-aiproject-6dnlhzw7j.vercel.app`
  - Alias: `https://susiesjewelryrepair.com`
  - Inspector: `https://vercel.com/sanluis-ai-solutions-projects/sjr-new-website-aiproject/ASr4CaBR5ojBodJVqdi7MLF4c978`
- Live smoke checks:
  - `/` -> HTTP `200`
  - `/services/ring-sizing` -> HTTP `200`
  - `/about` -> HTTP `200`
- 10-run p75 production gate:
  - Command:
    - `node scripts/perf/launch-performance-gate.mjs --base-url https://www.susiesjewelryrepair.com --runs 10 --percentile 75 --lcp-threshold-ms 2500 --seo-threshold 100 --path / --path /services/ring-sizing`
  - Result:
    - `/`: `perf=94`, `seo=100`, `lcp=2692ms`, `tbt=178ms`
    - `/services/ring-sizing`: `perf=97`, `seo=100`, `lcp=2740ms`, `tbt=173ms`
    - Gate: `FAIL` (LCP above `2500ms` threshold)
  - Evidence artifact:
    - `.health/perf-gate-2026-03-02T01-50-34-669Z/summary.json`
