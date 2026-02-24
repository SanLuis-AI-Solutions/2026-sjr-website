"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    // Keep key SEO/performance routes static to reduce above-the-fold main-thread work.
    const disableRevealForRoute =
      pathname === "/" || pathname.startsWith("/services") || pathname.startsWith("/blog");

    if (disableRevealForRoute) {
      root.classList.remove("reveal-ready");
      root.classList.add("reveal-disabled");
      return;
    }

    root.classList.remove("reveal-disabled");

    const init = () => {
      root.classList.add("reveal-ready");

      const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const getElements = () =>
        Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));

      const elements = getElements();
      if (elements.length === 0) return;

      if (prefersReduced) {
        elements.forEach((el) => el.classList.add("reveal-visible"));
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        elements.forEach((el) => el.classList.add("reveal-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      let scheduled = false;
      const observePending = () => {
        scheduled = false;
        getElements().forEach((el) => {
          if (!el.classList.contains("reveal-visible")) observer.observe(el);
        });
      };

      const scheduleObserve = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(observePending);
      };

      observePending();

      const mutationObserver = new MutationObserver(() => {
        scheduleObserve();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        mutationObserver.disconnect();
        observer.disconnect();
      };
    };

    // Defer execution until the main thread is idle
    let cleanup: (() => void) | undefined;
    const idleId = (window.requestIdleCallback || ((cb: any) => setTimeout(cb, 100)))(() => {
      cleanup = init();
    });

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as any);
      }
      if (cleanup) cleanup();
    };
  }, [pathname]);

  return null;
}
