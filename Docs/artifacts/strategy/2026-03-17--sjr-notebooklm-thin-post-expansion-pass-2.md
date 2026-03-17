# SJR NotebookLM Thin-Post Expansion Pass 2

Date: `2026-03-17`
Branch: `master`
Scope: `SJR` content operating system

## Goal

Execute the next thin-post expansion cluster using the active `NotebookLM` research stack and keep the live `Research -> Briefs` system aligned with the published blog library.

Target slugs:

1. `professional-cleaning-vs-home-care`
2. `chain-repair-weak-points`
3. `watch-battery-replacement`
4. `stone-security-checklist`
5. `ring-sizing-guide`

## Research Inputs Used

### NotebookLM notebooks

- `SJR Services` — `7ccc981f-7c0c-412e-becc-855cb7ce933c`
- `SJR Reviews And Voice` — `38a675d2-08b7-4f12-b017-10f47fa97c85`

### NotebookLM query use

Queried the `SJR Services` notebook for a post-specific expansion brief for each target slug.

Recurring themes pulled from notebook answers:

- tie every article back to a real in-house SJR service path
- explain decision points clearly instead of repeating generic care advice
- preserve the local Pasadena / Fairmont Pkwy context
- reinforce speed, transparency, and in-house handling
- use FAQ and next-step CTA blocks to close the loop from education to action

Queried the `SJR Reviews And Voice` notebook for reusable trust/voice cues.

Voice cues reused:

- local, family-owned business
- in-house handling
- fast turnaround / Same Day or Next Day where appropriate
- transparent approvals and pricing
- careful craftsmanship over chain-store handling

## Nexus Research And Briefs Added

### New research items

Inserted into `public.nexus_content_research`:

- `thin-post-expansion:professional-cleaning-vs-home-care`
- `thin-post-expansion:chain-repair-weak-points`
- `thin-post-expansion:watch-battery-replacement`
- `thin-post-expansion:stone-security-checklist`
- `thin-post-expansion:ring-sizing-guide`

Verified status:

- all `5` rows = `ready_for_brief`

### New brief items

Inserted into `public.nexus_content_queue`:

- `Expand: Professional Jewelry Cleaning vs. At-Home Cleaning`
- `Expand: Chain Repair 101: Necklace and Bracelet Weak Points`
- `Expand: Watch Battery Replacement: Timing and Care Tips`
- `Expand: Stone Security Checklist: Preventing Loose Diamonds`
- `Expand: Ring Sizing: What to Know Before You Resize`

Verified status:

- all `5` rows = `brief_ready`

## Blog Expansion Pass

Updated in:

- `src/lib/blog.ts`

### Final verified depth

- `professional-cleaning-vs-home-care` — `965` words
- `chain-repair-weak-points` — `963` words
- `watch-battery-replacement` — `997` words
- `stone-security-checklist` — `962` words
- `ring-sizing-guide` — `1065` words

### Structural upgrades applied

All five posts now include:

- stronger answer-first excerpts
- expanded key takeaways
- `5` substantial sections each
- `3` in-body FAQs each
- explicit next-step CTA blocks
- stronger local, in-house, decision-first framing

### Service alignment by post

- `professional-cleaning-vs-home-care`
  - centered on `jewelry-cleaning`, with `stone-setting` and `heirloom-restoration` tie-ins
- `chain-repair-weak-points`
  - centered on `necklace-repair` and `bracelet-repair`
- `watch-battery-replacement`
  - centered on `watch-repair`
- `stone-security-checklist`
  - centered on `stone-setting`, with restoration and ring-safety tie-ins
- `ring-sizing-guide`
  - centered on `ring-sizing`, with `stone-setting` and `jewelry-cleaning` tie-ins

## Additional Codebase Findings

Subagent review confirmed:

- no changes were required outside `src/lib/blog.ts` for these blog fields
- the blog detail page already supports:
  - `faqHeading`
  - `faqs`
  - `nextStepsHeading`
  - `nextStepsIntro`
  - `nextSteps`
- the existing page already conditionally renders the FAQ UI and `FAQPage` schema when `faqs` are present

## Verification

Passed:

- `npm run build`
- `npx playwright test -g "mobile blog detail"`
- NotebookLM MCP:
  - `refresh_auth`
  - `notebook_query` for all five target slugs
- Supabase SQL verification for:
  - `nexus_content_research`
  - `nexus_content_queue`
- local word-count / shape verification for all five posts:
  - word count
  - FAQ count
  - next-step count

## Decision

Accept this pass.

Reason:

- the next five thin posts are now at useful service-adjacent depth
- the `NotebookLM` stack is being used as the actual upstream research backbone
- the live Nexus `Research -> Briefs` queue matches the blog expansion work instead of drifting behind it

## Next Optimal Step

Refactor `Mission Control > Connections` into a real stack-health workspace:

1. rename the operator concept from provider connections to stack health / ops
2. surface:
   - `Upload-Post`
   - `n8n`
   - `NotebookLM`
   - `.health` freshness
3. remove or demote direct provider-OAuth messaging that no longer matches the intended SJR operating model
