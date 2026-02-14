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
- Started a structured Services hub refresh artifact (`Docs/artifacts/ui/2026-02-13--services-hub-refresh/`) to drive a premium redesign without drifting from the site system.
- Services hub: reduced per-card CTA noise and added a mobile sticky conversion bar (Quote/Book) for cleaner directory browsing.
- Services hub: removed the “Find your service” module to keep the page cleaner and more luxury-minimal; kept navigation focused on featured + category jump and the directory on desktop.
- Watch Repair service detail: added an above-the-fold "What happens next" module + standardized turnaround display (Same Day/Next Day default; Custom Design remains 7 business days).
- Watch Repair: removed “Last updated” + removed the small Includes block (less clutter), redesigned “What to expect” into clear sub-sections with added imagery + reveal animations.
- Services hub: moved Featured into its own standalone section (cleaner, more luxury-minimal).
- Copy sweep: replaced “Same-week” wording with “Same Day/Next Day” site-wide.
- Services hub: simplified service cards so the entire card is clearly clickable (reduced “button-like” sub-elements) and removed the extra “Get quote →” CTA from the Featured section.
- Watch Repair page: moved “How it works / What happens next” out of the hero into its own section; split “Pricing & timing” into its own dedicated section (separate from “What to expect”).
- Service detail FAQs: enforce a minimum of 5 FAQ items (pad with safe supplemental questions when upstream data has fewer).
- Services hub: removed the small category quick-link tiles under the hero image (less clutter, more premium).
- Services hub: replaced “Same Day/Next Day timing” copy with “Same Day/Next Day service”.
- Services hub: upgraded service card layout to a more premium split layout with image panel, clearer hierarchy, and a single “View details” affordance (removed “Tap anywhere” text).
- Watch Repair page: moved “Why customers choose us” into its own trust section (separate from Pricing & timing).
- Watch Repair FAQs: replaced overlapping questions with a more SEO-aligned, non-duplicative set (battery cost/time, crystal replacement, crown/stem, water resistance testing, mechanical service, appointment).
- Services hub: wrapped each category’s services in a premium container card (shadow + border) so the directory reads like a designed system (closer to the Featured banner quality).
- SEO foundation: added `sitemap.xml` + `robots.txt`, and wired `metadataBase` to `NEXT_PUBLIC_SITE_URL` so canonical URLs are correct when `susiesjewelryrepair.com` is connected.
- Services hub: moved emphasis to **individual service cards** (each service is its own premium card unit) and increased contrast/color (subtle burgundy + gold atmosphere) while keeping the page luxury-minimal.
- Reliability: memoized content fetches (`getServices`, `getServicesWithImages`, `getFaqsByService`) to prevent intermittent hydration mismatches during SSR/streaming.
- Watch Repair: increased color/contrast with alternating warm-stone sections, added a three-image craft strip, and tightened hero chips (“Service” label) to reduce visual noise while keeping the page premium.
- Process: added a page contract to reduce churn and keep Services + Watch Repair iteration intentional (`Docs/artifacts/ui/2026-02-14--services-watch-contract/00-page-contract.md`).
- Learned:
- MCP server availability depends on the host’s MCP autostart/discovery settings and the active config source.
- Risks:
- Cloudflare MCP still not loading in the active Codex runtime (config fixed; host reload pending).
- Remaining pages can drift visually if we don’t apply a single shared layout system/patterns.

## Next Week (Top 3)
1. Polish Services hub + 2–3 flagship service detail pages (copy, “what to bring”, turnaround, CTA placement).
2. Polish About + FAQ + Contact pages to match Home’s visual language and improve conversion.
3. Add sitemap/robots + tighten metadata/OG across all core routes.
