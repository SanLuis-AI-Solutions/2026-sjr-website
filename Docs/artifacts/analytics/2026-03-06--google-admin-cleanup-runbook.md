# Google Admin Cleanup Runbook

## Metadata

- branch: `master`
- base commit reviewed: `b3d9bf1`
- artifact path: `Docs/artifacts/analytics/2026-03-06--google-admin-cleanup-runbook.md`
- prepared on: `2026-03-06`
- related automation validation run: `22792076143`

## Goal

Complete the one-time Google-admin side cleanup for:

1. GA4 key-event configuration
2. Search Console to GA4 linking
3. Search Console sitemap submission and URL inspection

This runbook is written for the current Susie's Jewelry Repair production setup:

- canonical site: `https://www.susiesjewelryrepair.com`
- GA4 property ID: `350925141`
- production host tracked in code: `www.susiesjewelryrepair.com`

## What Is Already Done In Code

These items are already live and do not need to be re-implemented in Google:

- production GA only fires on `www.susiesjewelryrepair.com`
- localhost and preview domains are blocked from production GA
- App Router pageviews are tracked explicitly
- quote and booking start events now exist as separate events
- legacy Wix redirects are live
- weekly reporting automation is live in GitHub Actions

## Step 1: Verify The Correct GA4 Property And Web Stream

In GA4:

1. Open `Admin`.
2. Confirm you are in the correct property for Susie's Jewelry Repair.
3. Under `Data collection and modification`, open `Data streams`.
4. Open the website stream for the live site.

Confirm these items:

- website URL is the production site
- Measurement ID matches the live site stream
- stream is for the canonical production site, not a test stream

If there are multiple web streams:

- keep the production stream
- do not link Search Console to a dev or preview stream

## Step 2: Mark The Correct GA4 Events As Key Events

Google now uses the term `key events`.

In GA4:

1. Open `Admin`.
2. Under `Data display`, open `Events`.
3. In the existing events table, find and mark these as key events:
   - `quote_submit_success`
   - `booking_submit_success`
   - `booking_submit_pending`
   - `contact_submit_success`

Recommended next-tier key events:

- `quote_form_start`
- `booking_form_start`

Use these rules:

- mark submit-success and pending-success style events as key events first
- only mark start events if you want funnel visibility inside GA4 reports
- do not mark noisy navigation events as key events

Suggested counting method:

- use `Once per event` for the submit and pending events
- if you later decide to mark form starts as key events, `Once per session` can be reasonable, but only if you want deduplicated lead-start counts

## Step 3: Link Search Console To GA4

In GA4:

1. Open `Admin`.
2. Open `Product links`.
3. Open `Search Console Links`.
4. Click `Link`.
5. Choose the canonical Search Console property:
   - `https://www.susiesjewelryrepair.com/`
6. Choose the production web stream for `www.susiesjewelryrepair.com`.
7. Save.

Expected result:

- GA4 gets Search Console reporting integration
- this does not replace the repo-owned weekly dashboard
- use the repo dashboard as the operating view, and GA4 linked Search Console reports as a secondary check

## Step 4: Resubmit The Sitemap In Search Console

In Google Search Console:

1. Open the canonical property:
   - `https://www.susiesjewelryrepair.com/`
2. Open `Sitemaps`.
3. Submit or resubmit:
   - `https://www.susiesjewelryrepair.com/sitemap.xml`

Expected result:

- Search Console accepts the sitemap
- the sitemap reflects current routes only
- old Wix paths are not listed there

## Step 5: Inspect Key URLs In Search Console

Use the URL Inspection tool on these exact URLs:

- `https://www.susiesjewelryrepair.com/`
- `https://www.susiesjewelryrepair.com/services`
- `https://www.susiesjewelryrepair.com/book`
- `https://www.susiesjewelryrepair.com/blog/cost-to-resize-gold-ring-pasadena`
- `https://www.susiesjewelryrepair.com/services/deer-park`
- `https://www.susiesjewelryrepair.com/ring-sizing-repair`

What to look for:

- URL is known to Google
- live test can fetch the page
- selected canonical is the expected canonical URL
- redirected Wix URL resolves through redirect handling instead of staying as a not-found page

## Step 6: Check Search Console Indexing Buckets

In Search Console, review:

- `Pages`
- `Sitemaps`

Focus on:

- `Not found (404)`
- `Page with redirect`
- `Alternate page with proper canonical tag`

Expected interpretation:

- some legacy Wix URLs may continue to appear for a while
- the redirect bucket may grow temporarily, which is fine
- the 404 cluster should gradually shrink as Google recrawls and processes the redirects

## Step 7: Validate The Weekly Reminder Loop

The weekly automation is now live.

Validated runs:

- `22791746557`
  - workflow succeeded
  - SEO snapshots skipped because GitHub secrets were not yet configured
- `22792076143`
  - workflow succeeded
  - weekly SEO snapshots ran successfully after secrets and variables were added

What to check weekly:

1. Open the GitHub issue `Weekly SEO Health Report`.
2. Confirm the latest weekly comment appeared.
3. Open the latest workflow run artifact if needed.
4. Review:
   - Google clicks
   - Google impressions
   - production-host organic sessions
   - quote + booking starts
   - quote + booking outcomes

## One-Sentence Explanation Of The GA4 vs GSC Gap

Use this internally:

> GA4 was inflated by local and dev traffic, while Search Console reflects Google clicks only, so the original numbers were never directly comparable.

## Completion Checklist

- [ ] Correct GA4 property and production stream confirmed
- [ ] `quote_submit_success` marked as key event
- [ ] `booking_submit_success` marked as key event
- [ ] `booking_submit_pending` marked as key event
- [ ] `contact_submit_success` marked as key event
- [ ] Search Console linked to the correct GA4 web stream
- [ ] Sitemap resubmitted in Search Console
- [ ] Homepage URL Inspection reviewed
- [ ] Services URL Inspection reviewed
- [ ] Book URL Inspection reviewed
- [ ] One commercial blog post reviewed
- [ ] One geo page reviewed
- [ ] One redirected Wix URL reviewed

## Done / Not Done / Risks

Done:

- production measurement integrity fix
- weekly GitHub reminder automation
- redirect recovery
- reporting docs and scripts

Not done from this runtime:

- actual Google-admin clicks in GA4 and Search Console

Risks:

- Search Console may take time to reflect redirect cleanup
- key events do not backfill historically
- field data can still lag even when lab checks are healthy
