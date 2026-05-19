# Indexing Consolidation Audit

- Generated: 2026-05-19
- Manifest date: 2026-05-19
- Unresolved commercial clusters: 3
- Clusters with indexed alternatives: 6

## Decision Rule

- Do not add homepage hubs, footer expansions, or extra mobile CTAs for unresolved pages.
- Use real shop proof first when a page has clear commercial value and unique intent.
- Consolidate when the unresolved page overlaps an already indexed page and no approved first-party proof is available.
- Keep utility pages out of commercial weighting decisions.

## Cluster Summary

| Cluster | Unresolved URLs | Indexed alternatives | Recommendation | Action |
| --- | --- | --- | --- | --- |
| Utility pages | /site-map (discovered-currently-not-indexed) | / (indexed) | ignore-for-growth | Do not weight visibly. |
| Pearl restringing | /services/pearl-restringing (discovered-currently-not-indexed) | /blog/how-much-does-pearl-restringing-cost-pasadena (indexed)<br>/services/necklace-repair (indexed) | service-proof-first-if-stalled | Prepare proof or consolidation decision. |
| Watch battery diagnosis | /blog/does-my-watch-need-battery-or-repair-pasadena (discovered-currently-not-indexed) | /blog/watch-battery-replacement (indexed)<br>/services/watch-repair (indexed) | proof-first-or-merge-diagnostic-if-stalled | Prepare proof or consolidation decision. |
| Stone, chain, and cleaning risk | /blog/stone-security-checklist (indexed) | /services/necklace-repair (indexed)<br>/blog/safe-to-clean-vintage-diamond-ring-at-home (indexed)<br>/blog/can-a-severely-bent-ring-prong-be-fixed (indexed) | proof-first-then-merge-overlapping-guides | Monitor only. |
| Jeweler trust guide | /blog/how-to-choose-a-jeweler (indexed) | /about (indexed)<br>/services/heirloom-restoration (indexed)<br>/blog/heirloom-restoration-planning-guide (indexed) | proof-first-or-fold-into-about | Monitor only. |
| Service-area pages | /services/clear-lake (discovered-currently-not-indexed)<br>/services/friendswood (discovered-currently-not-indexed)<br>/services/la-porte (discovered-currently-not-indexed)<br>/services/pasadena (discovered-currently-not-indexed)<br>/services/webster (discovered-currently-not-indexed) | /services/deer-park (indexed)<br>/services (indexed) | city-proof-first-then-service-area-hub | Prepare proof or consolidation decision. |

## Cluster Notes

### Utility pages

The sitemap page is not a commercial landing page and should not receive visible mobile link weight.

Recommendation: `ignore-for-growth`

### Pearl restringing

The timing guide was consolidated into the indexed pearl-cost article. Keep the service page separate because it is the commercial conversion page; improve it only with real pearl proof if it remains stalled.

Recommendation: `service-proof-first-if-stalled`

### Watch battery diagnosis

The same-day location guide was consolidated into the indexed watch battery article. Keep the remaining diagnostic guide only if it can earn index selection with differentiated battery-vs-repair proof.

Recommendation: `proof-first-or-merge-diagnostic-if-stalled`

### Stone, chain, and cleaning risk

The cleaning guide was consolidated into the indexed vintage-cleaning article, and the stalled chain guide was consolidated into the indexed necklace-repair service page. Keep the remaining stone guide separate only if real inspection proof supports its specific risk decisions.

Recommendation: `proof-first-then-merge-overlapping-guides`

### Jeweler trust guide

The page is broad and lower commercial specificity. If it stays stalled without review-backed proof, fold the useful trust checklist into About or an indexed heirloom guide.

Recommendation: `proof-first-or-fold-into-about`

### Service-area pages

The city pages have local value, but if they remain unindexed without city-specific proof, a single stronger service-area hub is safer than adding more templated city copy.

Recommendation: `city-proof-first-then-service-area-hub`

## Next Action

If the next authenticated GSC recheck shows the same unresolved commercial URLs and no proof assets are available, choose proof enrichment or consolidation by active unresolved cluster:

- Pearl restringing: `/services/pearl-restringing` remains unresolved. Prepare proof or consolidation decision.
- Watch battery diagnosis: `/blog/does-my-watch-need-battery-or-repair-pasadena` remains unresolved. Prepare proof or consolidation decision.
- Service-area pages: `/services/clear-lake`, `/services/friendswood`, `/services/la-porte`, `/services/pasadena`, `/services/webster` remain unresolved. Prepare proof or consolidation decision.
