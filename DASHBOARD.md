# Weekly Growth Dashboard

This file is the lightweight source of truth for weekly SEO and analytics review.

## Goal

Track whether Google visibility, production-host organic sessions, and high-intent repair conversions are moving in the right direction after the Wix -> Vercel migration.

## Commands

Run these from the repo root:

```bash
npm run google:kpi-weekly-snapshot
npm run google:reconcile-90d
npm run google:weekly-seo-health
npm run google:seo-quick-wins
```

Generated outputs:

- `.health/kpi-weekly-snapshot-latest.md`
- `.health/ga4-gsc-reconciliation-90d-latest.md`
- `.health/weekly-seo-health-latest.md`
- `.health/seo-quick-wins-latest.json`
- `Docs/SEO_QUICK_WINS.md`

## Automation

The repo now includes a scheduled GitHub Actions workflow at [.github/workflows/weekly-health.yml](/c:/Users/ninef/SanLuis%20Solutions%20projects/sjr-new-website-aiproject/.github/workflows/weekly-health.yml).

- Schedule: every Monday at `14:00 UTC`
- Reminder surface: GitHub issue `Weekly SEO Health Report` plus a fresh weekly comment on that issue
- Artifacts: each run uploads the latest weekly KPI snapshot, weekly SEO health snapshot, and 90-day reconciliation to the workflow run

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
Use `.health/kpi-weekly-snapshot-latest.md` for the funnel and route-conversion drill-down.

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

Week ending `2026-04-09`:

| Metric | Value |
| --- | --- |
| Google Search clicks | `6` |
| Google Search impressions | `667` |
| Production-host organic sessions | `0` |
| Quote + booking starts | `0` |
| Quote + booking outcomes | `0` |

Supporting stats from `.health/kpi-weekly-snapshot-latest.md`:

- Active users: `0`
- Sessions: `0`
- Engaged sessions: `0`
- Page views: `0`
- CTR: `0.90%`
- Average position: `16.59`

## Current Quick-Win Cluster

Latest GSC quick-win audit: `Docs/SEO_QUICK_WINS.md`

- Primary opportunity page: `/`
- Top query cluster:
  - `jewelry repair near me`
  - `jewelry store near me`
  - `jewelry store pasadena tx`
  - `jewelry repair pasadena`
- Immediate CTR test now live:
  - homepage title and description were rewritten locally to push stronger near-me/Pasadena value props
- Current interpretation:
  - visibility exists, but the site is still outside the reliable click zone on most terms
  - CTR remains the fastest near-term lever while waiting on broader ranking movement
  - the CTR test does not start until the homepage metadata rewrite is deployed to production

## Review Rhythm

1. Run the three Google commands every Monday.
2. Review `Docs/WEEKLY-SEO-HEALTH.md`.
3. Review `.health/kpi-weekly-snapshot-latest.md` for funnel and route-level detail.
4. Update this file with the latest KPI row and action items.
5. Review `Docs/SEO_QUICK_WINS.md` and note whether the homepage quick-win cluster changes.
6. If Google clicks rise but production-host organic sessions do not, inspect analytics bootstrap, redirects, and canonicals first.
7. If organic sessions rise but quote/booking starts do not, review landing-page CTA clarity and form friction next.
