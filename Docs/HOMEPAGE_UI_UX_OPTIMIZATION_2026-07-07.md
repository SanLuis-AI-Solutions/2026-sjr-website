# Homepage UI/UX Audit + Optimization - 2026-07-07

## Scope

Homepage only.

## Audit Score Before

82/100

Breakdown:

- Visual quality: 18/20
- Brand trust: 18/20
- Booking-first clarity: 15/20
- Mobile usability: 13/20
- Accessibility/performance basics: 18/20

## Findings

P1: Mobile hero CTA was too low.

- On Pixel 7, `Book a Repair` started at `y=797` with viewport height `839`.
- The CTA was technically present but not comfortably visible.
- This is the highest-impact UX issue because booking is the primary business action.

P2: Hero proof chips appeared before the action.

- Review/rating and `Since 1984` build trust, but they pushed the CTA down.
- Trust should support the action, not delay it.

P2: Homepage is long after the hero.

- The full services grid is useful and owner-approved, but it creates a long scroll path.
- This is not the first fix because the hero CTA is the cleaner conversion lever.

## Plan

1. Move the hero CTA above proof chips.
2. Remove the decorative mobile divider that consumed vertical space.
3. Preserve the luxury visual style, brand colors, full services section, and booking-first copy.
4. Verify mobile and desktop screenshots.

## Executed

- Updated `src/components/hero.tsx`.
- Moved `Book a Repair` and `View Repair Services` above the review/Since 1984 chips.
- Removed the mobile-only decorative divider.
- Added `.codex/**` to ESLint global ignores because the newly installed local UI/UX skill is generated tooling, not app code.

## Audit Score After

90/100

Breakdown:

- Visual quality: 18/20
- Brand trust: 18/20
- Booking-first clarity: 19/20
- Mobile usability: 17/20
- Accessibility/performance basics: 18/20

Remaining score loss:

- Full services grid still makes the page long on mobile.
- Proof band repeats some hero trust information.
- Commercial guides still sit before the final CTA.

## Verification

- `npm run build`: passed.
- `npm run lint`: passed with existing warnings only.
- Local production homepage: `200`.
- Mobile screenshot: `.health/homepage-hero-cta-fix-mobile-2026-07-07.png`
- Desktop screenshot: `.health/homepage-hero-cta-fix-desktop-2026-07-07.png`
- Measurement JSON: `.health/homepage-hero-cta-fix-2026-07-07.json`

Mobile CTA after fix:

- Viewport: `412x839`
- `Book a Repair` top: `648`
- `Book a Repair` bottom: `696`
- Bottom breathing room: `143px`
- Broken images: `0`
- Horizontal scroll: `false`

## Next Lazy Fix

If we keep optimizing homepage next, move `HomeCommercialGuides` below `HomeCta`.

That keeps SEO content on the page but stops blog-style content from interrupting ready-to-book visitors.
