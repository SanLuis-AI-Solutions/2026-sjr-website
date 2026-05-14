# Indexing Proof Asset Plan

Date: 2026-05-14

This plan protects the mobile experience while the remaining commercial pages work through Google index selection. The current evidence does not justify more visible homepage hubs, footer expansions, city-link blocks, or repeated quote/book CTAs.

## Current Evidence

- `npm run google:indexing-manifest` now tracks 38 canonical URLs after consolidating the stalled chain guide into `/services/necklace-repair`: 8 remain `Discovered - currently not indexed`, `/site-map` remains `URL is unknown to Google`, and `/services/la-porte` remains `URL is unknown to Google`.
- `npm run seo:internal-link-audit` passed: every unresolved commercial URL already has indexed-source internal links and non-footer links.
- `npm run seo:index-quality-audit` passed: unresolved URLs show no clear status, canonical, noindex, schema, duplication, content-depth, or internal-link blocker.
- `npm run seo:consolidation-audit` maps each unresolved commercial cluster to indexed alternatives so consolidation decisions can happen without adding generic link blocks.
- `npm run ux:mobile-flow` passed on the latest production mobile audit: mobile quote/book competition, expanded footer link walls, expanded crawl hubs, and sticky CTA drift were not detected.
- The latest quick-win report is still homepage-heavy, so unresolved pages are not yet carrying meaningful organic traffic.

## Asset Provenance Guardrail

The current generated service-image inventory is not enough for proof-based indexing work. Many service images trace to Wikimedia or Wix/static sources, which can support page design but cannot prove Susie's-specific repair judgment.

The old upload script references `C:\Users\ninef\Downloads\before broken ring.jpg` and `C:\Users\ninef\Downloads\after repaired ring.png`, but those files were not present during the 2026-05-14 asset check. Do not publish before/after proof from those paths unless the files are restored, reviewed, and approved for the target page context.

## Decision

Freeze generic SEO expansion that adds visible density. Future indexing work should use one of two paths:

- Add real Susie's-specific proof that improves the page without changing the user's mobile flow.
- Consolidate pages that keep failing index selection and overlap with an already indexed page serving the same intent.

## Priority Clusters

### Pearl Restringing

URLs:

- `/services/pearl-restringing`

Needed proof:

- Photo set showing stretched or fuzzy thread near the clasp end.
- Photo set showing finished drape and knot spacing after restringing.
- Photo set showing a clasp reuse versus clasp replacement decision.
- One anonymized intake note with strand length, clasp condition, timing need, and approval boundary.

Action:

- The timing guide has been consolidated into `/blog/how-much-does-pearl-restringing-cost-pasadena`.
- If proof assets are available, add a compact proof module to the service page without creating new mobile link hubs.
- If no proof assets are available after the next checkpoint, hold the service page and avoid adding generic pearl copy.

### Watch Diagnosis

URLs:

- `/blog/does-my-watch-need-battery-or-repair-pasadena`

Needed proof:

- Photo of a case-back or intake setup that supports battery replacement triage.
- Photo or note showing a crown, moisture, fogging, or movement issue that is not battery-only.
- Anonymized repair note explaining the battery-only versus repair-needed decision.

Action:

- If proof assets are available, add a decision-proof block that helps customers decide whether to request a quote or bring the watch in.
- The same-day location guide has been consolidated into `/blog/watch-battery-replacement`.
- If no proof assets are available after the next checkpoint, evaluate whether the remaining diagnostic guide should be folded into `/blog/watch-battery-replacement` or `/services/watch-repair`.

### Stone And Cleaning Risk

URLs:

- `/blog/stone-security-checklist`
- `/blog/safe-to-clean-vintage-diamond-ring-at-home`

Needed proof:

- Before/after or intake photos showing a bent prong, loose stone, weak chain point, residue, or vintage-cleaning risk.
- One anonymized repair note explaining what could have happened if the customer kept wearing or cleaning the piece.
- Confirmation that any existing before/after assets are approved and accurately matched to the page context before publishing.

Action:

- The professional-cleaning guide has been consolidated into `/blog/safe-to-clean-vintage-diamond-ring-at-home`.
- The chain weak-points guide has been consolidated into `/services/necklace-repair`, with its useful intake triage moved onto the indexed service page.
- Use proof only where it answers a real pre-repair question.
- Do not publish placeholder proof blocks or generic AI-written risk paragraphs.

### Service-Area Pages

URLs:

- `/services/pasadena`
- `/services/webster`
- `/services/clear-lake`
- `/services/friendswood`
- `/services/la-porte`

Needed proof:

- Google Business Profile or service-area corroboration where available.
- Anonymized city-specific intake examples such as watch moisture, inherited jewelry, engagement ring repair, or workday battery replacement.
- Local workflow detail that changes the customer's decision, not more city-name template copy.

Action:

- If city-specific proof is available, add it inside the existing page flow without creating new mobile link hubs.
- If no city-specific proof is available after the next checkpoint, consider consolidating weaker geo pages into a single service-area hub while preserving the strongest indexed city pages.

## Owner Asset Checklist

For each asset, capture:

- Filename or URL.
- Target page.
- Repair issue shown.
- Decision it proves.
- Whether customer-identifying information was removed.
- Permission status.
- Any timing, pricing, or approval detail the shop can stand behind.

## Do Not Do

- Do not add new homepage crawl hubs.
- Do not expand footer link groups on mobile.
- Do not add quote/book button pairs to mobile hero or crawl-hub sections.
- Do not add generic AI-written paragraphs to unresolved pages.
- Do not invent reviews, case studies, before/after results, or customer stories.
- Do not show visible proof placeholders without real approved assets.

## Next Checkpoint

Run the indexing and UX checkpoint again after the next GSC refresh window:

```powershell
npm run google:indexing-status
npm run google:indexing-manifest
npm run seo:internal-link-audit
npm run seo:index-quality-audit
npm run seo:consolidation-audit
npm run ux:mobile-flow
```

If commercial URLs remain unchanged, choose proof assets or consolidation. Do not choose more generic visible links.
