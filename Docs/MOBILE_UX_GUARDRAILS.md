# Mobile UX Guardrails

Last updated: 2026-05-13

These rules protect the site from SEO/content growth turning into mobile clutter.

## Primary Rule

Mobile pages should make the next action obvious within a few seconds. For most repair traffic, the primary action is `/quote` because it is lower commitment than booking and supports photo-first triage.

## Homepage

- Keep one dominant mobile CTA in the hero: `Get Fast Quote`.
- Keep `Book a Repair` available on desktop and in lower-commitment contexts, but do not pair it as an equal mobile hero button.
- Keep SEO guide links discoverable, but collapse secondary link sets on mobile when they are not the next conversion step.
- Do not add decorative desktop sections to mobile unless they directly improve trust or conversion.

## Mobile Navigation

- Keep the menu focused on quick help, navigation, and one dominant quote action.
- Do not duplicate quote/book button pairs in the same mobile menu.
- Reviews and proof should be visible on-page, but not crowd the primary menu action.

## Forms

- Required fields should come before optional fields.
- Optional phone/photos/details should not block the first meaningful form start.
- Touch targets should stay at least 44px tall.

## Service And Article Pages

- Keep `Get Fast Quote` as the only dominant service/article repair CTA on narrow mobile screens.
- Do not show `Get Fast Quote` and `Book Repair` as equal full-width mobile buttons in the same decision block.
- Keep booking available in navigation, desktop/tablet layouts, and dedicated `/book` flows.

## Verification

The smoke suite includes mobile checks for:

- uncluttered home conversion flow
- single compact sticky CTA
- quote form required field order
- mobile navigation reachability
- service/article mobile CTAs remain quote-first

Run focused checks after CTA/layout changes:

```powershell
npx playwright test tests/smoke.spec.ts --grep "mobile nav: menu opens and can reach Services|mobile conversion: home CTA reaches quote form|mobile home flow keeps conversion path uncluttered|mobile sticky CTA uses one compact quote action"
```
