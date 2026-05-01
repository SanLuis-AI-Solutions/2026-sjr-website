---
version: "alpha"
name: "Susie's Jewelry Repair Premium Local"
description: "A conversion-led boutique design system for a trusted Pasadena jewelry and watch repair workshop."
colors:
  primary: "#181112"
  secondary: "#4A3A3C"
  tertiary: "#7A2E3A"
  tertiary-container: "#5E2230"
  accent: "#C6A85C"
  neutral: "#FAF7F2"
  surface: "#FFFFFF"
  surface-warm: "#F4ECDF"
  border: "#E2D5D7"
  on-primary: "#FAF7F2"
  on-tertiary: "#FFFFFF"
typography:
  display:
    fontFamily: "Playfair Display"
    fontSize: "clamp(3rem, 12vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "0"
  h1:
    fontFamily: "Playfair Display"
    fontSize: "clamp(2.75rem, 8vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "0"
  h2:
    fontFamily: "Playfair Display"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: "0"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label-caps:
    fontFamily: "Inter"
    fontSize: "0.68rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.22em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "18px"
  xl: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.pill}"
    padding: "16px 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.pill}"
    padding: "15px 26px"
    height: "52px"
  trust-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
---

## Overview

Susie's Jewelry Repair should feel like a calm, expensive local workshop, not a crowded marketing template. The visual language is editorial luxury with practical conversion discipline: fewer competing panels, clearer first-screen actions, and stronger trust proof near every high-intent decision.

## Colors

The palette uses warm ivory, ink charcoal, reserve burgundy, and restrained antique gold. Burgundy is reserved for primary conversion actions and decisive headings. Gold is a trust and craft accent, never a large background color. Surfaces stay warm and quiet so repair photos, quotes, pricing cues, and CTAs carry the hierarchy.

## Typography

Headlines use Playfair Display for jewelry-category character and editorial polish. Body text uses Inter for legibility on mobile forms and service pages. Heading tracking may tighten slightly for polish; uppercase labels are the only place with wide tracking.

## Layout

Mobile is the primary canvas. Every important landing page must show a call path plus either quote or booking in the first viewport. Service detail pages lead with the decision, not with long explanation. Secondary proof, guides, and market snapshots come after the first conversion choice.

## Elevation & Depth

Use depth sparingly. Prefer full-width warm bands, quiet inset panels, and photography over stacked card grids. When a card is needed, use soft warm shadows and no harsh gray borders. Avoid decorative blobs and heavy blur on scrolling content.

## Shapes

Buttons are pill-shaped for tap comfort. Content containers use moderate radii, not oversized generic cards. Image containers may use softer corners, but nested cards inside cards are avoided.

## Components

Primary CTAs are filled burgundy with white text. Secondary CTAs are white or transparent with burgundy text and a gold hairline. Trust chips summarize proof in short, scannable phrases: In-house repairs, Since 1984, 4.5 Google rating, 90-day workmanship warranty.

## Do's and Don'ts

Do keep the first screen quiet, clear, and conversion-ready. Do make phone, quote, and booking paths touch-friendly. Do preserve SEO content and schema. Do not add decorative visual noise, generic three-card rows, fake urgency, or extra required form fields.
