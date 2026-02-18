# FAQ + Blog GA4 Events — Implementation Notes (2026-02-18)

## Scope
- `src/components/analytics/ga-tracker.tsx`
- `src/components/analytics/tracked-link.tsx`
- `src/app/faq/faq-content.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`

## Events added
- `faq_filter_select`
  - Trigger: FAQ category filter button click.
  - Params: `faq_filter`, `query_length`, `page_context`.
- `faq_search`
  - Trigger: FAQ search typing (debounced, min query length 2).
  - Params: `faq_filter`, `query_length`, `results_count`, `page_context`.
- `blog_topic_click`
  - Trigger: blog topic chip click.
  - Params: `topic`, `placement`, plus tracked-link defaults (`page_path`, `destination`).
- `article_mid_cta_click`
  - Trigger: quote/book click in mid-article CTA module.
  - Params: `blog_slug`, `cta_target`, plus tracked-link defaults.
- `related_read_click`
  - Trigger: related-read card click on blog detail.
  - Params: `from_blog_slug`, `to_blog_slug`, plus tracked-link defaults.

## Supporting changes
- Added `trackGaEvent()` export in `ga-tracker` for reusable event emission.
- Added `TrackedLink` client component for analytics-safe instrumentation from server-rendered pages.
- Blog topic chips now support query-param topic filtering (`/blog?topic=...`) to align interaction events with displayed content.

## Verification
- `npm run lint` pass (0 errors, existing non-blocking warnings unchanged).
- `npm test` pass (13/13).
- `pwsh -File scripts/verify.ps1` pass.
