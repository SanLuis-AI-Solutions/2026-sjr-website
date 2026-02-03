# Restart / System Recovery Checklist

Use this to restart the project and working environment without re‑doing setup.

## Global prerequisites
- Node.js + npm installed.
- Git installed.
- MCP aggregator config in place:
  - `C:\Users\ninef\.mcp-master-config.json`
  - `C:\Users\ninef\.codex\config.toml` points to the master aggregator.

## Project prerequisites
- Repo root: `C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject`
- Local env file exists: `.env.local`
- Global env overlay exists: `C:\Users\ninef\.codex\env\.env.local` (do not commit)

## Commands (PowerShell)
```powershell
# install all global assets + bootstrap
/installall

# healthcheck MCPs
./scripts/mcp-healthcheck.ps1

# install dependencies
npm install

# run dev server
npm run dev
```

## Content / data sync (only when needed)
```powershell
# validate Airtable schema
npm run airtable:validate

# sync Airtable content into Supabase
npm run airtable:sync
```

## Supabase assets (only when re-uploading)
```powershell
node scripts/supabase/upload-site-assets.mjs
```

## Key project references
- Design system: `DESIGN.md`
- Active plan: `Docs/PLAN-sjr-website.md`
- PRD: `Docs/Agentic Susies Jewelry Repair PRD Final.md`
- Decisions log: `DECISIONS.md`
- About page source notes: `Docs/about-page-notes.md`

## Quick sanity checks
- Home page renders without errors.
- Before/After slider shows full ring images.
- Scroll reveals animate on scroll (not blocked by reduced-motion setting).
