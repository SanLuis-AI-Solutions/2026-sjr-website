# Page Contract: Services Hub + Watch Repair (2026-02-14)

This document is the explicit contract for layout, design, flow, and structure. It exists to prevent churn and ensure every iteration is intentional.

## Global Rules (All Pages)
- Mobile-first: assume ~75% of sessions are mobile.
- Luxury-minimal: whitespace and hierarchy over “more modules.”
- 1 primary action per screen (Quote) and 1 secondary (Book). No tertiary CTAs inside cards.
- Contrast baseline: body text must read at a glance on mobile (avoid “too-light gray”).
- Motion: reveal-on-scroll only for attention guidance (no scroll hijacking, no heavy parallax on mobile).

## Services Hub (`/services`)
**Goal:** make browsing feel like a curated menu and make it obvious what is clickable.

Sections (top to bottom):
1. Hero: editorial headline + two CTAs + featured image.
2. Featured service: single banner card with “View details” only.
3. Directory: category headings + *each service is its own card*.

Service card rules:
- Entire card is clickable (one interaction surface).
- Includes an image, title, one-sentence summary, and three meta chips:
  - Starting at (or Request quote)
  - Service (Same Day/Next Day default; Custom Design exception)
  - Popular (one common request)
- Clear affordance arrow icon (not extra button rows).

## Watch Repair (`/services/watch-repair`)
**Goal:** flagship service detail page that builds trust, reduces uncertainty, and drives Quote/Book.

Sections (top to bottom):
1. Hero: service title + short summary + chips (Starting at, Service) + Quote/Book.
2. How it works: 3 steps with explicit approval point + supporting imagery.
3. What to expect: battery vs full service vs repairs/parts (clear chunking).
4. Pricing & timing: two cards + what-to-bring checklist + common requests.
5. Why customers choose us: trust section (in-house, approvals, checks) + optional imagery.
6. FAQs: minimum 7, non-overlapping, high-intent search topics; includes FAQ JSON-LD.
7. Related services + global CTA band.

Color/contrast rules:
- Alternate white and warm-stone sections for rhythm.
- Burgundy + gold used as accents only (chips, dividers, buttons, micro highlights).

