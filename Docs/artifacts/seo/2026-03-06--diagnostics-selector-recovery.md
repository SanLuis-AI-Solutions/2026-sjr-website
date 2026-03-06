# Diagnostics Selector Recovery — `/services` and `/blog`

Date: 2026-03-06
Branch: `chore/lcp-diagnostics-selector-recovery`
Owner: Claude

---

## Objective

Recover null `lcpElementSelector`, `lcpElementSnippet`, and `lcpElementImageUrl` values for the `/services`
and `/blog` routes in perf diagnostics output. Both routes have text-based LCP elements (H1 headings /
paragraph), not image-based, so the existing `lcp-discovery-insight` audit path was always empty for them.
No source code changes, no deployment.

---

## Root Cause

Lighthouse produces two separate LCP-related insight audits:

| Audit | Populated for |
|---|---|
| `lcp-discovery-insight` | Image/resource-based LCP elements only |
| `lcp-breakdown-insight` | **All** LCP element types (image + text) |

`lcp-breakdown-insight.details` is a `list` type where:
- `items[0]` = phase timing table (TTFB, loadDelay, loadDuration, renderDelay sub-rows)
- `items[1]` = LCP element node (`type: "node"`, has `selector` and `snippet`)

Both perf scripts read only `lcp-discovery-insight` for the LCP element node, missing the node entirely
for `/services` (H1 text LCP) and `/blog` (paragraph text LCP).

Evidence confirmed from raw Lighthouse JSON inspection:
- `/services` run: `lcp-discovery-insight.details.items = []` (empty)
- `/services` run: `lcp-breakdown-insight.details.items[1] = {type:"node", selector:"section.relative > div.relative > div > h1.lcp-heading", ...}`
- `/blog` run: `lcp-discovery-insight.details.items = []` (empty)
- `/blog` run: `lcp-breakdown-insight.details.items[1] = {type:"node", selector:"main#main-content > section.relative > div.relative > p.mt-4", ...}`

---

## Fix Applied

Added a fallback in both scripts: if `lcp-discovery-insight` yields no node, fall through to the outer
`items` array of `lcp-breakdown-insight`. The primary path (image LCP) is unchanged.

### `scripts/perf/extract-lcp-diagnostics.mjs` — `extractLcpNode()`

```js
function extractLcpNode(report) {
  // Primary: lcp-discovery-insight (populated for image-based LCP elements).
  const discoveryItems = report.audits["lcp-discovery-insight"]?.details?.items || [];
  let node = discoveryItems.find((item) => item?.type === "node") || null;

  // Fallback: lcp-breakdown-insight outer list (populated for all LCP element types,
  // including text-based LCP on /services and /blog where discovery-insight is empty).
  if (!node) {
    const breakdownOuterItems = report.audits["lcp-breakdown-insight"]?.details?.items || [];
    node = breakdownOuterItems.find((item) => item?.type === "node") || null;
  }

  const snippet = decodeHtmlEntities(node?.snippet || "");
  const srcMatch = snippet.match(/\ssrc="([^"]+)"/i);
  return {
    selector: node?.selector || null,
    snippet: snippet || null,
    imageUrl: srcMatch ? srcMatch[1] : null,
  };
}
```

### `scripts/perf/launch-performance-gate.mjs` — `extractLcpDiagnostics()`

Same fallback block inserted after the `lcp-discovery-insight` lookup:

```js
// Primary: lcp-discovery-insight (populated for image-based LCP elements).
const discoveryItems = report.audits["lcp-discovery-insight"]?.details?.items || [];
let node = discoveryItems.find((item) => item?.type === "node") || null;

// Fallback: lcp-breakdown-insight outer list (populated for all LCP element types,
// including text-based LCP on /services and /blog where discovery-insight is empty).
if (!node) {
  const breakdownOuterItems = report.audits["lcp-breakdown-insight"]?.details?.items || [];
  node = breakdownOuterItems.find((item) => item?.type === "node") || null;
}
```

---

## Validation

### Command

```bash
MSYS_NO_PATHCONV=1 node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 3 --percentile 50 --lcp-threshold-ms 10000 \
  --seo-threshold 100 --isolate --diagnostics \
  --path /services --path /blog
```

Gate dir: `.health/perf-gate-2026-03-06T02-43-26-148Z`

```bash
node scripts/perf/extract-lcp-diagnostics.mjs \
  --dir .health/perf-gate-2026-03-06T02-43-26-148Z
```

Diagnostics: `.health/lcp-diagnostics-2026-03-06T02-43-26-148Z.json`

### Gate stdout (summary)

```
/services  perf=96 seo=100 lcp=2727ms tbt=18ms cls=0
  diagnostics: ttfb=133ms loadDelay=0ms loadTime=0ms renderDelay=1268ms
  lcp-element: section.relative > div.relative > div > h1.lcp-heading

/blog  perf=99 seo=100 lcp=2168ms tbt=18ms cls=0
  diagnostics: ttfb=127ms loadDelay=0ms loadTime=0ms renderDelay=469ms
  lcp-element: main#main-content > section.relative > div.relative > p.mt-4
```

### Per-run selector output (extract-lcp-diagnostics)

| Route | Run | lcpElementSelector | lcpElementSnippet (prefix) |
|---|---|---|---|
| /blog | 1 | `main#main-content > section.relative > div.relative > p.mt-4` | `<p class="mt-4 max-w-2xl text-[15px]...` |
| /blog | 2 | `main#main-content > section.relative > div.relative > p.mt-4` | `<p class="mt-4 max-w-2xl text-[15px]...` |
| /blog | 3 | `main#main-content > section.relative > div.relative > p.mt-4` | `<p class="mt-4 max-w-2xl text-[15px]...` |
| /services | 1 | `section.relative > div.relative > div > h1.lcp-heading` | `<h1 class="lcp-heading mt-4 font-serif...` |
| /services | 2 | `section.relative > div.relative > div > h1.lcp-heading` | `<h1 class="lcp-heading mt-4 font-serif...` |
| /services | 3 | `section.relative > div.relative > div > h1.lcp-heading` | `<h1 class="lcp-heading mt-4 font-serif...` |

**Before fix**: all 6 records had `lcpElementSelector: null`.
**After fix**: all 6 records have non-null selectors and snippets. `lcpImageUrl` correctly remains null
(text-based LCP elements have no `src` attribute).

---

## Incidental Observation

`/services` `renderDelay=1268ms` — comparable to the bimodal slow-state seen on `/`. Worth tracking in
future perf sessions but out of scope for this tooling fix.

---

## Files Changed

- `scripts/perf/extract-lcp-diagnostics.mjs` — `extractLcpNode()` fallback
- `scripts/perf/launch-performance-gate.mjs` — `extractLcpDiagnostics()` fallback
- `Docs/artifacts/seo/2026-03-06--diagnostics-selector-recovery.md` — this file
