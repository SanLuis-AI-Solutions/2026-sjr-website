# PLAN-susies-jewelry-repair.md

Status: Deprecated (see Docs/PLAN-sjr-website.md)
Last updated: 2026-02-02
Document index: DECISIONS.md

This plan has been consolidated into `Docs/PLAN-sjr-website.md` to avoid confusion.
Keep this file only as historical context.

## Purpose
Bootstrap plan for Susie’s Jewelry Repair redesign + agentic automation system.

## Scope (Phase 1)
- Information architecture and page map (services hub + individual service pages)
- Brand + UI direction for “In‑House Authority”
- Core templates: Home, Services hub, Service detail, Quote, Contact, Reviews
- Data model for pricing and quote flow (Supabase)
- Analytics and SEO foundations (answer‑first, schema, crawlable footer)

## Out of Scope (Phase 1)
- Full e‑commerce or shipping marketplace
- Complex customer portal beyond quote + lead capture

## Assumptions
- Next.js on Vercel with Supabase backend and storage
- Gemini via Antigravity for image analysis (version subject to change)

## Open Questions
- Timeline and budget
- Final MVP page list for launch
- Phase 2 expansion scope (mail‑in repair, gold buying, eyeglass repair)

## Deliverables
- Updated PROJECT_BRIEF.md
- IA + sitemap draft
- Wireframe‑level page templates
- Supabase schema draft
- Tracking plan + event map
- 7‑day execution plan

## 7‑Day Execution Plan
Day 1: Discovery + IA
- Confirm MVP pages, nav, and topic clusters
- Draft sitemap and page inventory
- Define content blocks and answer‑first structure

Day 2: Design Direction
- Establish typography, palette, and key UI motifs
- Define trust signals and badge treatments
- Create hero + service grid direction

Day 3: Data + Quote Flow
- Draft Supabase tables (services, leads, repairs_log, reviews)
- Define quote flow steps and disclaimers
- Map data fields to UI components

Day 4: SEO + Schema
- Draft page‑level schema requirements
- Define local landing page template
- Plan footer crawl map and internal linking

Day 5: Build Sprint 1
- Implement base layout + navigation
- Implement Home + Services hub templates
- Add pricing table component

Day 6: Build Sprint 2
- Implement service detail template and local landing template
- Implement Quote page UI shell
- Add Reviews + Gallery components

Day 7: QA + Readiness
- Lint/format + basic accessibility pass
- Core Web Vitals checklist
- Prepare launch checklist and next‑week backlog

## Research Bundle (Internal)
- PRD: Docs/Agentic Susies Jewelry Repair PRD Final.md
- Brief: PROJECT_BRIEF.md
- Decisions: DECISIONS.md
- Roadmap: ROADMAP.md
- Requirements: REQS.md
