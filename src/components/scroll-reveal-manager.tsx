"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
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

    // Streamed Server Components can insert `.reveal-on-scroll` nodes *after* this effect runs.
    // If we don't observe those late nodes, they remain `opacity: 0` indefinitely.
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
      // Next paint (DOM is more likely to include streamed content).
      requestAnimationFrame(observePending);
    };

    // Initial scan.
    observePending();

    const mutationObserver = new MutationObserver(() => {
      scheduleObserve();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
