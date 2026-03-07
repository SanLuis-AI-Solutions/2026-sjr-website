# Weekly Growth Dashboard

This file is the lightweight source of truth for weekly SEO and analytics review.

## Goal

Track whether Google visibility, production-host organic sessions, and high-intent repair conversions are moving in the right direction after the Wix -> Vercel migration.

## Commands

Run these from the repo root:

```bash
npm run google:reconcile-90d
npm run google:weekly-seo-health
```

Generated outputs:

- `.health/ga4-gsc-reconciliation-90d-latest.md`
- `.health/weekly-seo-health-latest.md`

## Automation

The repo now includes a scheduled GitHub Actions workflow at [.github/workflows/weekly-health.yml](/c:/Users/ninef/SanLuis%20Solutions%20projects/sjr-new-website-aiproject/.github/workflows/weekly-health.yml).

- Schedule: every Monday at `14:00 UTC`
- Reminder surface: GitHub issue `Weekly SEO Health Report` plus a fresh weekly comment on that issue
- Artifacts: each run uploads the latest `.health` snapshots to the workflow run

Required GitHub secrets:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Optional GitHub repository variables:

- `SEARCH_CONSOLE_PROPERTY`
- `GA4_PROPERTY_ID`

## Core Weekly KPIs

Track these 5 metrics every week:

1. Google Search clicks
2. Google Search impressions
3. Production-host organic sessions
4. Quote + booking starts
5. Quote + booking outcomes

## Metric Definitions

| Metric | Definition |
| --- | --- |
| Google Search clicks | Search Console web clicks for the canonical `https://www.susiesjewelryrepair.com/` property |
| Google Search impressions | Search Console web impressions for the canonical property |
| Production-host organic sessions | GA4 sessions filtered to `www.susiesjewelryrepair.com` and `Organic Search` |
| Quote + booking starts | `quote_form_start + booking_form_start` |
| Quote + booking outcomes | `quote_submit_success + booking_submit_success + booking_submit_pending` |

## Known Caveats

- GA4 totals before the host-gating fix are polluted by localhost traffic.
- Search Console clicks and GA4 sessions are related, but they are not the same metric.
- Last-7-day numbers may stay low for a while; the important thing is clean trend direction, not vanity totals.

## Weekly Entry Template

Copy this block each week and replace the values with the latest numbers from `.health/weekly-seo-health-latest.md`.

```md
## Week of YYYY-MM-DD

- Reporting window:
- Google Search clicks:
- Google Search impressions:
- Production-host organic sessions:
- Quote + booking starts:
- Quote + booking outcomes:

### Top landing pages
- 1.
- 2.
- 3.

### Top movers
- Positive:
- Negative:

### Pages to watch
- 

### Action items
- 
```

## Current Baseline

Week ending `2026-03-06`:

| Metric | Value |
| --- | --- |
| Google Search clicks | `8` |
| Google Search impressions | `506` |
| Production-host organic sessions | `0` |
| Quote + booking starts | `0` |
| Quote + booking outcomes | `0` |

## Review Rhythm

1. Run the two Google commands every Monday.
2. Review `Docs/WEEKLY-SEO-HEALTH.md`.
3. Update this file with the latest KPI row and action items.
4. If Google clicks rise but production-host organic sessions do not, inspect redirects and canonicals first.
5. If organic sessions rise but quote/booking starts do not, review landing-page CTA clarity and form friction next.
