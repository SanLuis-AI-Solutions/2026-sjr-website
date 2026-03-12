import { createHash } from "node:crypto";
import { getBlogPostBySlug } from "@/lib/blog";
import {
  buildGoogleBusinessPreview,
  getGoogleBusinessConnectionStatus,
  publishGoogleBusinessPost,
  type GoogleBusinessPreviewPayload,
} from "@/lib/automation/google-business-profile";
import { type SocialDispatchResult, type SocialPlatform } from "@/lib/automation/social-dispatcher";
import { supabaseUpsert } from "@/lib/supabase/admin";
import { supabaseGet } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export type PublishingQueueStatus = "draft" | "approved" | "published" | "failed";

export type PublishingQueueRow = {
  id: string;
  slug: string;
  platform: SocialPlatform;
  status: PublishingQueueStatus;
  preview_payload: GoogleBusinessPreviewPayload;
  preview_hash: string;
  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  last_result: Record<string, unknown> | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type PublishingApprovalState = {
  status: PublishingQueueStatus;
  approvedAt: string | null;
  approvedBy: string | null;
  publishedAt: string | null;
  lastError: string | null;
};

export type PublishingPreview = {
  slug: string;
  title: string;
  image: string | null;
  canonicalUrl: string;
  platform: "gbp";
  connectionLabel: string | null;
  connectionActive: boolean;
  payload: GoogleBusinessPreviewPayload;
  payloadHash: string;
  approval: PublishingApprovalState;
};

export type PublishNowResult =
  | {
      ok: true;
      code: "published";
      preview: PublishingPreview;
      result: SocialDispatchResult;
    }
  | {
      ok: false;
      code: "unknown_slug" | "approval_required" | "stale_approval" | "missing_connection" | "publish_failed";
      preview: PublishingPreview | null;
      result?: SocialDispatchResult;
    };

type SaveApprovalInput = {
  slug: string;
  platform: "gbp";
  approvedBy: string;
};

type ClearApprovalInput = {
  slug: string;
  platform: "gbp";
};

type PublishNowInput = {
  slug: string;
  platform: "gbp";
  publishWithoutApproval?: boolean;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function encodeFilterValue(value: string) {
  return encodeURIComponent(value);
}

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return `{${entries
    .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
    .join(",")}}`;
}

export function createPreviewHash(value: unknown) {
  return createHash("sha256").update(stableSerialize(value)).digest("hex");
}

function createDraftApprovalState(lastError: string | null = null): PublishingApprovalState {
  return {
    status: "draft",
    approvedAt: null,
    approvedBy: null,
    publishedAt: null,
    lastError,
  };
}

function mapQueueRowToApproval(row: PublishingQueueRow | null): PublishingApprovalState {
  if (!row) return createDraftApprovalState();

  return {
    status: row.status,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    publishedAt: row.published_at,
    lastError: row.last_error,
  };
}

function normalizeQueuePayload(
  payload: GoogleBusinessPreviewPayload,
  status: PublishingQueueStatus
) {
  return {
    platform: "gbp",
    status,
    preview_payload: payload,
    preview_hash: createPreviewHash(payload),
  };
}

export async function getPublishQueueRows(): Promise<PublishingQueueRow[]> {
  try {
    const rows = await supabaseGet(
      "nexus_publish_queue",
      "?select=id,slug,platform,status,preview_payload,preview_hash,approved_by,approved_at,published_at,last_result,last_error,created_at,updated_at&order=updated_at.desc"
    );
    return asArray<PublishingQueueRow>(rows);
  } catch {
    return [];
  }
}

export async function getPublishQueueRow(
  slug: string,
  platform: "gbp"
): Promise<PublishingQueueRow | null> {
  try {
    const rows = await supabaseGet(
      "nexus_publish_queue",
      `?select=id,slug,platform,status,preview_payload,preview_hash,approved_by,approved_at,published_at,last_result,last_error,created_at,updated_at&slug=eq.${encodeFilterValue(slug)}&platform=eq.${encodeFilterValue(platform)}&limit=1`
    );
    return asArray<PublishingQueueRow>(rows)[0] || null;
  } catch {
    return null;
  }
}

export async function getPublishingPreview(
  slug: string,
  platform: "gbp" = "gbp"
): Promise<PublishingPreview | null> {
  const post = getBlogPostBySlug(slug);
  if (!post || platform !== "gbp") return null;

  const canonicalUrl = `${getSiteUrl()}/blog/${post.slug}`;
  const payload = buildGoogleBusinessPreview({
    title: post.title,
    excerpt: post.excerpt,
    canonicalUrl,
    imageUrl: post.image,
  });

  const [queueRow, connection] = await Promise.all([
    getPublishQueueRow(slug, platform),
    getGoogleBusinessConnectionStatus(),
  ]);

  return {
    slug: post.slug,
    title: post.title,
    image: post.image || null,
    canonicalUrl,
    platform,
    connectionLabel: connection.label,
    connectionActive: connection.active,
    payload,
    payloadHash: createPreviewHash(payload),
    approval: mapQueueRowToApproval(queueRow),
  };
}

export async function persistDispatchResults(
  slug: string,
  results: SocialDispatchResult[]
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

export async function saveApprovedPublishingPreview(input: SaveApprovalInput) {
  const preview = await getPublishingPreview(input.slug, input.platform);
  if (!preview) return null;

  const queueRow = await supabaseUpsert(
    "nexus_publish_queue",
    {
      slug: preview.slug,
      ...normalizeQueuePayload(preview.payload, "approved"),
      approved_by: input.approvedBy,
      approved_at: new Date().toISOString(),
      published_at: null,
      last_result: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    },
    "slug,platform"
  );

  return {
    preview,
    queueRow: queueRow as PublishingQueueRow,
  };
}

export async function clearPublishingApproval(input: ClearApprovalInput) {
  const preview = await getPublishingPreview(input.slug, input.platform);
  if (!preview) return null;

  const queueRow = await supabaseUpsert(
    "nexus_publish_queue",
    {
      slug: preview.slug,
      ...normalizeQueuePayload(preview.payload, "draft"),
      approved_by: null,
      approved_at: null,
      published_at: null,
      last_result: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    },
    "slug,platform"
  );

  return {
    preview,
    queueRow: queueRow as PublishingQueueRow,
  };
}

export async function publishApprovedPublishingPreview(
  input: PublishNowInput
): Promise<PublishNowResult> {
  const preview = await getPublishingPreview(input.slug, input.platform);
  if (!preview) {
    return { ok: false, code: "unknown_slug", preview: null };
  }

  const queueRow = await getPublishQueueRow(input.slug, input.platform);
  if (!queueRow && !input.publishWithoutApproval) {
    return { ok: false, code: "approval_required", preview };
  }

  if (queueRow && queueRow.preview_hash !== preview.payloadHash) {
    await supabaseUpsert(
      "nexus_publish_queue",
      {
        slug: preview.slug,
        ...normalizeQueuePayload(preview.payload, "draft"),
        approved_by: null,
        approved_at: null,
        published_at: queueRow.published_at,
        last_result: queueRow.last_result,
        last_error: "Content changed since approval. Review and approve again.",
        updated_at: new Date().toISOString(),
      },
      "slug,platform"
    );

    return { ok: false, code: "stale_approval", preview };
  }

  if (!preview.connectionActive) {
    return { ok: false, code: "missing_connection", preview };
  }

  const post = getBlogPostBySlug(preview.slug);
  if (!post) {
    return { ok: false, code: "unknown_slug", preview: null };
  }

  const result = await publishGoogleBusinessPost({
    title: post.title,
    excerpt: post.excerpt,
    canonicalUrl: preview.canonicalUrl,
    imageUrl: post.image,
  });

  if (result.status === "sent") {
    await persistDispatchResults(preview.slug, [result]);
    await supabaseUpsert(
      "nexus_publish_queue",
      {
        slug: preview.slug,
        ...normalizeQueuePayload(preview.payload, "published"),
        approved_by: queueRow?.approved_by || null,
        approved_at: queueRow?.approved_at || null,
        published_at: new Date().toISOString(),
        last_result: result.payload || {},
        last_error: null,
        updated_at: new Date().toISOString(),
      },
      "slug,platform"
    );

    return { ok: true, code: "published", preview, result };
  }

  await supabaseUpsert(
    "nexus_publish_queue",
    {
      slug: preview.slug,
      ...normalizeQueuePayload(preview.payload, "failed"),
      approved_by: queueRow?.approved_by || null,
      approved_at: queueRow?.approved_at || null,
      published_at: queueRow?.published_at || null,
      last_result: result.payload || {},
      last_error: result.reason || "publish_failed",
      updated_at: new Date().toISOString(),
    },
    "slug,platform"
  );

  return { ok: false, code: "publish_failed", preview, result };
}
