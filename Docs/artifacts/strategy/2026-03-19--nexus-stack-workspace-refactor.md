# Nexus Stack Workspace Refactor

Date: `2026-03-19`
Scope: `SJR Mission Control`

## Decision

The old `Connections` workspace is now repurposed into `Stack`.

This is a product-clarity change, not just a label change. The dashboard should reflect the real SJR operating model:

- `Upload-Post` as the planned publishing execution layer
- `n8n` as the planned orchestration layer
- `NotebookLM` as the active research backbone
- `.health` snapshots as the measurement-freshness signal

Direct provider OAuth remains in the codebase as a legacy fallback path, but it is no longer the organizing concept of Mission Control.

## What Changed

- sidebar section renamed from `Connections` to `Stack`
- route token now prefers `view=stack`
- old `view=connections` links still normalize into the new stack workspace
- Google OAuth callbacks now redirect back into the `Stack` workspace instead of the old provider-auth screen
- provider-specific connect/setup buttons were removed from the primary Mission Control surface
- the workspace now shows stack-health rows instead of provider rows

## Stack Blocks

The current Stack workspace reports:

1. `Upload-Post`
- status: planned
- meaning: selected publisher direction, pilot still pending

2. `n8n`
- status: planned
- meaning: orchestration layer chosen, first live handoff not wired yet

3. `NotebookLM`
- status: live when source-grounded research rows exist
- meaning: the content research pipeline is active and being used upstream of briefs

4. `.health snapshots`
- status: live or attention based on snapshot freshness
- meaning: Results should only be trusted when the weekly and 90-day snapshots are current

## Why This Is Better

- stops implying that direct social OAuth is the main workflow
- matches the actual SJR plan already recorded in strategy docs
- keeps the workspace above the fold and low-clutter
- gives the operator a clearer answer to: “what part of the stack is real, stale, or still pending?”

## Temporary Legacy Constraint

Publishing still uses direct GBP connectivity as a temporary runtime dependency for the current `Publish now` path.

That warning remains a publishing-specific constraint, not a reason to keep provider-auth UI as the center of the Stack workspace.

## Next Product Step

The next high-value implementation after this refactor is:

- run the real `Upload-Post` pilot
- then wire the first bounded `Nexus -> n8n -> Upload-Post` handoff
