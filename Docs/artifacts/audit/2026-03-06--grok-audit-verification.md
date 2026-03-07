# Grok Audit Verification

## Metadata

- branch: `master`
- commit reviewed: `a4a5050`
- artifact path: `Docs/artifacts/audit/2026-03-06--grok-audit-verification.md`
- audit date: `2026-03-06`
- source audited:
  - user-provided Grok website audit summary for `https://www.susiesjewelryrepair.com`

## Verdict

Grok's audit is directionally useful for high-level growth priorities, but it contains several major factual errors about the current codebase and production setup.

Working conclusion:

- do **not** use Grok as the primary source of truth for technical SEO state
- keep the existing post-audit game plan
- absorb only the parts that align with already-verified priorities:
  - official GBP / social entity strengthening
  - content depth expansion
  - continued local authority building

## Verified Claims

### Correct Or Mostly Correct

- The site has a solid local-service foundation.
- The sitemap is substantial and includes core service, blog, FAQ, quote, book, contact, and legal coverage.
- Local-intent blog and FAQ structure are valuable for answer-style discovery.
- Strengthening GBP and other official entity signals remains high leverage.
- Continued content expansion remains high leverage.

### Partially Correct

- Contact-page map experience:
  - Grok says there is no embedded Google Map.
  - Verified state: there is no live iframe embed, but there **is** a dedicated static map preview with a direct Google Maps CTA in `src/app/contact/page.tsx`.
  - Interpretation: this is not a missing location UX, it is a deliberate performance-friendly implementation.
- Alt text:
  - Grok says alt text is not prominently implemented or extractable.
  - Verified state: the codebase has extensive explicit `alt` coverage across home, services, blog, about, and contact image surfaces.
  - Interpretation: this is not a priority gap.

## Rejected Claims

### 1. "No meta descriptions detected on key pages"

Rejected.

Verified in source:

- root metadata description in `src/app/layout.tsx`
- route-level metadata descriptions in:
  - `src/app/about/page.tsx`
  - `src/app/book/page.tsx`
  - `src/app/blog/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/faq/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/quote/page.tsx`
  - `src/app/services/page.tsx`
  - `src/app/terms/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/services/[slug]/page.tsx`

### 2. "Zero structured data/schema markup anywhere"

Rejected.

Verified in source:

- `LocalBusinessSchema` is injected globally in `src/app/layout.tsx`
- `src/components/local-business-schema.tsx` includes:
  - `LocalBusiness`
  - `PostalAddress`
  - `GeoCoordinates`
  - `AggregateRating`
  - `Review`
  - `openingHoursSpecification`
  - `sameAs`
- FAQ schema exists in:
  - `src/app/faq/page.tsx`
  - `src/lib/schema.ts`
- blog/article schema and breadcrumb schema exist in:
  - `src/app/blog/[slug]/page.tsx`
- service schema helpers exist in:
  - `src/lib/schema.ts`

### 3. "No canonical tags extracted"

Rejected.

Verified in source via route metadata `alternates.canonical`, including:

- `/`
- `/about`
- `/blog`
- `/book`
- `/contact`
- `/faq`
- `/privacy`
- `/quote`
- `/services`
- `/terms`
- blog detail routes
- service detail routes

### 4. "No analytics / GA4 confirmation"

Rejected as a code-state claim.

Verified in source:

- GA bootstrap script in `src/app/layout.tsx`
- deferred loader and event pipeline in:
  - `src/components/analytics/deferred-ga-loader.tsx`
  - `src/components/analytics/ga-tracker.tsx`

This does not prove current external analytics account health by itself, but it does disprove the claim that GA4 presence is unconfirmed in the implementation.

## Unknown / External-State Claims

These cannot be fully accepted from source alone and should be treated as separate verification tasks:

- "Pages are indexing well in Google"
- "Google Business Profile presence is unclear/weak"
- "Knowledge panel dominance is weak"
- "Local pack visibility could improve 50-100%"

These depend on live SERP / GBP / Search Console evidence, not only the repo.

## Game Plan Impact

No material change to the current roadmap.

The existing next-step priorities remain correct:

1. keep the now-verified official Google Maps, Yelp, and Facebook entity links live in `sameAs`
2. expand the highest-intent existing blog content
3. add in-body FAQ blocks where they support AEO
4. create the first geo-expansion service-area pages

What does **not** change:

- no reopening of the `/services` render-delay experiment loop
- no emergency metadata or schema retrofit sprint, because those systems already exist
- no map-embed rewrite as a top priority

## Next Optimal Step

Use live external verification, not model summaries, for the next authority task:

- keep live entity references current as official profile URLs evolve
- then begin the content-depth pass on the strongest commercial blog articles
