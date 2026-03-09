import Link from "next/link";
import type { InboxSummary } from "@/lib/admin/nexus-dashboard";

type InboxSummaryPanelProps = {
  inboxSummary: InboxSummary;
};

const LINKS = [
  { key: "quotes", label: "Quotes", href: "/admin/inbox?tab=quotes&status=new" },
  { key: "bookings", label: "Bookings", href: "/admin/inbox?tab=bookings&status=new" },
  { key: "contacts", label: "Contacts", href: "/admin/inbox?tab=contacts&status=new" },
] as const;

export function InboxSummaryPanel({ inboxSummary }: InboxSummaryPanelProps) {
  const lookup = {
    quotes: inboxSummary.quotes,
    bookings: inboxSummary.bookings,
    contacts: inboxSummary.contacts,
  };

  return (
    <div className="space-y-3">
      {LINKS.map((item) => {
        const summary = lookup[item.key];
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex min-h-16 items-center justify-between rounded-[1.35rem] border border-stone-200 bg-[#faf7f2] px-4 py-3 transition-all hover:border-brand-gold/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            <div>
              <p className="text-sm font-semibold text-stone-900">{item.label}</p>
              <p className="mt-1 text-xs text-stone-500">
                {summary.newCount} new, {summary.spamCount} spam
              </p>
            </div>
            <span className="font-serif text-2xl text-brand-burgundy">
              {summary.total}
            </span>
          </Link>
        );
      })}

      <Link
        href="/admin/inbox?tab=quotes&status=spam"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Open spam triage
      </Link>
    </div>
  );
}
