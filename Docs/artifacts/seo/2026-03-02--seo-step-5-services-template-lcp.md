# SEO Step 5 - Service Template LCP Pass (Shared Route Optimization)

Date: 2026-03-02
Owner: Codex
Scope: One-pass optimization on shared service-detail template (`/services/[slug]`) to improve multiple service pages quickly.

## Goal
Lift route-level service LCP by applying a single template/system fix with minimal risk.

## Changes Implemented

### 1) Public content fetch caching for static generation
- `src/lib/supabase/server.ts`
  - Added optional fetch controls (`cache`, `revalidate`, `tags`) to `supabaseGet`.
  - Preserved `cache: "no-store"` default for admin/runtime reads.
- `src/lib/content.ts`
  - Updated public content reads (`services`, per-service, per-service FAQs) to use `revalidate: 3600` + tags.

Result:
- Build now outputs service routes as static with ISR:
  - `/services` -> `○` revalidate `1h`
  - `/services/[slug]` -> `●` revalidate `1h`

### 2) Shared hero image delivery improvement
- `src/app/services/[slug]/page.tsx`
  - Removed `unoptimized` override on hero image (local `/images/*` assets now use Next.js optimization pipeline).
  - Added responsive `sizes` to hero image:
    - `"(max-width: 768px) 100vw, 50vw"`

## Deployments
- Deploy A (caching/static route pass):
  - `https://sjr-new-website-aiproject-odyykqby7.vercel.app`
- Deploy B (hero image optimization pass):
  - `https://sjr-new-website-aiproject-arfx0bgya.vercel.app`
- Alias:
  - `https://susiesjewelryrepair.com`

## Verification

### Build
- `npm run build` PASS.
- Build confirms service routes are statically generated with 1h ISR.

### Production gate comparison (5-run, p50)
Gate artifacts:
- Pre-hero optimization gate:
  - `.health/perf-gate-2026-03-02T21-39-23-251Z/summary.json`
- Post-hero optimization gate:
  - `.health/perf-gate-2026-03-02T21-51-16-231Z/summary.json`

Service route p50 LCP comparison:
- `/services/ring-sizing`: `2982ms -> 2980ms` (`-2ms`)
- `/services/watch-repair`: `3423ms -> 3050ms` (`-373ms`)
- `/services/custom-design`: `2984ms -> 2902ms` (`-82ms`)

Current gate status:
- Still fails strict `LCP <= 2500ms` threshold on the 3 selected service routes.
- SEO remains `100` on all 3 routes.

### Guardrail spot-check (post step)
Artifacts:
- `.health/prod-lh-step5-guard-contact.json`
- `.health/prod-lh-step5-guard-about.json`

Single-run checks:
- `/contact`: `perf=98`, `a11y=100`, `seo=100`, `lcp=2289ms`
- `/about`: `perf=98`, `a11y=100`, `seo=100`, `lcp=2230ms`

Note: Lighthouse emitted known Windows temp cleanup `EPERM` warnings post-run; JSON reports were generated and parsed successfully.

## Outcome
- Shared template pass delivered measurable improvement on the highest service-route outlier (`watch-repair`) and modest improvement on `custom-design`.
- Service routes are now static/ISR-backed, which is a stronger baseline for further tuning.
- Additional route-level hero image weight optimization is still needed to bring service p50 LCP below 2500ms consistently.
