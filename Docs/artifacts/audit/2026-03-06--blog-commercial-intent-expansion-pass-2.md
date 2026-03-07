# Blog Commercial-Intent Expansion Pass 2

## Metadata

- branch: `master`
- base commit reviewed: `93c12a2`
- artifact path: `Docs/artifacts/audit/2026-03-06--blog-commercial-intent-expansion-pass-2.md`
- implementation date: `2026-03-06`

## Goal

Complete the second-tier commercial-intent refresh before moving into the first geo-expansion pages.

## Chosen Posts

1. `/blog/safe-to-clean-vintage-diamond-ring-at-home`
2. `/blog/heirloom-jewelry-restoration-repair-or-redesign`

Reasoning:

- both posts sit close to high-trust, high-consideration repair and redesign intent
- both support local discovery for heirloom, restoration, and careful-cleaning queries
- both were still relatively thin compared with the upgraded first-tier commercial posts

## Implemented Changes

- `src/lib/blog.ts`
  - expanded both target posts with more decision depth and local context
  - added in-body FAQ data and stronger next-step link data
- `tests/smoke.spec.ts`
  - added a targeted smoke check for the heirloom article FAQ and next-step blocks

## Content Outcomes

### Vintage cleaning article

- clearer guardrails around safe at-home cleaning
- stronger explanation of why vintage settings are structurally different
- more direct routing into professional cleaning and heirloom restoration

### Heirloom restoration vs redesign article

- clearer restoration-vs-redesign decision guidance
- stronger explanation of when redesign is the better long-term choice
- more direct routing into heirloom restoration, custom design, and booking

## Verification

- `npm run build`
- `npm test`

## Decision

- accept and keep live

Reasoning:

- this continues the same successful content pattern established in the first pass
- it increases answer depth on high-consideration topics without adding route sprawl
- it strengthens internal conversion pathways before the geo-page rollout

## Next Optimal Step

Build the first geo-expansion service-area pages for:

1. Deer Park
2. La Porte

Use the commercial-intent article structure as the model for:

- local service framing
- concise FAQ support
- direct quote and booking pathways
