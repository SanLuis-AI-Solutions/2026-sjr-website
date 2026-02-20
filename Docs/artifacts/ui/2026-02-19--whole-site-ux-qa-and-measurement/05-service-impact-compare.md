# Service Impact Compare Run

Date: 2026-02-20

## Command

```bash
npm run google:service-impact-compare
```

## Outputs

- `.health/service-impact-compare-2026-02-19.json`
- `.health/service-impact-compare-2026-02-19.md`
- `.health/service-impact-compare-latest.json`
- `.health/service-impact-compare-latest.md`

## Scope

- Compares current complete 7-day window vs prior 7-day window for:
  - service-detail route views (`/services/<slug>`)
  - service interaction events
  - lead funnel event counts.

## Current Readout Notes

- Current service-detail page views are populated.
- Prior window values returned `0` in this run, so percentage deltas are `n/a`.
- This report is now operational; as data accumulates it becomes the decision source for:
  - service image effectiveness
  - service-route prioritization
  - conversion bottleneck diagnosis.
