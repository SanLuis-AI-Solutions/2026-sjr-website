# Measurement and Conversion Hardening

Date: 2026-05-05

## Purpose

This phase improves lead attribution and conversion evidence without changing the active indexing experiment. The goal is to make every submitted lead traceable back to its first landing page, campaign parameters, referrer, and paid-click identifiers.

## Implemented

### First-Touch Capture

The GA first-touch payload now records:

- Landing path and query string
- Referrer
- UTM source, medium, campaign, term, content, and id
- Google/Bing click identifiers: `gclid`, `gbraid`, `wbraid`, `msclkid`
- First-touch timestamp

### Lead Form Attribution

Quote, booking, and contact forms now include hidden attribution fields populated client-side from the first-touch session data:

- `/quote`
- `/book`
- `/contact`

### Server-Side Lead Persistence

Attribution is appended to the internal stored lead notes for quote, booking, and contact submissions. This avoids a Supabase schema migration while preserving source evidence in the lead record, Google Chat alert, and internal lead email.

Spam checks and customer-facing booking details intentionally use customer-entered notes, not the attribution block.

## Event Model

Current high-value GA4 events:

- `lead_form_start`
- `{lead_type}_form_start`
- `lead_form_step`
- `lead_form_submit_attempt`
- `quote_submit_success`
- `booking_submit_success`
- `booking_submit_pending`
- `contact_submit_success`
- `conversion_quick_action_click`

Recommended GA4 conversions:

- `quote_submit_success`
- `booking_submit_success`
- `booking_submit_pending`
- `contact_submit_success`
- `phone_call`
- `email_contact`
- `directions`

## Measurement Readiness

Before this phase, lead records were mostly tied to immediate page referrer only. After this phase, they carry first-touch source evidence, campaign IDs, and submit path.

Remaining gaps:

- Confirm GA4 admin has the recommended conversion events marked as key events.
- Confirm Supabase reporting dashboards include source segmentation from the stored notes or future structured columns.
- Add a post-indexing report that compares lead source by landing page after Google has had time to process the sitemap/internal-link improvements.

## Next Phase

The next highest-value work is CRO/AEO content that does not disturb the indexing experiment:

- Add concise decision-answer blocks to major commercial service pages.
- Add local proof/photo placeholders where the business can provide real examples.
- Review quote and booking form drop-off after the first full week of attribution data.
