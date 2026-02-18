# Services Image Diversity Pass (2026-02-18)

Scope:
- `src/app/services/[slug]/page.tsx`
- `src/lib/blog.ts`
- `tests/smoke.spec.ts`

## Problem
- Service detail pages reused the same workshop images across multiple sections and slugs, which reduced perceived quality and made pages feel repetitive.

## Changes shipped
- Added a `buildServiceVisualSet()` strategy in `src/app/services/[slug]/page.tsx`:
  - Watch Repair keeps a watch-focused workshop set.
  - All other services now receive a rotated set of distinct service images based on slug order from `SERVICES`.
  - Applied this visual set to:
    - How-it-works support image
    - Process gallery
    - What-to-expect image row
    - Why-customers image panel
- Updated one blog hero image to reduce cross-site repetition:
  - `how-to-choose-a-jeweler` now uses `heirloom-restoration.jpg` instead of reusing `workshop-main.jpeg`.

## Verification additions
- Added smoke test: `mobile service detail: non-watch routes use a varied image set`
  - routes: `/services/ring-sizing`, `/services/necklace-repair`
  - asserts at least 4 unique `/site-assets/services/` images on each page.

## Evidence snapshot
- URL frequency audit reduced repeated image literals in source:
  - prior top repetition: workshop images appeared 3-4 times each in code
  - current top repetition: max 2 per URL in source scanning output.
- Full test suite passed after change (`13 passed`).
