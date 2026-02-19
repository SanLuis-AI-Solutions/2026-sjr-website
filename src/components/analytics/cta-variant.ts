"use client";

export type CtaVariant = "control" | "primary_focus";

const CTA_VARIANT_KEY = "sjr_cta_variant_v1";

function fromRaw(raw: string | null): CtaVariant | null {
  if (raw === "control" || raw === "primary_focus") return raw;
  return null;
}

export function getCtaVariantStorageKey() {
  return CTA_VARIANT_KEY;
}

export function resolveCtaVariant(raw: string | null): CtaVariant | null {
  return fromRaw(raw);
}

export function readCurrentCtaVariant(): CtaVariant | null {
  if (typeof window === "undefined") return null;

  const fromDataset = fromRaw(document.documentElement.dataset.sjrCtaVariant || null);
  if (fromDataset) return fromDataset;

  return fromRaw(window.sessionStorage.getItem(CTA_VARIANT_KEY));
}
