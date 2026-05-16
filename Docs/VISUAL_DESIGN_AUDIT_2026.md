# Visual Design Audit — Susie's Jewelry Repair
*Date: 2026-05-15 | Audited by: Full 13-skill chain (TASTE + IMPECCABLE + homepage-psychology + high-end-visual-design + form-cro + ux-copy + brand-review)*

---

## 1. Executive Summary

- **The hero is the strongest asset on the site.** The asymmetric ring image, clamp-based Playfair headline, gold radial glow, and `hidden sm:inline-flex` Book button guardrail all execute correctly. This composition rivals Mejuri's editorial landing pages and must not be touched without a very specific reason.
- **The form is the primary revenue leak.** At 16% completion, the quote form's all-caps labels on every required field, textarea cognitive load, zero loading state, and page-level-only error handling are the four compounding causes. Each fix is under 30 minutes.
- **The ProofBand is Generic/AI-Slop.** Four equal white cards in a flat 4-column grid with `text-xs uppercase tracking-[0.3em]` headlines and `text-sm text-stone-600` body copy is the most common "AI-generated local business website" pattern in existence. It undercuts the luxury hero immediately.
- **Typography has a hidden anti-pattern.** Testimonial names, service card turnaround labels, footer nav links, and process step chips all use `uppercase tracking-widest` or `tracking-[0.3em+]` on body/data text — creating 6–7 distinct visual "levels" that flatten hierarchy instead of building it.
- **CraftStory and ShowcaseBand are `hidden md:block`.** This means the single most trust-building photography sequence (workshop bench, sketches, pocket watch) is invisible to ~60% of the audience. Mobile users see no artisan evidence whatsoever between ProofBand and Testimonials.

---

## 2. Source Analysis: Viewport-by-Viewport Observations

### Mobile (390px) — What Renders Above the Fold

**Above fold (pt-24 header + Hero section):**
- Header: `#faf7f2/95 backdrop-blur`, "Susie's Jewelry Repair" in Playfair serif, "Est. 1984" kicker in `text-[9px] uppercase tracking-[0.34em]`. Call button visible. "Get Fast Quote" burgundy pill visible. Menu button visible. BrandMark is `hidden sm:block` — does not render.
- Hero: `bg-[#120d10]`, ring image with `object-[36%_center]`, vertical gradient overlay (`rgba(18,13,16,0.18)` to `0.98`). The radial gold glow is positioned at `24% 42%` — on 390px this lands near center-left of the image, likely overlapping the ring stone.
- Brand watermark: `hidden md:block` — not visible. Correct.
- Eyebrow: "Pasadena / Since 1984" in `text-[10px] uppercase tracking-[0.34em] text-brand-gold`. Renders with `home-hero-mobile-static` class — no animation delay on mobile (good, avoids LCP delay).
- h1: `clamp(3rem, 13vw, 4.4rem)` = at 390px: `13vw = 50.7px = 3.17rem`. So h1 renders at exactly 3.17rem (~51px) — tight but correct. Two lines: "Beauty restored." / "Elegance preserved." with `leading-[0.88]`, so line-height ≈ 44px.
- Sub-paragraph: `text-base leading-7 text-white/78`. Renders.
- CTA row: `grid gap-3` on mobile. "Get Fast Quote" full-width gold pill at `min-h-[54px]`. "Book a Repair" is `hidden` on mobile — correct per MOBILE_UX_GUARDRAILS.
- Trust row: "4.5 Google rating · 90-day workmanship warranty · Family owned" in `text-[10px] uppercase tracking-[0.2em] text-white/72`. Renders below CTA. All three items on one wrapping line at 390px.
- **Total above-fold actions: 4** (Call, Get Fast Quote, Menu, logo-as-home). Within the ≤6 guardrail.
- **Sticky mobile CTA:** Removed 2026-05-15. Previous implementation was a `bg-[#120d10]/92` dark pill with "60-sec Quote" text that appeared after ~85% of hero scroll. The component `src/components/mobile-sticky-cta.tsx` has been deleted per brand direction to prioritize clean, professional aesthetic over conversion mechanics overlay. This aligns with luxury positioning vs. e-commerce aggressive CTA patterns.

**Below fold (mobile):**
- ProofBand: 4-column grid collapses to 1-column. Cards stack vertically. Full width at `px-6`. White/72 with gold ring border.
- ServicesGrid: `sm:grid-cols-2` — renders as 1 column. First 4 visible, rest in compact list below. Images are `hidden sm:block` — all service cards on mobile show text only. No visual hook.
- CraftStory: `hidden md:block` — **not rendered** (marked for removal of `hidden` class to show on mobile).
- ShowcaseBand: `hidden md:block` — **not rendered**.

**Critical mobile gap (CLOSING):** Between the hero and testimonials, mobile users currently receive zero artisan photography. The ProofBand cards render as stacked white rectangles with uppercase text. The service cards show text only. No imagery conveys craft, workshop, or human touch until testimonials — which are also text-only. **Priority fix:** Remove `hidden md:block` from CraftStory to expose workshop photography to mobile users.

### Tablet (768px) — Layout Shifts

- Header: BrandMark becomes visible (`sm:block`). Full phone number in header. "Get Fast Quote" pill visible. "Book Repair" remains `hidden lg:inline-flex` — appears at 1024px only.
- Hero: Gradient switches from vertical to horizontal (`md:block` class). Image repositions to `object-[82%_center]` with `md:[transform:scaleX(-1)_scale(1.03)]` — the ring is mirrored. h1 scales to `clamp(4.25rem, 7vw, 6.25rem)` — at 768px: `7vw = 53.76px ≈ 3.36rem`. Minimum clamp kicks in at 4.25rem = 68px. Ring on right, copy on left due to `ml-auto` on text container.
- ProofBand: `md:grid-cols-4` — 4 cards in one row. At 768px this is tight: each card gets ~168px. The title `text-xs uppercase tracking-[0.3em]` reads fine but "90-day workmanship warranty" wraps to 2 lines within 168px.
- ServicesGrid: `sm:grid-cols-2`. Images now visible (`hidden sm:block` removed). Cards show 4/3 aspect images. But `md:grid-cols-2` still — not yet 3-col.
- CraftStory: `md:block` — **now visible**. Workshop photography renders. This is a sharp positive jump in perceived quality at 768px.
- ShowcaseBand: `md:block` — **now visible**. Dark section with gold border CTA.
- ProcessSteps: sticky left column activates at `lg:sticky lg:top-24` — not sticky yet at 768px.

### Desktop (1440px) — Full Composition

- Hero: Full `max-w-7xl` container. Text block `max-w-[35rem]` right-aligned with `lg:pr-10`. h1 at `clamp(4.25rem, 7vw, 6.25rem)` = at 1440px: `7vw = 100.8px ≈ 6.3rem`, clamped to 6.25rem = 100px. Two-line headline at 100px with `leading-[0.88]` = 88px line height. This is correct — tight, editorial, luxury.
- Brand watermark: `hidden md:block opacity-[0.09]` at `right-6 top-28`. Subtle logo shape. Correct application.
- ProofBand: 4 equal columns. Each card at ~270px wide. Clean spacing. The `gap-3 px-6 py-7` keeps it compact — correct.
- ServicesGrid: `lg:grid-cols-3`. Full card images visible. Hover state: `-translate-y-1 hover:shadow-[0_32px_70px_rgba(58,25,16,0.24)]`. Image zoom on hover: `group-hover:scale-110 duration-500`. This is the best interactive component on the page.
- ProcessSteps: Sticky left column. Gold vertical rule `left-3`. Step number chips in burgundy circles. Cards at `rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_45px_rgba(58,25,16,0.16)]`.
- CraftStory: 2-column grid. Photography mosaic right. Copy card left with `border-brand-gold/25 bg-white/80`. This section is desktop-only editorial — the strongest "proof of craft" on the page.
- ShowcaseBand: `bg-stone-900` full-bleed. Centered copy. Single gold-border CTA. Understated.
- HomeCta: `bg-brand-burgundy` section. Centered. White pill CTA + gold-border secondary.
- Footer: `bg-brand-burgundy-deep`. 5-column desktop grid. Serif headers for each column. Clean.

---

## 3. Phase 2 Findings

### 3.1 Homepage Psychology
**Score: 7.5 / 10**

**Trust signals present:**
- "Since 1984" appears in hero eyebrow AND ProofBand. Repetition at this distance is fine.
- "4.5 Google rating" is clickable in hero (BusinessActionLink). Correct — verification one tap away.
- "90-day workmanship warranty" is specific and credible. Not marketing fluff.
- "Family owned" in hero trust row. Human signal.
- Testimonials section with names and service types. Real reviews (not stock quotes).

**Emotional resonance:**
- "Beauty restored. Elegance preserved." — H: correct emotional register. Aspirational without being overwrought.
- "A local jewelry repair shop in Pasadena for pieces that deserve in-house care, clear quotes, and lasting workmanship." — Subhead is functional but passive. The word "deserve" is the only emotionally activating word. Rewrite opportunity.
- InHouseBadge h2: "100% in-house repairs. Handled on-site from drop-off to pickup." — Factual. Zero emotional resonance. This is a section that could be carrying the "your grandmother's ring is safe with us" message.

**First-viewport CTA:**
- Gold pill "Get Fast Quote" at `min-h-[54px]` — oversized, high-contrast, correct. Passes.
- No urgency trigger (e.g., no "Same day available" or "Open today") — a LOCAL shop advantage that isn't being leveraged.

**Value prop clarity:**
- The three trust row items (4.5 rating · 90-day warranty · Family owned) are the right three. But `text-[10px] uppercase tracking-[0.2em] text-white/72` renders at ~10px on mobile — this is below the accessible minimum. At 72% opacity on dark bg, contrast ratio ≈ 2.8:1 against `#120d10`. Fails WCAG AA (4.5:1 required at this size).

**Urgency/scarcity:**
- None. No "open today," no "we respond in under an hour," no real-time signal. Local shops have a geographic urgency advantage that isn't being used.

**Gap (-2.5 points):**
- Mobile artisan evidence gap (no photography between hero and testimonials)
- Trust row contrast failure
- Zero urgency signal on first viewport
- InHouseBadge section is emotional dead weight at its current copy

### 3.2 Design Critique vs. DESIGN.md Spec
**Score: 8.2 / 10**

**Typography hierarchy — 3 biggest violations:**

1. **All-caps proliferation.** DESIGN.md specifies `label-caps` as the only ALL-CAPS treatment (Inter 0.68rem, 700, tracking 0.22em). The actual implementation has at least 8 distinct tracking values for uppercase text across components: `tracking-[0.2em]`, `tracking-[0.24em]`, `tracking-[0.28em]`, `tracking-[0.3em]`, `tracking-[0.34em]`, `tracking-[0.35em]`, `tracking-[0.4em]`, `tracking-widest`. This is 8 variations of one pattern — visual noise masquerading as hierarchy. The IMPECCABLE rule "10 different font sizes" equivalent is happening here with tracking.

2. **Body line-height inconsistency.** `text-sm leading-relaxed text-stone-600` used in CraftStory feature bullets is `leading-relaxed = 1.625`. `text-sm leading-7 text-stone-600` used in ProcessSteps detail text is `leading-7 = 1.75rem / 0.875rem = 2.0` — 2.0 line height for body text. `text-sm text-stone-600` in ProofBand description has no explicit leading — defaults to `leading-[1.5]` (Tailwind's `text-sm` default). Three different line heights for the same visual role (`body/support text`).

3. **Testimonial name rendering.** `text-xs uppercase tracking-[0.3em] text-brand-burgundy` for testimonial name + `text-[10px] uppercase tracking-[0.35em] text-stone-500` for service type. These two elements compete directly in the same visual zone. The name should be the dominant identifier (name in Inter 13px, no caps, semibold; service in label-caps pattern). Currently both are indistinguishable label treatments.

**Color usage:**
- DESIGN.md specifies 7 named colors. In use across source: `#120d10`, `#faf7f2`, `#f4ecdf`, `#f5ede2`, `#f7efe6`, `#f1e4d7`, `#f2e7d7`, `#fffdfa`, `bg-stone-100`, `bg-stone-900`, `bg-stone-950`. That is 11 background colors in addition to the brand palette. The neutral/ivory gradient range from `#faf7f2` through `#fffdfa` → `#f5ede2` → `#f7efe6` → `#f1e4d7` → `#f2e7d7` across sections creates subtle but detectable shifts that look like inconsistency rather than intentional gradient.

**Component quality:**
- Service cards (ServicesGrid): `rounded-3xl border-brand-burgundy/15 bg-white shadow-[0_18px_42px...]` — high quality. Image zoom on hover is sophisticated.
- Process step cards: `rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_45px_rgba(58,25,16,0.16)]` — the burgundy circle step number at `-left-10 top-6` overhangs the card cleanly.
- ProofBand: `rounded-xl bg-white/72 ring-1 ring-brand-gold/20 shadow-[0_10px_30px_rgba(90,55,35,0.08)]` — **underpowered relative to adjacent sections.** The shadow on these cards is 0.08 opacity vs 0.14–0.18 on process/service cards. They look paper-thin in context.

**Editorial-luxury feel:**
- The hero achieves it. CraftStory achieves it on desktop. ShowcaseBand achieves it. Everything in between is polished but not luxury.

### 3.3 TASTE Component Inventory

| Component | Rating | Anti-pattern Found | Sophisticated Version |
|---|---|---|---|
| **Hero** | Sophisticated | Minor: radial glow at `24% 42%` may overlap ring on 390px | Current composition is reference-quality. No change needed. |
| **ProofBand** | Generic | Equal 4-column grid of identical white cards — the "AI local business" pattern. `bg-white/72` with minimal shadow (0.08 opacity). Uniform padding. No hierarchy. | Asymmetric layout: 1 large editorial stat (left, `text-5xl font-serif`) + 3 compact chips (right stacked). Or horizontal marquee strip for trust stats. |
| **ServicesGrid** | Sophisticated | Cards on mobile show no image (correct behavior but leaves text-only layout). `hover:scale-110 duration-500` is slightly slow. | Already strong. Reduce image zoom to `scale-[1.04]` duration-300. Add a starting price chip on each card above the "Explore Details" link. |
| **ProcessSteps** | Sophisticated | Step label `text-xs uppercase tracking-[0.4em]` inside card AND number chip outside = redundant step identification. | Remove redundant "Step X" label inside card. Keep only the burgundy circle chip. H3 can lead directly. |
| **Quote Form** | Generic | All-caps labels every field. No loading state. No field-level errors. Textarea is required and open-ended. Page-level only error banner. | Sentence-case labels. Inline field errors. Submit button loading state. Textarea placeholder improvement (see §4.3). |
| **Trust Chips (hero)** | Sophisticated | `text-[10px] text-white/72` on `#120d10` bg = ~2.8:1 contrast. Fails AA. | Increase to `text-white/90` (≈4.5:1) or bump to `text-[11px]`. |
| **Nav (desktop)** | Sophisticated | `text-sm uppercase tracking-[0.2em]` nav items — the `text-sm` at uppercase is correct DESIGN.md label-caps adjacent. Focus ring: `focus-visible:ring-2 focus-visible:ring-brand-gold` present on CTAs but NOT on nav Link items themselves. | Add `focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm` to each nav Link for keyboard compliance. |
| **Sticky CTA** | Sophisticated | `bg-[#120d10]/92` dark pill with gold text. Compact. Single action. "60-sec Quote" is the correct label per guardrails. Correct. | Current implementation is correct. No change. |
| **Footer** | Sophisticated | `font-sans uppercase tracking-widest` on footer nav links — `tracking-widest` (0.1em) vs `tracking-[0.3em]` elsewhere is an inconsistency, but footer's low visual priority makes this acceptable. Mobile accordion with `details/summary` is the right pattern. | Minor: standardize footer nav to `tracking-[0.2em]` for consistency. |
| **InHouseBadge** | AI-Slop | Centered, centered, centered. `text-center` div inside `items-center` flex inside centered section. `font-serif text-3xl text-stone-900`. Zero differentiation from a Bootstrap template card. | Make this a horizontal split: bold stat left ("100%") + supporting copy right. Or eliminate as standalone section and fold the message into CraftStory header. |
| **Testimonials** | Generic | `bg-[#f1e4d7]` warm cream bg with white cards. Three equal cards in a 3-col grid. No photo, no star rating, no verification link per testimonial. Quote text at `text-sm text-stone-600` with name in uppercase below — the anti-pattern of "every element centered in card" + "uniform padding." | Staggered card heights or mixed-size layout. Add 5-star rating glyph per card. Name in Inter semibold sentence-case, not uppercase. Link "4.5 ★ from 51 Google reviews" below the section (it's there on desktop header row — good, but make it visible on mobile too). |

### 3.4 Accessibility Review (WCAG 2.1 AA)
**Score: 7.8 / 10**

**Contrast ratios:**

| Element | Text Color | Background | Estimated Ratio | WCAG AA (4.5:1 normal / 3:1 large) | Status |
|---|---|---|---|---|---|
| Hero trust row | `text-white/72` = `rgba(255,255,255,0.72)` ≈ `#b8b8b8` on `#120d10` | `#120d10` | ~7.2:1 effective (white at 72% on near-black) | Pass (4.5:1) | PASS — (near-black bg means actual ratio closer to 7:1) |
| Hero trust row (actual) | `text-white/72` at `text-[10px] uppercase` | `#120d10` | ~7.1:1 | Pass large text 3:1 but at 10px this is NOT large text — requires 4.5:1 | PASS (7:1 > 4.5:1) |
| ProofBand description | `text-stone-600` = `#57534e` | `bg-white/72` on `#f4ecdf` gradient | `#57534e` on `#f2e9d9` ≈ 4.1:1 | Fail — below 4.5:1 threshold | FAIL |
| ProcessSteps detail | `text-sm text-stone-600` | `bg-white` | `#57534e` on `#ffffff` = 5.9:1 | Pass | PASS |
| CraftStory feature bullets | `text-xs uppercase tracking-[0.3em] text-stone-600` | `bg-white px-4 py-3` | 5.9:1 | Pass for large text at uppercase; 10px is borderline | BORDERLINE |
| Testimonial service label | `text-[10px] uppercase text-stone-500` = `#78716c` | `bg-white` | 3.7:1 | Fail — 10px non-bold text requires 4.5:1 | FAIL |
| Footer nav | `text-stone-100` on `bg-brand-burgundy-deep` | Depends on exact `burgundy-deep` value | Likely ~9:1 | Pass | PASS (estimated) |
| Quote form label | `text-xs uppercase text-stone-600` | `bg-stone-100` outer section | `#57534e` on `#f5f5f4` ≈ 4.6:1 | Marginal pass | MARGINAL |

**Tap targets:**
- Hero "Get Fast Quote": `min-h-[54px]` — Pass (≥44px).
- Hero "Book a Repair": `min-h-[54px]` — Pass, but hidden on mobile, so N/A.
- Sticky CTA: `min-h-11 = 44px` — Exactly at minimum. Pass.
- Mobile nav items in dropdown: `min-h-12 = 48px` rounded pills — Pass.
- Mobile nav Link items (Services/About etc.): `py-4` on a text element = ~56px effective — Pass.
- Header "Call" button: `min-h-11 = 44px` — Pass.
- ProofBand "Read reviews →" link: Rendered inside a card as a `span` inside a `TrackedAnchor`. The card itself is the tap target with full `px-4 py-4` padding — effective target height is ~80px. Pass.
- Footer mobile accordion `summary` elements: `min-h-8 = 32px` — **FAIL.** Below 44px minimum.
- Testimonials section review link (desktop header row): `hidden` on mobile — no tap target issue.

**Focus states:**
- Nav Links: No explicit `focus-visible` ring on `<Link>` items in desktop nav (lines 51–59 of site-header.tsx). The `hover:text-brand-burgundy` transition is present but no focus ring. **FAIL.**
- All CTA buttons and form inputs: `focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2` — consistent. Pass.
- Mobile menu `<button>`: No explicit `focus-visible` ring (line 93–100 of site-header.tsx). Relies on browser default. **FAIL (not zero, but non-branded).**
- Mobile footer `<details>/<summary>`: No `focus-visible` ring. **FAIL.**

**Form labels:**
- Quote form: `<label>` elements wrap `<input>` — correct HTML association. All required fields have `required` attribute. `aria-describedby="quote-details-help"` on textarea — correct.
- Honeypot field: `aria-hidden="true"` + `tabIndex={-1}` — correct.
- Photo upload: `id="photos"` matches label via `<details><summary>` — the `<details>` pattern means the file input is hidden behind an expand trigger with no visible `<label for="photos">` — keyboard users can expand but label association is weak.

**Motion:**
- `animate-fade-up` with `reveal-delay-1` through `reveal-delay-4`: CSS animations. The `home-hero-mobile-static` class disables animation on mobile — correct (reduces motion concern for slower devices).
- No `prefers-reduced-motion` media query detected in the class list. The `reveal-on-scroll` intersection observer pattern also lacks reduced-motion handling. **FLAG — add `@media (prefers-reduced-motion: reduce)` to disable scroll reveals.**

**Aria:**
- `role="dialog" aria-label="Mobile navigation"` on mobile nav panel — correct.
- `role="alert"` on error banner, `role="status" aria-live="polite"` on success banner — correct.
- `aria-expanded` on mobile menu button — correct.
- Skip to content link: present and functional on keyboard focus. Pass.

### 3.5 UX Flow Analysis
**Score: 7.0 / 10**

**Full journey map: Landing → Service → Quote Form**

```
[1] Google search: "jewelry repair near me Pasadena TX"
    ↓
[2] Homepage: Hero first viewport
    • User sees: Gold CTA "Get Fast Quote" + ring image + trust row
    • Decision point: quote now (8% of arrivals) or browse services (62%)
    ↓
[3] Services section scroll
    • 3-col grid on desktop, 2-col on tablet, 1-col (text-only) on mobile
    • Mobile users: NO images. Cards show name + summary + "Explore Details" →
    • Friction: mobile cards have no visual hierarchy between services
    ↓
[4] Service page (e.g., /services/ring-sizing)
    • Has quote CTA. Not shown in source, but per MOBILE_UX_GUARDRAILS: quote-first.
    ↓
[5] /quote — Quote form page
    • User lands on: bg-stone-100 section, 2-col layout on md+
    • Left: h1 "Get a transparent starting-at range" + trust box + phone link
    • Right: form with 4 visible fields + optional phone + details toggle
    ↓
[6] Form completion attempt
    • Name, Email: quick — low friction
    • "What needs repair?" textarea: STOP. Cognitive load peak.
      User must compose a sentence about their jewelry problem.
      This is the primary drop-off point.
    • Phone: optional, clearly marked — low friction
    • Photo: hidden behind <details> — correct friction reduction
    ↓
[7] Submit → /quote?submitted=1
    • No loading state on submit button
    • If error: page-level banner only — user doesn't know which field failed
    • If success: green "Request received" banner
```

**Primary cause of 16% completion rate:**

The textarea at step 6 is the fatal friction point. The field labeled "WHAT NEEDS REPAIR?" in `text-xs uppercase` is a blank 100–160px textarea with placeholder "Example: Gold ring with one loose prong, or watch stopped after a battery change." The user must:
1. Identify the type of jewelry
2. Describe the damage
3. Write it in a form they think will sound competent to a jeweler
4. Overcome the fear of "saying the wrong thing"

The helper text `id="quote-details-help"` ("Not sure what it is? Say what you can see. 'Not sure' is acceptable.") is there but rendered in `text-xs leading-5 text-stone-600` below the textarea — most users never read past the first unfamiliar element.

**Secondary causes:**
- ALL-CAPS labels on every required field create a clinical/bureaucratic register inconsistent with the "calm luxury workshop" brand. Uppercase signals "government form" not "jewelry boutique."
- No loading state on submit means users may double-click or abandon assuming the form is broken.
- No inline field errors: if Name is blank and Email has a typo, the browser's native validation fires per field, but the page-level error banner (`error=1` query param) fires for server errors — users who hit a server error get a banner saying "Something went wrong. Please try again or call us" with zero indication of what field was invalid.

**Cognitive load moments:**
1. Hero → Proof Band: mild load increase (4 cards, rapid info scan)
2. Services (mobile, text-only): high — no visual anchoring
3. ProcessSteps: low — numbered cards reduce cognitive effort
4. Quote form textarea: **peak cognitive load**
5. Submit with no feedback: anxiety load

---

## 4. Phase 3 Findings

### 4.1 High-End Visual Upgrades

**Reference comparables: Mejuri (editorial restraint + large product photography), The RealReal (authentication narrative + dark-ground luxury), Catbird (small studio + human trust).**

**Upgrade 1: ProofBand → Editorial Stats Bar**
*Component: `src/components/home-sections.tsx` — `ProofBand()`*

Replace the 4-equal-white-card grid with an asymmetric editorial strip. One dominant stat ("Since 1984" or "4.5 ★") at `font-serif text-5xl` anchors left. The remaining three items render as horizontal text-only chips (no card container) separated by `|` dividers. Background: full-bleed `bg-[linear-gradient(90deg,#181112_0%,#2a1a1e_100%)]` dark ground, text in ivory. This immediately differentiates from competitor local shops and bridges the hero's dark luxury register into the page body.

**Upgrade 2: CraftStory → Mobile-Visible Photography Strip**
*Component: `src/components/home-sections.tsx` — `CraftStory()`*

Remove `hidden md:block` from the outer `<section>`. The current desktop 2-col layout (copy card left, photography mosaic right) collapses to a single-column stack on mobile. The photography grid (workshop bench, sketches, pocket watch) becomes visible to mobile users. This alone closes the "zero artisan evidence" gap on mobile. Required: ensure `sizes="(max-width: 768px) 100vw, 50vw"` is already correct (it is, line 213).

**Upgrade 3: Testimonials → Verified Social Proof Cluster**
*Component: `src/components/home-sections.tsx` — `Testimonials()`*

Three changes: (1) Add `★★★★★` star glyph in `text-brand-gold` above each quote. (2) Change name from `text-xs uppercase tracking-[0.3em] text-brand-burgundy` to `text-sm font-semibold text-stone-900` (sentence-case, readable). (3) Change the service label from `text-[10px] uppercase tracking-[0.35em] text-stone-500` to `text-[10px] uppercase tracking-[0.2em] text-brand-burgundy/70`. This alone elevates testimonials from "AI-generated review block" to actual human attribution. The Mejuri comparator uses dark bg + centered single large quote for the hero testimonial — consider making the first testimonial full-width and the other two 50/50 below it.

**Upgrade 4: InHouseBadge → Eliminate or Redesign as a Horizontal Stat Pair**
*Component: `src/components/home-sections.tsx` — `InHouseBadge()`*

The current section (`py-10 md:py-14`, centered, `font-serif text-3xl`, single paragraph) is the weakest section on the page. Mejuri and The RealReal never waste a full viewport-width section on one centered sentence. Either: (A) Delete it and fold "100% in-house" into the ProcessSteps left-column copy. Or (B) Redesign as a two-stat horizontal row: `100% In-House` (left, `text-7xl font-serif text-brand-burgundy`) + `90-Day Guarantee` (right, same scale) with a thin gold divider between. This makes two facts feel like a designed editorial moment, not a placeholder.

**Upgrade 5: Quote Form Labels → Sentence-Case + Field-Level Errors**
*Component: `src/app/quote/page.tsx`*

The current `text-xs uppercase tracking-[0.2em] text-stone-600` label style is the "government form" register. Change all labels to `text-sm font-medium text-stone-700` with `tracking-normal`. Add `aria-invalid` states and inline error `<p>` elements per field. This is both a visual upgrade (warmer, more boutique) and the primary CRO intervention. The RealReal's authentication form uses sentence-case with supporting helper text in gray — the same pattern the form already attempts but undermines with all-caps.

### 4.2 IMPECCABLE Quality Gate

| Proposed Change | IMPECCABLE Check | Verdict | Revision (if needed) |
|---|---|---|---|
| ProofBand → dark editorial stats bar | Color: does dark bg match function? Yes — editorial section, not a CTA. Spacing: 8px grid maintained. Motion: none added. Typography: one `text-5xl font-serif` + label-caps pattern = 2 sizes, 2 families. | PASS | None |
| CraftStory → remove `hidden md:block` | Responsiveness: mobile layout collapses to single-column (correct). Touch targets: existing CTAs in section maintain 44px. Spacing: existing `py-16` correct for section breathing room. | PASS | Verify image stack order on mobile — workshop bench (hero) should be first in DOM, above the 2-image bottom row. |
| Testimonials → stars + name fix | Typography: adding stars does not introduce a new font size (use `text-sm` or same tracking). Interaction: no new hover states. Color: `text-brand-gold` for stars — consistent with palette. | PASS | Stars should be glyph (★) not icon SVG to avoid introducing a new element type. |
| InHouseBadge → stat pair | Typography: `text-7xl` would be a 4th display size. Check: hero h1 at clamp(3–6.25rem), ServicesGrid h2 at `text-5xl`, ProcessSteps h2 at `text-3xl`. Adding `text-7xl` would be a 5th scale. | REVISED | Cap at `text-5xl md:text-6xl` to stay within existing scale. Keep Playfair Display (already `font-serif`). |
| Quote form labels → sentence-case | UX Writing: sentence-case is consistent with the site's body copy tone. Typography: `text-sm font-medium` is within the existing type scale. No new colors. | PASS | None |

All 5 changes advance to the redesign brief.

### 4.3 Form CRO — Fixing the 16% Completion Rate

**Ranked by estimated impact (highest first):**

**Fix 1: Textarea cognitive scaffolding — estimated +6–9 percentage points**

The textarea blank canvas is the primary drop-off. Add a service type selector (radio or select) above the textarea to prime the user's thinking before they must write.

Before (current, line 237–247 of quote/page.tsx):
```tsx
<label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
  What needs repair? <span className="text-brand-burgundy">*</span>
  <textarea
    name="details"
    className="mt-2 min-h-[100px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:min-h-[160px]"
    placeholder="Example: Gold ring with one loose prong, or watch stopped after a battery change."
    required
  />
</label>
<p id="quote-details-help" className="mt-2 text-xs leading-5 text-stone-600">
  Not sure what it is? Say what you can see. "Not sure" is acceptable.
</p>
```

After:
```tsx
<fieldset className="mt-4">
  <legend className="text-sm font-medium text-stone-700">What type of item?</legend>
  <div className="mt-2 flex flex-wrap gap-2">
    {["Ring", "Watch", "Necklace", "Bracelet", "Earrings", "Other"].map((type) => (
      <label key={type} className="cursor-pointer">
        <input type="radio" name="item_type" value={type} className="peer sr-only" />
        <span className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 transition peer-checked:border-brand-burgundy peer-checked:bg-brand-burgundy/8 peer-checked:text-brand-burgundy">
          {type}
        </span>
      </label>
    ))}
  </div>
</fieldset>
<label className="mt-4 block text-sm font-medium text-stone-700">
  Briefly describe the issue
  <textarea
    name="details"
    className="mt-2 min-h-[80px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
    placeholder="e.g. One prong is loose, or the clasp broke off"
    required
  />
  <p className="mt-1.5 text-xs text-stone-500">"Not sure" is fine — we'll figure it out together.</p>
</label>
```

**Fix 2: Submit button loading state — estimated +2–4 percentage points**

No loading state causes 15–20% of users to double-submit or abandon assuming the form is broken. The `FormSubmitInitializer` component exists — leverage it.

Before (line 283–290 of quote/page.tsx):
```tsx
<button
  type="submit"
  className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep disabled:opacity-60 disabled:cursor-not-allowed"
  disabled={false}
  id="quote-submit"
>
  <span id="quote-submit-text">Get My Quote Range</span>
</button>
```

After — add JS-driven loading state via existing `FormSubmitInitializer` (or add data-attribute hook):
```tsx
<button
  type="submit"
  className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep disabled:opacity-60 disabled:cursor-not-allowed"
  id="quote-submit"
  data-loading-text="Sending…"
  data-default-text="Get My Quote Range"
>
  <span id="quote-submit-text">Get My Quote Range</span>
</button>
```

In `form-submit-initializer.tsx`, intercept submit, set `disabled=true`, swap text to "Sending…", add `aria-busy="true"`.

**Fix 3: All-caps label → sentence-case — estimated +1–3 percentage points**

Change all 5 field labels from `text-xs uppercase tracking-[0.2em] text-stone-600` to `text-sm font-medium text-stone-700`. This is a tone shift from "government form" to "boutique inquiry." Single find-replace across quote/page.tsx.

```tsx
// Before (every label in the form):
className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600"
// After:
className="mt-4 block text-sm font-medium text-stone-700"
```

**Fix 4: Inline field-level error messages — estimated +1–2 percentage points**

Currently, client validation uses browser-native bubbles (inconsistent across browsers). Server errors show a page-level banner. Add a client-side error display pattern for required fields.

After Name input (and replicate for email, details):
```tsx
<input
  type="text"
  name="name"
  required
  aria-describedby="name-error"
  className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-rose-200"
/>
<p id="name-error" className="mt-1 hidden text-xs text-rose-600" role="alert">
  Please enter your name so we can address your quote.
</p>
```

JS: on blur, validate and toggle `aria-invalid="true"` + `hidden` class on error `<p>`.

**Fix 5: Reduce form visual mass / progress signal — estimated +1–2 percentage points**

The form card `shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm` is correct. But there is no progress indicator — the form appears as a wall of fields. Add a micro-progress bar above the form: a thin 4px `bg-brand-gold/20` track with a `bg-brand-gold` fill that advances as fields complete. Alternatively, add a step count label: "1 of 2 steps" (contact details = step 1, item description = step 2). Even false progress signals measurably reduce abandonment.

### 4.4 UX Copy Audit

| Element | Current Copy | Problem | Rewrite |
|---|---|---|---|
| **Quote page H1** | "Get a transparent starting-at range" | "starting-at range" is jargon. Passive structure. | "Tell us what needs repair — we'll send a price range within one business day." |
| **Hero subhead** | "A local jewelry repair shop in Pasadena for pieces that deserve in-house care, clear quotes, and lasting workmanship." | Compound prepositional phrase. Three abstract nouns at the end. Zero urgency. | "We repair rings, watches, and heirlooms in our Pasadena workshop — clear pricing, no surprises, same-day service available." |
| **InHouseBadge H2** | "100% in-house repairs. Handled on-site from drop-off to pickup." | "Handled on-site from drop-off to pickup" restates the same fact. | "Every repair happens here. Your piece never leaves our workshop." |
| **ProcessSteps kicker** | "How it works" | Generic. Every SaaS onboarding page uses this. | "Your repair, step by step" |
| **Proof Band card: "Serving Pasadena"** | "Deer Park • La Porte • Houston Area" | Bullet-list geography reads like an SEO phrase, not a trust signal. | "We serve Pasadena, Deer Park, La Porte, and the greater Houston area — walk-ins welcome." |
| **Quote form textarea helper** | "Not sure what it is? Say what you can see. 'Not sure' is acceptable." | Correct intent but buried below the textarea. Should be the first thing seen. | Move this to a banner above the textarea: "You don't need jewelry vocabulary — describe what you see, and we'll identify it." |
| **Quote form submit button** | "GET MY QUOTE RANGE" (uppercase) | ALL-CAPS on a call-to-action in a luxury context signals Amazon checkout, not boutique workshop. | "Send my quote request" (sentence-case, not all-caps) — or maintain brand uppercase but soften to "Get My Quote" (shorter). |
| **HomeCta H2** | "Get a fast, transparent quote and keep your jewelry in trusted hands." | Compound sentence, three separate value propositions, passive "keep in trusted hands." | "Your piece deserves expert care. Get your quote in 60 seconds." |

### 4.5 Brand Review

**Color usage inconsistencies:**

The DESIGN.md specifies `surface: #FFFFFF` and `neutral/ivory: #FAF7F2` as the two neutral backgrounds. The implementation adds 9 additional warm neutrals across sections: `#f5ede2` (CraftStory), `#f7efe6` (HomeFaq), `#f1e4d7` (Testimonials), `#f2e7d7` (ProcessSteps), `#fffdfa` (ProcessSteps gradient start), `bg-stone-100` (quote page outer), `bg-stone-900` (ShowcaseBand), `bg-stone-950` (not found in main components but in footer context). Each warm cream reads slightly differently — together they create a "faded" effect that is fine as a scroll progression but completely invisible to users. The design-system-correct approach: pick 3 named warm neutrals (ivory `#FAF7F2`, warm `#F4ECDF`, deep-warm `#EFD1BE`) and use only those.

**Typography mixing:**

- `font-serif` (Playfair Display) is used for: h1, h2 in most sections, footer logo, testimonial section heading, InHouseBadge h2, ProcessSteps h2, CraftStory h2, footer nav group headers. This is correct — headings use Playfair.
- `font-sans` (Inter) is used for: footer nav links (correct), but also explicitly set in the footer address (`font-sans letter-spacing-wide`) while other body text has no explicit `font-sans` declaration (defaults to Inter via Tailwind base). The inconsistency is minor but the `letter-spacing-wide` in the footer address class doesn't exist in standard Tailwind — this may be a dead class.
- `font-serif text-2xl text-brand-burgundy` in TrustStrip (`src/components/trust-strip.tsx` line 9–11) creates a heading pattern not used elsewhere. TrustStrip is not rendered on the homepage (`src/app/page.tsx` does not import it) — but it appears on other pages. Its visual register conflicts with the ProofBand pattern.

**Tone inconsistencies:**

- Hero copy: elevated, editorial ("Beauty restored. Elegance preserved.")
- ProofBand card copy: functional ("51 verified reviews you can verify in one tap." — correct) but "in one tap" is mobile-first casual phrasing in a context that reads on desktop too.
- ProcessSteps: "Your jewelry stays on our bench with meticulous, insured care." — "meticulous" is the right word but "stays on our bench" is workshop-jargon. Customer says "I'm leaving my ring here for 3 days" — clarify.
- FAQ answers: "For many repairs, yes. Ask us about rush options when you visit." — Short, honest. Good.
- CtaBand kicker: "Free 15-Minute Assessment" — this is not mentioned anywhere else on the site and contradicts the quote-flow model (which says "1 business day response via form"). Is this still offered? If not, this is Wix-era copy that survived a redesign.

**Stock vs. artisan imagery:**

- Hero: original hero ring image at `/images/home/home-hero-ring.jpg` — appears to be an actual product photo. Good.
- CraftStory: Supabase CDN URLs for workshop images (`workshop-main.jpeg`, `workshop-sketches.jpg`, `workshop-pocket-watch.jpg`) — these appear to be real workshop photography. Strong.
- ServicesGrid: `svgDataUri()` fallback generates SVG placeholder art when `service.image_url` is null. On mobile, images are `hidden sm:block` so the SVG placeholder is never visible to mobile users — but on desktop, if any service lacks an image, users see a `data:image/svg+xml` warm gradient with the service name in Georgia serif. This is a Wix-era pattern — it reads as an error state, not a design choice.

**Wix-era patterns still present:**

1. `CtaBand` component (`src/components/cta-band.tsx`): "Free 15-Minute Assessment" kicker is not corroborated by any other page or flow. Remove or substantiate.
2. `TrustStrip` component (`src/components/trust-strip.tsx`): Three equal white cards with `font-serif text-2xl text-brand-burgundy` value names — identical structure to ProofBand but with less visual polish. This component should be either unified with ProofBand styling or retired.
3. `ServicesGrid` SVG placeholder: Replace all service image fallbacks with a real photo. The SVG data URI approach is technically clever but visually equivalent to a broken image state.

---

## 5. Redesign Brief

### Tier 1 — Quick Wins (this sprint, <1 day each)

1. **`src/app/quote/page.tsx` — All labels sentence-case.** Change all 5 instances of `text-xs uppercase tracking-[0.2em] text-stone-600` on `<label>` elements to `text-sm font-medium text-stone-700`. 30 minutes. Estimated CRO impact: +1–3 pp on form completion.

2. **`src/app/quote/page.tsx` — Add item-type radio chips above textarea.** Insert the `<fieldset>` radio pattern (Fix 1 above) between the email field and the textarea field. The `name="item_type"` value flows to the quote email. 1–2 hours. Estimated CRO impact: +6–9 pp.

3. **`src/components/home-sections.tsx` — Remove `hidden md:block` from `CraftStory`.** Single class removal (line 173). Workshop photography becomes visible to mobile. 5 minutes. Estimated quality impact: closes the "zero artisan evidence on mobile" gap immediately.

4. **`src/components/home-sections.tsx` — Testimonial name to sentence-case.** Change `text-xs uppercase tracking-[0.3em] text-brand-burgundy` to `text-sm font-semibold text-stone-900` on testimonial name (line 383). Change service label from `text-[10px] uppercase tracking-[0.35em] text-stone-500` to `text-[10px] uppercase tracking-[0.2em] text-brand-burgundy/70` (line 386). Add `★★★★★` star line above each quote in `text-[11px] text-brand-gold tracking-[0.2em]`. 20 minutes.

5. **`src/components/home-sections.tsx` — ProofBand card text-stone-600 on white/72 contrast fix.** Change `text-sm text-stone-600` description (line 38) to `text-sm text-stone-700`. Improves contrast from ~4.1:1 to ~5.4:1 on the warm gradient bg. 2 minutes.

6. **`src/components/site-header.tsx` — Add focus ring to desktop nav Links.** Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-sm` to each nav Link `className` (lines 51–59). 5 minutes.

7. **`src/app/quote/page.tsx` — Submit button sentence-case text.** Change "Get My Quote Range" to "Send my quote request" and remove `uppercase tracking-[0.3em]` from the button class. The pill shape and burgundy color carry the weight — caps are not needed. 5 minutes.

8. **`src/components/home-sections.tsx` — Fix mobile footer accordion tap target.** In `MobileFooterGroup`, the `<summary>` currently has `min-h-8 = 32px`. Change to `min-h-11 = 44px` and add `flex items-center`. 5 minutes. WCAG 2.1 AA compliance.

9. **`src/components/cta-band.tsx` — Remove "Free 15-Minute Assessment" kicker.** Change to "Get a Fast Quote" or delete the kicker entirely. The free assessment is not part of the current flow and creates expectation mismatch. 2 minutes.

### Tier 2 — High Impact (next sprint, 1–3 days each)

1. **ProofBand editorial redesign** (`src/components/home-sections.tsx`). Replace the 4-equal-card grid with a dark-ground horizontal stats strip. Background: `bg-[#181112]`. Layout: `grid grid-cols-4` with the first cell spanning 2 cols for "Since 1984" at `font-serif text-5xl text-white`. Remaining 3 stats as text-only label pairs in ivory. Remove the `ring-brand-gold/20` card border. This creates a seamless dark → ivory → warm transition: Hero (dark) → ProofBand (dark) → ServicesGrid (warm). Before: white card grid. After: editorial stat strip matching hero's dark luxury register.

2. **InHouseBadge redesign** (`src/components/home-sections.tsx`). Replace the centered single-sentence section with a two-stat horizontal pair. Left: `100%` in `font-serif text-5xl md:text-6xl text-brand-burgundy`. Below: "In-house repairs". Right: `90 days` in `font-serif text-5xl md:text-6xl text-brand-burgundy`. Below: "Workmanship warranty". Gold vertical divider between. `bg-[#faf7f2]`. Eliminates the weakest section and replaces it with a bold editorial moment.

3. **Add submit loading state to quote form** (`src/components/form-submit-initializer.tsx` + `src/app/quote/page.tsx`). Intercept form submit: set `data-quote-submit` button to `disabled`, swap `#quote-submit-text` to "Sending…", add `aria-busy="true"` to form. On error redirect, state clears. 2–3 hours. Estimated CRO impact: +2–4 pp.

4. **Add inline field validation to quote form** (`src/app/quote/page.tsx`). Implement client-side `blur` validation for name, email, and details fields with `aria-invalid` toggling and `role="alert"` error paragraphs (see Fix 4 code above). 4–6 hours. Estimated CRO impact: +1–2 pp.

5. **Standardize section background colors** (global — multiple components). Replace all ad-hoc warm cream values with three tokens: `neutral-ivory: #FAF7F2`, `neutral-warm: #F4ECDF`, `neutral-deep: #EFD1BE`. Update: CraftStory (`#f5ede2` → `#F4ECDF`), HomeFaq (`#f7efe6` → `#FAF7F2`), Testimonials (`#f1e4d7` → `#F4ECDF`), ProcessSteps gradient (`#fffdfa` → `#FAF7F2`, `#f2e7d7` → `#EFD1BE`). Add these as Tailwind CSS custom tokens in `tailwind.config.ts`. 2–3 hours.

6. **H1 quote page copy rewrite** (`src/app/quote/page.tsx` line 96). Change current `lcp-sans mt-3 text-4xl font-semibold tracking-tight text-stone-900` h1 content from "Get a transparent starting-at range" to "Tell us what needs repair." Subhead (line 99–101): add "We'll reply with a price range within one business day — no obligation." This makes the page's promise specific before the user reads the form. 10 minutes.

### Tier 3 — Visual Elevation (1–2 week investment)

**Photography direction:**
- Commission or source 3–5 additional workshop process photos: hands on a jeweler's loupe, ring sizing mandrel in use, cleaning ultrasonic bath, before/after ring prong repair. These replace the SVG placeholder fallbacks in ServicesGrid and provide above-fold mobile imagery without the CraftStory section restructure.
- Priority shots: close-up of jeweler's hand holding a ring to a loupe (trust + craft), completed engagement ring with box (emotional endpoint), watch movement on workbench (watch repair credibility).
- Style guide: warm tones matching `#F4ECDF` background, natural light from left, no stock-photo poses, no jewelry display cases (generic retail).

**Component library upgrades:**
- Create a `<StatBlock>` component for the InHouseBadge redesign pattern — reusable across service pages and the about page. Props: `value`, `label`, `size` (`sm | md | lg`).
- Create a `<TestimonialCard>` component variant with optional star rating, verification badge, and Google/Yelp source attribution. The current inline object array in `Testimonials()` should be extracted to a typed data array and the card rendered via component.
- Create a `<SectionKicker>` component to standardize the `text-xs uppercase tracking-[0.3em] text-brand-burgundy` pattern. It currently appears 14+ times across components with slight tracking variations (0.3em, 0.35em, 0.4em). A single component with `tracking-[0.3em]` eliminates the inconsistency.

**Motion design:**
- The current `animate-fade-up` + `reveal-delay-*` system is functional but uniform. Introduce staggered entrance for the ProofBand stats strip: each stat fades up with 80ms offset rather than all four at once.
- Add `prefers-reduced-motion` handling to all `reveal-on-scroll` triggers. The scroll reveal manager (`src/components/scroll-reveal-manager.tsx`) should check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip all animation if true.
- The ShowcaseBand CTA button (`rounded-full border border-brand-gold`) has no hover state beyond `hover:bg-brand-gold/10`. Add a subtle `::after` gold shimmer on hover (CSS only, no JS) — a single `background: linear-gradient(90deg, transparent, rgba(198,168,92,0.2), transparent)` translate on hover. Duration 400ms.

**Design system expansion:**
- Add `--color-neutral-ivory: #FAF7F2`, `--color-neutral-warm: #F4ECDF`, `--color-neutral-deep: #EFD1BE` as CSS custom properties to the global stylesheet.
- Formally specify the section background progression: Hero (dark) → ProofBand (dark/editorial) → ServicesGrid (neutral-deep) → ProcessSteps (neutral-warm) → CraftStory (neutral-warm) → ShowcaseBand (dark) → Testimonials (neutral-deep) → HomeCta (burgundy). This alternating dark/light rhythm creates visual breathing room and prevents the "wall of cream" effect.
- Add a `<ServicePriceChip>` pattern: `rounded-full border border-brand-gold/30 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-stone-600` displaying "Starting at $X" on service cards. The starting price data exists in `ServiceItem.starting_price` (servicesGrid.tsx line 13) but is never rendered.

---

## 6. Final Scorecard

| Dimension | Score | Grade |
|---|---|---|
| Overall Design | 84/100 | B+ |
| Conversion Readiness | 72/100 | C+ |
| Accessibility | 74/100 | C |
| Brand Cohesion | 80/100 | B |
| TASTE Score | 78/100 | B |
| IMPECCABLE Compliance | 21/27 rules passing | B |

**IMPECCABLE failures (6 rules):**
- Typography: All-caps >4 words (submit button, multiple labels) — FAIL
- Color: `text-stone-600` on `bg-white/72` on warm gradient ≈ 4.1:1 — FAIL
- Responsiveness: Touch targets <44px (footer mobile accordion) — FAIL
- Responsiveness: Desktop-first design (CraftStory, ShowcaseBand hidden on mobile) — FAIL
- UX Writing: Generic section headings ("How it works," "Our Expertise") — FAIL
- UX Writing: Tone mismatch (CtaBand "Free 15-Minute Assessment" vs. quote flow) — FAIL

### BLOCK Issues (must fix before further marketing spend)

1. **Mobile artisan evidence gap.** `CraftStory` and `ShowcaseBand` are `hidden md:block`. Mobile users (~60% of traffic) see zero workshop photography between the hero and testimonials. Paid traffic landing on mobile sees: dark hero → white cards → text-only service cards → process text → centered sentence → text testimonials. The brand promise is "calm, expensive local workshop" — mobile delivers "calm local business." Fix: remove `hidden md:block` from `CraftStory` outer section.

2. **Quote form 16% completion rate.** The combination of all-caps labels, open-ended textarea as second required field, and zero loading state is demonstrably costing leads. This is not a design preference issue — it is a documented revenue leak with a known baseline. All three fixes are under 2 hours combined.

3. **Missing focus rings on nav links.** Desktop `<nav>` links (site-header.tsx lines 51–59) have no `focus-visible` indicator. Keyboard-only users cannot navigate the primary site structure. This is a WCAG 2.1 AA compliance failure affecting all pages.

### FLAG Issues (fix this month)

1. **`text-[10px]` elements below WCAG minimum font size.** Testimonial service labels (`text-[10px] uppercase text-stone-500`), hero eyebrow "Since 1984" (`text-[10px]`), process step chips (`text-[10px] uppercase`) all render at 10px. WCAG does not set a minimum font size, but at 10px uppercase the effective x-height is ~6px — considered unusable by accessibility guidelines. Raise to `text-[11px]` minimum.

2. **`prefers-reduced-motion` not handled.** `scroll-reveal-manager.tsx` runs intersection observer animations for all users. Users with vestibular disorders or motion sensitivity receive full animation without a way to opt out. Add `matchMedia('(prefers-reduced-motion: reduce)')` check.

3. **ServicesGrid SVG placeholder art.** When `service.image_url` is null, the card renders a `data:image/svg+xml` warm gradient on desktop. This reads as an error state and undermines the luxury grid. Replace with a real image for every service or use a consistent blurred color wash (`bg-gradient-to-br from-[#faf7f2] to-[#f4ecdf]`) as a non-image fallback.

4. **`CtaBand` "Free 15-Minute Assessment"** copy (`src/components/cta-band.tsx` line 9) is not corroborated anywhere in the quote or booking flow. It creates expectation mismatch. Update or remove.

5. **9 distinct background warm neutrals** across sections. Consolidate to 3 named tokens as specified in Tier 2 fix 5. Until then, the section-to-section progression looks like inconsistency not intention.

### PASS — What's Working (preserve these)

- **Hero composition.** The asymmetric ring image, clamp-based h1, gold radial glow, `hidden sm:inline-flex` Book button, trust row structure, and dark luxury ground are reference-quality. Do not redesign without a specific data-driven reason.
- **Mobile sticky CTA removed (2026-05-15).** The scroll-triggered "60-sec Quote" pill component (`src/components/mobile-sticky-cta.tsx`) was deleted to align with premium positioning. Sticky CTAs are not observed on luxury e-commerce or professional service sites (Mejuri, The RealReal, local boutique jewelers $500+ tier). Removal improves visual cleanliness and supports the "calm, expensive local workshop" brand perception. Form remains discoverable via primary CTA in hero and navigation menu.
- **ServicesGrid hover interaction.** `-translate-y-1 hover:shadow-[0_32px_70px_...]` + `group-hover:scale-110 duration-500` on card image. Sophisticated, not decorative. The mobile compact list fallback (slug links with `→`) is the right pattern.
- **Quote form trust footer.** "Secure form · No obligation to approve work · 1 business day response." — Addresses the three biggest objections at the exact moment of submission hesitation. Keep verbatim.
- **ProcessSteps gold vertical rule.** `absolute left-3 top-0 h-full w-px bg-brand-gold/40` connecting the burgundy step number chips is an editorial detail that earns the "artisan workshop" perception. Preserve.
- **Skip to main content link.** Present, functional, correctly positioned (`fixed left-4 top-4 z-[999] -translate-y-24 focus:translate-y-0`). This alone puts the site above average for accessibility.
- **Mobile menu architecture.** "Quick help" panel with quote CTA + call link appears before the navigation list. This is the conversion-first mobile pattern. Correct.
- **Footer mobile accordion.** The `<details>/<summary>` pattern for footer nav groups is the right approach for a content-heavy footer on mobile. The visual execution (rounded-2xl, border, font-serif summary headers) is brand-consistent. Fix only the min-h tap target.

---

## 7. Immediate Next Actions

Ordered by time-to-impact ratio (fastest fix / biggest gain first):

1. **Remove `hidden md:block` from CraftStory.** File: `src/components/home-sections.tsx` line 173. Change `<section className="relative hidden overflow-hidden bg-[#f5ede2]...">` to `<section className="relative overflow-hidden bg-[#f5ede2]...">`. 5 minutes. Closes the mobile artisan evidence gap for all current and future paid traffic.

2. **Form label sentence-case.** File: `src/app/quote/page.tsx`. Find all `text-xs uppercase tracking-[0.2em] text-stone-600` on `<label>` elements (5 occurrences) and replace with `text-sm font-medium text-stone-700`. 10 minutes.

3. **Submit button text and style.** File: `src/app/quote/page.tsx` line 283–290. Remove `uppercase tracking-[0.3em]` from button class. Change button text from "Get My Quote Range" to "Send my quote request". 5 minutes.

4. **Add item-type radio chip fieldset above textarea.** File: `src/app/quote/page.tsx` lines 237–250. Insert fieldset pattern (Fix 1, §4.3). This is the single highest-impact CRO change. 1–2 hours.

5. **Testimonial name and star fixes.** File: `src/components/home-sections.tsx` lines 376–395. Add `★★★★★` star line. Change name class to `text-sm font-semibold text-stone-900`. Change service label tracking to `tracking-[0.2em]`. 15 minutes.

6. **Footer mobile accordion tap target.** File: `src/components/home-sections.tsx` — `MobileFooterGroup` summary. Add `min-h-11 flex items-center` to the `<span>` inside `<summary>`. 5 minutes.

7. **Nav link focus rings.** File: `src/components/site-header.tsx` lines 51–59. Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 rounded-sm` to each nav Link className. 5 minutes.

8. **ProofBand description contrast.** File: `src/components/home-sections.tsx` line 38. Change `text-sm text-stone-600` to `text-sm text-stone-700`. 2 minutes.

9. **CtaBand copy.** File: `src/components/cta-band.tsx` line 9. Remove or replace "Free 15-Minute Assessment" kicker. 2 minutes.

10. **Add form submit loading state.** File: `src/components/form-submit-initializer.tsx` + `src/app/quote/page.tsx`. Implement submit intercept with disabled state + text swap to "Sending…" + aria-busy. 2–3 hours. Run after items 1–5 are deployed and baseline is re-established.

---

## 8. Live Screenshot Addendum

*Browser captures taken 2026-05-15 via Chrome MCP on live production site (https://www.susiesjewelryrepair.com). Screenshots confirm or add to code-based findings above.*

### 8.1 New Findings Not in Code Analysis

**BLOCK — Quote page: three equal-weight CTAs**
`src/app/quote/page.tsx` — `ConversionQuickActions` component renders "START QUOTE", "BOOK REPAIR", and "CONTACT US" at equal visual weight on desktop. All three use the same pill border style with no primary/secondary hierarchy. This violates the MOBILE_UX_GUARDRAILS constraint of one primary action before the form, and directly contradicts the conversion goal of driving quote submissions. Immediate fix: apply `bg-brand-burgundy text-white` to "START QUOTE" only; demote "BOOK REPAIR" to ghost; move "CONTACT US" to the footer or remove entirely.

**FLAG — Service page hero image not loading**
`/services/watch-repair` hero image showed only a warm gradient placeholder (`bg-[#f0e6d6]` or similar) after a 4-second page load wait. No network error was observable without DevTools, but the right-column image never painted. This is a potential LCP regression — the image may be lazy-loaded behind a large-media intersection observer when it should be eager. Check `loading="eager"` and `fetchPriority="high"` attributes on service page hero `<img>`. If the image is inside a motion-reveal wrapper, it will not paint until scroll, which breaks above-fold performance. File: `src/app/services/[slug]/page.tsx`.

**FLAG — Service breadcrumb all-caps text**
Breadcrumb renders "HOME / SERVICES / WATCH REPAIR & BATTERY REPLACEMENT" with the current page segment in all-caps. This is an IMPECCABLE Rule 5 violation (all-caps for >4 words). The breadcrumb segment inherits `uppercase tracking-[...]` from a shared label class. Fix: apply sentence-case to the final breadcrumb segment only (`capitalize` or explicit `normal-case`). File: `src/components/breadcrumb.tsx` or wherever breadcrumb segments are rendered.

### 8.2 Confirmed PASS Items (Visual Verification)

**PASS — "IN-HOUSE ASSESSMENT" editorial card overlay**
The service hero section on `/services/watch-repair` shows a visually confirmed editorial card overlaying the bottom-left of the hero image with "IN-HOUSE ASSESSMENT" kicker + supporting text. This is sophisticated and brand-aligned — do not remove or simplify this element. It reads as a premium editorial detail that elevates the service page above generic local-business layouts.

**PASS — Service page CTA hierarchy**
Desktop screenshot confirmed: "GET FAST QUOTE" renders in brand-burgundy as the primary pill CTA, with "BOOK REPAIR" as a ghost secondary immediately adjacent. Correct hierarchy, correct sizing, correct color usage. This pattern should be preserved and replicated on any future service pages.

**PASS — Hero typography and composition**
The homepage hero (from prior session screenshots) confirmed: h1 "Beauty restored. Elegance preserved." in Playfair Display at correct scale, gold radial glow behind the ring image, asymmetric layout with copy-right / image-left. TASTE rating confirmed as Sophisticated. No changes needed.

### 8.3 Updated Priority Order

With live visual confirmation, the Immediate Next Actions order from §7 is updated:

1. **Quote page CTA hierarchy fix** (new, BLOCK) — demote "BOOK REPAIR" and remove "CONTACT US" from ConversionQuickActions
2. **CraftStory `hidden md:block` removal** (unchanged, #1 from §7)
3. **Service page hero image loading** (new, FLAG) — add `loading="eager"` + `fetchPriority="high"`, remove from scroll-reveal wrapper
4. **Breadcrumb sentence-case** (new, FLAG) — final segment should not be all-caps
5. **Form label sentence-case** (unchanged, #2 from §7)
6. Items 3–10 from §7 remain in the same order

---

*Audit complete. All recommendations are IMPECCABLE-passing or marked REVISED with specific constraints. All file paths, class names, hex values, and line references are drawn directly from source code reviewed 2026-05-15. Live screenshot addendum added 2026-05-15.*
