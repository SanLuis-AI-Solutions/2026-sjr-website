# Conversion Measurement Taxonomy

Date: 2026-02-19

## Service Journey Events
- `service_card_click`
  - Fires on home/services-hub service-card clicks.
  - Params: `service_slug`, `service_name`, `placement`, `destination`, `page_path`.
- `services_hub_cta_click`
  - Fires on services hub quote/book CTAs.
  - Params: `placement`, `cta_target`, `destination`, `page_path`.
- `service_section_view`
  - Fires once per service-detail section when in-view threshold is reached.
  - Params: `service_slug`, `section_id`, `page_path`.
- `service_faq_open`
  - Fires when a service FAQ item is expanded.
  - Params: `service_slug`, `question`, `page_path`.
- `service_decision_expand`
  - Fires when decision-module disclosure opens.
  - Params: `service_slug`, `page_path`.
- `service_market_expand`
  - Fires when market-range disclosure opens.
  - Params: `service_slug`, `page_path`.
- `service_cta_click`
  - Fires on service-detail quote/book CTAs across hero/sections/mobile bar.
  - Params: `service_slug`, `placement`, `cta_target`, `destination`, `page_path`.

## Form Funnel Events
- `lead_form_start`
  - First interaction with quote/book/contact form.
  - Params: `form_id`, `lead_type`, `source`, `page_path`.
- `lead_form_step`
  - First focus on each field per form session.
  - Params: `form_id`, `lead_type`, `field_name`, `page_path`.
- `lead_form_submit_attempt`
  - Submit action attempted on form.
  - Params: `form_id`, `lead_type`, `page_path`.
- `lead_form_error`
  - Error state rendered after submit/navigation cycle.
  - Params: `form_id`, `lead_type`, `page_path`.
- Existing success events retained:
  - `quote_submit_success`
  - `booking_submit_success`
  - `booking_submit_pending`
  - `contact_submit_success`

## Validation Surfaces
- Tracked links: `src/components/analytics/tracked-link.tsx`
- Service interactions: `src/components/analytics/service-interaction-tracker.tsx`
- Form interactions: `src/components/analytics/lead-form-tracker.tsx`
