# PLAN-sjr-website.md
Version: 0.3

Status: Active (source of truth plan)
Last updated: 2026-02-11
Document index: DECISIONS.md

## Overview
Build a high-performance, SEO-first lead-generation website for Susie’s Jewelry Repair with a luxury-modern brand identity, transparent pricing, and two primary conversion paths: Fast Quote and Book a Repair. Includes a new in-house booking system integrated with Google Workspace Calendar and a blog structure ready for automation.

## Project Type
WEB (Next.js App Router + Tailwind)

## Success Criteria
- LCP < 1.2s on Home and Services
- Primary CTAs present above the fold: Get Fast Quote + Book a Repair
- Services hub + individual service pages for all offered services (9 total)
- LocalBusiness + Service + FAQPage schema on relevant pages
- Answer-first section on every service page
- Booking flow creates Google Calendar event via Workspace integration
- Blog section online (structure only) with SEO-ready templates

## Tech Stack
- Next.js (App Router) + TypeScript + Tailwind
- Vercel (hosting)
- Supabase (data for services, pricing, leads, blog later)
- Google Workspace (Calendar integration for bookings)
- Stitch (design exploration/visual layouts)

## File Structure (Target)
- src/app/(site)/page.tsx (Home)
- src/app/services/page.tsx (hub)
- src/app/services/[slug]/page.tsx (detail)
- src/app/about/page.tsx
- src/app/faq/page.tsx
- src/app/contact/page.tsx
- src/app/blog/page.tsx (listing)
- src/app/blog/[slug]/page.tsx (template)
- src/components/* (layout sections)
- src/lib/schema.ts (JSON-LD helpers)
- src/lib/constants.ts (business info)
- src/styles/* (global tokens)

## Task Breakdown

### T0 — Content Pipeline (Airtable → Supabase → Site)
- INPUT: Airtable base + schema, Supabase project
- OUTPUT: Sync scripts, Supabase tables, site reads from Supabase with fallbacks
- VERIFY: services + FAQs render from Supabase; sync completes without errors

### T1 — Brand + Visual System (frontend-specialist + ui-ux-pro-max)
- INPUT: logo, business card, hero examples, brand identity outputs
- OUTPUT: color tokens, typography, spacing scale, layout grid, hero layout spec
- VERIFY: theme tokens defined; hero layout spec approved

### T2 — Content & IA Consolidation (seo-specialist + content-strategist)
- INPUT: current site services list + project brief goals
- OUTPUT: IA for pages, hero copy, service list + descriptions, FAQs (9 services)
- VERIFY: page structure and copy map approved

### T3 — Stitch Exploration (frontend-specialist + design-md)
- INPUT: visual system + hero reference
- OUTPUT: 1–2 stitched layout variations (hero + services + trust block)
- VERIFY: selected layout direction

### T4 — Site Build (frontend-specialist)
- INPUT: approved layout + IA
- OUTPUT: Home, Services, About, FAQ, Contact, Blog pages scaffolded
- VERIFY: pages render, responsive at 375/768/1024/1440

### T5 — Booking System (backend-specialist + automation-architect)
- INPUT: booking requirements, Google Workspace calendar access
- OUTPUT: booking form + API route + calendar event creation
- VERIFY: booking creates calendar event with correct details

### T6 — Fast Quote (backend-specialist + analytics-lead)
- INPUT: quote form fields, lead capture requirements
- OUTPUT: quote form + submission storage (Supabase)
- VERIFY: lead captured; confirmation shown

### T7 — SEO & Schema (seo-specialist)
- INPUT: page copy + business details
- OUTPUT: JSON-LD for LocalBusiness, Service, FAQPage
- VERIFY: schema embeds correctly and validates

### T8 — QA + Performance (performance-optimizer + test-engineer)
- INPUT: built site
- OUTPUT: QA report + fixes
- VERIFY: Lighthouse > 95, mobile layout clean, no critical issues

## Dependencies
- T1 before T3/T4
- T2 before T4/T7
- T5 before launch
- T7 before QA

## Risks / Open Questions
- Booking flow: define fields and buffer rules
- Calendar integration: OAuth credentials and consent
- Content approvals for service descriptions

## Verification Checklist (Phase X)
- npm run build passes
- Lighthouse performance >= 95 on key pages
- Schema validation passes
- Booking flow creates calendar event
- Fast Quote captures lead in Supabase

## Progress Notes (2026-02-02)
- Completed Airtable → Supabase sync pipeline with scripts and schema.
- Home page redesign in progress (hero + in-house authority + story + testimonials + CTA).
- Pending: add service images in Airtable and re-sync to populate image_url.
- Pending: finish layout/design across remaining pages (Services, About, FAQ, Contact, Blog).

## Progress Notes (2026-02-10)
- Fast Quote: form supports photo uploads; API stores quote request in Supabase and uploads images to Storage (bucket configurable via env).
- Booking: form submission stored in Supabase; API attempts Google Calendar event creation (pending valid service-account private key + calendar share).

## Progress Notes (2026-02-11)
- Admin inbox added at `/admin/inbox` (Basic Auth) to review and update quote/booking statuses.
- Google Chat notifications enabled for new quotes and bookings via webhook.
- Service detail template polished for all 9 services: answer-first intro, FAQ fallback content, and related-service internal links.
- GA4 conversion events added for quote and booking success states with first-touch UTM capture.
- Contact form upgraded to a real submission flow (`/api/contact`) with Supabase capture, optional dedicated Google Chat webhook, GA4 conversion event, and admin inbox status controls.
- Supabase migration `add_contact_requests_table_20260211` applied to project `lrzrltjlfvvrdvxqqklm`.
- Deployed to production alias `https://sjr-new-website-aiproject.vercel.app` and smoke-tested `/api/contact` end-to-end (submission + persistence verified).
- Removed Home page "Repair Impact" (`BeforeAfterSlider`) section and deployed to production.
- Added SMTP-based lead email notifications for quotes, bookings, and contact submissions (best-effort, non-blocking when SMTP is not configured).
- Added timezone normalization for booking validation/calendar payloads to avoid hidden-whitespace env issues.
- Production smoke tests run for `/api/quote`, `/api/book`, and `/api/contact`; all persisted in Supabase, with booking gracefully marked `pending` when Calendar auth fails.
- Calendar booking fix completed: updated production `GOOGLE_CALENDAR_ID` to `3349b5d01512a5fdea27c0c5e26dd055f2516946d0196ef9b68d4b97a04eabf5@group.calendar.google.com`, de-duplicated stale Vercel env keys, redeployed, and validated live booking status `booked` with a created Google Calendar event.
- SMTP wiring deployed and production env synced; runtime logs currently show `smtp_send_failed` (`535 Username and Password not accepted`) for Gmail auth, indicating credential/app-password issue rather than app logic.
- SMTP credentials updated and revalidated: local SMTP connectivity test passed; production quote/booking/contact smoke tests passed with no `smtp_send_failed` runtime logs in the validation window.
- Added email-auth runbook `Docs/EMAIL_AUTH_SETUP.md` after DNS audit (SPF present, DKIM/DMARC missing) to harden deliverability.

## Docs Sync Checklist
- PLAN: Docs/PLAN-sjr-website.md (this file)
- PRD: Docs/Agentic Susies Jewelry Repair PRD Final.md
- Brief: PROJECT_BRIEF.md
- Roadmap: ROADMAP.md
- Requirements: REQS.md
- Stitch prompt: Docs/STITCH_PROMPT.md
- Decision log: DECISIONS.md

