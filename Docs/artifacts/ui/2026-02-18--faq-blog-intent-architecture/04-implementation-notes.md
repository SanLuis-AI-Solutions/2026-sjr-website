# FAQ + Blog Intent Architecture — Implementation Notes (2026-02-18)

## Scope
- `src/app/faq/page.tsx`
- `src/app/faq/faq-content.tsx`
- `src/lib/faq.ts`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/lib/blog.ts`

## What changed
- FAQ:
  - moved FAQ content into typed shared data (`src/lib/faq.ts`) with category metadata.
  - added interactive FAQ module (`src/app/faq/faq-content.tsx`) including:
    - category filters
    - keyword search
    - quick-answer cards
    - direct action/service links from FAQ answers.
- Blog index:
  - added featured guide presentation for strongest article.
  - added topic chips and topic labels on article cards for intent clarity.
- Blog detail:
  - added authority metadata UI (reviewed by, reviewed date, topical chips).
  - added `Article` and `BreadcrumbList` JSON-LD for richer structured data coverage.
  - added mid-article conversion CTA and related-read links for better user flow.
- Data model:
  - extended blog content entries with `topics`, `reviewedAt`, `authorName`, and `authorRole`.

## Why this improves value
- Reduces FAQ friction by helping users find answers by intent and search, not only linear scanning.
- Improves blog trust and expertise signaling via reviewed/author metadata.
- Strengthens internal linking and conversion paths from informational content to service pages and quote flow.
- Increases semantic quality and crawl context with article/breadcrumb structured data.

## Verification
- `npm run lint` pass (0 errors; existing non-blocking Airtable warnings unchanged).
- `npm test` pass (13/13 Playwright smoke tests).
- `pwsh -File scripts/verify.ps1` pass.
