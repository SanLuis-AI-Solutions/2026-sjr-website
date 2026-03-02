# SEO Step 3 - Contact LCP Outlier Remediation

Date: 2026-03-02
Owner: Codex
Scope: Fast, low-risk performance fix focused on `/contact` route LCP outlier.

## Problem
- Full-site audit identified `/contact` as the worst route-level LCP outlier.
- Prior measured sample (2026-03-02 audit): `LCP ~5411ms`, `Performance 66`.

## Fix Strategy (Quick + Logical)
1. Remove heavy map embed from above-the-fold hero panel to avoid cross-origin iframe contention in LCP window.
2. Keep map utility and local trust signals by moving iframe map module below the fold.
3. Disable scroll-reveal animations for `/contact` (already done for `/`, `/services/*`, `/blog/*`) to reduce above-fold render delay.
4. Stream/defer the entire below-fold Contact section using Suspense + async server component.
5. Apply small hero paint-cost reductions (remove non-critical pattern overlay, remove blur on hero stat chips, use `lcp-heading` fallback class).

## Code Changes
- `src/app/contact/page.tsx`
  - added `GOOGLE_MAPS_PLACE_URL` constant.
  - moved map iframe from hero aside to below-fold map block.
  - kept above-fold map utility via "Open in Google Maps" link.
  - extracted below-fold content into async `DeferredContactSection()` and rendered under `<Suspense fallback={null}>`.
  - added `cv-section` containment to deferred section.
  - applied `lcp-heading` class to hero `<h1>`.
  - removed one non-critical patterned overlay layer and blur classes on hero stat cards.
- `src/components/scroll-reveal-manager.tsx`
  - added `/contact` to reveal-disable route list.

## Verification

### Build
- `npm run build` -> PASS.

### Local contact smoke
- `/contact` markers present:
  - `Talk to a local expert` H1: true
  - `#contact-form`: true
  - `Find our storefront` map section: true
  - `Open in Google Maps` link: true
  - `Google Maps Location` iframe: true

### Local Lighthouse before/after (`/contact`)
- Before artifact: `.health/lh-contact-baseline-local-full.json`
- After artifact: `.health/lh-contact-after2-local-full.json`

Results:
- Performance: `74 -> 95` (`+21`)
- LCP: `5282ms -> 2763ms` (`-2519ms`)
- FCP: `2980ms -> 1442ms` (`-1538ms`)
- TBT: `119ms -> 102ms` (`-17ms`)

Note: Lighthouse emitted known Windows temp cleanup `EPERM` warnings post-run, but reports were generated and parsed successfully.

## Expected Production Impact
- Significant reduction of the `/contact` LCP outlier by prioritizing text-first paint and deferring non-critical/interactive blocks.
