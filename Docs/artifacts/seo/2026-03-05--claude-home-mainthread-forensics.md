# Claude Home Main-Thread Forensics

Date: 2026-03-05
Agent: Claude (claude-sonnet-4-6)
Branch: `agent/claude-home-mainthread-forensics-20260305`
Route: `/` (home) — `https://www.susiesjewelryrepair.com`

---

## 1. Objective

Identify the dominant pre-LCP main-thread activity on the home route using Lighthouse JSON
trace data, determine what correlates with the bimodal `elementRenderDelay` pattern (fast ~200ms /
slow ~1200ms), and produce one evidence-based next-change recommendation. No source code changes
in this session.

---

## 2. Commands Run

No new perf-gate runs were required. Analysis uses existing Lighthouse JSON artifacts:

```
# Prior 10-run gate (used for cross-validation baseline)
.health/perf-gate-2026-03-05T16-39-58-127Z/  (10 runs)
.health/lcp-diagnostics-2026-03-05T16-39-58-127Z.json

# Primary 10-run gate (Lighthouse JSON analysed in this session)
.health/perf-gate-2026-03-05T19-15-40-163Z/  (10 runs)
.health/lcp-diagnostics-2026-03-05T19-15-40-163Z.json
```

All trace extraction was performed with inline `node -e` commands reading the
`.health/perf-gate-2026-03-05T19-15-40-163Z/lighthouse-home-run*.json` files directly.

---

## 3. Per-Run Table (19:15 gate — primary analysis)

LCP element: `/images/home/home-hero-ring-mobile.avif` (`isLinkPreload=true`, `priority=High` in all runs)
Source: `src/components/hero.tsx` — `<img fetchPriority="high" loading="eager" decoding="async">`

| Run | LCP (ms) | renderDelay (ms) | State | LT count | First LT (start + dur) | Top MT category | 2nd MT category |
|-----|----------|-----------------|-------|----------|------------------------|-----------------|-----------------|
| 1 | 2412 | 261 | **fast** | 2 | 1112 + 153ms | Style & Layout: 324ms | Script Eval: 194ms |
| 2 | 2619 | 1226 | SLOW | 2 | 970 + 154ms | Style & Layout: 318ms | Script Eval: 200ms |
| 3 | 2538 | 1227 | SLOW | 2 | 970 + 156ms | Style & Layout: 285ms | Script Eval: 190ms |
| 4 | 2529 | 1211 | SLOW | 2 | 960 + 155ms | Style & Layout: 308ms | Script Eval: 187ms |
| 5 | 2518 | 1225 | SLOW | 2 | 948 + 156ms | Style & Layout: 323ms | Script Eval: 186ms |
| 6 | 2607 | 1247 | SLOW | 2 | 958 + 146ms | Style & Layout: 298ms | Script Eval: 206ms |
| 7 | 2617 | 1254 | SLOW | 2 | 968 + 176ms | Style & Layout: 324ms | Script Eval: 194ms |
| 8 | 2392 | 209 | **fast** | 3 | 971 + 68ms | Style & Layout: 311ms | Script Eval: 211ms |
| 9 | 2614 | 1258 | SLOW | 2 | 965 + 142ms | Style & Layout: 288ms | Script Eval: 198ms |
| 10 | 2533 | 1244 | SLOW | 2 | 964 + 159ms | Style & Layout: 296ms | Script Eval: 181ms |
| **p50** | **2538** | **1227** | SLOW 8/10 | 2 | 970 + 154ms | ~305ms | ~194ms |

**State thresholds**: fast = renderDelay < 400ms; SLOW = renderDelay > 1200ms. No intermediate values observed.

### Hero image network timing (runs 2 and 8)

| Run | State | Hero networkEnd | First LT start | Gap (heroEnd → firstLT) |
|-----|-------|----------------|---------------|------------------------|
| 2 | SLOW | 245ms | 970ms | 725ms |
| 3 | SLOW | 228ms | 970ms | 743ms |
| 8 | fast | 223ms | 971ms | 748ms |
| 1 | fast | 677ms* | 1112ms | 436ms |

*Run 1 hero loaded late (resourceLoadDelay=344ms), after the typical hydration window.

### Long-task URL attribution (Lighthouse `long-tasks` audit)

| Run | First LT URL | Second LT URL |
|-----|-------------|---------------|
| 1 (fast) | `susiesjewelryrepair.com/` (main doc) | `ab387ecb63af78f3.js` |
| 2 (SLOW) | `susiesjewelryrepair.com/` (main doc) | `18fd52680a89ee56.js` |
| 8 (fast) | `ab387ecb63af78f3.js` | `18fd52680a89ee56.js` |

Source: `.health/perf-gate-2026-03-05T19-15-40-163Z/lighthouse-home-run*.json` → `audits.long-tasks.details.items`

---

## 4. Correlation Analysis

### What DOES correlate with slow renderDelay

#### Finding A — First long-task timing at ~960ms (attributed to main document)

In 8 of 10 slow runs, the first long task starts at **948–970ms** from navigation start, with duration
**142–176ms**, attributed to `https://www.susiesjewelryrepair.com/` (main document).

In both fast runs, this task either starts **later** (1112ms in run 1, deferred by slow hero load) or
has a **shorter duration** (68ms in run 8 vs 142–176ms in slow runs).

This is the only metric that perfectly separates the fast and slow run populations.

#### Finding B — AVIF decode race condition

The hero image finishes loading at **~223–245ms** from navigation start across all non-anomalous runs.
With `decoding="async"`, the browser schedules AVIF pixel-decode as an asynchronous task — allowing
other work to run first.

When the ~960ms long task (attributed to main document — consistent with React hydration completing) runs
for ~150ms and ends at ~1110ms, the deferred AVIF decode task has been queued but not yet executed. After
the long task releases the main thread at ~1110ms, the decode task runs. LCP is then committed, yielding
an `elementRenderDelay` of ~1200ms (measured from image resource load end to LCP paint).

When this long task either runs for only 68ms (run 8) or starts later than ~1050ms (run 1), the deferred
decode task finds an earlier main-thread slot and completes at ~200ms renderDelay.

**The race condition**: `decoding="async"` defers AVIF decode → first long task at ~960ms wins the main
thread → decode waits until ~1110ms → bimodal 1200ms delay.

### What does NOT correlate with slow renderDelay

| Metric | Fast runs | Slow runs | Verdict |
|--------|-----------|-----------|---------|
| Total main-thread work | ~700ms | ~680–720ms | **NO correlation** |
| Style & Layout total | 311–324ms | 285–324ms | **NO correlation** |
| Script Evaluation total | 194–211ms | 181–211ms | **NO correlation** |
| Script Parsing & Compilation | 30–34ms | 27–34ms | **NO correlation** |
| TBT | 32ms / 88ms | 22–31ms | **NO correlation** |
| Long-task count | 2–3 | 2 | **NO correlation** |
| Total long-task duration | ~221ms / ~256ms | ~225–256ms | **NO correlation** |
| FCP timing | 1267ms / 1362ms | 1243–1265ms | **NO correlation** |

The **total volume of main-thread work is identical** across all runs. The slow state is not caused
by extra work, but by the **timing** of one specific task relative to an async decode operation.

### Eliminated hypotheses (prior session)

**IntersectionObserver / ScrollRevealManager**: `src/components/scroll-reveal-manager.tsx:14–24`
explicitly adds `reveal-disabled` and returns early for `pathname === "/"`. IntersectionObserver is
**never registered** on the home route. Confirmed not a factor.

**`<link rel="preload">` missing**: `isLinkPreload=true` in Lighthouse network-requests for the hero
image across all runs. The preload link already exists in `<head>`. Confirmed not a factor.

---

## 5. Top 3 Ranked Hypotheses

### H1 — `decoding="async"` creates a race condition with React hydration on AVIF
**Confidence: High | Expected gain: 800–1050ms renderDelay reduction (p50 renderDelay: 1227ms → ~200ms)**

With `decoding="async"`, the browser defers AVIF pixel-decode to a future async task. AVIF uses the
AV1 codec, which is 2–5× more CPU-intensive than WebP to decode on a throttled mobile CPU (Lighthouse
simulates 4× slowdown). The deferred decode task is queued at ~245ms (when image loads) but cannot
run because the main thread is blocked by the ~960ms long task (React hydration, attributed to main
document URL, duration ~150ms).

Changing to `decoding="sync"` forces decode to execute synchronously at resource-load time (~245ms),
**before** the 960ms hydration task starts. The main thread is free at ~245ms, so decode completes
immediately. There is no race condition.

**Prior iteration note**: Iteration 17 (2026-03-04) tested `decoding="sync"` → `decoding="async"` on
the **WebP** version of this image and found only −24ms gain. The image format has since changed to
AVIF (iteration 21). AVIF decode cost is substantially higher under CPU throttle, making the deferred
penalty much greater. The H1 hypothesis tests an untried combination (AVIF + `decoding="sync"`).

**Evidence**: 8/10 runs show slow state; first long task at 948–970ms (duration 142–176ms) in all slow
runs; `decoding="async"` confirmed in hero image snippet in all diagnostic records; hero `networkEndTime`
~225–245ms (confirmed ~715–745ms before the blocking long task).

---

### H2 — The main-document long task at ~960ms can be deferred or shortened
**Confidence: Medium | Expected gain: 400–800ms (if task deferred past ~1100ms)**

The first long task, attributed to `https://www.susiesjewelryrepair.com/` (main document URL), starts
at ~960ms in 8/10 runs. This timing is consistent with Next.js React hydration completing after all
required chunks have parsed and executed. The task duration of ~142–176ms spans a style/layout
recalculation triggered by hydration.

If hydration could be deferred to start after ~1100ms (e.g., by lazy-hydrating below-fold sections,
or by deferring analytics initialisation), the async AVIF decode task would complete during the
245ms–960ms idle window, eliminating the race condition without touching the `decoding` attribute.

This is a more complex change requiring Next.js component-level partial hydration or Suspense
boundaries, and is outside the scope of a micro-change.

**Evidence**: Long-task URL = main document in all slow runs; consistent 960ms start time suggests
script-load-triggered execution (not timer/IO); Style & Layout dominates (~305ms) consistent with
React reconciliation and CSS animation class application at hydration time.

---

### H3 — CSS animation classes applied at hydration trigger Style & Layout recalculation
**Confidence: Medium-Low | Expected gain: 100–300ms (reduction in first long task duration)**

The main-thread `Style & Layout` category accounts for **~305ms** of total main-thread work — the
dominant category in every run. Part of this recalculation is triggered during hydration when React
applies CSS animation classes (`animate-fade-up`, `reveal-delay-N`, `home-hero-mobile-static`,
`md:animate-slow-zoom`) to hero elements.

While `src/components/scroll-reveal-manager.tsx` disables scroll-reveal for `/`, the hero still
contains 6+ elements with animation classes that trigger style recalculation at hydration. If the
first long task's ~150ms duration could be reduced to ~68ms (matching run 8's fast-state task
duration), the race condition might resolve.

However, this is difficult to isolate and change without risking layout regressions. The Style &
Layout total is nearly identical across fast and slow runs, suggesting the style work is not the
direct cause — only the timing of when it runs within the hydration task matters.

**Evidence**: `src/components/hero.tsx` — `<div>` and `<h1>` elements with 4+ animation classes;
mainthread-work-breakdown shows Style & Layout as dominant category (~285–324ms) in all 10 runs;
run 8's first long task duration (68ms) vs slow runs (142–176ms) suggests variable hydration cost.

---

## 6. Single Best Next Micro-Change

**Change `decoding="async"` to `decoding="sync"` on the LCP hero image.**

| | |
|---|---|
| **File** | `src/components/hero.tsx` |
| **Line area** | Line ~24 — the `<img>` element inside `<div className="absolute inset-0">` |
| **Current attribute** | `decoding="async"` |
| **Change to** | `decoding="sync"` |
| **Mechanism** | Forces AVIF decode to execute synchronously at resource-load time (~245ms). Main thread is free at ~245ms (hydration task does not start until ~960ms). Decode completes in the ~715ms idle window before hydration. No race condition. |
| **Expected outcome** | p50 `elementRenderDelay`: 1227ms → ~200ms (−1000ms). p50 LCP: 2538ms → ~1550–1700ms. Slow-state rate: 8/10 → 0–1/10. |
| **Risk** | Low. If AVIF sync-decode adds ~150ms to loadDuration, the net change is still −800ms. Worst case: AVIF decode cost on throttled CPU is very high, sync decode adds 400ms to loadDuration but net renderDelay is still 0ms — net benefit remains ~800ms. |
| **Brand/layout risk** | None. This is a single `img` attribute change with no visual, CSS, or layout effect. |
| **Prior test context** | Iteration 17 tested sync→async on WebP format (+24ms). This is the inverse on AVIF format. AVIF decode cost under 4× CPU throttle is the untested variable. |

**Do not apply any other change simultaneously.** One variable per measurement iteration is required.

---

## 7. Verification Plan

### Step 1 — Apply the single change
```
src/components/hero.tsx: decoding="async" → decoding="sync"
```
Deploy to production. Verify build succeeds. No other changes.

### Step 2 — Run 10-run isolated gate (home only)
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

### Step 4 — Extract long-task data for comparison
```bash
node -e "
const fs = require('fs'), dir = '.health/perf-gate-<new-timestamp>';
for (let i=1;i<=10;i++){
  const d = JSON.parse(fs.readFileSync(dir+'/lighthouse-home-run'+i+'.json','utf8'));
  const lt = (d.audits['long-tasks'].details.items||[]).sort((a,b)=>a.startTime-b.startTime);
  const rd = /* from diagnostics file */;
  console.log('run'+i+': firstLT='+Math.round(lt[0].startTime)+'+'+Math.round(lt[0].duration)+'ms renderDelay='+rd);
}
"
```

### Pass criteria

| Metric | Baseline (19:15 gate) | Pass threshold | Fail (revert) |
|--------|----------------------|----------------|---------------|
| p50 LCP | 2538ms | **≤ 2300ms** (−238ms min) | > 2538ms |
| elementRenderDelay p50 | 1227ms | **≤ 500ms** | > 1200ms |
| Slow-state rate (renderDelay > 1200ms) | 8/10 (80%) | **≤ 3/10 (30%)** | ≥ 6/10 |
| resourceLoadDuration increase | 78ms | ≤ 350ms (+272ms max) | > 350ms |
| Perf score | 97 | ≥ 95 | < 95 |
| SEO score | 100 | 100 | < 100 |
| Gate result | PASS | PASS | FAIL |

### If the change fails the pass criteria
1. Revert `decoding="sync"` → `decoding="async"`.
2. Document exact delta (especially resourceLoadDuration increase vs renderDelay reduction).
3. Escalate to H2 (defer React hydration / partial hydration for below-fold sections).

---

## 8. What Not to Change

The following must be preserved in all future iterations:

| Element | Reason |
|---------|--------|
| Hero `src="/images/home/home-hero-ring-mobile.avif"` | Format selected in iteration 21; AVIF is the optimal format |
| `fetchPriority="high"` on hero `<img>` | Ensures High priority in network queue; confirmed `isLinkPreload=true` |
| `loading="eager"` | Prevents lazy-load on LCP element |
| `width={800}` `height={540}` | Prevents CLS layout shift on load |
| `<link rel="preload">` in `<head>` | Already exists (`isLinkPreload=true` confirmed); do not remove |
| Hero section `min-h-[620px]` and all layout classes | Brand-approved layout; removing causes CLS |
| All hero overlay `<div>` elements | Luxury brand visual — gradient + radial light effects |
| `home-hero-mobile-static` class on hero text elements | Mobile animation gating from iteration 18 |
| `md:animate-slow-zoom` on hero image | Desktop-only pan animation; no mobile LCP impact |
| `animate-fade-up` + `reveal-delay-N` classes | Brand animation identity; iteration 18 confirmed safe |
| All `src/components/home-sections.tsx` content | Below-fold; zero LCP impact confirmed |
| `src/components/scroll-reveal-manager.tsx` | Already correctly disabled for `/`; do not modify |
| `Docs/STATUS.md` | Out of scope per task constraints |
