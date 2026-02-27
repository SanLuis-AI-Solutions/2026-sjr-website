import nodemailer from "nodemailer";
import { BUSINESS } from "@/lib/constants";

/*
 * Date: 2026-02-26
 * Time: 18:14:40 -06:00 (CST)
 * Context/Notes: Added customer booking confirmation email template and SMTP helper reuse for booking follow-up loop closure.
 * Agent Name: Codex
 */

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

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = parseBool(process.env.SMTP_SECURE, port === 465);

  return {
    host,
    user,
    pass,
    port: Number.isFinite(port) ? port : 587,
    secure,
  };
}

function createTransportFromConfig(config: NonNullable<ReturnType<typeof getSmtpConfig>>) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 7000,
  });
}

export async function sendLeadEmail(input: {
  kind: LeadKind;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<LeadEmailResult> {
  const smtpConfig = getSmtpConfig();

  // No-op when SMTP is not configured so lead capture never fails.
  if (!smtpConfig) {
    return { ok: true };
  }

  try {
    const to = getRecipient(input.kind);
    const from = process.env.LEAD_EMAIL_FROM || smtpConfig.user;

    const transporter = createTransportFromConfig(smtpConfig);

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

export async function sendCustomerConfirmationEmail(input: {
  name: string;
  email: string;
  date: string;
  time: string;
  details?: string;
  pending?: boolean;
  bookingId?: string;
  calendarLink?: string;
}): Promise<LeadEmailResult> {
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    return { ok: true };
  }

  const isPending = Boolean(input.pending);
  const subject = isPending
    ? `We received your booking request (${input.date} at ${input.time})`
    : `Booking request received (${input.date} at ${input.time})`;

  const plainText = [
    `Hi ${input.name},`,
    "",
    isPending
      ? "We received your booking request and our team will confirm availability shortly."
      : "Thank you for booking with Susie's Jewelry Repair. Your request has been received.",
    `Requested time: ${input.date} at ${input.time}`,
    input.bookingId ? `Reference ID: ${input.bookingId}` : null,
    input.calendarLink ? `Calendar link: ${input.calendarLink}` : null,
    input.details ? `Notes you shared: ${input.details}` : null,
    "",
    "Need to update your request? Reply to this email or call us directly.",
    `${BUSINESS.phone}`,
    "",
    `Susie's Jewelry Repair`,
    `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="margin:0;padding:24px;background:#f7f3ee;font-family:Inter,Arial,sans-serif;color:#2b2526;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7ddd0;border-radius:18px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;background:linear-gradient(135deg,#7a2e3a,#5e2230);color:#fff;">
            <div style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.85;">Susie's Jewelry Repair</div>
            <h1 style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;">Booking Request Received</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(input.name)},</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#4a3a3c;">
              ${isPending
      ? "We received your booking request and our team will confirm availability shortly."
      : "Thank you for booking with Susie's Jewelry Repair. Your request is in our queue and we will confirm availability as soon as possible."}
            </p>
            <div style="margin:16px 0;padding:16px;border:1px solid #e7ddd0;border-radius:12px;background:#faf7f2;">
              <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7a2e3a;font-weight:700;">Appointment Details</div>
              <p style="margin:10px 0 0;font-size:15px;color:#2b2526;"><strong>Date:</strong> ${escapeHtml(input.date)}</p>
              <p style="margin:6px 0 0;font-size:15px;color:#2b2526;"><strong>Time:</strong> ${escapeHtml(input.time)}</p>
              ${input.bookingId ? `<p style="margin:6px 0 0;font-size:15px;color:#2b2526;"><strong>Reference:</strong> ${escapeHtml(input.bookingId)}</p>` : ""}
              ${input.calendarLink ? `<p style="margin:10px 0 0;"><a href="${escapeAttr(input.calendarLink)}" style="color:#7a2e3a;font-weight:700;text-decoration:none;">View calendar event</a></p>` : ""}
            </div>
            ${input.details ? `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#4a3a3c;"><strong>Notes:</strong> ${escapeHtml(input.details)}</p>` : ""}
            <p style="margin:0;font-size:14px;line-height:1.7;color:#4a3a3c;">
              Need to make a change? Reply to this email or call us at <a href="tel:${escapeAttr(BUSINESS.phone)}" style="color:#7a2e3a;font-weight:700;text-decoration:none;">${escapeHtml(BUSINESS.phone)}</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px;border-top:1px solid #efe6d8;background:#fffaf3;font-size:12px;line-height:1.6;color:#6c5b5d;">
            <strong>Susie's Jewelry Repair</strong><br/>
            ${escapeHtml(BUSINESS.address.street)}, ${escapeHtml(BUSINESS.address.city)}, ${escapeHtml(BUSINESS.address.state)} ${escapeHtml(BUSINESS.address.zip)}
          </td>
        </tr>
      </table>
    </div>
  `;

  try {
    const transporter = createTransportFromConfig(smtpConfig);
    await transporter.sendMail({
      from: process.env.LEAD_EMAIL_FROM || smtpConfig.user,
      to: input.email,
      subject,
      text: plainText,
      html,
      replyTo: getRecipient("bookings"),
    });

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return { ok: false, error: `smtp_customer_confirmation_failed: ${msg}` };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
