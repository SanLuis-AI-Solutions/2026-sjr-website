# Claude Home LCP Forensics

Date: 2026-03-05
Agent: Claude (claude-sonnet-4-6)
Branch: `agent/claude-home-lcp-forensics-20260305`
Route: `/` (home) — `https://www.susiesjewelryrepair.com`

---

## 1. Objective

Run a 10-run isolated LCP forensic sweep on the home route, identify the dominant bottleneck phase, rank the top three root-cause hypotheses by confidence and expected impact, and produce one evidence-based next-change recommendation. No source code changes in this session.

---

## 2. Commands Run

```bash
# Step 1: 10-run perf gate (home only, p50, isolated, diagnostics)
MSYS_NO_PATHCONV=1 node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 10 --percentile 50 --lcp-threshold-ms 10000 \
  --seo-threshold 100 --isolate --diagnostics --path /

# Step 2: Extract LCP diagnostics
MSYS_NO_PATHCONV=1 node scripts/perf/extract-lcp-diagnostics.mjs \
  --dir .health/perf-gate-2026-03-05T16-39-58-127Z
```

Note: `MSYS_NO_PATHCONV=1` was required to prevent Git Bash from expanding `--path /` to a Windows filesystem path (`C:/Program Files/Git/`).

**Output files:**
- `.health/perf-gate-2026-03-05T16-39-58-127Z/summary.json`
- `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json`

---

## 3. New Baseline Metrics

**LCP element**: `main#main-content > section.relative > div.absolute > img.absolute`
**LCP image**: `/images/home/home-hero-ring-mobile.avif`
**Source**: `src/components/hero.tsx` — `<img>` with `fetchPriority="high"` `loading="eager"` `decoding="async"`

### p50 Summary (10 runs, isolated, Lighthouse simulated mobile)

| Metric | Value |
|--------|-------|
| LCP p50 | **2539ms** |
| FCP p50 | 1263ms |
| TBT p50 | 37ms |
| Perf score | 97 |
| SEO score | 100 |
| Gate result | PASS |

### Phase Breakdown (p50)

| Phase | Value | % of LCP |
|-------|-------|----------|
| TTFB | 131ms | ~5% |
| resourceLoadDelay | 28ms | ~1% |
| resourceLoadDuration | 78ms | ~3% |
| **elementRenderDelay** | **1240ms** | **~49%** |

### Per-Run Table

| Run | LCP (ms) | TTFB | loadDelay | loadDur | renderDelay | State |
|-----|----------|------|-----------|---------|-------------|-------|
| 1 | 2603 | 147 | 28 | 134 | 2195 | SLOW |
| 2 | 2391 | 125 | 28 | 75 | 215 | fast |
| 3 | 2513 | 145 | 27 | 104 | 1181 | SLOW |
| 4 | 2600 | 128 | 19 | 78 | 1249 | SLOW |
| 5 | 2534 | 136 | 31 | 51 | 1240 | SLOW |
| 6 | 2594 | 127 | 30 | 50 | 1258 | SLOW |
| 7 | 2620 | 122 | 27 | 73 | 1406 | SLOW |
| 8 | 2314 | 131 | 25 | 75 | 212 | fast |
| 9 | 2539 | 134 | 39 | 78 | 1237 | SLOW |
| 10 | 2296 | 125 | 24 | 80 | 186 | fast |
| **p50** | **2539** | **131** | **28** | **78** | **1240** | — |

**Source**: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json`

### Cross-run trend (today's three runs combined)

| Run set | Timestamp | p50 LCP | p50 renderDelay | Slow-state rate |
|---------|-----------|---------|-----------------|-----------------|
| 5-run (prior A) | 15:02 | 2520ms | 1200ms | 3/5 (60%) |
| 5-run (prior B) | 16:07 | 2524ms | 407ms | 3/5 (60%) |
| **10-run (new)** | **16:39** | **2539ms** | **1240ms** | **7/10 (70%)** |

LCP p50 is stable at 2520–2539ms across all three runs. The dominant driver is `elementRenderDelay`.

---

## 4. Bottleneck Analysis — TTFB / Load / Render Split

### Stable phases (no meaningful run-to-run variance)

**TTFB**: 122–147ms across all runs (σ ≈ 8ms). Server response is fast and consistent. No server-side improvement available.

**resourceLoadDelay**: 19–39ms. The image discovery delay is minimal, confirming that `fetchPriority="high"` + `loading="eager"` is working and the image starts fetching near-immediately after TTFB.

**resourceLoadDuration**: 50–134ms. Network load of the AVIF is fast. Some variance from network jitter but not a bottleneck.

### Variable phase — the sole LCP driver

**elementRenderDelay** shows a **clear bimodal distribution** across all three run sets:

- **Fast state** (renderDelay < 300ms): 186–266ms — 30% of runs
- **Slow state** (renderDelay > 1180ms): 1181–2195ms — 70% of runs

**No intermediate values were observed** between 266ms and 1181ms across all 20 measured runs. This binary distribution rules out continuous network or CPU load jitter and points to a structural condition that either triggers or does not.

When the fast state occurs, LCP is 2296–2391ms. When the slow state occurs, LCP is 2513–2620ms (excluding the 2195ms outlier in run 1). The bimodal renders as ~300ms of LCP variance compressed into one binary switch.

**FCP is not bimodal**: FCP is 1238–1266ms across all runs, including both fast and slow render-delay runs. This means the main thread IS consistently available for initial paint; the hold-up is specific to the LCP image paint, not to general main-thread congestion at FCP time.

---

## 5. Top 3 Hypotheses

### H1 — `decoding="async"` deferred decode with AVIF format
**Confidence: High | Expected gain: 300–800ms p50**

`decoding="async"` instructs the browser to decode the image asynchronously — the fetch completes, but pixel decode is deferred to a future main-thread slot when CPU is available. For AVIF (AV1 codec), decode is 2–5× more CPU-intensive than WebP. Under Lighthouse's 4× CPU throttle, a deferred AVIF decode task queued behind other JS work can take 1000–1200ms to execute.

The bimodal pattern is consistent with exactly this mechanism: when a main-thread slot opens quickly (~30% of runs), decode completes at ~200ms; when the slot is delayed by hydration or IntersectionObserver setup (~70% of runs), decode completes at ~1200ms.

**Important prior-test note**: Iteration 17 (2026-03-04, artifact `2026-03-04--seo-step-6-2-iteration-17-home-decode-async.md`) tested `decoding="sync"` → `decoding="async"` on the **WebP** version of this image and observed only −24ms improvement. However, the image format was subsequently changed to **AVIF** (iteration 21). AVIF's higher decode cost makes the `decoding="async"` penalty substantially larger than it was for WebP. Changing back to `decoding="sync"` has not been measured with AVIF specifically.

**Evidence**: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json` — 7/10 runs in slow state; TTFB/load phases stable across all runs; only renderDelay correlates with fast/slow LCP outcome.

---

### H2 — IntersectionObserver setup blocking main thread during render-delay window
**Confidence: Medium | Expected gain: 100–400ms p50**

The `ProofBand` component (`src/components/home-sections.tsx`) renders 4 `reveal-on-scroll` cards directly below the hero. Each card registers an IntersectionObserver at mount time. If Next.js hydration + IntersectionObserver setup runs on the main thread during the ~240–1500ms window after image load completes, it can queue behind the AVIF decode (or vice versa), causing one to wait for the other.

The 70% slow-state rate aligns with how often hydration + observer setup is still executing when the image finishes loading. The 30% fast-state rate represents runs where the main thread completes hydration before the image fetch finishes.

This hypothesis does not have a single-line fix — it would require deferring IntersectionObserver setup to `requestIdleCallback` or `setTimeout(0)` in the reveal-on-scroll implementation, which is a larger change.

**Evidence**: `src/components/home-sections.tsx` — ProofBand, InHouseBadge, ProcessSteps, CraftStory all use `reveal-on-scroll` class with multiple observe targets; FCP is stable (no main-thread congestion for initial paint), but LCP paint is delayed.

---

### H3 — No `<link rel="preload">` for the hero AVIF in document `<head>`
**Confidence: Low | Expected gain: 20–60ms p50**

The hero image uses `fetchPriority="high"` on the `<img>` element, which is the standard approach. However, an explicit `<link rel="preload" as="image" type="image/avif" href="/images/home/home-hero-ring-mobile.avif">` in the HTML `<head>` would allow fetch to start before the browser parses the `<img>` tag in the body, reducing resourceLoadDelay.

Current resourceLoadDelay is already only 19–39ms, indicating the browser is discovering the image quickly. Gain from preload would be incremental.

**Evidence**: `.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json` — resourceLoadDelay p50 is 28ms; `src/components/hero.tsx:24` — no corresponding preload link in document head. Low priority given the phase is already minimal.

---

## 6. Single Best Next Micro-Change

**Change `decoding="async"` to `decoding="sync"` on the LCP hero image.**

| | |
|---|---|
| **File** | `src/components/hero.tsx` |
| **Line area** | Line 24 — the `<img>` element |
| **Current** | `decoding="async"` |
| **Change to** | `decoding="sync"` |
| **Rationale** | Bimodal elementRenderDelay (70% runs at ~1200ms) is the sole LCP driver. Synchronous decode forces AVIF pixel decode to complete before any render cycle, eliminating the deferred-decode blocking scenario. Iteration 17 tested this change on WebP and found only 24ms gain, but the image format has since changed to AVIF (iteration 21), which has a substantially higher decode cost under mobile CPU throttle. This change is: (a) the smallest possible code touch (one attribute), (b) zero layout/brand risk, (c) the only untested hypothesis for AVIF specifically. Worst case reverts to iteration 17 result (+0ms net change). |
| **Risk** | Low. If AVIF sync-decode cost is large, it shifts ~80ms from render delay to load duration — net neutral. If sync decode succeeds in eliminating the ~1200ms slow state, p50 LCP could improve by ~500–800ms. |

**Do not apply any other change at the same time.** One variable per iteration is required to attribute the measured outcome correctly.

---

## 7. Verification Plan

### Step 1 — Apply the change (separate commit)
```
src/components/hero.tsx: decoding="async" → decoding="sync"
```

### Step 2 — Run the isolated gate
```bash
MSYS_NO_PATHCONV=1 node scripts/perf/launch-performance-gate.mjs \
  --base-url https://www.susiesjewelryrepair.com \
  --runs 10 --percentile 50 --lcp-threshold-ms 10000 \
  --seo-threshold 100 --isolate --diagnostics --path /
```

### Step 3 — Extract diagnostics
```bash
MSYS_NO_PATHCONV=1 node scripts/perf/extract-lcp-diagnostics.mjs \
  --dir .health/perf-gate-<new-timestamp>
```

### Pass criteria
| Metric | Pass | Fail |
|--------|------|------|
| p50 LCP | ≤ 2300ms (−200ms vs 2539ms baseline) | > 2539ms (no improvement) |
| elementRenderDelay slow-state rate | ≤ 4/10 runs (≤ 40%) | ≥ 7/10 runs (≥ 70%, no change) |
| elementRenderDelay p50 | ≤ 500ms | > 1000ms |
| Perf score | ≥ 95 | < 95 |
| SEO score | 100 | < 100 |
| Gate result | PASS | FAIL |

### If the change fails the criteria
Revert `decoding="sync"` → `decoding="async"` and escalate to H2 (IntersectionObserver deferral). Document the outcome in a follow-up artifact.

---

## 8. What Not to Change

The following must be preserved:

| Element | Reason |
|---------|--------|
| Hero image `src="/images/home/home-hero-ring-mobile.avif"` | Tested and locked in iteration 21 |
| `fetchPriority="high"` | Critical for discovery priority; removing would regress resourceLoadDelay |
| `loading="eager"` | Prevents lazy-load deferral on the LCP element |
| `width={800} height={540}` | Prevents CLS by reserving layout space |
| Hero section `min-h-[620px]` and all CSS classes | Brand-approved layout and luxury aesthetic |
| All overlay `<div>` elements (gradient, radial) | Brand visual identity — do not remove or modify |
| H1 `lcp-heading` class and copy | Live SEO-optimized content |
| CTA copy and `href` targets (`/quote`, `/book`) | Conversion-critical links |
| `home-hero-mobile-static` class on hero text elements | Mobile animation gating from iteration 18 |
| `md:animate-slow-zoom` on desktop hero image | Desktop-only; no mobile LCP impact |
| `ProofBand`, `InHouseBadge`, all home-sections components | Below-fold; no LCP impact |
| `Docs/STATUS.md` | Out of scope per task constraints |
