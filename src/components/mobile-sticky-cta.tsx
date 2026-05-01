"use client";

import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function MobileStickyCta() {
  const pathname = usePathname() || "/";
  const hideOnConversionPage = pathname === "/quote" || pathname === "/book";

  if (hideOnConversionPage) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[115] border-t border-brand-gold/25 bg-[#120d10]/94 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <TrackedLink
          href="/quote"
          eventName="mobile_sticky_cta_click"
          eventParams={{ cta_target: "quote", placement: "mobile_sticky_bar" }}
          className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#181112] shadow-[0_12px_28px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d10]"
        >
          Quote
        </TrackedLink>
        <TrackedLink
          href="/book"
          eventName="mobile_sticky_cta_click"
          eventParams={{ cta_target: "book", placement: "mobile_sticky_bar" }}
          className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-white/22 bg-white/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d10]"
        >
          Book
        </TrackedLink>
      </div>
    </div>
  );
}
