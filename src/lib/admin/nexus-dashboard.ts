import { BLOG_POSTS } from "@/lib/blog";
import {
  buildContentSummary,
  getContentQueueRows,
  getContentResearchRows,
  type ContentQueueRow,
  type ContentResearchRow,
  type ContentSummary,
} from "@/lib/admin/nexus-content-ops";
import {
  SUPPORTED_SOCIAL_PLATFORMS,
  type SocialPlatform,
} from "@/lib/automation/social-dispatcher";
import {
  getPublishQueueRows,
  type PublishingQueueRow,
  type PublishingQueueStatus,
} from "@/lib/admin/nexus-publishing";
import {
  getNexusConfigs,
  type NexusConfigRow,
} from "@/lib/automation/nexus-config";
import { supabaseGet } from "@/lib/supabase/server";

export type SharedSlugRow = {
  slug: string;
  platform: SocialPlatform;
  status: string;
  shared_at: string;
};

export type ReviewStatusRow = {
  id: string;
  customer_key: string;
  channel: string;
  status: string;
  last_sent_at: string | null;
  created_at: string;
};

export type QuoteAttachment = {
  bucket?: string;
  path?: string;
  original_name?: string | null;
  mime?: string | null;
  size?: number | null;
};

export type QuoteRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  details: string;
  attachments: QuoteAttachment[] | null;
  status: string;
};

export type BookingRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  details: string | null;
  status: string;
  calendar_event: { id?: string; htmlLink?: string } | null;
  error: string | null;
};

export type ContactRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_contact: string | null;
  message: string;
  status: string;
};

export const QUOTE_STATUSES = ["new", "contacted", "closed", "spam"] as const;
export const BOOKING_STATUSES = [
  "new",
  "booked",
  "pending",
  "contacted",
  "closed",
  "canceled",
  "spam",
] as const;
export const CONTACT_STATUSES = ["new", "contacted", "closed", "spam"] as const;

export type ApiHealthSummary = {
  platform: SocialPlatform;
  label: string;
  envKey: string;
  active: boolean;
  source: "oauth" | "env" | "missing";
  detail: string;
};

export type SyncMatrixRow = {
  slug: string;
  title: string;
  publishedAt: string;
  image: string;
  statuses: Record<SocialPlatform, "live" | "pending" | "failed" | "skipped">;
  approvalStatus: PublishingQueueStatus;
  approvedAt: string | null;
  approvedBy: string | null;
  approvalError: string | null;
  lastSharedAt: string | null;
};

export type SyncSummary = {
  totalShares: number;
  livePosts: number;
  liveCoverage: number;
  connectedPlatforms: number;
  missingPlatforms: number;
};

export type ReviewSummary = {
  queuedCount: number;
  activeCount: number;
  reviewedCount: number;
  recent: ReviewStatusRow[];
};

export type InboxBucketSummary = {
  total: number;
  newCount: number;
  spamCount: number;
};

export type InboxSummary = {
  totalLeads: number;
  newCount: number;
  spamCount: number;
  quotes: InboxBucketSummary;
  bookings: InboxBucketSummary;
  contacts: InboxBucketSummary;
};

export type NexusDashboardData = {
  apiHealth: ApiHealthSummary[];
  contentSummary: ContentSummary;
  syncSummary: SyncSummary;
  reviewSummary: ReviewSummary;
  inboxSummary: InboxSummary;
  contentQueueRows: ContentQueueRow[];
  contentResearchRows: ContentResearchRow[];
  syncRows: SyncMatrixRow[];
  recentReviews: ReviewStatusRow[];
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  gbp: "Google",
  meta: "Meta",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  x: "X",
};

const PLATFORM_TOKEN_ENV: Record<SocialPlatform, string> = {
  gbp: "NEXUS_GBP_ACCESS_TOKEN",
  meta: "NEXUS_META_ACCESS_TOKEN",
  pinterest: "NEXUS_PINTEREST_ACCESS_TOKEN",
  linkedin: "NEXUS_LINKEDIN_ACCESS_TOKEN",
  x: "NEXUS_X_ACCESS_TOKEN",
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function countByStatus(rows: { status: string }[]) {
  return rows.reduce(
    (summary, row) => {
      if (row.status === "new" || row.status === "queued") summary.newCount += 1;
      if (row.status === "spam") summary.spamCount += 1;
      summary.total += 1;
      return summary;
    },
    { total: 0, newCount: 0, spamCount: 0 }
  );
}

function buildApiHealth(configRows: NexusConfigRow[]): ApiHealthSummary[] {
  const configMap = new Map(configRows.map((row) => [row.platform, row]));

  return SUPPORTED_SOCIAL_PLATFORMS.map((platform) => {
    const envKey = PLATFORM_TOKEN_ENV[platform];
    const envValue = (process.env[envKey] || "").trim();
    const config = configMap.get(platform);
    const configDetail =
      platform === "gbp" && config?.payload
        ? typeof config.payload.locationTitle === "string"
          ? config.payload.locationTitle
          : typeof config.payload.locationResourceName === "string"
            ? config.payload.locationResourceName
            : "Connected in Nexus"
        : "Connected in Nexus";
    const active = Boolean(envValue) || Boolean(config?.access_token) || Boolean(config?.refresh_token);

    return {
      platform,
      label: PLATFORM_LABELS[platform],
      envKey,
      active,
      source: config?.refresh_token || config?.access_token ? "oauth" : envValue ? "env" : "missing",
      detail: config?.refresh_token || config?.access_token ? configDetail : envValue ? envKey : envKey,
    };
  });
}

function buildSyncRows(
  sharedRows: SharedSlugRow[],
  queueRows: PublishingQueueRow[]
): SyncMatrixRow[] {
  const grouped = sharedRows.reduce<Map<string, SharedSlugRow[]>>((map, row) => {
    const current = map.get(row.slug) || [];
    current.push(row);
    map.set(row.slug, current);
    return map;
  }, new Map());
  const queueMap = new Map(queueRows.map((row) => [`${row.slug}:${row.platform}`, row]));

  return BLOG_POSTS.map((post) => {
    const postRows = grouped.get(post.slug) || [];
    const approvalRow = queueMap.get(`${post.slug}:gbp`) || null;
    const statuses = Object.fromEntries(
      SUPPORTED_SOCIAL_PLATFORMS.map((platform) => {
        const latest = postRows
          .filter((row) => row.platform === platform)
          .sort((a, b) => Date.parse(b.shared_at) - Date.parse(a.shared_at))[0];

        if (!latest) return [platform, "pending"];
        if (latest.status === "shared") return [platform, "live"];
        if (latest.status === "failed") return [platform, "failed"];
        if (latest.status === "skipped") return [platform, "skipped"];
        return [platform, "pending"];
      })
    ) as Record<SocialPlatform, "live" | "pending" | "failed" | "skipped">;

    const lastSharedAt = postRows
      .map((row) => row.shared_at)
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0] || null;

    return {
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
      image: post.image,
      statuses,
      approvalStatus: approvalRow?.status || "draft",
      approvedAt: approvalRow?.approved_at || null,
      approvedBy: approvalRow?.approved_by || null,
      approvalError: approvalRow?.last_error || null,
      lastSharedAt,
    };
  });
}

function buildSyncSummary(rows: SyncMatrixRow[], apiHealth: ApiHealthSummary[]): SyncSummary {
  const totalShares = rows.reduce(
    (total, row) =>
      total +
      Object.values(row.statuses).filter((status) => status === "live").length,
    0
  );
  const livePosts = rows.filter((row) =>
    Object.values(row.statuses).some((status) => status === "live")
  ).length;

  return {
    totalShares,
    livePosts,
    liveCoverage: rows.length > 0 ? Math.round((livePosts / rows.length) * 100) : 0,
    connectedPlatforms: apiHealth.filter((platform) => platform.active).length,
    missingPlatforms: apiHealth.filter((platform) => !platform.active).length,
  };
}

function buildReviewSummary(rows: ReviewStatusRow[]): ReviewSummary {
  const activeCount = rows.filter((row) =>
    ["queued", "sent", "delivered", "reminder_sent"].includes(row.status)
  ).length;

  return {
    queuedCount: rows.filter((row) => row.status === "queued").length,
    activeCount,
    reviewedCount: rows.filter((row) => row.status === "reviewed").length,
    recent: rows.slice(0, 8),
  };
}

function buildInboxSummary(
  quotes: QuoteRequestRow[],
  bookings: BookingRequestRow[],
  contacts: ContactRequestRow[]
): InboxSummary {
  const quoteSummary = countByStatus(quotes);
  const bookingSummary = countByStatus(bookings);
  const contactSummary = countByStatus(contacts);

  return {
    totalLeads: quoteSummary.total + bookingSummary.total + contactSummary.total,
    newCount: quoteSummary.newCount + bookingSummary.newCount + contactSummary.newCount,
    spamCount: quoteSummary.spamCount + bookingSummary.spamCount + contactSummary.spamCount,
    quotes: quoteSummary,
    bookings: bookingSummary,
    contacts: contactSummary,
  };
}

export async function getSharedSlugs(): Promise<SharedSlugRow[]> {
  try {
    const rows = await supabaseGet(
      "shared_slugs",
      "?select=slug,platform,status,shared_at&order=shared_at.desc"
    );
    return asArray<SharedSlugRow>(rows);
  } catch {
    return [];
  }
}

export async function getReviewStatuses(limit = 24): Promise<ReviewStatusRow[]> {
  try {
    const rows = await supabaseGet(
      "review_request_status",
      `?select=id,customer_key,channel,status,last_sent_at,created_at&order=created_at.desc&limit=${limit}`
    );
    return asArray<ReviewStatusRow>(rows);
  } catch {
    return [];
  }
}

export async function getRecentQuotes(limit = 50): Promise<QuoteRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "quote_requests",
      `?select=id,created_at,name,email,phone,details,attachments,status&order=created_at.desc&limit=${limit}`
    );
    return asArray<QuoteRequestRow>(rows);
  } catch {
    return [];
  }
}

export async function getRecentBookings(limit = 50): Promise<BookingRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "booking_requests",
      `?select=id,created_at,name,email,phone,date,time,details,status,calendar_event,error&order=created_at.desc&limit=${limit}`
    );
    return asArray<BookingRequestRow>(rows);
  } catch {
    return [];
  }
}

export async function getRecentContacts(limit = 50): Promise<ContactRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "contact_requests",
      `?select=id,created_at,name,email,phone,preferred_contact,message,status&order=created_at.desc&limit=${limit}`
    );
    return asArray<ContactRequestRow>(rows);
  } catch {
    return [];
  }
}

export async function getNexusDashboardData(): Promise<NexusDashboardData> {
  const [
    sharedRows,
    reviewRows,
    quotes,
    bookings,
    contacts,
    configRows,
    queueRows,
    contentResearchRows,
    contentQueueRows,
  ] = await Promise.all([
    getSharedSlugs(),
    getReviewStatuses(),
    getRecentQuotes(200),
    getRecentBookings(200),
    getRecentContacts(200),
    getNexusConfigs(),
    getPublishQueueRows(),
    getContentResearchRows(),
    getContentQueueRows(),
  ]);

  const apiHealth = buildApiHealth(configRows);
  const syncRows = buildSyncRows(sharedRows, queueRows);

  return {
    apiHealth,
    contentSummary: buildContentSummary(contentResearchRows, contentQueueRows),
    syncSummary: buildSyncSummary(syncRows, apiHealth),
    reviewSummary: buildReviewSummary(reviewRows),
    inboxSummary: buildInboxSummary(quotes, bookings, contacts),
    contentQueueRows,
    contentResearchRows,
    syncRows,
    recentReviews: reviewRows.slice(0, 12),
  };
}
