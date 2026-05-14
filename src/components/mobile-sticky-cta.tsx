"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function MobileStickyCta() {
  const pathname = usePathname() || "/";
  const [isVisible, setIsVisible] = useState(false);
  const hideOnConversionPage = pathname === "/contact" || pathname === "/quote" || pathname === "/book";
  const quoteHref =
    "/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut#quote-form";

  useEffect(() => {
    const updateVisibility = () => {
      const revealAfter = Math.min(720, window.innerHeight * 0.9);
      setIsVisible(window.scrollY > revealAfter);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (hideOnConversionPage || !isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Mobile quote shortcut"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[115] px-4 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] md:hidden"
    >
      <div className="mx-auto flex justify-center">
        <TrackedLink
          href={quoteHref}
          data-mobile-sticky-cta="quote"
          eventName="mobile_sticky_cta_click"
          eventParams={{ cta_target: "quote", placement: "mobile_sticky_bar" }}
          aria-label="Start Quote from mobile shortcut"
          className="micro-interaction pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold/30 bg-[#120d10]/92 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-[0_8px_18px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d10]"
        >
          60-sec Quote
        </TrackedLink>
      </div>
    </div>
  );
}
