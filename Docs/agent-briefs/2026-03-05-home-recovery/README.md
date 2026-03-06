# Agent Handoff Pack — Home Recovery (2026-03-05)

Purpose: standardize parallel work from Gemini and Claude so Codex can verify outcomes quickly with evidence.

## Files

1. `GEMINI_TASK.md`
- Copy/paste prompt for SEO/GEO/AEO copy optimization work.

2. `CLAUDE_TASK.md`
- Copy/paste prompt for LCP forensics and one-change recommendation.

3. `INTAKE_CHECKLIST.md`
- Required response format and evidence checklist both agents must follow.

## Usage

1. Send `GEMINI_TASK.md` to Gemini.
2. Send `CLAUDE_TASK.md` to Claude.
3. Require both to follow `INTAKE_CHECKLIST.md` exactly.
4. Require each agent to save results to an artifact file path (not just chat text).
5. Return branch, commit, artifact path, and run IDs to Codex for independent verification.
