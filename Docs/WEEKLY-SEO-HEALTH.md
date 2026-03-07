# Weekly SEO Health Checklist

Run this once per week after:

```bash
npm run google:reconcile-90d
npm run google:weekly-seo-health
```

Automated option:

- GitHub Actions workflow: `.github/workflows/weekly-health.yml`
- Schedule: every Monday at `14:00 UTC`
- Reminder surface: GitHub issue `Weekly SEO Health Report`
- Required GitHub secrets:
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- Optional GitHub repository variables:
  - `SEARCH_CONSOLE_PROPERTY`
  - `GA4_PROPERTY_ID`

## Technical Integrity

- `https://www.susiesjewelryrepair.com/sitemap.xml` loads successfully
- `robots.txt` still points to the canonical sitemap
- homepage canonical is correct
- `/services` canonical is correct
- redirected Wix URLs still return `301`
- redirected destinations return `200`
- legacy Wix URLs are not reappearing in the sitemap

## Analytics Integrity

- production GA is firing only on `www.susiesjewelryrepair.com`
- no new localhost or preview hostnames show up in GA4 hostname reports
- Search Console is linked to the correct GA4 stream
- GA4 key events still include:
  - `quote_submit_success`
  - `booking_submit_success`
  - `booking_submit_pending`
  - `contact_submit_success`
- quote and booking starts are still being captured

## Search Visibility

- Google Search clicks reviewed week over week
- Google Search impressions reviewed week over week
- CTR reviewed for unusual drops
- average position reviewed for unusual drops
- top landing pages reviewed
- top landing pages do not show unexpected legacy URLs dominating

## Commercial Intent

- quote starts reviewed
- booking starts reviewed
- quote outcomes reviewed
- booking outcomes reviewed
- if starts increase but outcomes do not, log a CRO follow-up

## Escalation Rules

Escalate immediately if any of these happen:

- localhost traffic reappears materially in GA4
- preview-host traffic becomes non-trivial again
- redirected legacy URLs stop resolving
- Search Console starts surfacing new Wix-era `404` patterns
- Google clicks rise but the landing pages are mismatched to intent
- quote/booking starts or outcomes drop sharply without a known cause
