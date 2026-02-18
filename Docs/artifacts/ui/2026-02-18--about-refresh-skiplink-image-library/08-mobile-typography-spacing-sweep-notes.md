# Mobile Typography/Spacing Consistency Sweep — Notes
Date: 2026-02-18

## Scope
- Improve mobile readability rhythm across `/about`, `/contact`, and `/faq`.
- Keep semantic structure and conversion CTAs unchanged.

## Changes
- `src/app/about/page.tsx`
  - Adjusted mobile heading scale (`text-[2.15rem]`), line-height, and body text sizing for more premium rhythm.
  - Harmonized section heading/body scales in standards/process/timeline/visit blocks.

- `src/app/contact/page.tsx`
  - Adjusted hero heading/body scales for mobile readability.
  - Improved supporting text spacing in contact channel cards and form intro.

- `src/app/faq/page.tsx`
  - Improved hero typography and body spacing.
  - Reworked FAQ `<summary>` layout to flex-based structure with cleaner plus affordance alignment.
  - Increased answer text readability with consistent line-height and font size.

## Verification
- `npm run lint` PASS (0 errors; pre-existing script warnings only)
- `npm test` PASS (13/13)
- `pwsh -File scripts/verify.ps1` PASS

## Result
- Better mobile scanability and consistent visual rhythm across the three key informational pages.
