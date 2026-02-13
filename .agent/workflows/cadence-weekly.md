---
description: Weekly cadence loop for KPI/progress tracking. Updates Docs/STATUS.md and creates a short next-week plan.
---

# /cadence-weekly

$ARGUMENTS

---

## Task

Run the weekly project operating loop:
- update KPIs/progress,
- note learnings and risks,
- pick the next 3 priorities.

---

## Steps

1. Run status snapshot:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\status.ps1
```

2. Update `Docs/STATUS.md`:
- Current Focus
- KPIs
- This Week (shipped/learned/risks)
- Next Week (Top 3)

3. Ensure docs are up to date:
- `Docs/CHANGELOG.md` for production-impacting changes
- `Docs/HANDOFF.md` for session handoff

---

## Output

- Updated `Docs/STATUS.md`
- Next 3 priorities (can be pasted into an issue/sprint board)

