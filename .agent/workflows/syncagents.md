# /syncagents
# Sync local project agents with global agents.
# Usage: run `syncagents` from the project root.

- Ensure you are in the project root (contains `.agent/agents`).
- Run `syncagents` to merge local and global agents.
- Conflicts resolve by most recent file timestamp.

This keeps `C:\Users\ninef\.codex\agents` and `.agent/agents` in lockstep.
