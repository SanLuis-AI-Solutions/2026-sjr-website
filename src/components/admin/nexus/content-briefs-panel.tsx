import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { ContentQueueRow, ContentSummary } from "@/lib/admin/nexus-content-ops";

type ContentBriefsPanelProps = {
  rows: ContentQueueRow[];
  summary: ContentSummary;
  seedAction: () => void | Promise<void>;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
};

const STATUS_STYLES = {
  research_ready: "border-stone-200 bg-white text-stone-500",
  brief_ready: "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft_ready: "border-stone-200 bg-stone-100 text-stone-600",
  scheduled: "border-sky-200 bg-sky-50 text-sky-700",
  published: "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy",
  archived: "border-stone-200 bg-stone-100 text-stone-500",
} as const;

const NOTICE_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-stone-700",
  error: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

function formatLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTargets(targets: string[]) {
  if (!Array.isArray(targets) || targets.length === 0) return "No targets";
  return targets.join(" + ").toUpperCase();
}

export function ContentBriefsPanel({
  rows,
  summary,
  seedAction,
  notice,
}: ContentBriefsPanelProps) {
  return (
    <AdminSectionCard
      title="Brief queue"
      eyebrow="Briefs"
      description={`${summary.briefReadyCount} briefs are ready for operator review and ${summary.approvedCount} are already approved downstream.`}
      compactHeader
      action={
        <form action={seedAction}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-brand-gold/35 bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-burgundy transition-colors hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Seed starters
          </button>
        </form>
      }
      className="flex h-full min-h-0 flex-col"
      contentClassName="flex-1 min-h-0"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#faf7f2]">
        {notice ? (
          <div className={["mx-3 mt-3 rounded-[1rem] border px-3 py-2 text-[12px] leading-relaxed", NOTICE_STYLES[notice.tone]].join(" ")}>
            <p className="font-semibold">{notice.title}</p>
            <p className="mt-1">{notice.body}</p>
          </div>
        ) : null}
      {rows.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-stone-500">
          No briefs are stored yet. Seed the starter queue to create the first operator-facing brief set.
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="grid grid-cols-[minmax(0,1.4fr)_108px_108px] gap-2 border-b border-stone-200 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <div>Brief</div>
            <div>Status</div>
            <div>Targets</div>
          </div>
          <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[minmax(0,1.4fr)_108px_108px] gap-2 border-b border-stone-100 px-3 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-5 text-stone-900">{row.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.16em] text-stone-500">
                    <span>{formatLabel(row.content_type)}</span>
                    <span>•</span>
                    <span>{formatLabel(row.funnel_stage)}</span>
                    {row.service_slug ? (
                      <>
                        <span>•</span>
                        <span>{formatLabel(row.service_slug)}</span>
                      </>
                    ) : null}
                    {row.location_slug ? (
                      <>
                        <span>•</span>
                        <span>{formatLabel(row.location_slug)}</span>
                      </>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-stone-600">{row.business_goal}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
                    CTA: {row.primary_cta}
                    {row.slug_candidate ? ` • Slug: ${row.slug_candidate}` : ""}
                  </p>
                </div>
                <div className="flex items-start">
                  <span
                    className={[
                      "inline-flex min-h-8 w-full items-center justify-center rounded-full border px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                      STATUS_STYLES[row.status],
                    ].join(" ")}
                  >
                    {formatLabel(row.status)}
                  </span>
                </div>
                <div className="flex items-start text-[11px] leading-relaxed text-stone-500">
                  {formatTargets(row.platform_targets)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </AdminSectionCard>
  );
}
