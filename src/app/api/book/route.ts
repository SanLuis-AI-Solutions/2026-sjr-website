import { NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google-calendar";
import { supabaseInsert, supabaseUpdateById } from "@/lib/supabase/admin";
import { notifyGoogleChat } from "@/lib/notify";
import { sendLeadEmail } from "@/lib/lead-email";
import { normalizeTimeZone } from "@/lib/timezone";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const company = String(formData.get("company") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const time = String(formData.get("time") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (company) {
      return redirectOrJson(request, { ok: true });
    }

    if (!name || !email || !date || !time) {
      return redirectOrJson(request, { ok: false, error: "missing_fields" }, 400);
    }

    if (!isValidDateString(date) || !isValidTimeString(time)) {
      return redirectOrJson(request, { ok: false, error: "invalid_date_time" }, 400);
    }

    const tz = normalizeTimeZone(process.env.GOOGLE_CALENDAR_TIMEZONE);
    if (!isWithinBusinessHours(date, time, 30)) {
      return redirectOrJson(request, { ok: false, error: "outside_business_hours" }, 400);
    }

    if (isInPast(date, time, tz)) {
      return redirectOrJson(request, { ok: false, error: "in_past" }, 400);
    }

    const bookingId = crypto.randomUUID();
    const created = await supabaseInsert("booking_requests", {
      id: bookingId,
      name,
      email,
      phone: phone || null,
      date,
      time,
      details: details || null,
      status: "new",
      source: "website",
      page_url: request.headers.get("referer") || null,
      user_agent: request.headers.get("user-agent") || null,
      ip: (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null,
    });

    try {
      const event = await createBookingEvent({
        name,
        email,
        phone: phone || undefined,
        date,
        time,
        details: details || undefined,
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
          details ? `details: ${details.slice(0, 500)}` : null,
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
          details ? `details: ${details}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => null);
      if (emailResult && !emailResult.ok) {
        console.error(emailResult.error);
      }

      return redirectOrJson(request, { ok: true, id: created?.id || bookingId });
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
          details ? `details: ${details.slice(0, 500)}` : null,
        ].join("\n")
      , { timeoutMs: 1500, kind: "bookings" }).catch(() => null);
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
          details ? `details: ${details}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => null);
      if (emailResult && !emailResult.ok) {
        console.error(emailResult.error);
      }
      // Still treat as received so we don't drop the lead if Calendar is misconfigured.
      return redirectOrJson(
        request,
        { ok: true, id: created?.id || bookingId, pending: true },
        202
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return redirectOrJson(request, { ok: false, error: msg }, 500);
  }
}

function wantsHtml(request: Request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function redirectOrJson(
  request: Request,
  payload: Record<string, unknown>,
  status = 200
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
    return NextResponse.redirect(target, 303);
  }

  const target = new URL("/book?error=1", url);
  return NextResponse.redirect(target, 303);
}

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTimeString(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

function dayOfWeekFromDate(date: string) {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  // Use UTC to avoid server-timezone drift.
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun .. 6=Sat
}

function minutesFromTime(time: string) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  return hh * 60 + mm;
}

function isWithinBusinessHours(date: string, time: string, durationMinutes: number) {
  const dow = dayOfWeekFromDate(date);
  if (dow === 0) return false; // Sun closed

  const start = minutesFromTime(time);
  if (!Number.isFinite(start)) return false;
  if (start % 15 !== 0) return false;

  const open = 10 * 60;
  const close = dow === 6 ? 16 * 60 : 18 * 60; // Sat 10-4, weekdays 10-6
  return start >= open && start + durationMinutes <= close;
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
