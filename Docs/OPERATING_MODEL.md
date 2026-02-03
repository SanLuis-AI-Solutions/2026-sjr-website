# Adaptive Operating Model (Agents + Skills + Workflows + MCPs)

This model is flexible by design. It optimizes tool selection per task without locking us into rigid pairs.

## Fast Triage (60 seconds)
1. **Scope**: single file vs. multi‑file/system change  
2. **Risk**: user data, production, security, or SEO impact?  
3. **Reversibility**: easy rollback or not?  
4. **Evidence**: do we need live verification (browser/devtools) or external docs?

Use this to decide how heavy the process should be.

## Decision Matrix (what to use)
### 1) Workflow selector
- Planning: `/plan`, `/sequential-plan`
- Debugging: `/debug`
- UI/UX: `/ui-ux-pro-max`
- SEO/GEO/AEO: `/seo-growth-plan`
- QA: `/qa-gate`
- Docs drift: `/sync-docs`

### 2) Agent selector (only when useful)
- Frontend/UI: `frontend-specialist`
- SEO/content: `seo-specialist`, `content-strategist`
- DB/data: `database-architect`
- Reliability: `sre-specialist`
- Multi‑agent coordination: `orchestrator`

### 3) Skill selector (minimal set)
- Always start with the minimal skills required.
- Add specialized skills only if there’s a clear match (e.g., `scroll-experience`, `schema-markup`).

### 4) MCP selector (only if needed)
- Browser checks: `chrome_devtools`, `puppeteer`
- Docs/library lookup: `context7`
- External services: `github`, `supabase-mcp-server`, `google-workspace`, `vercel`
- Design exploration: `stitch` (if screens are needed)

## Adaptive Routing Examples
### Design iteration (new or large visual change)
- Workflow: `/ui-ux-pro-max`
- Agents: `frontend-specialist` (+ `orchestrator` if multi‑page)
- Skills: `ui-ux-pro-max`, `frontend-design`, `scroll-experience` (optional)
- MCPs: `chrome_devtools` for live checks, `stitch` if generating screens

### SEO + service pages
- Workflow: `/seo-growth-plan`
- Agent: `seo-specialist`
- Skills: `seo-fundamentals`, `schema-markup`, `geo-fundamentals`
- MCPs: `context7`, `google-maps` (local intent)

### Debugging runtime issues
- Workflow: `/debug`
- Agent: `debugger`
- Skills: `systematic-debugging`
- MCPs: `chrome_devtools` for console/network

## Stitch Guidance (optional)
- Use Stitch for rapid visual exploration or net‑new screens.
- Once approved, convert to components and integrate into code.

## Guardrails
- Avoid tool overload: minimal set wins.
- If a skill doesn’t clearly match, skip it.
- High‑impact changes must include verification before completion.
