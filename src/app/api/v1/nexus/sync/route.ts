import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";
import {
  isSocialPlatform,
  SocialDispatcher,
  SocialPlatform,
} from "@/lib/automation/social-dispatcher";
import { supabaseUpsert } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SyncRequestBody = {
  slug?: unknown;
  platforms?: unknown;
  dryRun?: unknown;
};

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  if (!header.toLowerCase().startsWith("bearer ")) return "";
  return header.slice("bearer ".length).trim();
}

function parsePlatforms(value: unknown): SocialPlatform[] | null | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return null;

  const parsed = value
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter((item) => item.length > 0);

  if (!parsed.every(isSocialPlatform)) return null;
  return [...new Set(parsed)];
}

function json(payload: Record<string, unknown>, status = 200) {
  return NextResponse.json(payload, { status });
}

async function persistDispatchResults(
  slug: string,
  results: Awaited<ReturnType<SocialDispatcher["dispatch"]>>["results"]
) {
  await Promise.all(
    results.map((result) =>
      supabaseUpsert(
        "shared_slugs",
        {
          slug,
          platform: result.platform,
          status:
            result.status === "sent"
              ? "shared"
              : result.status === "failed"
                ? "failed"
                : "skipped",
          shared_at: new Date().toISOString(),
          external_post_id: result.externalId || null,
          external_post_url: result.externalUrl || null,
          error: result.reason || null,
          payload: result.payload || {},
        },
        "slug,platform"
      )
    )
  );
}

export async function GET() {
  return json({ ok: true, service: "nexus-sync", route: "/api/v1/nexus/sync" });
}

export async function POST(request: Request) {
  try {
    const configuredApiKey = (process.env.NEXUS_SYNC_API_KEY || "").trim();
    if (configuredApiKey) {
      const requestApiKey =
        request.headers.get("x-api-key")?.trim() || getBearerToken(request);
      if (requestApiKey !== configuredApiKey) {
        return json({ ok: false, error: "unauthorized" }, 401);
      }
    }

    const body = (await request.json().catch(() => null)) as SyncRequestBody | null;
    if (!body) return json({ ok: false, error: "invalid_json" }, 400);

    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!slug) return json({ ok: false, error: "missing_slug" }, 400);

    const post = getBlogPostBySlug(slug);
    if (!post) return json({ ok: false, error: "unknown_slug" }, 404);

    const parsedPlatforms = parsePlatforms(body.platforms);
    if (parsedPlatforms === null) {
      return json(
        { ok: false, error: "invalid_platforms", supported: ["gbp", "meta", "pinterest", "linkedin", "x"] },
        400
      );
    }

    const dryRun = typeof body.dryRun === "boolean" ? body.dryRun : false;

    const dispatcher = new SocialDispatcher();
    const dispatch = await dispatcher.dispatch({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      canonicalUrl: `${getSiteUrl()}/blog/${post.slug}`,
      imageUrl: post.image,
      platforms: parsedPlatforms,
      dryRun,
    });

    if (!dryRun) {
      await persistDispatchResults(post.slug, dispatch.results);
    }

    return json({ ok: true, dispatch });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return json({ ok: false, error: message }, 500);
  }
}
