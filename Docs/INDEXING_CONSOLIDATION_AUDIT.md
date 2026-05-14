# Indexing Consolidation Audit

- Generated: 2026-05-14
- Manifest date: 2026-05-14
- Unresolved commercial clusters: 5
- Clusters with indexed alternatives: 6

## Decision Rule

- Do not add homepage hubs, footer expansions, or extra mobile CTAs for unresolved pages.
- Use real shop proof first when a page has clear commercial value and unique intent.
- Consolidate when the unresolved page overlaps an already indexed page and no approved first-party proof is available.
- Keep utility pages out of commercial weighting decisions.

## Cluster Summary

| Cluster | Unresolved URLs | Indexed alternatives | Recommendation | Action |
| --- | --- | --- | --- | --- |
| Utility pages | /site-map (unknown-to-google) | / (indexed) | ignore-for-growth | Do not weight visibly. |
| Pearl restringing | /services/pearl-restringing (discovered-currently-not-indexed) | /blog/how-much-does-pearl-restringing-cost-pasadena (indexed)<br>/services/necklace-repair (indexed) | service-proof-first-if-stalled | Prepare proof or consolidation decision. |
| Watch battery diagnosis | /blog/does-my-watch-need-battery-or-repair-pasadena (discovered-currently-not-indexed) | /blog/watch-battery-replacement (indexed)<br>/services/watch-repair (indexed) | proof-first-or-merge-diagnostic-if-stalled | Prepare proof or consolidation decision. |
| Stone, chain, and cleaning risk | /blog/chain-repair-weak-points (discovered-currently-not-indexed)<br>/blog/stone-security-checklist (discovered-currently-not-indexed) | /services/necklace-repair (indexed)<br>/blog/safe-to-clean-vintage-diamond-ring-at-home (indexed)<br>/blog/can-a-severely-bent-ring-prong-be-fixed (indexed) | proof-first-then-merge-overlapping-guides | Prepare proof or consolidation decision. |
| Jeweler trust guide | /blog/how-to-choose-a-jeweler (discovered-currently-not-indexed) | /about (indexed)<br>/services/heirloom-restoration (indexed)<br>/blog/heirloom-restoration-planning-guide (indexed) | proof-first-or-fold-into-about | Prepare proof or consolidation decision. |
| Service-area pages | /services/clear-lake (discovered-currently-not-indexed)<br>/services/friendswood (discovered-currently-not-indexed)<br>/services/la-porte (unknown-to-google)<br>/services/pasadena (discovered-currently-not-indexed)<br>/services/webster (discovered-currently-not-indexed) | /services/deer-park (indexed)<br>/services (indexed) | city-proof-first-then-service-area-hub | Prepare proof or consolidation decision. |

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

The cleaning guide was consolidated into the indexed vintage-cleaning article. Keep the remaining chain and stone guides separate only if real inspection proof supports their specific risk decisions.

Recommendation: `proof-first-then-merge-overlapping-guides`

### Jeweler trust guide

The page is broad and lower commercial specificity. If it stays stalled without review-backed proof, fold the useful trust checklist into About or an indexed heirloom guide.

Recommendation: `proof-first-or-fold-into-about`

### Service-area pages

The city pages have local value, but if they remain unindexed without city-specific proof, a single stronger service-area hub is safer than adding more templated city copy.

Recommendation: `city-proof-first-then-service-area-hub`

## Next Action

If the next authenticated GSC recheck shows the same unresolved commercial URLs and no proof assets are available, start with the lowest-risk consolidation candidates:

- `/blog/chain-repair-weak-points` into `/services/necklace-repair` if no chain-specific proof is available.
