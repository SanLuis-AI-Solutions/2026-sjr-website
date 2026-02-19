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
- Added `Houston market snapshot (provisional)` in Pricing & Timing on all service-detail routes:
  - Each route now includes 3 scenario cards with starter ranges to improve quote expectation setting on mobile.
  - Snapshot is explicitly labeled as planning guidance (not final in-shop estimate).

## Houston/TX pricing evidence used (2026-02-18)
- Watch battery/crystal and same-day cost context:
  - `https://crescentwatchguys.com/watch-battery-replacement-cost/`
  - `https://www.houstonjewelry.com/faq/how-much-does-same-day-jewelry-repair-cost/`
- Ring sizing, prong/setting, and cleaning range anchors:
  - `https://www.houstonjewelry.com/faq/how-much-does-ring-sizing-cost/`
  - `https://www.houstonjewelry.com/faq/how-much-does-jewelry-cleaning-cost-in-houston/`
  - `https://www.houstonjewelry.com/jewelry-repair-in-houston/`
- Pearl restringing formulas:
  - `https://www.thebeadshophouston.com/store/page7.html`
- Boutique cleaning benchmark:
  - `https://www.taharajewelry.com/services/jewelry-repair/houston-jewelry-cleaning/`
- Texas benchmark support for chain/clasp/custom ranges (used where Houston sources do not publish exact line-item starts):
  - `https://www.lanewells.com/pages/jewelry-repair-price-list`
  - `https://www.lemeljewelers.com/jewelry-repair-pricing-guide`

Inference note:
- Necklace/bracelet/custom/heirloom scenario ranges include conservative inference from Houston anchors plus TX benchmark pages when Houston-local line-item prices were not publicly posted.

## Follow-up UX simplification (2026-02-18)
- User feedback: service detail pages felt too busy/complex after adding additional modules.
- Implemented de-clutter strategy:
  - kept trust/value modules but shifted depth behind progressive disclosure.
  - market snapshot notes moved into a closed-by-default `Why ranges vary` block.
  - decision module rewritten to a compact checklist-first format.
  - removed duplicated flagship `Common requests` card inside Pricing & Timing (content intent already covered in What to expect).
- Home page services UX:
  - entire `Expert Repair Services` card is now the click target (not only `Explore Details` text), improving tap success and discoverability.

## Follow-up section-separation pass (2026-02-18)
- User feedback: service details still felt too grouped in the middle of the page.
- Applied marketing-psychology + UX/scroll principles:
  - lowered immediate decision complexity by separating pricing decisions from prep decisions.
  - ensured each section has one primary job to improve processing fluency on mobile scroll.
  - retained trust depth but shifted secondary detail behind progressive disclosure.
- Structural result:
  - Pricing section = price/timing + market snapshot + direct action choice.
  - Before-you-visit section = checklist + decision module.
  - Why-customers-choose-us remains a dedicated trust section after preparation guidance.

## Follow-up copy compression pass (2026-02-18)
- Applied strict scanability pass to reduce cognitive load:
  - shortened intros and support copy to one concise sentence where possible.
  - removed repeated reassurance phrasing across adjacent modules.
  - kept detailed context in bullets/disclosure rather than long body paragraphs.
- Result:
  - stronger mobile “glance then act” flow without dropping trust/quality signals.

## Recommended next pass
- Run a mobile visual QA pass to evaluate first-screen differentiation on all 9 service routes and tune any remaining repeated hero-support selections.
- Add optional per-service mini gallery captions tied to customer intent (“Before visit”, “In progress”, “Finished result”) for stronger narrative clarity.
