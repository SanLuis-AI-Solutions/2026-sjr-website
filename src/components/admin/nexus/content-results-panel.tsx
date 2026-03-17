import Link from "next/link";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { ContentResultsRow, ResultsSummary } from "@/lib/admin/nexus-dashboard";

type ContentResultsPanelProps = {
  rows: ContentResultsRow[];
  summary: ResultsSummary;
};

const APPROVAL_STYLES = {
  untracked: "border-stone-200 bg-white text-stone-500",
  draft: "border-stone-200 bg-white text-stone-500",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  research_ready: "border-stone-200 bg-white text-stone-500",
  brief_ready: "border-brand-gold/35 bg-brand-gold/10 text-brand-burgundy",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft_ready: "border-stone-200 bg-stone-100 text-stone-600",
  scheduled: "border-sky-200 bg-sky-50 text-sky-700",
  published: "border-brand-gold/35 bg-brand-gold/10 text-brand-burgundy",
  archived: "border-stone-200 bg-stone-100 text-stone-500",
} as const;

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ContentResultsPanel({ rows, summary }: ContentResultsPanelProps) {
  return (
    <AdminSectionCard
      title="Content results"
      eyebrow="Results"
      description="Directional outcome signals only. This view combines the latest .health snapshots with live publishing state so you can decide what deserves another push."
      compactHeader
      className="flex h-full min-h-0 flex-col"
      contentClassName="flex-1 min-h-0"
    >
      <div className="grid h-full min-h-0 gap-3">
        <div className="grid gap-2 md:grid-cols-5">
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Tracked</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.trackedContentCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Published</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.publishedContentCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">7d clicks</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.weeklySearchClicks}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">7d organic</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.weeklyOrganicSessions}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">7d outcomes</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.weeklyLeadOutcomes}</p>
            <p className="mt-1 text-[11px] text-stone-500">{summary.weeklyLeadStarts} starts</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#faf7f2]">
          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-stone-500">
              No content results are available yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[minmax(0,1.45fr)_120px_92px_92px_120px] gap-2 border-b border-stone-200 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                <div>Content</div>
                <div>State</div>
                <div>7d organic</div>
                <div>90d clicks</div>
                <div>Next step</div>
              </div>
              <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto">
                {rows.map((row) => (
                  <div
                    key={row.slug}
                    className="grid grid-cols-[minmax(0,1.45fr)_120px_92px_92px_120px] gap-2 border-b border-stone-100 px-3 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/blog/${row.slug}`}
                        target="_blank"
                        className="text-[13px] font-semibold leading-5 text-stone-900 underline-offset-4 hover:text-brand-burgundy hover:underline"
                      >
                        {row.title}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.16em] text-stone-500">
                        <span>{row.serviceLabel}</span>
                        <span>•</span>
                        <span>{row.publishedAt}</span>
                        {row.publishedPlatforms.length > 0 ? (
                          <>
                            <span>•</span>
                            <span>{row.publishedPlatforms.join(" + ").toUpperCase()}</span>
                          </>
                        ) : null}
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-stone-500">
                        90d organic sessions: {row.ninetyDayOrganicSessions}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span
                        className={[
                          "inline-flex min-h-8 w-full items-center justify-center rounded-full border px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                          APPROVAL_STYLES[row.approvalStatus],
                        ].join(" ")}
                      >
                        {formatLabel(row.approvalStatus)}
                      </span>
                    </div>
                    <div className="flex items-start text-[12px] font-semibold text-stone-700">
                      {row.weeklyOrganicSessions}
                    </div>
                    <div className="flex items-start text-[12px] font-semibold text-stone-700">
                      {row.ninetyDaySearchClicks}
                    </div>
                    <div className="text-[11px] leading-relaxed text-stone-500">{row.recommendation}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminSectionCard>
  );
}
