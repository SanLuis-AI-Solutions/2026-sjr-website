import Link from "next/link";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { InboxSummaryPanel } from "@/components/admin/nexus/inbox-summary-panel";
import { IntegrationHealthPanel } from "@/components/admin/nexus/integration-health-panel";
import { MetricStrip } from "@/components/admin/nexus/metric-strip";
import { PublishingMatrix } from "@/components/admin/nexus/publishing-matrix";
import { ReviewSummaryPanel } from "@/components/admin/nexus/review-summary-panel";
import { getNexusDashboardData } from "@/lib/admin/nexus-dashboard";

export const dynamic = "force-dynamic";

type NexusView = "overview" | "leads" | "publishing" | "reviews" | "connections";

type NexusPageProps = {
  searchParams?: Promise<{ q?: string; view?: string; oauth?: string; provider?: string }>;
};

function normalizeView(value: string | undefined): NexusView {
  if (
    value === "overview" ||
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

function PublishingWorkspace({
  rows,
}: {
  rows: Awaited<ReturnType<typeof getNexusDashboardData>>["syncRows"];
}) {
  return (
    <div className="grid h-full gap-3 lg:min-h-0">
      <AdminSectionCard
        title="Publishing matrix"
        eyebrow="Publishing"
        description="One dense matrix. No stacked article cards. Filter from the top bar when you need to isolate a post or platform."
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1 min-h-0"
      >
        <PublishingMatrix rows={rows} />
      </AdminSectionCard>
    </div>
  );
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
  provider,
}: {
  dashboard: Awaited<ReturnType<typeof getNexusDashboardData>>;
  oauthState?: string;
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
            {providerLabel} sign-in failed. Reconnect and review the callback error details before treating the provider as live.
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
  const provider = resolvedSearchParams?.provider;
  const dashboard = await getNexusDashboardData();
  const filteredRows = filterDashboardRows(dashboard.syncRows, query);

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

        {view === "leads" ? <LeadsWorkspace dashboard={dashboard} /> : null}

        {view === "publishing" ? (
          <PublishingWorkspace
            rows={filteredRows}
          />
        ) : null}

        {view === "reviews" ? <ReviewsWorkspace dashboard={dashboard} /> : null}

        {view === "connections" ? (
          <ConnectionsWorkspace
            dashboard={dashboard}
            oauthState={oauthState}
            provider={provider}
          />
        ) : null}
      </div>
    </div>
  );
}
