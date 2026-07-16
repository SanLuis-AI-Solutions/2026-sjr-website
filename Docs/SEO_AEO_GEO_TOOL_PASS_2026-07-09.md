# SEO/AEO/GEO Tool Pass - 2026-07-09

## Tools Run

- SEOmator SEO Audit Tool against local production site: `.health/seo-tool-audits/seomator-local-2026-07-09.json`
- Unlighthouse mobile scan against local production site: `.health/seo-tool-audits/unlighthouse-local-2026-07-09/`
- GEO Optimizer against public production site: `.health/seo-tool-audits/geo-optimizer-prod-2026-07-09.json`
- SEOmator after-fix recheck: `.health/seo-tool-audits/seomator-local-after-2026-07-09.json`
- GEO Optimizer post-deploy recheck: `.health/seo-tool-audits/geo-optimizer-prod-after-2026-07-09.json`
- GEO Optimizer post-AI-discovery recheck: `.health/seo-tool-audits/geo-optimizer-prod-ai-discovery-after-2026-07-09.json`

## Main Findings

- GEO Optimizer public score before fixes: 51/100, foundation band.
- Biggest AEO/GEO gap: missing `/llms.txt` worth 18 available points.
- Schema gap: homepage had JewelryStore, ItemList, and FAQPage, but GEO Optimizer did not detect explicit WebSite or Organization schema.
- Homepage SEO metadata was slightly long: title 64 chars, description 170 chars.
- SEOmator local score after changes: 94/100. Remaining failures are local-audit artifacts from `http://127.0.0.1` versus production HTTPS canonical URLs.
- GEO Optimizer public score after production deploy: 68/100, good band.
- GEO Optimizer public score after AI discovery endpoints: 71/100, still good band.

## Fixes Applied

- Added `public/llms.txt` with booking-first site summary, core pages, all service pages, service areas, and business details.
- Added homepage WebSite JSON-LD with booking action.
- Added homepage Organization JSON-LD with logo, phone, email, address, and sameAs links.
- Trimmed homepage title to 53 chars and meta description to 147 chars.
- Added `.health/**` to ESLint ignores so generated audit dashboards do not break lint.
- Added explicit dimensions to shared homepage service card images.
- Added explicit high fetch priority to the header brand mark when it is used as a priority image.
- Added lightweight AI discovery endpoints:
  - `/.well-known/ai.txt`
  - `/ai/summary.json`
  - `/ai/faq.json`
  - `/ai/service.json`

## Verification

- `npm run build`: passed.
- `npm run lint`: passed with the existing 10 warnings.
- Local rendered check confirmed:
  - title: `Book Jewelry Repair Pasadena TX | Watch & Ring Repair`
  - title length: 53
  - description length: 147
  - schema types: BreadcrumbList, ItemList, WebSite, Organization, FAQPage, JewelryStore
  - `/llms.txt` returns 200 locally.
- Production deploy completed through Vercel and aliased to `https://susiesjewelryrepair.com`.
- Post-deploy GEO Optimizer confirmed:
  - score improved from 51 to 68
  - band improved from foundation to good
  - llms.txt score improved from 0 to 12
  - schema score improved from 8 to 12
- Image/performance pass:
  - `npm run lint`: passed with the existing 10 warnings
  - `npm run build`: passed
  - SEOmator local image recheck: service-card image dimensions improved from 9 missing to 0 missing
  - production deploy completed and aliased to `https://susiesjewelryrepair.com`
- AI discovery pass:
  - `npm run lint`: passed with the existing 10 warnings
  - `npm run build`: passed
  - local endpoint checks confirmed `text/plain` for `/.well-known/ai.txt` and `application/json` for `/ai/summary.json`
  - production deploy completed and aliased to `https://susiesjewelryrepair.com`
  - GEO Optimizer score improved from 68 to 71
  - AI discovery score improved from 0 to 3

## Next Best Moves

1. Improve entity authority carefully: add only real sameAs profiles and avoid fake Knowledge Graph links.
2. Run a fresh PageSpeed mobile check on production after Vercel/cache settles and only fix measured issues.
3. Reduce overuse of the word `repair` on key pages where it reads repetitive, while preserving booking-first intent.
