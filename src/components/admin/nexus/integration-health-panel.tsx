import type { ApiHealthSummary } from "@/lib/admin/nexus-dashboard";

type IntegrationHealthPanelProps = {
  apiHealth: ApiHealthSummary[];
  showConnectButtons?: boolean;
};

export function IntegrationHealthPanel({
  apiHealth,
  showConnectButtons = false,
}: IntegrationHealthPanelProps) {
  return (
    <div className="space-y-3">
      {apiHealth.map((platform) => (
        <div
          key={platform.platform}
          className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-stone-900">{platform.label}</p>
            <p className="mt-1 text-xs text-stone-500">{platform.detail}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={[
                "inline-flex min-h-10 items-center justify-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em]",
                platform.active
                  ? "border-brand-gold/40 bg-brand-gold/12 text-brand-burgundy"
                  : "border-stone-200 bg-white text-stone-500",
              ].join(" ")}
            >
              {platform.active
                ? platform.source === "oauth"
                  ? "OAuth"
                  : "Env token"
                : "Missing"}
            </span>
            {showConnectButtons ? (
              platform.platform === "gbp" ? (
                <a
                  href="/api/auth/social/gbp"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-burgundy px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {platform.active ? "Reconnect" : "Connect"}
                </a>
              ) : (
                platform.active ? (
                  <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Ready
                  </span>
                ) : (
                  <a
                    href={`/admin/nexus?view=stack&oauth=not-configured&provider=${platform.platform}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-burgundy px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Setup
                  </a>
                )
              )
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
