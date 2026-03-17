import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { ContentBriefsPanel } from "@/components/admin/nexus/content-briefs-panel";
import { ContentResearchPanel } from "@/components/admin/nexus/content-research-panel";
import { InboxSummaryPanel } from "@/components/admin/nexus/inbox-summary-panel";
import { IntegrationHealthPanel } from "@/components/admin/nexus/integration-health-panel";
import { MetricStrip } from "@/components/admin/nexus/metric-strip";
import { PublishingWorkspace } from "@/components/admin/nexus/publishing-workspace";
import { ReviewSummaryPanel } from "@/components/admin/nexus/review-summary-panel";
import { promoteResearchToBrief, seedInitialContentOpsData } from "@/lib/admin/nexus-content-ops";
import { getNexusDashboardData } from "@/lib/admin/nexus-dashboard";
import {
  clearPublishingApproval,
  publishApprovedPublishingPreview,
  saveApprovedPublishingPreview,
} from "@/lib/admin/nexus-publishing";
import { getAdminIdentity } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

type NexusView =
  | "overview"
  | "research"
  | "briefs"
  | "leads"
  | "publishing"
  | "reviews"
  | "connections";

type NexusPageProps = {
  searchParams?: Promise<{
    q?: string;
    view?: string;
    oauth?: string;
    oauth_reason?: string;
    oauth_detail?: string;
    provider?: string;
    slug?: string;
    result?: string;
  }>;
};

function normalizeView(value: string | undefined): NexusView {
  if (
    value === "overview" ||
    value === "research" ||
    value === "briefs" ||
    value === "leads" ||
    value === "publishing" ||
    value === "reviews" ||
    value === "connections"
  ) {
    return value;
  }
  return "overview";
}

function filterDashboardRows(
  rows: Awaited<ReturnType<typeof getNexusDashboardData>>["syncRows"],
  query: string
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rows;

  return rows.filter((row) => {
    const haystack = [
      row.title,
      row.slug,
      row.publishedAt,
      row.approvalStatus,
      row.approvalError || "",
      Object.entries(row.statuses)
        .map(([platform, status]) => `${platform} ${status}`)
        .join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

function OverviewWorkspace({
  newLeads,
  spamCount,
  connectedPlatforms,
  missingPlatforms,
  reviewQueue,
}: {
  newLeads: number;
  spamCount: number;
  connectedPlatforms: number;
  missingPlatforms: number;
  reviewQueue: number;
}) {
  const actions = [
    {
      label: "Open new leads",
      note: `${newLeads} records need first touch`,
      href: "/admin/inbox?tab=quotes&status=new",
    },
    {
      label: "Review spam",
      note: `${spamCount} suspicious submissions remain visible`,
      href: "/admin/inbox?tab=quotes&status=spam",
    },
    {
      label: "Check reviews",
      note: `${reviewQueue} review requests are queued`,
      href: "/admin/nexus?view=reviews",
    },
    {
      label: "Inspect connections",
      note: `${connectedPlatforms} connected, ${missingPlatforms} missing`,
      href: "/admin/nexus?view=connections",
    },
  ];

  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <AdminSectionCard
        title="Today at a glance"
        eyebrow="Overview"
        description="Direct paths only. Use the left rail when the task changes."
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1 min-h-0"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-4 transition-colors hover:border-brand-gold/55 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              <p className="text-sm font-semibold text-stone-900">{action.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{action.note}</p>
            </Link>
          ))}
        </div>
      </AdminSectionCard>
    </div>
  );
}

function getContentOpsNotice(result: string | undefined): {
  tone: "success" | "warning" | "error";
  title: string;
  body: string;
} | null {
  switch (result) {
    case "seeded":
      return {
        tone: "success",
        title: "Starter items added",
        body: "The Phase 1A starter queue was saved and is ready for operator review.",
      };
    case "seed-failed":
      return {
        tone: "error",
        title: "Could not seed content ops",
        body: "The content-op tables may not be applied yet. Review the schema step before trying again.",
      };
    case "brief-created":
      return {
        tone: "success",
        title: "Brief created",
        body: "The selected research item was promoted into the brief queue.",
      };
    case "brief-failed":
      return {
        tone: "error",
        title: "Could not create brief",
        body: "The promotion step failed. Review the content-op tables and try again.",
      };
    default:
      return null;
  }
}

function buildContentOpsRedirect(view: "research" | "briefs", result?: string) {
  const params = new URLSearchParams();
  params.set("view", view);
  if (result) params.set("result", result);
  return `/admin/nexus?${params.toString()}`;
}

function ResearchWorkspace({
  dashboard,
  seedAction,
  createBriefAction,
  notice,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
  seedAction: () => void | Promise<void>;
  createBriefAction: (formData: FormData) => void | Promise<void>;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
}) {
  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <ContentResearchPanel
        rows={dashboard.contentResearchRows}
        briefResearchIds={
          new Set(dashboard.contentQueueRows.map((row) => row.research_id).filter(Boolean) as string[])
        }
        summary={dashboard.contentSummary}
        seedAction={seedAction}
        createBriefAction={createBriefAction}
        notice={notice}
      />
    </div>
  );
}

function BriefsWorkspace({
  dashboard,
  seedAction,
  notice,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
  seedAction: () => void | Promise<void>;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
}) {
  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <ContentBriefsPanel
        rows={dashboard.contentQueueRows}
        summary={dashboard.contentSummary}
        seedAction={seedAction}
        notice={notice}
      />
    </div>
  );
}

function LeadsWorkspace({
  dashboard,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
}) {
  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <AdminSectionCard
        title="Lead snapshot"
        eyebrow="Leads"
        description="Start here to see which queue deserves the next click, then open Inbox for the detailed record list."
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1 min-h-0"
      >
        <InboxSummaryPanel inboxSummary={dashboard.inboxSummary} />
      </AdminSectionCard>
    </div>
  );
}

function getPublishingNotice(result: string | undefined): {
  tone: "success" | "warning" | "error";
  title: string;
  body: string;
} | null {
  switch (result) {
    case "approved":
      return {
        tone: "success",
        title: "Draft approved",
        body: "This GBP payload is now locked for publish unless the source blog content changes.",
      };
    case "cleared":
      return {
        tone: "warning",
        title: "Approval cleared",
        body: "The row returned to draft state. Review and approve again before publishing.",
      };
    case "published":
      return {
        tone: "success",
        title: "Post published",
        body: "Google Business Profile accepted the post and Nexus stored the live result.",
      };
    case "approval-required":
      return {
        tone: "warning",
        title: "Approval required",
        body: "Save an approved draft before publishing live.",
      };
    case "stale-approval":
      return {
        tone: "error",
        title: "Approval expired",
        body: "The source content changed after approval. Review the refreshed preview and approve again.",
      };
    case "missing-connection":
      return {
        tone: "warning",
        title: "Connection required",
        body: "Google Business Profile must be connected before this post can go live.",
      };
    case "publish-failed":
      return {
        tone: "error",
        title: "Publish failed",
        body: "The GBP API rejected the publish attempt. Review the row error state, then reopen the article and try again.",
      };
    default:
      return null;
  }
}

function buildPublishingRedirect(slug: string, query: string, result?: string) {
  const params = new URLSearchParams();
  params.set("view", "publishing");
  params.set("slug", slug);
  if (query.trim()) params.set("q", query.trim());
  if (result) params.set("result", result);
  return `/admin/nexus?${params.toString()}`;
}

function ReviewsWorkspace({
  dashboard,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
}) {
  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <AdminSectionCard
        title="Review pipeline"
        eyebrow="Reviews"
        description="Queued, active, and reviewed activity stays in one panel instead of competing with publishing and lead triage."
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1 min-h-0"
      >
        <ReviewSummaryPanel reviewSummary={dashboard.reviewSummary} />
      </AdminSectionCard>
    </div>
  );
}

function ConnectionsWorkspace({
  dashboard,
  oauthState,
  oauthReason,
  oauthDetail,
  provider,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
  oauthState?: string;
  oauthReason?: string;
  oauthDetail?: string;
  provider?: string;
}) {
  const providerLabel =
    provider === "gbp"
      ? "Google Business Profile"
      : provider === "meta"
        ? "Meta"
        : provider === "pinterest"
          ? "Pinterest"
          : provider === "linkedin"
            ? "LinkedIn"
            : provider === "x"
            ? "X"
              : "Selected provider";
  const failureBody =
    oauthReason === "no-location"
      ? "Google accepted the login, but no accessible Business Profile locations were returned for this account."
      : oauthReason === "permission-denied"
        ? "Google accepted the login, but the account or app does not currently have permission to read Business Profile locations."
        : oauthReason === "token-exchange"
          ? "Google returned the callback, but the token exchange failed. Recheck the OAuth client, consent screen, and Business Profile API access."
          : oauthReason === "quota-blocked"
            ? "Google returned the callback, but this Cloud project is blocked by Business Profile quota limits. That usually means the project is not yet approved for Google My Business API access."
          : oauthReason === "service-disabled"
            ? "Google returned the callback, but the required Business Profile APIs are not enabled for this OAuth client project."
          : oauthReason === "persist-failed"
            ? "Google returned the callback, but Nexus could not save the connection state. Review the Nexus config table and server logs."
            : oauthReason === "state-mismatch"
              ? "The OAuth callback did not match the expected session state. Start the sign-in flow again from the Connections tab."
              : oauthReason && oauthDetail
                ? `Google returned this callback issue: ${oauthReason}. ${oauthDetail}`
                : oauthReason
                  ? `Google returned this callback issue: ${oauthReason}.`
                : "Reconnect and review the callback error details before treating the provider as live.";

  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <AdminSectionCard
        title="Connection status"
        eyebrow="Connections"
        description="Google Business Profile can now connect through OAuth here. Other providers remain explicit setup debt until their adapters are implemented."
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1 min-h-0 overflow-auto"
      >
        {oauthState === "not-configured" ? (
          <div className="mb-4 rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-relaxed text-stone-700">
            {providerLabel} does not have a live OAuth connect flow yet. Google Business Profile is the only provider wired end to end in this pass.
          </div>
        ) : null}
        {oauthState === "connected" ? (
          <div className="mb-4 rounded-[1.35rem] border border-brand-gold/40 bg-brand-gold/10 px-4 py-4 text-sm leading-relaxed text-stone-700">
            {providerLabel} connected successfully. The token and selected location are now stored in Nexus config for server-side publishing.
          </div>
        ) : null}
        {oauthState === "failed" ? (
          <div className="mb-4 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-relaxed text-stone-700">
            {providerLabel} sign-in failed. {failureBody}
          </div>
        ) : null}
        {oauthState === "denied" ? (
          <div className="mb-4 rounded-[1.35rem] border border-stone-200 bg-stone-100 px-4 py-4 text-sm leading-relaxed text-stone-700">
            {providerLabel} sign-in was cancelled before consent completed.
          </div>
        ) : null}
        <IntegrationHealthPanel apiHealth={dashboard.apiHealth} showConnectButtons />
      </AdminSectionCard>
    </div>
  );
}

export default async function NexusPage({ searchParams }: NexusPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q || "";
  const view = normalizeView(resolvedSearchParams?.view);
  const oauthState = resolvedSearchParams?.oauth;
  const oauthReason = resolvedSearchParams?.oauth_reason;
  const oauthDetail = resolvedSearchParams?.oauth_detail;
  const provider = resolvedSearchParams?.provider;
  const requestedSlug = resolvedSearchParams?.slug;
  const result = resolvedSearchParams?.result;
  const dashboard = await getNexusDashboardData();
  const filteredRows = filterDashboardRows(dashboard.syncRows, query);
  const selectedSlug =
    view === "publishing"
      ? filteredRows.some((row) => row.slug === requestedSlug)
        ? (requestedSlug as string)
        : filteredRows[0]?.slug || null
      : null;
  const notice = getPublishingNotice(result);
  const contentOpsNotice = getContentOpsNotice(result);
  const googleConnected = dashboard.apiHealth.find((item) => item.platform === "gbp")?.active ?? false;

  async function seedResearchAction() {
    "use server";

    const admin = await getAdminIdentity();
    if (!admin) {
      redirect("/admin/login");
    }

    try {
      await seedInitialContentOpsData();
    } catch {
      redirect(buildContentOpsRedirect("research", "seed-failed"));
    }
    revalidatePath("/admin/nexus");
    redirect(buildContentOpsRedirect("research", "seeded"));
  }

  async function seedBriefsAction() {
    "use server";

    const admin = await getAdminIdentity();
    if (!admin) {
      redirect("/admin/login");
    }

    try {
      await seedInitialContentOpsData();
    } catch {
      redirect(buildContentOpsRedirect("briefs", "seed-failed"));
    }
    revalidatePath("/admin/nexus");
    redirect(buildContentOpsRedirect("briefs", "seeded"));
  }

  async function createBriefAction(formData: FormData) {
    "use server";

    const researchId = String(formData.get("researchId") || "").trim();
    if (!researchId) {
      redirect(buildContentOpsRedirect("research"));
    }

    const admin = await getAdminIdentity();
    if (!admin) {
      redirect("/admin/login");
    }

    try {
      await promoteResearchToBrief(researchId);
    } catch {
      redirect(buildContentOpsRedirect("research", "brief-failed"));
    }
    revalidatePath("/admin/nexus");
    redirect(buildContentOpsRedirect("briefs", "brief-created"));
  }

  async function saveApprovedDraftAction(formData: FormData) {
    "use server";

    const slug = String(formData.get("slug") || "").trim();
    if (!slug) {
      redirect(buildPublishingRedirect(selectedSlug || "", query));
    }

    const admin = await getAdminIdentity();
    if (!admin) {
      redirect("/admin/login");
    }

    await saveApprovedPublishingPreview({
      slug,
      platform: "gbp",
      approvedBy: admin.email,
    });
    revalidatePath("/admin/nexus");
    redirect(buildPublishingRedirect(slug, query, "approved"));
  }

  async function clearApprovalAction(formData: FormData) {
    "use server";

    const slug = String(formData.get("slug") || "").trim();
    if (!slug) {
      redirect(buildPublishingRedirect(selectedSlug || "", query));
    }

    await clearPublishingApproval({
      slug,
      platform: "gbp",
    });
    revalidatePath("/admin/nexus");
    redirect(buildPublishingRedirect(slug, query, "cleared"));
  }

  async function publishNowAction(formData: FormData) {
    "use server";

    const slug = String(formData.get("slug") || "").trim();
    if (!slug) {
      redirect(buildPublishingRedirect(selectedSlug || "", query));
    }

    const outcome = await publishApprovedPublishingPreview({
      slug,
      platform: "gbp",
    });

    revalidatePath("/admin/nexus");

    if (outcome.ok) {
      redirect(buildPublishingRedirect(slug, query, "published"));
    }

    const mappedResult =
      outcome.code === "approval_required"
        ? "approval-required"
        : outcome.code === "stale_approval"
          ? "stale-approval"
          : outcome.code === "missing_connection"
            ? "missing-connection"
            : "publish-failed";

    redirect(buildPublishingRedirect(slug, query, mappedResult));
  }

  return (
    <div className="flex h-full flex-col gap-3 lg:min-h-0 lg:overflow-hidden">
      {view === "overview" ? (
        <MetricStrip
          syncSummary={dashboard.syncSummary}
          reviewSummary={dashboard.reviewSummary}
          inboxSummary={dashboard.inboxSummary}
        />
      ) : null}

      <div className="flex-1 lg:min-h-0">
        {view === "overview" ? (
          <OverviewWorkspace
            newLeads={dashboard.inboxSummary.newCount}
            spamCount={dashboard.inboxSummary.spamCount}
            connectedPlatforms={dashboard.syncSummary.connectedPlatforms}
            missingPlatforms={dashboard.syncSummary.missingPlatforms}
            reviewQueue={dashboard.reviewSummary.queuedCount}
          />
        ) : null}

        {view === "research" ? (
          <ResearchWorkspace
            dashboard={dashboard}
            seedAction={seedResearchAction}
            createBriefAction={createBriefAction}
            notice={contentOpsNotice}
          />
        ) : null}

        {view === "briefs" ? (
          <BriefsWorkspace
            dashboard={dashboard}
            seedAction={seedBriefsAction}
            notice={contentOpsNotice}
          />
        ) : null}

        {view === "leads" ? <LeadsWorkspace dashboard={dashboard} /> : null}

        {view === "publishing" ? (
          <PublishingWorkspace
            rows={filteredRows}
            selectedSlug={selectedSlug}
            googleConnected={googleConnected}
            notice={notice}
            saveAction={saveApprovedDraftAction}
            publishAction={publishNowAction}
            clearAction={clearApprovalAction}
          />
        ) : null}

        {view === "reviews" ? <ReviewsWorkspace dashboard={dashboard} /> : null}

        {view === "connections" ? (
          <ConnectionsWorkspace
            dashboard={dashboard}
            oauthState={oauthState}
            oauthReason={oauthReason}
            oauthDetail={oauthDetail}
            provider={provider}
          />
        ) : null}
      </div>
    </div>
  );
}
