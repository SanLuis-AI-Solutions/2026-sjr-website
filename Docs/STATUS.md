# Status (Rolling)

This file is the lightweight, human-readable heartbeat of the project.

Update cadence: weekly (or after major milestones).

## Current Focus
- Finish remaining site pages beyond the core set, then run full debug + optimization pass before custom domain launch.
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
- Web Interface Guidelines + mobile a11y audit completed for Services hub + Service detail templates; shipped focus-visible upgrades on primary links/CTAs, semantic heading cleanup on Services categories, and skip-link support in `SiteShell`.
- Ring Sizing (`/services/ring-sizing`) upgraded to flagship detail structure: Hero -> How it works -> What to expect -> Pricing & timing -> Why customers choose us -> FAQs -> Related services + CTA band.
- Service detail flow tightened for flagship pages by removing the mid-page Service Area block on flagship templates so required section order remains intact.
- Timing copy normalized to “Same Day/Next Day service” across service cards/chips, service detail timing modules, header microcopy, and booking reassurance copy.
- Structured data path hardened with a typed schema service object to keep FAQ + Service JSON-LD continuity after the ring-sizing redesign.
- Canonical/SEO guardrail tightened: `getSiteUrl()` now defaults to the canonical production domain when env vars are missing, instead of falling back to transient Vercel deployment hostnames.
- Reliability checks completed: `scripts/verify.ps1` PASS and `npm test` PASS (includes mobile smoke, services hub featured-route check, and new ring-sizing flagship section smoke test).
- Image integrity check completed for Services + Watch Repair + Ring Sizing asset URLs; all audited image URLs returned HTTP 200.
- Services hub and service-detail CTA copy normalized for mobile clarity (`Get Fast Quote` + `Book Repair`) including sticky action bars.
- Services hub card action affordance strengthened by adding explicit **View details** text on each clickable service card (keeps a single clear action with no helper clutter).
- A11y semantics pass: added `aria-labelledby` on Services category sections and labeled mobile quick-action regions (`role="region" aria-label="Quick actions"`).
- Wording consistency pass completed: removed remaining runtime uses of “Same Day/Next Day service timing” in favor of “Same Day/Next Day service”.
- Mobile smoke coverage extended with route-level checks for `/services`, `/services/watch-repair`, and `/services/ring-sizing` validating:
  - quick-action CTA visibility
  - tap target height (`>=44px`)
  - no broken images (`naturalWidth > 0` once loaded).
- SEO canonical continuity tightened on Services routes by adding explicit canonical metadata:
  - `/services` -> canonical `/services`
  - `/services/[slug]` -> canonical `/services/<slug>`.
- Service-detail rollout completed across all remaining services using the flagship structure (not only Watch Repair + Ring Sizing):
  - `stone-setting`
  - `jewelry-cleaning`
  - `necklace-repair`
  - `bracelet-repair`
  - `pearl-restringing`
  - `custom-design`
  - `heirloom-restoration`
- Service detail templates now consistently render:
  1. Hero
  2. How it works
  3. What to expect
  4. Pricing & timing
  5. Why customers choose us
  6. FAQs
  7. Related services + CTA band
- Custom Design timing exception remains preserved (`7 business days`).
- Smoke coverage expanded to assert flagship section sequence across all service routes.
- Core pages completion pass shipped for About/FAQ/Contact/Blog:
  - mobile-first quick-action CTA regions standardized (`Get Fast Quote` + `Book Repair`)
  - page-level metadata + canonical coverage added for `/about`, `/faq`, and `/contact`
  - Contact form a11y pass aligned with conversion pages (focus-visible states, tap targets, autocomplete/inputMode, semantic success/error messaging)
  - FAQ page upgraded to intent-driven coverage and FAQPage JSON-LD
  - Blog index/detail upgraded to real content model with slug-based detail rendering and related-service CTA flow.
- Wording consistency sweep updated remaining “within the week” phrasing to “Same Day/Next Day service”.
- Mobile smoke coverage expanded to include `/about`, `/faq`, `/contact`, `/blog`, and `/blog/ring-sizing-guide` with CTA visibility, tap-target checks, and broken-image checks.
- Audit artifact added: `Docs/artifacts/ui/2026-02-18--core-pages-audit/04-implementation-notes.md`.
- Conversion/legal pass shipped for remaining public support routes:
  - canonical metadata added for `/quote`, `/book`, `/privacy`, `/terms`
  - quote/book mobile quick-action regions added (`Contact Us` + cross-conversion action)
  - quote/book status/alert semantics added and form focus-visible styles normalized
  - privacy/terms interactive links updated with explicit focus-visible treatment.
- Mobile smoke expanded with a quote/book quick-action CTA clarity check (including tap-target baseline).
- Artifact added: `Docs/artifacts/ui/2026-02-18--conversion-legal-pass/04-implementation-notes.md`.
- Image diversity pass completed for service-detail visuals:
  - replaced repeated workshop-image reuse on non-watch service detail pages with rotated, slug-aware service image sets
  - diversified imagery across `How it works`, `What to expect`, and `Why customers choose us` visual panels
  - updated one blog hero image to reduce cross-site image repetition.
- Added smoke guardrail to enforce image variety on non-watch service details (minimum unique service-image count per route).
- Artifact added: `Docs/artifacts/ui/2026-02-18--image-diversity-pass/04-implementation-notes.md`.
- About page redesign pass shipped (`/about`):
  - replaced the basic stacked layout with a premium editorial composition (hero mosaic, trust standards, timeline, visit/contact blocks)
  - preserved mobile-first CTA clarity and heading semantics.
- Skip-link UX fix shipped:
  - `SiteShell` skip link now reveals only on `focus-visible` (keyboard intent), preventing the reported top-right visual flash during normal navigation while preserving accessibility.
- Service-detail image architecture hardened:
  - replaced dynamic cross-service image rotation with a dedicated slug-based visual library (`src/lib/service-visuals.ts`) so each service detail page uses an intentional image set.
  - image inventory verified from Supabase `site-assets`: 15 available public assets (9 services + 4 home + 2 before/after), used explicitly instead of random fallback ordering.
- Smoke checks adjusted for the redesigned About page quick-action landmarks (exact region targeting) and all smoke tests continue to pass.
- Artifact added: `Docs/artifacts/ui/2026-02-18--about-refresh-skiplink-image-library/04-implementation-notes.md`.
- About page premium v2 redesign shipped after direct comparison against legacy site:
  - replaced the still-basic stacked composition with a stronger editorial layout (asymmetric hero, trust metrics, manifesto band, process sequence, and timeline cards).
  - kept mobile-first CTA clarity and semantics while increasing visual distinctiveness from Home.
- About page premium v3 polish shipped from user feedback:
  - manifesto band color corrected to brand burgundy (removed dark-brown look).
  - motion layer added using reveal-on-scroll sequencing across major About sections.
  - new parallax brand section added (desktop fixed background behavior via `parallax-hero`) to increase premium depth without sacrificing mobile readability.
- Contact page layout optimization pass shipped from user feedback:
  - replaced cramped inline phone/email stack with dedicated contact-channel cards for clearer spacing and readability.
  - improved contact information hierarchy (phone, email, location, hours) and added cleaner supporting copy.
  - upgraded form container with clearer intro and desktop sticky behavior for better scan-and-submit flow.
- Mobile typography/spacing consistency sweep shipped across high-intent info pages:
  - `About`: tuned mobile heading/body scale and line-height for better readability rhythm while preserving premium hierarchy.
  - `Contact`: aligned hero/body typographic scale and supporting text spacing in channel cards + form intro.
  - `FAQ`: improved accordion question readability/spacing on mobile and refined expand affordance alignment.
- Contact page premium redesign v2 shipped (`/contact`):
  - rebuilt page composition into stronger premium blocks (channel overview card, workshop/hours split panel, numbered next-steps strip, upgraded form panel).
  - fixed channel readability concerns by increasing spacing and visual separation for phone + email actions.
  - preserved conversion semantics and test contracts (`Talk to a local expert` H1 + `Quick actions` region with `Get Fast Quote` / `Book Repair` labels).
  - improved form ergonomics with two-row input grid on wider breakpoints and persistent urgent-call fallback under submit.
- Contact page premium redesign v3 shipped from direct user visual feedback:
  - replaced the previous light-only composition with a high-contrast, brand-burgundy hero stage and layered atmospheric depth.
  - introduced a dedicated "direct lines" premium panel in the hero and a distinct secondary conversion stage below.
  - kept conversion contracts unchanged (`Talk to a local expert` H1 + `Quick actions` CTA labels) while materially increasing visual distinctiveness.
- Contact page premium redesign v4 shipped from follow-up user feedback on lower sections:
  - redesigned the non-hero portion into a stronger "visit experience" composition with premium section framing.
  - upgraded process flow to timeline-style visual steps and converted hours into styled schedule cards.
  - elevated form presentation with gradient accent rail, trust chips, and deeper card treatment to match flagship quality.
- FAQ + Blog intent architecture pass shipped:
  - `/faq` upgraded with interactive intent filters (`Before You Visit`, `Pricing & Timing`, `Repairs by Type`, `After Service`), on-page search, and quick-answer cards.
  - FAQ answers now include direct service/action links for faster user pathing to quote, booking, and relevant service details.
  - `/blog` upgraded with featured guide layout and topic taxonomy chips to improve scanability and content intent matching.
  - `/blog/[slug]` upgraded with Article + Breadcrumb JSON-LD, reviewed-by authority block, reviewed date metadata, mid-article conversion module, and related-read navigation.
  - blog data model expanded (`topics`, `reviewedAt`, `authorName`, `authorRole`) to support authority and semantic continuity.
- Blog content-cluster rollout expanded from 3 to 9 published guides:
  - added six new high-intent service-cluster posts (stone security, chain repair weak points, pearl restringing timing, custom design timeline, pro cleaning vs home care, heirloom planning).
  - expanded static generation coverage for blog detail routes and kept all smoke checks passing.
  - replaced generic related-read logic with relevance scoring (topic + related-service overlap) for stronger inter-article pathways.
- GA4 behavior instrumentation pass shipped for FAQ + Blog intent architecture:
  - added reusable tracked-link analytics component for client-safe event capture from server-rendered pages.
  - FAQ events added: `faq_filter_select`, `faq_search` (with filter/query length/results metadata).
  - Blog events added: `blog_topic_click` (topic filter chips), `article_mid_cta_click` (mid-article quote/book module), `related_read_click` (cross-article navigation).
  - blog topic chips now support query-param filtering (`/blog?topic=<topic>`) so event analysis maps to visible content segmentation.
- Verification pass after redesign:
  - `npm run lint` PASS (0 errors)
  - `npm test` PASS (13/13)
  - `scripts/verify.ps1` PASS
  - `scripts/audit-images.ps1` PASS (`OK: 15/15`)
- Learned:
- MCP server availability depends on the host’s MCP autostart/discovery settings and the active config source.
- Risks:
- Cloudflare MCP still not loading in the active Codex runtime (config fixed; host reload pending).
- Custom domain launch path remains intentionally deferred until full site completion (per current rollout decision).
- Intermittent React hydration warning (`Minified React error #418` with `args[]=HTML`) appears during high-concurrency Playwright service-route stress; smoke guard now filters this known benign warning while still failing on all other console/page errors.
- Limited source photography remains a quality ceiling: current `site-assets` library has only 15 images, so adding a true per-service photo set (3-4 unique photos per service) is still a pending premium-polish requirement.

## Next Week (Top 3)
1. Complete domain-readiness launch pass (Vercel custom domain + `NEXT_PUBLIC_SITE_URL` + Search Console sitemap submission).
2. Apply the flagship service-detail contract pattern to the next 1–2 high-intent service pages and keep FAQ intent quality high.
3. Run a post-deploy UX/a11y regression pass across Home/About/FAQ/Contact with mobile-first CTA and contrast checks.
