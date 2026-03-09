import Link from "next/link";

const ACTIONS = [
  {
    label: "Open inbox",
    description: "Jump straight into the full triage workspace.",
    href: "/admin/inbox",
  },
  {
    label: "Review spam",
    description: "See suspicious quote, booking, and contact submissions.",
    href: "/admin/inbox?tab=quotes&status=spam",
  },
  {
    label: "Check bookings",
    description: "Focus the inbox on new booking requests first.",
    href: "/admin/inbox?tab=bookings&status=new",
  },
  {
    label: "Review pipeline",
    description: "Jump down to the review automation stream on this page.",
    href: "/admin/nexus#reviews",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex min-h-[120px] flex-col justify-between rounded-[1.5rem] border border-stone-200 bg-[#faf7f2] p-4 shadow-[0_12px_28px_rgba(58,25,16,0.06)] transition-all hover:border-brand-gold/60 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          <div>
            <p className="text-sm font-semibold text-stone-900">{action.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {action.description}
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy group-hover:text-brand-burgundy-deep">
            Go now
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
