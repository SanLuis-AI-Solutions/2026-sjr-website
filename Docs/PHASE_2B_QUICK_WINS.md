# Phase 2B: CTR Quick-Win Optimization

**Date:** 2026-04-27  
**Checkpoint:** Post-Batch 6 analysis complete  
**Decision:** Continue Phase 2B based on CTR +92% improvement

## Quick-Win Opportunity Summary

From `SEO_QUICK_WINS.md` analysis:
- **Total Quick-Win Keywords:** 20 keywords
- **Ranking Position:** 6-20 (ripe for optimization)
- **Homepage aggregate:** 18 quick-win keywords, 532 impressions, **2 clicks = 0.38% CTR**
- **Primary Target:** "jewelry repair near me" (308 impressions, 1 click, rank #8)
- **Opportunity:** Improve CTR from 0.38% → 2% = 10x growth potential

## Top 5 CTR Rewrite Candidates

| Query | Position | Impressions | Clicks | Current CTR | Target CTR | Potential Clicks |
|-------|----------|-------------|--------|-------------|------------|------------------|
| jewelry repair near me | 8 | 308 | 1 | 0.32% | 2.5% | 8 |
| watch resizing near me | 8 | 9 | 1 | 11.11% | 15% | 1.3 |
| jewelry store near me | 10 | 75 | 0 | 0% | 2.5% | 2 |
| jewelry repair | 11 | 35 | 0 | 0% | 2.0% | 0.7 |
| jewelry store pasadena tx | 9 | 29 | 0 | 0% | 2.0% | 0.6 |

## Current Title/Description Analysis

**Current Homepage:**
- Title: "Jewelry Repair Near You in Pasadena, TX | Same Day Watch, Ring & Stone Repair"
- Description: "Need jewelry repair near you? Visit our Pasadena workshop for same-day or next-day watch batteries, ring sizing, stone repair, cleanings, and quote-first service."

**Issues Identified:**
1. Title is 96 characters (ideal: 50-60 for full display)
2. Description doesn't lead with urgency or benefit
3. Missing power words like "Same-Day", "Expert", "Local"
4. "quote-first" is unusual framing for searchers looking for repairs

**Success Metrics:**
- Current: 0.32% CTR on "jewelry repair near me" (1 click from 308 impressions)
- Target: 2.5% CTR = 7-8 clicks from same impression volume
- Validation: +60% increase in organic sessions week-over-week (from Batch 6)

## CTR Optimization Strategies

### Strategy 1: Lead with Urgency (Same-Day/Fast)

**Test Title:**
"Same-Day Jewelry & Watch Repair Near Pasadena, TX"

**Test Description:**
"Expert jewelry and watch repair in Pasadena. Same-day battery replacements, ring sizing, stone repairs, and more. No waiting. Local shop, transparent pricing."

**Why:** "Same-day" is a trust signal and urgency driver. Users searching "jewelry repair near me" want fast service.

### Strategy 2: Emphasize Local Authority

**Test Title:**
"Expert Local Jewelry Repair in Pasadena, TX | Same-Day Service"

**Test Description:**
"Expert in-house jewelry repair in Pasadena. Same-day watch batteries, ring resizing, stone replacement, and jewelry cleaning. Visit our workshop today."

**Why:** "Expert" + "In-house" + "Local" addresses trust concerns. Removes abstract language like "quote-first."

### Strategy 3: Lead with Problem-Solution

**Test Title:**
"Broken Jewelry? Same-Day Repair in Pasadena, TX Near You"

**Test Description:**
"Broken chain, loose stone, or watch repair needed? Susie's offers same-day repairs in Pasadena with expert in-house service and transparent pricing."

**Why:** Speaks to user's actual problem. More emotional resonance than generic "jewelry repair."

## Implementation Plan

### Phase 2B.1: Homepage Title/Description Tests (Week 1)

1. **Baseline Measurement** (complete)
   - Current CTR: 0.32% (1 click / 308 impressions)
   - Current position: 8.14
   - Measured: April 20-26

2. **Title Test 1: Same-Day Urgency** (A/B test)
   - Update: `src/app/page.tsx` metadata
   - Test duration: 7 days
   - Success metric: CTR > 0.8%

3. **Title Test 2: Local Authority** (if Test 1 < 0.8%)
   - Alternative: Expert + In-house framing
   - Test duration: 7 days
   - Success metric: CTR > 1.2%

4. **Title Test 3: Problem-Led** (if Test 2 < 1.2%)
   - Alternative: Lead with customer problem
   - Test duration: 7 days
   - Success metric: CTR > 1.5%

**Acceptance Criteria:**
- CTR reaches 1.5%+ from current 0.32%
- Position stays #6-10 (don't sacrifice rank for CTR)
- Bounce rate doesn't increase > 5%

### Phase 2B.2: Service Page CTR Wins (Week 2)

Target these high-impression pages:
- `/services/watch-repair` - "watch resizing near me" (9 impressions, 11% CTR, but very low volume)
- `/services/ring-sizing` - "jewelry store near me" (75 impressions, 0% CTR)
- `/services/pasadena` - "jewelry store pasadena tx" (29 impressions, 0% CTR)

**Tests:**
- Watch repair page: Emphasize battery + sizing (dual-intent)
- Ring sizing page: Lead with "Same-day ring sizing" + quick turnaround
- Pasadena geo page: Add "Pasadena's trusted jewelry repair expert"

### Phase 2B.3: Form Conversion Debugging (Parallel, Week 1-2)

**Current Issue:** 6 form starts → 1 completion = 16% submit rate

**Investigation:**
1. Check GA4 form_step events to identify drop-off field
2. Mobile responsiveness: Test form on iOS/Android
3. File upload UX: Is photo input causing abandonment?
4. Validation errors: Are error messages clear?
5. Form submission: Check API logs for failed submissions

**Quick Wins (if identified):**
- Reduce required fields to minimum: name, email, details
- Make photo upload truly optional with clear labeling
- Add progress indicator for form completion
- Test simplified mobile form variant

**Success Metric:** Increase submit rate from 16% to 25%+ (6 starts → 1.5+ completions)

## Timeline

| Week | Task | Owner | Metric |
|------|------|-------|--------|
| Apr 27 - May 4 | Homepage title test #1 (same-day) | Codex | CTR > 0.8% |
| May 4 | Evaluate test #1 results | Codex | Decide: iterate or advance |
| May 4 - May 11 | Homepage title test #2 (local authority) if needed | Codex | CTR > 1.2% |
| May 4 - May 11 | Form conversion debugging | Codex | Identify drop-off field |
| May 11 - May 18 | Service page CTR optimization | Codex | +2-3 clicks/week per page |
| May 18 | Phase 2B review & Phase 3 decision | Codex | CTR stable? Continue or pivot? |

## Decision Gate: Phase 3 Entry

**Continue Phase 2B if:**
- ✓ CTR trend is positive (>0.8% on test #1)
- ✓ Form conversion improving (>20% submit rate)
- ✓ Organic sessions holding >15/week

**Enter Phase 3 (Indexing Pruning) if:**
- ✗ CTR plateaus below 0.8% after 2 weeks
- ✗ Impressions continue declining > -50%
- ✗ No new indexed URLs appear for 2 weeks
- ✗ Form conversion not improving (stuck <16%)

## Quick Reference: File Changes

**Homepage metadata update:**
- File: `src/app/page.tsx`
- Update: `createPageMetadata()` call (lines 12-18)
- Test: Semantic validation + GA4 tracking

**Service pages (future):**
- `/services/watch-repair` 
- `/services/ring-sizing`
- `/services/pasadena`

**Form debugging:**
- GA4 event review: `lead_form_step` events
- Mobile test: iPhone 14 Pro, Samsung S24
- API logs: `/api/quote`, `/api/book`

## Success Criteria Summary

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Homepage CTR (jewelry repair near me) | 0.32% | 2.5% | HIGH |
| Quick-win keywords CTR aggregate | 0.38% | 1.5%+ | HIGH |
| Form submit rate | 16% | 25%+ | HIGH |
| Organic sessions | 16 | 20+ | MEDIUM |
| Average position | 16.94 | <15 | MEDIUM |

---

## Next Actions

1. **This week:** Update homepage metadata (Test #1)
2. **Monitor:** GSC + GA4 daily for CTR trend
3. **Debug:** GA4 form_step events to identify abandonment
4. **Validate:** Test service page titles on mobile
5. **Commit:** Phase 2B changes to git with test documentation
