# Service Detail Audit Notes (2026-02-18)

## Scope
- `src/app/services/[slug]/page.tsx`
- `src/lib/constants.ts`
- `src/lib/service-visuals.ts`
- Production routes: `/services/*`

## Evidence Summary
- Service inventory: 9 slugs confirmed (`watch-repair`, `ring-sizing`, `stone-setting`, `jewelry-cleaning`, `necklace-repair`, `bracelet-repair`, `pearl-restringing`, `custom-design`, `heirloom-restoration`).
- Image availability: `scripts/audit-images.ps1` -> `OK: 15/15`.
- FAQ depth: watch/ring = 7 each; all other services expanded to 7.
- CTA clarity: mobile quick-actions region present with 2 clear actions (`Get Fast Quote`, `Book Repair`) and tap targets ~48-50px.

## High-Impact Findings
1. Cross-page image reuse is still heavy for service-detail galleries.
   - 15 unique image assets currently serve all 9 service pages.
   - `heirloom-restoration.jpg` appears on 8 service pages in supporting sections.
2. Semantic hierarchy was partially weak in section labels.
   - `How it works` and `Why customers choose us` existed as paragraph labels.
   - Refined in template to use heading elements.

## Implemented in this session
- Updated service template semantics in `src/app/services/[slug]/page.tsx`:
  - `How it works` is now a heading.
  - `Why customers choose us` is now a heading.
- Added one unique service decision module per route in Pricing & Timing:
  - `Repair vs replace`, `When to bring it in`, or `Good candidate checklist`.
- Added per-service micro-testimonial proof blocks in the trust section.
- Expanded non-watch/ring FAQ depth from 5 to 7 with supplemental intent-driven FAQs.
- Added smoke tests in `tests/smoke.spec.ts` for:
  - decision/proof block visibility on all service routes.
  - 7 FAQ count on non-watch/ring routes.
- Added visual-library expansion and remap:
  - Uploaded 5 additional service images to Supabase (`services/alt-*.jpg`).
  - Updated `src/lib/service-visuals.ts` blueprint assignments to reduce cross-page repeated imagery.
  - Image audit baseline improved from 15 referenced assets to 20 referenced assets (`scripts/audit-images.ps1` -> `OK: 20/20`).
  - Final mobile QA tweak: removed remaining duplicated `heroSupport` assignment so service blueprints now use unique support imagery per route.

## Recommended next pass
- Run a mobile visual QA pass to evaluate first-screen differentiation on all 9 service routes and tune any remaining repeated hero-support selections.
- Add optional per-service mini gallery captions tied to customer intent (“Before visit”, “In progress”, “Finished result”) for stronger narrative clarity.
