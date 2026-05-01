# Codex / Claude Sync - SJR Website

**Updated:** 2026-05-01
**Status:** Phase A/B shipped to production. Monitor results before expanding.

## Current Production State

- Production domain: `https://www.susiesjewelryrepair.com/`
- Latest verified title: `Jewelry Repair Near Me in Pasadena, TX | Expert Service`
- Latest verified meta description: `Need jewelry repair near me in Pasadena, TX? Get expert in-house ring sizing, watch repair, stone setting, cleaning, same-day service, and free quotes.`
- Mobile sticky Quote/Book CTA is wired through `src/components/site-shell.tsx`.
- Luxury hero and brand refinements are live.
- SEO/GA4 baseline artifacts are saved in the repo.

## Git State

- Branch: `master`
- Remote: `origin/master`
- Last pushed commit: `1b70385 test: align home smoke check with luxury hero`
- Production deploy commit set:
  - `75faca6` Phase B title/meta optimization
  - `124020a` deployability fix and mobile sticky CTA component
  - `4f714f4` luxury hero and mobile service CTA refinements
  - `2fd223b` SEO/GA4 audit baseline docs
  - `1b70385` smoke test update for new hero headline

## Verification Completed

- `npm run build` passed.
- `npm test` passed: 36 Playwright tests.
- Targeted ESLint passed for changed runtime/test files.
- `npx --yes @google/design.md lint DESIGN.md` passed.
- Vercel inspect confirmed deployment `sjr-new-website-aiproject-ig6wz6vop.vercel.app` is `Ready` with production aliases assigned.
- Live production HTML confirms the new title and description.

## Known CI Note

Manual GitHub Actions run `25220489824` ended red because the Vercel CLI hit a final API read timeout after the deployment was already Ready. The workflow has been hardened to inspect the printed deployment URL and continue when Vercel reports `Ready`.

## Next Optimal Steps

1. Request indexing in Google Search Console for `https://www.susiesjewelryrepair.com/`.
2. Monitor GSC for 48-72 hours:
   - Query: `jewelry repair near me`
   - Baseline: 0.49% CTR, 5 clicks, average position 8.17
   - Target: at least 1.5% CTR or 8+ clicks/day
3. Monitor GA4 organic lead events:
   - `quote_submit_success`
   - `booking_submit_success`
   - `contact_submit_success`
4. If Phase B improves CTR, start Phase C metadata work:
   - `watch repair near me`
   - `jewelry store near me`
   - `ring resizing near me`
5. If CTA events stay flat after 72 hours, audit the quote/book forms next instead of writing blog content.

## Do Not Do Next

- Do not work on the Nexus dashboard.
- Do not start broad blog production until Phase A/B conversion and CTR signals have been checked.
- Do not redesign unrelated interior pages unless the data points to them as funnel blockers.
