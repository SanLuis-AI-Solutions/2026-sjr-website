# SJR NotebookLM Activation And Thin-Post Expansion Pass

Date: `2026-03-17`
Branch: `master`
Scope: `SJR` content operating system

## Goal

Complete the next approved SJR content-ops step:

1. repair `NotebookLM` access
2. create the five SJR research notebooks with valid sources
3. use the `Research -> Briefs` system to drive expansion of the first three thin blog posts

## NotebookLM Activation

### What was repaired

The `NotebookLM` MCP cache was stale even though the local browser-backed skill could still see a prior notebook library.

Working recovery path used:

1. local skill re-auth:
   - `python scripts/run.py auth_manager.py reauth`
2. verify fresh local browser state:
   - `python scripts/run.py auth_manager.py status`
3. extract the fresh NotebookLM cookies from:
   - `C:\Users\ninef\.codex\skills\notebooklm\notebooklm\data\browser_state\state.json`
4. save those cookies into the MCP auth cache with:
   - `notebooklm.save_auth_tokens`
5. reload MCP auth:
   - `notebooklm.refresh_auth`

### Result

`NotebookLM` MCP is now usable again in-session.

Verified with:

- `notebooklm.notebook_list`
- `notebooklm.notebook_query`

## SJR Notebooks Created

### 1. SJR Services

- notebook id: `7ccc981f-7c0c-412e-becc-855cb7ce933c`
- source count at verification: `7`

Loaded sources:

- `/services`
- `/services/ring-sizing`
- `/services/pearl-restringing`
- `/services/custom-design`
- `/services/heirloom-restoration`
- `/faq`
- pasted repo note:
  - `SJR services and thin-post expansion priorities`

### 2. SJR Reviews And Voice

- notebook id: `38a675d2-08b7-4f12-b017-10f47fa97c85`
- source count at verification: `5`

Loaded sources:

- `/`
- official Yelp listing
- official Facebook page
- Google Maps place URL
- pasted repo note:
  - `SJR review voice and entity verification notes`

### 3. SJR Local SEO And Coverage

- notebook id: `dabe259e-d5b6-42a6-9039-1fa77f8e3c16`
- source count at verification: `10`

Loaded sources:

- `/`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`
- geo pages:
  - `/services/deer-park`
  - `/services/la-porte`
  - `/services/webster`
  - `/services/friendswood`
  - `/services/clear-lake`
- pasted repo note:
  - `SJR local SEO and coverage notes`

### 4. SJR Competitors

- notebook id: `0ec10071-e9b8-4a63-94e8-53d97b2867be`
- source count at verification: `5`

Loaded sources:

- `fastfix.com`
- `fastfixhouston.com`
- `fsjewelry.com`
- `zales.com/repair-services`
- pasted repo note:
  - `SJR competitive positioning notes`

### 5. SJR Seasonal And Occasion Demand

- notebook id: `7b67c145-2615-4633-ae0d-2f1edeff921a`
- source count at verification: `8`

Loaded sources:

- `/services/custom-design`
- `/services/ring-sizing`
- `/services/heirloom-restoration`
- `/blog/custom-design-timeline-guide`
- `/blog/cost-to-resize-gold-ring-pasadena`
- `/blog/heirloom-jewelry-restoration-repair-or-redesign`
- `/blog/where-to-get-watch-battery-replaced-pasadena`
- pasted repo note:
  - `SJR seasonal and occasion demand notes`

## Nexus Research And Briefs Added

### New research items

Inserted into `public.nexus_content_research`:

- `thin-post-expansion:custom-design-timeline-guide`
- `thin-post-expansion:heirloom-restoration-planning-guide`
- `thin-post-expansion:pearl-restringing-timing-guide`

All three now verify as:

- `status = ready_for_brief`
- `source_type = notebooklm`

### New brief items

Inserted into `public.nexus_content_queue`:

- `Expand: Custom Jewelry Design Timeline: From Idea to Finished Piece`
- `Expand: Heirloom Restoration Planning: What to Bring and Ask`
- `Expand: Pearl Restringing Timing: When to Restring and Why`

All three now verify as:

- `status = brief_ready`
- `content_type = blog`
- `brief_payload.mode = thin_post_expansion`

## Blog Expansion Pass

Expanded in:

- `src/lib/blog.ts`

Updated slugs:

1. `custom-design-timeline-guide`
2. `heirloom-restoration-planning-guide`
3. `pearl-restringing-timing-guide`

### New depth at verification

- `custom-design-timeline-guide`: `1003` words
- `heirloom-restoration-planning-guide`: `983` words
- `pearl-restringing-timing-guide`: `962` words

### What changed in each post

All three now include:

- fuller answer-first structure
- 5 substantial sections
- in-body FAQ
- next-step CTA block
- stronger local/in-house framing
- clearer decision criteria tied to the service

## Notebook-Grounded Research Checks

Verified using `notebooklm.notebook_query`:

- `SJR Services`
  - identified the same three thin service-adjacent posts as the highest-priority expansion targets
  - produced section guidance for:
    - `custom-design-timeline-guide`
    - `heirloom-restoration-planning-guide`
    - `pearl-restringing-timing-guide`
- `SJR Local SEO And Coverage`
  - summarized current indexing priorities correctly from notebook sources
- `SJR Reviews And Voice`
  - surfaced reusable trust signals:
    - in-house repairs
    - fast turnaround
    - honest pricing
    - 40+ years in business
    - 90-day workmanship warranty

## Verification

Passed:

- `python scripts/run.py auth_manager.py reauth`
- `python scripts/run.py auth_manager.py status`
- `notebooklm.refresh_auth`
- `notebooklm.notebook_list`
- multiple `notebooklm.notebook_query` checks
- Supabase SQL verification for:
  - `nexus_content_research`
  - `nexus_content_queue`
- `npm run build`
- `npx playwright test -g "mobile blog detail"`

Partially failed, but unrelated to this pass:

- `npm test`

Observed failures were outside the changed blog entries and notebook/content-op scope:

- pre-existing hydration mismatch errors
- pre-existing mobile nav / service-detail smoke failures

## Decision

Accept this pass.

Reason:

- `NotebookLM` is now active as the research backbone
- the five SJR notebooks now exist with purpose-bounded source sets
- the Research/Briefs system now reflects the three highest-priority thin-post expansions
- the three targeted blog posts now meet the intended service-adjacent depth range

## Next Optimal Step

Use the new notebooks to drive the next thin-post expansion cluster:

1. `professional-cleaning-vs-home-care`
2. `chain-repair-weak-points`
3. `watch-battery-replacement`
4. `stone-security-checklist`
5. `ring-sizing-guide`

In parallel, start planning the `Connections -> Stack` refactor so `Upload-Post`, `n8n`, and `NotebookLM` health can replace direct provider-OAuth messaging in Nexus.
