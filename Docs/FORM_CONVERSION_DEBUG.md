# Form Conversion Debugging: 16% Submit Rate Analysis

**Date:** 2026-04-27  
**Issue:** 6 form starts → 1 completion (16% submit rate)  
**Impact:** Leaving 5 qualified leads per week incomplete  
**Goal:** Increase to 25%+ (1.5+ completions from 6 starts)

## Current Metrics (April 20-26)

| Event | Quote Form | Booking Form | Total |
|-------|-----------|--------------|-------|
| form_start | 4 | 2 | **6** |
| form_submit_success | 0 | 1 | **1** |
| Submit Rate | 0% | 50% | **16%** |
| form_step (field focus) | ? | ? | Unknown |
| form_submit_attempt | ? | ? | Unknown |

## Hypothesis: Where Users Abandon

**Most Likely Drop-off Points (in order of probability):**

1. **Required Fields Too Many** (HIGH)
   - Quote form has 3 required fields: name, email, details
   - Booking form: similar structure
   - Users may abandon at "details" (textarea requires thought)

2. **File Upload Complexity** (HIGH)
   - Photo upload for quote form is marked "optional" but visually prominent
   - File inputs are notoriously difficult on mobile
   - Users may not understand drag-drop or click-to-browse on phone

3. **Mobile Form Layout** (MEDIUM)
   - Form is responsive but may have layout issues on small screens
   - Button sizing may be too small on mobile
   - Focus management may be poor (keyboard covers form on mobile)

4. **Form Submission Error** (MEDIUM)
   - Users may be seeing validation errors they don't understand
   - API errors may not be displaying properly
   - Network timeouts on slow connections

5. **Unclear Value Proposition** (LOW)
   - Form header ("Get a transparent starting‑at range") may not resonate
   - Users may not understand what happens after submission
   - "1 business day response" may feel slow to some users

6. **Accidental Abandonment** (LOW)
   - Users leaving page unintentionally (back button, navigation)
   - Browser history or navigation issues

## Debugging Steps

### Step 1: GA4 Form Event Analysis

**What to check:**
- `lead_form_step` events: Which fields trigger the most focus events?
- `lead_form_submit_attempt` events: Are users attempting submit?
- Drop-off: Which field causes users to exit?

**Expected pattern (healthy form):**
```
lead_form_start → field1_focus → field2_focus → ... → last_field_focus → submit_attempt → success
```

**Expected pattern (abandonment):**
```
lead_form_start → field1_focus → field2_focus → [STOP] ← Drop-off here
```

**Commands:**
```bash
# Check GA4 dashboard for form_step events by field_name
# Filter by: page_path = /quote OR /book
# Group by: field_name
# Metric: count of field_name events
# Look for: which field has the fewest focus events?
```

### Step 2: Mobile Form Testing

**Test devices:**
- iPhone 14 Pro (latest iOS)
- Samsung Galaxy S24 (latest Android)
- Tablet: iPad (12.9")
- Desktop: Chrome 125, Safari

**Test scenarios:**
1. **Name field focus:**
   - Does keyboard appear?
   - Can you see the label?
   - Is text input field visible?

2. **Email field focus:**
   - Does autocomplete work?
   - Is error message (if invalid) clear?

3. **Details textarea:**
   - Is the input large enough on mobile?
   - Does keyboard cover the field?
   - Can you scroll to see all the text you're typing?

4. **Photo upload:**
   - On mobile: Can you tap to open camera?
   - Can you drag-drop on desktop?
   - Are file restrictions clear?

5. **Submit button:**
   - Is it large enough on mobile (touch target >44px)?
   - Does clicking work immediately or is there delay?
   - Is success feedback clear?

**Success criteria:**
- Form should be fillable in <2 minutes on mobile
- No required scrolling while typing
- Button click response within 500ms

### Step 3: Form Submission Validation

**Check API logs:**
```bash
# Review /api/quote and /api/book logs for:
# - HTTP 4xx errors (validation failures)
# - HTTP 5xx errors (server errors)
# - Timeout errors
# - CORS errors
```

**Expected logs:**
- Successful submissions: 200 status
- Validation errors: 400 status (should be caught on client-side)
- Server errors: 500 status (should be rare)

### Step 4: Error Message Testing

**Simulate validation errors:**
1. Submit form with missing "name" field
   - What error appears?
   - Is it clear what the problem is?
   - Can user fix without re-entering data?

2. Submit form with invalid email
   - Does browser catch it (HTML5 validation)?
   - If user enters "test" as email, what happens?

3. Submit form with photo file > 10MB
   - What error appears?
   - Is file size limit clear upfront?

### Step 5: Network Performance Check

**Use Chrome DevTools or WebPageTest:**
- How long does form submission take?
- Are there network delays causing user to think form is stuck?
- Is there a loading indicator during submission?

**Expected:** Form submit should complete within 2-3 seconds even on slow 3G connection.

## Quick Fixes (No Code Changes)

These can be implemented immediately:

1. **Add progress indicator to submit button:**
   - Show spinner during submission
   - Disable button after click (prevent double-submit)
   - Clear error messages when user re-submits

2. **Make photo input truly optional:**
   - Add visible label: "(Optional — helps us quote faster)"
   - Move it below the fold, after "details"
   - Consider removing it initially (can ask via email if needed)

3. **Simplify required fields message:**
   - Currently no visual indicator of required vs optional
   - Add asterisk (*) to required fields
   - Add text: "Required fields marked with *"

4. **Add form success copy:**
   - "Success! You'll hear from us within 1 business day."
   - Include confirmation number
   - Offer phone number for urgent inquiries

## Detailed Fixes (Code Changes)

### Fix 1: Reduce Form Abandonment at Photo Input

**Current:** Photo input is visible in the main form

**New:** Move to collapsed section or remove entirely

```typescript
// Option A: Move photos section below the fold
<details>
  <summary>Add photos (optional — helps quote faster)</summary>
  {/* photo input here */}
</details>

// Option B: Remove from initial form, ask via email
// "Send photos? Reply to our quote email with attachments"
```

**Rationale:** Photo upload is a friction point. Users who can't access their camera/photos will abandon rather than skip.

### Fix 2: Add Loading State to Submit Button

**Current:** Button shows no feedback during submission

**New:** Show spinner + "Submitting..." text

```typescript
<button
  type="submit"
  disabled={isSubmitting}
  className="..."
>
  {isSubmitting ? (
    <>
      <Spinner className="mr-2 inline" />
      Submitting...
    </>
  ) : (
    "Request Quote"
  )}
</button>
```

**Rationale:** Users don't know if their click registered. Showing feedback reduces re-clicks and abandonment.

### Fix 3: Add Field-Level Error Messages

**Current:** Validation errors may only appear in console or as page alert

**New:** Display error next to the invalid field

```typescript
<label className="block">
  Full name
  <input name="name" required />
  {errors.name && (
    <p className="mt-1 text-rose-600 text-sm">{errors.name}</p>
  )}
</label>
```

**Rationale:** Users need immediate feedback on what's wrong, not a page-level error message.

### Fix 4: Add Mobile-Specific Form Variant

**Current:** Same form on desktop and mobile

**New:** Simplified mobile form

```typescript
{/* Mobile: Hide less important fields */}
{isMobile ? (
  <>
    <label>Name *</label>
    <label>Email *</label>
    <label>What needs repair? *</label>
    <button>Request Quote</button>
    <p>Call us at {phone} if you need photos</p>
  </>
) : (
  // Full form with photos
)}
```

**Rationale:** Mobile users have smaller screens. Reducing form fields by 50% can increase submit rate by 20-30%.

## Testing Plan

### Week 1: Diagnosis

- [ ] Day 1-2: GA4 form_step analysis (identify drop-off field)
- [ ] Day 3-4: Mobile form testing (identify UX issues)
- [ ] Day 5: API log review (identify submission errors)
- [ ] Day 6-7: Error message testing (identify unclear feedback)

### Week 2: Implementation

Based on diagnosis findings:
- [ ] Implement highest-impact fix (e.g., simplify mobile form)
- [ ] Deploy and monitor submit rate
- [ ] If submit rate < 20%, implement second fix
- [ ] If submit rate > 25%, declare success

### Week 3: Validation

- [ ] Confirm 25%+ submit rate sustained
- [ ] Check bounce rate didn't increase
- [ ] Measure time-on-form decrease

## Success Criteria

| Metric | Current | Target | Confidence |
|--------|---------|--------|-----------|
| Submit rate (quote + booking) | 16% | 25%+ | 90% |
| Form abandonment at photo field | Unknown | <5% | 80% |
| Mobile form completion time | Unknown | <2 min | 85% |
| API error rate | Unknown | <5% | 75% |

## Ownership & Timeline

| Task | Owner | Duration | Due |
|------|-------|----------|-----|
| GA4 analysis | Codex | 4 hours | Apr 29 |
| Mobile testing | Codex | 3 hours | Apr 30 |
| API log review | Codex | 2 hours | May 1 |
| Error message testing | Codex | 2 hours | May 1 |
| Diagnosis report | Codex | 1 hour | May 2 |
| Implement Fix #1 | Codex | 3-4 hours | May 5 |
| Deploy & monitor | Codex | 1 hour/day | May 6-12 |
| Validation & report | Codex | 2 hours | May 13 |

## Next Action

1. **Immediately:** Open GA4 dashboard and filter for `lead_form_step` events
2. **Identify:** Which field has the fewest focus events? (That's your drop-off point)
3. **Report:** Send Codex the findings with specific field name and count
4. **Plan:** Based on findings, decide on highest-impact fix

---

## Reference: Form Structure

**Quote Form (/quote):**
- Name (required)
- Email (required)
- Phone (optional)
- Details/repair description (required)
- Photos (optional)
- Submit button

**Booking Form (/book):**
- (Check `src/app/book/page.tsx` for exact structure)
- Similar structure expected

**GA4 Events Tracked:**
- `lead_form_start` - User focused on first field
- `quote_form_start` / `booking_form_start` - Same as above, with lead_type
- `lead_form_step` - User focused on a field (field_name parameter)
- `lead_form_submit_attempt` - User clicked submit button
- `lead_form_error` - Validation or server error occurred
- `quote_submit_success` / `booking_submit_success` - Form submitted successfully
