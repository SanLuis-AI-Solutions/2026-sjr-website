# GSC Inspection Findings — April 21, 2026

**Current Status:** Clarified after production verification  
**Finding:** No general production blog-routing failure was confirmed  
**Actual issue:** A nonexistent blog slug was treated as a routing outage

---

## Summary of Verified Results

**Completed URL Inspections:**

| URL | Status | Indexability | Details |
|-----|--------|--------------|---------|
| `/` (homepage) | ✅ Indexed | Full | Valid schema: breadcrumbs, FAQ, review snippets |
| `/services/watch-repair` | ✅ Indexed | Full | Valid schema: breadcrumbs, FAQ, review snippets |
| `/blog/how-much-does-jewelry-repair-cost-pasadena` | ❌ 404 | Not a valid production article URL | This slug does not exist in `src/lib/blog.ts` and returns 404 on production as expected |
| `/services/pasadena` (geo page) | ❌ Not indexed | Unknown | URL unknown to Google after Batch 6 deployment |
| `/blog/cost-to-resize-gold-ring-pasadena` | ✅ 200 | Crawlable | Real production article loads successfully |
| `/blog/how-much-does-pearl-restringing-cost-pasadena` | ✅ 200 | Crawlable | Real production article loads successfully |
| `/blog/does-my-watch-need-battery-or-repair-pasadena` | ✅ 200 | Crawlable | Real production article loads successfully |

---

## Clarified Finding: 404 Was Caused By An Invalid Slug

### Evidence
Production fetch verification on 2026-04-21 showed:

```text
404  /blog/how-much-does-jewelry-repair-cost-pasadena
200  /blog/cost-to-resize-gold-ring-pasadena
200  /blog/how-much-does-pearl-restringing-cost-pasadena
200  /blog/does-my-watch-need-battery-or-repair-pasadena
```

The missing slug is not present in `src/lib/blog.ts`, while the actual published commercial blog slugs are present and healthy on production.

### Conclusion
1. There is no evidence of a site-wide `/blog/[slug]` routing failure.
2. The inspected 404 came from a slug that is not part of the production blog dataset.
3. Batch 6 blog improvements are live and reachable on production.
4. The correct next step is to inspect real blog URLs in GSC, not debug routing.

---

## Impact Assessment

### Not Blocked
- ✅ Real blog content is accessible on production
- ✅ Batch 6 sitemap and internal-link changes can be crawled
- ✅ Service pages link to working blog articles
- ✅ Phase 3B is not blocked by a production route failure

### Remaining Risk
- The main operational risk is using nonexistent sample URLs in GSC or status docs.
- Geo-page indexing remains a real monitoring item.
- Blog indexing still depends on Google recrawl and index selection, not on a route fix.

---

## Root Cause

The strongest root cause is documentation and inspection drift:

1. A nonexistent slug, `/blog/how-much-does-jewelry-repair-cost-pasadena`, was treated as a representative production article.
2. That slug does not exist in the repo blog dataset.
3. The live production route works for actual blog slugs.

---

## Next Steps

1. Use real blog URLs during GSC inspection:
   - `/blog/cost-to-resize-gold-ring-pasadena`
   - `/blog/how-much-does-pearl-restringing-cost-pasadena`
   - `/blog/does-my-watch-need-battery-or-repair-pasadena`
2. Update any monitoring docs that still reference the nonexistent slug.
3. Continue monitoring geo-page indexing and overall crawl uptake after Batch 6.
