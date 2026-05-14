# Indexing Diagnosis

Date: 2026-04-21

## Scope

This note checks whether the current indexing problem is caused by a hard technical block on production, or by lower-priority crawl and quality signals.

Inputs used for this diagnosis:

- User-provided Google Search Console summary dated 2026-04-16
- Repo export at `Docs/https___www.susiesjewelryrepair.com_-Coverage-Validation-2026-03-13/Table.csv`
- Repo metadata at `Docs/https___www.susiesjewelryrepair.com_-Coverage-Validation-2026-03-13/Metadata.csv`
- Local implementation in `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/blog/[slug]/page.tsx`, and `src/components/service-area-page.tsx`
- Live production fetches against `https://www.susiesjewelryrepair.com` on 2026-04-21
- Canonical URL manifest generated from repo sources at `Docs/INDEXING_MANIFEST.md` and `Docs/INDEXING_MANIFEST.json`

## Conclusion

The current evidence does not support a `robots.txt`, `noindex`, missing sitemap, or JavaScript-rendering failure on production.

The stronger diagnosis is:

- the affected URLs are technically crawlable
- Google has discovered them
- Google still is not prioritizing them for crawl and indexing

That means the problem is more likely a crawl-demand / index-quality issue than a hard technical exclusion.

## What Was Ruled Out

| Check | Result | Evidence |
| --- | --- | --- |
| `robots.txt` block | Not present | Production `robots.txt` allows `/`, disallows only `/admin/`, and points to `/sitemap.xml` |
| `meta robots noindex` | Not present on sampled affected pages | No `meta name="robots"` with `noindex` found on sampled blog/service URLs |
| `X-Robots-Tag` exclusion | Not present on sampled affected pages | Sampled responses returned no `X-Robots-Tag` header |
| Missing canonical | Not present | Sampled affected pages return self-referencing canonical tags |
| Missing sitemap entries | Not present for sampled URLs | Sampled affected URLs are present in production `/sitemap.xml` |
| Client-side-only content | Not supported | Sampled blog and service-area copy is present in initial HTML returned to a non-browser fetch |
| Basic HTTP failure | Not present | Sampled affected URLs return `200` |

## Evidence Summary

### 1. Production pages are live and indexable in principle

Sampled production URLs checked on 2026-04-21:

- `/blog/how-much-does-pearl-restringing-cost-pasadena`
- `/services/pasadena`
- `/services/pearl-restringing`

For all three sampled URLs:

- HTTP status was `200`
- canonical tag matched the page URL
- no `noindex` meta tag was present
- no `X-Robots-Tag` header was present
- meaningful page content was present in the initial HTML response

This rules out the most obvious "Google cannot crawl this page" explanations.

### 2. Sitemap coverage exists

Production `/sitemap.xml` currently contains `41` `<loc>` entries.

Sampled affected URLs are present in the sitemap, including:

- `/blog/how-much-does-pearl-restringing-cost-pasadena`
- `/services/pasadena`
- `/services/webster`
- `/services/clear-lake`
- `/services/friendswood`
- `/services/la-porte`
- `/services/pearl-restringing`

This means the URLs are already being submitted as first-class crawl candidates.

### 3. Internal links exist, but crawl demand still looks weak

Rendered internal linking checks on 2026-04-21 show:

- `/services/pasadena`, `/services/webster`, and `/services/friendswood` are linked from both the homepage and `/services`
- sampled blog detail URLs are linked from the blog hub
- the blog hub rendered `16` blog detail links in sampled HTML
- the services hub rendered `12` service-area links and `31` service links in sampled HTML

This means the pages are not orphaned.

However, the crawl pattern still looks weak:

- the repo GSC export from 2026-03-13 shows `Discovered - currently not indexed`
- those exported URLs have `1969-12-31` as "Last crawled", which is effectively a "not yet crawled" placeholder
- the user-provided 2026-04-16 summary says the issue was still active weeks later

That persistence matters. If a URL is in the sitemap, linked internally, returns `200`, and still is not crawled, the failure mode is usually not a tag-level block. It is usually low crawl priority or low expected index value.

### 4. Search visibility sampling is still weak

External search sampling on 2026-04-21 showed:

- the homepage appears for `site:` style search checks
- representative detail pages did not surface in exact-URL or exact-title sampling

That is consistent with the current diagnosis: discovery exists, but indexing remains shallow.

### 5. Sitemap freshness signals are weaker than they should be

Production `/sitemap.xml` currently has:

- `41` `<loc>` entries
- `0` `<lastmod>` entries

This does not block indexing by itself, but it is a real weakness. On a site trying to get new blog and geo pages crawled, omitting `<lastmod>` removes a useful freshness hint for Googlebot.

## Most Likely Root Causes

### 1. Crawl prioritization is low

This is the primary diagnosis.

Google already knows the URLs exist. The pages are still not getting crawl budget or indexing priority. That usually happens when Google expects limited value from crawling more URLs on the host right now.

Common reasons:

- low overall site authority / low external demand
- too many new URLs relative to current trust
- site-wide signals suggest only a small subset of pages are worth indexing

### 2. Some page sets are probably being evaluated as templated or overlapping

The service-area pages are internally linked and technically healthy, but they are also clearly programmatic local pages built from a shared structure.

That does not make them bad, but it does mean Google may treat them cautiously unless the city-specific differentiation is strong enough:

- unique proof
- unique local demand signals
- unique FAQs and examples
- unique reasons to rank independently instead of collapsing into one broader local page

The same risk applies to portions of the blog set if the articles are commercially useful but still close in structure, intent, or language.

### 3. Freshness and recrawl signals are not as strong as they could be

The sitemap currently omits `<lastmod>`.

Again, that is not the main blocker, but it weakens the "these pages changed and deserve a crawl" signal.

### 4. Repo-to-production drift exists and should be cleaned up

The local repo still contains stale "AI Studio" strings in some metadata and header/footer files, while sampled production HTML no longer exposes those strings.

That is not the confirmed cause of the live indexing issue, but it is a process risk:

- the repo is not a perfect mirror of production
- future SEO work could reintroduce stale branding or metadata if that drift is not reconciled

## What The Evidence Does Not Support

The current evidence does not support these as the main blocker:

- removing `noindex` tags
- changing `robots.txt`
- adding missing sitemap entries for the sampled URLs
- solving a JavaScript rendering failure

Those are the first things to check, but they are not where the current production evidence points.

## Recommended Next Actions

Use the canonical manifest as the URL source of truth for any future GSC work:

- `Docs/INDEXING_MANIFEST.md`
- `Docs/INDEXING_MANIFEST.json`
- Regenerate with `npm run google:indexing-manifest` after sitemap or route changes

### Immediate

1. Use Google Search Console URL Inspection on 5 representative URLs:
   - 2 blog posts
   - 2 service-area pages
   - `/services/pearl-restringing`
2. Run live URL tests in GSC for those pages and request indexing after the live test passes.
3. Resubmit the production sitemap after any crawl-signal changes.

### Near-Term Technical Fixes

1. Add `<lastmod>` to `src/app/sitemap.ts`.
2. Verify that priority blog posts are linked from stronger pages, not only from the blog hub.
3. Reconcile repo-to-production metadata drift before shipping more SEO changes.

### Page Quality / Crawl-Demand Improvements

1. Strengthen the service-area pages with more city-specific differentiation:
   - city-specific examples
   - city-specific proof or reviews
   - city-specific FAQ details
   - clearer reason each page should rank independently
2. Prioritize a smaller set of highest-intent blog posts for internal-link promotion instead of expanding the blog set further.
3. Pause CTR testing on pages that are not consistently indexed.

## Decision

The correct next move is not "remove a blocking tag."

The correct next move is:

1. confirm the live inspection result in GSC
2. improve crawl-priority signals
3. improve the strongest candidate pages first
4. only return to CTR testing after index coverage stabilizes

## Suggested Follow-Up Implementation Batch

If we want to move directly from diagnosis into remediation, the clean first batch is:

1. add `<lastmod>` support to the sitemap
2. strengthen internal links into the top 3 to 5 commercial blog posts
3. review the geo pages for uniqueness gaps
4. sync local SEO metadata files with what is actually live in production

## Batch 6 Remediation Status

Implemented in repo on 2026-04-21:

1. Added `lastModified` timestamps in `src/app/sitemap.ts` for static, service, geo, and blog URLs.
2. Added a homepage section that links directly into the top commercial-intent blog posts.
3. Added stronger service-page-to-blog links using the primary helpful guide on service detail pages.
4. Added stronger blog-to-blog internal links between commercial pricing and diagnosis guides.
5. Tightened geo-page uniqueness by making the service sidebar city-specific instead of using the same generic highlight set for every area page.

## Production Deploy Verification

Production deploy completed on 2026-04-21.

- Vercel deployment id: `dpl_7EArHQ77emngW29B7jW6P2K4ayPt`
- Vercel production URL: `https://sjr-new-website-aiproject-797nrckcf.vercel.app`
- Custom domain alias confirmed live: `https://susiesjewelryrepair.com`

### Live Production Checks

| URL | Expected change | Result | Evidence |
| --- | --- | --- | --- |
| `/sitemap.xml` | `<lastmod>` on static, service, geo, and blog URLs | Confirmed | Production sitemap now returns `<lastmod>` entries, including `2026-04-21T17:00:00.000Z` on homepage and service-area URLs |
| `/` | Homepage commercial-intent internal links | Confirmed | Production HTML contains `Pricing and repair guides` and `Start with the questions customers ask before they book` |
| `/services/pasadena` | City-specific sidebar copy | Confirmed | Production HTML contains `Popular with Pasadena customers` and city-specific supporting copy |
| `/services/watch-repair` | Primary helpful-guide callout | Confirmed | Production HTML contains `Before you book` with a direct link to the watch battery guide |
| `/blog/cost-to-resize-gold-ring-pasadena` | Commercial guide cross-links | Confirmed | Production HTML contains `Pricing and diagnosis guides` with cross-links to other commercial guides |

## Post-Remediation GSC Check (2026-04-21)

Status: completed in Google Search Console against the live property `https://www.susiesjewelryrepair.com/`.

The production sitemap was manually resubmitted in GSC on 2026-04-21. GSC returned `Sitemap submitted successfully`.

### URLs To Inspect

1. `https://www.susiesjewelryrepair.com/`
2. `https://www.susiesjewelryrepair.com/blog/cost-to-resize-gold-ring-pasadena`
3. `https://www.susiesjewelryrepair.com/services/pasadena`
4. `https://www.susiesjewelryrepair.com/services/watch-repair`

### What To Record In GSC

| URL | Status | Last Crawl | Lastmod Detected | Notes |
| --- | --- | --- | --- | --- |
| `/` | `URL is on Google` | Not surfaced in visible inspection UI | Not surfaced in visible inspection UI | `Page is indexed`; valid rich-result items shown for FAQ and review snippets; screenshot: `Docs/gsc-homepage-inspection.png` |
| `/blog/cost-to-resize-gold-ring-pasadena` | `URL is on Google` | Not surfaced in visible inspection UI | Not surfaced in visible inspection UI | Real commercial blog URL is indexed; screenshot: `Docs/gsc-blog-cost-to-resize-inspection.png` |
| `/services/pasadena` | `Page is not indexed: Discovered - currently not indexed` | `N/A` | Not surfaced in visible inspection UI | GSC shows sitemap source and homepage as referring page; screenshot: `Docs/gsc-services-pasadena-inspection.png` |
| `/services/watch-repair` | `URL is on Google` | Not surfaced in visible inspection UI | Not surfaced in visible inspection UI | `Page is indexed`; valid rich-result items shown for breadcrumbs, FAQ, and review snippets; screenshot: `Docs/gsc-services-watch-repair-inspection.png` |

### Indexing Requests

- Sitemap resubmitted successfully in GSC on 2026-04-21.
- Indexing requests were submitted from the inspection flow for the four representative URLs above.
- Continue submitting the remaining affected blog, geo, and service URLs in batches.
- Suggested next indexing review date: 2026-04-26.

### Full Canonical Submission Batch (2026-04-21)

After the initial sample checks, the remaining canonical URLs from `Docs/INDEXING_MANIFEST.md` were inspected in GSC and submitted for indexing from the URL Inspection flow.

Current post-submission snapshot from the full canonical set:

- `25` URLs currently show as indexed
- `12` URLs currently show as `Discovered - currently not indexed`
- `4` URLs currently show as `URL is unknown to Google`
- `0` canonical URLs remain in a `pending first inspection` state

This is the correct baseline for the April 26-27 checkpoint. These statuses can drift slightly between inspections even on the same day, so the trend matters more than any one individual label.

### Expanded Geo And Service Sample

Additional GSC inspections run on 2026-04-21 against URLs that were part of the original affected set:

| URL | Status | Last Crawl | Notes |
| --- | --- | --- | --- |
| `/services/la-porte` | `Page is not indexed: Discovered - currently not indexed` | `N/A` | GSC shows sitemap source and a referring page under `/blog` |
| `/services/webster` | `Page is not indexed: URL is unknown to Google` | `N/A` | GSC reports no referring sitemap detected and no referring page detected |
| `/services/friendswood` | `Page is not indexed: Discovered - currently not indexed` | `N/A` | GSC shows sitemap source and a referring page under `/blog` |
| `/services/clear-lake` | `Page is not indexed: Discovered - currently not indexed` | `N/A` | GSC shows sitemap source and a referring page under `/blog` |
| `/services/pearl-restringing` | `Page is not indexed: URL is unknown to Google` | `N/A` | GSC reports no referring sitemap detected and no referring page detected |

### Expanded Blog Sample

Additional GSC inspections run on 2026-04-21 against real commercial blog URLs:

| URL | Status | Last Crawl | Notes |
| --- | --- | --- | --- |
| `/blog/cost-to-resize-gold-ring-pasadena` | `URL is on Google` | Not surfaced in visible inspection UI | This is the strongest confirmed indexed commercial blog sample |
| `/blog/how-much-does-pearl-restringing-cost-pasadena` | `Page is not indexed: URL is unknown to Google` | `N/A` | GSC reports no referring sitemap detected and no referring page detected |
| `/blog/does-my-watch-need-battery-or-repair-pasadena` | `Page is not indexed: Discovered - currently not indexed` | `N/A` | GSC shows sitemap source and a referring page under `/blog?topic=Diagnostics` |

### Notes

- The earlier 404 concern was caused by checking a nonexistent slug, `/blog/how-much-does-jewelry-repair-cost-pasadena`, not by a production blog-routing failure.
- Real blog URLs are live and return `200`, but GSC status is mixed across the commercial blog set. The confirmed indexed sample is `/blog/cost-to-resize-gold-ring-pasadena`.
- The remaining verified indexing gap is broader than one page. Pasadena, La Porte, Friendswood, and Clear Lake still show `Discovered - currently not indexed`.
- Webster and `/services/pearl-restringing` are in a slightly earlier state: GSC currently reports them as `URL is unknown to Google`.
- Live production verification on 2026-04-21 still shows `/services/webster`, `/services/pearl-restringing`, `/services/la-porte`, `/services/friendswood`, and `/services/clear-lake` in `/sitemap.xml`, and all five return `200`. That means the `URL is unknown to Google` state is currently a GSC processing state, not a live `404` or sitemap omission.
- Live production verification on 2026-04-21 also shows `/blog/cost-to-resize-gold-ring-pasadena`, `/blog/how-much-does-pearl-restringing-cost-pasadena`, and `/blog/does-my-watch-need-battery-or-repair-pasadena` in `/sitemap.xml`, and all three return `200`.

## Live GSC Re-Inspection (2026-05-04)

Authenticated URL Inspection was rerun on 2026-05-04 for the remaining unresolved queue.

### Confirmed Upgrades Since The April 21 Baseline

- `/blog/how-much-does-pearl-restringing-cost-pasadena` moved to `URL is on Google`
- `/blog/pearl-restringing-timing-guide` moved from `URL is unknown to Google` to `Discovered - currently not indexed`
- `/blog/stone-security-checklist` moved from `URL is unknown to Google` to `Discovered - currently not indexed`

### Still Stuck In `Discovered - currently not indexed`

- `/services/pearl-restringing`
- `/services/clear-lake`
- `/services/la-porte`
- `/blog/chain-repair-weak-points`
- `/blog/does-my-watch-need-battery-or-repair-pasadena`
- `/blog/heirloom-restoration-planning-guide`
- `/blog/how-to-choose-a-jeweler`
- `/blog/professional-cleaning-vs-home-care`
- `/blog/safe-to-clean-vintage-diamond-ring-at-home`
- `/blog/where-to-get-watch-battery-replaced-pasadena`

### Still In `URL is unknown to Google`

- `/services/pasadena`
- `/services/friendswood`
- `/services/webster`

### Interpretation

The indexing pattern is improving, but it is not broad enough yet to call the local service-area cluster healthy. The clearest positive signal is that one previously unresolved commercial blog page is now indexed, and two more blog pages improved from `unknown` to `discovered`.

The immediate next action should be weighting, not pruning:

1. Add more internal-link weight into the still-stuck service-area and commercial blog pages from already-indexed pages.
2. Recheck the unresolved queue on the next monitoring pass before consolidating URLs.
3. Only move to pruning if the same pages remain stalled after another weighted crawl window.

## URL Inspection API Recheck (2026-05-08)

Authenticated URL Inspection API checks were added and run against the 15 unresolved URLs from `Docs/INDEXING_MANIFEST.json`.

### Status Summary

- `15` unresolved URLs now report `Discovered - currently not indexed`.
- `0` unresolved URLs report `URL is unknown to Google`.
- This is progress from the May 4 manifest because `/services/friendswood`, `/services/pasadena`, and `/services/webster` moved from `URL is unknown to Google` to `Discovered - currently not indexed`.
- Live sanity checks on prior unknown URLs confirmed `200` responses, sitemap inclusion, self-canonical tags, and no robots noindex tags.

### Current Interpretation

The unresolved queue is no longer a discovery problem. Google has discovered every unresolved URL, but has not selected those 15 pages for indexing yet. The next move is still weighting and quality improvement, not pruning.

### Automation Added

Run this command for future URL Inspection API checkpoints:

```bash
npm run google:indexing-status
```

It writes:

- `.health/indexing-status-latest.json`
- `.health/indexing-status-latest.md`

## Weighting Pass 2 (2026-05-11)

The unresolved queue remained fully discovered but not indexed on the 2026-05-10 checkpoint, so the next remediation step was additional internal-link weighting rather than pruning.

Implemented on 2026-05-11:

1. Replaced the mobile floating dual CTA with one compact `Book a Repair Today` action to reduce small-screen friction while preserving the primary conversion path.
2. Added a homepage `Local repair paths` section linking directly to unresolved service-area and commercial repair pages.
3. Added a shared `PRIORITY_REPAIR_PATHS` source of truth for the highest-priority unresolved URLs.
4. Added a user-facing `Repair planning` block on `/services` so the indexed services hub reinforces priority stuck pages directly.
5. Added a restrained footer `Repair Guides` link set so selected commercial guides receive repeated sitewide crawl paths without overloading the navigation.

Current interpretation:

- The queue is still an index-selection problem, not a discovery problem.
- The next checkpoint should measure whether the newly weighted URLs start moving from `Discovered - currently not indexed` into the indexed set.
- If the same commercial and service-area URLs remain stalled after another crawl window, the next decision should shift from more linking to selective consolidation or deeper content differentiation.

### Next Checkpoint Decision Rule

At the next indexing checkpoint, use `npm run google:indexing-status` together with the weekly SEO reports.

Treat the May 11 weighting pass as successful only if at least one of these is true:

1. one or more weighted URLs move from `Discovered - currently not indexed` to indexed
2. the unresolved queue shrinks below `15`
3. referring-url counts improve on the weighted pages, followed by movement toward indexing

If none of those conditions occur after the next crawl window:

1. stop adding more generic internal links
2. compare the stuck URLs against indexed peers for uniqueness, intent overlap, and page-level proof
3. decide page by page whether to deepen content, consolidate overlap, or leave the URL in place with a stronger business case

### Goal Completion Audit Status

The traffic-and-conversion goal is not complete as of 2026-05-11.

Evidence already satisfied:

- mobile CTA friction reduced from two floating actions to one compact booking action
- additional internal-link weighting shipped from the homepage, services hub, and footer
- production build, smoke tests, and post-deploy performance gates passed

Evidence still required before the goal can be called achieved:

- post-weighting indexing improvement on the unresolved queue
- post-weighting organic visibility improvement on the affected pages or queries
- post-weighting conversion evidence showing the mobile CTA change helps or at least does not regress lead behavior

## Service-Area Differentiation Pass (2026-05-11)

Because the May 8 and May 10 URL Inspection API checks showed every unresolved service-area URL as discovered but not indexed, the next quality pass targeted page differentiation instead of adding more generic links.

Implemented on 2026-05-11:

1. Added `localScenarios` to each service-area page in `src/lib/service-areas.ts`.
2. Rendered a new `Best starting points for {city}` section on service-area pages.
3. Made each city page expose three unique decision scenarios tied to that area’s likely repair intent, such as Pasadena in-town repair stops, Webster workday watch issues, Friendswood heirloom decisions, and La Porte battery-plus-seal concerns.
4. Added smoke coverage confirming the Pasadena service-area page renders the new city-specific scenario section.

Purpose:

- increase independent page value for the geo URLs still stuck in `Discovered - currently not indexed`
- reduce the risk that Google treats the service-area set as structurally interchangeable
- keep the content user-facing and conversion-relevant instead of adding hidden or purely mechanical SEO text

## Commercial Blog Decision-Signal Pass (2026-05-11)

The remaining stalled blog queue includes several commercial-intent or diagnosis-oriented guides. The template already had Article schema, FAQ schema, related services, commercial cross-links, and quote/book CTAs, so the next quality pass targeted information gain inside the article body rather than more navigation links.

Implemented on 2026-05-11:

1. Added optional `decisionSignals` to blog posts in `src/lib/blog.ts`.
2. Rendered a visible `Repair decision guide` section on blog detail pages when signals are present.
3. Added decision-signal blocks to the priority stalled guides for chain repair weak points, heirloom restoration planning, same-day watch battery replacement, and battery-versus-repair diagnosis.
4. Added smoke coverage confirming the commercial watch diagnosis guide exposes the decision-signal section.

Purpose:

- make the stalled commercial guides less generic by answering symptom-level decisions directly
- improve AEO/GEO usefulness with concise signal → meaning → next-action guidance
- keep the added content tied to actual repair decision paths and conversion intent

## Mobile CTA Measurement Gate (2026-05-11)

The compact mobile sticky CTA already emitted `mobile_sticky_cta_click`, but the verification suite only checked that the button rendered. Measurement coverage was tightened so future conversion analysis can distinguish whether the one-button mobile CTA is helping.

Implemented on 2026-05-11:

1. Updated the mobile sticky CTA smoke test to assert the `mobile_sticky_cta_click` event fires with `page_path`, `destination`, `placement`, and `cta_target`.
2. Added `mobile_sticky_cta_click` to the production GA4 event validator in `scripts/google/validate-prod-events.mjs`.
3. Ran `npm run google:validate-prod-events` against production. The validator passed for `mobile_sticky_cta_click` and wrote `.health/ga4-prod-event-validation-2026-05-11T21-59-25Z.md`.

Result:

- the live site now has verified event evidence for the compact mobile quote CTA
- future GA4 reviews can compare `mobile_sticky_cta_click` volume against `booking_form_start`, `booking_submit_success`, and organic landing pages

## Mobile CTA Attribution Continuity (2026-05-11)

After verifying the click event, the remaining measurement gap was attribution continuity from sticky CTA click to booking form start or submission.

Implemented on 2026-05-11:

1. Updated the compact mobile sticky CTA destination to include UTM context:
   `/book?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=booking_shortcut`
2. Extended the mobile sticky CTA smoke test to verify the destination URL and booking form hidden attribution fields.
3. Confirmed `attribution_utm_source`, `attribution_utm_medium`, `attribution_utm_campaign`, and `attribution_submit_path` are populated on the booking form after the sticky CTA click.

Result:

- future booking form starts and submissions can be attributed back to the compact mobile sticky CTA through both GA click events and submitted attribution fields

## Weekly Health Mobile CTA Reporting (2026-05-11)

The weekly SEO health report now includes `mobile_sticky_cta_click` in its GA4 key-event snapshot.

Implemented on 2026-05-11:

1. Added `mobile_sticky_cta_click` to `scripts/google/weekly-seo-health.mjs`.
2. Added a `Mobile sticky CTA clicks` row to the weekly Core KPIs table.
3. Added `mobile_sticky_cta_click` to the weekly Conversion Detail table.
4. Verified with `npm run google:weekly-seo-health`.

Latest generated baseline:

- Date range: 2026-05-04 to 2026-05-10
- Google Search clicks: `9`
- Google Search impressions: `1,261`
- Production-host organic sessions: `7`
- Quote + booking starts: `2`
- Mobile sticky CTA clicks: `0`
- Quote + booking outcomes: `2`

Interpretation:

- The compact mobile sticky CTA shipped near the end of this reporting window, so `0` clicks is not yet a regression signal.
- The next weekly window is the first meaningful read on whether the one-button CTA creates booking intent.

## Mobile CTA Funnel Reporting (2026-05-11)

The weekly health report now separates booking intent that arrives through the compact mobile sticky CTA UTM path.

Implemented on 2026-05-11:

1. Added a `Mobile Sticky CTA Funnel` section to `scripts/google/weekly-seo-health.mjs`.
2. Queried GA4 for `booking_form_start`, `booking_submit_success`, and `booking_submit_pending` events where the booking page URL contains `utm_source=mobile_sticky_cta`.
3. Preserved `mobile_sticky_cta_click` as the top-of-funnel click count because that event fires before navigation to `/book`.
4. Added a fallback from `pagePathPlusQueryString` to `pageLocation` in case GA4 dimension support changes.

Latest generated baseline:

- Date range: 2026-05-04 to 2026-05-10
- Mobile sticky CTA clicks: `0`
- Booking starts on sticky CTA UTM path: `0`
- Booking success submissions on sticky CTA UTM path: `0`
- Booking pending submissions on sticky CTA UTM path: `0`
- Booking path filter dimension: `pagePathPlusQueryString`

Interpretation:

- The reporting path is now in place before the first full post-change measurement window.
- The next meaningful read is the week ending 2026-05-17, when sticky CTA clicks can be compared against attributed booking starts and submissions.

## Mobile CTA Quote Funnel Reporting Alignment (2026-05-12)

The mobile sticky CTA was simplified to one quote-focused action, so the weekly report now measures the quote path instead of treating the shortcut as booking-only.

Implemented on 2026-05-12:

1. Updated the sticky CTA region label from `Mobile booking shortcut` to `Mobile quote shortcut`.
2. Updated `scripts/google/weekly-seo-health.mjs` to include `quote_form_start` and `quote_submit_success` on the sticky CTA UTM path.
3. Renamed the weekly report copy from booking-path language to generic sticky CTA path language.
4. Updated the smoke test to assert the quote-focused mobile shortcut.
5. Delayed the sticky CTA until after initial scroll so it does not compete with the hero quote button.

Result:

- future checkpoints will measure whether the single mobile CTA creates quote starts and quote submissions
- booking events remain in the report for continuity, but the primary path now matches the live mobile UX
- the sticky CTA now supports mid-scroll conversion recovery instead of adding clutter above the fold

## Mobile Sticky CTA Form-Anchor Friction Reduction (2026-05-12)

After the sticky CTA was aligned to the lower-friction quote path, the remaining click-to-form friction was that mobile users landed at the top of `/quote` and still had to scroll to the form.

Implemented on 2026-05-12:

1. Updated the sticky CTA destination to `/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut#quote-form`.
2. Kept UTM attribution unchanged so GA4 and submitted lead fields still preserve `mobile_sticky_cta`, `site_cta`, and `quote_shortcut`.
3. Updated smoke coverage to verify the destination hash, the tracking destination payload, and that `#quote-form` is in viewport after click.

Interpretation:

- mobile sticky CTA clicks now land directly on the quote form instead of creating another scroll step
- analytics continuity remains intact because the query string is unchanged

## Mobile Homepage Service Flow Compression (2026-05-12)

The mobile homepage service grid had become the main clutter risk: a viewport audit showed the services section consuming roughly `4,783px` before users could reach local paths, process, guides, and downstream proof.

Implemented on 2026-05-12:

1. Kept the first four priority services as visible mobile cards.
2. Converted the remaining mobile services into compact, tap-friendly links under `More repair services`.
3. Preserved the full image-card grid on tablet/desktop.
4. Added smoke coverage requiring the mobile services section to stay below `1,900px`.

Result:

- mobile users reach the next decision sections faster
- service links remain available for users and internal crawl paths
- the homepage keeps one clear bottom sticky quote action without adding competing mobile CTAs

## Homepage Quick-Win Query Alignment (2026-05-12)

The latest `npm run google:seo-quick-wins` report shows the homepage remains the only aggregate quick-win page: `19` qualifying queries, `566` impressions, and rankings between positions `6` and `20`. The largest no-click query gaps include `jewelry store near me` and `jewelry store pasadena tx`.

Implemented on 2026-05-12:

1. Updated the homepage title to include `Jewelry Repair Shop Near Me` while staying within normal title length.
2. Updated the meta description to describe Susie's as a local jewelry repair shop in Pasadena without implying broad retail inventory.
3. Adjusted the hero support copy to reinforce the local repair-shop positioning.
4. Added a visible homepage FAQ and matching FAQ schema for `Are you a jewelry store or a repair shop?`.

Validation:

```bash
npm run lint
npm test -- --grep "mobile home flow keeps conversion path uncluttered"
npx playwright test --grep "mobile conversion: home CTA reaches quote form"
```

Interpretation:

- this targets real Search Console demand without adding another homepage section
- the change supports CTR/relevance for store-adjacent local queries while keeping the business promise focused on repair

## May 11 URL Inspection Recheck And Pearl-Service Deepening

`npm run google:indexing-status` was rerun on 2026-05-11 against the unresolved manifest queue.

Result:

- Checked URLs: `15`
- Current status: `15` still show `Discovered - currently not indexed`
- Indexed movement since May 8 manifest: `0`
- Every unresolved URL remains present in the sitemap
- Referring URL counts are still thin: most unresolved URLs show `1` referring URL; `/services/pearl-restringing` shows `2`; `/blog/heirloom-restoration-planning-guide` shows `0`

Decision:

- This triggered the documented post-weighting decision rule.
- The next action is no longer broad internal-link expansion.
- The remediation path is page-level uniqueness, proof, and intent-depth improvement on the highest-value unresolved URLs.

Implemented first because it is the only unresolved commercial service-detail URL:

1. Expanded `/services/pearl-restringing` source copy with strand-specific warning signs, clasp inspection, knot spacing, and drape language.
2. Added pearl-specific `What to expect` cards for thread condition, knotting and spacing, and clasp decisions.
3. Added pearl-specific intake guidance for loose pearls, broken thread, clasp reuse/replacement, and desired finished length.
4. Added smoke coverage confirming the pearl page renders strand-specific decision content.

Purpose:

- strengthen the page beyond generic service-template language
- make the page more independently useful than the related pearl blog posts
- give Google a clearer commercial-service reason to index `/services/pearl-restringing`

## Heirloom Planning Guide Differentiation Pass (2026-05-11)

The 2026-05-11 URL Inspection API recheck showed `/blog/heirloom-restoration-planning-guide` still stuck in `Discovered - currently not indexed` with `0` referring URLs, the weakest referring signal in the unresolved queue.

Implemented on 2026-05-11:

1. Added a bench-intake checklist section to `/blog/heirloom-restoration-planning-guide`.
2. Differentiated the planning guide from the already indexed repair-vs-redesign heirloom article by focusing on what the customer should bring, preserve, and clarify before work is approved.
3. Added targeted discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
4. Added a direct link from the indexed `/blog/heirloom-jewelry-restoration-repair-or-redesign` article to the planning guide.
5. Added smoke coverage confirming the planning guide renders the bench-intake content and the indexed peer exposes the link.

Purpose:

- reduce overlap between the two heirloom articles
- give the planning guide a distinct pre-visit/search-intent role
- address the `0` referring URL signal without adding another broad sitewide link block

## Chain Repair Weak-Point Triage Pass (2026-05-11)

The unresolved manifest still includes `/blog/chain-repair-weak-points` as `Discovered - currently not indexed`. The page has commercial intent because it connects directly to necklace repair, bracelet repair, clasp inspection, and quote/book actions.

Implemented on 2026-05-11:

1. Added an intake-triage section focused on how Susie's distinguishes jump-ring, clasp, solder-joint, pendant-connection, hollow-link, and stretched-link failures.
2. Expanded the customer action guidance around bringing the pendant, charm, or bracelet exactly as worn so the stress pattern can be assessed.
3. Added targeted discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
4. Added smoke coverage confirming the chain guide renders the triage content.

Purpose:

- make the guide more specific than a generic weak-chain overview
- reinforce commercial repair intent for necklace and bracelet service paths
- give Google clearer page-level uniqueness before the next unresolved-queue inspection

## Watch Battery Diagnostic Intake Pass (2026-05-11)

The unresolved manifest still includes `/blog/does-my-watch-need-battery-or-repair-pasadena` as `Discovered - currently not indexed`. The page is a commercial diagnostic guide that should support watch repair and quote intent, but it needs to stay clearly differentiated from the same-day battery replacement article.

Implemented on 2026-05-11:

1. Added a watch-intake section focused on the details that separate battery service from deeper repair: stop timing, water or humidity exposure, low-battery second-hand behavior, and crown/stem/date-setting symptoms.
2. Added quote-prep guidance for brand, case-back type, and crown-side photos so the page gives more actionable pre-visit value.
3. Added a direct contextual link from `/blog/where-to-get-watch-battery-replaced-pasadena` to the diagnostic article with the anchor `Decide Battery vs Repair`.
4. Updated smoke coverage for both the diagnostic content and the same-day battery article link.

Purpose:

- reduce overlap between same-day battery intent and repair-diagnosis intent
- strengthen the unresolved diagnostic article with practical intake evidence
- increase relevant internal referring weight from a closely related watch battery guide

## Webster Service-Area Differentiation Pass (2026-05-11)

The unresolved manifest still includes `/services/webster` as `Discovered - currently not indexed`. Earlier GSC work showed Webster had previously been `URL is unknown to Google`, so it remains one of the weaker geo-page candidates even after moving into discovered state.

Implemented on 2026-05-11:

1. Expanded Webster page copy with Bay Area-specific scheduling context, including Baybrook errands and the NASA/Clear Lake corridor.
2. Added more concrete intake guidance for watch and ring requests so the page is less like a generic city template.
3. Added quote-prep guidance around close/wide photos, watch brand, water or impact history, daily ring wear, and visible stone movement.
4. Refined Webster helpful-read links to include watch intake, ring resizing cost/timing, and stone-security guidance.
5. Added smoke coverage confirming the Webster page renders the Bay Area intake differentiation.

Purpose:

- increase independent page value for a stalled geo URL
- reduce thin-template risk across service-area pages
- connect Webster traffic to commercial watch, ring, and stone-security paths

## Clear Lake Service-Area Differentiation Pass (2026-05-11)

The unresolved manifest still includes `/services/clear-lake` as `Discovered - currently not indexed` with only one referring URL. After the Webster pass, Clear Lake was the next geo page with clear commercial upside and copy that could be made less template-like.

Implemented on 2026-05-11:

1. Added Clear Lake-specific scheduling context around NASA-area schedules, Bay Area Boulevard errands, school pickup, and weekend timing.
2. Expanded watch-intake guidance around water exposure, humidity, fog under the crystal, weak crowns, and seal or movement risk.
3. Expanded ring and stone guidance around clothing catches, spinning rings, flattened prongs, and daily-wear risk.
4. Updated helpful reads to include battery-vs-repair diagnosis and ring-sizing cost/timing alongside same-day battery and chain repair guides.
5. Added smoke coverage confirming the Clear Lake page renders the moisture, local-context, and helpful-read changes.

Purpose:

- increase independent page value for another stalled geo URL
- reduce duplication across service-area pages
- connect Clear Lake searchers to commercial watch and ring repair paths

## Friendswood Service-Area Differentiation Pass (2026-05-11)

The unresolved manifest still includes `/services/friendswood` as `Discovered - currently not indexed` with only one referring URL. Friendswood has strong commercial alignment for ring, heirloom, and stone-security searches, but the page needed more distinct intake value beyond the shared service-area pattern.

Implemented on 2026-05-11:

1. Added Friendswood-specific visit context around family schedules, school events, church weekends, weddings, and longer Pasadena errand planning.
2. Expanded engagement-ring intake guidance around spinning rings, end-of-day tightness, clothing catches, and uneven side stones.
3. Expanded heirloom intake guidance around what should be preserved: engraving, patina, original stones, family metal, or silhouette.
4. Added quote-prep guidance for close/full-piece photos, daily-wear versus event-driven context, loose stones, missing parts, and past repair history.
5. Added a commercial ring-sizing cost/timing helpful read and smoke coverage for the new Friendswood content.

Purpose:

- increase independent page value for another stalled geo URL
- reduce location-page template overlap
- connect Friendswood visitors to commercial ring, heirloom, and stone-security paths

## La Porte Service-Area Differentiation Pass (2026-05-12)

The unresolved manifest still includes `/services/la-porte` as `Discovered - currently not indexed` with only one referring URL. La Porte has a distinct local repair context because watch, clasp, ring, and chain issues often intersect with coastal humidity, water exposure, hands-on workdays, and trip planning into Pasadena.

Implemented on 2026-05-12:

1. Added La Porte-specific context around humidity, water exposure, boating weekends, refinery or plant workdays, and commute timing.
2. Expanded watch guidance around moisture, sweat, heat, loose crowns, gasket risk, and deeper movement concerns.
3. Expanded workwear ring and chain guidance around recurring stress points, clasp openings, spinning rings, and light stone movement.
4. Added quote-prep guidance for daily workwear versus event jewelry versus inherited pieces, plus preservation notes for heirlooms.
5. Updated helpful reads to include battery-vs-repair diagnosis and chain weak-point guidance, with smoke coverage for the new La Porte content.

Purpose:

- increase independent page value for another stalled geo URL
- reduce location-page template overlap
- connect La Porte visitors to commercial watch, chain, heirloom, and repair-diagnosis paths

## Pasadena Service-Area Differentiation Pass (2026-05-12)

The unresolved manifest still includes `/services/pasadena` as `Discovered - currently not indexed` with only one referring URL. Because Pasadena is the core storefront city, this page needs to do more than repeat the homepage and generic service-area structure.

Implemented on 2026-05-12:

1. Added Fairmont Parkway-specific local context around work, school pickup, errands, church weekends, and planned events.
2. Expanded first-pass intake guidance around whether the piece is safe for normal wear today or needs immediate bench attention.
3. Added more specific triage language for battery-only versus moisture-related watches, ring sizing versus stone tightening, and chain failures at clasps, jump rings, hollow links, or solder points.
4. Added quote-prep guidance for close/full-piece photos, wear pattern notes, watch stop context, spinning rings, clothing catches, and visible stone movement.
5. Added a commercial ring-sizing cost/timing helpful read and updated smoke coverage for the Pasadena-specific content.

Purpose:

- increase independent page value for the core local city URL
- reduce overlap with the homepage and other geo pages
- connect Pasadena visitors to commercial watch, ring, chain, and repair-diagnosis paths

## Stone Security Checklist Bench-Check Pass (2026-05-12)

The unresolved manifest still includes `/blog/stone-security-checklist` as `Discovered - currently not indexed` with only one referring URL. This is a high-commercial-intent guide because loose stones and worn prongs map directly to stone setting, ring repair, quote requests, and urgent prevention of a lost diamond.

Implemented on 2026-05-12:

1. Added a stone-security bench-check section that distinguishes worn prong tips, bent prongs, shallow seats, loose side stones, thin shanks, and older heads that no longer support daily wear.
2. Added quote-prep guidance for top-view photos, side-view prong photos, impact history, recent resizing, snagging, and daily-wear context.
3. Added targeted discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
4. Added a direct contextual link from `/blog/can-a-severely-bent-ring-prong-be-fixed` to `/blog/stone-security-checklist` with the anchor `Run the Stone Security Checklist`.
5. Added smoke coverage confirming both the checklist content and the bent-prong article link.

Purpose:

- increase independent page value for a stalled high-intent blog URL
- reduce overlap with the bent-prong article by making this page the broader inspection checklist
- strengthen internal relevance between prong repair, stone setting, and quote-intent paths

## Trustworthy Jeweler Intake-Differentiation Pass (2026-05-12)

The unresolved manifest still includes `/blog/how-to-choose-a-jeweler` as `Discovered - currently not indexed` with only one referring URL. The page is commercially useful because trust evaluation often happens immediately before a customer chooses where to bring a sentimental repair, ring sizing, stone setting, or watch issue.

Implemented on 2026-05-12:

1. Added a counter-level repair intake section that distinguishes real repair assessment from generic sales-counter promises.
2. Added specific diagnostic prompts for rings, watches, and inherited jewelry: spinning, clothing catches, loose stones, previous sizing, engraving, moisture, corrosion, crown issues, movement symptoms, preservation, reuse, matching, and redesign decisions.
3. Added quote-prep guidance around close photos, full-piece photos, and when the symptom started.
4. Added conversion next steps to heirloom restoration, stone setting, ring sizing, watch repair, and quote submission.
5. Added discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
6. Added a direct contextual link from `/blog/heirloom-jewelry-restoration-repair-or-redesign` to `/blog/how-to-choose-a-jeweler` with the anchor `Choose a Trustworthy Jeweler`.
7. Added smoke coverage confirming both the intake-differentiation content and the heirloom article link.

Purpose:

- increase independent page value for a stalled trust-intent blog URL
- connect trust evaluation to concrete commercial repair paths
- strengthen internal relevance between heirloom decision content and jeweler-selection content

## Pearl Restringing Timing Event-Deadline Pass (2026-05-12)

The unresolved manifest still includes `/blog/pearl-restringing-timing-guide` as `Discovered - currently not indexed` with only one referring URL. The page supports commercial pearl restringing intent because customers often search timing before a wedding, church service, anniversary, graduation, or trip.

Implemented on 2026-05-12:

1. Added an event-deadline timing section that separates clean preventive restringing from jobs slowed by clasp work, missing pearls, re-sorting, or heavy stretch.
2. Added specific intake checks for clasp-end knots, visible pearl gaps, twisting, uneven drape, and required return date.
3. Added quote-prep guidance for full-length photos, clasp/end-knot closeups, and event deadline context.
4. Added discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
5. Added a direct contextual link from `/blog/how-much-does-pearl-restringing-cost-pasadena` to `/blog/pearl-restringing-timing-guide` with the anchor `Check Pearl Restringing Timing`.
6. Added smoke coverage confirming both the timing-check content and the cost-guide link.

Purpose:

- increase independent page value for a stalled pearl-care blog URL
- connect timing-intent searchers to pearl restringing quote paths
- strengthen internal relevance between pearl pricing and pearl timing content

## Cleaning And Vintage Ring Risk-Differentiation Pass (2026-05-12)

The unresolved manifest still includes `/blog/professional-cleaning-vs-home-care` and `/blog/safe-to-clean-vintage-diamond-ring-at-home` as `Discovered - currently not indexed` with only one referring URL each. These pages support jewelry cleaning, stone-security, and heirloom restoration intent, but needed clearer separation between general cleaning decisions and vintage household-product risk.

Implemented on 2026-05-12:

1. Added a cleaning-intake section to `/blog/professional-cleaning-vs-home-care` that distinguishes routine cleaning from structural inspection, stone-security review, and preservation-sensitive polishing.
2. Added quote-prep guidance for close photos, full-piece photos, vintage/inherited status, recent sizing, and clothing catches.
3. Added a contextual link from the professional cleaning guide to `/blog/safe-to-clean-vintage-diamond-ring-at-home` with the anchor `Check Vintage Ring Cleaning Risk`.
4. Added a vintage-ring red-flag section to `/blog/safe-to-clean-vintage-diamond-ring-at-home` covering blackened seams, clicking stones, flat prongs, thin shanks, missing side stones, previous solder work, and residue-trapping filigree.
5. Added direct links from the vintage cleaning guide to `/blog/professional-cleaning-vs-home-care` and `/blog/stone-security-checklist`.
6. Added discovery boosts for both stalled cleaning URLs across blog, service-hub, and geo-helpful-read surfaces.
7. Added smoke coverage confirming the differentiated content and cross-links.

Purpose:

- increase independent page value for two stalled cleaning-intent blog URLs
- reduce overlap by making one page the general cleaning decision guide and the other the vintage-ring risk guide
- strengthen internal relevance between cleaning, heirloom restoration, and stone-security quote paths

## Same-Day Watch Battery Local-Intent Pass (2026-05-12)

The unresolved manifest still includes `/blog/where-to-get-watch-battery-replaced-pasadena` as `Discovered - currently not indexed` with only one referring URL. The diagnostic companion page already has strong boosts, but the same-day battery page needed clearer local-visit value and a reciprocal link from the battery-vs-repair guide.

Implemented on 2026-05-12:

1. Added a same-day watch battery intake section that asks for brand, case-back type, stop timing, and fogging/moisture context before the customer drives over.
2. Added local quote-prep guidance for customers coming from Deer Park, Pasadena, Clear Lake, or La Porte with unusual, luxury, vintage, or water-resistant watches.
3. Clarified that same-day speed should still include case protection, seal-condition review, and escalation when the symptom points beyond a battery.
4. Increased discovery boosts for blog, service-hub, and geo-helpful-read surfaces.
5. Added a direct contextual link from `/blog/does-my-watch-need-battery-or-repair-pasadena` to `/blog/where-to-get-watch-battery-replaced-pasadena` with the anchor `Find Same-Day Watch Battery Help`.
6. Added smoke coverage confirming both the intake-differentiation content and the diagnostic article link.

Purpose:

- increase independent page value for a stalled same-day watch battery URL
- strengthen local visit intent for Deer Park, Pasadena, Clear Lake, and La Porte customers
- connect diagnostic watch searchers back to the commercial same-day battery service path

## GSC Recheck And Freshness Repair (2026-05-12)

Re-ran the authenticated GSC indexing status script on 2026-05-12 after the latest crawl-weight passes.

Result:

1. 14 unresolved URLs still report `Discovered - currently not indexed`.
2. `/services/clear-lake` reports `URL is unknown to Google` with 0 sitemap sources and 0 referring URLs in the URL Inspection API response.
3. Live production verification shows `/services/clear-lake` returns `200`, has a canonical URL for `https://www.susiesjewelryrepair.com/services/clear-lake`, and is present in the live sitemap.
4. The live sitemap still showed service and geo pages with `2026-04-21` `lastmod` despite material May 12 service-area/content updates.

Implemented on 2026-05-12:

1. Updated service and service-area sitemap `lastmod` to `2026-05-12T12:00:00-05:00`.
2. Updated `reviewedAt` dates to `2026-05-12` for blog posts materially changed during the indexing recovery passes so their sitemap `lastmod` reflects the actual content refresh.
3. Refreshed `Docs/SEO_QUICK_WINS.md` with the May 12 Search Console quick-win report.

Purpose:

- repair stale freshness signals that could suppress recrawl priority
- give Clear Lake and the recently updated service/geo pages a current sitemap signal
- align blog `reviewedAt`/sitemap dates with actual content updates rather than stale February-April timestamps

## LocalBusiness Schema Policy Cleanup (2026-05-12)

The site already had useful LocalBusiness entity markup: name, NAP, map URL, geo coordinates, sameAs links, opening hours, and served cities. The schema audit found one avoidable risk: global `aggregateRating` and `Review` markup on the LocalBusiness entity.

Implemented on 2026-05-12:

1. Removed `aggregateRating` and `review` from `src/lib/schema.ts`.
2. Preserved the lower-risk LocalBusiness entity fields that help Google and AI systems understand the business, location, map entity, and service area.
3. Updated smoke coverage so the homepage schema test now asserts the risky review/rating fields stay absent while sameAs, map URL, and closed Sunday handling remain valid.

Purpose:

- reduce structured-data policy noise during indexing recovery
- avoid self-serving local-business review markup that is not necessary for the current traffic goal
- keep entity clarity signals without over-marking content

## HTML Site Map Crawl Path Pass (2026-05-12)

The latest GSC URL Inspection API response reported `/services/clear-lake` as `URL is unknown to Google` with 0 sitemap sources and 0 referring URLs, even though live HTML checks showed crawlable Clear Lake links from the homepage, services hub, footer, nearby service-area pages, and related blog posts. This appears to be GSC inspection lag, but the safest crawl-weight improvement is to give Google a single human-readable internal discovery page that lists every canonical commercial URL.

Implemented on 2026-05-12:

1. Added `/site-map` as a crawlable HTML site map page with core pages, service pages, nearby service-area pages, and repair-guide links.
2. Kept `/sitemap.xml` available and linked it from the HTML site map.
3. Updated the footer `Sitemap` link from `/sitemap.xml` to `/site-map` so the HTML site map receives sitewide internal links.
4. Added `/site-map` to the XML sitemap with the May 12 service/content freshness timestamp.
5. Added smoke coverage confirming `/site-map` exposes `/services/clear-lake`, `/services/pearl-restringing`, and a stalled watch-diagnostic guide as normal crawlable links.

Purpose:

- create one strong internal discovery path for all stalled commercial URLs
- increase crawl access to geo pages that GSC still reports as unresolved
- improve user navigation without removing the XML sitemap used by crawlers

## Post Site-Map GSC Recheck (2026-05-12)

Re-ran `npm run google:indexing-status` after `/site-map` was live and regenerated the manifest with `npm run google:indexing-manifest`.

Result:

1. `/services/clear-lake` improved from `URL is unknown to Google` to `Discovered - currently not indexed`, with 1 sitemap source and 1 referring URL now visible in the URL Inspection API response.
2. `/blog/heirloom-restoration-planning-guide` improved from `Discovered - currently not indexed` to `Submitted and indexed`.
3. `/site-map` is live and returns `200`, but is still `URL is unknown to Google`, which is expected immediately after launch.
4. `/services/pasadena` and `/blog/does-my-watch-need-battery-or-repair-pasadena` currently report `URL is unknown to Google` despite being live, in the sitemap, and internally linked.

Updated manifest counts:

- Indexed: 27
- Discovered - currently not indexed: 12
- URL is unknown to Google: 3

Interpretation:

- The Clear Lake improvement validates the crawl-path work: Google now sees sitemap and referring signals for the page that previously showed none.
- The heirloom planning guide moving to indexed is the first confirmed indexing win from the unresolved queue.
- The Pasadena and watch diagnostic regressions look like URL Inspection state volatility or processing lag, not production routing failures, but they stay in the immediate monitoring queue.

## Internal Link Audit Baseline (2026-05-12)

Added and ran `npm run seo:internal-link-audit` against the live production site after the post-site-map GSC recheck.

Result:

1. The audit checked 15 unresolved manifest targets against 28 live source pages.
2. No unresolved target had fewer than 2 indexed-source links.
3. `/services/pasadena` and `/blog/does-my-watch-need-battery-or-repair-pasadena` both have strong live internal-link coverage despite currently reporting `URL is unknown to Google` in the URL Inspection API.
4. The output is written to `.health/internal-link-audit-latest.md` and `.health/internal-link-audit-latest.json`.
5. The weekly health workflow now runs the internal-link audit and includes it in the weekly GitHub issue and uploaded artifacts.

Interpretation:

- The remaining unresolved pages are not blocked by missing internal links.
- More blanket internal linking is unlikely to be the best next use of effort.
- The next indexing pass should focus on GSC state movement, manual URL inspection/request indexing when authenticated browser access is available, and content-quality pruning only if pages stay stuck after Google processes the May 12 crawl-path and freshness changes.

## Full Manifest Recheck And Generator Guard (2026-05-12)

Re-ran the live monitoring stack after the site-map and content-weight passes:

```bash
npm run google:weekly-seo-health
npm run google:seo-quick-wins
npm run google:indexing-status -- --all
npm run google:indexing-manifest
```

Result:

1. Full URL Inspection scope checked all 42 canonical URLs.
2. Current GSC status counts: 27 submitted and indexed, 14 discovered but not indexed, and 1 unknown to Google.
3. `/services/pasadena` moved from `URL is unknown to Google` to `Discovered - currently not indexed`.
4. `/blog/does-my-watch-need-battery-or-repair-pasadena` moved from `URL is unknown to Google` to `Discovered - currently not indexed`.
5. `/blog/heirloom-restoration-planning-guide` remains confirmed as `Submitted and indexed`.
6. `/site-map` is the only remaining `URL is unknown to Google` item; this is expected because the HTML site map was just launched.

Tooling fix:

1. Fixed `scripts/google/generate-indexing-manifest.mjs` so limited unresolved-queue rechecks do not accidentally overwrite newer manifest evidence with older hardcoded baseline statuses.
2. The manifest generator now preserves prior manifest status evidence for URLs omitted from the latest recheck and only falls back to the baseline when no newer evidence exists.

Interpretation:

- The crawl-path work is producing the expected early-stage movement: unknown URLs are becoming discovered.
- The remaining blocker is Google choosing which discovered pages to index, not live routing, robots, sitemap inclusion, or internal-link availability.
- Keep monitoring; do not add more sitewide links unless a future audit shows a specific unresolved URL has weak indexed-source coverage.

## Organic Conversion Measurement Split (2026-05-12)

The weekly SEO health report previously showed total quote/booking starts and outcomes, but it did not separate whether those conversions came from Organic Search. That made it harder to judge the actual quality of SEO traffic.

Implemented on 2026-05-12:

1. Added an Organic Search-only GA4 event query to `scripts/google/weekly-seo-health.mjs`.
2. Added `Organic quote + booking starts` and `Organic quote + booking outcomes` to the Core KPIs table.
3. Added an `Organic Conversion Detail` section for quote, booking, phone, and mobile sticky CTA events.

Latest result for 2026-05-05 to 2026-05-11:

- Organic quote + booking starts: `1`
- Organic quote + booking outcomes: `1`
- Organic sessions: `12`

Interpretation:

- Organic traffic is not only producing visits; it produced a tracked quote start and successful quote outcome in the latest reporting window.
- Future monitoring can now distinguish SEO traffic quality from total-site conversion activity.

## Organic Landing-Page Conversion Attribution (2026-05-12)

The weekly SEO health report now also joins Organic Search conversion events to `landingPagePlusQueryString`.

Implemented on 2026-05-12:

1. Added an Organic Search-only landing-page conversion query to `scripts/google/weekly-seo-health.mjs`.
2. Added an `Organic Conversions By Landing Page` table to the generated weekly report.
3. Scoped the table to high-intent events: quote starts, booking starts, phone clicks, quote successes, booking successes, and booking pending submissions.

Latest result for 2026-05-05 to 2026-05-11:

| Landing page | Event | Count |
| --- | --- | --- |
| `/` | `quote_form_start` | `1` |
| `/` | `quote_submit_success` | `1` |

Interpretation:

- The homepage is currently the only organic landing page with tracked lead conversion in this window.
- The stalled commercial blog and geo/service pages are still an indexing and visibility opportunity, not yet proven conversion pages.
- Once those pages index, this report will show whether they produce qualified lead actions or only impressions/sessions.

## Mobile Homepage Flow Simplification (2026-05-12)

The homepage is currently the only Organic Search landing page with a tracked quote start and quote success, so it should stay clear and conversion-oriented on mobile. Recent indexing work added useful crawl paths, but the mobile flow needed a restraint pass to avoid feeling like a content directory.

Implemented on 2026-05-12:

1. Moved the services grid higher in the homepage flow so mobile users reach repair choices before secondary process/story sections.
2. Reduced mobile spacing and card padding in the services and process sections.
3. Limited the homepage repair-guide section to three visible guide cards on mobile, while keeping the full desktop grid.
4. Hid the decorative workshop story and custom showcase band on mobile; those remain available on desktop and through normal navigation.
5. Added smoke coverage to keep the mobile homepage flow from drifting back into clutter.

Validation:

```bash
npm test -- --grep "mobile home flow|mobile conversion: home CTA|mobile sticky CTA"
npm run lint
```

Interpretation:

- Mobile users now see the proven quote path, compact quote shortcut, service choices, local repair paths, and limited guide options without extra decorative sections competing for attention.
- Crawlable commercial paths remain available through services, local repair paths, guide cards, site navigation, and `/site-map`.

## Mobile Service-Detail Restraint Pass (2026-05-12)

The service-detail pages carry a lot of SEO/AEO value, but on mobile the stack had become too heavy: hero, direct answer, process cards, support imagery, gallery cards, option cards, market pricing, intake checklist, trust cards, proof quotes, FAQs, guide links, related services, and final CTA.

Implemented on 2026-05-12:

1. Kept the core mobile decision flow: hero CTAs, direct answer, how it works, what to expect, pricing/timing, before-you-visit checklist, FAQs, guides, related services, and final CTA.
2. Hid repeated support imagery and process/gallery images on mobile while preserving richer visuals on desktop.
3. Collapsed mobile market detail by hiding scenario cards until desktop; the pricing section still keeps the summary, timing, and next action visible.
4. Limited customer proof to one visible quote on mobile while keeping the full proof set on desktop.
5. Limited lower-page guide cards to two visible items on mobile while keeping all guide links available on desktop.
6. Added smoke coverage to prevent secondary service-detail content from becoming cluttered again on mobile.
7. Made the watch-repair hero visual desktop-only and lowered its fetch priority because mobile LCP diagnostics showed the hero text was the LCP element while the eager hero image competed for early load.

Validation:

```bash
npm test -- --grep "mobile service detail: secondary content stays restrained|mobile service detail: decision module and proof blocks render|mobile service detail: commercial pages expose direct answer blocks"
npm run lint
```

Interpretation:

- Service pages keep their crawlable and answer-oriented structure without forcing mobile users through every secondary proof/image block.
- The mobile journey now better matches the commercial intent: identify the repair, understand next step, quote or book.
- Watch repair now prioritizes a faster mobile answer-and-CTA path over decorative hero imagery, while desktop still keeps the visual treatment.

## Sitewide Priority Repair Footer Links (2026-05-12)

The May 12 manifest still shows 14 canonical URLs in `Discovered - currently not indexed`, including `/services/pearl-restringing` and multiple commercial repair guides. The services hub already links the full priority repair set, but the sitewide footer only exposed a subset.

Implemented on 2026-05-12:

1. Updated the footer repair-guide column to link every item in `PRIORITY_REPAIR_PATHS`.
2. Added smoke coverage for the two previously omitted priority crawl paths: pearl restringing service and watch battery replacement near Pasadena.

Interpretation:

- This adds sitewide crawl weight without adding another above-the-fold mobile section.
- The change supports stalled commercial pages while preserving the simpler mobile page flow.

## Mobile Sticky CTA Quote Alignment (2026-05-12)

The May 5-11 GA4 window showed `0` mobile sticky CTA clicks, `0` booking starts, and `1` organic quote start plus `1` organic quote success from the homepage. The compact mobile shortcut was already one button, but it pointed to booking even though the lower-friction quote path is the only proven organic conversion path so far.

Implemented on 2026-05-12:

1. Changed the mobile sticky shortcut from `Book Repair Today` to `Get Fast Quote`.
2. Pointed the shortcut to `/quote` with `utm_campaign=quote_shortcut`.
3. Kept a single compact mobile button and continued hiding it on quote, book, and contact pages.
4. Added a distinct accessible label for the sticky shortcut so it does not conflict with primary page-level `Get Fast Quote` links.
5. Updated smoke coverage for the new destination, tracking payload, and attribution fields.

Interpretation:

- This reduces mobile CTA friction without adding more buttons.
- The next GA4 checkpoint should compare `mobile_sticky_cta_click`, quote starts, and quote outcomes on the `quote_shortcut` UTM path.

## Mobile UX Restraint Guardrail (2026-05-12)

Recent crawl-weight work added useful homepage links, but mobile users should not experience the homepage as a directory of SEO cards. Organic conversions currently come from the homepage quote path, so mobile hierarchy should favor quote, service selection, and only then optional research links.

Implemented on 2026-05-12:

1. Converted the homepage local repair path link grid into two mobile disclosure panels: nearby city pages and decision guides.
2. Converted the homepage commercial guide grid into a compact mobile pricing-help card with primary quote action, blog browse action, and optional top-guide disclosure.
3. Kept richer guide/card grids on desktop where scanning capacity is higher.
4. Kept crawlable links in the DOM while lowering mobile visual clutter and decision fatigue.
5. Added smoke coverage so these SEO-supporting blocks do not expand back into full mobile grids accidentally.

Interpretation:

- Homepage mobile flow now follows a clearer order: hero quote path, proof, repair services, optional local/guide paths, process, trust, FAQ, final CTA.
- SEO/GEO/AEO content remains available, but it no longer competes as strongly with the proven mobile conversion path.

## Priority Repair Path Expansion (2026-05-13)

The latest indexing manifest still shows 15 unresolved URLs. The internal link audit shows most unresolved pages already receive broad indexed-source coverage, but four stalled guide pages remain weaker than the sitewide priority set:

| URL | Indexed-source links before expansion |
| --- | --- |
| `/blog/how-to-choose-a-jeweler` | 3 |
| `/blog/professional-cleaning-vs-home-care` | 3 |
| `/blog/safe-to-clean-vintage-diamond-ring-at-home` | 4 |
| `/blog/stone-security-checklist` | 6 |

Implemented on 2026-05-13:

1. Added the four weak-coverage stalled guides to `PRIORITY_REPAIR_PATHS`.
2. This gives them additional crawl weight through the footer and services-hub repair planning paths without adding another homepage section.
3. Kept the mobile homepage restrained because the expanded list is not rendered as another above-the-fold grid.
4. Added smoke coverage so the footer continues exposing the newly weighted guide links.

Post-deploy verification:

- Reran `npm run seo:internal-link-audit` against production on 2026-05-13.
- All four weak-coverage stalled guides now show `28` all-source links and `27` indexed-source links.
- Production homepage HTML also contains the new footer links for `/blog/how-to-choose-a-jeweler`, `/blog/professional-cleaning-vs-home-care`, and `/blog/safe-to-clean-vintage-diamond-ring-at-home`.

## Sitemap Freshness Alignment (2026-05-13)

The site shell and footer crawl paths changed on 2026-05-13, but static/service sitemap freshness still reflected older timestamps. The manifest also showed `/site-map` as unknown to Google even though the HTML sitemap is a useful crawl-discovery page.

Implemented on 2026-05-13:

1. Updated static and service sitemap `lastModified` values to `2026-05-13T12:00:00-05:00`.
2. Kept blog article timestamps tied to each article's `reviewedAt`, which already reflects the 2026-05-12 content refresh on stalled guides.
3. Added smoke coverage to confirm `/site-map` is present in `/sitemap.xml` and the refreshed `<lastmod>` is emitted.

Expected effect:

- Google receives a cleaner freshness signal for the updated static/service shell and the HTML sitemap route.
- The next GSC indexing manifest should show whether `/site-map` moves from `URL is unknown to Google` to discovered or indexed.

## GSC Movement Checkpoint (2026-05-13)

Ran the authenticated URL Inspection API against all 42 canonical manifest URLs on 2026-05-13, then reran the unresolved queue to confirm the monitoring script's movement classification. Regenerated `Docs/INDEXING_MANIFEST.md` from the latest inspection evidence.

Current GSC status:

- Indexed: 28
- Discovered - currently not indexed: 12
- URL is unknown to Google: 2

Movement since the prior manifest:

- Improved: `/blog/safe-to-clean-vintage-diamond-ring-at-home` moved from `Discovered - currently not indexed` to `Submitted and indexed` in the all-URL inspection pass.
- Regressed: `/blog/chain-repair-weak-points` returned `URL is unknown to Google` in the follow-up unresolved-queue inspection.
- Stable unresolved queue: service-area URLs returned to `Discovered - currently not indexed` on the follow-up check after a transient unknown response.
- Live accessibility for `/blog/chain-repair-weak-points` is healthy: production returns `200`, the canonical tag is correct, and the URL is present in `/sitemap.xml`.

Immediate recommendation:

- Do not prune yet. The newest weighting/freshness changes are only beginning to show movement, and one previously stalled guide is now indexed.
- Watch `/blog/chain-repair-weak-points` specifically. Since live accessibility and sitemap inclusion are healthy, a repeated unknown state should be treated as an index-priority/content-quality signal rather than a routing blocker.
- Keep the unresolved queue under observation for the next checkpoint. If the same service-area pages and commercial guides remain unchanged after the next full inspection, move to a targeted quality/pruning pass instead of adding more sitewide link blocks.

## Chain Repair Intent Refresh (2026-05-13)

After the 2026-05-13 GSC follow-up, `/blog/chain-repair-weak-points` was the only commercial guide to return `URL is unknown to Google` despite healthy live accessibility, canonical markup, sitemap inclusion, and strong internal-link coverage.

Implemented:

1. Retitled the guide from the more generic `Chain Repair 101` framing to `Necklace & Bracelet Chain Repair: Weak Points to Check`.
2. Rewrote the excerpt around necklace/bracelet repair quote intent and clasp/jump-ring diagnosis.
3. Added a key takeaway and FAQ that explain exactly which photos help with a chain repair quote.
4. Updated the guide `reviewedAt` date to 2026-05-13 so the sitemap emits a fresh lastmod for this specific watch-list page.

Interpretation:

- This is a content-intent and freshness pass, not another link-weight pass. The internal-link audit already shows `/blog/chain-repair-weak-points` has 29 source links, 28 indexed-source links, and a sitemap link.
- If the page remains unknown after the next GSC inspection, the next move should be content consolidation or deeper first-party proof, not more sitewide footer links.

## May 6-12 SEO and Conversion Checkpoint (2026-05-13)

Ran `npm run google:weekly-seo-health`, `npm run google:seo-quick-wins`, `npm run google:indexing-status`, and `npm run google:indexing-manifest` on 2026-05-13.

Current 7-day performance:

- Google Search clicks: 8
- Google Search impressions: 899
- Production organic sessions: 16
- Quote + booking starts: 2
- Organic quote + booking starts: 1
- Mobile sticky CTA clicks: 2
- Quote + booking outcomes: 2
- Organic quote + booking outcomes: 1

Search and indexing observations:

- Homepage still carries most quick-win demand: 18 quick-win keywords and 542 impressions.
- `/blog/chain-repair-weak-points` moved from `URL is unknown to Google` back to `Discovered - currently not indexed` after the intent refresh and sitemap freshness update.
- `/blog/professional-cleaning-vs-home-care` returned `URL is unknown to Google`, but live accessibility is healthy: production returns `200`, the canonical tag is correct, and the URL is present in `/sitemap.xml`.
- `/services/ring-sizing` now appears as a quick-win page for `jewelry repair pasadena tx`, which supports keeping service pages commercially focused rather than shifting all local intent back to the homepage.

Conversion observation:

- The compact mobile sticky quote CTA is now receiving clicks, including 1 organic click, but the sticky-CTA UTM path did not produce tracked form starts in this reporting window.

Implemented conversion response:

1. Kept the mobile sticky CTA as one compact quote button.
2. Reordered the quote form so the required path is `name -> email -> repair details`.
3. Moved optional phone below repair details so the first decision after contact info is the actual repair description, not an optional field.
4. Added smoke coverage for required-field order on the mobile quote form.

Interpretation:

- This reduces mobile form friction without removing useful optional lead data.
- The next GA4 checkpoint should compare sticky CTA clicks against `quote_form_start` and `quote_submit_success` again before making larger quote-page layout changes.

## Professional Cleaning Intent Refresh (2026-05-13)

The 2026-05-13 URL Inspection recheck showed `/blog/professional-cleaning-vs-home-care` regressing from `Discovered - currently not indexed` to `URL is unknown to Google`, even though live checks showed the URL returns `200`, has a self-canonical, is in the sitemap, and receives strong indexed-source internal links.

Implemented:

1. Retitled the guide from the broader `Professional Jewelry Cleaning vs. At-Home Cleaning` angle to `Home Jewelry Cleaning: When to Stop and Get an Inspection`.
2. Added a direct-answer section that defines when home cleaning is safe and when inspection should come first.
3. Added more specific stop-cleaning cues: stone clicking, prong catching, thin shank, old solder, unreliable clasp, pearls/opals, inherited pieces, and unknown repair history.
4. Expanded the quote-first photo guidance to request a full-piece photo, a close worn/dirty-area photo, and a side photo showing prong height, clasp condition, or setting profile.
5. Added a FAQ for cleaning/inspection quote photos.
6. Updated the article `reviewedAt` to `2026-05-13` so the sitemap emits a fresh lastmod for this watch-list page.

Interpretation:

- This is a content-intent and AEO specificity refresh, not another link-weight pass.
- The internal-link audit already shows `/blog/professional-cleaning-vs-home-care` has broad source coverage, so more sitewide links are unlikely to be the highest-value next fix.
- If the page remains unknown after the next GSC inspection, the next move should be either deeper first-party proof from the shop or consolidation with the indexed vintage-cleaning guide, not more generic cleaning copy.

## Full URL Inspection Refresh And Geo CTA Restraint (2026-05-13)

Ran `npm run google:weekly-seo-health`, `npm run google:seo-quick-wins`, `npm run google:indexing-status -- --all`, `npm run google:indexing-manifest`, and `npm run seo:internal-link-audit` on 2026-05-13.

Current 7-day performance:

- Google Search clicks: 8
- Google Search impressions: 899
- Production organic sessions: 16
- Quote + booking starts: 2
- Organic quote + booking starts: 1
- Mobile sticky CTA clicks: 3
- Quote + booking outcomes: 2
- Organic quote + booking outcomes: 1

Current GSC status after full URL Inspection:

- Indexed: 28
- Discovered - currently not indexed: 13
- URL is unknown to Google: 1
- Improved: `/blog/professional-cleaning-vs-home-care` moved from `URL is unknown to Google` to `Discovered - currently not indexed`.
- Remaining unknown: `/site-map`.

Internal-link audit:

- All 14 unresolved targets now have `29` all-source links and `28` indexed-source links.
- Every unresolved target is linked from the HTML site map.
- Because link coverage is already broad, additional footer/sitewide link expansion is no longer the right next default move.

Implemented mobile conversion restraint:

1. Service-area hero CTAs now follow the same quote-first mobile hierarchy as service detail and article decision blocks.
2. `Book Repair` remains available on tablet/desktop, in navigation, and on the dedicated `/book` flow, but no longer competes with `Get Fast Quote` as an equal mobile hero action on local landing pages.
3. Updated `Docs/MOBILE_UX_GUARDRAILS.md` and smoke coverage so local landing pages do not drift back into a two-primary-button mobile layout.

Interpretation:

- The indexing issue is no longer discovery or internal-link scarcity for the unresolved commercial pages.
- The next SEO remediation, if pages remain stuck after the next GSC run, should be targeted quality differentiation or consolidation, not more sitewide link weight.
- The conversion response should stay restraint-first: reduce mobile decision friction while preserving crawlable content and desktop booking paths.

## Service-Area H1 Differentiation Pass (2026-05-13)

The unresolved service-area pages already have strong internal-link coverage and sitemap inclusion, so another link-weight pass would add noise. The remaining weakness is page-level distinctiveness: the service-area H1 pattern was effectively the same for each city, with only the city name swapped.

Implemented:

1. Added optional `heroHeading` copy to the service-area content model.
2. Replaced the repeated `Jewelry repair near {city}, handled in-house` H1 fallback with city-specific H1s.
3. Kept the change inside the existing hero instead of adding another mobile section.
4. Preserved the quote-first mobile CTA hierarchy already applied to service-area pages.

Examples:

- Pasadena: same-day decisions and sentimental pieces.
- La Porte: coastal watches, workwear, and heirlooms.
- Webster: watch, ring, and before-you-drive triage.
- Friendswood: heirlooms and engagement-ring confidence.
- Clear Lake: watch moisture, ring fit, and stone-risk questions.

Interpretation:

- This improves local page uniqueness and AEO extraction without increasing mobile clutter.
- If these pages remain `Discovered - currently not indexed` after the next full URL Inspection pass, the next step should be deeper first-party proof or consolidation analysis, not more templated local copy.

## May 13 Measurement Refresh And Regression Response (2026-05-13)

Ran `npm run google:weekly-seo-health`, `npm run google:seo-quick-wins`, `npm run google:indexing-status -- --all`, `npm run google:indexing-manifest`, and `npm run seo:internal-link-audit` on 2026-05-13 after the latest mobile CTA simplification deploy.

Current 7-day performance for 2026-05-06 to 2026-05-12:

- Google Search clicks: 12
- Google Search impressions: 1,071
- Search CTR: 1.12%
- Average position: 22.50
- Production organic sessions: 16
- Quote + booking starts: 2
- Organic quote + booking starts: 1
- Mobile sticky CTA clicks: 3
- Quote + booking outcomes: 2
- Organic quote + booking outcomes: 1

Current full URL Inspection API status:

- Indexed: 28
- Discovered - currently not indexed: 10
- URL is unknown to Google: 4
- Regressed to unknown in the API: `/services/la-porte`, `/blog/does-my-watch-need-battery-or-repair-pasadena`, and `/blog/how-to-choose-a-jeweler`.
- Still unknown: `/site-map`.

Live technical checks on the four unknown URLs found no hard crawl blocker:

- all four returned `200`
- all four are present in production `/sitemap.xml`
- all four have self-canonical tags
- no `noindex` signal was found
- internal-link audit shows all 14 unresolved targets have `29` all-source links, `28` indexed-source links, and an HTML site-map link

Interpretation:

- The unresolved queue is not suffering from missing internal links or a simple production routing issue.
- The GSC unknown/discovered labels remain unstable on some URLs, but live access and sitemap evidence are healthy.
- The right next SEO response is targeted quality differentiation and first-party proof on regressed commercial pages, not more footer/sitewide link expansion.

Implemented content-quality response:

1. Deepened `/blog/how-to-choose-a-jeweler` with a Pasadena repair-intake checklist for rings, chains, bracelets, watches, and heirlooms.
2. Added quote-photo evidence guidance to `/blog/how-to-choose-a-jeweler`.
3. Added AEO FAQs to `/blog/how-to-choose-a-jeweler` around in-house repair accountability, quote photos, and when to avoid quick promises.
4. Deepened `/blog/does-my-watch-need-battery-or-repair-pasadena` with a pre-open watch triage section covering fog, corrosion, crown/stem symptoms, forced casebacks, and battery-vs-diagnostic decisions.
5. Added a watch quote-photo FAQ to the battery-vs-repair guide.
6. Updated both articles' `reviewedAt` values to 2026-05-13 so the sitemap emits fresh `<lastmod>` values for the regressed pages.

Next checkpoint:

- Re-run full URL Inspection after Google has had a crawl window.
- If the same pages remain unknown/discovered after this deeper first-party pass, evaluate consolidation or add actual shop proof assets such as real repair photos, named case notes, or review-backed examples before creating more pages.

## La Porte Repair Triage Differentiation (2026-05-13)

The latest full URL Inspection API refresh showed `/services/la-porte` regressing to `URL is unknown to Google` even though live technical checks found no crawl blocker. The page already had broad internal-link coverage and sitemap inclusion, so adding more sitewide links was not the right next move.

Implemented:

1. Added a La Porte-specific repair triage block to `/services/la-porte`.
2. Focused the block on real local repair situations: watches exposed to water, sweat, heat, or loose crowns; workwear rings/bracelets from plant, refinery, or hands-on work; and inherited pieces that need preservation-first guidance.
3. Kept the addition inside the existing service-area page structure so mobile users do not get another competing CTA or decorative section.
4. Added smoke coverage for the new La Porte triage copy.

Interpretation:

- This is a quality-differentiation response for a regressed local commercial page.
- If `/services/la-porte` remains unknown or discovered-but-not-indexed after the next crawl window, the next move should be actual shop proof assets or consolidation analysis, not more templated city copy or more footer links.

## Decision-Signal Schema Pass (2026-05-13)

Fresh monitoring was rerun on 2026-05-13 after the mobile footer and CTA restraint work:

- `npm run google:weekly-seo-health`
- `npm run google:seo-quick-wins`
- `npm run google:indexing-status -- --all`
- `npm run google:indexing-manifest`
- `npm run seo:internal-link-audit`

Current GSC status:

- Indexed: 28
- Discovered - currently not indexed: 12
- URL is unknown to Google: 2

Movement:

- `/blog/stone-security-checklist` improved from `URL is unknown to Google` to `Discovered - currently not indexed`.
- `/blog/does-my-watch-need-battery-or-repair-pasadena` regressed from `Discovered - currently not indexed` to `URL is unknown to Google`.

Internal-link audit still shows every unresolved target has `29` all-source links, `28` indexed-source links, and an HTML site-map link. That means the next useful action is not another visible mobile link block.

Implemented:

1. Added JSON-LD `ItemList` markup for article decision-signal blocks that already appear visibly on the page.
2. Anchored each visible decision signal so the structured data points to real on-page content.
3. Added smoke coverage for the watch battery-vs-repair guide's decision-signal schema.

Interpretation:

- This improves AEO/GEO extraction for diagnostic commercial guides without adding visible mobile clutter.
- The schema is intentionally limited to visible decision signals and does not claim a new rich-result type.
- If the watch battery-vs-repair guide remains unknown after another crawl window, the next move should be deeper first-party proof or consolidation with the indexed same-day watch battery guide, not more sitewide link weight.

## Pearl Restringing Intake Proof Pass (2026-05-13)

Current evidence:

- `/services/pearl-restringing` remains `Discovered - currently not indexed`.
- Live routing, canonical, sitemap inclusion, and internal-link coverage are healthy.
- Internal-link audit shows the page has broad indexed-source coverage, so another link-weight pass would add noise.

Implemented:

1. Added a compact `Pearl intake proof` module inside the existing `Before you visit` section.
2. Focused the proof on three first-party intake checks that shape a restringing quote: clasp-end stress, drape/spacing, and clasp reuse decision.
3. Kept the change inside the existing service flow with no new CTA, no new mobile link hub, and no additional conversion pressure.
4. Added smoke coverage for the new pearl-specific intake copy.

Interpretation:

- This is a targeted quality-differentiation response for the only stalled service-detail page.
- If the page remains discovered-but-not-indexed after the next crawl window, the next step should be real repair photo/case proof or consolidation analysis, not broader sitewide links.

## Clear Lake Repair Triage Differentiation (2026-05-13)

Current evidence:

- `/services/clear-lake` remains `Discovered - currently not indexed`.
- Live routing, canonical, sitemap inclusion, and internal-link coverage are healthy.
- Internal-link audit shows broad indexed-source coverage, so more footer/sitewide links would add noise rather than solve the likely quality-selection issue.

Implemented:

1. Added a compact `Local repair triage` module to the existing Clear Lake service-area flow.
2. Focused the module on Clear Lake-specific situations: watch moisture/fog/sweat exposure, daily-wear stone or stress-point risk, and inherited-piece preservation decisions.
3. Kept the change inside the existing service-area page structure with no new CTA, no new mobile link hub, and no extra above-fold content.
4. Added smoke coverage for the new Clear Lake triage copy.

Interpretation:

- This is a targeted quality-differentiation response for a stalled local commercial page.
- If `/services/clear-lake` remains discovered-but-not-indexed after another crawl window, the next move should be real shop proof assets or consolidation analysis, not more templated city copy or broader link expansion.

## Index Quality Audit Guardrail (2026-05-14)

Implemented:

1. Added `npm run seo:index-quality-audit`.
2. The audit fetches live production HTML for unresolved and commercial canonical pages.
3. It checks HTTP status, self-canonical state, robots noindex, title/description presence, H1/H2 structure, visible word count, JSON-LD schema types, schema parse errors, same-category similarity, and existing indexed-source internal-link support.
4. It writes `.health/index-quality-audit-latest.json` and `.health/index-quality-audit-latest.md`.

Latest result:

- Checked `32` pages, including all `14` unresolved URLs from `Docs/INDEXING_MANIFEST.json`.
- `14/14` unresolved URLs returned `pass-monitor`.
- `0` unresolved URLs showed a clear technical, content-depth, schema, duplication, or internal-link blocker.
- Indexed pages with minor content-depth watch flags do not explain the unresolved queue and should not drive visible mobile clutter.

Interpretation:

- The remaining unresolved queue is now best treated as a Google crawl/index selection delay unless fresh GSC inspection shows a new blocker.
- Do not add more visible homepage, footer, or mobile link hubs for these URLs based only on their unresolved status.
- Next useful actions are GSC re-request/recheck, real first-party proof assets, or consolidation analysis if a page remains stalled through another crawl window.

## Internal Link Weighting Decision (2026-05-14)

Fresh checks run:

```bash
npm run seo:internal-link-audit
npm run seo:index-quality-audit
```

Current evidence:

- `Docs/INDEXING_MANIFEST.md` now shows `28` indexed URLs, `13` discovered-currently-not-indexed URLs, and `1` URL unknown to Google (`/site-map`).
- `/services/friendswood` improved from unknown to discovered-currently-not-indexed.
- `/blog/pearl-restringing-timing-guide` improved from unknown to discovered-currently-not-indexed.
- The only unknown URL is now the non-commercial `/site-map` utility page.
- Internal-link audit shows every unresolved commercial URL has at least `3` non-footer links from indexed pages.
- Index-quality audit shows `14/14` unresolved URLs have no clear technical, content-depth, schema, duplication, or internal-link blocker.

Decision:

- Do not add more visible contextual link blocks, homepage hubs, footer expansions, or mobile CTAs for the unresolved commercial queue right now.
- The commercial pages already have enough indexed-source internal links for the current stage.
- Treat remaining discovered-currently-not-indexed URLs as Google index-selection lag unless URL Inspection shows a new error.

Next escalation threshold:

- If a commercial URL remains discovered-currently-not-indexed after the next full GSC reinspection window, do not add more generic copy or sitewide links.
- Escalate only to one of these higher-signal moves: real repair photos, named first-party case notes, review-backed proof, Google Business Profile/service-area corroboration, or consolidation with an already indexed page serving the same intent.
- Keep `/site-map` out of visible link-weighting decisions unless it becomes commercially important.

## Full Reinspection And Mobile UX Checkpoint (2026-05-14 06:03 UTC)

Fresh checks run:

```bash
npm run google:indexing-status
npm run google:indexing-manifest
npm run seo:internal-link-audit
npm run seo:index-quality-audit
npm run google:weekly-seo-health
npm run google:seo-quick-wins
npm run ux:mobile-flow
```

Current evidence:

- `14/14` unresolved manifest URLs were unchanged in URL Inspection output.
- `13` unresolved URLs remain `Discovered - currently not indexed`.
- The only `URL is unknown to Google` entry is `/site-map`, a utility page that should not receive visible link-weighting.
- Internal-link and index-quality audits passed; no technical, content-depth, duplication, schema, or link-weight blocker was found.
- The weekly quick-win report remains homepage-heavy, so unresolved commercial pages are not yet producing meaningful organic search traffic.
- The production mobile UX audit passed across `38` routes: mobile heroes avoid quote/book competition, footer crawl groups remain collapsed, crawl hubs do not expose conversion CTAs, and the sticky shortcut remains one compact attributed quote action.

Decision:

- Do not add more visible homepage sections, footer expansions, city-link hubs, or mobile CTA variants to force indexing.
- Move the next escalation to approved first-party proof assets or consolidation analysis.
- Use `Docs/INDEXING_PROOF_ASSET_PLAN.md` as the working plan before editing any stalled commercial page.

## Consolidation Audit Added (2026-05-14)

Implemented `npm run seo:consolidation-audit` to keep the next indexing escalation decision evidence-based.

Outputs:

- `Docs/INDEXING_CONSOLIDATION_AUDIT.md`
- `.health/indexing-consolidation-audit-latest.md`
- `.health/indexing-consolidation-audit-latest.json`

Current result:

- `5` unresolved commercial clusters remain.
- `6` clusters have indexed alternatives that could absorb overlapping unresolved content if approved first-party proof is unavailable.
- Lowest-risk consolidation candidates are the watch location guide, pearl timing guide, and generic home-cleaning guide.

Decision:

- Do not consolidate immediately without a fresh GSC checkpoint or owner-provided proof decision.
- Use the audit after the next URL Inspection run to choose between proof enrichment and consolidation.

## Watch Battery Location Guide Consolidation (2026-05-14)

Authenticated GSC recheck on 2026-05-14 showed `/blog/where-to-get-watch-battery-replaced-pasadena` unchanged as `Discovered - currently not indexed`.

Decision:

- Consolidated the same-day/local watch battery guidance into the already indexed `/blog/watch-battery-replacement` article.
- Removed the stalled URL from canonical blog, sitemap, helpful-read, and commercial-guide inventories.
- Added a permanent redirect from `/blog/where-to-get-watch-battery-replaced-pasadena` to `/blog/watch-battery-replacement`.
- Preserved useful local intake guidance without adding another homepage block, footer hub, mobile CTA, or duplicate blog path.

Interpretation:

- This reduces overlapping watch-battery URLs while keeping the visitor path simpler.
- Future watch-battery work should add first-party proof to the indexed article, not recreate a second same-intent location guide.

## Pearl Timing Guide Consolidation (2026-05-14)

Authenticated GSC recheck on 2026-05-14 showed `/blog/pearl-restringing-timing-guide` unchanged as `Discovered - currently not indexed`.

Decision:

- Consolidated pearl timing, warning-sign, and event-deadline guidance into the already indexed `/blog/how-much-does-pearl-restringing-cost-pasadena` article.
- Removed the stalled timing URL from canonical blog, sitemap, commercial-guide, and helpful-read inventories.
- Added a permanent redirect from `/blog/pearl-restringing-timing-guide` to `/blog/how-much-does-pearl-restringing-cost-pasadena`.
- Kept the user journey simpler by avoiding another visible homepage block, footer hub, or mobile CTA path.

Interpretation:

- This leaves `/services/pearl-restringing` as the separate commercial conversion page and the indexed pearl-cost article as the combined informational answer.
- Future pearl work should add real proof to the service page or indexed cost article, not recreate a second timing-only article.

## Professional Cleaning Guide Consolidation (2026-05-14)

Authenticated GSC recheck on 2026-05-14 showed `/blog/professional-cleaning-vs-home-care` unchanged as `Discovered - currently not indexed`.

Decision:

- Consolidated home-cleaning, professional inspection, and quote-photo guidance into the already indexed `/blog/safe-to-clean-vintage-diamond-ring-at-home` article.
- Removed the stalled professional-cleaning URL from canonical blog, sitemap, commercial-guide, helpful-read, and footer-priority inventories.
- Added a permanent redirect from `/blog/professional-cleaning-vs-home-care` to `/blog/safe-to-clean-vintage-diamond-ring-at-home`.
- Preserved the broader cleaning decision guidance without adding homepage blocks, mobile CTA variants, or another visible crawl hub.

Interpretation:

- This leaves one stronger indexed cleaning-risk article instead of two overlapping cleaning guides.
- Future cleaning content should use real first-party inspection proof, not recreate another home-care comparison page.

## Chain Repair Guide Consolidation (2026-05-14)

The 2026-05-14 manifest still showed `/blog/chain-repair-weak-points` as `Discovered - currently not indexed`, while `/services/necklace-repair` is indexed and serves the same commercial chain-repair intent. No chain-specific first-party proof asset was available, so the weak article was consolidated instead of adding more visible link weight.

Decision:

- Added a permanent redirect from `/blog/chain-repair-weak-points` to `/services/necklace-repair`.
- Removed the chain guide from canonical blog inventory, commercial guide selection, helpful-read mappings, and observed-status seed data.
- Moved the useful chain-intake triage guidance into `/services/necklace-repair` as a compact "Chain intake proof" module.
- Updated city helpful links and priority repair paths to point at the indexed necklace repair service page.
- Regenerated `Docs/INDEXING_MANIFEST.md` and `Docs/INDEXING_CONSOLIDATION_AUDIT.md`; canonical inventory is now 38 URLs with 10 unresolved.

Interpretation:

- The page had already received an intent refresh and strong internal link coverage but remained unselected by Google.
- The indexed service page is more commercially valuable and closer to conversion.
- Consolidation reduces low-performing canonical surface area without adding homepage hubs, footer expansions, or mobile CTA clutter.
