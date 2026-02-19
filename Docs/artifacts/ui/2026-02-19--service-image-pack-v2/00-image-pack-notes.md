# Service Image Pack V2 Notes

Date: 2026-02-19

## Why this pass
- Footer brand lockup bug was found in `src/components/site-footer.tsx` (`Susie’s Repair` instead of `Susie’s Jewelry Repair`).
- Service-detail pages still mixed unrelated visuals in supporting sections.
- Goal: ensure each service route uses service-relevant imagery end-to-end.

## Image generation approach
- Generated 4 fresh variants per service from each service's existing brand-owned hero image:
  - `hero`
  - `detail-a`
  - `detail-b`
  - `detail-c`
- Output target (uploaded): `site-assets/services/v2/<slug>-<variant>.jpg`
- Total new assets uploaded: **36** (9 services x 4 variants).

## Storage + database updates
- Uploaded to Supabase storage bucket: `site-assets`
- Paths: `services/v2/*`
- Updated Supabase `services.image_url` for all 9 service slugs to the new `*-hero.jpg` URLs.
- Updated Airtable service `image` attachments for all 9 service slugs.

## Verification evidence
- Image URL audit:
  - `pwsh -File scripts/audit-images.ps1`
  - Result: `OK: 48/48`
- Supabase service image_url check:
  - All 9 service slugs now return `image_url` values under `/storage/v1/object/public/site-assets/services/v2/`.

## Operational scripts added
- `scripts/supabase/generate-service-image-variants.py`
  - Builds the 4-variant image set per service.
- `scripts/supabase/publish-service-image-pack.mjs`
  - Uploads variants to Supabase storage.
  - Updates Supabase `services.image_url`.
  - Updates Airtable `image` attachments.
