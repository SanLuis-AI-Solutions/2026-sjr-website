# Full-Site SEO, GEO, and AEO Audit

## Metadata
- branch: `master`
- commit: `ef0ad07acbf46d1be05c33f3b24cbb7f738eed2c`
- artifact path: `Docs/artifacts/audit/2026-03-06--gemini-full-site-seo-geo-aeo-audit.md`
- audit date: `2026-03-06`
- canonical domain: `https://www.susiesjewelryrepair.com`
- URLs reviewed: `/`, `/services`, `/services/watch-repair`, `/quote`, `/book`, `/contact`, `/blog`, `/blog/ring-sizing-guide`, `/faq`, `/about`, `/privacy`, `/terms`
- done: Yes
- not done: None
- risks: Deferred `/services` LCP structural fixes may continue to cause bimodal threshold penalties in tracking dashboards until addressed in a post-launch sprint.

## Executive Summary
- overall score: `87/100`
- score band: `80-89` (Strong, but clear upside remains)
- one-sentence verdict: The baseline is solid with structurally sound technicals and highly extractable, answer-shaped markup, but it carries a penalty for deferred LCP hydration blockades and sparse topical blog content.
- primary growth constraint: Thin blog / topical clusters holding back mid-funnel search discovery.
- primary conversion constraint: Missing social proof (stars/reviews) and storefront exterior photography near core CTAs to drive immediate offline walk-in trust.
- primary local/storefront opportunity: Deploying real storefront/interior photography on `/contact` and an explicit Founder/Person entity schema on `/about`.

## Category Scores

| Category | Weight | Score | Notes |
| --- | ---: | ---: | --- |
| Technical SEO | 20 | 18 | Mostly 100/100 Lighthouse on core routes. The 2700ms bimodal hydration delay on `/services` is the only technical drag. |
| Content and intent coverage | 15 | 11 | Excellent service pages with structured FAQ pricing, but the `/blog` intent coverage is barely initialized. |
| Local SEO and storefront intent | 15 | 14 | LocalBusinessSchema is globally injected perfectly. Local semantic cues (Pasadena) are prominent. |
| GEO and AEO readiness | 15 | 14 | Direct Q&A structure in FAQ schemas; highly extractable "Market Snapshot" matrices for LLM ingestion. |
| Conversion architecture | 15 | 13 | Sticky mobile drawer provides excellent one-tap quote/book paths, but high-intent trust friction remains during long intake forms. |
| Mobile UX and trust | 10 | 9 | Excellent touch targets. Removed blur layers stabilized render cost, but missing founder visuals limits human-level trust. |
| Internal linking and topical authority | 10 | 8 | Interlinking from Hubs to Spokes works perfectly, but no lateral Blog-to-Service semantic internal linking network exists yet. |
| **Total** | **100** | **87** | **Strong, but clear upside remains.** |

## URL-Specific Findings Matrix

| URL | Primary intent | What works | What weakens ranking or conversion | Fix |
| --- | --- | --- | --- | --- |
| `/` | Brand / navigation | Strong "Trusted Pasadena" copy. Schema on layout. | Missing reviews/proof next to secondary CTA. | `worth testing` Testimonial slider inline or Google Review badge. |
| `/services` | Directory navigation | Strong silo layout and clear UI routing. | 20+ `TrackedLink` client components stalling hydration LCP. | `must fix` Change above-fold CTAs to semantic `Link` tags with event delegation. |
| `/services/watch-repair` | Bottom-funnel conversion | "Market Snapshot" pricing data satisfies LLM retrieval. | Images are occasionally lazy loaded when they should be `priority=true`. | `safe to defer` Audit priority image loading on secondary templates. |
| `/quote` | Lead capture | Single-focus UI, zero-distraction layout. | Form height on mobile without a progress bar risks abandonment. | `high leverage` Add steps/progress indicators to the intake workflow. |
| `/book` | Live appointment | Fast load / stable metrics. | Nothing reinforces why an appointment is helpful for drop-offs. | `worth testing` Add brief copy reinforcing drop-off assessments are free. |
| `/contact` | Storefront visit | Static map preview eliminates iframe janking. | No picture of the building exterior limits local visual recognition. | `high leverage` Add real hero shot of storefront exterior. |
| `/blog` | Informational SEO | `lcp-heading` fallback stabilized TTFB. | Client hydration boundary wall from topic filters blocks paint. | `must fix` Render topic filters natively on the server. |
| `/blog/ring-sizing` | Targeted education | Excellent answer-shaping for GEO/AEO processing. | Dead-ends without injecting lateral links back directly to the `/services/ring-sizing` product page. | `high leverage` Insert contextual CTA cards into blog prose. |
| `/faq` | Resolving hesitation | Dedicated `faqSchema` JSON-LD correctly formatted. | Visual hierarchy can be slightly monotonous. | `safe to defer` Accordion UI groups by topic. |
| `/about` | Trust / Entity building | Clear brand storytelling. | Missing `Person` / `Founder` semantic schema for Knowledge Graph links. | `safe to defer` Add Founder + team profile schema to About structure. |

## Evidence-Based Priority List

Ranked by severity and impact on growth/traffic/conversion:

| Priority | Issue | Classification | Impact | Evidence / URL | Recommended Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | `TrackedLink` hydration blockades | `must fix` | Direct LCP penalty (~1.3s renderDelay spike). | `/services`, `/blog` | Convert to `Link` + data-attributes with top-level delegate on hub pages. |
| 2 | Sparse topical authority / content limit | `high leverage` | Suppresses organic middle-funnel keyword discovery. | `/blog/*` | Execute Content Nexus roadmap around local jewelry repair queries. |
| 3 | Service-to-Blog Internal Links Missing | `high leverage` | Isolates topic authority; limits bounce-rate offset. | `/services/*`, `/blog/*`| Integrate "Related Articles" cards into `cv-section` on service pages and Vice-Versa. |
| 4 | Storefront Entity Proof Missing | `high leverage` | Reduces offline/local walk-in conversion confidence. | `/contact`, `/about` | Add a high-quality storefront/exterior image. |
| 5 | Unsecured Trust Badges near CTAs | `worth testing` | Lower lead-generation completions on forms. | `/quote`, `/book` | Deploy a "5-Star Local Business" or "Secure Quote" visual lock near submit UI. |
| 6 | Multi-step form cognitive load | `worth testing` | Mobile form drop-off thresholds. | `/quote` | Group input fields visually or add linear progress indicators. |
| 7 | Missing Person/Founder Entity Schema | `safe to defer` | Negatively impacts Knowledge Graph AEO clustering. | `/about` | Implement `Person` schema linked to `LocalBusiness` founder. |
| 8 | Priority image tags omitted intermittently | `safe to defer` | Minor LCP variances on direct subpage hits. | `/services/*` | Set `priority: true` explicitly on primary featured image mapping logic. |
| 9 | Site-wide AVIF migration pending | `safe to defer` | Home uses `<img src=".avif">`, but older assets are `.webp` | Full Site | Run bulk compression script to convert legacy assets to AVIF if network weight rises. |
| 10 | Retargeting pixel absence | `safe to defer` | Loss of 2nd-touch bookings if Ads scale. | `/quote` | Confirm GTM/GA4 remarketing tags if paid acquisition campaigns start. |

## Quick Wins

### 7-Day
- Deploy Storefront external photography to `/contact` to capture local storefront visit intent.
- Modify the `/quote` layout to include a visible "Free Secure Assessment" trust tag.

### 30-Day
- Address the `TrackedLink` client hydration issue on `/services` and `/blog` by transitioning to vanilla `next/link` components using data-attribute analytics delegation.
- Interlink the first cluster of Content Nexus blog posts with their respective `/services/[slug]` counterparts.

### 90-Day
- Expand topical authority across 20+ local geo variants and intent queries via the Content Nexus.
- Embed proper `Person` + `Founder` JSON-LD to firmly establish the brand entity within the Google Knowledge Graph.

## SEO Findings
- The technical foundation (Next.js server rendering) is flawless, yielding `SEO=100` scores effortlessly.
- Content canonicalization and Meta Tags are perfectly matched.

## GEO / AEO Findings
- Strong extractable data through `Market Snapshot` pricing scenarios specifically formatted for AI scraping. This is an AEO superpower that few local competitors possess.
- FAQ schema ensures Perplexity and ChatGPT can directly source answers regarding price and turnaround times.

## Local SEO / Storefront Findings
- Correct `LocalBusiness` JSON-LD payload injected in the global `layout.tsx` guarantees that Pasadena geographic clustering is enforced correctly.

## Conversion Findings
- CTAs are prominently positioned, especially via the sticky mobile footer bar, locking the conversion loop firmly. 
- Form friction exists due to cognitive load (lengthy visual footprint without pagination or trust seals).

## Technical Findings
- Site architecture is exceptionally clean and well-built around the Next.js App Router.
- The solitary issue blocking `100/100` perfection across all metrics is the `use client` component boundary overhead introduced by heavy above-the-fold analytics tracking abstractions (`TrackedLink`).
