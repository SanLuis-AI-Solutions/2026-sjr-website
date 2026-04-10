# Service-Page CTR Optimization (Batch 5B)

## Deployment Dependency

This batch should start **after** the homepage CTR rewrite is deployed and has at least `3-5` days of live data.

## Phase 1: Identify Quick-Win Service Keywords

After the homepage CTR test stabilizes:

- run `npm run google:seo-quick-wins`
- inspect whether `/services/*` routes start appearing in `Docs/SEO_QUICK_WINS.md`
- prioritize service pages with:
  - positions `6-20`
  - meaningful impressions
  - weak CTR relative to intent

## Phase 2: Rewrite Service Page Metadata

Priority order:

1. `/services/watch-repair`
2. `/services/ring-sizing`
3. `/services/stone-setting`

Pattern:

- include the problem
- include the service outcome
- include `Pasadena`
- include a trust or speed signal

Example direction:

- `Watch Battery Replacement in Pasadena — Same-Day Service, In-House Repair`
- `Ring Sizing in Pasadena — Same-Day Fit Adjustments, In-House Bench Work`
- `Loose Stone Repair in Pasadena — Prong Tightening & Setting Security`

## Phase 3: Add Content Sections

For each priority service page, add or strengthen:

- `How much does X cost?`
- `How long does X take?`
- `When should I get help?`
- a clear next-step CTA to `/quote` or `/book`

## Measurement

Track for each service page:

- impressions
- clicks
- CTR
- average position
- quote/book starts if GA4 reporting stabilizes

## Decision Rule

- if the homepage CTR test improves meaningfully, reuse the winning pattern on the first two service pages
- if the homepage CTR test is flat, revise the title/description pattern before scaling it

