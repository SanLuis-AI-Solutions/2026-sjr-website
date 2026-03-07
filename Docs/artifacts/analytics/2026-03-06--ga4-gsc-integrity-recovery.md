# GA4 + Search Console Integrity Recovery

## Metadata

- branch: `master`
- base commit reviewed: `ca57577`
- artifact path: `Docs/artifacts/analytics/2026-03-06--ga4-gsc-integrity-recovery.md`
- verification date: `2026-03-06`

## Goal

Reconcile the GA4 vs Search Console discrepancy after the Wix -> Vercel migration, stop non-production traffic pollution, restore legacy URL equity, and establish a weekly measurement routine the team can trust.

## Measurement Readiness & Signal Quality Index

- score: `57/100`
- verdict: `Unreliable`

### Scoring summary

| Category | Score | Notes |
| --- | --- | --- |
| Decision alignment | 20/25 | Core business questions are now clear: Google clicks, production-host organic sessions, quote starts, booking starts, and lead outcomes. |
| Event model clarity | 12/20 | Existing event taxonomy is strong, but quote vs booking starts were not separated before this pass. |
| Data accuracy & integrity | 5/20 | Pre-fix GA4 was materially polluted by localhost traffic. |
| Conversion definition quality | 9/15 | Submit-success events existed, but lead starts were too aggregated. |
| Attribution & context | 6/10 | First-touch capture existed, but weekly reporting was not production-host filtered. |
| Governance & maintenance | 5/10 | Google scripts existed, but no single repo-owned weekly dashboard/checklist was in place. |

## Verified Baseline

Source:

- `.health/ga4-gsc-reconciliation-90d-latest.md`
- `.health/weekly-seo-health-latest.md`

### 90-day reconciliation

| Metric | Value |
| --- | --- |
| GA4 active users | `2,366` |
| Production-host GA4 active users | `278` |
| Localhost / 127.0.0.1 users | `2,073` |
| Preview-host users | `15` |
| Search Console clicks | `102` |

Conclusion:

- The headline GA4 figure is not comparable to Search Console clicks because most GA4 users in the current 90-day window came from localhost traffic.

### Current 7-day weekly baseline

| Metric | Value |
| --- | --- |
| Google Search clicks | `8` |
| Google Search impressions | `506` |
| Production-host organic sessions | `0` |
| Quote + booking starts | `0` |
| Quote + booking outcomes | `0` |

Interpretation:

- The weekly numbers are currently low because the dashboard is now filtered to the real production host and last-7-day organic activity is sparse.
- This is the correct behavior for a trustable baseline.

## Implemented Changes

### 1. Production-only GA bootstrap

- file: `src/app/layout.tsx`
- file: `src/lib/analytics-host.ts`

Change:

- GA bootstrap now only activates when `window.location.hostname === "www.susiesjewelryrepair.com"`.
- localhost, `127.0.0.1`, and Vercel preview domains no longer load production GA.
- bootstrap now uses `send_page_view: false` so pageviews can be controlled explicitly.

### 2. Explicit App Router pageview tracking

- file: `src/components/analytics/ga-tracker.tsx`

Change:

- added `GaPageViewTracker`
- mounted it globally behind the GA measurement-id check
- route transitions now emit explicit `page_view` events on the production host only

### 3. Lead-start normalization

- file: `src/components/analytics/lead-form-tracker.tsx`

Change:

- kept `lead_form_start`
- added additive per-flow starts:
  - `quote_form_start`
  - `booking_form_start`
  - `contact_form_start`

Reason:

- the weekly dashboard can now distinguish quote/booking starts without losing the shared lead-start event.

### 4. Legacy Wix redirect recovery

- file: `next.config.ts`

Added permanent redirects:

| Legacy URL | Destination |
| --- | --- |
| `/ring-sizing-repair` | `/services/ring-sizing` |
| `/book-online` | `/book` |
| `/book-online/:path*` | `/book` |
| `/watch-repair-battery` | `/services/watch-repair` |
| `/necklace-bracelet-repair` | `/services/necklace-repair` |
| `/custom-work-restorations` | `/services/heirloom-restoration` |
| `/accessibility` | `/contact` |
| `/blank-2` | `/services` |

### 5. Reporting foundation

Added scripts:

- `scripts/google/reconcile-90d.mjs`
- `scripts/google/weekly-seo-health.mjs`

Added npm commands:

- `npm run google:reconcile-90d`
- `npm run google:weekly-seo-health`

Added reporting docs:

- `DASHBOARD.md`
- `Docs/WEEKLY-SEO-HEALTH.md`

## Walkthrough: Corrected Tracking Code

### GA bootstrap flow

1. `layout.tsx` injects a single inline bootstrap script when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is present.
2. The bootstrap script checks the runtime hostname.
3. If the hostname is not `www.susiesjewelryrepair.com`, it exits before loading `googletagmanager.com`.
4. If the hostname is allowed:
   - it creates the GA stub
   - sets `send_page_view: false`
   - loads GA on first intent or timeout
5. `GaPageViewTracker` handles pageviews for initial load and App Router navigation.

### Weekly reporting flow

1. Run `npm run google:reconcile-90d` after major tracking or redirect work.
2. Run `npm run google:weekly-seo-health` once per week.
3. Read:
   - `.health/ga4-gsc-reconciliation-90d-latest.md`
   - `.health/weekly-seo-health-latest.md`
4. Copy the numbers into `DASHBOARD.md` if you want a persistent weekly history in-repo.

## GA4 + GSC Admin Steps

These steps still require a logged-in Google admin session.

### Link Search Console to GA4

1. Open GA4 Admin.
2. Go to `Product links`.
3. Open `Search Console Links`.
4. Click `Link`.
5. Select the canonical Search Console property:
   - `https://www.susiesjewelryrepair.com/`
6. Select the production web data stream for `www.susiesjewelryrepair.com`.
7. Save and publish.

Important expectation:

- this enables Search Console reporting inside GA4
- it does not turn the standard GA4 Acquisition report into a perfect merged “GSC clicks + GA sessions” table
- the repo dashboard remains the cleanest weekly operational view

### GA4 admin cleanup

Confirm:

1. the production web stream is the one used for the real site
2. enhanced measurement is intentional
3. key events are marked for:
   - `quote_submit_success`
   - `booking_submit_success`
   - `booking_submit_pending`
   - `contact_submit_success`
4. if desired, also mark:
   - call clicks
   - map / directions clicks

### GSC cleanup

1. resubmit `https://www.susiesjewelryrepair.com/sitemap.xml`
2. inspect:
   - `/`
   - `/services`
   - `/book`
   - one blog article
   - one geo page
   - one redirected Wix URL
3. monitor the `Not found (404)` and `Page with redirect` groups over the next 2 to 4 weeks

## Verification

Local:

- `npm run build`
- `npm test`
- `npm run google:reconcile-90d`
- `npm run google:weekly-seo-health`

Targeted test coverage added:

- localhost does not load production GA script
- legacy Wix routes redirect into live pages
- sitemap includes current geo routes and excludes legacy Wix paths

## Risks

- Search Console legacy URLs with long query strings may continue appearing for a while even after redirects are live.
- Production-host organic sessions can remain near zero in a 7-day window if search traffic is still thin.
- GA4 admin linking still needs a human-admin completion step.

## Decision

- accept and keep live

Reasoning:

- this fixes the main integrity problem first
- it restores SEO continuity on legacy paths with observed search demand
- it creates a lightweight weekly operating loop without waiting for a full BI layer

## Next Optimal Step

Complete the GA4 and Search Console admin-side cleanup:

1. link Search Console to GA4
2. verify key events in GA4 admin
3. resubmit the sitemap in GSC
4. monitor redirected Wix URLs and organic landing pages for 2 weeks before adjusting the redirect map again
