"use client";

import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function MobileStickyCta() {
  const pathname = usePathname() || "/";
  const hideOnConversionPage = pathname === "/contact" || pathname === "/quote" || pathname === "/book";
  const quoteHref =
    "/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut";

  if (hideOnConversionPage) return null;

  return (
    <div
      role="region"
      aria-label="Mobile booking shortcut"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[115] px-4 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] md:hidden"
    >
      <div className="mx-auto flex justify-center">
        <TrackedLink
          href={quoteHref}
          data-mobile-sticky-cta="quote"
          eventName="mobile_sticky_cta_click"
          eventParams={{ cta_target: "quote", placement: "mobile_sticky_bar" }}
          className="micro-interaction pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold/35 bg-[#120d10]/94 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold shadow-[0_12px_28px_rgba(0,0,0,0.26)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d10]"
        >
          Get Fast Quote
        </TrackedLink>
      </div>
    </div>
  );
}
