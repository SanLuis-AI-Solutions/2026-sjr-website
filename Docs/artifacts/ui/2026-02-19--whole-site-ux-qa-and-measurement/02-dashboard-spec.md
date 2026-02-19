# Dashboard Spec (GA4 / Exploration)

Date: 2026-02-19

## Objective
Measure route-level and service-level progression from content exploration to quote/book/contact conversion.

## Core Views

### 1) Route Conversion Overview
- Dimension: `page_path`
- Metrics:
  - Users
  - `service_card_click`
  - `services_hub_cta_click`
  - `service_cta_click`
  - lead submit success events
- KPI: `lead submit success / users` by route.

### 2) Service Detail Performance
- Dimension: `service_slug`
- Metrics:
  - `service_section_view` (counts by `section_id`)
  - `service_faq_open`
  - `service_decision_expand`
  - `service_market_expand`
  - `service_cta_click`
  - downstream lead success events.
- KPI: `service_cta_click / service_detail_users`.

### 3) Form Completion + Abandonment
- Dimension: `form_id`, `lead_type`
- Funnel:
  - `lead_form_start`
  - `lead_form_step`
  - `lead_form_submit_attempt`
  - `quote_submit_success` | `booking_submit_success|pending` | `contact_submit_success`
- KPI: submit-attempt rate, success rate, and drop-off by lead type.

### 4) Conversion Quick-Action Experiment
- Dimensions:
  - `eventName` (`conversion_quick_action_click_control` vs `conversion_quick_action_click_primary_focus`)
  - optional parameter breakouts via `cta_variant`.
- Metrics:
  - quick-action click volume per variant
  - downstream `lead_form_start` and submit-success volume.
- KPI: quick-action to form-start lift by variant.

## Segments
- Device category (`mobile`, `desktop`)
- Landing source (`utm_source`, `utm_medium`)
- Entry route group (home/services/blog/faq/contact)
- CTA variant (`control`, `primary_focus`) where available.
