# Social Publishing Vendor Evaluation — Upload-Post vs OneUp

Date: `2026-03-17`
Scope: `SJR` only
Decision style: practical operator fit, not abstract platform ideology

## Recommendation

For `SJR`, `Upload-Post` is currently the better fit than `OneUp`.

Reason:

- it supports `Google Business Profile`
- it is explicitly `API-first`
- it has an official `n8n` integration path
- it is priced for a single-operator system
- it maps more cleanly to the `Nexus -> n8n -> publisher` architecture we are moving toward

## What We Verified

### Upload-Post

Official site and docs indicate:

- supported platforms include `Google Business`
- one API can publish to multiple networks
- API base URL is `https://api.upload-post.com/api`
- authentication is simple API-key based
- official `n8n` integration is part of the product surface
- free tier exists with `10 uploads/month`
- paid plans start at `16/month` on the annual view shown publicly

Relevant official pages:

- homepage: `https://www.upload-post.com/`
- API overview: `https://docs.upload-post.com/api/overview/`
- GBP + n8n page: `https://www.upload-post.com/n8n/google-business-upload/`

### OneUp

Official help/docs indicate:

- `Google Business Profile` support is real
- analytics/reporting are mature
- API access exists, but current public help says it is limited to `Growth` or `Business`
- OneUp is stronger for classic scheduling/reporting, but less obviously optimized for `n8n`-first automation

Relevant official pages:

- API help: `https://help.oneupapp.io/en-us/article/does-oneup-have-an-api-or-webhooks-3octje/`
- GBP permissions/help: `https://help.oneupapp.io/en-us/article/google-business-profile-permissions-8icmb1/`
- analytics/reporting: `https://help.oneupapp.io/en-us/article/does-oneup-have-any-analytics-or-reporting-1283w1c/`

## Why Upload-Post Wins For SJR

- `SJR` is a one-operator system, not an agency team workflow
- we want automation-first behavior, not a manual scheduler dashboard first
- `n8n` is available to us now
- `Nexus` is already becoming the internal research/brief/approval surface
- that means the publishing vendor should be the thinnest, most automatable execution layer possible

`Upload-Post` fits that model better than `OneUp`.

## Tradeoffs

### Upload-Post strengths

- cheaper public entry pricing
- official `n8n` path
- API-first positioning
- explicit `Google Business Profile` support
- better fit for future `Nexus -> n8n -> publisher` automation

### Upload-Post risks

- public marketing is very comparison-heavy
- team/editorial workflow depth appears lighter than OneUp
- we still need to validate real reliability, status visibility, and post confirmations ourselves

### OneUp strengths

- more mature scheduler-style product
- clearer analytics/reporting surface
- long-standing `GBP` support

### OneUp drawbacks for SJR

- API access appears gated to higher plans
- feels better suited to scheduler-dashboard usage than workflow-orchestrated automation
- less aligned with the `single operator + n8n` direction

## Decision For SJR

Use this approach:

- `Nexus` = research, briefs, approvals, results
- `n8n` = orchestration
- `Upload-Post` = publishing execution layer

Do not spend more time trying to force direct multi-platform OAuth inside the SJR repo right now.

## Immediate Next Validation

Run a small real-world test before fully switching direction:

1. create an `Upload-Post` account
2. connect:
   - `Google Business Profile`
   - one secondary social network
3. confirm the `n8n` integration flow works cleanly
4. publish one low-risk SJR post
5. verify:
   - post lands correctly
   - status is easy to inspect
   - media/text formatting is acceptable
   - cost/limits are workable

If that passes, the next implementation step in this repo should be:

- `Nexus -> n8n -> Upload-Post` integration

