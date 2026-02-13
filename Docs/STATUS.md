# Status (Rolling)

This file is the lightweight, human-readable heartbeat of the project.

Update cadence: weekly (or after major milestones).

## Current Focus
- Finish design/copy across remaining core pages (Services, About, FAQ, Contact, Blog).
- Lock booking + quote + contact lead flows and keep notifications reliable.
- Prepare launch SEO basics (metadata, sitemap/robots, internal linking).

## KPIs
- Primary KPI:
- Secondary KPIs:

## This Week
- Shipped:
- Home + Services hub + Service detail template (9 services).
- Lead notifications: email + Google Chat for Contact, Booking, Quote (verified by manual submissions).
- Email auth: DKIM + DMARC ready.
- Deployment guardrails: deterministic Vercel deploy script + CI deploy workflow (prevents silent "push but no deploy").
- Watch Repair service detail: options (battery vs full service), what-to-bring checklist, improved FAQs, and a mobile sticky CTA bar.
- Footer copy: removed “atelier” jargon in favor of plain-English wording (mobile readability).
- Footer location: removed hardcoded “Pasadena, California” and now derives city/state/zip from `BUSINESS.address` (fixes CA vs TX mismatch).
- Services hub: changed “atelier” wording to “workshop” and fixed `Back to top` anchors by adding a real `#top` target.
- Reliability: added Playwright mobile smoke test and wired it into CI before production deploy (catches broken client-side navigation + core conversion paths).
- Reliability: hardened Scroll Reveal so streamed content on route transitions can’t stay stuck hidden (MutationObserver re-scan to avoid “Home looks broken after coming from another page”).
- Mobile UX: implemented a real slide-over mobile menu (Services/About/FAQ/Blog/Contact + Quote/Book CTAs).
- Conversion pages: upgraded Quote + Booking pages to premium two-column layout, visible labels, better mobile autofill, and clearer next-step trust cues.
- Conversion pages: aligned Contact page layout styling with Quote/Book (consistent mobile-first feel).
- Service detail content: added service-specific FAQs for all 9 services (more trust + less uncertainty on mobile).
- Service detail data: normalized Supabase json-ish arrays (prevents “includes” rendering as a single blob string).
- Support pages: added `/privacy` and `/terms` pages so footer links are not broken.
- Home cleanup: removed the unused “Repair Impact” (before/after slider) component from the repo to prevent accidental reintroduction.
- Learned:
- MCP server availability depends on the host’s MCP autostart/discovery settings and the active config source.
- Risks:
- Cloudflare MCP still not loading in the active Codex runtime (config fixed; host reload pending).
- Remaining pages can drift visually if we don’t apply a single shared layout system/patterns.

## Next Week (Top 3)
1. Polish Services hub + 2–3 flagship service detail pages (copy, “what to bring”, turnaround, CTA placement).
2. Polish About + FAQ + Contact pages to match Home’s visual language and improve conversion.
3. Add sitemap/robots + tighten metadata/OG across all core routes.
