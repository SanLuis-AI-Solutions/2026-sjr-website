# Codex: Phase 2B Execution Checklist

**Date:** 2026-04-27  
**Decision:** CONTINUE Phase 2B (CTR Optimization)  
**Reasoning:** Batch 6 delivered +92% CTR improvement. Impressions dipped but CTR/position metrics are strong. Optimize the winning strategy.

---

## IMMEDIATE ACTIONS (This Week)

### 1. Deploy Homepage Title/Description Test (DONE ✓)

**Status:** Code change deployed
- File: `src/app/page.tsx`
- Test #1: "Same-Day Jewelry & Watch Repair Near Pasadena, TX"
- Target keyword: "jewelry repair near me" (308 impressions, rank #8)
- Current CTR: 0.32% | Target: 2.5%

**Next:** Monitor GSC for CTR trend starting April 28

---

### 2. GA4 Form Event Analysis (PRIORITY: HIGH)

**What:** Identify which form field causes abandonment (6 starts → 1 completion = 16% rate)

**How:**
1. Open GA4 dashboard for property 350925141
2. Create custom report:
   - Metric: Count of `lead_form_step` events
   - Dimension: `event_parameters.field_name`
   - Filter: `page_path = /quote OR page_path = /book`
   - Date range: April 20-26
3. Look for: Which field has the lowest count? (That's your drop-off point)

**Expected Output:** 
- "name" → 6 events (all users focus here)
- "email" → 5 events (1 user abandons)
- "details" → 3 events (2 more users abandon) ← DROP-OFF
- "photos" → 1 event (2 more users abandon)

**Timeline:** 2-4 hours to complete

**Deliverable:** Send report to AI with specific field name

---

### 3. Mobile Form Testing (PRIORITY: HIGH)

**What:** Test form usability on mobile devices

**Devices:**
- [ ] iPhone 14 Pro (or latest iPhone)
- [ ] Android phone (Samsung S24 or similar)
- [ ] Tablet (optional but useful)

**Test each field:**
- [ ] Name field: Can you focus and type?
- [ ] Email field: Does autocomplete work?
- [ ] Details textarea: Is it large enough? Does keyboard cover it?
- [ ] Photos input: Can you tap it? Does camera open?
- [ ] Submit button: Is it large enough to tap? Does it respond quickly?

**Success Criteria:**
- Form fillable in <2 minutes on mobile
- No scrolling required while typing in any field
- Submit button tap response within 500ms

**Timeline:** 1-2 hours to complete

**Deliverable:** Send screenshots of any friction points you find

---

### 4. API Log Review (PRIORITY: MEDIUM)

**What:** Check server logs for form submission errors

**How:**
1. Review logs for `/api/quote` (last 7 days)
2. Review logs for `/api/book` (last 7 days)
3. Look for: HTTP 4xx or 5xx errors, timeouts, CORS issues

**Expected:** 
- Most requests should be 200 (success)
- Some 400s are OK (validation caught on client)
- Any 5xx errors are concerning (investigate)

**Timeline:** 1-2 hours to complete

**Deliverable:** Report any error patterns found

---

## MONITORING (Ongoing)

### Daily Metrics to Watch

| Metric | Source | Baseline | Target |
|--------|--------|----------|--------|
| CTR on "jewelry repair near me" | Google Search Console | 0.32% | >0.8% |
| Total homepage CTR | GSC | 0.38% | >1.5% |
| Quote form submit rate | GA4 | 16% | >25% |
| Organic sessions | GA4 | 16/week | >18/week |
| Avg position | GSC | 16.94 | <16 |

**How to Monitor:**
```bash
# Monday morning, run weekly script
npm run google:weekly-seo-health

# Check GA4 dashboard for form metrics
# Dashboard: "Lead Conversion Funnel"
```

### Weekly Report

**Every Monday at 9 AM:**
1. Run `npm run google:weekly-seo-health` 
2. Check CTR trend on primary keyword
3. Review GA4 form submission rates
4. Report in Slack: "CTR Test #1 update: [CTR] vs baseline [0.32%]"

---

## DECISION GATES (End of Week 1)

### If CTR Test #1 > 0.8% ✓
- **Decision:** CONTINUE with Test #1, monitor through Week 2
- **Action:** No change. Keep measuring.

### If CTR Test #1 ≤ 0.8% ✗
- **Decision:** PIVOT to Test #2 (Local Authority framing)
- **Action:** Update homepage title to alternative: "Expert Local Jewelry Repair in Pasadena, TX | Same-Day Service"
- **Timeline:** Implement Monday, measure through Week 2

---

## SECONDARY TASKS (Week 1-2)

### Form Conversion Quick Fixes (If GA4 Analysis Identifies Issues)

**Easiest wins (no code changes):**
- [ ] Add loading indicator to submit button ("Submitting...")
- [ ] Add success message after form submits
- [ ] Add asterisks (*) to required fields
- [ ] Add field-level error messages

**Impact:** Each fix can increase submit rate 2-5%

**Timeline:** 2-3 hours per fix

---

## PHASE 3 TRIGGER (End of Week 4)

**If any of these are true, STOP Phase 2B and START Phase 3:**

- [ ] CTR plateaus <0.8% after 2 weeks of testing
- [ ] Impressions continue declining >50% week-over-week
- [ ] No new indexed URLs appear in GSC for 2 weeks
- [ ] Form submit rate stuck <20% after debugging

**Otherwise:** Continue Phase 2B through May 18

---

## FILES TO REVIEW

1. **`Docs/PHASE_2B_QUICK_WINS.md`** — Full CTR optimization plan
2. **`Docs/FORM_CONVERSION_DEBUG.md`** — Form debugging methodology
3. **`Docs/CHECKPOINT_APRIL_27.md`** — April 27 assessment & decision
4. **`src/app/page.tsx`** — Homepage code (already updated)

---

## Questions Before Starting?

- What's your current GA4 access? Can you create custom reports?
- Do you have browser dev tools experience? (For mobile testing)
- Any constraints on when you can deploy title changes?
- Need help setting up weekly monitoring script?

---

## Success = Phase 2B Working

**By May 11, you'll know if Phase 2B is working by:**

✓ CTR improves 3x+ (from 0.32% to 1.0%+)  
✓ Form submit rate increases 50%+ (from 16% to 25%+)  
✓ Organic sessions growing >20/week

If all three: **CONTINUE Phase 2B through May 18**  
If any two failing: **PIVOT to Phase 3 (Indexing Strategy)**

---

## Next Check-in

**Sunday, April 28 or Monday, April 29:**
- Report CTR trend on "jewelry repair near me"
- Share GA4 form_step analysis results
- Update mobile testing findings
- Decide: Continue Test #1 or pivot to Test #2?

Good luck! 🚀
