import nodemailer from "nodemailer";

type LeadKind = "quotes" | "bookings" | "contacts";
type LeadEmailResult = { ok: true } | { ok: false; error: string };

function parseBool(value: string | undefined, fallback: boolean) {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  if (normalized === "ssl") return true;
  if (normalized === "tls") return false;
  if (normalized === "1") return true;
  if (normalized === "0") return false;
  return fallback;
}

function getRecipient(kind: LeadKind) {
  const fallback = process.env.LEAD_EMAIL_TO || "contact@susiesjewelryrepair.com";
  if (kind === "quotes" && process.env.LEAD_EMAIL_TO_QUOTES) {
    return process.env.LEAD_EMAIL_TO_QUOTES;
  }
  if (kind === "bookings" && process.env.LEAD_EMAIL_TO_BOOKINGS) {
    return process.env.LEAD_EMAIL_TO_BOOKINGS;
  }
  if (kind === "contacts" && process.env.LEAD_EMAIL_TO_CONTACTS) {
    return process.env.LEAD_EMAIL_TO_CONTACTS;
  }
  return fallback;
}

export async function sendLeadEmail(input: {
  kind: LeadKind;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<LeadEmailResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // No-op when SMTP is not configured so lead capture never fails.
  if (!host || !user || !pass) {
    return { ok: true };
  }

  try {
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = parseBool(process.env.SMTP_SECURE, port === 465);
    const to = getRecipient(input.kind);
    const from = process.env.LEAD_EMAIL_FROM || user;

    const transporter = nodemailer.createTransport({
      host,
      port: Number.isFinite(port) ? port : 587,
      secure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 7000,
    });

    await transporter.sendMail({
      from,
      to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo,
    });

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, error: `smtp_send_failed: ${msg}` };
  }
}
