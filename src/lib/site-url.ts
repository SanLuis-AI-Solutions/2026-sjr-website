const DEFAULT_SITE_URL = "https://www.susiesjewelryrepair.com";

function normalizeUrl(raw: string) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  return trimmed.replace(/\/+$/, "");
}

export function getSiteUrl() {
  // Prefer an explicit public site URL. Fall back to the canonical domain.
  // On Vercel, `VERCEL_URL` is host-only (no protocol).
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return normalizeUrl(env);
}

