# Adaptive Operating Model (Agents + Skills + Workflows + MCPs)

This model is intentionally flexible. It helps pick the best agent, workflow, skills, and MCPs per task without locking us into fixed pairs.

## Selection Rules (fast heuristic)
1. **Clarify scope + risk**
   - Low risk, single file: proceed directly.
   - Multi-file or structural: propose a short plan.
   - High risk (security/data/production): use the relevant workflow + verification.

2. **Pick a primary workflow (optional)**
   - Planning: `/plan`, `/sequential-plan`
   - Debugging: `/debug`
   - UX/design: `/ui-ux-pro-max`
   - SEO/GEO/AEO: `/seo-growth-plan`
   - QA/verification: `/qa-gate`
   - Docs sync: `/sync-docs`

3. **Pick the best agent (if needed)**
   - Frontend UI: `frontend-specialist`
   - Content/SEO: `seo-specialist` or `content-strategist`
   - Data/DB: `database-architect`
   - Reliability/ops: `sre-specialist`
   - Multi-agent tasks: `orchestrator`

4. **Pick the minimal skills**
   - Use only the smallest set required to solve the task.
   - Add specialized skills when the task clearly matches (e.g., `scroll-experience` for parallax/scroll).

5. **Pick MCPs only if needed**
   - Browser checks: `chrome_devtools` or `puppeteer`
   - Docs/library lookup: `context7`
   - External services: `github`, `supabase-mcp-server`, `google-workspace`, `vercel`

## Examples
### Design iteration
- Workflow: `/ui-ux-pro-max`
- Agent: `frontend-specialist`
- Skills: `ui-ux-pro-max`, `scroll-experience`, `frontend-design`
- Optional MCPs: `chrome_devtools` for live checks, `stitch` if generating new screens

### SEO + service pages
- Workflow: `/seo-growth-plan`
- Agent: `seo-specialist`
- Skills: `seo-fundamentals`, `schema-markup`, `geo-fundamentals`, `programmatic-seo` (if scaling)
- MCPs: `context7` for docs, `google-maps` for local signals

### Debugging runtime issues
- Workflow: `/debug`
- Agent: `debugger`
- Skills: `systematic-debugging`
- MCPs: `chrome_devtools` for console/network

## Stitch Guidance
- Use Stitch when you need rapid visual exploration or new screens.
- After a design is approved, convert to components and fold into the codebase.

## Guardrails
- Avoid tool overload; pick the minimum set required.
- If a skill does not match, don’t force it.
- Always verify before claiming completion on high‑impact changes.
