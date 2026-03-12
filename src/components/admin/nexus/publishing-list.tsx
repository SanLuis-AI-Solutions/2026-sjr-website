import Link from "next/link";
import type { SyncMatrixRow } from "@/lib/admin/nexus-dashboard";

type PublishingListProps = {
  rows: SyncMatrixRow[];
  selectedSlug: string | null;
  googleConnected: boolean;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
  saveAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
  clearAction: (formData: FormData) => void | Promise<void>;
};

const LIVE_STATUS_STYLES = {
  live: "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy",
  pending: "border-stone-200 bg-stone-100 text-stone-500",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  skipped: "border-stone-200 bg-white text-stone-500",
} as const;

const APPROVAL_STATUS_STYLES = {
  draft: "border-stone-200 bg-white text-stone-500",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  published: "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString();
}

const NOTICE_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-stone-700",
  error: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

export function PublishingList({
  rows,
  selectedSlug,
  googleConnected,
  notice,
  saveAction,
  publishAction,
  clearAction,
}: PublishingListProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-[#faf7f2] px-5 py-10 text-center text-sm text-stone-500">
        No posts matched the current filter. Clear the search field to restore the publishing queue.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#faf7f2]">
      {notice ? (
        <div className={["mx-3 mt-2 rounded-[1rem] border px-3 py-2 text-[12px] leading-relaxed", NOTICE_STYLES[notice.tone]].join(" ")}>
          <p className="font-semibold">{notice.title}</p>
          <p className="mt-1">{notice.body}</p>
        </div>
      ) : null}
      {!googleConnected ? (
        <div className="mx-3 mt-2 rounded-[1rem] border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-stone-700">
          Google Business Profile is not connected. You can still open the full article and approve drafts, but live publish stays disabled until the connection is active.
        </div>
      ) : null}
      <div className="grid grid-cols-[minmax(0,1fr)_82px_82px_84px] gap-2 border-b border-stone-200 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        <div>Post</div>
        <div>Live</div>
        <div>Approval</div>
        <div>Signal</div>
      </div>
      <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto">
        {rows.map((row) => {
          const isSelected = row.slug === selectedSlug;
          const liveStatus = row.statuses.gbp;

          return (
            <div
              key={row.slug}
              className={[
                "grid grid-cols-[minmax(0,1fr)_82px_82px_84px] gap-2 border-b border-stone-100 px-3 py-3 transition-colors last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset",
                isSelected ? "bg-white" : "hover:bg-white/80",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/blog/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[13px] font-semibold leading-5 text-stone-900 underline decoration-transparent underline-offset-3 transition-colors hover:text-brand-burgundy hover:decoration-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    title={`Open ${row.title} in a new tab`}
                  >
                    {row.title}
                  </Link>
                </div>
                <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-stone-500">
                  {row.publishedAt}
                </p>
                {row.approvalError ? (
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-rose-700">
                    {row.approvalError}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <form action={saveAction}>
                    <input type="hidden" name="slug" value={row.slug} />
                    <button
                      type="submit"
                      className="inline-flex min-h-8 items-center justify-center rounded-full bg-brand-burgundy px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Save approved draft
                    </button>
                  </form>
                  <form action={publishAction}>
                    <input type="hidden" name="slug" value={row.slug} />
                    <button
                      type="submit"
                      disabled={!googleConnected || row.approvalStatus !== "approved"}
                      className="inline-flex min-h-8 items-center justify-center rounded-full border border-brand-gold/45 bg-white px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-burgundy transition-colors hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400"
                    >
                      Publish now
                    </button>
                  </form>
                  {row.approvalStatus === "approved" ? (
                    <form action={clearAction}>
                      <input type="hidden" name="slug" value={row.slug} />
                      <button
                        type="submit"
                        className="inline-flex min-h-8 items-center justify-center rounded-full border border-stone-200 bg-white px-2.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:border-brand-gold/45 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                      >
                        Clear approval
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center">
                <span
                  className={[
                    "inline-flex min-h-8 w-full items-center justify-center rounded-full border px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                    LIVE_STATUS_STYLES[liveStatus],
                  ].join(" ")}
                >
                  {liveStatus}
                </span>
              </div>

              <div className="flex items-center">
                <span
                  className={[
                    "inline-flex min-h-8 w-full items-center justify-center rounded-full border px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                    APPROVAL_STATUS_STYLES[row.approvalStatus],
                  ].join(" ")}
                >
                  {row.approvalStatus}
                </span>
              </div>

              <div className="flex items-center text-[11px] text-stone-500">{formatDate(row.lastSharedAt)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
