# AGENTS.md - Universal Project Rules

These rules apply to any AI coding, research, or implementation agent working in this project and future projects that copy this file, including Codex, Claude, and Gemini.

## Mission
Work as a disciplined software engineering agent inside this repository.

Prefer:
- accurate changes
- minimal diffs
- production-safe execution
- clear conclusions over noisy output

## Priority
1) System/Developer instructions
2) This AGENTS.md
3) Agent and skill rules (when a skill is triggered)

## Always-On Behavior
- Read `.agent/ARCHITECTURE.md` at session start.
- Read `OPERATING_MODEL.md` at session start.
  - `OPERATING_MODEL.md` is the process playbook.
  - `AGENTS.md` remains the enforcement rules.
- Use the catalogs for current capabilities:
  - `skills-catalog.txt`
  - `agents-catalog.txt`
  - `workflows-catalog.txt`
- Use skills only when explicitly triggered (by name or clear match).
- Prefer minimal, targeted file reads.
- Keep changes safe, reversible, and consistent with existing patterns.
- Read existing code patterns before editing.
- Preserve naming conventions and folder structure.

### Required Project Files
If any of these are missing, treat it as project setup drift and restore them:
- `OPERATING_MODEL.md`
- `AGENTS.md`
- `.agent/ARCHITECTURE.md`
- `skills-catalog.txt`
- `agents-catalog.txt`
- `workflows-catalog.txt`

## Operating Model (Required)
- For multi-step work, follow the execution loop in `OPERATING_MODEL.md`:
  - triage -> choose workflow -> implement -> verify -> document
- Use MCP servers when evidence quality matters:
  - browser checks
  - external services
  - deployments
  - production verification

## Request Handling
- Clarify when requirements are ambiguous, high-risk, or multi-step.
- For straightforward edits, proceed without unnecessary questions.
- For multi-file or structural changes, propose a short plan before edits.
- Summarize conclusions cleanly instead of dumping raw logs.

## Multi-Agent Workflow
When the task is complex, split work conceptually into:
- Planner
- Research
- Implementation
- Test
- Review
- Documentation

Guidance:
- Parallelize read-heavy work when it reduces latency and does not create merge risk.
- Centralize overlapping file edits to avoid conflicts.
- Do not create parallel implementation streams that touch the same files without a clear coordination point.

## Code Quality & Safety
- Keep code concise and direct.
- Favor clarity over cleverness.
- Prefer small diffs.
- Do not rewrite major architecture unless explicitly requested.
- Avoid dead code.
- Avoid premature abstraction.
- Keep functions focused.
- Add comments only when logic is non-obvious.
- Do not commit secrets; use `.env`, `.env.local`, and `.env.example` patterns.
- Follow existing project conventions and lint/test expectations.
- Flag risks explicitly.

## Install/Sync Shortcuts (PowerShell)
- `installall` (skills + agents + workflows)
- `installskills`, `installagents`, `installworkflows`
- `syncskills`, `syncagents`, `syncworkflows`

## Documentation Hygiene
When adding/removing skills/agents/workflows, update:
- `skills-catalog.txt`
- `agents-catalog.txt`
- `workflows-catalog.txt`
- `.agent/ARCHITECTURE.md`

When behavior changes:
- update tests if needed
- update docs if needed
- keep documentation aligned with implementation

## Validation
Before finishing:
1. verify requirements were met
2. run relevant tests, checks, or static validation if available
3. review for regressions, edge cases, and missing docs
4. confirm no unnecessary architectural drift was introduced
5. provide a concise final summary
