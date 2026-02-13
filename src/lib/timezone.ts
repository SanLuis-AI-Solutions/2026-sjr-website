const DEFAULT_TIMEZONE = "America/Chicago";

export function normalizeTimeZone(input?: string, fallback = DEFAULT_TIMEZONE) {
  const candidate = (input || "").replace(/\r/g, "").trim();
  if (!candidate) return fallback;

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch {
    return fallback;
  }
}
