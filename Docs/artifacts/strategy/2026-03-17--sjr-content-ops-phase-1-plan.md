# SJR Content Ops Phase 1 Plan

Date: `2026-03-17`
Branch: `master`
Intent: turn the existing SJR admin into a single-business content operating system before extracting anything into a separate SanLuis product.

## Decision

Do not start a separate repo yet.

Build the first real content operating system inside the current SJR project, using the existing `Nexus` admin shell as the control plane. Design the data model and workflow so it can be extracted later if SJR proves the loop.

## Why This Is The Right Scope

- `SJR` is the live proving ground.
- The current repo already has:
  - a real admin shell
  - a publishing approval queue
  - lead and booking data
  - analytics recovery work
  - NotebookLM availability
- The missing piece is not more content generation. The missing piece is a closed loop:
  - research
  - strategy
  - approval
  - publishing
  - measurement
  - iteration

## Working Product Goal

Create one operator-facing system where `one person` can:

1. capture a research-backed content idea
2. turn it into an approved brief
3. turn the brief into a publishable asset
4. approve or reject it in Nexus
5. distribute it
6. measure whether it produced business value

## Phase 1 Scope

Phase 1 is about building the `research -> brief -> publish -> results` operating loop for SJR only.

In scope:

- new `Mission Control` sections for:
  - `Research`
  - `Briefs`
  - `Results`
- new upstream content queue tables
- NotebookLM-backed research capture workflow
- brief approval state
- explicit mapping from content to:
  - service
  - location
  - funnel stage
  - target platform
  - conversion goal
- content-result summaries tied to existing analytics and lead surfaces

Out of scope:

- multi-client architecture
- billing
- tenant isolation
- generalized SanLuis product branding
- rebuilding a multi-network scheduler from scratch
- removing the current publishing queue

## Existing Insertion Points

Current admin structure already supports this without a shell rewrite:

- sidebar section model:
  - `src/components/admin/admin-sidebar.tsx`
- Mission Control view switch:
  - `src/app/admin/(dashboard)/nexus/page.tsx`
- dashboard aggregation seam:
  - `src/lib/admin/nexus-dashboard.ts`
- publish approval queue:
  - `src/lib/admin/nexus-publishing.ts`
  - `public.nexus_publish_queue`
- live publish ledger:
  - `public.shared_slugs`
- provider config:
  - `public.nexus_config`

This means the correct move is to add upstream stages ahead of `Publishing`, not replace the current workflow.

## Proposed Workflow

### 1. Research

Purpose:
- collect source-grounded findings before any content brief exists

Inputs:
- NotebookLM notebook outputs
- FAQ patterns
- Google reviews
- local-intent gaps
- coverage/indexing gaps
- lead questions from inbox

Stored as:
- `nexus_content_research`

Minimum fields:
- `id`
- `topic`
- `source_type`
- `source_ref`
- `service_slug`
- `location_slug`
- `funnel_stage`
- `research_notes`
- `recommended_angle`
- `status`
- `created_at`
- `updated_at`

Statuses:
- `new`
- `ready_for_brief`
- `rejected`

### 2. Briefs

Purpose:
- convert research into a decision-ready content plan

Stored as:
- `nexus_content_queue`

Minimum fields:
- `id`
- `content_type`
- `title`
- `slug_candidate`
- `service_slug`
- `location_slug`
- `funnel_stage`
- `platform_targets`
- `primary_cta`
- `business_goal`
- `brief_payload`
- `status`
- `approved_by`
- `approved_at`
- `published_asset_slug`
- `created_at`
- `updated_at`

Statuses:
- `research_ready`
- `brief_ready`
- `approved`
- `draft_ready`
- `scheduled`
- `published`
- `archived`

### 3. Publishing

Purpose:
- keep the current publish approval workflow as the downstream execution stage

Current system to retain:
- `public.nexus_publish_queue`
- `public.shared_slugs`
- existing `Publishing` workspace in Nexus

Rule:
- do not overload `shared_slugs` with strategy metadata
- do not overload `nexus_publish_queue` with research or brief state

### 4. Results

Purpose:
- measure whether approved content creates useful business outcomes

Inputs:
- existing GA/lead instrumentation
- `shared_slugs`
- quote requests
- booking requests
- contact requests

Phase 1 result model:
- aggregate in `nexus-dashboard.ts`
- avoid a separate warehouse table until the metrics shape is stable

Required joins:
- content slug
- route views
- lead starts
- lead submissions
- assisted service inquiries where possible

## NotebookLM Role

NotebookLM should be the `research assistant`, not the runtime database.

Use it to produce:
- source-grounded research notes
- competitor/service summaries
- FAQ extraction
- seasonal topic prompts
- local-intent opportunity briefs

Persist into Nexus:
- the distilled research output
- not the raw notebook as the operational queue

Recommended notebook structure:
- `SJR Services`
- `SJR Reviews And Voice`
- `SJR Local SEO And Coverage`
- `SJR Competitors`
- `SJR Seasonal And Occasion Demand`

## Automation Model

Target model:
- automation does the collection, drafting, and status movement
- operator stays in the loop for approval

Desired human checkpoints:
- approve research promotion to brief
- approve brief
- approve final publish

Automation candidates after Phase 1:
- NotebookLM research import helper
- recurring topic generation from reviews + FAQs
- weekly result summaries
- stale-brief reminders
- publish retry handling

## UX Changes To Build Next

Add these new `Mission Control` sections:

- `Research`
  - compact queue of research findings
  - filters by service, location, status
- `Briefs`
  - approved/rejected brief queue
  - one-line strategy metadata visible at a glance
- `Publishing`
  - keep current approval queue
- `Results`
  - small scorecards and queue of top/underperforming content

Do not add another long-scroll page.
Keep the current viewport-contained workspace pattern.

## Phase Sequence

### Phase 1A

Foundation

- add schema for:
  - `nexus_content_research`
  - `nexus_content_queue`
- add admin helpers for read/write state
- add `Research` and `Briefs` sections in Nexus
- add lightweight seed/create flows

### Phase 1B

Approval workflow

- add promote-to-brief action
- add approve/reject brief action
- add handoff from approved brief into the current `Publishing` queue

### Phase 1C

Results loop

- add `Results` section
- aggregate content-level business signals in `nexus-dashboard.ts`
- show:
  - top performing content
  - content with no meaningful movement
  - content needing revision or redistribution

## Success Criteria

Phase 1 is successful when:

- every planned content item has a visible purpose before creation
- every content item is mapped to a service, location, and CTA
- every publish action can be traced back to an approved brief
- results can be reviewed inside Nexus without leaving the admin area
- the workflow remains usable by one operator without page-level clutter

## Risks

- direct GBP integration remains blocked by Google project approval/quota, so publishing infrastructure should not define the whole roadmap
- analytics can show directional value, but attribution quality will still be imperfect until content-level event joins are tightened
- if we add too many stages at once, the operator workflow will become heavy instead of useful

## Immediate Build Recommendation

Build `Phase 1A` next.

That means:

1. add the two new Supabase tables
2. add `Research` and `Briefs` sections to Mission Control
3. seed the first SJR content queue from known service, local, and lead-intent opportunities

This gives SJR a real operating system foundation without forcing a premature platform rewrite.
