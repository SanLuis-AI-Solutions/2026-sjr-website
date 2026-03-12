import { NextRequest, NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin/auth";
import { saveApprovedPublishingPreview } from "@/lib/admin/nexus-publishing";

export const dynamic = "force-dynamic";

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminIdentity();
  if (!admin) return json({ ok: false, error: "unauthorized" }, 401);

  const body = (await request.json().catch(() => null)) as
    | { slug?: unknown; platform?: unknown }
    | null;

  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const platform = typeof body?.platform === "string" ? body.platform.trim().toLowerCase() : "gbp";

  if (!slug) return json({ ok: false, error: "missing_slug" }, 400);
  if (platform !== "gbp") return json({ ok: false, error: "unsupported_platform" }, 400);

  const saved = await saveApprovedPublishingPreview({
    slug,
    platform: "gbp",
    approvedBy: admin.email,
  });

  if (!saved) return json({ ok: false, error: "unknown_slug" }, 404);

  return json({
    ok: true,
    preview: saved.preview,
    approval: saved.queueRow,
  });
}
