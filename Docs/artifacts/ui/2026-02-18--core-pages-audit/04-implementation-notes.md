# Core Pages Audit + Fix Notes (2026-02-18)

Scope:
- `src/app/about/page.tsx`
- `src/app/faq/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

Primary intent:
- close mobile-first UX/accessibility gaps on remaining core pages
- keep premium/luxury-minimal visual language while improving conversion clarity
- add route-level smoke evidence for About/FAQ/Contact/Blog

## High-impact findings addressed
- Missing route-level metadata/canonical tags on About/FAQ/Contact.
- Weak primary/secondary CTA clarity on About/FAQ/Blog (no explicit quick-action pair).
- Contact form had weaker focus/tap-target treatment than Quote/Book and lacked autocomplete/inputMode improvements.
- FAQ page had limited intent coverage (4 questions only) and stale wording ("within the week").
- Blog detail dynamic route needed explicit async param handling in this Next.js setup to avoid `/blog/[slug]` 404 during runtime smoke tests.

## Decisions applied
- Added canonical metadata on `/about`, `/faq`, and `/contact`.
- Added consistent mobile quick-action region (`Get Fast Quote`, `Book Repair`) on About/FAQ/Contact/Blog.
- Upgraded Contact form controls and links with stronger focus-visible styles, 44px+ tap targets, semantic status/alert messaging, and autocomplete hints.
- Expanded FAQ content to intent-driven Q&A coverage and added FAQPage JSON-LD for continuity.
- Normalized remaining "within the week" copy to "Same Day/Next Day service" language where applicable.
- Kept visual tone distinct from Home by using cleaner section rhythm and reduced decorative density on core pages.

## Verification linkage
- Playwright smoke expanded to include:
  - `/about`
  - `/faq`
  - `/contact`
  - `/blog`
  - `/blog/ring-sizing-guide`
- New route checks include heading presence, quick-action CTA visibility, tap-target size (`>=44px`), and broken image detection.
