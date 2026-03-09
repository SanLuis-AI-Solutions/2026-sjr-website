import { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef0eb]">
      <a
        href="#admin-main-content"
        className="pointer-events-none fixed left-4 top-4 z-[999] -translate-y-24 rounded-full bg-brand-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition focus:pointer-events-auto focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
      >
        Skip to admin content
      </a>
      <div className="admin-dashboard-frame lg:grid lg:h-screen lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
        <AdminSidebar />
        <div className="admin-dashboard-main flex min-h-screen flex-col overflow-x-hidden bg-[#faf7f2] lg:h-screen lg:overflow-hidden">
          <AdminTopbar />
          <main
            id="admin-main-content"
            className="flex-1 px-4 py-4 md:px-5 md:py-4 lg:min-h-0 lg:overflow-hidden"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
