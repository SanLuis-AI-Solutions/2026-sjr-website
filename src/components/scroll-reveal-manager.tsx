"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll")
    );

    if (elements.length === 0) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    // On route transitions, this component remains mounted, but the DOM changes.
    // Re-scan and observe any new elements that haven't been revealed yet.
    elements.forEach((el) => {
      if (!el.classList.contains("reveal-visible")) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
