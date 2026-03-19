import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type {
  StackHealthItem,
  StackSummary,
} from "@/lib/admin/nexus-dashboard";

type StackHealthPanelProps = {
  items: StackHealthItem[];
  summary: StackSummary;
  notice?: {
    tone: "success" | "warning" | "error";
    title: string;
    body: string;
  } | null;
};

const STATUS_STYLES = {
  live: "border-brand-gold/35 bg-brand-gold/10 text-brand-burgundy",
  attention: "border-amber-200 bg-amber-50 text-amber-800",
  planned: "border-stone-200 bg-white text-stone-500",
} as const;

const NOTICE_STYLES = {
  success: "border-brand-gold/40 bg-brand-gold/10 text-stone-700",
  warning: "border-amber-200 bg-amber-50 text-stone-700",
  error: "border-rose-200 bg-rose-50 text-stone-700",
} as const;

function formatStatusLabel(status: StackHealthItem["status"]) {
  if (status === "live") return "Live";
  if (status === "attention") return "Attention";
  return "Planned";
}

export function StackHealthPanel({
  items,
  summary,
  notice,
}: StackHealthPanelProps) {
  return (
    <AdminSectionCard
      title="Stack health"
      eyebrow="Stack"
      description="This is the actual SJR operating stack: research, orchestration, publishing, and measurement health. Direct provider OAuth is now a secondary legacy path, not the organizing concept."
      compactHeader
      className="flex h-full min-h-0 flex-col"
      contentClassName="flex-1 min-h-0"
    >
      <div className="grid h-full min-h-0 gap-3">
        <div className="grid gap-2 md:grid-cols-4">
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Live</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.liveCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Attention</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.attentionCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">Planned</p>
            <p className="mt-2 text-2xl font-serif text-stone-900">{summary.plannedCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-[#faf7f2] px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Health freshness
            </p>
            <p className="mt-2 text-xl font-serif text-stone-900">{summary.healthFreshnessLabel}</p>
          </div>
        </div>

        {notice ? (
          <div
            className={[
              "rounded-[1.35rem] border px-4 py-4 text-sm leading-relaxed",
              NOTICE_STYLES[notice.tone],
            ].join(" ")}
          >
            <p className="font-semibold text-stone-900">{notice.title}</p>
            <p className="mt-1">{notice.body}</p>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-stone-200 bg-[#faf7f2]">
          <div className="grid grid-cols-[minmax(0,1fr)_110px_130px] gap-3 border-b border-stone-200 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <div>System</div>
            <div>Status</div>
            <div>Next step</div>
          </div>
          <div className="admin-scroll-panel min-h-0 flex-1 overflow-auto">
            {items.map((item) => (
              <div
                key={item.key}
                className="grid grid-cols-[minmax(0,1fr)_110px_130px] gap-3 border-b border-stone-100 px-4 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold text-stone-900">{item.label}</p>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
                      {item.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-stone-600">{item.detail}</p>
                </div>
                <div className="flex items-start">
                  <span
                    className={[
                      "inline-flex min-h-8 w-full items-center justify-center rounded-full border px-2 text-[9px] font-semibold uppercase tracking-[0.16em]",
                      STATUS_STYLES[item.status],
                    ].join(" ")}
                  >
                    {formatStatusLabel(item.status)}
                  </span>
                </div>
                <div className="text-[11px] leading-relaxed text-stone-500">{item.nextStep}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}
