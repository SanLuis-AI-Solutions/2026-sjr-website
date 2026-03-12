"use client";
import { usePathname, useSearchParams } from "next/navigation";

const TOPBAR_COPY = {
  "/admin/nexus": {
    title: "Mission Control",
    description: "One active workspace at a time. Use the left rail to switch between leads, publishing, reviews, and connections.",
  },
  "/admin/inbox": {
    title: "Inbox Triage",
    description: "Work one lead queue at a time without leaving the shell.",
  },
} as const;

function getTopbarContent(pathname: string) {
  if (pathname.startsWith("/admin/inbox")) return TOPBAR_COPY["/admin/inbox"];
  return TOPBAR_COPY["/admin/nexus"];
}

export function AdminTopbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { title, description } = getTopbarContent(pathname);
  const queryValue = searchParams.get("q") || "";
  const activeView = searchParams.get("view");
  const activeSlug = searchParams.get("slug");
  const activeTab = searchParams.get("tab");
  const activeStatus = searchParams.get("status");
  const viewLabel = pathname.startsWith("/admin/inbox")
    ? (searchParams.get("tab") || "quotes")
    : (searchParams.get("view") || "overview");

  return (
    <header className="admin-topbar sticky top-0 z-30 border-b border-stone-200/80 bg-[#faf7f2]/88 px-4 py-3 backdrop-blur-xl md:px-5 md:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-burgundy">
            Context Nexus
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-[2rem] leading-none text-stone-900 md:text-[2.35rem]">
              {title}
            </h1>
            <span className="inline-flex min-h-9 items-center rounded-full border border-brand-gold/45 bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
              {viewLabel}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">{description}</p>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-[340px] lg:max-w-[400px] lg:items-end">
          <form
            action={pathname}
            className="flex min-h-11 w-full items-center gap-3 rounded-[1.4rem] border border-stone-200 bg-white px-4 py-2 shadow-[0_10px_32px_rgba(58,25,16,0.08)]"
            role="search"
            aria-label="Dashboard filter"
          >
            {activeView ? <input type="hidden" name="view" value={activeView} /> : null}
            {activeSlug && pathname.startsWith("/admin/nexus") ? (
              <input type="hidden" name="slug" value={activeSlug} />
            ) : null}
            {activeTab ? <input type="hidden" name="tab" value={activeTab} /> : null}
            {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 shrink-0 text-stone-400"
              aria-hidden="true"
            >
              <path
                d="m21 21-4.35-4.35M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={queryValue}
              placeholder={
                pathname.startsWith("/admin/inbox")
                  ? "Filter customers, emails, or request details"
                  : "Filter posts, platforms, or activity"
              }
              className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-burgundy px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Apply
            </button>
          </form>
          <p className="text-[11px] font-medium text-stone-500">Left rail controls the active workspace.</p>
        </div>
      </div>
    </header>
  );
}
