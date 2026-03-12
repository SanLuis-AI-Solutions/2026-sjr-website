import { NextRequest, NextResponse } from "next/server";
import { getPublishingPreview } from "@/lib/admin/nexus-publishing";
import { getAdminIdentity } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function GET(request: NextRequest) {
  const admin = await getAdminIdentity();
  if (!admin) return json({ ok: false, error: "unauthorized" }, 401);

  const slug = (request.nextUrl.searchParams.get("slug") || "").trim();
  const platform = request.nextUrl.searchParams.get("platform") || "gbp";

  if (!slug) return json({ ok: false, error: "missing_slug" }, 400);
  if (platform !== "gbp") return json({ ok: false, error: "unsupported_platform" }, 400);

  const preview = await getPublishingPreview(slug, "gbp");
  if (!preview) return json({ ok: false, error: "unknown_slug" }, 404);

  return json({
    ok: true,
    preview,
    admin: {
      email: admin.email,
    },
  });
}
