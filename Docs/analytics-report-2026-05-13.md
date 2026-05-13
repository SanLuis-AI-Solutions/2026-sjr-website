# SJR Analytics And Mobile UX Checkpoint

- Generated: 2026-05-13
- Primary evidence window: 2026-05-06 to 2026-05-12
- Supporting window: 2026-02-12 to 2026-05-12
- Source artifacts:
  - `.health/weekly-seo-health-latest.md`
  - `.health/kpi-weekly-snapshot-latest.md`
  - `.health/ga4-gsc-reconciliation-90d-latest.md`
  - `.health/ga4-prod-event-validation-latest.md`
  - `Docs/SEO_QUICK_WINS.md`
  - `Docs/INDEXING_MANIFEST.md`

## Executive Summary

The immediate problem is not a broken mobile layout or a need for more above-fold content. The current mobile smoke checks pass, quote/contact outcomes are working at low volume, and the latest 7-day GA4 hostname report is clean.

The current growth bottlenecks are:

1. Organic traffic volume is still low: 16 production-host organic sessions in the latest 7-day window.
2. The homepage still carries most organic demand: `/` received 14 of 16 production-host organic sessions in the latest 7-day window.
3. Booking is the weak conversion path: `/book` had 317 page views and 0 outcomes in the latest 7-day KPI snapshot.
4. The compact mobile sticky CTA generated 3 clicks but 0 quote starts or outcomes on its UTM path.
5. Indexing is improved but not complete: 28 indexed URLs, 10 discovered-not-indexed URLs, and 4 unknown-to-Google URLs.

## Data Quality

### Latest 7-Day Window

The latest weekly SEO health report shows no hostname contamination for the current decision window:

| Metric | Value |
| --- | --- |
| Production-host organic sessions | 16 |
| All-host organic sessions | 16 |
| All-host total sessions | 1,696 |
| Hostname coverage | `www.susiesjewelryrepair.com` only |
| Data quality alerts | None |

### 90-Day Context

The 90-day reconciliation still shows historical localhost inflation:

| Hostname | Active Users | Sessions | Page Views |
| --- | ---: | ---: | ---: |
| `www.susiesjewelryrepair.com` | 2,373 | 2,433 | 2,671 |
| `127.0.0.1` | 2,072 | 2,072 | 5,873 |
| preview/Wix/localhost combined | 44 | 54 | 76 |

Decision rule: use production-host-filtered reports for all growth and CRO decisions. Do not use unfiltered GA4 headline totals as a business KPI until the historical contamination is no longer in the analysis window.

## Current KPI Snapshot

Latest 7-day KPI snapshot:

| KPI | Value |
| --- | ---: |
| GSC clicks | 12 |
| GSC impressions | 1,071 |
| GSC CTR | 1.12% |
| GSC average position | 22.50 |
| Form starts | 3 |
| Submit attempts | 3 |
| Lead outcomes | 3 |
| Form errors | 0 |
| Phone calls | 1 |
| Directions clicks | 2 |

Route conversion:

| Route | Page Views | Outcomes | Outcome Rate |
| --- | ---: | ---: | ---: |
| `/quote` | 311 | 2 | 0.64% |
| `/book` | 317 | 0 | 0.00% |
| `/contact` | 311 | 1 | 0.32% |

Interpretation: do not simplify all forms blindly. Quote and contact are producing outcomes. Booking needs its own diagnostic because it has traffic but no recorded outcome.

## Booking Tracking Diagnostic

Production event validation passed on 2026-05-13:

| Event | Result |
| --- | --- |
| `booking_form_start` | PASS |
| synthetic `booking_submit_success` URL state | PASS |
| `conversion_quick_action_click` on the booking page primary action | PASS |
| `ga_bootstrap_network` | PASS |

The validator did not observe GA collect transport in headless Playwright, but it did observe `gtag.js` bootstrap and in-page GA event capture. This is a known validator limitation, not evidence that production booking tracking is broken.

Interpretation: the latest zero booking outcomes are more likely user behavior, intent mismatch, or booking-form friction than a missing GA event. The next booking work should inspect field-level behavior and the offer/copy, not rebuild analytics from scratch.

## Search Visibility

Latest 28-day quick-win data:

| Query | Page | Clicks | Impressions | CTR | Position |
| --- | --- | ---: | ---: | ---: | ---: |
| jewelry repair near me | `/` | 2 | 291 | 0.69% | 8.82 |
| jewelry repair | `/` | 2 | 36 | 5.56% | 14.64 |
| jewelry store pasadena tx | `/` | 1 | 31 | 3.23% | 8.97 |
| ring resizing near me | `/` | 1 | 28 | 3.57% | 7.00 |
| jewelry store near me | `/` | 0 | 85 | 0.00% | 10.44 |

The homepage remains the main opportunity page: 17 quick-win keywords, 552 impressions, and best quick-win position 6.40.

Recommendation: do not make another immediate homepage title rewrite based on one short window. The current CTR is 1.12% in the latest 7-day report and 0.93% over 90 days. A title test should only happen after a clean baseline and with a documented hypothesis.

## Indexing Status

Current manifest summary:

| Status | Count |
| --- | ---: |
| Indexed | 28 |
| Discovered - currently not indexed | 10 |
| URL is unknown to Google | 4 |

Unresolved priority URLs:

| URL | Status |
| --- | --- |
| `/services/pearl-restringing` | Discovered - currently not indexed |
| `/services/clear-lake` | Discovered - currently not indexed |
| `/services/friendswood` | Discovered - currently not indexed |
| `/services/la-porte` | URL is unknown to Google |
| `/services/pasadena` | Discovered - currently not indexed |
| `/services/webster` | Discovered - currently not indexed |
| `/blog/does-my-watch-need-battery-or-repair-pasadena` | URL is unknown to Google |
| `/blog/how-to-choose-a-jeweler` | URL is unknown to Google |

Internal link audit result: unresolved targets have strong indexed-source coverage. No unresolved target has fewer than 2 indexed-source links.

Interpretation: basic crawlability and internal links are no longer the weakest signal. The next indexing work should be quality/weighting or consolidation, not another generic internal-link pass.

## Mobile UX Status

The mobile guardrail checks passed after the latest simplification work:

- home conversion flow stays uncluttered
- sticky CTA is one compact quote action
- quote/book conversion pages show one primary quick action on mobile
- service/article pages keep quote dominant
- service hero actions and image assets load

The mobile sticky CTA remains a measurement issue:

| Step | Count |
| --- | ---: |
| `mobile_sticky_cta_click` | 3 |
| quote starts on sticky CTA UTM path | 0 |
| quote outcomes on sticky CTA UTM path | 0 |

Interpretation: do not add a second sticky button. The next test should reduce friction after the sticky click or change the sticky destination/copy, while keeping the one-button mobile rule.

## Recommended Next Actions

1. Booking CRO pass: since production event validation passed, inspect whether booking users are abandoning fields, choosing unavailable times, or finding the commitment too high compared with quote/contact.
2. Sticky CTA path test: keep one mobile button, but test whether `Book a Repair Today` or a direct phone-oriented destination outperforms `Get Fast Quote` for sticky users only. Do not change hero CTAs at the same time.
3. Indexing quality pass: choose 3 unresolved URLs with commercial value (`/services/pearl-restringing`, `/services/la-porte`, `/blog/does-my-watch-need-battery-or-repair-pasadena`) and improve unique proof, direct answers, and source authority before another GSC recheck.

## Booking CRO Pass (2026-05-13)

Form Health & Friction Index before copy change: 74/100, usable with friction.

Primary bottleneck: value-effort balance. The form asked for an exact date/time while copy framed the page as booking/reserving, even though the business still confirms availability later. That can make the step feel higher-commitment than quote/contact for mobile users.

Change made: keep required operational fields, but reposition the page as a preferred-time request:

- `Reserve a free 15-minute assessment` -> `Request a preferred repair time`
- `Start Booking` -> `Request Time`
- `Request My Time` -> `Request Preferred Time`
- added clearer no-payment/final-confirmation copy around the form
- clarified date/time fields as preferred intake times, not guaranteed appointments

Measurement expectation: if commitment language was suppressing booking starts or outcomes, `/book` should show more `booking_form_start` and at least one `booking_submit_success` or `booking_submit_pending` in the next 7-day window.

## Indexing Quality Pass (2026-05-13)

Primary targets: `/services/pearl-restringing`, `/services/la-porte`, and `/blog/does-my-watch-need-battery-or-repair-pasadena`.

Change made: improve machine-readable quality signals without adding visible mobile clutter:

- service detail schema now exposes canonical URL, page entity, service type, image, and included repair options
- service-area schema now exposes page entity, description, and a focused offer catalog for the area’s highlighted repair paths
- article schema now exposes reviewed-by, author role, publisher URL/logo, topic entities, related service mentions, and absolute article image URL

Measurement expectation: these changes will not create immediate traffic by themselves, but they give Google and AI answer engines clearer entity relationships for the unresolved commercial pages before the next GSC recheck.

## Mobile CTA Friction Pass (2026-05-13)

Change made: reduced the mobile sticky quote shortcut's visual weight without changing the conversion path.

- kept the mobile shortcut to one action: `Get Fast Quote`
- preserved the quote attribution URL and `mobile_sticky_cta_click` event
- removed the heavy backdrop blur and reduced shadow, padding, and letter spacing
- added a regression check that the sticky CTA stays one link, remains tappable, and stays compact

Measurement expectation: this should reduce perceived mobile clutter while preserving the lowest-friction quote path. Watch `mobile_sticky_cta_click`, `quote_form_start`, and quote submissions over the next 7-day window.

## Indexing Recheck (2026-05-13)

Commands run:

- `npm run google:weekly-seo-health`
- `npm run google:seo-quick-wins`
- `npm run google:indexing-status`
- `npm run google:indexing-manifest`
- `npm run seo:internal-link-audit`

Findings:

- GSC movement improved for `/services/la-porte`, `/blog/does-my-watch-need-battery-or-repair-pasadena`, and `/blog/how-to-choose-a-jeweler`: all moved from unknown to discovered.
- `/blog/stone-security-checklist` regressed from discovered to unknown in URL Inspection API output.
- Repo and live-site evidence do not show a crawl-path defect for `/blog/stone-security-checklist`: it is in `src/lib/blog.ts`, generated into `sitemap.xml`, reachable at 200, and the internal-link audit reports 28 indexed-source links plus `/site-map`.
- The internal-link audit recommendation for all unresolved URLs is `Monitor GSC`; no unresolved target has fewer than two indexed-source links.

Decision: do not add more visible links or mobile sections right now. The current bottleneck is Google processing/index selection, not missing internal crawl paths. Keep the site uncluttered and recheck URL Inspection movement after the next crawl window.

## Guardrail

Avoid adding more visible mobile sections unless they remove uncertainty or improve conversion. SEO/GEO/AEO content should be useful, extractable, and crawlable, but it must not create a cluttered mobile decision path.
