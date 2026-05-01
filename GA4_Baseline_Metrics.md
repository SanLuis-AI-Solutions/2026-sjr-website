# GA4 Baseline Metrics

Generated: 2026-04-29
GA4 property: 350925141
Measurement ID: G-WLKM8DCB5M
GSC property: https://www.susiesjewelryrepair.com/

## 7-Day Baseline

Date range: 2026-04-22 to 2026-04-28

| Metric | Value |
| --- | ---: |
| Active users | 77 |
| Sessions | 87 |
| Engaged sessions | 18 |
| Page views | 119 |
| GSC clicks | 13 |
| GSC impressions | 1,121 |
| GSC CTR | 1.16% |
| GSC average position | 17.84 |
| Organic sessions on production host | 14 |
| Total sessions on production host | 87 |

## Conversion/Event Baseline

| Event | 7-day count |
| --- | ---: |
| quote_form_start | 3 |
| booking_form_start | 2 |
| lead_form_start | 5 |
| lead_form_step | 19 |
| lead_form_submit_attempt | 3 |
| lead_form_error | 3 |
| quote_submit_success | 0 |
| booking_submit_success | 1 |
| booking_submit_pending | 0 |
| contact_submit_success | 0 |
| conversion_quick_action_click | 9 |
| service_section_view | 24 |

## Key Event Configuration

Verified via GA4 Admin API:

| Key event | Counting | Default value |
| --- | --- | ---: |
| quote_submit_success | Once per event | $45 USD |
| booking_submit_success | Once per event | $75 USD |
| contact_submit_success | Once per event | $25 USD |
| booking_submit_pending | Once per event | No default value |
| quote_form_start | Once per event | No default value |
| booking_form_start | Once per event | No default value |

## Traffic Sources And Landing Pages

Top organic landing pages for 2026-04-22 to 2026-04-28:

| Landing page | Organic sessions |
| --- | ---: |
| `/` | 9 |
| `/book` | 2 |
| `/blog/cost-to-resize-gold-ring-pasadena` | 1 |
| `/services/bracelet-repair` | 1 |
| `/services/watch-repair` | 1 |

## Validation

- `npm run google:verify-access`: passed for GSC and GA4.
- `npm run google:baseline-7d`: generated `.health/ga4-baseline-7d-latest.*`.
- `npm run google:weekly-seo-health`: generated `.health/weekly-seo-health-latest.*`.
- `npm run google:validate-prod-events`: passed event validation for service, lead form, quote, booking, and contact events.
- Remaining warning: validation captured GA bootstrap requests but no GA collect network requests. API-side event counts still changed as expected in the validation run, so treat this as a browser/network instrumentation warning to monitor rather than a current conversion-blocker.

## Measurement Readiness

Measurement Readiness & Signal Quality Index: 82/100, Usable with Gaps.

Primary gaps:
- Low event volume means baseline is directional, not statistically strong.
- Phone-call clicks showed 0 in the 7-day report despite visible `tel:` links; verify whether all phone CTAs are instrumented.
- Lead form errors equal submit attempts in the 7-day baseline, so review error causes before scaling traffic.
