# Handoff Snapshot — 2026-03-09 (CST)

## Current State
- Branch: `master`
- Canonical domain: `https://www.susiesjewelryrepair.com`
- Primary status ledger: `Docs/STATUS.md`
- Canonical release decision: `Docs/RELEASE-DECISION.md`
- Latest code commit:
  - `653a7dd` `fix: suppress spam lead notifications`
- Latest deploy workflow:
  - `22870252426` (`success`)
  - note: initial spam-guardrail deploy run `22870062917` was cancelled during the Vercel production step and then superseded by the successful descendant deploy above

## Tooling State
- NotebookLM MCP:
  - installed, authenticated, and working
  - notebook listing verified in-session
- Google Workspace MCP:
  - installed, authenticated, and working in read-only mode
  - verified via `list_calendars` for `9xfold@gmail.com`
- Weekly SEO automation:
  - live via `.github/workflows/weekly-health.yml`
  - latest successful validation run: `22792076143`

## Session Summary (Most Recent)
Latest local follow-up:
- Implemented a first-pass `Results` section locally in Mission Control.
  - new section:
    - `Results`
  - current data sources:
    - `.health/weekly-seo-health-latest.json`
    - `.health/ga4-gsc-reconciliation-90d-latest.json`
    - `shared_slugs`
    - `nexus_content_queue`
    - `BLOG_POSTS`
  - current output:
    - weekly clicks, organic sessions, lead starts, and lead outcomes scorecards
    - per-post rows showing publish state, 7-day organic movement, 90-day clicks, and next-step guidance
  - local verification:
    - `npm run build`
    - `npx playwright test -g "admin routes: protected nexus and inbox redirect unauthenticated users to login"`
- Evaluated `Upload-Post` against `OneUp` for SJR.
  - artifact:
    - `Docs/artifacts/strategy/2026-03-17--social-publishing-vendor-evaluation-upload-post-vs-oneup.md`
  - current recommendation:
    - prefer `Upload-Post` for SJR if the real-world test passes because it better fits the planned `Nexus -> n8n -> publisher` execution model
- Implemented SJR content ops `Phase 1A` locally and aligned the live Supabase schema.
  - new Mission Control sections:
    - `Research`
    - `Briefs`
  - new shared helper:
    - `src/lib/admin/nexus-content-ops.ts`
  - live schema alignment applied to:
    - `public.nexus_content_research`
    - `public.nexus_content_queue`
  - normalized old draft fields/values:
    - `seed_key` -> `dedupe_key`
    - `lead|seo|review` -> `lead_signal|seo_gap|review_signal`
    - `decision` -> `conversion`
    - `review_reply` -> `gbp_post`
  - live starter seed inserted:
    - `4` research items
    - `1` starter brief
  - verification:
    - `npm run build`
    - `npx playwright test -g "admin routes: protected nexus and inbox redirect unauthenticated users to login"`
  - current remaining step:
    - commit + deploy the Nexus code changes so the new `Research` / `Briefs` sections become visible in production
- Defined the next SJR build track as a content operating system inside the current repo, not a separate new product repo.
  - artifact:
    - `Docs/artifacts/strategy/2026-03-17--sjr-content-ops-phase-1-plan.md`
  - decision:
    - keep `SJR` as the proving ground
    - extend the existing `Nexus` admin shell with upstream `Research`, `Briefs`, and `Results` stages
    - keep the current `Publishing` queue as the downstream execution stage
  - planned Phase 1A implementation:
    - add `nexus_content_research`
    - add `nexus_content_queue`
    - add `Research` and `Briefs` sections in Mission Control
- Confirmed the latest Google Business Profile connect blocker is no longer redirect configuration.
  - current blocker:
    - Google callback now returns quota blocking on `mybusinessaccountmanagement.googleapis.com`
    - this indicates Business Profile API project approval / usable quota is still the active blocker for the new Google Cloud project
  - latest diagnostic commits:
    - `cbeb71a` `fix: expose gbp oauth callback details`
    - `a1fca6a` `fix: classify gbp quota approval failures`
- Completed the next indexing-support step after Search Console submission for the five priority URLs.
  - strengthened contextual internal links into:
    - `/services/heirloom-restoration`
    - `/services/pearl-restringing`
    - `/services/deer-park`
  - implementation:
    - added compact `Helpful reads` article links on the two flagship service pages
    - added a matching `Helpful reads` sidebar card on the Deer Park geo page
  - verification:
    - `npm run build`
- Completed the next Google Business Profile production unblock step.
  - added the missing Vercel production envs:
    - `NEXUS_GBP_CLIENT_ID`
    - `NEXUS_GBP_CLIENT_SECRET`
    - `NEXUS_OAUTH_BASE_URL`
  - reran production deploy workflow:
    - `23069413332` (`success`)
  - live verification:
    - `https://www.susiesjewelryrepair.com/api/auth/social/gbp` now redirects to Google OAuth instead of `oauth=not-configured`
    - callback target in the live redirect is `https://www.susiesjewelryrepair.com/api/auth/social/gbp/callback`

1. Tightened the production deploy workflow to reduce wasted GitHub Actions usage.
   - docs/process-only pushes are now ignored by `.github/workflows/deploy-production.yml`
   - workflow-only or CI-only pushes can still run the workflow, but expensive steps now require real production-impacting file changes
   - Node install, Playwright, smoke tests, Vercel deploy, and perf gates are skipped automatically when only non-production files changed
   - job timeout is now capped at `30` minutes
2. Disabled Vercel Git auto-deploys locally pending commit.
   - added `vercel.json` with `git.deploymentEnabled: false`
   - reason:
     - the project already deploys via GitHub Actions + Vercel CLI
     - Vercel Git auto-deploys were failing on Hobby-team contributor restrictions for the commit author
   - expected result:
     - production deploys should come from the GitHub Actions workflow only
     - blocked duplicate Vercel Git deploys should stop appearing
3. Built and browser-verified a local-only publishing approval workflow inside Nexus for pre-commit review.
   - `Mission Control > Publishing` now renders a fixed-height approval queue instead of the old matrix-only table
   - each queue row now keeps the operator flow in one place:
     - post title and direct article link
     - GBP live status
     - approval status
     - last publish signal
     - inline actions for `Open post`, `Save approved draft`, `Publish now`, and `Clear approval`
   - new persistence surface:
     - `public.nexus_publish_queue`
   - new admin publish routes:
     - `/api/v1/nexus/publish-preview`
     - `/api/v1/nexus/publish-approve`
     - `/api/v1/nexus/publish-now`
   - preview and live publish now share the same GBP payload builder
   - local verification:
     - `npm run build`
     - `npx playwright test -g "admin routes: protected nexus and inbox redirect unauthenticated users to login"`
     - local Playwright browser verification:
       - `/admin/nexus?preview=1&view=publishing`
       - no right-side preview pane remains
       - queue rows expose direct article links and inline approval actions without page-level scroll
       - document height matches viewport during desktop verification
   - database guardrail applied:
     - created `public.nexus_publish_queue`
     - enabled RLS on `public.nexus_publish_queue`
4. Built and browser-verified a local-only admin shell redesign pass for pre-commit review.
   - `/admin/login` is now a minimal login-only screen
   - `/admin/nexus` is now split into left-rail sections:
     - `Overview`
     - `Leads`
     - `Publishing`
     - `Reviews`
     - `Connections`
   - `Overview` is the only Mission Control section that keeps the global KPI strip
   - non-overview sections now stay single-purpose instead of repeating global stats
   - auxiliary explainer side-panels were removed from:
     - `Overview`
     - `Leads`
     - `Publishing`
     - `Reviews`
     - `Connections`
   - `/admin/inbox` is now a tighter triage workspace using the same shell
   - Inbox behavior is now queue-scoped:
     - `Quotes` shows only quote requests
     - `Bookings` shows only booking requests
     - `Contacts` shows only contact messages
   - the redundant queue selector was removed
   - desktop shell is now viewport-contained:
     - no document-level scroll on local desktop verification
     - long request lists scroll inside the active panel instead of getting cut off at the bottom
   - Connections now include in-panel provider action buttons
   - Google Business Profile now has a real in-app OAuth connect path:
     - `/api/auth/social/gbp`
     - `/api/auth/social/gbp/callback`
   - Google Business Profile tokens and selected location metadata now persist in `public.nexus_config`
   - `shared_slugs` persistence is now wired to `/api/v1/nexus/sync` results so successful publishes can surface in the Nexus matrix
   - important implementation truth:
     - Google Business Profile is the only provider with a live OAuth connect + posting path in this pass
     - Meta / Pinterest / LinkedIn / X remain explicit deferred provider work
   - database guardrail applied:
     - enabled RLS on `public.nexus_config`
     - extended `shared_slugs.platform` to include `x` for repo/runtime consistency
   - local verification:
     - `npm run build`
     - `npx playwright test -g "admin routes: protected nexus and inbox redirect unauthenticated users to login"`
     - `POST /api/v1/nexus/sync` dry run:
       - `slug=how-to-choose-a-jeweler`
       - `platforms=["gbp"]`
       - result: `skipped / dry_run`
     - Playwright browser verification on local preview:
       - `/admin/nexus?preview=1`
       - `/admin/inbox?tab=quotes`
       - `/admin/inbox?tab=bookings`
       - `/admin/inbox?tab=contacts`
     - `/admin/nexus?view=connections`
     - `/api/auth/social/gbp?preview=1`
       - verified `307` redirect to Google OAuth
     - verified that non-overview Mission Control sections render without the removed side-panels
5. Added lead-notification spam guardrails across quote, booking, and contact.
   - new shared spam evaluator:
     - `src/lib/lead-spam.ts`
   - suspicious submissions now:
     - save as `spam`
     - skip Google Chat notifications
     - skip lead email notifications
     - skip booking calendar creation
   - suspicious submissions remain visible in `/admin/inbox`
   - artifact:
     - `Docs/artifacts/analytics/2026-03-09--lead-notification-spam-guardrails.md`
6. Verified Google Workspace MCP access is live in read-only mode for `9xfold@gmail.com`.
   - confirmed via `list_calendars`
7. Implemented the SEO + analytics integrity recovery pass.
   - production GA4 is now gated to `www.susiesjewelryrepair.com`
   - added explicit App Router pageview tracking
   - added additive `quote_form_start`, `booking_form_start`, and `contact_form_start` events
   - restored best-fit `301` coverage for legacy Wix URLs with known search demand
   - added the 90-day reconciliation script and weekly SEO health script
   - added `DASHBOARD.md` and `Docs/WEEKLY-SEO-HEALTH.md`
   - artifact:
     - `Docs/artifacts/analytics/2026-03-06--ga4-gsc-integrity-recovery.md`
8. Verified the discrepancy with fresh saved evidence.
   - `.health/ga4-gsc-reconciliation-90d-latest.md`
   - `.health/weekly-seo-health-latest.md`
   - key finding:
     - GA4 `2,366` active users over 90 days vs Search Console `102` clicks is primarily explained by `2,073` localhost / `127.0.0.1` users polluting GA4
9. Verified the code changes locally.
   - `npm run build`
   - `npm test`
   - `npm run google:reconcile-90d`
   - `npm run google:weekly-seo-health`
10. Validated the weekly GitHub reminder automation end to end.
   - workflow:
     - `.github/workflows/weekly-health.yml`
   - validation runs:
     - `22791746557`
       - workflow `success`
       - SEO snapshots skipped before GitHub secrets were configured
     - `22792076143`
       - workflow `success`
       - weekly SEO snapshots passed after GitHub secrets and repo variables were added
11. Added a one-time Google-admin cleanup runbook.
   - artifact:
     - `Docs/artifacts/analytics/2026-03-06--google-admin-cleanup-runbook.md`
12. Existing growth work remains live and unchanged:
   - audit adjudication
   - blog commercial-intent expansions
   - geo service-area pages and internal links

## Prior Session History

1. Adjudicated the conflicting Claude and Gemini audit outputs.
   - accepted the verified source findings from Claude
   - rejected Gemini's `TrackedLink`-first remediation path as inconsistent with the current release state
   - working baseline artifact:
     - `Docs/artifacts/audit/2026-03-06--master-audit-adjudication-and-quick-fix-pass.md`
     - working score: `75/100`
2. Implemented the easy-win fixes from the adjudicated audit:
   - `src/components/local-business-schema.tsx`: stop emitting Sunday opening hours for closed days
   - `src/lib/constants.ts`: populate `sameAs` with official Google Maps, Yelp, and Facebook entity references
   - `src/components/booking-date-time-fields.tsx`: clarify Saturday note as `Last booking start`
   - `tests/smoke.spec.ts`: add schema/entity smoke coverage
3. Verified the fix set locally:
   - `npm run build` pass
   - `npm test` pass
4. Quote-page phone visibility was re-checked and is already live in `src/app/quote/page.tsx`, so that Claude finding was not accepted as open work.
5. Verified the later Grok audit summary against the current codebase.
   - accepted only as directional growth input
   - rejected its claims that meta descriptions, canonicals, schema, and GA confirmation were absent
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--grok-audit-verification.md`
6. Verified and replaced the temporary entity references in structured data.
   - Google Maps place verified live against business name, address, phone, and website
   - Yelp and Facebook URLs verified via public search evidence
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--official-entity-links-verification.md`
7. Started the first commercial-intent blog growth pass.
   - expanded `/blog/cost-to-resize-gold-ring-pasadena`
   - expanded `/blog/where-to-get-watch-battery-replaced-pasadena`
   - expanded `/blog/can-a-severely-bent-ring-prong-be-fixed`
   - added in-body FAQ blocks + `FAQPage` schema support for FAQ-enabled blog posts
   - added stronger in-article next-step links into service, quote, and booking paths
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass.md`
8. Completed the second-tier commercial-intent blog pass.
   - expanded `/blog/safe-to-clean-vintage-diamond-ring-at-home`
   - expanded `/blog/heirloom-jewelry-restoration-repair-or-redesign`
   - added stronger FAQ and next-step coverage on both articles
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass-2.md`
9. Launched the first geo service-area page pair.
   - added `/services/deer-park`
   - added `/services/la-porte`
   - linked both pages from the main services hub
   - added both pages to the generated sitemap
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-1.md`
10. Strengthened the first geo pages with contextual article links.
   - linked five high-intent blog posts into Deer Park and La Porte using the existing article next-step block
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass.md`
11. Expanded the geo-page ring with three more nearby areas.
   - added `/services/webster`
   - added `/services/friendswood`
   - added `/services/clear-lake`
   - converted the services-hub nearby-area cards to render from shared geo-page data
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-2.md`
12. Strengthened the second geo ring with contextual article links.
   - linked Webster, Friendswood, and Clear Lake from the highest-match commercial-intent posts
   - artifact:
     - `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass-2.md`
13. Shifted the project from open-ended `/services` performance iteration into release closeout mode.
14. Shipped a path-aware deploy workflow fix:
   - commit: `0401274`
   - workflow run: `22785078312` (`success`)
   - effect: docs-only and non-perf-relevant pushes now skip post-deploy performance delta comparisons, while runtime pushes still execute them.
15. Re-ran closeout verification and locked the final evidence:
   - local verification passed:
     - `npm run build`
     - `npm test`
     - `powershell -ExecutionPolicy Bypass -File scripts/verify.ps1`
   - production verification passed:
     - `.health/release-closeout-verification-2026-03-06-final.json`
     - `.health/release-closeout-verification-2026-03-06-final.md`
     - result: `12/12` routes passed, with no unexpected console errors or broken images detected
16. Added closeout artifacts and canonical docs:
   - `Docs/artifacts/release/2026-03-06--claude-services-perf-synthesis.md`
   - `Docs/artifacts/release/2026-03-06--gemini-launch-readiness-audit.md`
   - `Docs/RELEASE-DECISION.md`
   - `Docs/POST-LAUNCH-BACKLOG.md`

## Locked Context (Do Not Regress)
- Iteration 33 is accepted and remains live.
- Iteration 35 is accepted and remains live.
- Iterations 32, 36, 37, and 38 are rejected and must remain eliminated.
- Step 6.2 `/services` experimentation is paused.
- `/services` performance is now treated as deferred post-launch debt, not a release blocker.
- Release posture is now `Ship now`.
- Working growth baseline after audit adjudication is `75/100`, not the inflated Gemini `87/100`.
- Anti-spam rule is now:
  - suspicious quote / booking / contact submissions should be stored as `spam`
  - suspicious submissions should not trigger Google Chat, lead email, or booking calendar side effects

## Evidence Pointers
- Latest anti-spam artifact:
  - `Docs/artifacts/analytics/2026-03-09--lead-notification-spam-guardrails.md`
- Analytics integrity artifact:
  - `Docs/artifacts/analytics/2026-03-06--ga4-gsc-integrity-recovery.md`
- Google-admin cleanup runbook:
  - `Docs/artifacts/analytics/2026-03-06--google-admin-cleanup-runbook.md`
- 90-day reconciliation:
  - `.health/ga4-gsc-reconciliation-90d-latest.json`
  - `.health/ga4-gsc-reconciliation-90d-latest.md`
- Weekly SEO health snapshot:
  - `.health/weekly-seo-health-latest.json`
  - `.health/weekly-seo-health-latest.md`
- Weekly dashboard:
  - `DASHBOARD.md`
- Weekly checklist:
  - `Docs/WEEKLY-SEO-HEALTH.md`
- Release decision: `Docs/RELEASE-DECISION.md`
- Post-launch backlog: `Docs/POST-LAUNCH-BACKLOG.md`
- Claude synthesis artifact: `Docs/artifacts/release/2026-03-06--claude-services-perf-synthesis.md`
- Gemini audit artifact: `Docs/artifacts/release/2026-03-06--gemini-launch-readiness-audit.md`
- Master audit adjudication:
  - `Docs/artifacts/audit/2026-03-06--master-audit-adjudication-and-quick-fix-pass.md`
- Grok audit verification:
  - `Docs/artifacts/audit/2026-03-06--grok-audit-verification.md`
- Official entity-link verification:
  - `Docs/artifacts/audit/2026-03-06--official-entity-links-verification.md`
- Blog commercial-intent expansion pass:
  - `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass.md`
- Blog commercial-intent expansion pass 2:
  - `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass-2.md`
- Geo service-area pages pass 1:
  - `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-1.md`
- Geo-page internal link pass:
  - `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass.md`
- Geo service-area pages pass 2:
  - `Docs/artifacts/audit/2026-03-06--geo-service-area-pages-pass-2.md`
- Geo-page internal link pass 2:
  - `Docs/artifacts/audit/2026-03-06--geo-page-internal-link-pass-2.md`
- Workflow fix run: `22785078312`
- Final production verification:
  - `.health/release-closeout-verification-2026-03-06-final.json`
  - `.health/release-closeout-verification-2026-03-06-final.md`
- Latest accepted performance evidence:
  - iteration 33 accepted run: `.health/perf-gate-2026-03-06T01-19-48-431Z/summary.json`
  - iteration 35 accepted run: `.health/perf-gate-2026-03-06T03-37-35-184Z/summary.json`
- Current deploy run for anti-spam rollout:
  - initial run: `22870062917` (`cancelled`)
  - superseding successful run: `22870252426` (`success`)

## Workspace Notes
- There is no confirmed Apps Script usage in the repo for lead notifications.
- Current Google Chat alerts are direct webhook posts from:
  - `src/lib/notify.ts`
- Spam/noise issue was upstream of Chat automation, so filtering was added in the API routes rather than in Workspace tooling.
- Google Drive API may still need enabling later if future sessions want to enumerate Apps Script projects through the Google Workspace MCP.

## Next Optimal Step

Do not open another `/services` micro-iteration loop during closeout.

1. Build `SJR Content Ops Phase 1A` inside the existing Nexus admin:
   - add `nexus_content_research`
   - add `nexus_content_queue`
   - add `Research` and `Briefs` Mission Control sections
   - keep `Publishing` as the downstream approval/distribution stage
2. Continue GBP provider unblock work only as a dependency lane:
   - resolve Google Business Profile project approval / quota state for the new Cloud project
   - use `9xfold@gmail.com` as the Google-side consent account because it owns the SJR GBP listing
3. Monitor live lead traffic for the new spam guardrails:
   - verify Google Chat noise drops
   - verify suspicious leads land in `/admin/inbox` as `spam`
   - verify real leads still notify correctly
4. Keep the weekly review loop lightweight:
   - run `npm run google:weekly-seo-health`
   - update `DASHBOARD.md`
   - review `Docs/WEEKLY-SEO-HEALTH.md`
5. Continue Google-admin monitoring:
   - review indexing state of `/watch-repair`, `/book`, and `/quote`
   - review redirected Wix URLs over the next 2 weeks
6. Treat Houston as a later, broader city play that needs a more differentiated angle than the suburban pages.
7. Treat future third-party model audits as lead sources only; verify technical claims against the repo before reprioritizing.

## External-Agent Output Rule (Mandatory)

When delegating to Gemini or Claude:

1. Persist findings to a file under `Docs/artifacts/`.
2. Include branch, commit, artifact path, run IDs, exact commands, and done/not done/risks.
3. Do not accept chat-only conclusions.

## GPT-5.4 New Chat Kickoff Prompt
```text
Continue from current master state of:
C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject

Read first (in order):
1) Docs/HANDOFF.md
2) Docs/RELEASE-DECISION.md
3) Docs/STATUS.md
4) Docs/artifacts/analytics/2026-03-09--lead-notification-spam-guardrails.md
5) Docs/artifacts/analytics/2026-03-06--ga4-gsc-integrity-recovery.md
6) Docs/artifacts/analytics/2026-03-06--google-admin-cleanup-runbook.md
7) Docs/POST-LAUNCH-BACKLOG.md

Context to respect:
- Release posture is Ship Now.
- Step 6.2 /services micro-iterations are paused.
- /services performance is deferred post-launch debt, not a release blocker.
- Iteration 33 and iteration 35 remain live.
- Iterations 32, 36, 37, and 38 remain rejected.
- Do not reopen the /services experiment loop unless the user explicitly approves a post-launch performance sprint with a new structural hypothesis.
- Latest shipped code change is `653a7dd` (`fix: suppress spam lead notifications`).
- Initial spam-guardrail deploy run `22870062917` was cancelled and superseded by successful deploy run `22870252426`.
- NotebookLM MCP is available.
- Google Workspace MCP is available in read-only mode and authenticated for `9xfold@gmail.com`.

Task:
1) Confirm whether the request is a true release blocker, post-launch backlog item, or optional polish.
2) Prefer smaller-scope fixes, verification, and documentation over new exploratory work.
3) Keep Docs/RELEASE-DECISION.md, Docs/STATUS.md, and Docs/HANDOFF.md aligned if anything material changes.
4) Ignore unrelated untracked local files unless the user explicitly asks about them (`.claude/`, `Docs/cookies.txt`).

Required output:
- commits
- deploy workflow run IDs
- blocker/deferred classification
- verification evidence used
- next optimal step
```
