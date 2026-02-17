const DEFAULT_SITE_URL = "https://www.susiesjewelryrepair.com";

function normalizeUrl(raw: string) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  return trimmed.replace(/\/+$/, "");
}

export function getSiteUrl() {
  // Always prefer explicit env values, otherwise fall back to canonical production domain.
  // This avoids publishing deployment-host canonicals in metadata/sitemaps.
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";

  return normalizeUrl(env);
}
