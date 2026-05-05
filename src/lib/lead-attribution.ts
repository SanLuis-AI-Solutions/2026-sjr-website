export type LeadAttribution = {
  landingPath: string | null;
  landingSearch: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  utmId: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  msclkid: string | null;
  firstTouchAt: string | null;
  submitPath: string | null;
};

function normalize(value: FormDataEntryValue | null, maxLength = 500) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

function parseRefererPath(request: Request) {
  const referer = request.headers.get("referer");
  if (!referer) return null;

  try {
    const url = new URL(referer);
    return `${url.pathname}${url.search}`;
  } catch {
    return referer.slice(0, 500);
  }
}

export function resolveLeadAttributionFromFormData(
  formData: FormData,
  request: Request,
): LeadAttribution {
  return {
    landingPath: normalize(formData.get("attribution_landing_path")),
    landingSearch: normalize(formData.get("attribution_landing_search")),
    referrer: normalize(formData.get("attribution_referrer")),
    utmSource: normalize(formData.get("attribution_utm_source"), 120),
    utmMedium: normalize(formData.get("attribution_utm_medium"), 120),
    utmCampaign: normalize(formData.get("attribution_utm_campaign"), 180),
    utmTerm: normalize(formData.get("attribution_utm_term"), 180),
    utmContent: normalize(formData.get("attribution_utm_content"), 180),
    utmId: normalize(formData.get("attribution_utm_id"), 120),
    gclid: normalize(formData.get("attribution_gclid"), 180),
    gbraid: normalize(formData.get("attribution_gbraid"), 180),
    wbraid: normalize(formData.get("attribution_wbraid"), 180),
    msclkid: normalize(formData.get("attribution_msclkid"), 180),
    firstTouchAt: normalize(formData.get("attribution_first_touch_at"), 80),
    submitPath:
      normalize(formData.get("attribution_submit_path")) || parseRefererPath(request),
  };
}

export function buildLeadAttributionLines(attribution: LeadAttribution) {
  const lines: string[] = [];
  const landing =
    attribution.landingPath || attribution.landingSearch
      ? `${attribution.landingPath || ""}${attribution.landingSearch || ""}`
      : null;
  const utmParts = [
    attribution.utmSource ? `source=${attribution.utmSource}` : null,
    attribution.utmMedium ? `medium=${attribution.utmMedium}` : null,
    attribution.utmCampaign ? `campaign=${attribution.utmCampaign}` : null,
    attribution.utmTerm ? `term=${attribution.utmTerm}` : null,
    attribution.utmContent ? `content=${attribution.utmContent}` : null,
    attribution.utmId ? `id=${attribution.utmId}` : null,
  ].filter(Boolean);
  const clickIds = [
    attribution.gclid ? `gclid=${attribution.gclid}` : null,
    attribution.gbraid ? `gbraid=${attribution.gbraid}` : null,
    attribution.wbraid ? `wbraid=${attribution.wbraid}` : null,
    attribution.msclkid ? `msclkid=${attribution.msclkid}` : null,
  ].filter(Boolean);

  if (landing) lines.push(`Landing page: ${landing}`);
  if (attribution.submitPath) lines.push(`Submit page: ${attribution.submitPath}`);
  if (attribution.referrer) lines.push(`Referrer: ${attribution.referrer}`);
  if (utmParts.length > 0) lines.push(`UTM: ${utmParts.join(", ")}`);
  if (clickIds.length > 0) lines.push(`Ad click IDs: ${clickIds.join(", ")}`);
  if (attribution.firstTouchAt) lines.push(`First touch at: ${attribution.firstTouchAt}`);

  return lines;
}

export function appendLeadAttributionBlock(notes: string, attribution: LeadAttribution) {
  const normalizedNotes = typeof notes === "string" ? notes.trim() : "";
  const lines = buildLeadAttributionLines(attribution);
  if (lines.length === 0) return normalizedNotes;

  const block = ["Lead attribution", ...lines].join("\n");
  return normalizedNotes ? `${normalizedNotes}\n\n${block}` : block;
}
