type NotifyResult = { ok: true } | { ok: false; error: string };

function getWebhookUrl(kind?: "quotes" | "bookings" | "contacts") {
  if (kind === "quotes" && process.env.GOOGLE_CHAT_WEBHOOK_URL_QUOTES) {
    return process.env.GOOGLE_CHAT_WEBHOOK_URL_QUOTES;
  }
  if (kind === "bookings" && process.env.GOOGLE_CHAT_WEBHOOK_URL_BOOKINGS) {
    return process.env.GOOGLE_CHAT_WEBHOOK_URL_BOOKINGS;
  }
  if (kind === "contacts" && process.env.GOOGLE_CHAT_WEBHOOK_URL_CONTACTS) {
    return process.env.GOOGLE_CHAT_WEBHOOK_URL_CONTACTS;
  }
  return process.env.GOOGLE_CHAT_WEBHOOK_URL;
}

export async function notifyGoogleChat(
  text: string,
  opts?: { timeoutMs?: number; kind?: "quotes" | "bookings" | "contacts" }
): Promise<NotifyResult> {
  const url = getWebhookUrl(opts?.kind);
  if (!url) return { ok: true }; // no-op when not configured

  try {
    const controller = new AbortController();
    const timeoutMs = opts?.timeoutMs ?? 1500;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ text }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `chat_webhook_failed: ${res.status} ${body}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, error: `chat_webhook_error: ${msg}` };
  }
}
