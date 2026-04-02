import fs from "node:fs";
import path from "node:path";
import { BLOG_POSTS } from "@/lib/blog";
import {
  BOOKING_STATUSES,
  CONTACT_STATUSES,
  QUOTE_STATUSES,
  type BookingRequestRow,
  type ContactRequestRow,
  type QuoteAttachment,
  type QuoteRequestRow,
  getRecentBookings,
  getRecentContacts,
  getRecentQuotes,
} from "@/lib/admin/inbox-queries";
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
import { resolveStoredServicesFinderLeadContext } from "@/lib/service-lead-context";
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

export type ApiHealthSummary = {
  platform: SocialPlatform;
  label: string;
  envKey: string;
  active: boolean;
  source: "oauth" | "env" | "missing";
  detail: string;
};

export type StackHealthStatus = "live" | "attention" | "planned";

export type StackHealthItem = {
  key: "upload-post" | "n8n" | "notebooklm" | "health";
  label: string;
  status: StackHealthStatus;
  detail: string;
  meta: string;
  nextStep: string;
};

export type StackSummary = {
  liveCount: number;
  attentionCount: number;
  plannedCount: number;
  healthFreshnessLabel: string;
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

export type FinderLeadSummaryChip = {
  label: string;
  count: number;
};

export type FinderLeadSummary = {
  total: number;
  quoteCount: number;
  bookingCount: number;
  newCount: number;
  spamCount: number;
  topServices: FinderLeadSummaryChip[];
  topIntents: FinderLeadSummaryChip[];
};

export type InboxSummary = {
  totalLeads: number;
  newCount: number;
  spamCount: number;
  quotes: InboxBucketSummary;
  bookings: InboxBucketSummary;
  contacts: InboxBucketSummary;
  finder: FinderLeadSummary;
};

export type ResultsSummary = {
  trackedContentCount: number;
  publishedContentCount: number;
  weeklySearchClicks: number;
  weeklyOrganicSessions: number;
  weeklyLeadStarts: number;
  weeklyLeadOutcomes: number;
};

export type ContentResultsRow = {
  slug: string;
  title: string;
  publishedAt: string;
  serviceLabel: string;
  publishedPlatforms: SocialPlatform[];
  approvalStatus: ContentQueueRow["status"] | PublishingQueueStatus | "untracked";
  weeklyOrganicSessions: number;
  ninetyDayOrganicSessions: number;
  ninetyDaySearchClicks: number;
  recommendation: string;
};

export type NexusDashboardData = {
  apiHealth: ApiHealthSummary[];
  stackHealth: StackHealthItem[];
  stackSummary: StackSummary;
  contentSummary: ContentSummary;
  resultsSummary: ResultsSummary;
  syncSummary: SyncSummary;
  reviewSummary: ReviewSummary;
  inboxSummary: InboxSummary;
  resultsRows: ContentResultsRow[];
  contentQueueRows: ContentQueueRow[];
  contentResearchRows: ContentResearchRow[];
  syncRows: SyncMatrixRow[];
  recentReviews: ReviewStatusRow[];
};

type WeeklyHealthSnapshot = {
  generatedAt?: string;
  searchConsole?: {
    clicks?: number;
  };
  ga4?: {
    organicSessions?: number;
    keyEvents?: Record<string, number>;
    topLandingPages?: Array<{
      page?: string;
      sessions?: number;
    }>;
  };
};

type ReconcileSnapshot = {
  generatedAt?: string;
  ga4?: {
    topOrganicLandingPages?: Array<{
      page?: string;
      sessions?: number;
    }>;
  };
  searchConsole?: {
    topPages?: Array<{
      page?: string;
      clicks?: number;
    }>;
  };
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

type SnapshotMeta = {
  exists: boolean;
  generatedAt: Date | null;
  ageDays: number | null;
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

function incrementCount(map: Map<string, number>, label: string | null) {
  if (!label) return;
  map.set(label, (map.get(label) || 0) + 1);
}

function mapTopCounts(map: Map<string, number>, limit = 3): FinderLeadSummaryChip[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
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

function readJsonSnapshot<T>(fileName: string): T | null {
  try {
    const target = path.join(process.cwd(), ".health", fileName);
    if (!fs.existsSync(target)) return null;
    return JSON.parse(fs.readFileSync(target, "utf8")) as T;
  } catch {
    return null;
  }
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function readSnapshotMeta(fileName: string, generatedAt?: string | null): SnapshotMeta {
  try {
    const target = path.join(process.cwd(), ".health", fileName);
    if (!fs.existsSync(target)) {
      return {
        exists: false,
        generatedAt: null,
        ageDays: null,
      };
    }

    const stats = fs.statSync(target);
    const generated = parseDate(generatedAt) || stats.mtime;
    const ageDays = Math.max(
      0,
      Math.floor((Date.now() - generated.getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
      exists: true,
      generatedAt: generated,
      ageDays,
    };
  } catch {
    return {
      exists: false,
      generatedAt: null,
      ageDays: null,
    };
  }
}

function formatSnapshotDate(value: Date | null) {
  if (!value) return "Unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatAgeLabel(ageDays: number | null) {
  if (ageDays === null) return "No snapshot";
  if (ageDays === 0) return "Updated today";
  if (ageDays === 1) return "1 day old";
  return `${ageDays} days old`;
}

function buildStackHealth(
  contentResearchRows: ContentResearchRow[],
  contentQueueRows: ContentQueueRow[],
  weeklySnapshot: WeeklyHealthSnapshot | null,
  reconcileSnapshot: ReconcileSnapshot | null
) {
  const notebookResearchCount = contentResearchRows.filter(
    (row) => row.source_type === "notebooklm"
  ).length;
  const briefReadyCount = contentQueueRows.filter((row) => row.status === "brief_ready").length;
  const weeklyMeta = readSnapshotMeta(
    "weekly-seo-health-latest.json",
    weeklySnapshot?.generatedAt
  );
  const reconcileMeta = readSnapshotMeta(
    "ga4-gsc-reconciliation-90d-latest.json",
    reconcileSnapshot?.generatedAt
  );
  const healthAgeValues = [weeklyMeta.ageDays, reconcileMeta.ageDays].filter(
    (value): value is number => value !== null
  );
  const maxHealthAge = healthAgeValues.length ? Math.max(...healthAgeValues) : null;
  const healthFreshnessLabel = formatAgeLabel(maxHealthAge);
  const weeklyLabel = `${formatSnapshotDate(weeklyMeta.generatedAt)} (${formatAgeLabel(weeklyMeta.ageDays)})`;
  const reconcileLabel = `${formatSnapshotDate(reconcileMeta.generatedAt)} (${formatAgeLabel(
    reconcileMeta.ageDays
  )})`;

  const items: StackHealthItem[] = [
    {
      key: "upload-post",
      label: "Upload-Post",
      status: "planned",
      detail:
        "Chosen publishing execution layer for SJR social distribution. No live account connection is stored in Nexus yet.",
      meta: "Publisher pilot pending",
      nextStep: "Create the account and validate one low-risk post through the Upload-Post path.",
    },
    {
      key: "n8n",
      label: "n8n",
      status: "planned",
      detail:
        "Reserved as the orchestration layer between Nexus and Upload-Post. This repo does not yet store instance credentials or workflow health.",
      meta: "Workflow handoff pending",
      nextStep: "Wire the first bounded Nexus -> n8n -> Upload-Post handoff after the publisher pilot passes.",
    },
    {
      key: "notebooklm",
      label: "NotebookLM",
      status: notebookResearchCount > 0 ? "live" : "attention",
      detail:
        notebookResearchCount > 0
          ? `${notebookResearchCount} research items and ${briefReadyCount} brief-ready queue rows are already grounded in NotebookLM.`
          : "NotebookLM is part of the content strategy, but no source-grounded research items are loaded yet.",
      meta: notebookResearchCount > 0 ? "Research pipeline active" : "Research pipeline needs seeding",
      nextStep:
        notebookResearchCount > 0
          ? "Keep expanding thin or underperforming posts through Research and Briefs."
          : "Seed the research queue with source-grounded NotebookLM findings before drafting more content.",
    },
    {
      key: "health",
      label: ".health snapshots",
      status:
        weeklyMeta.exists && reconcileMeta.exists && maxHealthAge !== null && maxHealthAge <= 7
          ? "live"
          : "attention",
      detail: `Weekly SEO snapshot: ${weeklyLabel}. GA4/GSC 90-day reconciliation: ${reconcileLabel}.`,
      meta: healthFreshnessLabel,
      nextStep:
        weeklyMeta.exists && reconcileMeta.exists && maxHealthAge !== null && maxHealthAge <= 7
          ? "Use Results to act on the latest measurement signals."
          : "Refresh the weekly health workflow so Results is working off current data again.",
    },
  ];

  const summary: StackSummary = {
    liveCount: items.filter((item) => item.status === "live").length,
    attentionCount: items.filter((item) => item.status === "attention").length,
    plannedCount: items.filter((item) => item.status === "planned").length,
    healthFreshnessLabel,
  };

  return { items, summary };
}

function matchesRoutePath(candidate: string | undefined, routePath: string) {
  if (!candidate) return false;
  return candidate === routePath || candidate.startsWith(`${routePath}?`);
}

function matchesCanonicalUrl(candidate: string | undefined, canonicalUrl: string) {
  if (!candidate) return false;
  return candidate === canonicalUrl || candidate.startsWith(`${canonicalUrl}?`);
}

function buildResultsSummary(
  sharedRows: SharedSlugRow[],
  queueRows: ContentQueueRow[],
  weeklySnapshot: WeeklyHealthSnapshot | null
): ResultsSummary {
  const publishedContentCount = new Set(
    sharedRows.filter((row) => row.status === "shared").map((row) => row.slug)
  ).size;
  const weeklyKeyEvents = weeklySnapshot?.ga4?.keyEvents || {};

  return {
    trackedContentCount: queueRows.length,
    publishedContentCount,
    weeklySearchClicks: Number(weeklySnapshot?.searchConsole?.clicks || 0),
    weeklyOrganicSessions: Number(weeklySnapshot?.ga4?.organicSessions || 0),
    weeklyLeadStarts:
      Number(weeklyKeyEvents.quote_form_start || 0) + Number(weeklyKeyEvents.booking_form_start || 0),
    weeklyLeadOutcomes:
      Number(weeklyKeyEvents.quote_submit_success || 0) +
      Number(weeklyKeyEvents.booking_submit_success || 0) +
      Number(weeklyKeyEvents.booking_submit_pending || 0),
  };
}

function buildResultsRows(
  sharedRows: SharedSlugRow[],
  queueRows: ContentQueueRow[],
  syncRows: SyncMatrixRow[],
  weeklySnapshot: WeeklyHealthSnapshot | null,
  reconcileSnapshot: ReconcileSnapshot | null
): ContentResultsRow[] {
  const landingPages7d = weeklySnapshot?.ga4?.topLandingPages || [];
  const landingPages90d = reconcileSnapshot?.ga4?.topOrganicLandingPages || [];
  const searchPages90d = reconcileSnapshot?.searchConsole?.topPages || [];
  const queueBySlug = new Map(
    queueRows
      .filter((row) => row.slug_candidate)
      .map((row) => [row.slug_candidate as string, row])
  );
  const syncBySlug = new Map(syncRows.map((row) => [row.slug, row]));

  return BLOG_POSTS.map((post) => {
    const routePath = `/blog/${post.slug}`;
    const canonicalUrl = `https://www.susiesjewelryrepair.com${routePath}`;
    const publishedPlatforms = Array.from(
      new Set(
        sharedRows
          .filter((row) => row.slug === post.slug && row.status === "shared")
          .map((row) => row.platform)
      )
    );
    const weeklyOrganicSessions = landingPages7d
      .filter((row) => matchesRoutePath(row.page, routePath))
      .reduce((sum, row) => sum + Number(row.sessions || 0), 0);
    const ninetyDayOrganicSessions = landingPages90d
      .filter((row) => matchesRoutePath(row.page, routePath))
      .reduce((sum, row) => sum + Number(row.sessions || 0), 0);
    const ninetyDaySearchClicks = searchPages90d
      .filter((row) => matchesCanonicalUrl(row.page, canonicalUrl))
      .reduce((sum, row) => sum + Number(row.clicks || 0), 0);
    const queueRow = queueBySlug.get(post.slug) || null;
    const syncRow = syncBySlug.get(post.slug) || null;
    const approvalStatus: ContentResultsRow["approvalStatus"] =
      queueRow?.status || syncRow?.approvalStatus || "untracked";

    let recommendation = "Watch for signal after distribution.";
    if (publishedPlatforms.length === 0) {
      recommendation = "Approve and distribute first.";
    } else if (weeklyOrganicSessions === 0 && ninetyDayOrganicSessions === 0 && ninetyDaySearchClicks === 0) {
      recommendation = "Redistribute or tighten the angle.";
    } else if (weeklyOrganicSessions > 0 || ninetyDaySearchClicks > 0) {
      recommendation = "Monitor leads and consider a follow-up asset.";
    }

    return {
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt,
      serviceLabel: post.relatedServiceSlugs.slice(0, 2).join(", ") || "General",
      publishedPlatforms,
      approvalStatus,
      weeklyOrganicSessions,
      ninetyDayOrganicSessions,
      ninetyDaySearchClicks,
      recommendation,
    };
  }).sort((a, b) => {
    const aSignal = a.weeklyOrganicSessions + a.ninetyDayOrganicSessions + a.ninetyDaySearchClicks;
    const bSignal = b.weeklyOrganicSessions + b.ninetyDayOrganicSessions + b.ninetyDaySearchClicks;
    return bSignal - aSignal || b.publishedPlatforms.length - a.publishedPlatforms.length;
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
  const serviceCounts = new Map<string, number>();
  const intentCounts = new Map<string, number>();

  const finderLeadRows = [
    ...quotes.map((quote) => ({
      leadType: "quote" as const,
      status: quote.status,
      context: resolveStoredServicesFinderLeadContext({
        source: quote.source,
        details: quote.details,
      }),
    })),
    ...bookings.map((booking) => ({
      leadType: "booking" as const,
      status: booking.status,
      context: resolveStoredServicesFinderLeadContext({
        source: booking.source,
        details: booking.details,
      }),
    })),
  ].filter((row) => row.context.isServicesFinderLead);

  for (const row of finderLeadRows) {
    incrementCount(serviceCounts, row.context.serviceName || row.context.serviceSlug);
    incrementCount(intentCounts, row.context.intentLabel || row.context.query);
  }

  const finderSummary = {
    total: finderLeadRows.length,
    quoteCount: finderLeadRows.filter((row) => row.leadType === "quote").length,
    bookingCount: finderLeadRows.filter((row) => row.leadType === "booking").length,
    newCount: finderLeadRows.filter(
      (row) => row.status === "new" || row.status === "queued"
    ).length,
    spamCount: finderLeadRows.filter((row) => row.status === "spam").length,
    topServices: mapTopCounts(serviceCounts),
    topIntents: mapTopCounts(intentCounts),
  };

  return {
    totalLeads: quoteSummary.total + bookingSummary.total + contactSummary.total,
    newCount: quoteSummary.newCount + bookingSummary.newCount + contactSummary.newCount,
    spamCount: quoteSummary.spamCount + bookingSummary.spamCount + contactSummary.spamCount,
    quotes: quoteSummary,
    bookings: bookingSummary,
    contacts: contactSummary,
    finder: finderSummary,
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
  const weeklySnapshot = readJsonSnapshot<WeeklyHealthSnapshot>("weekly-seo-health-latest.json");
  const reconcileSnapshot = readJsonSnapshot<ReconcileSnapshot>("ga4-gsc-reconciliation-90d-latest.json");
  const stackHealth = buildStackHealth(
    contentResearchRows,
    contentQueueRows,
    weeklySnapshot,
    reconcileSnapshot
  );
  const resultsRows = buildResultsRows(
    sharedRows,
    contentQueueRows,
    syncRows,
    weeklySnapshot,
    reconcileSnapshot
  );

  return {
    apiHealth,
    stackHealth: stackHealth.items,
    stackSummary: stackHealth.summary,
    contentSummary: buildContentSummary(contentResearchRows, contentQueueRows),
    resultsSummary: buildResultsSummary(sharedRows, contentQueueRows, weeklySnapshot),
    syncSummary: buildSyncSummary(syncRows, apiHealth),
    reviewSummary: buildReviewSummary(reviewRows),
    inboxSummary: buildInboxSummary(quotes, bookings, contacts),
    resultsRows,
    contentQueueRows,
    contentResearchRows,
    syncRows,
    recentReviews: reviewRows.slice(0, 12),
  };
}
