---
description: Quality gate checklist before deploy or milestone handoff.
---

# /qa-gate - Quality Gate

$ARGUMENTS

---

## Task

Run a lightweight QA checklist to catch issues early.

This workflow is backed by a script so it can be automated (CI + weekly health):
- `scripts/verify.ps1`

---

## Steps

1. **Checklist**
   - Lint
   - Tests
   - Security basics
   - Performance sanity
   - Accessibility sanity

2. **Run Verify Script**

From repo root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\verify.ps1
```

CI mode (uses `npm ci` when applicable):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\verify.ps1 -Ci
```

3. **Report**
   - Pass/Fail with next actions

---

## Output

- QA checklist results
- Next actions

---

## Usage

```
/qa-gate
```
