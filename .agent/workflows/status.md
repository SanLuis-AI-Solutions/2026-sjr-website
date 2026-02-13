---
description: Show a real project status snapshot (git + env + stack detection). Backed by scripts/status.ps1.
---

# /status - Show Status

$ARGUMENTS

---

## Task

Show a quick, evidence-based snapshot of the project state (path, git, env readiness, stack detection).

---

## Steps

Run from repo root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\status.ps1
```

---

## Output

- Git: branch/commit/dirty + origin
- Env: missing/empty keys compared to `.env.example`
- Stack: quick detection (Node + package.json count)
- Docs: baseline doc presence

