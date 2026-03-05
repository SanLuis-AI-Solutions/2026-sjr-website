# Home LCP No-Repeat Experiment Matrix

## 1. Objective
Produce a non-redundant plan to resolve the bimodal `elementRenderDelay` (~1200ms) on the SJR homepage. The goal is to shift the population towards the "fast" state (~200ms) by reducing main-thread contention during the critical AVIF decode window.

## 2. Inputs Reviewed
- `Docs/artifacts/seo/2026-03-05--claude-home-mainthread-forensics.md`: Identified the ~960ms blocking long task.
- `Iteration 28`: Confirmed `decoding="sync"` for AVIF alone is non-material.
- `Iteration 29`: Confirmed removing mobile badge blur is non-material.
- `src/app/page.tsx`: Current LCP element and script placement.
- `.health/lcp-diagnostics-*.json`: Bimodal delay evidence (1227ms median).

---

## 3. Eliminated Experiments (Do Not Repeat)
- **Iteration 28: AVIF Sync Decode.** `decoding="sync"` was tested and failed to move LCP median (-2ms).
- **Iteration 29: Mobile Badge Blur.** Disabling backdrop-blur on the trust badge was tested and failed (-1ms).
- **WebP vs AVIF:** AVIF is already selected and performing slightly better than WebP on total load time.

---

## 4. Candidate Micro-Changes (Top 5)

| Rank | Change Hypothesis | File + Line Area | Expected LCP Delta | Risk to Premium Look | Rollback Ease |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Move JSON-LD scripts to page bottom.** | `src/app/page.tsx:58-71` | **800–1000ms** | None | Instant |
| **2** | **Simplify Hero Overlay Gradients.** | `src/components/hero.tsx:28-29` | 200–400ms | Low | Instant |
| **3** | **Defer SiteHeader Hydration.** | `src/components/site-header.tsx:46` | 100–300ms | Low (Menu delay) | Moderate |
| **4** | **Remove `animate-pulse` from In-House dot.** | `src/components/hero.tsx:40` | 50–150ms | Low | Instant |
| **5** | **Disable `backdrop-blur` on Header.** | `src/components/site-header.tsx:14` | 50–150ms | Moderate | Instant |

---

## 5. Single Recommended Winner: Move JSON-LD Scripts
**Rationale:** 
Forensics identify a ~150ms long task at ~960ms attributed to the "main document" which blocks AVIF decode. Currently, `src/app/page.tsx` renders three large `application/ld+json` scripts *inside* the body (between main content and footer). Moving these to the very end of the document (after the `Footer` or as a deferred component) reduces the initial parse/evaluate cost of the "main document" task during the critical hydration window.

## 6. Verification Criteria
1. **Command:** `node scripts/perf/launch-performance-gate.mjs --base-url <url> --runs 10 --percentile 50 --isolate --diagnostics --path /`
2. **Success (Pass):** `elementRenderDelay` median shifts from ~1220ms to **<500ms**.
3. **Guardrail:** No regression in SEO score (must remain 100).
4. **Visual:** No change to hero layout or luxury lighting.

## 7. Stop/Go + Rollback Rule
- **GO:** If `elementRenderDelay` improves by > 500ms.
- **STOP/REVERT:** If `elementRenderDelay` remains > 1100ms (suggesting the task wasn't the blocker) OR if SEO score drops < 100.
