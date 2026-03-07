# Gemini Full-Site Audit Task

You are conducting an evidence-heavy full-site audit for:

- `https://www.susiesjewelryrepair.com`

Your job is to produce a URL-specific, score-driven audit that can be compared directly against a Claude strategy audit.

## Read First

1. `Docs/agent-briefs/2026-03-06-full-site-audit/README.md`
2. `Docs/agent-briefs/2026-03-06-full-site-audit/REPORT_TEMPLATE.md`
3. `Docs/RELEASE-DECISION.md`
4. `Docs/POST-LAUNCH-BACKLOG.md`
5. `Docs/STATUS.md`

## Your Job

Focus on:

- page-by-page evidence
- score integrity
- specific SEO defects and opportunities
- GEO / AEO extractability
- local SEO signals
- internal linking quality
- conversion clarity on revenue pages

You should be more granular than Claude. Prefer URL-specific findings over broad statements.

## Required Audit Scope

Review at minimum:

- `/`
- `/services`
- `/services/watch-repair`
- `/quote`
- `/book`
- `/contact`
- `/blog`
- one representative blog article
- `/faq`
- `/about`
- `/privacy`
- `/terms`

## Required Output

Produce markdown intended for:

- `Docs/artifacts/audit/2026-03-06--gemini-full-site-seo-geo-aeo-audit.md`

Use the report template structure.

Also include these Gemini-specific sections:

## URL-Specific Findings Matrix

| URL | Primary intent | What works | What weakens ranking or conversion | Fix |
| --- | --- | --- | --- | --- |

## Evidence-Based Priority List

Rank the top `10` issues. For each item include:

- severity
- likely impact on traffic, answerability, or conversion
- affected URLs
- classification:
  - `must fix`
  - `high leverage`
  - `worth testing`
  - `safe to defer`

## Hard Rules

- Give an overall score `/100`.
- Use the shared scoring rubric exactly.
- If a page is strong, still say what is missing.
- If you identify technical or content debt, tie it to search visibility, AI visibility, or conversion performance.
- Do not propose broad redesigns unless you can show why the current structure is suppressing traffic or bookings.

## Required Metadata

Include:

- branch
- commit
- artifact path
- audit date
- URLs reviewed
- done
- not done
- risks
