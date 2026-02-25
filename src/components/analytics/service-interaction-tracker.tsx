"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

type ServiceInteractionTrackerProps = {
  serviceSlug: string;
};

export function ServiceInteractionTracker({ serviceSlug }: ServiceInteractionTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new Set<string>();
    const pagePath = pathname || "/";
    let teardown = () => { };

    const initTracking = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-service-section]")
      );
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.45) continue;
            const sectionId = (entry.target as HTMLElement).dataset.serviceSection;
            if (!sectionId) continue;
            const key = `section:${sectionId}`;
            if (seen.has(key)) continue;
            seen.add(key);
            trackGaEvent("service_section_view", {
              page_path: pagePath,
              service_slug: serviceSlug,
              section_id: sectionId,
            });
          }
        },
        { threshold: [0.45] }
      );

      sections.forEach((section) => observer.observe(section));

      const detailsNodes = Array.from(
        document.querySelectorAll<HTMLDetailsElement>(
          "details[data-track-event],details[data-service-faq-question]"
        )
      );

      const onToggle = (event: Event) => {
        const details = event.currentTarget as HTMLDetailsElement | null;
        if (!details || !details.open) return;

        const trackedEventName = details.dataset.trackEvent;
        if (trackedEventName) {
          const detailId = details.dataset.trackId || trackedEventName;
          const key = `detail:${detailId}`;
          if (!seen.has(key)) {
            seen.add(key);
            trackGaEvent(trackedEventName, {
              page_path: pagePath,
              service_slug: serviceSlug,
            });
          }
        }

        const faqQuestion = details.dataset.serviceFaqQuestion;
        if (faqQuestion) {
          const key = `faq:${faqQuestion}`;
          if (seen.has(key)) return;
          seen.add(key);
          trackGaEvent("service_faq_open", {
            page_path: pagePath,
            service_slug: serviceSlug,
            question: faqQuestion,
          });
        }
      };

      detailsNodes.forEach((details) => details.addEventListener("toggle", onToggle));

      // Capture clicks on plain Link elements that have data-track-event (replacing TrackedLink).
      const onLinkClick = (event: Event) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-track-event]");
        if (!anchor) return;
        const eventName = anchor.dataset.trackEvent;
        if (!eventName) return;
        trackGaEvent(eventName, {
          page_path: pagePath,
          service_slug: anchor.dataset.trackSlug || serviceSlug,
          placement: anchor.dataset.trackPlacement || "",
          cta_target: anchor.dataset.trackTarget || "",
          destination: anchor.href,
        });
      };
      document.addEventListener("click", onLinkClick, { passive: true });

      return () => {
        observer.disconnect();
        detailsNodes.forEach((details) => details.removeEventListener("toggle", onToggle));
        document.removeEventListener("click", onLinkClick);
      };
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => {
        teardown = initTracking();
      }, { timeout: 1200 });
    } else {
      timeoutHandle = window.setTimeout(() => {
        teardown = initTracking();
      }, 250);
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
  }, [pathname, serviceSlug]);

  return null;
}
