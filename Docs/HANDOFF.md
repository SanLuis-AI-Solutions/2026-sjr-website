# Master Project Handoff — February 24, 2026

## 🚀 OVERVIEW
The SJR website is live and canonical at `susiesjewelryrepair.com`. We are in the final **Performance & Conversion Hardening** phase.

## 🎯 CURRENT OBJECTIVE
Stabilize the **Performance Gate** on mobile. We are hitting 2400ms – 3100ms LCP (Largest Contentful Paint) jitter. We need a consistent "Green" pass (< 2500ms) on a 10-run p75 baseline.

## 💎 KEY UPDATES (TODAY)
1. **Virtual Showroom Locked**: Shipped `/showroom` with a performance-optimized, white-labeled Stuller Showcase integration.
2. **Server-Side Header**: Converted `SiteHeader` to a Server Component (native details menu) to stop client-side hydration contention.
3. **Environment Sync**: Stuller URL and site constants are locked in `.env.local` and `Vercel`.
4. **Project Status**: Updated `Docs/STATUS.md` with the latest Lighthouse evidence (LCP ~2500ms).

## 🛠️ REQUIRED NEXT ACTIONS (NEW SESSION)
1. **Image Priority Fix**: Revert LCP hero images from `decoding="async"` to **`decoding="sync"`** in `src/components/hero.tsx` and related routes to force immediate painting during initial render.
2. **Containment Polish**: Remove global `cv-auto` from the home page. Apply it **surgically** only to the bottom-most sections (Testimonials, FAQs, Footer) to clear the main thread for the Hero area.
3. **Stability Gate**: Increase performance gate to **10-runs with p75 reporting**.

## 📁 CRITICAL FILES
- **Performance Gate**: `scripts/perf/launch-performance-gate.mjs`
- **Hero Logic**: `src/components/hero.tsx`
- **Status Source**: `Docs/STATUS.md`
- **Historical Context**: See `Docs/archive/` and `Docs/artifacts/`

---
**Status: Locked & Synced (Master). Prepared for New Chat.**
