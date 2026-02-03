# PROJECT_BRIEF.md

Status: Active
Last updated: 2026-02-02
Source of truth for plan: Docs/PLAN-sjr-website.md
Document index: DECISIONS.md

## 1) One‑sentence idea
Redesign susiesjewelryrepair.com into a high‑performance lead‑gen site centered on the “In‑House Authority” promise, powered by agentic automations (quote, social, reputation) and transparent pricing.

## 2) Problem + Audience
- Problem: Current site is a passive brochure; needs to drive more qualified leads, local visibility, and trust.
- Target users: Local customers in Pasadena, Deer Park, La Porte needing jewelry and watch repair.
- Why now: Market gap for in‑house repairs with transparent pricing; competitors rely on shipping or lack master jeweler expertise.

## 3) Success metrics
- Primary KPI: 2:1 conversion ratio on AI “Fast Quote” tool.
- Secondary KPIs: 100/100 Core Web Vitals (LCP < 1.2s); +30% local search visibility (Pasadena/Deer Park/La Porte); Google reviews 4.5 → 5.0.

## 4) Core features (MVP)
- Agentic “Fast Quote” photo upload with price range (Gemini + Supabase pricing).
- Services hub + individual service pages for all offered services.
- Trust signals (In‑House badge, gallery, reviews) + local SEO pages.
- Answer‑first page formatting and schema (LocalBusiness, Service, FAQPage).

## 5) Non‑goals
- Full e‑commerce or shipping marketplace.
- Complex customer portal beyond quote + lead capture.

## 6) Constraints
- Timeline: Not specified.
- Budget: Not specified.
- Tech preferences: Next.js + Vercel + Supabase + Google Antigravity (Gemini 1.5 Pro).
- Compliance/security: LocalBusiness + Service schema; privacy considerations for image uploads.
- Brand/UX: “In‑House Authority” voice; visible service grid; footer crawl map; pricing transparency.
- MCP configuration: Use C:\Users\ninef\.codex\config.toml for MCP server connections.
 - Media hosting: Supabase Storage is the single source of truth for site images (no Wix dependency).

## 7) Data + Integrations
- Data sources: Supabase tables (services, repairs_log, leads, reviews).
- Required integrations: Google Antigravity (Gemini), Supabase (DB + Storage), Twilio (SMS reviews), social platforms (IG/FB/Pinterest).
- Auth requirements: Internal dashboard for repair status updates.

## 8) Launch plan
- Beta date: TBD.
- Launch date: TBD.
- Distribution channels: Local search, social, gallery updates, review requests.

## 9) Risks
- Risk 1 + mitigation: AI quote inaccuracies → present range + disclaimers.
- Risk 2 + mitigation: SEO content quality → answer‑first formatting + schema + crawlable footer.
- Risk 3 + mitigation: Pricing drift → centralized Supabase services table + page‑level rendering.

## 10) Decision log
- Open questions: Timeline, budget, exact MVP scope for phase 1.
- Decisions made: In‑House Authority positioning; Next.js/Vercel/Supabase stack; agentic automations (quote/social/reviews).
