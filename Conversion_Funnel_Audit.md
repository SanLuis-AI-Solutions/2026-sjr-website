# Conversion Funnel Audit

Generated: 2026-04-29
Site: https://www.susiesjewelryrepair.com
Method: live mobile Playwright crawl at 390x844 viewport, touch/mobile context.

## Executive Summary

Mobile funnel is usable, but the strongest issue is above-the-fold CTA placement on the homepage and service detail pages. The site consistently has clickable phone links, no horizontal overflow, no console errors in the audited pages, and lead forms use reasonable required fields. The homepage and service detail templates should move quote/book actions into the first viewport to reduce friction from organic search traffic.

## Page Audit

| Page | Status | Mobile CTA in first viewport? | Phone clickable? | Form | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | Pass with friction | Partial: Call visible; quote/book below first viewport around 884px/944px | Yes | None | Main conversion CTAs are below the first mobile viewport. This is the highest-priority homepage fix. |
| `/services` | Pass | Yes: Get Fast Quote and Book Repair visible | Yes | None | Strong service hub entry page. |
| `/services/watch-repair` | Needs improvement | Partial: Call visible; quote/book below first viewport around 1426px/1486px | Yes | None | High-value GSC query page does not show quote/book actions early enough. |
| `/services/ring-sizing` | Needs improvement | Partial: Call visible; quote/book below first viewport around 1266px/1326px | Yes | None | Important for "ring resizing near me"; move direct CTA higher. |
| `/services/necklace-repair` | Needs improvement | Partial: Call visible; quote/book below first viewport around 1246px/1306px | Yes | None | Same service template issue. |
| `/book` | Pass with friction | Yes: Start Booking, Get Fast Quote, Contact Us visible | Yes | Booking form | Actual submit button is lower on the page; the top CTA anchors help. |
| `/quote` | Pass with friction | Yes: Start Quote, Book Repair, Contact Us visible | Yes | Quote form | Form is concise, but submit path still requires scroll. |
| `/contact` | Pass | Yes: Send Message, Get Fast Quote, Book Repair visible | Yes | Contact form | Best-performing conversion page structure. |
| `/blog` | Pass | Yes: Get Fast Quote and Book Repair visible | Yes | None | Blog hub supports commercial routing well. Topic chips are 35px tall, slightly below ideal touch target height. |

## Form Health

Overall Form Health & Friction Index: 78/100, Usable with Friction.

Booking form:
- Required fields: name, email, date, time.
- Optional fields: phone, details.
- Strengths: low required field count, phone uses `tel`, name/email use autocomplete.
- Friction: actual booking submit is below initial viewport; visible phone number link in the first viewport is only 17px tall in audit output.

Quote form:
- Required fields: name, email, details.
- Optional fields: phone, photos.
- Strengths: low required field count, photo upload optional, good CTA wording.
- Friction: submit button is below first viewport; users must scroll from the top CTA to finish.

Contact form:
- Required fields: name, email, message.
- Optional fields: phone, preferred contact.
- Strengths: CTA stack is visible early, required fields are reasonable, phone uses `tel`.

## Priority Fixes

1. Move or duplicate quote/book CTAs into the first mobile viewport on the homepage.
   Impact: The homepage owns the largest GSC opportunity and currently shows only Call plus reviews before the main quote/book buttons.

2. Add first-viewport quote/book actions to service detail pages.
   Impact: Watch repair, ring sizing, and chain/necklace pages carry high-intent queries but bury the conversion path after intro/content sections.

3. Tighten mobile touch targets for blog topic chips and breadcrumb links.
   Impact: Several first-viewport links are 35-40px tall; target 44px minimum for mobile ergonomics.

4. Keep forms concise; do not add required fields.
   Impact: Current forms are structurally reasonable. The optimization opportunity is placement and measurement, not extra data capture.

## Measurement Notes

- No audited page had horizontal overflow at 390px width.
- No audited page emitted console errors during the crawl.
- All audited funnel pages had at least two `tel:` links; contact had four.
- GA4 event validation passed for lead form starts and submit-success events, with a network collection warning noted in the GA4 baseline file.
