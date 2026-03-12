import { NextRequest, NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin/auth";
import { publishApprovedPublishingPreview } from "@/lib/admin/nexus-publishing";

export const dynamic = "force-dynamic";

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminIdentity();
  if (!admin) return json({ ok: false, error: "unauthorized" }, 401);

  const body = (await request.json().catch(() => null)) as
    | { slug?: unknown; platform?: unknown; publishWithoutApproval?: unknown }
    | null;

  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const platform = typeof body?.platform === "string" ? body.platform.trim().toLowerCase() : "gbp";
  const publishWithoutApproval = body?.publishWithoutApproval === true;

  if (!slug) return json({ ok: false, error: "missing_slug" }, 400);
  if (platform !== "gbp") return json({ ok: false, error: "unsupported_platform" }, 400);

  const published = await publishApprovedPublishingPreview({
    slug,
    platform: "gbp",
    publishWithoutApproval,
  });

  if (published.ok) {
    return json({
      ok: true,
      code: published.code,
      preview: published.preview,
      result: published.result,
    });
  }

  const status =
    published.code === "unknown_slug"
      ? 404
      : published.code === "approval_required" || published.code === "missing_connection"
        ? 409
        : published.code === "stale_approval"
          ? 409
          : 502;

  return json(
    {
      ok: false,
      code: published.code,
      preview: published.preview,
      result: published.result,
    },
    status
  );
}
