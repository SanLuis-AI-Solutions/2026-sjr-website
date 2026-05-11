"use client";

import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function MobileStickyCta() {
  const pathname = usePathname() || "/";
  const hideOnConversionPage = pathname === "/contact" || pathname === "/quote" || pathname === "/book";
  const bookingHref =
    "/book?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=booking_shortcut";

  if (hideOnConversionPage) return null;

  return (
    <div
      role="region"
      aria-label="Mobile booking shortcut"
      className="fixed inset-x-0 bottom-0 z-[115] px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] md:hidden"
    >
      <div className="mx-auto max-w-sm">
        <TrackedLink
          href={bookingHref}
          eventName="mobile_sticky_cta_click"
          eventParams={{ cta_target: "book", placement: "mobile_sticky_bar" }}
          className="micro-interaction inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brand-gold/35 bg-[#120d10]/94 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d10]"
        >
          Book a Repair Today
        </TrackedLink>
      </div>
    </div>
  );
}
