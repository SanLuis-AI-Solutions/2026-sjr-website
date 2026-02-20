# Service Image Pack v3 — No-Repeat Pass

Date: 2026-02-20
Owner: Codex

## Goal
Eliminate repeated image reuse inside service detail pages by assigning a unique image asset to every major visual slot per service.

## Scope
- Services: all 9 service slugs
- Slots per service:
  - hero
  - support
  - process-a
  - process-b
  - process-c
  - expect-a
  - expect-b
  - why

## What Changed
- Generated 72 service image variants (8 variants x 9 services) from brand-owned source imagery.
- Uploaded to Supabase storage path:
  - `site-assets/services/v3/*`
- Updated service hero image records:
  - Supabase `services.image_url` (all 9 rows)
  - Airtable service image attachments (all 9 records)
- Updated runtime mapping:
  - `src/lib/service-visuals.ts` now maps each section slot to a distinct v3 asset.
- Updated fallback hero image constants:
  - `src/lib/constants.ts` now points to v3 hero URLs.
- Updated image tooling:
  - `scripts/supabase/generate-service-image-variants.py`
  - `scripts/supabase/publish-service-image-pack.mjs`
- Synced Airtable helper scripts to v3 hero URLs:
  - `scripts/airtable/assign-service-images.mjs`
  - `scripts/airtable/add-missing-services.mjs`
  - `scripts/airtable/update-services.mjs`
  - `scripts/airtable/sync-to-supabase.mjs`
  - `scripts/airtable/validate-schema.mjs`

## Evidence
- Generation run:
  - `python scripts/supabase/generate-service-image-variants.py`
  - produced `assets/generated/services-v3/manifest.local.json`
- Publish run:
  - `node scripts/supabase/publish-service-image-pack.mjs`
  - uploaded 72 assets
  - updated Supabase rows for 9 services
  - updated Airtable rows for 9 services
- Verification:
  - `pwsh -File scripts/audit-images.ps1` -> PASS (`OK: 21/21`)
  - `pwsh -File scripts/verify.ps1` -> PASS

## Notes
- Generated local files under `assets/generated/` are ignored by git (`/assets/generated/`) to avoid repository bloat.
- This pass targets no-repeat section slot usage, not net-new photography acquisition.
