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
    const requestIdle = window.requestIdleCallback
      ? (cb: IdleRequestCallback) => window.requestIdleCallback(cb)
      : (cb: IdleRequestCallback) =>
          window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 100);
    const cancelIdle = window.cancelIdleCallback
      ? (id: number) => window.cancelIdleCallback(id)
      : (id: number) => window.clearTimeout(id);
    const idleId = requestIdle(() => {
      cleanup = init();
    });

    return () => {
      cancelIdle(idleId);
      if (cleanup) cleanup();
    };
  }, [pathname]);

  return null;
}
