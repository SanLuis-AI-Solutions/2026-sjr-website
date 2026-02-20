# Service Image Pack v4 — True Source Refresh

Date: 2026-02-20

## Why v4
v3 removed exact repetition but still reused the same base photos. User feedback requested truly new images, not just new crops.

## What changed
- Replaced the generator strategy in `scripts/supabase/generate-service-image-variants.py`.
- New source strategy:
  - Openverse (CC0/PDM) first.
  - Wikimedia fallback when Openverse is empty or rate-limited.
- Built 8 slot-specific images per service:
  - `hero`, `support`, `process-a`, `process-b`, `process-c`, `expect-a`, `expect-b`, `why`
- Total generated and published: 72 images for 9 services.
- Published to Supabase path: `site-assets/services/v4/*`.

## Runtime wiring
- `src/lib/service-visuals.ts` points to `services/v4` slot assets.
- `src/lib/constants.ts` service hero URLs updated to `services/v4`.
- `scripts/supabase/publish-service-image-pack.mjs` now publishes from `assets/generated/services-v4` to `services/v4`.
- Airtable helper scripts synced to v4 hero URLs.

## Evidence
- Generation: `python scripts/supabase/generate-service-image-variants.py` (72 files)
- Publish: `node scripts/supabase/publish-service-image-pack.mjs`
  - 72 uploads complete
  - Supabase service image_url updated (9/9)
  - Airtable image rows updated (9/9)
- Verification:
  - `pwsh -File scripts/audit-images.ps1` -> PASS (`OK: 21/21`)
  - `pwsh -File scripts/verify.ps1` -> PASS

## Notes
- Source manifest with per-slot origins is written to:
  - `assets/generated/services-v4/manifest.sources.json`
- Generated image files remain git-ignored (`/assets/generated/`).
