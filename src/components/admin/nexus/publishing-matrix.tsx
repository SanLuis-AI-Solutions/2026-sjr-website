import Image from "next/image";
import type { SyncMatrixRow } from "@/lib/admin/nexus-dashboard";

type PublishingMatrixProps = {
  rows: SyncMatrixRow[];
};

const STATUS_STYLES = {
  live: "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy",
  pending: "border-stone-200 bg-stone-100 text-stone-500",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  skipped: "border-stone-200 bg-white text-stone-500",
} as const;

function formatDate(value: string | null) {
  if (!value) return "Not shared yet";
  return new Date(value).toLocaleDateString();
}

export function PublishingMatrix({ rows }: PublishingMatrixProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-[#faf7f2] px-5 py-10 text-center text-sm text-stone-500">
        No posts matched the current filter. Clear the search field to restore the full publishing matrix.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-stone-200">
      <div className="grid grid-cols-[minmax(260px,2fr)_120px_repeat(5,96px)_132px] gap-3 border-b border-stone-200 bg-stone-50/80 px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
        <div>Article</div>
        <div>Published</div>
        <div>Google</div>
        <div>Meta</div>
        <div>Pinterest</div>
        <div>LinkedIn</div>
        <div>X</div>
        <div>Last signal</div>
      </div>
      <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto">
        {rows.map((row) => (
          <div
            key={row.slug}
            className="grid grid-cols-[minmax(260px,2fr)_120px_repeat(5,96px)_132px] gap-3 border-b border-stone-100 px-4 py-4 text-sm last:border-b-0 hover:bg-stone-50/50"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="h-14 w-16 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                <Image
                  src={row.image}
                  alt=""
                  width={64}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="truncate font-semibold text-stone-900"
                  title={row.title}
                >
                  {row.title}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  {row.slug}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm text-stone-600">
              {row.publishedAt}
            </div>
            {Object.entries(row.statuses).map(([platform, status]) => (
              <div key={`${row.slug}-${platform}`} className="flex items-center">
                <span
                  className={[
                    "inline-flex min-h-10 w-full items-center justify-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    STATUS_STYLES[status],
                  ].join(" ")}
                >
                  {status}
                </span>
              </div>
            ))}
            <div className="flex items-center text-sm text-stone-500">
              {formatDate(row.lastSharedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
