import { NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google-calendar";
import { supabaseInsert, supabaseUpdateById } from "@/lib/supabase/admin";
import { notifyGoogleChat } from "@/lib/notify";
import { sendCustomerConfirmationEmail, sendLeadEmail } from "@/lib/lead-email";
import { normalizeTimeZone } from "@/lib/timezone";
import {
  isValidDateString,
  isValidTimeString,
  isWithinBookingHours,
  minutesFromTime,
} from "@/lib/booking-schedule";
import { evaluateLeadSpam } from "@/lib/lead-spam";
import {
  appendServicesFinderLeadContextToUrl,
  prependServicesFinderLeadContext,
  resolveStoredServicesFinderLeadContext,
  resolveServicesFinderLeadContextFromFormData,
  SERVICES_FINDER_WEBSITE_SOURCE,
} from "@/lib/service-lead-context";

/*
 * Date: 2026-02-26
 * Time: 18:14:40 -06:00 (CST)
 * Context/Notes: Added customer confirmation email dispatch for booked and pending booking states.
 * Agent Name: Codex
 */

export async function POST(request: Request) {
  let finderContext: ReturnType<typeof resolveServicesFinderLeadContextFromFormData> | null = null;
  try {
    const formData = await request.formData();

    const company = String(formData.get("company") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const time = String(formData.get("time") || "").trim();
    const details = String(formData.get("details") || "").trim();
    finderContext = resolveServicesFinderLeadContextFromFormData(formData);
    const storedDetails = prependServicesFinderLeadContext(details, finderContext);
    const storedLeadContext = resolveStoredServicesFinderLeadContext({
      source: finderContext ? SERVICES_FINDER_WEBSITE_SOURCE : "website",
      details: storedDetails,
    });
    const chatDetailsLine = storedLeadContext.cleanCustomerNotes
      ? `details: ${storedLeadContext.cleanCustomerNotes.slice(0, 500)}`
      : storedLeadContext.isServicesFinderLead
        ? "details: none provided beyond finder context"
        : null;
    const emailDetailsLine = storedLeadContext.cleanCustomerNotes
      ? `details: ${storedLeadContext.cleanCustomerNotes}`
      : storedLeadContext.isServicesFinderLead
        ? "details: none provided beyond finder context"
        : null;
    const customerVisibleDetails = storedLeadContext.cleanCustomerNotes || undefined;

    if (company) {
      return redirectOrJson(request, { ok: true }, 200, finderContext);
    }

    if (!name || !email || !date || !time) {
      return redirectOrJson(request, { ok: false, error: "missing_fields" }, 400, finderContext);
    }

    if (!isValidDateString(date) || !isValidTimeString(time)) {
      return redirectOrJson(request, { ok: false, error: "invalid_date_time" }, 400, finderContext);
    }

    const tz = normalizeTimeZone(process.env.GOOGLE_CALENDAR_TIMEZONE);
    if (!isWithinBookingHours(date, time)) {
      return redirectOrJson(request, { ok: false, error: "outside_business_hours" }, 400, finderContext);
    }

    if (isInPast(date, time, tz)) {
      return redirectOrJson(request, { ok: false, error: "in_past" }, 400, finderContext);
    }

    const spamCheck = evaluateLeadSpam({
      leadType: "booking",
      name,
      email,
      phone,
      details: storedDetails,
    });

    const bookingId = crypto.randomUUID();
    const created = await supabaseInsert("booking_requests", {
      id: bookingId,
      name,
      email,
      phone: phone || null,
      date,
      time,
      details: storedDetails || null,
      status: spamCheck.isSpam ? "spam" : "new",
      source: spamCheck.isSpam
        ? `website_spam_suspected:${spamCheck.reason}`
        : finderContext
          ? "website:services_finder"
          : "website",
      page_url: request.headers.get("referer") || null,
      user_agent: request.headers.get("user-agent") || null,
      ip: (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null,
    });

    if (spamCheck.isSpam) {
      return redirectOrJson(request, { ok: true, id: created?.id || bookingId }, 200, finderContext);
    }

    try {
      const event = await createBookingEvent({
        name,
        email,
        phone: phone || undefined,
        date,
        time,
        details: storedDetails || undefined,
      });

      await supabaseUpdateById("booking_requests", bookingId, {
        status: "booked",
        calendar_event: event,
        error: null,
      });

      await notifyGoogleChat(
        [
          "New Booking (Booked)",
          `id: ${created?.id || bookingId}`,
          `name: ${name}`,
          `email: ${email}`,
          phone ? `phone: ${phone}` : null,
          `date: ${date}`,
          `time: ${time}`,
          event?.htmlLink ? `link: ${event.htmlLink}` : null,
          ...storedLeadContext.internalSummaryLines,
          chatDetailsLine,
        ]
          .filter(Boolean)
          .join("\n"),
        { timeoutMs: 1500, kind: "bookings" }
      ).catch(() => null);
      const emailResult = await sendLeadEmail({
        kind: "bookings",
        subject: `New Booking (Booked) - ${name} (${date} ${time})`,
        replyTo: email,
        text: [
          "New Booking (Booked)",
          `id: ${created?.id || bookingId}`,
          `name: ${name}`,
          `email: ${email}`,
          phone ? `phone: ${phone}` : null,
          `date: ${date}`,
          `time: ${time}`,
          event?.htmlLink ? `link: ${event.htmlLink}` : null,
          ...storedLeadContext.internalSummaryLines,
          emailDetailsLine,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => null);
      if (emailResult && !emailResult.ok) {
        console.error(emailResult.error);
      }

      const customerEmailResult = await sendCustomerConfirmationEmail({
        name,
        email,
        date,
        time,
        details: customerVisibleDetails,
        pending: false,
        bookingId: String(created?.id || bookingId),
        calendarLink: event?.htmlLink || undefined,
      }).catch(() => null);
      if (customerEmailResult && !customerEmailResult.ok) {
        console.error(customerEmailResult.error);
      }

      return redirectOrJson(request, { ok: true, id: created?.id || bookingId }, 200, finderContext);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "calendar_error";
      await supabaseUpdateById("booking_requests", bookingId, {
        status: "pending",
        error: msg,
      });
      await notifyGoogleChat(
        [
          "New Booking (Pending Calendar)",
          `id: ${created?.id || bookingId}`,
          `name: ${name}`,
          `email: ${email}`,
          phone ? `phone: ${phone}` : null,
          `date: ${date}`,
          `time: ${time}`,
          `error: ${msg}`,
          ...storedLeadContext.internalSummaryLines,
          chatDetailsLine,
        ]
          .filter(Boolean)
          .join("\n"),
        { timeoutMs: 1500, kind: "bookings" }
      ).catch(() => null);
      const emailResult = await sendLeadEmail({
        kind: "bookings",
        subject: `New Booking (Pending Calendar) - ${name} (${date} ${time})`,
        replyTo: email,
        text: [
          "New Booking (Pending Calendar)",
          `id: ${created?.id || bookingId}`,
          `name: ${name}`,
          `email: ${email}`,
          phone ? `phone: ${phone}` : null,
          `date: ${date}`,
          `time: ${time}`,
          `error: ${msg}`,
          ...storedLeadContext.internalSummaryLines,
          emailDetailsLine,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => null);
      if (emailResult && !emailResult.ok) {
        console.error(emailResult.error);
      }

      const customerEmailResult = await sendCustomerConfirmationEmail({
        name,
        email,
        date,
        time,
        details: customerVisibleDetails,
        pending: true,
        bookingId: String(created?.id || bookingId),
      }).catch(() => null);
      if (customerEmailResult && !customerEmailResult.ok) {
        console.error(customerEmailResult.error);
      }

      // Still treat as received so we don't drop the lead if Calendar is misconfigured.
      return redirectOrJson(
        request,
        { ok: true, id: created?.id || bookingId, pending: true },
        202,
        finderContext
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return redirectOrJson(request, { ok: false, error: msg }, 500, finderContext);
  }
}

function wantsHtml(request: Request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function redirectOrJson(
  request: Request,
  payload: Record<string, unknown>,
  status = 200,
  finderContext = null as ReturnType<typeof resolveServicesFinderLeadContextFromFormData> | null,
) {
  if (!wantsHtml(request)) {
    return NextResponse.json(payload, { status });
  }

  const url = new URL(request.url);
  if (payload.ok) {
    const id = typeof payload.id === "string" ? payload.id : "";
    const pending = payload.pending ? "&pending=1" : "";
    const target = new URL(
      `/book?submitted=1${id ? `&id=${encodeURIComponent(id)}` : ""}${pending}`,
      url
    );
    appendServicesFinderLeadContextToUrl(target, finderContext);
    return NextResponse.redirect(target, 303);
  }

  const target = new URL("/book?error=1", url);
  appendServicesFinderLeadContextToUrl(target, finderContext);
  return NextResponse.redirect(target, 303);
}

function getTodayYmd(timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // YYYY-MM-DD
}

function isInPast(date: string, time: string, timeZone: string) {
  // Lightweight check: reject dates strictly before "today" in the business timezone.
  const today = getTodayYmd(timeZone);
  if (date < today) return true;
  if (date > today) return false;

  // If same day, compare time against "now" in that timezone.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(new Date());
  const hh = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const mm = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  const nowMin = hh * 60 + mm;
  const startMin = minutesFromTime(time);
  return startMin < nowMin;
}
