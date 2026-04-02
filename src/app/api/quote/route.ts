import { NextResponse } from "next/server";
import { supabaseInsert, supabaseUploadObject } from "@/lib/supabase/admin";
import { notifyGoogleChat } from "@/lib/notify";
import { sendLeadEmail } from "@/lib/lead-email";
import { evaluateLeadSpam } from "@/lib/lead-spam";
import {
  appendServicesFinderLeadContextToUrl,
  prependServicesFinderLeadContext,
  resolveServicesFinderLeadContextFromFormData,
} from "@/lib/service-lead-context";

export async function POST(request: Request) {
  let finderContext: ReturnType<typeof resolveServicesFinderLeadContextFromFormData> | null = null;
  try {
    const formData = await request.formData();

    const company = String(formData.get("company") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const details = String(formData.get("details") || "").trim();
    finderContext = resolveServicesFinderLeadContextFromFormData(formData);
    const storedDetails = prependServicesFinderLeadContext(details, finderContext);

    // Honeypot: if filled, treat as spam and still return a success-style redirect.
    if (company) {
      return redirectOrJson(request, { ok: true }, 200, finderContext);
    }

    if (!name || !email || !details) {
      return redirectOrJson(request, { ok: false, error: "missing_fields" }, 400, finderContext);
    }

    const spamCheck = evaluateLeadSpam({
      leadType: "quote",
      name,
      email,
      phone,
      details: storedDetails,
    });

    const bucket = process.env.SUPABASE_QUOTES_BUCKET || "quote-uploads";
    const maxFiles = parseInt(process.env.SUPABASE_QUOTES_MAX_FILES || "4", 10);
    const maxBytes = parseInt(process.env.SUPABASE_QUOTES_MAX_FILE_BYTES || "8000000", 10);

    const isFile = (v: unknown): v is File =>
      typeof File !== "undefined" && v instanceof File;
    const files = formData.getAll("photos").filter(isFile);
    const limited = files.slice(0, Math.max(0, maxFiles));

    const requestId = crypto.randomUUID();
    const attachments = [];
    if (!spamCheck.isSpam) {
      const now = new Date();
      const prefix = `quotes/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(
        2,
        "0"
      )}/${requestId}`;

      for (const file of limited) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > maxBytes) continue;

        const safeName = (file.name || "photo")
          .replaceAll("\\", "-")
          .replaceAll("/", "-")
          .replaceAll("..", ".");
        const objectPath = `${prefix}/${safeName}`;
        const bytes = new Uint8Array(await file.arrayBuffer());

        const uploaded = await supabaseUploadObject({
          bucket,
          objectPath,
          bytes,
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

        attachments.push({
          bucket,
          path: objectPath,
          original_name: file.name || null,
          mime: file.type || null,
          size: file.size,
          object_url: uploaded.objectUrl,
          public_url: uploaded.publicUrl,
        });
      }
    }

    const inserted = await supabaseInsert("quote_requests", {
      id: requestId,
      name,
      email,
      phone: phone || null,
      details: storedDetails,
      attachments,
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
      return redirectOrJson(request, { ok: true, id: inserted?.id || requestId }, 200, finderContext);
    }

    // Best-effort notification; never block lead capture on messaging failures.
    await notifyGoogleChat(
      [
        "New Fast Quote",
        `id: ${inserted?.id || requestId}`,
        `name: ${name}`,
        `email: ${email}`,
        phone ? `phone: ${phone}` : null,
        `photos: ${attachments.length}`,
        `details: ${storedDetails.slice(0, 500)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      { timeoutMs: 1500, kind: "quotes" }
    ).catch(() => null);
    const emailResult = await sendLeadEmail({
      kind: "quotes",
      subject: `New Fast Quote - ${name}`,
      replyTo: email,
      text: [
        "New Fast Quote",
        `id: ${inserted?.id || requestId}`,
        `name: ${name}`,
        `email: ${email}`,
        phone ? `phone: ${phone}` : null,
        `photos: ${attachments.length}`,
        `details: ${storedDetails}`,
      ]
        .filter(Boolean)
        .join("\n"),
    }).catch(() => null);
    if (emailResult && !emailResult.ok) {
      console.error(emailResult.error);
    }

    return redirectOrJson(request, { ok: true, id: inserted?.id || requestId }, 200, finderContext);
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
    const target = new URL(
      `/quote?submitted=1${id ? `&id=${encodeURIComponent(id)}` : ""}`,
      url,
    );
    appendServicesFinderLeadContextToUrl(target, finderContext);
    return NextResponse.redirect(target, 303);
  }

  const target = new URL("/quote?error=1", url);
  appendServicesFinderLeadContextToUrl(target, finderContext);
  return NextResponse.redirect(target, 303);
}
