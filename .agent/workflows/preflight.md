---
description: Preflight checklist to ensure core docs and environment setup are ready.
---

# /preflight - Project Preflight

$ARGUMENTS

---

## Task

Verify required docs and setup are in place before build starts.

This workflow is backed by a script so the output is consistent across projects:
- `scripts/preflight.ps1`

---

## Steps

0. **Load Project Brief (if present)**
   - Read `PROJECT_BRIEF.md` and use it to prefill context

1. **Run Preflight Script**
   - Run from repo root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\preflight.ps1
```

Optional strict mode (fails if recommended docs are missing):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\preflight.ps1 -Strict
```

2. **Env Check**
   - Confirm `.env.example`
   - List missing environment variables

3. **Workflow Readiness**
   - Confirm `/start`, `/kickoff`, `/research-pack`, `/brand-identity` exist

---

## Output

- Checklist status
- Missing items (if any)
- Next actions

---

## Usage

```
/preflight
```
