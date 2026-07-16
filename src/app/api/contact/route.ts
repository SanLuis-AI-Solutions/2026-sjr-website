import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase/admin";
import { notifyGoogleChat } from "@/lib/notify";
import { sendLeadEmail } from "@/lib/lead-email";
import { evaluateLeadSpam } from "@/lib/lead-spam";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const company = String(formData.get("company") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const preferredContact = String(formData.get("preferredContact") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // Honeypot: if filled, treat as spam and still return a success-style redirect.
    if (company) {
      return redirectOrJson(request, { ok: true });
    }

    if (!name || !email || !message) {
      return redirectOrJson(request, { ok: false, error: "missing_fields" }, 400);
    }

    const spamCheck = evaluateLeadSpam({
      leadType: "contact",
      name,
      email,
      phone,
      message,
    });

    const contactId = crypto.randomUUID();
    const created = await supabaseInsert("contact_requests", {
      id: contactId,
      name,
      email,
      phone: phone || null,
      preferred_contact: preferredContact || null,
      message,
      status: spamCheck.isSpam ? "spam" : "new",
      source: spamCheck.isSpam ? `website_spam_suspected:${spamCheck.reason}` : "website",
      page_url: request.headers.get("referer") || null,
      user_agent: request.headers.get("user-agent") || null,
      ip: (request.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || null,
    });

    if (spamCheck.isSpam) {
      return redirectOrJson(request, { ok: true, id: created?.id || contactId });
    }

    // Best-effort notification; never block lead capture on messaging failures.
    await notifyGoogleChat(
      [
        "New Contact Message",
        `id: ${created?.id || contactId}`,
        `name: ${name}`,
        `email: ${email}`,
        phone ? `phone: ${phone}` : null,
        preferredContact ? `preferred_contact: ${preferredContact}` : null,
        `message: ${message.slice(0, 500)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      { timeoutMs: 1500, kind: "contacts" }
    ).catch(() => null);
    const emailResult = await sendLeadEmail({
      kind: "contacts",
      subject: `New Contact Message - ${name}`,
      replyTo: email,
      text: [
        "New Contact Message",
        `id: ${created?.id || contactId}`,
        `name: ${name}`,
        `email: ${email}`,
        phone ? `phone: ${phone}` : null,
        preferredContact ? `preferred_contact: ${preferredContact}` : null,
        `message: ${message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    }).catch(() => null);
    if (emailResult && !emailResult.ok) {
      console.error(emailResult.error);
    }

    return redirectOrJson(request, { ok: true, id: created?.id || contactId });
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
    const target = new URL(
      `/contact?submitted=1${id ? `&id=${encodeURIComponent(id)}` : ""}`,
      url
    );
    return NextResponse.redirect(target, 303);
  }

  const target = new URL("/contact?error=1", url);
  return NextResponse.redirect(target, 303);
}
