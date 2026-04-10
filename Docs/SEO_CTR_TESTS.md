# CTR Test Log

## Test 1: Homepage Title/Description (Prepared 2026-04-10)

**Before:**
- Query: `jewelry repair near me`
- Position: `8.48`
- CTR: `0.62%`
- Impressions: `324`

**Change:**
- Old title: `Jewelry Repair in Pasadena, TX | Watch, Ring & Stone Repair | Susie’s Jewelry Repair`
- New title: `Jewelry Repair Near You in Pasadena, TX | Same Day Watch, Ring & Stone Repair`
- Old desc: `Visit our Pasadena, TX workshop for in-house jewelry repair, watch batteries, ring sizing, stone replacement, and heirloom restoration with clear quote-first guidance.`
- New desc: `Need jewelry repair near you? Visit our Pasadena workshop for same-day or next-day watch batteries, ring sizing, stone repair, cleanings, and quote-first service.`

**Expected:**
- Target CTR: `2.50%` (`+4x` improvement)
- Timeline: `3-5 days` after production deployment to see early signal

**Live status:**
- Branch status: CTR rewrite is implemented locally on `codex/optimization-plan`
- Production status checked on `2026-04-10`: live homepage is still showing the old title/description
- Result: the CTR experiment is **prepared but not live on production yet**

**Result:**
- Pending production deployment and 3-5 days of live data

## Current Quick-Win Cluster (From `Docs/SEO_QUICK_WINS.md`)

- Primary page: `/`
- Top query cluster:
  - `jewelry repair near me`
  - `jewelry store near me`
  - `jewelry store pasadena tx`
  - `jewelry repair pasadena`

## GA4 Diagnostic Snapshot (Live Site Check on 2026-04-10)

- Production homepage still uses the older metadata, so the CTR rewrite has not shipped live yet
- `window.gtag` exists on the live site
- No CSP console errors were observed for `www.googletagmanager.com`
- `gtag.js` does load on production, but only after interaction/idle delay on the current live build
- A manual `gtag('event', 'page_view', ...)` call reached the local data layer, but an obvious analytics collect request was not confirmed in the captured DevTools request list

## Next Checkpoints

1. Deploy the homepage CTR rewrite to production.
2. Re-check the live homepage title/description after deploy.
3. Run `npm run google:weekly-seo-health` on Wednesday and Friday.
4. Update this file with post-deploy CTR movement for `jewelry repair near me`.
