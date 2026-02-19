# Whole-Site UX + QA Audit

Date: 2026-02-19
Scope: `/`, `/about`, `/services`, `/services/[slug]` (9), `/quote`, `/book`, `/contact`, `/faq`, `/blog`, `/blog/[slug]`, `/privacy`, `/terms`
Method: Web Interface Guidelines rule check + mobile smoke + keyboard/focus review + code-level semantic review.

## Ranked Findings

### Critical
- None found after this pass.

### High
- `src/components/site-shell.tsx`: skip-link reveal behavior caused a visible flash during normal navigation on some route changes.
  - Fix: replaced `sr-only + focus-visible` reveal pattern with an off-canvas transform pattern that only animates into view on actual focus.
- `src/app/services/[slug]/page.tsx`: section semantics had heading hierarchy friction (`How it works` and `Why customers choose us` labels were headings while true section titles were paragraphs).
  - Fix: promoted section titles to heading elements and moved labels to paragraph eyebrow text.
- `src/app/services/[slug]/page.tsx`, `src/app/services/page.tsx`, `src/components/services-grid.tsx`: service exploration lacked route-level engagement events for section visibility, FAQ opens, decision/market disclosure interactions, and CTA usage.
  - Fix: added event instrumentation (`service_section_view`, `service_faq_open`, `service_decision_expand`, `service_market_expand`, `service_cta_click`, plus `service_card_click` / `services_hub_cta_click`).
- `src/app/quote/page.tsx`, `src/app/book/page.tsx`, `src/app/contact/page.tsx`: forms only tracked success; no step/attempt/error visibility existed.
  - Fix: added `LeadFormTracker` for `lead_form_start`, `lead_form_step`, `lead_form_submit_attempt`, `lead_form_error`.

### Medium
- `src/app/page.tsx`: home route did not expose a skip-link entry point while shell-based routes did.
  - Fix: added same skip-link pattern and `id="main-content"` anchor target.

## Bounded Fix Bundle Applied
- New files:
  - `src/components/analytics/service-interaction-tracker.tsx`
  - `src/components/analytics/lead-form-tracker.tsx`
- Updated files:
  - `src/components/site-shell.tsx`
  - `src/app/page.tsx`
  - `src/components/analytics/tracked-link.tsx`
  - `src/components/services-grid.tsx`
  - `src/app/services/page.tsx`
  - `src/app/services/[slug]/page.tsx`
  - `src/app/quote/page.tsx`
  - `src/app/book/page.tsx`
  - `src/app/contact/page.tsx`

## Acceptance Check
- Critical/high findings resolved in code: Yes
- Mobile smoke remains green: Yes
- Build/lint/tests green: Yes
- Image audit green: Yes (`OK: 20/20`)
