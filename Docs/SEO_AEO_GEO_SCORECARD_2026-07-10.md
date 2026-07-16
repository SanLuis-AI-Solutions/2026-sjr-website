# SEO AEO GEO Scorecard - 2026-07-10

## Current Scores

- SEO: 95/100
- AEO: 88/100
- GEO: 76/100

## What Changed Since 2026-07-09

- RSS is live at `/rss.xml` and advertised in page metadata.
- Shared freshness signals are live across schema, sitemap, AI discovery payloads, and blog `dateModified`.
- Blog reviewer/author trust now routes to `/about`, and article schema includes author URL plus organization context.
- `ai/service.json` is live and returns the service catalog with booking-first action data.
- Public markdown artifacts are now live:
  - `/ai/site-guide`
  - `Accept: text/markdown` on public pages such as `/` and `/services/watch-repair`
- Public booking-first UX pass is now live across homepage-supporting pages, blog surfaces, service-area pages, and booking/contact flows.
- Mobile QA screenshots were captured for `/`, `/about`, `/faq`, `/blog`, `/book`, and `/services/deer-park`.
- Public GEO Optimizer re-scan completed on 2026-07-10 and replaced the provisional July 10 score.
- Homepage discovery/entity pass deployed on 2026-07-11, with homepage-visible service-guide and authority links added without changing the booking-first CTA hierarchy.

## Evidence

- Live endpoint checks returned `200` for:
  - `/llms.txt`
  - `/.well-known/ai.txt`
  - `/ai/summary.json`
  - `/ai/service.json`
  - `/rss.xml`
  - `/sitemap.xml`
- Live homepage HTML includes:
  - RSS alternate link
  - `dateModified`
  - `/about` reference
- Prior public GEO Optimizer baseline on 2026-07-09 was `73/100`.
- Public GEO Optimizer re-scan on 2026-07-10 returned:
  - overall GEO score: `76/100`
  - ChatGPT citation readiness: `80/100`
  - Perplexity citation readiness: `95/100`
  - Google AI citation readiness: `90/100`
  - trust composite: `17/25` (`B`)
- The main July 9 gaps around RSS and freshness are now closed, and the measured score improved by `+3`.
- A follow-up public GEO scan after the booking-first UX pass held at `76/100`, which means the work improved user flow and copy consistency without creating an SEO/AEO/GEO regression.
- A fresh public GEO scan on 2026-07-11 after the homepage discovery/entity pass still held at `76/100`, which confirms the remaining public GEO bottleneck is scanner recognition of AI endpoints/entity heuristics rather than broad homepage clarity.

## Why These Scores

- SEO stays at `95/100`. Nothing regressed, and the remaining gap is still mostly mobile performance and production-header polish.
- AEO is now scored at `88/100` from the measured platform-citation results. Answer engines can parse and cite the site well, but AI discovery and form labeling are still lighter than they should be.
- AEO remains operationally `88/100`. The booking/contact forms are now cleaner structurally, but the external homepage-heavy scanner still does not credit those changes directly.
- GEO moves from `73` to `76` on the measured public re-scan. The site closed the freshness gap, improved brand consistency, and now exposes public markdown artifacts, but it still lacks stronger entity authority and richer AI discovery payloads that the external scanner recognizes.
- The 2026-07-11 pass improved homepage discoverability for humans and agents, but the external scan still did not credit `/ai/service.json` and still missed visible review signals, so further GEO gains now depend on endpoint validity and extractability more than generic homepage cleanup.

## Remaining Gaps

### SEO
- Mobile LCP is still slower than ideal.
- Production trust/security headers are still incomplete.
- Mobile homepage JavaScript still needs another pass after the non-critical helper deferral.

### AEO
- AI discovery is present, but still lightweight.
- Booking and contact forms were tightened structurally, but the public scanner still evaluates homepage-only form signals.
- More answer-first service copy on top commercial pages would improve extraction.

### GEO
- No real knowledge-graph pillar links beyond current sameAs/social/local profiles.
- Homepage/support copy still needs less repetition around "repair".
- `ai_discovery` still scored `3/6` because the external scanner did not credit the published markdown/service artifacts yet, and brand/entity trust is now `6/10`.
- Mobile UX on the checked pages is cleaner and consistent after the motion normalization pass, but this is a conversion/readability gain more than a public GEO score lever.
- The public scanner still claims no testimonial/review recognition on the homepage even though review signals are visibly present, so structured or extractable review proof is the next cleaner GEO lever.

## Next Best Moves

1. Validate and, if needed, reshape `/ai/service.json` so the public scanner recognizes it as a service catalog endpoint.
2. Make review proof more extractable on the homepage or schema layer so public scans stop missing it.
3. Keep reducing repetitive homepage/service wording where it reads heavier than needed, especially around the word `repair`.

## 2026-07-11 Rescan

- Production deploy: `dpl_4iFofLA398QRPysVuLgBxwfdRCnJ`
- Public GEO audit artifact: [geo-optimizer-prod-2026-07-11-home-discovery-pass.json](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\seo-tool-audits\geo-optimizer-prod-2026-07-11-home-discovery-pass.json)
- Mobile homepage screenshot artifact: [mobile-qa-2026-07-11-home-discovery-pass-live.png](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\mobile-qa-2026-07-11-home-discovery-pass-live.png)
- Measured result:
  - overall GEO score: `76/100`
  - `ai_discovery`: `3/6`
  - `brand_entity`: `6/10`
- Fresh scanner findings:
  - it sees `/ai/summary.json`, but still does not credit `/ai/service.json`
  - it still claims no review/testimonial recognition on the homepage
  - it still suggests knowledge-graph pillar links we do not have and should not fabricate

## 2026-07-11 Service + Review + Copy Pass

- Production deploy: `dpl_6Myxozn2bcD5sz2BvQR4bWJF3ZvU`
- Public GEO audit artifact: [geo-optimizer-prod-2026-07-11-service-review-copy-pass2.json](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\seo-tool-audits\geo-optimizer-prod-2026-07-11-service-review-copy-pass2.json)
- Mobile homepage screenshot artifact: [mobile-qa-2026-07-11-service-review-copy-pass-live.png](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\mobile-qa-2026-07-11-service-review-copy-pass-live.png)
- Measured result:
  - overall GEO score: `79/100`
  - `ai_discovery`: `6/6`
  - `brand_entity`: `6/10`
- What moved:
  - `/ai/summary.json` is now valid to the public scanner
  - `/ai/service.json` is now recognized
  - homepage review/testimonial signals are now detected by the scanner
  - keyword density warning improved from `5.3%` to `4.6%`

## 2026-07-11 Entity + Labels + Density Pass

- Production deploy: `dpl_4UYNR4534ouMVFiwmzhq581UeYLV`
- Public GEO audit artifact: [geo-optimizer-prod-2026-07-11-entity-label-density-pass2.json](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\seo-tool-audits\geo-optimizer-prod-2026-07-11-entity-label-density-pass2.json)
- Mobile homepage screenshot artifact: [mobile-qa-2026-07-11-entity-label-density-pass-live.png](C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject-batch6-deploy\.health\mobile-qa-2026-07-11-entity-label-density-pass-live.png)
- Measured result:
  - overall GEO score: `80/100`
  - `ai_discovery`: `6/6`
  - `brand_entity`: `7/10`
- What moved:
  - homepage FAQ depth increased to `3`, which unlocked the brand/topic-authority point
  - homepage title density improved again and the keyword warning moved from `4.6%` to `4.5%`
  - about page now exposes explicit `AboutPage` schema and repeats the family-run, in-house entity story more clearly
