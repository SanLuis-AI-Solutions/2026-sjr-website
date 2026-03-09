# Lead Notification Spam Guardrails

Date: 2026-03-09  
Branch: `master`

## Goal
- reduce spam noise in Google Chat and email notifications for quote, booking, and contact submissions
- preserve suspicious submissions in the admin inbox for manual review instead of dropping them entirely

## Change
- added shared spam evaluation in `src/lib/lead-spam.ts`
- routes updated:
  - `src/app/api/contact/route.ts`
  - `src/app/api/quote/route.ts`
  - `src/app/api/book/route.ts`
- inbox updated:
  - `src/app/admin/inbox/page.tsx`

## Guardrails Added
- invalid email format is flagged as spam
- invalid / non-human-like name is flagged as spam
- multiple URL-like strings are flagged as spam
- common outreach / marketing spam phrases are flagged when no jewelry-service intent is present
- suspicious submissions are saved with:
  - `status = spam`
  - `source = website_spam_suspected:<reason>`

## Behavior
- honeypot handling remains in place
- suspicious leads still return a success-style response
- suspicious leads no longer:
  - post to Google Chat
  - send lead email alerts
  - create booking calendar events
- suspicious leads remain reviewable in `/admin/inbox`

## Verification
- pending
  - `npm run build`
  - targeted smoke / regression pass if needed

## Risks
- some edge-case real leads could be marked as spam if they look like generic marketing outreach
- current spam reasons are stored in `source`, not a dedicated moderation field

## Next Step
- verify build and production behavior
- if spam persists, add a second layer:
  - lightweight per-IP or per-email rate limiting
  - optional captcha / Turnstile only on the highest-abuse form
