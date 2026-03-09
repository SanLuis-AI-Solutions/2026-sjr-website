"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: ReactNode;
  active: boolean;
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM13 10h7v10h-7V10ZM4 13h7v7H4v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 8l6.5 5 1.5 1 1.5-1L20 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NEXUS_VIEWS = [
  {
    key: "overview",
    label: "Overview",
    href: "/admin/nexus",
    description: "Today’s signal mix.",
    icon: <DashboardIcon />,
  },
  {
    key: "leads",
    label: "Leads",
    href: "/admin/nexus?view=leads",
    description: "Lead volume and spam.",
    icon: <InboxIcon />,
  },
  {
    key: "publishing",
    label: "Publishing",
    href: "/admin/nexus?view=publishing",
    description: "Blog distribution state.",
    icon: <DashboardIcon />,
  },
  {
    key: "reviews",
    label: "Reviews",
    href: "/admin/nexus?view=reviews",
    description: "Review automation queue.",
    icon: <DashboardIcon />,
  },
  {
    key: "connections",
    label: "Connections",
    href: "/admin/nexus?view=connections",
    description: "Provider access status.",
    icon: <DashboardIcon />,
  },
] as const;

const INBOX_VIEWS = [
  {
    key: "quotes",
    label: "Quotes",
    href: "/admin/inbox?tab=quotes",
    description: "Photo-led quote intake.",
    icon: <InboxIcon />,
  },
  {
    key: "bookings",
    label: "Bookings",
    href: "/admin/inbox?tab=bookings",
    description: "Appointments and calendar links.",
    icon: <InboxIcon />,
  },
  {
    key: "contacts",
    label: "Contacts",
    href: "/admin/inbox?tab=contacts",
    description: "General contact messages.",
    icon: <InboxIcon />,
  },
] as const;

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  return (
    <div>
      <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-500">
        {label}
      </p>
      <ul className="grid gap-2 lg:grid-cols-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={[
                "group flex min-h-12 items-center gap-3 rounded-[1.25rem] border px-3 py-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
                item.active
                  ? "border-brand-gold/55 bg-brand-burgundy text-white shadow-[0_14px_28px_rgba(94,34,48,0.20)]"
                  : "border-stone-200 bg-[#faf7f2]/80 text-stone-700 hover:border-brand-gold/45 hover:text-brand-burgundy",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  item.active
                    ? "bg-white/12 text-brand-gold"
                    : "bg-white text-brand-burgundy group-hover:bg-brand-gold/12",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold tracking-[0.01em]">{item.label}</span>
                {item.description ? (
                  <span
                    className={[
                      "mt-0.5 block text-[11px] leading-relaxed",
                      item.active ? "text-white/72" : "text-stone-500",
                    ].join(" ")}
                  >
                    {item.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "overview";
  const currentTab = searchParams.get("tab") || "quotes";

  const workspaceItems: NavItem[] = [
    {
      href: "/admin/nexus",
      label: "Mission Control",
      description: "Primary command room.",
      icon: <DashboardIcon />,
      active: pathname.startsWith("/admin/nexus"),
    },
    {
      href: "/admin/inbox?tab=quotes",
      label: "Inbox",
      description: "Detailed lead triage.",
      icon: <InboxIcon />,
      active: pathname.startsWith("/admin/inbox"),
    },
  ];

  const contextItems: NavItem[] = pathname.startsWith("/admin/inbox")
    ? INBOX_VIEWS.map((item) => ({
        href: item.href,
        label: item.label,
        description: item.description,
        icon: item.icon,
        active: pathname.startsWith("/admin/inbox") && currentTab === item.key,
      }))
    : NEXUS_VIEWS.map((item) => ({
        href: item.href,
        label: item.label,
        description: item.description,
        icon: item.icon,
        active: pathname.startsWith("/admin/nexus") && currentView === item.key,
      }));

  return (
    <aside className="admin-sidebar-shell border-b border-stone-200/80 bg-white/70 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start">
        <Link
          href="/admin/nexus"
          className="inline-flex items-center gap-3 rounded-2xl px-2 py-2 text-stone-900 transition-colors hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-burgundy text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_28px_rgba(94,34,48,0.28)]">
            S
          </span>
          <span className="hidden min-[480px]:block lg:block">
            <span className="block font-serif text-xl leading-none">SJR Nexus</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              Admin workspace
            </span>
          </span>
        </Link>

        <Link
          href="/"
          className="hidden rounded-full border border-brand-gold/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy transition-colors hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 lg:inline-flex"
        >
          View site
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="mt-5 lg:mt-10">
        <div className="space-y-6">
          <NavGroup label="Workspaces" items={workspaceItems} />
          <NavGroup
            label={pathname.startsWith("/admin/inbox") ? "Inbox Sections" : "Mission Control Sections"}
            items={contextItems}
          />
        </div>
      </nav>
    </aside>
  );
}
