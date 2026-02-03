# Adaptive Operating Model (Agents + Skills + Workflows + MCPs)

This model is flexible by design. It optimizes selection per task **and** supports multi‑tool orchestration when needed.

## Orchestration Ladder (step‑by‑step)
1. **Triage**: scope, risk, reversibility, evidence needed.
2. **Plan**: choose a primary workflow and define workstreams.
3. **Parallel Workstreams** (if required): assign agents + skills per lane.
4. **Integrate**: merge outputs into a single coherent change.
5. **Verify**: QA/health checks + targeted validation.
6. **Document**: sync docs and decision log when material changes occur.

## Fast Triage (60 seconds)
1. **Scope**: single file vs. multi‑file/system change  
2. **Risk**: user data, production, security, or SEO impact?  
3. **Reversibility**: easy rollback or not?  
4. **Evidence**: live verification needed (browser/devtools) or external docs?

Use this to decide how heavy the process should be.

## Decision Matrix (what to use)
### 1) Workflow selector (can chain)
- Planning: `/plan`, `/sequential-plan`
- Debugging: `/debug`
- UI/UX: `/ui-ux-pro-max`
- SEO/GEO/AEO: `/seo-growth-plan`
- QA: `/qa-gate`
- Docs drift: `/sync-docs`

### 2) Agent selector (use multiple when needed)
- Frontend/UI: `frontend-specialist`
- SEO/content: `seo-specialist`, `content-strategist`
- DB/data: `database-architect`
- Reliability: `sre-specialist`
- Multi‑agent coordination: `orchestrator`

### 3) Skill selector (minimal, but multi‑skill allowed)
- Start minimal, then layer specialized skills with clear justification.
- Examples: `scroll-experience`, `schema-markup`, `web-performance-optimization`.

### 4) MCP selector (use when evidence is required)
- Browser checks: `chrome_devtools`, `puppeteer`
- Docs/library lookup: `context7`
- External services: `github`, `supabase-mcp-server`, `google-workspace`, `vercel`
- Design exploration: `stitch` (if screens are needed)

## Auto‑Router (task → best starting bundle)
| Task Type | Workflows | Agents | Skills | MCPs |
| --- | --- | --- | --- | --- |
| Visual redesign | `/plan` → `/ui-ux-pro-max` → `/qa-gate` | `frontend-specialist` + `orchestrator` | `ui-ux-pro-max`, `frontend-design`, `scroll-experience` | `chrome_devtools`, `stitch` |
| New page build | `/plan` → `/create` → `/qa-gate` | `frontend-specialist` | `react-patterns`, `nextjs-best-practices` | `chrome_devtools` |
| SEO/service expansion | `/sequential-plan` → `/seo-growth-plan` → `/qa-gate` | `seo-specialist` + `content-strategist` | `seo-fundamentals`, `schema-markup`, `geo-fundamentals` | `context7`, `google-maps` |
| Bug / runtime error | `/debug` → `/qa-gate` | `debugger` | `systematic-debugging` | `chrome_devtools` |
| Performance regression | `/debug` → `/qa-gate` | `performance-optimizer` | `web-performance-optimization` | `chrome_devtools` |
| Analytics tracking | `/analytics-implementation` | `analytics-lead` | `analytics-tracking`, `ga4-analytics` | `context7` |
| Content strategy | `/blog-strategy` | `content-strategist` | `blog-content-strategy`, `keyword-research` | `context7` |

## Multi‑Tool Orchestration Examples
### Design iteration (large visual change)
- Workflows: `/plan` → `/ui-ux-pro-max` → `/qa-gate`
- Agents: `frontend-specialist` + `orchestrator` (if multi‑page)
- Skills: `ui-ux-pro-max`, `frontend-design`, `scroll-experience`
- MCPs: `chrome_devtools` (live), `stitch` (exploration)

### SEO + service pages (multi‑page rollout)
- Workflows: `/sequential-plan` → `/seo-growth-plan` → `/qa-gate`
- Agents: `seo-specialist` + `content-strategist`
- Skills: `seo-fundamentals`, `schema-markup`, `geo-fundamentals`
- MCPs: `context7`, `google-maps`

### Debug + performance regression
- Workflows: `/debug` → `/qa-gate`
- Agents: `debugger` + `performance-optimizer`
- Skills: `systematic-debugging`, `web-performance-optimization`
- MCPs: `chrome_devtools`

## Stitch Guidance (optional)
- Use Stitch for rapid visual exploration or net‑new screens.
- Once approved, convert to components and integrate into code.

## Guardrails
- Avoid tool overload **unless** parallel workstreams are required.
- If a skill doesn’t clearly match, skip it.
- High‑impact changes must include verification before completion.
