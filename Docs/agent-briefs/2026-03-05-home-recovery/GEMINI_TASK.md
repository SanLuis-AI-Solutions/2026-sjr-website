# Prompt: Gemini (SEO/GEO/AEO Home Copy)

You are working in this repo:
`C:\Users\ninef\SanLuis Solutions projects\sjr-new-website-aiproject`

Mission:
Create SEO/GEO/AEO-optimized homepage copy options (analysis + artifact only, no production code changes).

Hard constraints:
- Keep premium/luxury tone.
- Positive trust language only (avoid fear/negative framing).
- Must support local intent for Pasadena.
- Do NOT edit source code files.
- Do NOT edit `Docs/STATUS.md`.
- Only create one artifact file.

Context to use:
- Current home H1: `Trusted Pasadena Jewelry Repair, Done In-House.`
- Related file: `src/components/hero.tsx`
- Perf optimization is tracked separately; this task is copy quality only.

Required output file:
- `Docs/artifacts/seo/2026-03-05--gemini-home-copy-options.md`

Artifact must include:
1. Objective
2. Inputs reviewed
3. Three headline options (H1)
4. Three supporting subhead options
5. Three meta description options (home page)
6. GEO/AEO rationale for each option set (short, explicit)
7. Recommended option set (single winner) + why
8. Implementation snippet (ready-to-paste text only, no file edits)
9. Risks/notes

Required entities/keywords across recommended set:
- `Pasadena`
- `jewelry repair`
- `in-house` (or `on-site` if stronger)
- trust/quality signal (example: `master craftsmanship`)

Git/process requirements:
- Branch: `agent/gemini-home-copy-20260305`
- Commit only the artifact file.
- Final response must follow `Docs/agent-briefs/2026-03-05-home-recovery/INTAKE_CHECKLIST.md` exactly.
