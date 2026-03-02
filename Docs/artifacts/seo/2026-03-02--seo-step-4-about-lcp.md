# SEO Step 4 - About Page LCP Optimization

Date: 2026-03-02
Owner: Codex
Scope: Fast, low-risk optimization pass on `/about` after contact route stabilization.

## Goal
Reduce `/about` LCP without structural redesign, using proven low-risk patterns already used in prior steps.

## Implemented Changes
- `src/app/about/page.tsx`
  - Added `lcp-heading` class on hero `h1` for stable above-fold font rendering.
  - Removed non-critical hero visual overhead:
    - removed hero image `animate-slow-zoom` class
    - removed hero badge `backdrop-blur-sm`
  - Added `cv-section` containment to below-fold About sections.
  - Changed below-fold workshop gallery images to lazy load only (removed eager/priority behavior in that section).
  - Adjusted micro-label contrast tokens to keep accessibility clean after optimization changes.
- `src/components/scroll-reveal-manager.tsx`
  - Disabled reveal animation orchestration on `/about` route.

## Verification

### Build
- `npm run build` -> PASS.

### Local smoke (`/about`)
- H1 present: `Family craftsmanship, refined over four decades.`
- storefront image path present: `/images/about/storefront.jpg`
- manifesto section present.

### Local Lighthouse before/after (`/about`)
Artifacts:
- Before: `.health/lh-about-baseline-local-step4.json`
- After: `.health/lh-about-after2-local-step4.json`

Results:
- Performance: `92 -> 94`
- Accessibility: `100 -> 100`
- SEO: `100 -> 100`
- LCP: `3317ms -> 2996ms` (`-321ms`)

### Production deploy
- Deploy command: `npx vercel --prod --yes`
- Deployment URL: `https://sjr-new-website-aiproject-d3dsm21gz.vercel.app`
- Alias: `https://susiesjewelryrepair.com` (canonical `https://www.susiesjewelryrepair.com`)

### Production Lighthouse verification (`/about`)
Baseline artifact:
- `.health/prod-lh-about-baseline-step4.json`
- Baseline: `perf=94`, `lcp=3050ms`

Post-deploy artifacts:
- `.health/prod-lh-step4-about-run1.json`
- `.health/prod-lh-step4-about-run2.json`
- `.health/prod-lh-step4-about-run3.json`

Post-deploy runs:
- Run 1: `perf=97`, `a11y=100`, `lcp=2449ms`
- Run 2: `perf=97`, `a11y=100`, `lcp=2440ms`
- Run 3: `perf=94`, `a11y=100`, `lcp=3044ms`

3-run median:
- Performance: `97`
- Accessibility: `100`
- LCP: `2449ms`

Median delta vs baseline:
- LCP: `3050ms -> 2449ms` (`-601ms`)

Note: Lighthouse emitted known Windows temp cleanup `EPERM` warnings post-run, but JSON reports were generated and parsed successfully.

## Outcome
- `/about` moved from borderline above-threshold LCP into a stable median under 2.5s in this production check.
- Route remains `a11y=100` and `seo=100`.
