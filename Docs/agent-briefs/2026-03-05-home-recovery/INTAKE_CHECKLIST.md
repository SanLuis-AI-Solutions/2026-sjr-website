# Shared Intake Checklist (Required Response Format)

Both agents must return this exact structure:

```text
Branch: <name>
Commit: <sha>
Artifact: <path>
Workflow/Run IDs:
- <id or "none">
Commands Executed:
- <command 1>
- <command 2>
Done:
- <completed item 1>
- <completed item 2>
Not done:
- <missing item 1 or "none">
Risks:
- <risk 1 or "none">
Acceptance Check:
- Objective met: <yes/no>
- Evidence attached: <yes/no>
- Scope respected: <yes/no>
```

## Evidence Rules

1. Every claim must cite one of:
- artifact file path
- command output summary
- run ID
- metric file path (`.health/.../summary.json` or `.health/lcp-diagnostics-*.json`)

2. No “done” claims without evidence.

3. If blocked, include:
- exact blocker
- attempted command(s)
- safest next step

## Scope Guardrails

1. Do not edit unrelated files.
2. Do not update `Docs/STATUS.md`.
3. Do not deploy unless explicitly requested in prompt.
