# Full Site Audit Brief

## Objective

Run a full website audit for `https://www.susiesjewelryrepair.com` with one commercial goal:

- increase qualified traffic
- increase repair bookings and quote starts
- increase real storefront visits and calls

The audit must cover:

- SEO
- GEO
- AEO
- local-intent conversion readiness
- mobile UX
- trust and entity clarity

## Business Context

- Business: Susie's Jewelry Repair
- Core commercial actions:
  - `Book Repair`
  - `Get Fast Quote`
  - phone calls
  - storefront visits
- Closeout status:
  - core site is live and functioning
  - `/services` performance debt is deferred post-launch, not a current blocker
  - this audit is now about growth, discoverability, answerability, and conversion quality

## Required Review Set

Audit these routes at minimum:

- `/`
- `/services`
- one flagship service detail such as `/services/watch-repair`
- `/quote`
- `/book`
- `/contact`
- `/blog`
- one representative blog article
- `/faq`
- `/about`
- `/privacy`
- `/terms`

## Deliverables

Each model should produce one markdown report intended for a file under `Docs/artifacts/audit/`.

Each report must include:

- branch
- commit
- artifact path
- audit date
- URLs reviewed
- overall score `/100`
- category score table
- page-type score table
- top findings ranked by severity and impact
- quick wins in `7-day`, `30-day`, and `90-day` buckets
- done
- not done
- risks

## Shared Scoring Rubric

Score the site out of `100` using this weight model:

- Technical SEO: `20`
- Content and search-intent coverage: `15`
- Local SEO and storefront intent capture: `15`
- GEO and AEO readiness: `15`
- Conversion architecture and CTA clarity: `15`
- Mobile UX and trust presentation: `10`
- Internal linking and topical authority: `10`

Interpretation:

- `90-100`: excellent, scaling-ready
- `80-89`: strong, but clear upside remains
- `70-79`: credible foundation, meaningful revenue left on the table
- `60-69`: major gaps hurting discoverability or conversion
- `<60`: not competitive enough

## GEO / AEO Requirements

Both audits must explicitly evaluate:

- whether the site clearly communicates the business entity, location, and service scope
- whether answers are extractable by AI systems without needing heavy inference
- whether FAQ, service, and blog content are answer-shaped and citation-friendly
- whether local trust signals are strong enough for AI-assisted recommendations
- whether page structure helps or hurts answer retrieval

## Division Of Labor

- Claude should focus on strategy, positioning, messaging, answerability, local-intent conversion logic, and highest-leverage roadmap items.
- Gemini should focus on evidence-based scoring, page-by-page findings, structured issue lists, and tighter URL-specific recommendations.

## Output Rule

Do not return vague praise.

Every recommendation must say one of:

- `must fix`
- `high leverage`
- `worth testing`
- `safe to defer`

## Final Synthesis

After both reports are complete, bring them back into Codex for a merged audit score, de-duplicated issue list, and an execution roadmap.
