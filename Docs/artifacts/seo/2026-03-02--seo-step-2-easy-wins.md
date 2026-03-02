# SEO Step 2 - Easy Wins (Metadata + Accessibility)

Date: 2026-03-02
Owner: Codex
Scope: Low-risk, high-leverage fixes from the full-site audit backlog.

## Objectives
- Resolve recurring Lighthouse accessibility regressions (`heading-order`, `color-contrast`) with global/component-level fixes.
- Apply quick metadata length/canonical improvements identified in the audit.
- Re-verify About page storefront asset integrity and local page rendering markers.

## Implemented Changes

### 1) Metadata easy wins
- Added explicit canonical for home route:
  - `src/app/page.tsx`
- Tuned page metadata titles/descriptions for clarity/length on:
  - `src/app/about/page.tsx`
  - `src/app/faq/page.tsx`
  - `src/app/quote/page.tsx`
  - `src/app/book/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/terms/page.tsx`
- Tightened dynamic service detail metadata title/description pattern:
  - `src/app/services/[slug]/page.tsx`

### 2) Accessibility easy wins (global impact)
- Footer heading-order remediation:
  - Replaced footer section heading tags (`h4`) with styled paragraph labels to avoid non-sequential heading jumps from page `h1`.
  - `src/components/site-footer.tsx`
- Footer color-contrast remediation:
  - Increased footer base text contrast and location text contrast.
  - Increased legal row font-size from `10px` to `xs`.
  - Removed `cv-section` from footer to avoid offscreen content-visibility contrast false-positives in Lighthouse.
  - `src/components/site-footer.tsx`
- Home/service card low-contrast microcopy remediation:
  - Updated low-contrast label tokens from gold/light-gray to burgundy/darker stone where used on light backgrounds.
  - `src/components/home-sections.tsx`
  - `src/components/services-grid.tsx`
  - `src/app/services/page.tsx`
  - `src/app/services/[slug]/page.tsx`

## Verification

### Build
- `npm run build` -> PASS.

### Local Lighthouse accessibility spot-check (production build via `next start`)
Artifacts:
- `.health/lh-easywins-home.json`
- `.health/lh-easywins-quote.json`
- `.health/lh-easywins-ring-sizing.json`
- `.health/lh-easywins-blog.json`
- `.health/lh-easywins-about.json`
- `.health/lh-easywins-contact.json`

Results:
- `/`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/quote`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/services/ring-sizing`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/blog`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/about`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/contact`: `a11y=100`, `heading-order=1`, `color-contrast=1`

Note: Lighthouse emitted known Windows temp cleanup `EPERM` messages post-run, but JSON artifacts were generated and parsed successfully.

### About storefront image integrity
- File exists:
  - `public/images/about/storefront.jpg`
- File size:
  - `4,692,042` bytes.
- Local About HTML includes storefront card marker and storefront image path.

## Outcome
- Easy-win accessibility backlog items (`heading-order` and key recurring `color-contrast` regressions) are resolved in local production-build validation.
- Metadata/canonical quick wins are implemented and build-verified.

## Production Deploy + Verification
- Deploy command:
  - `npx vercel --prod --yes`
- Deployment URL:
  - `https://sjr-new-website-aiproject-99ke7uyga.vercel.app`
- Alias:
  - `https://susiesjewelryrepair.com` (redirects to canonical `https://www.susiesjewelryrepair.com`)

### Production checks
- Home canonical:
  - `https://www.susiesjewelryrepair.com`
- About storefront:
  - `/about` contains `/images/about/storefront.jpg`
  - `https://susiesjewelryrepair.com/images/about/storefront.jpg` returns `200`
- Sitemap continuity:
  - total `<loc>` entries: `33`
  - blog detail entries: `14`

### Production Lighthouse accessibility spot-check
Artifacts:
- `.health/prod-lh-easywins-home.json`
- `.health/prod-lh-easywins-contact.json`
- `.health/prod-lh-easywins-ring-sizing.json`
- `.health/prod-lh-easywins-blog.json`

Results:
- `/`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/contact`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/services/ring-sizing`: `a11y=100`, `heading-order=1`, `color-contrast=1`
- `/blog`: `a11y=100`, `heading-order=1`, `color-contrast=1`

Note: Lighthouse emitted known Windows temp cleanup `EPERM` messages post-run, but JSON artifacts were generated and parsed successfully.

## Next Priority (Longer Work)
- Remediate `/contact` LCP outlier (largest remaining issue from full-site audit).
