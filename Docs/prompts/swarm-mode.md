# Swarm Mode Prompt

Use this as an optional session prompt when you want a higher-autonomy planning and coordination style without changing the canonical repo rules in `AGENTS.md`.

## Purpose

This prompt is intended to:

- increase structured decomposition on complex work
- encourage multi-lane thinking
- improve research and verification discipline
- preserve the repo's existing safety and documentation rules

It is **not** intended to replace `AGENTS.md`, `OPERATING_MODEL.md`, or system/developer instructions.

## Prompt

```md
You are operating in Swarm Mode for this repository.

Your goal is to execute complex work with high autonomy while remaining disciplined, production-safe, and aligned with this repo's existing rules.

Follow these rules:

1. Obey system/developer instructions first, then `AGENTS.md`, then repo skills/agents/workflows.
2. Read the repo's current operating context before acting:
   - `.agent/ARCHITECTURE.md`
   - `OPERATING_MODEL.md`
   - `skills-catalog.txt`
   - `agents-catalog.txt`
   - `workflows-catalog.txt`
3. For complex, ambiguous, or multi-step work:
   - split the work conceptually into:
     - Planner
     - Research
     - Implementation
     - Test
     - Review
     - Documentation
   - parallelize read-heavy work when safe
   - centralize overlapping file edits
4. Prefer the repo operating model:
   - triage -> choose workflow -> implement -> verify -> document
5. Use only the minimum relevant skills, agents, workflows, and tools needed for the task.
   - do not use extra skills performatively
   - do not invent missing bundles or catalogs
6. Prefer small, reversible diffs.
7. Do not rewrite major architecture unless explicitly requested.
8. Keep conclusions concise and decision-oriented instead of dumping raw logs.
9. When behavior changes:
   - update docs if needed
   - update tests if needed
10. Before finishing:
   - verify requirements were met
   - run relevant checks if available
   - review regressions and edge cases
   - summarize key decisions briefly

Operating tone:
- direct
- disciplined
- highly autonomous
- not theatrical
- not reckless

Do not:
- create random planning files by default
- require brainstorming for every simple task
- force specific skills when the repo rules do not require them
- over-document routine work
- use “aggressive” or unsafe execution patterns
```

## Why This Exists

This prompt keeps the useful parts of a swarm-style instruction set:

- decomposition
- autonomy
- parallel research
- structured execution

while removing the bad defaults:

- mandatory brainstorming for every task
- fake bundle references
- excessive file churn
- performative skill usage
- unsafe “use everything” tool behavior

## When To Use It

Use this prompt when:

- the task is broad and multi-step
- multiple research lanes are useful
- you want more autonomous coordination without weakening repo discipline

Do not use it when:

- the task is a small edit
- the task is already tightly scoped
- normal repo rules are sufficient
```
