import { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 md:pt-28">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
