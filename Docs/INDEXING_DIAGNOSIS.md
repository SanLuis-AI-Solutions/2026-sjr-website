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
