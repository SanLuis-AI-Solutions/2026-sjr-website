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
| Pearl restringing | /services/pearl-restringing (discovered-currently-not-indexed)<br>/blog/pearl-restringing-timing-guide (discovered-currently-not-indexed) | /blog/how-much-does-pearl-restringing-cost-pasadena (indexed)<br>/services/necklace-repair (indexed) | proof-first-then-merge-guide-if-stalled | Prepare proof or consolidation decision. |
| Watch battery diagnosis | /blog/does-my-watch-need-battery-or-repair-pasadena (discovered-currently-not-indexed)<br>/blog/where-to-get-watch-battery-replaced-pasadena (discovered-currently-not-indexed) | /blog/watch-battery-replacement (indexed)<br>/services/watch-repair (indexed) | merge-location-guide-if-stalled | Prepare proof or consolidation decision. |
| Stone, chain, and cleaning risk | /blog/chain-repair-weak-points (discovered-currently-not-indexed)<br>/blog/professional-cleaning-vs-home-care (discovered-currently-not-indexed)<br>/blog/stone-security-checklist (discovered-currently-not-indexed) | /services/necklace-repair (indexed)<br>/blog/safe-to-clean-vintage-diamond-ring-at-home (indexed)<br>/blog/can-a-severely-bent-ring-prong-be-fixed (indexed) | proof-first-then-merge-overlapping-guides | Prepare proof or consolidation decision. |
| Jeweler trust guide | /blog/how-to-choose-a-jeweler (discovered-currently-not-indexed) | /about (indexed)<br>/services/heirloom-restoration (indexed)<br>/blog/heirloom-restoration-planning-guide (indexed) | proof-first-or-fold-into-about | Prepare proof or consolidation decision. |
| Service-area pages | /services/clear-lake (discovered-currently-not-indexed)<br>/services/friendswood (discovered-currently-not-indexed)<br>/services/la-porte (discovered-currently-not-indexed)<br>/services/pasadena (discovered-currently-not-indexed)<br>/services/webster (discovered-currently-not-indexed) | /services/deer-park (indexed)<br>/services (indexed) | city-proof-first-then-service-area-hub | Prepare proof or consolidation decision. |

## Cluster Notes

### Utility pages

The sitemap page is not a commercial landing page and should not receive visible mobile link weight.

Recommendation: `ignore-for-growth`

### Pearl restringing

The service page is commercially important and should be held for real pearl proof. The timing guide overlaps the indexed pearl-cost article and is the cleaner merge candidate if no proof assets arrive.

Recommendation: `proof-first-then-merge-guide-if-stalled`

### Watch battery diagnosis

Both unresolved guides overlap an indexed watch battery article and indexed service page. Keep only if real diagnostic proof is available; otherwise consolidate the location/same-day guide first.

Recommendation: `merge-location-guide-if-stalled`

### Stone, chain, and cleaning risk

These pages answer useful repair-risk questions but need real inspection photos or case notes to justify remaining separate from indexed sibling pages.

Recommendation: `proof-first-then-merge-overlapping-guides`

### Jeweler trust guide

The page is broad and lower commercial specificity. If it stays stalled without review-backed proof, fold the useful trust checklist into About or an indexed heirloom guide.

Recommendation: `proof-first-or-fold-into-about`

### Service-area pages

The city pages have local value, but if they remain unindexed without city-specific proof, a single stronger service-area hub is safer than adding more templated city copy.

Recommendation: `city-proof-first-then-service-area-hub`

## Next Action

If the next authenticated GSC recheck shows the same unresolved commercial URLs and no proof assets are available, start with the lowest-risk consolidation candidates:

- `/blog/where-to-get-watch-battery-replaced-pasadena` into `/blog/watch-battery-replacement` or `/services/watch-repair`.
- `/blog/pearl-restringing-timing-guide` into `/blog/how-much-does-pearl-restringing-cost-pasadena` or `/services/pearl-restringing`.
- `/blog/professional-cleaning-vs-home-care` into `/blog/safe-to-clean-vintage-diamond-ring-at-home`.
