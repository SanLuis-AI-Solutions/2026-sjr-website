# Indexing Manifest

Generated on 2026-04-21 from canonical repo sources.

## Sources

- `src/app/sitemap.ts`
- `src/lib/constants.ts`
- `src/lib/service-areas.ts`
- `src/lib/blog.ts`
- `Docs/INDEXING_DIAGNOSIS.md`

## Inventory Summary

- Total canonical URLs in manifest: 41
- blog: 16
- service-area: 6
- service-detail: 9
- static: 10

## Observed GSC Status Summary

- Discovered - currently not indexed: 12
- Indexed: 25
- URL is unknown to Google: 4

## Immediate GSC Queue

These URLs should be prioritized for indexing requests or follow-up rechecks based on the April 21 baseline.

| URL | Category | Current Status | Next Action | Notes |
| --- | --- | --- | --- | --- |
| `/services/pearl-restringing` | service-detail | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/services/clear-lake` | service-area | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/services/friendswood` | service-area | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/services/la-porte` | service-area | URL is unknown to Google | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/services/pasadena` | service-area | URL is unknown to Google | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/services/webster` | service-area | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/chain-repair-weak-points` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/does-my-watch-need-battery-or-repair-pasadena` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | Commercial blog sample still waiting on index selection. |
| `/blog/heirloom-restoration-planning-guide` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/how-much-does-pearl-restringing-cost-pasadena` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/how-to-choose-a-jeweler` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/pearl-restringing-timing-guide` | blog | URL is unknown to Google | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/professional-cleaning-vs-home-care` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/safe-to-clean-vintage-diamond-ring-at-home` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/stone-security-checklist` | blog | URL is unknown to Google | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |
| `/blog/where-to-get-watch-battery-replaced-pasadena` | blog | Discovered - currently not indexed | Request indexing and recheck on 2026-04-26/27 | GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow. |

## Remaining Canonical URLs Pending First Inspection

- None.

## April 26-27 Checkpoint

Run these commands and compare the results with `Docs/INDEXING_DIAGNOSIS.md` and this manifest:

```bash
npm run google:weekly-seo-health
npm run google:seo-quick-wins
```

Decision rule:

- Improvement means URLs are moving from `unknown` to `discovered` to `indexed`.
- If the same URLs are still stuck, move to a pruning and weighting pass instead of waiting another cycle.

## Canonical URL Inventory

| URL | Category | Label | Observed Status |
| --- | --- | --- | --- |
| `/` | static | Homepage | Indexed |
| `/about` | static | About | Indexed |
| `/blog` | static | Blog hub | Indexed |
| `/book` | static | Book | Indexed |
| `/contact` | static | Contact | Indexed |
| `/faq` | static | FAQ | Indexed |
| `/privacy` | static | Privacy | Indexed |
| `/quote` | static | Quote | Indexed |
| `/services` | static | Services hub | Indexed |
| `/terms` | static | Terms | Indexed |
| `/services/bracelet-repair` | service-detail | Bracelet Repair | Indexed |
| `/services/custom-design` | service-detail | Custom Design | Indexed |
| `/services/heirloom-restoration` | service-detail | Heirloom Restorations | Indexed |
| `/services/jewelry-cleaning` | service-detail | Jewelry Cleaning & Polishing | Indexed |
| `/services/necklace-repair` | service-detail | Necklace Repair | Indexed |
| `/services/pearl-restringing` | service-detail | Pearl Restringing | Discovered - currently not indexed |
| `/services/ring-sizing` | service-detail | Ring Sizing & Repair | Indexed |
| `/services/stone-setting` | service-detail | Stone Replacement & Settings | Indexed |
| `/services/watch-repair` | service-detail | Watch Repair & Battery Replacement | Indexed |
| `/services/clear-lake` | service-area | Clear Lake service area | Discovered - currently not indexed |
| `/services/deer-park` | service-area | Deer Park service area | Indexed |
| `/services/friendswood` | service-area | Friendswood service area | Discovered - currently not indexed |
| `/services/la-porte` | service-area | La Porte service area | URL is unknown to Google |
| `/services/pasadena` | service-area | Pasadena service area | URL is unknown to Google |
| `/services/webster` | service-area | Webster service area | Discovered - currently not indexed |
| `/blog/can-a-severely-bent-ring-prong-be-fixed` | blog | Can a severely bent ring prong be fixed, or do I need a new setting? | Indexed |
| `/blog/chain-repair-weak-points` | blog | Chain Repair 101: Necklace and Bracelet Weak Points | Discovered - currently not indexed |
| `/blog/cost-to-resize-gold-ring-pasadena` | blog | How much does it cost to resize a gold ring in Pasadena? | Indexed |
| `/blog/custom-design-timeline-guide` | blog | Custom Jewelry Design Timeline: From Idea to Finished Piece | Indexed |
| `/blog/does-my-watch-need-battery-or-repair-pasadena` | blog | Does my watch need a battery replacement or full watch repair in Pasadena? | Discovered - currently not indexed |
| `/blog/heirloom-jewelry-restoration-repair-or-redesign` | blog | Heirloom Jewelry Restoration: Should I Repair It or Redesign It? | Indexed |
| `/blog/heirloom-restoration-planning-guide` | blog | Heirloom Restoration Planning: What to Bring and Ask | Discovered - currently not indexed |
| `/blog/how-much-does-pearl-restringing-cost-pasadena` | blog | How much does pearl restringing cost in Pasadena? | Discovered - currently not indexed |
| `/blog/how-to-choose-a-jeweler` | blog | How to Choose a Trustworthy Jeweler | Discovered - currently not indexed |
| `/blog/pearl-restringing-timing-guide` | blog | Pearl Restringing Timing: When to Restring and Why | URL is unknown to Google |
| `/blog/professional-cleaning-vs-home-care` | blog | Professional Jewelry Cleaning vs. At-Home Cleaning | Discovered - currently not indexed |
| `/blog/ring-sizing-guide` | blog | Ring Sizing: What to Know Before You Resize | Indexed |
| `/blog/safe-to-clean-vintage-diamond-ring-at-home` | blog | Is it safe to clean my vintage diamond ring with household products? | Discovered - currently not indexed |
| `/blog/stone-security-checklist` | blog | Stone Security Checklist: Preventing Loose Diamonds | URL is unknown to Google |
| `/blog/watch-battery-replacement` | blog | Watch Battery Replacement: Timing and Care Tips | Indexed |
| `/blog/where-to-get-watch-battery-replaced-pasadena` | blog | Where to get a watch battery replaced today near Deer Park / Pasadena? | Discovered - currently not indexed |

Generated by `npm run google:indexing-manifest`.
