# GA4 Baseline Run (7-Day)

Date: 2026-02-19  
Scope: Conversion + service-interaction baseline capture for GA4/GSC.

## Commands Executed

```bash
npm run google:verify-access
npm run google:report-weekly
npm run google:baseline-7d
```

## Result

- Access verification: PASS
  - GSC property access confirmed (`https://www.susiesjewelryrepair.com/`)
  - GA4 account/property access confirmed
  - GA4 report query returned rows
- Weekly report generated:
  - `.health/google-weekly-report-2026-02-18.md`
  - `.health/google-weekly-report-latest.md`
- Baseline snapshots generated:
  - `.health/ga4-baseline-7d-2026-02-18.json`
  - `.health/ga4-baseline-7d-2026-02-18.md`
  - `.health/ga4-baseline-7d-latest.json`
  - `.health/ga4-baseline-7d-latest.md`

## Baseline Notes

- Date range for this baseline is `2026-02-12` to `2026-02-18` (script uses trailing full days and excludes same-day partial traffic).
- New service/funnel events were deployed after this range, so event counts are expected to be near zero in this first baseline file.
- This baseline is still useful as the pre-optimization reference point for week-over-week comparisons.

## Operational Path

- Repeat daily/weekly:
  - `npm run google:baseline-7d`
- Compare snapshots:
  - latest vs prior dated baseline files under `.health/`.
