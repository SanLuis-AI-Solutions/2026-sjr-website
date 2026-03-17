# SJR Research Stack And Blog Quality Standard

Date: `2026-03-17`
Scope: `SJR` content operating system

## Decision 1: Do Not Remove The Connections Tab

If `Upload-Post` becomes the publishing execution layer, the current `Connections` tab should be repurposed, not removed.

### What changes

Remove from `Connections`:

- per-platform OAuth connect buttons inside Nexus
- direct social-token management as the main operator workflow

Replace with:

- `Upload-Post` account health
- `n8n` workflow health
- `NotebookLM` auth/status
- latest `.health` snapshot freshness
- publishing stack notes and failure flags

Recommended rename later:

- `Connections` -> `Stack`
- or `Connections` -> `Ops`

## Decision 2: NotebookLM Must Be The Research Backbone

NotebookLM should be the primary research system for content planning.

It should not be the runtime publishing database. It should be the source-grounded thinking layer behind:

- research capture
- brief generation
- content QA
- refresh decisions

### Required SJR notebooks

1. `SJR Services`
- core service pages
- service FAQs
- pricing/timing notes
- in-house process explanations

2. `SJR Reviews And Voice`
- Google reviews
- Yelp/Facebook reviews if useful
- repeated praise/objections
- customer language and trust signals

3. `SJR Local SEO And Coverage`
- Search Console exports
- indexing coverage exports
- geo page targets
- local landing-page priorities

4. `SJR Competitors`
- top local competitor pages
- competitor messaging
- competitor FAQ and service framing

5. `SJR Seasonal And Occasion Demand`
- holidays
- graduation
- anniversaries
- engagement season
- watch battery / cleaning / gift timing use cases

### NotebookLM current blocker

NotebookLM MCP auth is currently not usable in-session.

Observed state:

- `refresh_auth` reported success
- `notebook_list` still returned `Authentication expired`
- local `notebooklm-mcp-auth` CLI is not available on this machine path

So the research architecture is clear, but notebook creation is blocked until auth is repaired.

## Decision 3: Current Blog Quality Is Inconsistent

### What we found

Current blog library has a split profile:

- several newer commercial-intent posts are solid:
  - roughly `560-730` words
- many earlier posts are too thin:
  - roughly `75-206` words

Examples from the repo:

- too thin:
  - `custom-design-timeline-guide` ~ `81` words
  - `pearl-restringing-timing-guide` ~ `97` words
  - `watch-battery-replacement` ~ `128` words
  - `how-to-choose-a-jeweler` ~ `206` words
- healthier:
  - `cost-to-resize-gold-ring-pasadena` ~ `729` words
  - `heirloom-jewelry-restoration-repair-or-redesign` ~ `680` words
  - `where-to-get-watch-battery-replaced-pasadena` ~ `562` words

## What “Optimized Properly” Should Mean

The goal is not “longer because longer ranks.”

The real goal is:

- satisfy search intent fully
- answer the reader’s real decision question
- provide source-grounded confidence
- support AI extraction and recommendation
- move the user toward the right next step

### Important truth on length

Length by itself is not a ranking factor.

But thin content usually underperforms because it fails to:

- answer enough of the real question
- cover decision criteria
- include useful examples, tradeoffs, or warnings
- create enough semantic depth for AI/search systems

So you are not wrong to be concerned about length.

For `SJR`, the thin posts are a real weakness.

## SJR Blog Standard Going Forward

### 1. Match length to intent

Recommended targets:

- service-adjacent commercial blog:
  - `800-1400` words
- local answer / geo-support article:
  - `600-1000` words
- FAQ-style explainer:
  - `500-900` words

Only exceed that when the topic genuinely needs it.

### 2. Use a consistent answer-first structure

Every post should include:

1. direct opening answer
2. why it matters
3. decision criteria
4. local/in-house context
5. common mistakes or misconceptions
6. CTA to the correct next step

### 3. Write for AEO / GEO / SEO at the same time

Every article should have:

- clear direct-answer intro
- semantic subheads phrased like real questions
- concise paragraphs
- FAQ section when warranted
- explicit entity references:
  - service
  - city/area
  - brand
- internal links to service and conversion pages
- a grounded author/reviewer frame

### 4. Avoid filler

Do not pad word count with:

- generic jewelry-care fluff
- obvious statements
- repeated phrasing
- fake storytelling

Longer is only better if it is more useful.

### 5. Require research input before drafting

No new article should be drafted unless it has:

- a research item in Nexus
- a clear service/location target
- a business goal
- a primary CTA
- NotebookLM-backed source notes once auth is restored

## Immediate Content Cleanup Priority

The weakest thin posts should be upgraded first:

1. `custom-design-timeline-guide`
2. `pearl-restringing-timing-guide`
3. `watch-battery-replacement`
4. `chain-repair-weak-points`
5. `stone-security-checklist`
6. `ring-sizing-guide`
7. `how-to-choose-a-jeweler`

## Practical Recommendation

1. keep the current blog page format
2. stop creating thin posts
3. treat NotebookLM as the required research layer
4. repurpose `Connections` into stack health once Upload-Post is adopted
5. upgrade the thin legacy posts before producing a large new batch

## Next Build Recommendation

Once NotebookLM auth is fixed:

1. create the five SJR notebooks above
2. import valid source sets
3. add a `NotebookLM` status block into the current `Connections` tab
4. start a thin-post expansion pass using research-backed briefs from Nexus

