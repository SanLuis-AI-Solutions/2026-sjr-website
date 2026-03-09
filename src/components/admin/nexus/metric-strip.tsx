import type { InboxSummary, ReviewSummary, SyncSummary } from "@/lib/admin/nexus-dashboard";

type MetricStripProps = {
  syncSummary: SyncSummary;
  reviewSummary: ReviewSummary;
  inboxSummary: InboxSummary;
};

const METRIC_CARD_BASE =
  "rounded-[1.35rem] border border-stone-200 bg-white/92 px-4 py-3 shadow-[0_14px_34px_rgba(58,25,16,0.08)]";

export function MetricStrip({
  syncSummary,
  reviewSummary,
  inboxSummary,
}: MetricStripProps) {
  const cards = [
    {
      label: "API health",
      value: `${syncSummary.connectedPlatforms}/${syncSummary.connectedPlatforms + syncSummary.missingPlatforms}`,
      note: syncSummary.missingPlatforms
        ? `${syncSummary.missingPlatforms} missing token${syncSummary.missingPlatforms === 1 ? "" : "s"}`
        : "All connected tokens detected",
    },
    {
      label: "Posts shared",
      value: `${syncSummary.totalShares}`,
      note: `${syncSummary.livePosts} posts have at least one live platform state`,
    },
    {
      label: "Active reviews",
      value: `${reviewSummary.activeCount}`,
      note: `${reviewSummary.queuedCount} waiting for first send`,
    },
    {
      label: "New leads",
      value: `${inboxSummary.newCount}`,
      note: `${inboxSummary.totalLeads} total customer records loaded`,
    },
    {
      label: "Spam flagged",
      value: `${inboxSummary.spamCount}`,
      note: "Suspicious leads remain visible in inbox triage",
    },
  ];

  return (
    <section aria-label="Overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article key={card.label} className={METRIC_CARD_BASE}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-burgundy">
            {card.label}
          </p>
          <p className="mt-2 font-serif text-[1.8rem] leading-none text-stone-900">{card.value}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-stone-500">{card.note}</p>
        </article>
      ))}
    </section>
  );
}
