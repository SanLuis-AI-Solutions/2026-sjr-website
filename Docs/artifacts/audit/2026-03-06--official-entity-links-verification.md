# Official Entity Links Verification

## Metadata

- branch: `master`
- base commit reviewed: `f143301`
- artifact path: `Docs/artifacts/audit/2026-03-06--official-entity-links-verification.md`
- verification date: `2026-03-06`

## Goal

Replace the temporary directory-style `sameAs` references with verified official business entity URLs for GEO / AEO confidence.

## Verification Inputs

### Public search evidence

- query: `Susie's Jewelry Repair Pasadena TX Yelp Facebook Google Business Profile`
  - verified:
    - Yelp listing: `https://www.yelp.com/biz/susies-jewelry-repair-pasadena-2`
    - Facebook page: `https://www.facebook.com/p/Susies-Jewelry-Repair-61574507807667/`

### Live browser verification

- URL visited:
  - `https://www.google.com/maps/search/Susie's+Jewelry+Repair+Pasadena+TX`
- resolved Google Maps place:
  - business title: `Susie's Jewelry and Watch Repair`
  - address: `3910 Fairmont Pkwy # C, Pasadena, TX 77504`
  - phone: `(281) 991-6500`
  - website: `https://www.susiesjewelryrepair.com/`
- stable Google Maps place URL captured from the share flow:
  - `https://www.google.com/maps/place/Susie's+Jewelry+and+Watch+Repair/@29.6504877,-95.1863662,17z/data=!3m1!4b1!4m6!3m5!1s0x86409857c894980f:0xf79f8dc5a8328ab9!8m2!3d29.6504877!4d-95.1863662!16s%2Fg%2F1ttph87w`

## Implemented Change

- `src/lib/constants.ts`
  - replaced temporary directory references with:
    - official Google Maps place URL
    - official Yelp listing URL
    - official Facebook page URL
  - added `googleMapsUrl` constant for reuse
- `src/components/local-business-schema.tsx`
  - added `hasMap` using the verified Google Maps place URL
- `tests/smoke.spec.ts`
  - tightened schema smoke coverage to require Google Maps, Yelp, and Facebook in `sameAs`
  - added `hasMap` assertion

## Decision

- accept and keep live

Reasoning:

- these links are materially better entity signals than generic directory references
- the Google Maps place was verified against live address, phone, and website
- the Yelp and Facebook pages were identified via public search results tied to the same business and location

## Risks

- the Facebook page uses a `/p/` permalink rather than a branded vanity URL; this is still acceptable as an official page URL
- if the business later publishes a cleaner vanity Facebook URL, update `sameAs`
- if a direct Google Business Profile short URL is later claimed, the current Maps place URL can still remain as the canonical `hasMap` reference

## Next Optimal Step

Move into the first growth implementation pass:

1. expand the highest-intent existing blog articles
2. add in-body FAQ blocks to those articles
3. strengthen internal links from blog content into service pages, quote, and booking flows
