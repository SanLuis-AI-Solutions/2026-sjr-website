---
description: Install global skills, agents, workflows, and run MCP preflight.
---

# /installall - Install + MCP Preflight

$ARGUMENTS

---

## Task

Bring all global assets into the project and verify MCP servers are ready.

---

## Steps

1. **Install global assets**

Run this in the project root:

```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.codex\scripts\installall.ps1"
```

2. **Project bootstrap (env + MCP hints + deps)**

```powershell
powershell -ExecutionPolicy Bypass -File "./scripts/project-bootstrap.ps1"
```

3. **MCP preflight**

```powershell
./scripts/mcp-healthcheck.ps1
```

4. **Docker MCP stabilization (if needed)**

```powershell
./scripts/mcp-disable-broken.ps1
./scripts/mcp-healthcheck.ps1
```

5. **Global MCP readiness check**

- Confirm MCP config is global at `C:\Users\ninef\.codex\config.toml`
- If MCPs are missing or disabled, fix them in the global config (not in the repo)
- If using the aggregator, confirm `C:\Users\ninef\.mcp-master-config.json` exists and is referenced by `master-aggregator`
- Re-run preflight after any changes

---

## Output

- Install confirmation
- MCP health summary
- Any missing config/env keys

---

## Notes

- MCP config lives at `C:\Users\ninef\.codex\config.toml`.
- Secrets should remain in `.env.local` or the MCP config, not committed.
- Optional global env overlay path: `C:\Users\ninef\.codex\env\.env.local`

---

## Usage

```
/installall
```
