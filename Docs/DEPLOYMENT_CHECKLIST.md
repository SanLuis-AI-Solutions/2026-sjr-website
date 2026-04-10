# Deployment Verification — 2026-04-10

## Immediate (After Deploy Succeeds)

- [ ] GitHub Actions workflow `Deploy Production (Vercel)` completed successfully
- [ ] Workflow ran from a merge/push to `master`
- [ ] `npm run build` passed in CI
- [ ] No TypeScript errors in deploy logs
- [ ] Playwright tests passed in CI
- [ ] Performance gate passed (`LCP < 2600ms`)

## Hour 0-1: Visual Verification

- [ ] Visit [susiesjewelryrepair.com](https://www.susiesjewelryrepair.com)
- [ ] Browser DevTools -> Network -> filter `gtag`
  - [ ] See request to `https://www.googletagmanager.com/gtag/js?id=G-WLKM8DCB5M`
  - [ ] `ga-head-bootstrap` script appears in `<head>`
- [ ] Browser DevTools -> Console -> no errors
- [ ] Homepage title/description shows the new CTR-test version in live page source

## Hour 24-48: Analytics Check

- [ ] Open GA4 property `350925141`
- [ ] Check Realtime dashboard
  - [ ] Active users/events visible
  - [ ] Page view appears immediately after a live visit
- [ ] Run `npm run google:weekly-seo-health`
  - [ ] GA4 organic sessions are now `> 0` for the current reporting window
- [ ] Check Search Console Performance
  - [ ] Any CTR movement on `jewelry repair near me`

## Hour 48-72: CTR Signal Check

- [ ] Run `npm run google:seo-quick-wins`
- [ ] Update `Docs/SEO_CTR_TESTS.md`
- [ ] Capture:
  - [ ] `jewelry repair near me` position
  - [ ] `jewelry repair near me` clicks
  - [ ] `jewelry repair near me` CTR vs `0.62%` baseline

## Success Criteria

- [ ] GA head-bootstrap loads in production
- [ ] GA4 starts showing organic sessions within 48 hours
- [ ] CTR test baseline is live in production and measurable
- [ ] Next CTR review on `2026-04-14` has either improvement or stable early data

## If GA4 Still = 0 After 48 Hours

1. Check whether events exist in GA4 Realtime
2. Check whether any page views fire at all
3. If no events exist, debug event firing rather than script loading
4. If events exist but reports stay zero, treat it as GA4 processing/reporting lag and wait another 24 hours

## Repo-Specific Deployment Note

- Production deployment is handled by `.github/workflows/deploy-production.yml`
- That workflow runs only on `push` to `master`
- A push to `codex/optimization-plan` alone will **not** deploy production

