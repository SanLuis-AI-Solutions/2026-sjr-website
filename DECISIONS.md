# DECISIONS.md

Lightweight decision log.

## Document Status (Source of Truth Index)
- PLAN (Active): Docs/PLAN-sjr-website.md
- PRD (Active): Docs/Agentic Susies Jewelry Repair PRD Final.md
- Project Brief (Active): PROJECT_BRIEF.md
- Roadmap (Active): ROADMAP.md
- Requirements (Active): REQS.md
- Stitch Prompt (Active): Docs/STITCH_PROMPT.md
- Deprecated Plan (Archive): Docs/PLAN-susies-jewelry-repair.md
- MCP Master Config (Global): C:\Users\ninef\.mcp-master-config.json

## Template
- Date:
- Decision:
- Rationale:
- Alternatives:
- Consequences:

## 2026-01-30
- Decision: Default stack for marketing/lead-gen sites is Next.js App Router + TypeScript + Tailwind on Vercel.
- Rationale: Best Core Web Vitals control, SSR/SSG/ISR support, and strong SEO/AEO/GEO capabilities.
- Alternatives: Static site generator or plain React SPA.
- Consequences: Require Node build pipeline and Vercel deploy; client JS kept minimal.

## 2026-02-02
- Decision: Consolidate planning into a single source of truth (Docs/PLAN-sjr-website.md).
- Rationale: Avoid drift and conflicting guidance between multiple plan docs.
- Alternatives: Keep both plans and manually sync.
- Consequences: Docs/PLAN-susies-jewelry-repair.md is now deprecated and kept only for history.

## 2026-02-02
- Decision: Service architecture is a hub + individual service detail pages (9 services total).
- Rationale: Stronger SEO/GEO/AEO targeting and clearer user intent.
- Alternatives: Single combined services page only.
- Consequences: Requires service-specific content, FAQs, and schema per service page.

## 2026-02-02
- Decision: Centralize MCP server definitions into a single master config and use a master aggregator entry in `C:\Users\ninef\.codex\config.toml`.
- Rationale: Global consistency across projects and simpler setup.
- Alternatives: Keep per-project MCP definitions.
- Consequences: Requires a master config file and aggregator server to be available.

## 2026-02-02
- Decision: Use Airtable as the content source of truth and sync into Supabase for site reads.
- Rationale: Non-technical edits with stable, fast site reads and SEO-friendly rendering.
- Alternatives: Store content only in constants or use Supabase directly as the CMS.
- Consequences: Requires a sync script and schema alignment between Airtable and Supabase.

## 2026-02-02
- Decision: Extend `/installall` to run a global project bootstrap that creates/overlays `.env.local`.
- Rationale: New projects become ready-to-work without missing keys or MCP setup friction.
- Alternatives: Manual per-project env setup.
- Consequences: Requires a global env overlay file at `C:\Users\ninef\.codex\env\.env.local`.

## 2026-02-02
- Decision: Home page hero adopts “In-House Authority” messaging with museum-gallery style layout.
- Rationale: Aligns with PRD positioning (“Your Jewelry Never Leaves Our Hands”) and premium first impression.
- Alternatives: Minimal hero or Stitch-based template.
- Consequences: Requires custom home sections and curated imagery.

## 2026-02-03
- Decision: Migrate all media assets (hero, services, workshop, before/after) to Supabase Storage and remove runtime dependency on Wix hosting.
- Rationale: Wix account will be closed after launch; assets must remain available and controlled.
- Alternatives: Keep assets in public/ or maintain Wix hosting.
- Consequences: Supabase Storage bucket is the single source for media URLs and must be kept in sync with Airtable/Supabase content.

## 2026-02-03
- Decision: Adopt a standard agent/workflow operating model for design, SEO, QA, and deployment tasks.
- Rationale: Ensure consistent use of agents, skills, and workflows so work stays fast, repeatable, and aligned with KPIs.
- Alternatives: Ad-hoc tool usage per request.
- Consequences: Each major task runs through a defined workflow (design, content/SEO, QA) with explicit verification steps.

