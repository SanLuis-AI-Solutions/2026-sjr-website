"use client";

import { useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/analytics/tracked-link";

const shellClassName =
  "rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function ServicesHubMobileQuickActions() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let teardown = () => {};
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const initObserver = () => {
      if (typeof IntersectionObserver === "undefined") return;

      const node = sentinelRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          setIsPinned(!entry.isIntersecting);
        },
        { threshold: 0.01 }
      );

      observer.observe(node);
      teardown = () => observer.disconnect();
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(initObserver, { timeout: 1500 });
    } else {
      timeoutHandle = window.setTimeout(initObserver, 600);
    }

    return () => {
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
      teardown();
    };
  }, []);

  const placement = isPinned ? "mobile_quick_actions" : "hero";
  const regionClassName = isPinned
    ? `fixed inset-x-4 bottom-4 z-40 ${shellClassName}`
    : shellClassName;

  return (
    <div className="mt-10 min-h-[88px] md:hidden">
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <div
        role="region"
        aria-label="Quick actions"
        data-quick-actions-mode={isPinned ? "fixed" : "inline"}
        className={regionClassName}
      >
        <div className="flex items-center gap-3">
          <TrackedLink
            href="/quote"
            eventName="services_hub_cta_click"
            eventParams={{ placement, cta_target: "quote" }}
            className="flex-1 rounded-full bg-brand-burgundy px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Get Fast Quote
          </TrackedLink>
          <TrackedLink
            href="/book"
            eventName="services_hub_cta_click"
            eventParams={{ placement, cta_target: "book" }}
            className="flex-1 rounded-full border border-brand-gold px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Book Repair
          </TrackedLink>
        </div>
      </div>
    </div>
  );
}
