# Phase B: Title/Meta Optimization for "Jewelry Repair Near Me"
**Status:** Implementation Complete | Ready for Deployment  
**Date:** 2026-05-01  
**Commits:** `75faca6` + deployability fix `ff195a9`

---

## What Changed

### Homepage Metadata Optimization (src/app/page.tsx)

**Title Tag** (Target: Include keyword + location + trust signal)
```
OLD: "Same-Day Jewelry & Watch Repair Near Pasadena, TX" (49 chars)
NEW: "Jewelry Repair Near Me in Pasadena, TX | Expert Service" (55 chars)
```
- ✓ Explicitly includes "Jewelry Repair Near Me" (was missing this exact phrase)
- ✓ Includes location: Pasadena, TX
- ✓ Adds trust signal: Expert Service
- ✓ Under Google limit (60 chars)

**Meta Description** (Target: Emphasize in-house repairs + free quotes + Pasadena)
```
OLD: "Expert jewelry and watch repair in Pasadena. Same-day battery replacements, 
     ring sizing, stone repairs, and more. No waiting. Local shop, transparent pricing."
     (145 chars)

NEW: "Need jewelry repair near me in Pasadena, TX? Get expert in-house ring sizing, 
     watch repair, stone setting, cleaning, same-day service, and free quotes." 
     (151 chars)
```
- ✓ Includes exact target phrase: "jewelry repair near me"
- ✓ Emphasizes "in-house repairs" (per GSC audit recommendation)
- ✓ Emphasizes "free quotes" (fast quote alternative, trust signal)
- ✓ Strengthens Pasadena/local signal
- ✓ Includes power words: same-day, expert, free quotes
- ✓ Under Google limit (160 chars)

---

## GSC Audit Context

**Target Keyword:** "jewelry repair near me"
- **Impressions:** 1,024 (highest of all keywords)
- **Clicks:** 5
- **CTR:** 0.49% (very low - this is the problem)
- **Avg Position:** 8.17 (top 10 but not dominant)
- **Audit Recommendation:** "strengthen homepage snippet around in-house repair, fast quote, and Pasadena trust signals"

---

## Deployment Instructions

### 1. Build Verification (Local)
```bash
npm run build
# Expected: Build completes successfully with no errors
# Status: ✓ PASSED - see git commit ff195a9
```

### 2. Deploy to Production
Option A: **Vercel Automatic Deployment** (if using Vercel git integration)
```bash
git push origin master
# Vercel will automatically detect the commit and deploy
# Deploy should take 2-3 minutes
```

Option B: **Manual Deployment**
```bash
vercel --prod
# Or use Vercel dashboard to trigger deployment
```

### 3. Verify Deployment (Post-Deploy Checklist)
- [ ] Navigate to `https://www.susiesjewelryrepair.com/` in incognito/private browser
- [ ] Right-click → "View Page Source" (or DevTools)
- [ ] Search for `<title>` tag - should see: "Jewelry Repair Near Me in Pasadena, TX | Expert Service"
- [ ] Search for `<meta name="description"` - should see full new description with "in-house repairs" and "free quotes"
- [ ] Verify Open Graph tags are updated (twitter:title, og:title, og:description)

### 4. Index Update in Google Search Console
After deployment:
- [ ] Log into Google Search Console (https://search.google.com/search-console)
- [ ] Go to: Indexing → URL Inspection
- [ ] Enter: `https://www.susiesjewelryrepair.com/`
- [ ] Click "Inspect"
- [ ] Click "Request Indexing" to notify Google of the metadata update
- [ ] Google will crawl and re-index within 24-48 hours

---

## Monitoring & Success Metrics

### 24-Hour Monitoring (After Deployment)
1. **Google Search Console**
   - Monitor: Queries report → "jewelry repair near me"
   - Watch for: Click count increase (from baseline ~0-2/day to ~5-8/day)
   - Target improvement window: 24-48 hours for CTR to stabilize
   - Current CTR: 0.49% | Target CTR: 2-3%

2. **Google Analytics 4**
   - Monitor: Traffic from organic search
   - Track: Organic sessions to homepage
   - Baseline (from GA4_Baseline_Metrics.md): 2 organic sessions/day
   - Target: Increase to 4-6 organic sessions/day by end of week

### 48-72 Hour Review
- [ ] Check GSC: Has CTR improved to 1-2%? (milestone: 2-4 clicks/day)
- [ ] Check GA4: Any increase in organic traffic to homepage?
- [ ] Check GA4: Any increase in booking/quote conversions from organic traffic?
- [ ] Document baseline CTR vs current CTR in PHASE_B_RESULTS.md

### Success Criteria
✓ **Phase B SUCCESS** if:
- CTR improves from 0.49% to ≥1.5% within 48 hours
- OR click count increases from 5 to ≥8+ clicks in 24-hour period
- OR GA4 shows measurable increase in organic homepage traffic

---

## Expected Impact

**Estimated Weekly Impact:**
- Current: ~5 clicks from "jewelry repair near me" per week
- Expected: ~15-25 clicks per week (3-5x improvement)
- Revenue impact: If 1 in 4 clicks converts to lead → +4-6 new leads/week

**Long-Term Impact:**
- CTR improvement signals quality to Google
- Quality signal → improved ranking (could rise from position 8.17 to 6-7)
- Higher ranking → more impressions → more clicks (compounding effect)

---

## Next Steps After Phase B

### Immediate (Week 1)
- [ ] Monitor GSC CTR for "jewelry repair near me" daily
- [ ] Deploy Phase B to production
- [ ] Request indexing in GSC

### Phase C (Week 2) - Expand CTR Optimization to Related Keywords
Once Phase B shows success, repeat optimization for:
1. "watch repair near me" (442 impr, 1.81% CTR, pos 5.41)
   - Update watch repair service page title/meta
   - Emphasize "same-day", "expert", "Pasadena"
   
2. "jewelry store near me" (268 impr, 0.37% CTR, pos 9.02) 
   - Update homepage or services hub
   - Clarify "repair + shop" in title
   
3. "ring resizing near me" (102 impr, 0.98% CTR, pos 8.13)
   - Update ring sizing service page
   - Emphasize "fast", "free quote"

### Phase D (Week 3-4) - Content Creation
Begin blog content targeting high-intent keywords:
- "ring resizing cost" (cost guides drive conversions)
- "watch repair time" (timeline expectations reduce friction)
- "fix broken chain" (common problem, high intent)
- "replace vs repair" (decision-making support)

---

## Files Changed
- `src/app/page.tsx` - Homepage metadata optimization
- `src/components/mobile-sticky-cta.tsx` - Missing mobile CTA component required by homepage/SiteShell
- `src/components/site-shell.tsx` - Mobile CTA wiring for shared pages
- `PHASE_B_DEPLOYMENT.md` - This file (deployment guide)

## Git Reference
```
Commits: 75faca6, ff195a9
Type: feat
Scope: Phase B - title/meta optimization
Messages:
- optimize homepage title/meta for jewelry repair near me keyword
- make Phase B metadata deployable
```

---

## Rollback Instructions (If Needed)
If CTR doesn't improve or issues arise:
```bash
git revert ff195a9 75faca6
git push origin master
# Vercel will auto-deploy the revert
# Original title/meta will be restored within 2-3 minutes
```

---

## Questions?
See:
- GSC_Keywords_Audit.csv (keyword data)
- Conversion_Funnel_Audit.md (funnel analysis)
- GA4_Baseline_Metrics.md (baseline metrics)
- HANDOFF_CODEX_SJR.md (full project context)
