# Mobile UX Guardrails

Last updated: 2026-05-14

These rules protect the site from SEO/content growth turning into mobile clutter.

## Primary Rule

Mobile pages should make the next action obvious within a few seconds. For most repair traffic, the primary action is `/quote` because it is lower commitment than booking and supports photo-first triage.

## Content Density Rule

- SEO, GEO, and AEO sections must earn their place in the mobile flow; do not add a section only because it adds internal links.
- Above the first conversion action, avoid stacked link lists, duplicate proof cards, and equal-weight quote/book choices.
- Mobile hero sections should expose no more than 6 visible actions. If a page needs more discovery links, split the library into a separate section or collapse the extra choices behind mobile disclosures.
- If a section exists primarily for crawlability, collapse it behind `details` on mobile or move it below the primary service/process content.
- Mobile crawl hubs should stay informational. Do not add visible quote/book CTAs inside those hubs when the page already has a primary CTA or sticky quote shortcut.
- Prefer one high-confidence answer, one next step, and one tap target over multiple competing education paths.

## Homepage

- Keep one dominant mobile CTA in the hero: `Get Fast Quote`.
- Keep `Book a Repair` available on desktop and in lower-commitment contexts, but do not pair it as an equal mobile hero button.
- Keep SEO guide links discoverable, but collapse secondary link sets on mobile when they are not the next conversion step.
- Do not add decorative desktop sections to mobile unless they directly improve trust or conversion.
- Keep the mobile flow ordered around user confidence: hero, proof, core services, process, trust proof, FAQ, primary CTA, then SEO/GEO/AEO link hubs.
- Do not place city-link or guide-link hubs above the primary homepage CTA on mobile. They can remain crawlable lower on the page, but they should not interrupt the main repair decision path.
- Homepage guide hubs below the final CTA should use collapsed mobile disclosures, not repeat `Get Fast Quote` or create a second mini landing page inside the homepage.

## Mobile Navigation

- Keep the menu focused on quick help, navigation, and one dominant quote action.
- Do not duplicate quote/book button pairs in the same mobile menu.
- Reviews and proof should be visible on-page, but not crowd the primary menu action.
- The site header already provides a mobile call shortcut; do not repeat full-width call buttons above mobile forms unless the page has no clearer primary action.

## Mobile Sticky CTA

- Keep the sticky shortcut as one compact quote action, not a quote/book pair.
- Current label: `60-sec Quote`. This is meant to reduce the effort objection after the May 7-13 report showed sticky CTA clicks but no downstream quote or booking starts.
- Do not change the sticky CTA again until a full post-deploy GA4 window can compare `mobile_sticky_cta_click` against sticky-attributed `quote_form_start`, `booking_form_start`, and submit events.
- Use `npm run google:weekly-seo-health` for that check. The report now evaluates both sticky UTM path attribution and sticky session-source attribution.
- If sticky clicks still produce zero sticky-attributed form starts after the next full window, improve the quote-form arrival experience before adding another sticky button.

## Non-Conversion Content Pages

- Blog hub, FAQ, About, service detail, and article pages should not show `Get Fast Quote` and `Book Repair` as equal mobile hero or decision-band actions.
- Blog and FAQ hubs should keep filters, topic chips, service shortcuts, and answer libraries out of the hero section on mobile.
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
- On the services hub, show the featured service and service finder before nearby city-link hubs. City links are important for local SEO, but they should not appear before the user can choose a repair path.
- Avoid repeated “Request quote” language inside every service card. If pricing depends on inspection, use calmer decision copy such as `After inspection` and let the primary quote CTA carry the conversion action.
- On service pages, hide secondary proof/media/market cards on mobile when they repeat the same decision already made by the hero and “what to expect” sections.
- Keep long service-page H1s compact enough that they remain readable on mobile without becoming a dense hero block.
- On article pages, keep related-reading blocks below the article answer and quote CTA; do not interrupt the answer with multiple outbound choices.
- Article next-step chips should point to contextual service, geo, or related guide pages. Do not repeat generic `/quote` or `/book` chips there when the article already has an early quote CTA and final CTA band.
- Hide secondary article/sidebar quote buttons on mobile when they repeat the same action already offered earlier in the article.

## Performance Baselines

- Service pages must continue passing the absolute production performance gate: mobile LCP at or below `2600ms` and SEO score `100`.
- The watch-repair service baseline was realigned on 2026-05-13 after two production guardrail runs showed the current quote-first mobile service layout stabilizing around `2412ms` LCP while still passing the absolute budget.
- The contact conversion baseline was realigned on 2026-05-14 after repeated production guardrail runs showed the current contact layout stabilizing around `2411ms` LCP while still passing the absolute budget and SEO `100`.
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

Run the production-capable flow audit when SEO/content changes add visible links, filters, or CTAs:

```powershell
npm run ux:mobile-flow
```

Use `MOBILE_UX_AUDIT_ORIGIN=http://127.0.0.1:3000` to validate a local production build before deployment. The audit writes `.health/mobile-ux-flow-latest.md` and fails on mobile quote/book competition, mobile hero action counts above 6, sub-44px audited tap targets, expanded footer crawl groups, mobile crawl hubs that expose conversion CTAs, or sticky CTA drift.

As of 2026-05-14, `npm run ux:mobile-flow` audits the core static/conversion pages plus every blog, service detail, and service-area URL listed in `Docs/INDEXING_MANIFEST.json`. This keeps SEO expansion tied to mobile flow quality instead of relying on a hand-picked page sample.
