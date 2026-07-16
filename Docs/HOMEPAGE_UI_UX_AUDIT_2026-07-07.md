# Homepage UI/UX Audit - 2026-07-07

## Tooling Used

- Installed `ui-ux-pro-max-cli` locally with `npx --yes ui-ux-pro-max-cli@latest init --ai codex`.
- Ran the installed UI/UX Pro Max design-system generator for Susie's Jewelry Repair.
- Ran UI/UX Pro Max searches for landing structure, UX accessibility/conversion, and Next.js homepage/image rules.
- Captured live mobile and desktop homepage screenshots with Playwright.
- Inspected homepage source flow in `src/app/page.tsx`, `src/components/hero.tsx`, `src/components/services-grid.tsx`, and `src/components/home-sections.tsx`.

## Repo Analysis

The `nextlevelbuilder/ui-ux-pro-max-skill` repo is a valid design-intelligence skill package.

- It ships a main `ui-ux-pro-max` skill plus extra Claude-oriented skills.
- Current install path from the repo is `ui-ux-pro-max-cli`, not stale `uipro-cli`.
- It includes searchable CSV data for product types, landing patterns, styles, typography, colors, UX rules, motion, charts, and stack-specific rules.
- The installed local project copy lives at `.codex/skills/ui-ux-pro-max`.

## Live Render Evidence

Generated:

- `.health/homepage-uiux-audit-data-2026-07-07.json`
- `.health/homepage-uiux-mobile-2026-07-07.png`
- `.health/homepage-uiux-desktop-2026-07-07.png`

Healthy:

- Homepage returns `200`.
- No broken images.
- No console errors.
- No horizontal scroll.
- Header logo is visible.
- Desktop hero is polished and booking-first.

## Main Findings

### P1 - Mobile hero pushes the primary booking CTA too low

On Pixel 7 viewport, `Book a Repair` starts at `y=797` with viewport height `839`, so the button is barely visible at the bottom edge. The primary business action exists, but it is not comfortably visible above the fold.

Smallest fix:

- Reduce mobile hero vertical height/spacing.
- Slightly reduce mobile H1 size or line-height.
- Move proof chips below CTA or make only one proof chip visible before CTA.

Do not add more sections or a sticky CTA yet.

### P1 - Homepage is too long before final conversion

Mobile section order:

1. Hero
2. Proof band
3. In-house badge
4. Process
5. Full services grid
6. Testimonials
7. FAQ
8. Commercial guides
9. Final CTA

The full services grid alone is about `5,779px` tall on mobile. Showing every service is approved, but this means the final CTA is extremely far down.

Smallest fix:

- Keep all services, but add a compact `Book a Repair` CTA immediately after the services grid header or after the first 3 service cards.
- Or add a small booking strip before the services grid.

### P2 - Proof is repeated before action

Hero already shows:

- In-house repairs
- Google review score
- Since 1984

Then the proof band repeats:

- Since 1984
- Google reviews
- Warranty
- Service area

Trust is good, but repetition before service selection adds scroll cost.

Smallest fix:

- Keep the proof band, but compress it on mobile or move it below the booking CTA/services path.

### P2 - Mobile typography is luxury, but oversized for conversion

The mobile H1 looks premium but dominates the first screen. It creates brand impact, but the booking action becomes secondary because it is pushed down.

Smallest fix:

- Keep the luxury serif style.
- Reduce mobile H1 clamp from the current hero scale enough to bring CTA fully into view.

### P2 - Blog/commercial guides interrupt booking intent late in the page

The guides are SEO-useful, but they appear before the final CTA. On a booking-first homepage, commercial guides should not sit between a ready visitor and booking.

Smallest fix:

- Move `HomeCommercialGuides` below `HomeCta`.

## What Not To Do

- Do not redesign the whole homepage.
- Do not add another large section.
- Do not replace the brand palette with the UI/UX Pro Max generated blue/green palette; that palette is wrong for Susie's luxury burgundy/gold brand.
- Do not reintroduce quote as a primary path.

## Recommended First Fix

Make the mobile hero CTA fully visible above the fold.

Target:

- On a 412x839 viewport, `Book a Repair` should be fully visible with at least `24px` bottom breathing room.
- Keep `View Repair Services` secondary.
- Preserve current luxury visual feel.

This is the smallest change most likely to improve booking behavior.
