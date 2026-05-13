# Mobile UX Guardrails

Last updated: 2026-05-13

These rules protect the site from SEO/content growth turning into mobile clutter.

## Primary Rule

Mobile pages should make the next action obvious within a few seconds. For most repair traffic, the primary action is `/quote` because it is lower commitment than booking and supports photo-first triage.

## Content Density Rule

- SEO, GEO, and AEO sections must earn their place in the mobile flow; do not add a section only because it adds internal links.
- Above the first conversion action, avoid stacked link lists, duplicate proof cards, and equal-weight quote/book choices.
- If a section exists primarily for crawlability, collapse it behind `details` on mobile or move it below the primary service/process content.
- Prefer one high-confidence answer, one next step, and one tap target over multiple competing education paths.

## Homepage

- Keep one dominant mobile CTA in the hero: `Get Fast Quote`.
- Keep `Book a Repair` available on desktop and in lower-commitment contexts, but do not pair it as an equal mobile hero button.
- Keep SEO guide links discoverable, but collapse secondary link sets on mobile when they are not the next conversion step.
- Do not add decorative desktop sections to mobile unless they directly improve trust or conversion.
- Keep the mobile flow ordered around user confidence: hero, proof, core services, local/service path help, process, then deeper guides.

## Mobile Navigation

- Keep the menu focused on quick help, navigation, and one dominant quote action.
- Do not duplicate quote/book button pairs in the same mobile menu.
- Reviews and proof should be visible on-page, but not crowd the primary menu action.
- The site header already provides a mobile call shortcut; do not repeat full-width call buttons above mobile forms unless the page has no clearer primary action.

## Non-Conversion Content Pages

- Blog hub, FAQ, About, service detail, and article pages should not show `Get Fast Quote` and `Book Repair` as equal mobile hero or decision-band actions.
- Keep booking reachable on desktop/tablet, from the mobile menu secondary link, and from the dedicated `/book` flow.
- If a mobile page is informational or comparison-oriented, prefer a single quote action because it matches lower-commitment repair triage.

## Forms

- Mobile conversion pages should show one primary form jump before the form. Keep secondary quote/book/contact choices for desktop or navigation, not as equal mobile buttons above the form.
- Contact form pages should not stack message, call, email, and directions buttons in the first mobile viewport.
- Required fields should come before optional fields.
- Optional phone/photos/details should not block the first meaningful form start.
- Touch targets should stay at least 44px tall.

## Service And Article Pages

- Keep `Get Fast Quote` as the only dominant service/article repair CTA on narrow mobile screens.
- Do not show `Get Fast Quote` and `Book Repair` as equal full-width mobile buttons in the same decision block.
- Apply the same quote-first rule to service-area pages because they are local commercial landing pages, not appointment-confirmation pages.
- Keep booking available in navigation, desktop/tablet layouts, and dedicated `/book` flows.
- On service pages, hide secondary proof/media/market cards on mobile when they repeat the same decision already made by the hero and “what to expect” sections.
- Keep long service-page H1s compact enough that they remain readable on mobile without becoming a dense hero block.
- On article pages, keep related-reading blocks below the article answer and quote CTA; do not interrupt the answer with multiple outbound choices.

## Performance Baselines

- Service pages must continue passing the absolute production performance gate: mobile LCP at or below `2600ms` and SEO score `100`.
- The watch-repair service baseline was realigned on 2026-05-13 after two production guardrail runs showed the current quote-first mobile service layout stabilizing around `2412ms` LCP while still passing the absolute budget.
- Do not relax the absolute LCP threshold to hide regressions. If a service page exceeds the absolute gate, optimize the page before updating any baseline.

## Verification

The smoke suite includes mobile checks for:

- uncluttered home conversion flow
- single compact sticky CTA
- quote form required field order
- mobile navigation reachability
- service/article mobile CTAs remain quote-first
- non-conversion mobile page heroes remain quote-first

Run focused checks after CTA/layout changes:

```powershell
npx playwright test tests/smoke.spec.ts --grep "mobile nav: menu opens and can reach Services|mobile conversion: home CTA reaches quote form|mobile home flow keeps conversion path uncluttered|mobile sticky CTA uses one compact quote action"
```
