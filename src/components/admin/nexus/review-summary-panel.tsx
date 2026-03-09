import type { ReviewStatusRow, ReviewSummary } from "@/lib/admin/nexus-dashboard";

type ReviewSummaryPanelProps = {
  reviewSummary: ReviewSummary;
};

function formatReviewDate(value: string | null, fallback: string) {
  return value ? new Date(value).toLocaleDateString() : fallback;
}

function ReviewItem({ row, last }: { row: ReviewStatusRow; last: boolean }) {
  const isReviewed = row.status === "reviewed";

  return (
    <div className="relative flex gap-4 pb-5 last:pb-0">
      {!last ? (
        <div className="absolute left-[11px] top-7 h-[calc(100%-12px)] w-px bg-brand-gold/35" />
      ) : null}
      <div
        className={[
          "relative z-10 mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
          isReviewed
            ? "border-brand-gold bg-brand-gold/12 text-brand-burgundy"
            : "border-stone-300 bg-white text-stone-400",
        ].join(" ")}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-stone-900">{row.customer_key}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
          {row.channel} • {row.status}
        </p>
        <p className="mt-2 text-xs text-stone-500">
          {formatReviewDate(row.last_sent_at, "Queued for first send")}
        </p>
      </div>
    </div>
  );
}

export function ReviewSummaryPanel({ reviewSummary }: ReviewSummaryPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div className="rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
            In queue
          </p>
          <p className="mt-2 font-serif text-3xl text-stone-900">{reviewSummary.queuedCount}</p>
        </div>
        <div className="rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
            Active
          </p>
          <p className="mt-2 font-serif text-3xl text-stone-900">{reviewSummary.activeCount}</p>
        </div>
        <div className="rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
            Reviewed
          </p>
          <p className="mt-2 font-serif text-3xl text-stone-900">{reviewSummary.reviewedCount}</p>
        </div>
      </div>

      <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto rounded-[1.4rem] border border-stone-200 bg-[#faf7f2] px-4 py-4">
        {reviewSummary.recent.length === 0 ? (
          <p className="text-sm text-stone-500">
            No review automation activity yet. Once the next review cycle runs, the stream will appear here.
          </p>
        ) : (
          reviewSummary.recent.map((row, index) => (
            <ReviewItem
              key={row.id}
              row={row}
              last={index === reviewSummary.recent.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
