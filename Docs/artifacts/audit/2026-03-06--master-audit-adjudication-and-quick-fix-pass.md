# Master Audit Adjudication And Quick-Fix Pass

## Metadata

- branch: `master`
- base commit reviewed: `8b5095a`
- artifact path: `Docs/artifacts/audit/2026-03-06--master-audit-adjudication-and-quick-fix-pass.md`
- audit date: `2026-03-06`
- source audits:
  - `Docs/artifacts/audit/2026-03-06--claude-full-site-seo-geo-aeo-audit.md`
  - `Docs/artifacts/audit/2026-03-06--gemini-full-site-seo-geo-aeo-audit.md`

## Adjudicated Score

- final working score: `75/100`
- score band: `credible foundation, meaningful revenue left on the table`

Reasoning:

- Claude surfaced multiple verified code and entity issues.
- Gemini overstated site quality and repeated an already-eliminated performance hypothesis as a top must-fix.
- The site is stronger than Claude's `69/100`, but Gemini's `87/100` is not supportable against the current source state.

## Source Validation Summary

### Accepted Claude Findings

- Sunday hours schema bug in `LocalBusiness` structured data was real.
- `sameAs` was empty in `LocalBusiness` structured data.
- Saturday booking-hours note was ambiguous against storefront hours and needed clarification.

### Rejected Or Downgraded Claude Findings

- `/quote` missing phone number: rejected.
  - `Prefer to talk now? Call (281) 991-6500.` is already live in `src/app/quote/page.tsx`.
- "Full-site" service-detail coverage: downgraded.
  - Claude only reviewed one representative service detail because that was the prompt scope.

### Rejected Gemini Findings

- `TrackedLink` hydration boundaries as the top must-fix: rejected.
  - This conflicts with the current release decision and previously rejected Step 6.2 hypotheses.
- `LocalBusiness` schema described as effectively perfect: rejected.
  - `sameAs` was empty and Sunday hours were emitted incorrectly at audit time.
- `87/100` overall score: rejected as inflated.

## Implemented Fixes

### 1. LocalBusiness schema closed-day fix

- file: `src/components/local-business-schema.tsx`
- change:
  - stop emitting fake Sunday opening hours for `Closed` days
  - omit closed-day entries from `openingHoursSpecification`

### 2. External entity references added

- file: `src/lib/constants.ts`
- wired into: `src/components/local-business-schema.tsx`
- change:
  - populated `sameAs` with verified Google Maps, Yelp, and Facebook URLs
  - added `hasMap` for the verified Google Maps place URL

### 3. Saturday booking-hours note clarified

- file: `src/components/booking-date-time-fields.tsx`
- change:
  - updated the note to `Last booking start` so the 3pm Saturday cutoff is explicit and no longer reads like storefront close time

### 4. Smoke coverage added

- file: `tests/smoke.spec.ts`
- new check:
  - verifies home-page `LocalBusiness` schema has at least two external entity links
  - verifies Sunday is not emitted as an opening-hours entry

## Verification

- `npm run build` pass
- `npx playwright test --grep "home schema: local business hours and external entity links are valid"` pass
- `npm test` pass (`18/18`)

## Decision

- Keep Claude as the stronger strategic audit source.
- Treat Gemini as low-confidence for prioritization in its current form.
- Use this adjudicated score and issue list as the working baseline for next-step planning.

## Next Optimal Step

Move from easy fixes into the next highest-leverage growth work:

1. Start the content expansion pass on the existing blog inventory:
   - expand the best commercial-intent articles first
   - add in-body FAQ blocks
   - add stronger service-page internal links
2. Build the first geo-expansion pages for Deer Park and La Porte once the content format is locked.

## Done

- Adjudicated the conflicting Claude and Gemini audit outputs.
- Fixed the three verified source-level issues.
- Added smoke coverage for the schema/entity fixes.

## Not Done

- Content-depth and geo-page roadmap work has not started.

## Risks

- If the business later adopts cleaner vanity URLs or adds more official profiles, `sameAs` should be refreshed to match the strongest canonical identities.
