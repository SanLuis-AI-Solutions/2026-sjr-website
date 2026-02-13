# Services Hub Refresh (2026-02-13)

## Goal
Make `/services` feel like a premium, editorial directory (not a clone of Home), while improving service discovery and conversion on mobile (75%+ traffic).

## Constraints
- Keep brand voice and current palette (burgundy/gold/stone).
- 9 services total.
- Watch Repair is the flagship / featured service.
- Must remain fast and stable on route transitions (client-side nav).
- Must keep accessibility fundamentals: labels, focus states, contrast, touch targets.

## Success Criteria
- Mobile: users can find their service in <10 seconds without scrolling fatigue.
- Clear "what next" CTAs: Quote and Book are consistently visible without feeling spammy.
- Services page feels distinct from Home: more whitespace, calmer cadence, catalog-like hierarchy.
- No missing images or broken anchors.
- Verified by: `pwsh -File scripts/verify.ps1` + Playwright smoke + production check.

## Current State (Quick Audit)
- Structure is strong: featured hero, category jump links, grouped directory, per-service cards.
- Main weakness: it still reads as "marketing sections stacked" vs "catalog experience".
  - Too many repeated CTAs per card can feel noisy on mobile.
  - Visual hierarchy can be simplified: stronger typographic rhythm, fewer "boxes inside boxes".

## Proposed Design Direction
"Exaggerated minimalism" applied within the existing brand system:
- More negative space and calmer backgrounds.
- Larger type scale and tighter copy.
- Fewer, higher-quality CTAs (sticky bar + 1 primary per section, not every card).
- Service cards feel like a catalog entry: image, title, 2-line summary, 2-3 key facts, details link.

## Modules To Implement (Next)
1. Mobile sticky action bar for `/services` only:
   - Primary: "Get Quote"
   - Secondary: "Book"
2. Replace per-card dual CTAs with a single "View details" + small "Get Quote" link (or only at section level).
3. Add lightweight "Find your service" filter (client-side) with 9-item list:
   - Search by keyword (ring, watch, pearl, cleaning, etc.)
4. Tighten type + spacing:
   - Reduce visual noise in the sidebar on mobile (collapse into accordion).
5. Confirm image fallbacks for all services and featured hero.

## Risks / Notes
- Any redesign must remain distinct from Home while staying consistent with the overall site system.
- Avoid introducing animation that can regress the prior "Home loads invisibly" issue.

