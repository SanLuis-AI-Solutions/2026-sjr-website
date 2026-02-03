Susie’s Jewelry Repair — premium lead‑gen website (Next.js + Tailwind).

Status: Active
Last updated: 2026-02-03
Source of truth for plan: Docs/PLAN-sjr-website.md
Document index: DECISIONS.md

## Getting Started

New project bootstrap:
```powershell
/installall
```
This syncs global skills/agents/workflows, syncs catalogs + starter docs, runs project bootstrap (env overlay + deps), and checks MCP health.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 to view the site.

Key routes:
- Home: `/`
- Services hub: `/services`
- Service detail: `/services/[slug]`
- Quote: `/quote`
- Book: `/book`

## Docs
- PRD: `Docs/Agentic Susies Jewelry Repair PRD Final.md`
- Plan: `Docs/PLAN-sjr-website.md`
- Stitch prompt: `Docs/STITCH_PROMPT.md`
- Project brief: `PROJECT_BRIEF.md`

## MCP Preflight
Run at session start:
```powershell
./scripts/mcp-healthcheck.ps1
```

## MCP Aggregator
Global MCP config is centralized at `C:\Users\ninef\.mcp-master-config.json` and accessed via the `master-aggregator` entry in `C:\Users\ninef\.codex\config.toml`.
Optional global env overlay: `C:\Users\ninef\.codex\env\.env.local` (not committed).

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Vercel hosting
- Supabase (leads/pricing, later)
- Google Workspace (booking, later)
