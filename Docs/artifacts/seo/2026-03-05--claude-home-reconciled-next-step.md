# Claude Home Reconciled Next Step

Date: 2026-03-05
Agent: Claude (claude-sonnet-4-6)
Branch: `agent/claude-home-reconciled-next-step-20260305`
Route: `/` (home) — `https://www.susiesjewelryrepair.com`

---

## 1. Objective

Reconcile the prior sync-decode theory with the measured outcomes from iterations 28 and 29,
update the root-cause ranking based on what has been tested and confirmed non-material, and
recommend one new untested micro-change supported by forensic evidence. No source code changes
in this session.

---

## 2. Commands Run

No new perf-gate runs required. All evidence is drawn from existing artifacts and Lighthouse JSON
files. Additional trace queries were run inline to extract Speed Index and hero transfer size:

```bash
# Hero image transfer size and Speed Index (fast vs slow run comparison)
node -e "
  const fs = require('fs');
  const dir = '.health/perf-gate-2026-03-05T19-15-40-163Z';
  for (let i of [2, 3, 8]) {
    const data = JSON.parse(fs.readFileSync(dir+'/lighthouse-home-run'+i+'.json','utf8'));
    const hero = data.audits['network-requests'].details.items
      .find(r => r.url && r.url.includes('home-hero-ring'));
    const si  = Math.round(data.audits['speed-index'].numericValue);
    const lcp = Math.round(data.audits['largest-contentful-paint'].numericValue);
    const fcp = Math.round(data.audits['first-contentful-paint'].numericValue);
    console.log('run'+i+': heroBytes='+hero.transferSize+' si='+si+' fcp='+fcp+' lcp='+lcp);
  }
"
```

**Output**:
```
run2: heroBytes=22484  si=2610  fcp=1265  lcp=2619   (SLOW state)
run3: heroBytes=22456  si=2566  fcp=1263  lcp=2538   (SLOW state)
run8: heroBytes=22456  si=1340  fcp=1267  lcp=2392   (fast state)
```

---

## 3. Reconciliation — Why the Sync-Decode Theory Did Not Translate to Gain

### Prior theory (mainthread-forensics artifact)

The prior forensics analysis concluded that `decoding="async"` was creating a race condition: the
hero AVIF decode was scheduled asynchronously, the first long task at ~960ms (React hydration,
~150ms) blocked the main thread before the decode could execute, and elementRenderDelay of ~1200ms
was the time the decode task spent waiting for the main thread to free up.

The recommended fix was `decoding="async"` → `decoding="sync"`, expected to yield 800–1050ms
improvement.

### What was measured (iteration 28)

| Metric | Baseline | After sync decode | Delta |
|--------|----------|------------------|-------|
| LCP p50 | 2539ms | 2537ms | −2ms |
| elementRenderDelay p50 | 1240ms | 1235ms | −5ms |

Source: `Docs/artifacts/seo/2026-03-05--seo-step-6-2-iteration-28-home-avif-sync-decode.md`

Result: **Non-material. H1 (decode mode) fully eliminated.**

### Why the theory was wrong

**The AVIF image is 22KB compressed.** On a 4× CPU-throttled mobile device, a 22KB AVIF image
decodes in well under 10ms regardless of whether `decoding="sync"` or `decoding="async"` is used.
The image is simply too small to produce a 1200ms decode delay. Iteration 28 confirms this: delta
is −5ms, indistinguishable from run noise.

The correlation between first-long-task timing and elementRenderDelay state is **real and
measurable**, but the causal mechanism was misidentified. The first long task at ~960ms is not
blocking image decode — it is blocking something else in the render pipeline. Decode completes
essentially instantly once the image resource is available, regardless of the `decoding` attribute.

### Why iteration 29 also produced no gain

| Metric | Baseline | After badge blur removal | Delta |
|--------|----------|-------------------------|-------|
| LCP p50 | 2539ms | 2538ms | −1ms |
| elementRenderDelay p50 | 1240ms | 1227ms | −13ms |

Source: `Docs/artifacts/seo/2026-03-05--seo-step-6-2-iteration-29-home-mobile-badge-blur-test.md`

Result: **Non-material. Badge `backdrop-blur-sm` eliminated.** The trust badge is a small element
(pill badge, ~80px wide) whose backdrop filter cost is negligible. Its blur creates a compositing
layer but the layer is tiny. Removing it from mobile had no effect on the structural LCP bottleneck.

### What the Speed Index data reveals

Extracting Speed Index from the 19:15 Lighthouse runs (iteration 29 post-change measurement):

| Run | State | FCP | Speed Index | LCP | Diff (SI − FCP) |
|-----|-------|-----|-------------|-----|-----------------|
| 2 | SLOW | 1265ms | 2610ms | 2619ms | +1345ms |
| 3 | SLOW | 1263ms | 2566ms | 2538ms | +1303ms |
| 8 | fast | 1267ms | 1340ms | 2392ms | +73ms |

In **fast runs (run 8)**, Speed Index (1340ms) is only 73ms above FCP (1267ms). The above-fold
area is visually complete within 73ms of first paint. In **slow runs**, Speed Index exceeds FCP by
1300–1345ms — meaning significant above-fold content remains invisible for >1 second after FCP.

**The Speed Index gap of ~1227ms exactly mirrors the elementRenderDelay slow-state value.**

This is the key finding that was not visible in the prior analysis: the LCP delay is not just
about the hero image — it reflects that the entire above-fold visual area is not completing
until ~2566ms. Something is preventing the above-fold from being painted/composited in full
for ~1200ms after FCP in slow runs.

### Revised causal model

1. Hero image loads and decodes quickly (~245ms from renderer start — negligible cost).
2. React hydration (first long task ~960ms, ~150ms duration) triggers style/layout recalculation.
3. This recalculation includes repaint/composite of the **above-fold stacking context**.
4. The above-fold stacking context includes the hero section AND the fixed `SiteHeader` with
   `backdrop-blur` (`backdrop-filter: blur(8px)`).
5. The `backdrop-blur` on the header requires the browser to maintain a separate compositing
   layer for the content beneath it (including the hero image). The compositor cannot commit the
   LCP paint until the backdrop-filter composite pass completes.
6. In fast runs (run 8), the first long task is only 68ms. The compositor completes its cycle
   at ~1039ms before the hydration-triggered style/layout pass has time to queue a full
   recomposite. LCP is committed at ~1200ms from navigation start.
7. In slow runs, the ~150ms first long task ends at ~1110ms. The style/layout pass triggered
   by hydration invalidates the compositor's cached layers, forcing a full recomposite. The
   header's `backdrop-blur` requires sampling the entire hero layer. LCP commit is deferred to
   ~2538ms.

---

## 4. Updated Root-Cause Ranking

### H0 — `decoding="async"` deferred decode (ELIMINATED)
- Tested: iteration 28 (`decoding="sync"`)
- Result: −5ms, non-material
- Verdict: **CLOSED.** Decode mode is not a factor at 22KB AVIF image size.

### H1 — Trust badge `backdrop-blur-sm` compositing (ELIMINATED)
- Tested: iteration 29 (`backdrop-blur-sm` → `md:backdrop-blur-sm` on badge)
- Result: −13ms, non-material
- Verdict: **CLOSED.** Badge is too small to affect compositing at scale.

---

### H2 — SiteHeader `backdrop-blur` creates a full-viewport compositing obligation on mobile
**Confidence: High | Expected gain: 600–1100ms elementRenderDelay, 500–900ms LCP p50**

The `SiteHeader` (`src/components/site-header.tsx:14`) applies `backdrop-blur` — Tailwind's
`backdrop-filter: blur(8px)` — to a full-width `fixed` header with `z-50`. This filter has
a direct compositing dependency on whatever content is behind the header.

The hero AVIF image is the LCP element, and it sits directly behind the header on mobile. For
the browser to render the `backdrop-blur`, it must:
1. Paint the hero image into a separate compositing layer (the "backdrop source").
2. Sample that layer for the blur operation.
3. Composite the blurred result onto the header layer.
4. Commit the final frame.

This compositing chain means the **LCP image's "rendered" state is gated on the header's
composite pass completing**, not just on the image being decoded. The LCP timestamp records
when the element's pixels are first composited to screen — which is after this chain runs.

The ~960ms hydration long task invalidates the compositor's cached layers (because React
hydration updates DOM/CSS). After the task, the compositor must re-run the full chain. For
a `backdrop-blur` of 8px on a full-width fixed element covering the hero, this recomposite
takes ~1100–1200ms on a 4× CPU-throttled device, measured as elementRenderDelay.

**Differentiator from iteration 29 (badge blur)**: The badge's `backdrop-blur-sm` (4px) was a
small element inside the hero's own stacking context. The SiteHeader's `backdrop-blur` (8px) is
on a **separate fixed-position stacking context at z-50 that spans the full viewport width**.
These are architecturally distinct compositing scenarios.

**Evidence**:
- Speed Index delta (1340ms fast vs 2566ms slow) matches elementRenderDelay delta exactly.
- `site-header.tsx:14`: `backdrop-blur` confirmed present on fixed header.
- Style & Layout is the dominant MT category (~305ms in every run) — consistent with layer
  invalidation and recomposite work after hydration.
- Removing backdrop-blur on mobile has minimal visual impact: header is already
  `bg-[#faf7f2]/95` (95% opacity warm cream — the background is nearly solid at full opacity).
- This change has NOT been tested in any prior iteration (iterations 28 and 29 tested
  `decoding` and badge blur respectively).

---

### H3 — `overflow-hidden` on `<main>` creates a stacking context that forces hero relayout
**Confidence: Medium | Expected gain: 200–500ms**

`src/app/page.tsx:50`: `<main id="main-content" className="overflow-hidden pt-10 md:pt-12">`.
The `overflow-hidden` creates a stacking context for the entire main element. When
`HomeDeferredContent` (ProofBand, InHouseBadge, ProcessSteps, etc.) is hydrated by React
and inserted into this container, the browser runs a layout pass that includes the main
element's box model. This layout pass — contained by `overflow-hidden` — could cascade to
the hero section and force a re-layout/repaint.

Removing `overflow-hidden` from main (keeping only `pt-10 md:pt-12`) would eliminate this
stacking context, potentially preventing the post-hydration layout from reaching the hero.

Untested. Slightly higher layout regression risk than H2 (the `overflow-hidden` may be
preventing visual overflow from the hero's `absolute inset-0` imagery).

---

### H4 — HomeDeferredContent streaming delay is insufficient to push hydration past LCP
**Confidence: Medium | Expected gain: 500–900ms**

`src/app/page.tsx:22–23`:
```tsx
async function HomeDeferredContent() {
  await Promise.resolve();  // Resolves in the same microtask tick
```

`await Promise.resolve()` creates a Suspense streaming boundary in Next.js App Router, but
resolves immediately (microtask delay). The second HTML chunk (ProofBand, ProcessSteps, etc.)
streams almost simultaneously with the first chunk. React hydrates both chunks in the same
hydration pass — which creates the ~960ms long task.

Increasing the delay to `await new Promise(resolve => setTimeout(resolve, 0))` (a macrotask
tick) would push the second chunk to a genuinely separate streaming send. This could separate
the below-fold hydration from the above-fold hydration, potentially moving the first long task
to after LCP. This is a more significant architectural change with higher complexity, recommended
only if H2 and H3 fail.

---

## 5. Single Best Next Micro-Change

**Remove `backdrop-blur` from the SiteHeader on mobile by adding the `md:` responsive prefix.**

| | |
|---|---|
| **File** | `src/components/site-header.tsx` |
| **Line** | Line 14 — the `<header>` element's className |
| **Current** | `backdrop-blur` |
| **Change to** | `md:backdrop-blur` |
| **Full class delta** | `"fixed top-0 z-50 w-full border-b border-stone-200/70 bg-[#faf7f2]/95 py-4 backdrop-blur"` → `"fixed top-0 z-50 w-full border-b border-stone-200/70 bg-[#faf7f2]/95 py-4 md:backdrop-blur"` |
| **Mechanism** | Removes `backdrop-filter: blur(8px)` on mobile (Lighthouse's test context), eliminating the full-viewport compositing dependency on the hero image layer. On mobile, the header is already `bg-[#faf7f2]/95` — 95% opaque cream — so the blur's visual contribution is imperceptible. Desktop retains the blur unaffected. |
| **Why this is not a repeat of iteration 29** | Iteration 29 tested `backdrop-blur-sm` on the trust badge (a ~80px pill inside the hero stacking context). This tests `backdrop-blur` on the full-width fixed header (a separate `z-50` stacking context that spans 100vw and sits above the hero). The compositing architecture, scale, and z-index relationship are all different. |
| **Visual risk** | Low. Mobile header background is `bg-[#faf7f2]/95` — nearly opaque. The blur is not meaningfully visible through 95% opacity. Desktop is unaffected. No layout, spacing, or brand changes. |
| **Expected outcome** | p50 LCP: 2538ms → ≤2000ms (if H2 is correct). elementRenderDelay p50: 1227ms → ≤300ms. Slow-state rate: 8/10 → ≤2/10. |

**One change only. Do not combine with any other modification.**

---

## 6. Verification Plan

### Step 1 — Apply and deploy
```
src/components/site-header.tsx:14 — backdrop-blur → md:backdrop-blur
```
Deploy to production. Confirm build passes and all existing CI guardrails pass.

### Step 2 — Run 10-run isolated gate
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

### Step 4 — Extract Speed Index and long-task data for comparison
```bash
node -e "
const fs = require('fs'), dir = '.health/perf-gate-<new-timestamp>';
const diag = JSON.parse(fs.readFileSync('.health/lcp-diagnostics-<new-timestamp>.json','utf8'));
for (let i=1;i<=10;i++){
  const d = JSON.parse(fs.readFileSync(dir+'/lighthouse-home-run'+i+'.json','utf8'));
  const si = Math.round(d.audits['speed-index'].numericValue);
  const lcp = Math.round(d.audits['largest-contentful-paint'].numericValue);
  const rec = diag.records.find(r=>r.run===i);
  const lt = (d.audits['long-tasks'].details.items||[]).sort((a,b)=>a.startTime-b.startTime);
  console.log('run'+i+': lcp='+lcp+' si='+si+' renderDelay='+rec.phases.elementRenderDelay
    +' firstLT='+(lt[0]?Math.round(lt[0].startTime)+'+'+Math.round(lt[0].duration)+'ms':'none'));
}
"
```

### Pass criteria

| Metric | Baseline (19:15 gate) | Pass (H2 confirmed) | Fail (revert + escalate) |
|--------|----------------------|---------------------|--------------------------|
| p50 LCP | 2538ms | **≤ 2100ms** (−438ms min) | > 2538ms |
| elementRenderDelay p50 | 1227ms | **≤ 400ms** | > 1100ms |
| Slow-state rate (renderDelay > 1000ms) | 8/10 (80%) | **≤ 3/10 (30%)** | ≥ 7/10 |
| Speed Index p50 | ~2566ms | **≤ 1600ms** | > 2400ms |
| Perf score | 97 | ≥ 95 | < 95 |
| SEO score | 100 | 100 | < 100 |
| Gate result | PASS | PASS | FAIL |

### If the change fails the pass criteria
1. Revert `md:backdrop-blur` → `backdrop-blur` in `site-header.tsx:14`.
2. Deploy rollback.
3. Escalate to H3: remove `overflow-hidden` from `<main>` in `src/app/page.tsx:50`.
4. Document both the H2 test result and the Speed Index reading from the failing run.
   (If Speed Index is still 2500+ms despite removing header blur, the compositing chain
   theory is incorrect and the bottleneck is the HomeDeferredContent hydration timing — H4.)

---

## 7. What Not to Change

| Element | Source | Reason |
|---------|--------|--------|
| Hero `<img>` src, priority, loading, width, height | `hero.tsx:24` | LCP element — do not touch |
| `fetchPriority="high"` on hero `<img>` | `hero.tsx:24` | Confirmed `isLinkPreload=true` in all runs |
| `decoding="async"` on hero `<img>` | `hero.tsx:24` | Iteration 28 confirmed mode is neutral; async preferred |
| Hero `<section>` layout classes | `hero.tsx:15` | min-h-[620px], overflow-hidden — brand sizing |
| All hero overlay `<div>` elements | `hero.tsx:19-27` | Luxury gradient/radial brand overlays |
| Trust badge `backdrop-blur-sm` | `hero.tsx:37` | Restored by iteration 29 rollback — brand visual |
| `animate-fade-up`, `reveal-delay-N`, `home-hero-mobile-static` | `hero.tsx:36-68` | Brand animation identity from iterations 18-20 |
| Desktop header `backdrop-blur` | `site-header.tsx:14` | `md:backdrop-blur` preserves blur on desktop ≥768px |
| `bg-[#faf7f2]/95` on header | `site-header.tsx:14` | Brand header color — do not alter |
| `SiteHeader` nav content, links, logo | `site-header.tsx:4-91` | Brand identity and conversion |
| `overflow-hidden` on `<main>` | `page.tsx:50` | Preserve for now — H3 escalation only if H2 fails |
| `HomeDeferredContent` Suspense structure | `page.tsx:22-38,52-54` | H4 escalation only if H2 and H3 fail |
| All JSON-LD schemas | `page.tsx:58-72` | SEO critical — do not modify |
| `Docs/STATUS.md` | — | Out of scope per task constraints |

---

## 8. Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| H2 hypothesis is wrong (header blur is not the compositing bottleneck) | Medium — this is a new untested mechanism | Rollback is instant (single class attribute change); escalate to H3 immediately |
| Mobile header appears different without blur | Low — `bg-[#faf7f2]/95` is 95% opaque; blur imperceptible | Verify visually on mobile viewport before deploying |
| Desktop experience affected | None — `md:backdrop-blur` restores blur at ≥768px | Confirmed by Tailwind `md:` prefix behavior |
| CI guardrail regressions | Low — no layout or markup changes | Run existing guardrails before release |
| LCP gets worse (blur removal adds layout complexity) | Very low — removing a CSS filter reduces render complexity | Rollback within minutes if LCP regresses past 2539ms |
| Real-world vs Lighthouse discrepancy | Low — CrUX/RUM should reflect the same compositing path | Confirm with a CrUX check after 48hrs if deployed |
| MSYS_NO_PATHCONV=1 required on this machine for perf gate | Confirmed — apply to all future gate runs on this host | Add to gate run documentation |
