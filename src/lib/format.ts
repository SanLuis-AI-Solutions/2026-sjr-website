function parseNumberish(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/[$,]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function formatStartingAt(value: unknown): string | null {
  // Accepts number, "25", "$25", "$25+", "25+"; always returns "$<n>+".
  if (typeof value === "string" && value.includes("+")) {
    const n = parseNumberish(value.replace("+", ""));
    return n === null ? null : `$${n}+`;
  }

  const n = parseNumberish(value);
  return n === null ? null : `$${n}+`;
}

export function formatTimeEstimate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned.length) return null;

  const normalized = cleaned.replace(/\s+/g, " ").toLowerCase();
  if (
    normalized === "same day or next day" ||
    normalized === "same-day or next-day" ||
    normalized === "same day/next day" ||
    normalized === "same-day/next-day" ||
    normalized === "same day/next day service" ||
    normalized === "same-day/next-day service"
  ) {
    return "Same Day/Next Day service";
  }

  return cleaned;
}
