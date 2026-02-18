import { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded-full bg-brand-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="pt-24 md:pt-28">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
