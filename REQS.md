# REQS.md

Status: Active
Last updated: 2026-02-11
Source of truth for plan: Docs/PLAN-sjr-website.md
Document index: DECISIONS.md

Map PRD requirements to build tasks.

## Requirements
- Requirement: Services hub + individual service pages (9 services)
  Source (PRD section): 5. Content Strategy
  Owner: frontend-specialist
  Status: Done
  Notes: Implemented dynamic service pages at `/services/[slug]`. Scope locked at 9 services.

- Requirement: Answer-first formatting + FAQ per service
  Source (PRD section): 7. SEO & AEO Strategy
  Owner: seo-specialist
  Status: Done
  Notes: `/services/[slug]` now renders an answer-first intro block, FAQ section with fallback questions, and related-service internal links across all 9 services.

- Requirement: LocalBusiness + Service + FAQPage schema
  Source (PRD section): 7. SEO & AEO Strategy
  Owner: seo-specialist
  Status: Done
  Notes: LocalBusiness schema is on Home; Service and FAQPage schema are rendered on each service page using resolved FAQ content.

- Requirement: Fast Quote flow (photo upload + range)
  Source (PRD section): 6.1 Fast Quote Agent
  Owner: backend-specialist
  Status: In Progress
  Notes: Quote submissions store to Supabase (DB row + photo uploads to Storage), notify Google Chat, and trigger SMTP email alerts (validated in production on 2026-02-11). Price-range AI still pending.

- Requirement: Booking flow creates Google Calendar event
  Source (PRD section): 6.1 Fast Quote Agent / Booking
  Owner: backend-specialist
  Status: Done
  Notes: Booking submissions store in Supabase, create Google Calendar events, notify Google Chat, and trigger SMTP email alerts when configured. Production now uses group calendar `3349b5d01512a5fdea27c0c5e26dd055f2516946d0196ef9b68d4b97a04eabf5@group.calendar.google.com`; pending fallback remains for resilience.

- Requirement: Contact flow captures leads + routes notifications
  Source (PRD section): 6. Conversion Paths / Contact
  Owner: backend-specialist
  Status: Done
  Notes: `/contact` posts to `/api/contact`, stores `contact_requests`, notifies Google Chat (contacts key fallback to default webhook), triggers SMTP email alerts, and surfaces entries in `/admin/inbox`. Production smoke test completed on 2026-02-11 (`ok: true` response + DB row persisted).

## Template
- Requirement:
- Source (PRD section):
- Owner:
- Status:
- Notes:

