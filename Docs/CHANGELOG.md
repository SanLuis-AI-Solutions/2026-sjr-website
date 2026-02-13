# Changelog

Use this file for production-impacting changes.

- 2026-02-13: Decision log corrected to reflect 9 services (previously drifted to 10).
- 2026-02-13: Removed hardcoded service pricing in UI; services now display `starting_price` / `time_estimate` when available, otherwise fall back to “request quote” messaging.
- 2026-02-13: Fixed scroll-reveal animations on client-side navigation (re-scan on route change) and added default turnaround messaging to service fallbacks.
- 2026-02-13: Added deterministic deployment guardrails: `scripts/deploy-prod.ps1` (no silent Vercel Git-hook failures) and a GitHub Action to deploy on pushes to `master` when `VERCEL_TOKEN` is configured.
- 2026-02-11: Lead notifications verified: Contact, Booking, and Quote send email notifications to `contact@susiesjewelryrepair.com` and post to Google Chat via webhooks.
