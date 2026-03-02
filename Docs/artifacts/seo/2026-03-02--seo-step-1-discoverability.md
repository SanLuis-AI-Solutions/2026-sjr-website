# SEO Step 1 - Blog Discoverability Fix

Date: 2026-03-02  
Owner: Codex  
Scope: Sitemap discoverability + blog structured-data server rendering

## What Changed
- Updated `src/app/sitemap.ts`:
  - Imported `BLOG_POSTS` and appended all `/blog/<slug>` URLs to sitemap output.
- Updated `src/app/blog/[slug]/page.tsx`:
  - Replaced `next/script` usage for JSON-LD with direct server-rendered `<script type="application/ld+json">` tags to guarantee presence in initial HTML.

## Verification
- Build:
  - Command: `npm run build`
  - Result: PASS
- Sitemap validation:
  - Endpoint: `http://localhost:3000/sitemap.xml`
  - Result: `LOC_TOTAL=33`, `BLOG_DETAIL_LOC_COUNT=14`
- Blog schema validation:
  - Endpoint: `http://localhost:3000/blog/ring-sizing-guide`
  - Result: `HAS_ARTICLE_SCHEMA=True`, `HAS_BREADCRUMB_SCHEMA=True`

## Why This Matters
- Ensures all blog detail pages are discoverable via XML sitemap.
- Improves search engine and AI crawler understanding of blog content by ensuring `Article` and `BreadcrumbList` schema are available in server-rendered HTML.

## Next Step
- Fix `/contact` LCP outlier and recurring global accessibility failures (`color-contrast`, footer heading order), then rerun full-site audit.

