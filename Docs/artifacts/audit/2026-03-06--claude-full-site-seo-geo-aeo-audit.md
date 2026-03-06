# Claude Full-Site SEO / GEO / AEO Audit

## Metadata

- **branch:** master
- **commit:** 8b5095a
- **artifact path:** `Docs/artifacts/audit/2026-03-06--claude-full-site-seo-geo-aeo-audit.md`
- **audit date:** 2026-03-06
- **canonical domain:** https://www.susiesjewelryrepair.com
- **URLs reviewed:**
  - `/`
  - `/services`
  - `/services/watch-repair`
  - `/quote`
  - `/book`
  - `/contact`
  - `/blog`
  - `/blog/ring-sizing-guide`
  - `/blog/how-to-choose-a-jeweler`
  - `/faq`
  - `/about`
  - `/privacy`
  - `/terms`
  - `/sitemap.xml`
  - `/robots.txt`

---

## Executive Summary

- **overall score:** 69/100
- **score band:** credible foundation — meaningful revenue left on the table
- **one-sentence verdict:** The site is technically clean and well-structured but is limited by thin blog content that cannot compete for commercial queries, a confirmed structured data bug that mis-states Sunday hours, and a complete absence of entity-linking signals that AI and Google need to confidently recommend the business.
- **primary growth constraint:** Blog article depth averages 500–900 words across 14 articles — insufficient to rank for any service-intent query above navigational searches for the brand name.
- **primary conversion constraint:** The booking form's date/time UX is two separate selectors with no inline calendar, and neither the `/quote` nor the `/book` page surfaces a phone number — users who want immediate human contact have no visible escape hatch.
- **primary local/storefront opportunity:** 51 Google reviews for a business open since 1984 is severely underoptimized. Doubling or tripling review volume is the fastest move to improve both map pack ranking and AI recommendation likelihood.

---

## Category Scores

| Category | Weight | Score | Notes |
| --- | ---: | ---: | --- |
| Technical SEO | 20 | 17 | Lighthouse SEO=100 on all routes; clean robots.txt; 33-URL sitemap; apex redirect live. Gaps: sitemap lacks `<lastmod>`, Sunday hours schema bug emits wrong hours, `sameAs` array empty. |
| Content and intent coverage | 15 | 9 | 14 articles present; Q&A-format local posts are strategically correct. Fatal: 500–900 word average cannot outrank competitors for "jewelry repair Pasadena" or any service + city query. |
| Local SEO and storefront intent | 15 | 9 | NAP consistent; AggregateRating in schema; click-to-call on contact. Fatal gap: Sunday schema bug outputs open 10am–6pm when closed; 51 reviews for a 40-year business; `sameAs: []` empty; no Deer Park / La Porte geo pages. |
| GEO and AEO readiness | 15 | 10 | FAQPage schema on home, `/faq`, and `/services/watch-repair`; BreadcrumbList on blog and service pages; entity clearly stated. Gaps: blog articles have no in-body FAQ blocks; `sameAs` null; authorship is anonymous ("Susie's In-House Team"); no external entity references. |
| Conversion architecture | 15 | 11 | Dual CTA (Get Fast Quote + Book Repair) throughout; "free 15-minute assessment" framing reduces commitment anxiety; quote form has 3 required fields + optional photo. Gaps: no phone on `/quote`; booking date/time is two-step; Saturday booking close (3pm) does not match store hours (4pm). |
| Mobile UX and trust | 10 | 7 | Mobile sticky bar on `/services`; click-to-call markup; dense trust signals (4.5★, Est. 1984, testimonials, in-house guarantee). Gap: `/services` LCP ~2750ms above 2500ms target (deferred debt); no sticky phone on high-traffic pages other than `/contact`. |
| Internal linking and topical authority | 10 | 6 | Blog articles link to service pages; service pages cross-link related services; footer lists all 9 service pages. Gaps: 11 topic categories averaging 1–2 articles each; no cross-blog links; no hub/pillar pages; `/about` has no links to specific service pages. |
| **Total** | **100** | **69** | |

---

## Page-Type Scores

| Page Type | Representative URL | Score | Notes |
| --- | --- | ---: | --- |
| Home | `/` | 78 | Dense schema, dual CTA, trust signals, local FAQ. Headline "Trusted Pasadena Jewelry Repair, Done In-House." is excellent for local intent. |
| Services hub | `/services` | 68 | Clean directory structure; 9 services grouped; mobile sticky bar. H1 "A curated menu of in-house repairs" does not include city or service keyword — missed SEO signal. |
| Service detail | `/services/watch-repair` | 82 | Best-optimized page on site: pricing tiers, 7-question FAQPage schema, cross-links to related services, in-body testimonials. "Compare nearby repair options" section needs review to confirm no outbound competitor links. |
| Quote | `/quote` | 70 | Low-friction form (3 required fields, optional photo). No phone number visible — users who distrust forms have no alternative action. |
| Book | `/book` | 65 | "Free 15-minute assessment" is excellent framing. Booking calendar UX is two-step (separate date + time). Saturday closes shown as 3pm vs. store's 4pm — inconsistency. |
| Contact | `/contact` | 78 | All contact methods present; click-to-call `tel:` markup; map link present. Map is a link (not embed) — no visual map renders, reducing walk-in trust. |
| Blog hub | `/blog` | 65 | 15 articles, 11 topic filters, clear category taxonomy. No `<lastmod>` signal, no cross-blog recommended reading. Featured article position is good. |
| Blog article | `/blog/ring-sizing-guide` | 55 | Article schema, breadcrumb, internal service links, and CTA are all present. Critical gap: ~500–600 words is too thin for any competitive ranking. No FAQ block in article body. |
| FAQ | `/faq` | 72 | FAQPage schema confirmed. 8 questions covers core buyer-journey objections well. Should be expanded to 15–20 with service-specific and pricing questions. |
| About | `/about` | 65 | Strong trust signals (4 decades, 3 generations, timeline milestones). No named founder or staff — limits E-E-A-T. No links to specific service pages. |
| Legal | `/privacy` + `/terms` | 72 | Both indexable (acceptable — no legal objections); last updated Feb 2026; full internal nav present. No issues. |

---

## Top Findings

| Priority | Issue | Classification | Impact | Evidence | Recommended Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Sunday hours in `LocalBusiness` structured data output as open 10am–6pm when business is closed | **must fix** | Causes Google Business Profile mismatch; can suppress or penalize map pack appearance; misleads AI recommendation systems | `src/components/local-business-schema.tsx:53–58` — `match` is null for "Closed" entry, so fallback `opens: "10:00"` and `closes: "18:00"` fires for Sunday | Add a guard: if `h.hours === "Closed"` skip the entry or set `opens`/`closes` to `"00:00"`/`"00:00"` per schema.org spec |
| 2 | Blog articles average 500–900 words — cannot compete for any commercial service + city query | **must fix** | Directly limits organic traffic growth; no article can rank page 1 for "ring sizing Pasadena TX" or "watch battery replacement Pasadena" at this depth | `/blog/ring-sizing-guide` ~500–600 words; `/blog/how-to-choose-a-jeweler` ~800–1000 words | Expand all existing articles to 1,200–1,800 words; add FAQ blocks in body; include service-area specifics and competitor context |
| 3 | `sameAs: []` is empty in `LocalBusiness` schema — zero external entity links | **must fix** | AI systems (ChatGPT, Perplexity, Google SGE) use `sameAs` to connect entity to Knowledge Graph; empty means zero external confidence signal | `src/components/local-business-schema.tsx:61–63`: `"sameAs": []` with comment "Add social links here if available" | Add Google Business Profile URL, Yelp page URL, Facebook page URL, and BBB listing URL as `sameAs` values |
| 4 | 51 reviews for a 40-year business — severely underweights GBP authority | **high leverage** | Map pack rankings correlate with review volume; AI recommendation systems weight review count heavily for local trust; a competitor with 200+ reviews will outrank at equal quality | AggregateRating confirmed as 4.5/51 in schema across all pages | Launch a structured review request campaign: post-repair email sequence asking for Google review; add a "Leave us a review" link on the confirmation page and `/contact` |
| 5 | No geo-expansion pages for Deer Park, La Porte, or Houston — service area stated but not targeted | **high leverage** | "Jewelry repair Deer Park TX" and "watch repair La Porte TX" have zero competition and direct local intent; the business explicitly lists these as service areas but has no pages targeting them | `BUSINESS.serviceAreas = ["Pasadena", "Deer Park", "La Porte", "Houston Area"]` but no landing pages exist | Create dedicated `/services/deer-park` and `/services/la-porte` area pages with NAP, service list, and local content |
| 6 | Blog has no FAQ blocks in article body — misses primary AEO extraction point | **high leverage** | AI answer systems (Google SGE, Perplexity) preferentially extract marked-up FAQ content from articles; current articles have only prose | No `<details>`, no FAQ schema in any article body; FAQPage schema only on dedicated `/faq` and service detail pages | Add 3–5 FAQ questions at the bottom of each blog article with `FAQPage` JSON-LD; prioritize articles with commercial queries |
| 7 | `/quote` has no visible phone number — users who distrust forms have no alternative | **high leverage** | Local repair customers (especially 40+ demographic) frequently call rather than fill forms; no phone on the conversion page loses these callers | `/quote` page analysis shows no phone number present in form section | Add `(281) 991-6500` with `tel:` link near the form submit button with copy like "Prefer to call?" |
| 8 | `/services` H1 ("A curated menu of in-house repairs.") has no city or service keyword | **high leverage** | H1 is a primary on-page ranking signal; the current H1 is brand-voice but not keyword-eligible for any local search query | Confirmed from live page fetch | Change to a hybrid that preserves brand tone while including location: e.g., "In-house jewelry and watch repairs in Pasadena." |
| 9 | Booking form Saturday close time (3pm) does not match store hours (4pm) | **must fix** | Creates distrust when a customer arrives at 3:30pm Saturday with a booking confirmation — direct storefront visit failure | `src/components/booking-date-time-fields.tsx:305` says "Saturday 10:00 AM-3:00 PM"; `src/lib/constants.ts:17` says Saturday 4pm | Align booking cutoff with store hours or explicitly label it "last appointment" vs. "close time" |
| 10 | `<lastmod>` absent from all 33 sitemap URLs | **safe to defer** | Minor crawl frequency signal loss; Googlebot will still crawl but without freshness hints | Confirmed from `/sitemap.xml` analysis — no `<lastmod>`, `<changefreq>`, or `<priority>` on any URL | Add `<lastmod>` from content update timestamps in sitemap generation |

---

## SEO Findings

### What is working

- **Lighthouse SEO=100** confirmed on all 12 production routes at closeout verification — no meta tag, canonical, or crawlability failures.
- **Canonical redirect:** Apex-to-www redirect is live; `robots.txt` references sitemap correctly; `/admin/` is blocked.
- **Title tag and meta description coverage:** All reviewed pages have unique, keyword-relevant titles and descriptions. `/services/watch-repair` title ("Watch Repair & Battery Replacement | Jewelry Repair Pasadena, TX") is well-structured.
- **Service detail page depth:** `/services/watch-repair` is the strongest page on the site — pricing tiers, 7-question FAQ, cross-service links, testimonials, "how it works" section. This is the pattern all service pages should follow.
- **Local Q&A blog targeting:** Articles like "How much does it cost to resize a gold ring in Pasadena?" directly target featured-snippet and People Also Ask slots. The strategy is correct; the word count is not.

### What is failing

- **Content depth:** The average blog article is 500–900 words. Google's threshold for ranking a how-to or guide in competitive local queries is typically 1,200–2,000 words with structured headings, FAQs, and internal evidence. No article currently clears this bar.
- **`/services` H1 is brand-voice, not keyword-eligible.** The services hub is a high-traffic destination — its H1 should capture at minimum one local-intent signal.
- **Sitemap lacks `<lastmod>` timestamps.** Googlebot cannot determine freshness without crawling every URL. For a 33-URL site this is low-urgency, but for a blog with frequent updates it becomes a crawl efficiency issue.
- **Sunday hours schema bug** (see Finding 1 above) is the highest-urgency SEO issue on the site.

---

## GEO / AEO Findings

### Entity clarity

The site clearly communicates what the business is, where it is, and what it does. The `@id`, name, address, phone, and `JewelryStore` type are all present and consistent. This is the foundation AI recommendation systems need.

### What is working

- `FAQPage` schema present on `/`, `/faq`, and `/services/watch-repair` — the three highest-intent pages. These answers are extractable by Google SGE, Perplexity, and ChatGPT browsing.
- `BreadcrumbList` schema on all blog articles and service detail pages — correct signal for entity hierarchy.
- `AggregateRating` in `LocalBusiness` schema — AI systems weight review signals for local business recommendations.
- Content clearly answers "what", "where", "how much (starting at)", and "how long" for core services. These are the four questions AI systems try to extract before recommending a local business.

### What is failing

**`sameAs: []` is completely empty.** This is the single largest structural gap for GEO/AEO. `sameAs` is how the Google Knowledge Graph and AI systems connect a business entity to external trust signals (Google Business Profile, Yelp, Facebook, BBB). An empty `sameAs` means the site relies entirely on self-reported data — AI systems treat this as low-confidence.

**Blog articles lack in-body FAQ.** AI scrapers prioritize question-answer pairs in article content because they are directly extractable as search answers. The current articles are prose-only. Adding 3–5 Q&A pairs at the end of every article would dramatically increase the probability of being cited in AI-generated answers.

**Anonymous authorship.** "Susie's In-House Team" as the author on `Article` schema provides zero E-E-A-T signal. For AI systems to cite an article as an authoritative answer, a named human with demonstrable expertise performs significantly better. Adding a named jeweler bio page and linking it as `author` in article schema would improve citability.

**FAQ coverage is thin.** The `/faq` page has 8 questions. A comprehensive FAQ covering all 9 service categories, pricing, turnaround, warranty, and process questions — with proper `FAQPage` JSON-LD — would significantly expand the answerable surface area.

### AI recommendation likelihood assessment

For the query "best jewelry repair in Pasadena TX": **moderate probability**. The entity is clearly defined, has a review signal (4.5/51), and explicit location and service data. The primary risk is that a competitor with more reviews, `sameAs` entity links, and deeper content will be cited first.

For the query "watch battery replacement near Deer Park TX": **low probability**. No page targets this geography explicitly. A thin blog article would suffice to capture this.

For the query "how long does it take to resize a ring in Pasadena": **moderate-to-high probability** if the ring-sizing article had an FAQ block with this exact answer. Currently: low probability because the answer is buried in prose.

---

## Local SEO / Storefront Findings

### What is working

- NAP (Name, Address, Phone) is consistent across all pages. This is non-trivial and correctly maintained.
- `(281) 991-6500` with `tel:` click-to-call markup on `/contact`.
- Business hours displayed on `/contact` (Mon-Fri 10am-6pm, Sat 10am-4pm, Sun Closed).
- Google Maps link (non-iframe) on `/contact` — users can navigate directly to the storefront.
- Service area explicitly listed: Pasadena, Deer Park, La Porte, Houston Area.
- Opening hours in `LocalBusiness` schema.

### What is failing

**Sunday hours schema bug (Critical).** `src/components/local-business-schema.tsx` maps `BUSINESS.hours` to `openingHoursSpecification` using a regex that matches ` – ` (en-dash). For Sunday where `h.hours = "Closed"`, the regex fails to match and the fallback values `opens: "10:00"` and `closes: "18:00"` are emitted. This means every page with `LocalBusiness` schema — which is all pages — tells Google and AI systems that the business is open Sunday 10am-6pm. This directly conflicts with the GBP listing and will create trust issues if GBP correctly shows Sunday as closed.

**Review volume (51) critically underrepresents 40 years of service.** A business with 4 decades of local operation should have 200–400+ Google reviews. This gap suppresses map pack ranking and is the fastest addressable lever for GBP authority. Every dollar of performance engineering buys less traffic than a campaign that adds 50 genuine Google reviews.

**Map is a link, not an embed.** The `/contact` page shows a Google Maps link rather than an embedded map. Walk-in customers converting from mobile expect to see a visual map confirming the address before committing. Replacing the link with an embedded map (static image or iframe) would reduce friction for storefront visits.

**No `sameAs` external entity links.** (See GEO/AEO findings.) No Yelp, Facebook, or GBP URLs in schema.

**No geo-expansion landing pages.** The business lists Deer Park, La Porte, and Houston Area as service areas but has no pages targeting these geographies. "Watch repair Deer Park TX" is a low-competition, high-intent query with zero current coverage.

---

## Conversion Findings

### What is working

- **Dual CTA pattern** (Get Fast Quote + Book Repair) is consistent across all pages and appears in header, hero, section CTAs, footer, and mobile sticky bar. This is correct.
- **"Free 15-minute assessment" framing** on `/book` is excellent — it reduces the commitment anxiety of a first visit ("I'm just getting an estimate, not committing to an unknown repair cost").
- **Quote form is low-friction:** name + email + description required, phone and photos optional. Three required fields is an acceptable barrier.
- **Trust signals near conversion forms:** rating (4.5★/51 reviews), testimonials, "1 business day response" commitment, and "Secure form" label are all present. This is well executed.

### What is failing

**No phone number on `/quote`.** A significant portion of local repair customers — particularly those 40+ or those anxious about heirloom pieces — will not fill out a form. They want to call. The `/quote` page has no visible phone number. Adding `(281) 991-6500` with a "Prefer to call?" label directly above or below the form submit button would capture these leads without changing the form itself.

**Booking form date/time UX is two-step.** The `/book` page uses a separate date selector and a separate time selector. An integrated date-and-time picker (single calendar interaction) reduces the cognitive load and abandonment rate on mobile. This is not blocking conversion but it is meaningfully adding friction.

**Saturday booking cutoff (3pm) does not match store hours (4pm).** Customers who book a 3:30pm Saturday appointment expecting to be seen will be refused if they try to use the online form. The booking form UI explicitly says "Saturday 10:00 AM–3:00 PM" but `constants.ts` stores Saturday as closing at 4pm. This should either be resolved by aligning the booking cutoff with store hours, or by explicitly labeling it "last appointment time" in the booking form copy.

**No post-submission confirmation page.** Both quote and booking flows send a form submission with no evidence in the page content of a dedicated success page. A confirmation page with "Here's what happens next" copy, the phone number, and a link to the service detail page retains users in the funnel and reduces follow-up uncertainty.

**`/contact` map is a link, not an embed.** Walk-in customers need visual confirmation before committing the drive. An embedded static map or iframe at the top of the contact card reduces the "did I get the right address?" hesitation on mobile.

---

## Technical Findings

### Critical

- **Sunday hours structured data bug** — `src/components/local-business-schema.tsx:53–58`. The `match` regex `/(.*)–(.*)/` fails for "Closed" entries, causing the fallback to emit `opens: "10:00"` / `closes: "18:00"` for Sunday on every page. Fix: add `if (hoursStr === "Closed") return null;` before the regex and filter nulls from the output array, or follow schema.org guidance of omitting Sunday from the spec entirely.

### High priority

- **`sameAs: []` empty** — `src/components/local-business-schema.tsx:61–63`. Add at minimum the Google Business Profile URL, Yelp listing URL, and Facebook page URL.

### Medium priority

- **Sitemap lacks `<lastmod>`** — relevant for crawl efficiency as blog content grows. Worth adding when the sitemap generation script is next touched.
- **Privacy and Terms are indexable** — technically fine; neither page wastes significant crawl budget.

### Low priority

- **`<details>/<summary>` mobile menu** — known inconsistent screen-reader behavior in certain older Android browsers. Low user-impact risk given the audience demographic.

---

## Quick Wins

### 7-Day

1. **Fix Sunday hours schema bug.** One code change, one deploy. Eliminates a live structured data conflict with GBP. (`src/components/local-business-schema.tsx:53–58`) — **must fix**
2. **Add `sameAs` entity links.** Collect GBP URL, Yelp URL, and Facebook URL. Add to `local-business-schema.tsx`. No rebuild needed beyond a config edit. — **must fix**
3. **Fix Saturday booking cutoff.** Align booking form Saturday hours with store hours in `booking-date-time-fields.tsx:305`. — **must fix**
4. **Add phone number to `/quote`.** One line of JSX addition near the form submit button. — **high leverage**
5. **Fix `/services` H1.** Change "A curated menu of in-house repairs." to include "Pasadena" and at least one service keyword. — **high leverage**

### 30-Day

1. **Expand all 14 blog articles to 1,200+ words** with structured H2s, in-body FAQ blocks (3–5 Q&A each), and city + service specifics. Prioritize: ring-sizing, watch-battery-replacement, stone-security-checklist. — **must fix**
2. **Add `FAQPage` JSON-LD to each expanded blog article.** Directly increases AEO extraction probability. — **high leverage**
3. **Launch a review request campaign.** Post-repair email with a direct Google review link. Target 50+ new reviews over 30 days. This is the highest-ROI growth action on this list. — **high leverage**
4. **Create two geo-expansion pages:** `/services/deer-park` and `/services/la-porte` — standard service list format with local NAP and area-specific copy. — **high leverage**
5. **Embed a static map on `/contact`.** Replace the link with a visible map image or iframe. — **worth testing**

### 90-Day

1. **Build 3 topical cluster hubs:** "Ring Care", "Watch Service", "Heirloom & Custom" — each as a hub page linking to 4–6 dedicated articles. Creates crawlable topical authority clusters. — **high leverage**
2. **Add a named author bio page** (e.g., the founder or lead jeweler) and wire it as `author` in all `Article` schema. Improves E-E-A-T and AI citation confidence. — **worth testing**
3. **Implement a post-submission confirmation page** for both `/quote` and `/book` flows, with "what happens next" copy, phone number, and related service links. — **worth testing**
4. **Add `<lastmod>` to sitemap generation.** Improves crawl frequency signals as blog content grows. — **safe to defer**
5. **Collect and activate social media API tokens for SJR Content Nexus** (already in backlog). Consistent social activity feeds `sameAs` authority and review prompts. — **safe to defer**

---

## Strategic Verdict

### What is the one biggest thing limiting growth right now?

**Blog content depth.** The site has a structurally correct content strategy (local Q&A posts, service-category clusters, correct schema) but every article is too short to rank. No page in the blog directory can beat a 1,500-word competitor article for "watch battery replacement Pasadena TX" or "ring sizing guide Houston area" if the current articles max out at 900 words. This is not a strategy failure — it is an execution gap. Expanding to 1,200–1,800 words per article with in-body FAQ is the single highest-leverage growth action available.

### What is the one biggest thing limiting conversion intent right now?

**Missing phone number on the `/quote` page.** The quote page is the primary conversion destination for users with commercial repair intent. A meaningful segment of local customers — especially for high-anxiety services like heirloom or vintage repair — will not submit a form as their first contact. They want to hear a human voice. The page shows no phone number. Adding one line of markup recovers these callers with zero architectural change.

### What is the one biggest thing limiting AI answerability or recommendation likelihood right now?

**`sameAs: []` is empty.** AI systems (Google SGE, ChatGPT, Perplexity) build recommendation confidence by connecting a business entity to signals across multiple authoritative sources. An empty `sameAs` means the site is a single-source entity — all confidence is self-reported. Adding GBP, Yelp, and Facebook URLs to `sameAs` allows AI systems to triangulate the entity against external review platforms, which is how "best jewelry repair in Pasadena" answers get resolved. This is a 15-minute code change that materially increases AI recommendation likelihood.

---

## Highest-Leverage Moves

| Rank | Move | Label | Estimated Impact |
| --- | --- | --- | --- |
| 1 | Fix `sameAs` array: add GBP, Yelp, Facebook URLs to `LocalBusiness` schema | **must fix** | Increases entity confidence for AI recommendation; feeds Knowledge Graph connections |
| 2 | Fix Sunday hours structured data bug: emit null for closed days | **must fix** | Resolves active GBP mismatch; eliminates trust signal conflict; requires one code change |
| 3 | Expand all 14 blog articles to 1,200+ words with in-body FAQ blocks + `FAQPage` schema | **high leverage** | The entire growth surface of the blog is currently below competitive ranking threshold |
| 4 | Launch a structured post-repair review request campaign targeting 50+ new Google reviews | **high leverage** | Review volume is the fastest map pack and AI recommendation lever that does not require a deploy |
| 5 | Create `/services/deer-park` and `/services/la-porte` geo-expansion pages | **high leverage** | Zero-competition, direct-intent queries; the business already lists these service areas but captures none of the search traffic |

---

## Done

- Technical SEO foundation: robots.txt, sitemap, canonical redirect, meta tags, Lighthouse SEO=100
- Structured data: `JewelryStore`, `FAQPage`, `Article`, `BreadcrumbList`, `AggregateRating`, `Service` schemas deployed
- Dual CTA pattern (Get Fast Quote + Book Repair) on all pages
- Trust signal density: rating, testimonials, "Est. 1984", "in-house" guarantee throughout
- Click-to-call `tel:` markup on contact page
- NAP consistency across all pages
- Blog with 14 articles and topic filter taxonomy
- Service detail pages with pricing tiers (starting-at ranges) and FAQ sections
- Mobile sticky conversion bar on `/services`
- All 12 routes confirmed passing in production closeout verification (12/12)

---

## Not Done

- `sameAs` entity links in `LocalBusiness` schema
- Sunday hours structured data bug (business outputs as open)
- Saturday booking cutoff alignment with store hours
- Phone number on `/quote` page
- Blog articles at competitive word count (1,200+)
- In-body FAQ blocks in blog articles
- Geo-expansion landing pages (Deer Park, La Porte)
- Post-submission confirmation pages for quote and book flows
- Named author bio with wired `Article` schema authorship
- Google Maps embed on `/contact` (link only, no visual map)
- `<lastmod>` in sitemap
- Review volume campaign (51 reviews; target: 150+)
- Social media API activation for Content Nexus

---

## Risks

- **Sunday hours bug actively conflicts with GBP.** If the GBP listing correctly shows Sunday as closed and the site schema says open, Google may flag the discrepancy and suppress the local Knowledge Panel. Fix this before any GBP optimization campaign.
- **Review requests must be done carefully.** Soliciting reviews in exchange for discounts or incentives violates Google's guidelines. The review request should be a simple ask with a direct link, sent only after a completed service.
- **Geo-expansion pages must be substantive.** Thin location pages ("We serve Deer Park!") with no real content can be treated as doorway pages. Each geo page needs at minimum 400 words of genuinely useful local content plus full NAP.
- **`sameAs` URLs must be verified and live before adding to schema.** Adding a broken or incorrect Yelp URL creates a worse signal than no `sameAs` at all.
- **Do not reopen `/services` perf micro-iterations** per `RELEASE-DECISION.md`. The deferred LCP debt (~2750ms vs. 2500ms target) is real but within a tolerable range for a business site. A new sprint would need a structurally different hypothesis.
