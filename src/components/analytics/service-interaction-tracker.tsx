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
    const trackerFlag = "sjrServiceTracker";
    const detailSelector = "details[data-track-event],details[data-service-faq-question]";
    const sectionSelector = "[data-service-section]";
    const trackedDetails = new Set<HTMLDetailsElement>();
    const observedSections = new Set<HTMLElement>();
    const sectionObserver = new IntersectionObserver(
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

    const observeSection = (section: HTMLElement) => {
      if (observedSections.has(section)) return;
      observedSections.add(section);
      sectionObserver.observe(section);
    };

    const attachDetailsListener = (details: HTMLDetailsElement) => {
      if (trackedDetails.has(details)) return;
      trackedDetails.add(details);
      details.addEventListener("toggle", onToggle);
    };

    const scanNode = (root: ParentNode | HTMLElement) => {
      if (root instanceof HTMLElement) {
        if (root.matches(sectionSelector)) observeSection(root);
        if (root instanceof HTMLDetailsElement && root.matches(detailSelector)) {
          attachDetailsListener(root);
        }
      }

      root.querySelectorAll<HTMLElement>(sectionSelector).forEach(observeSection);
      root.querySelectorAll<HTMLDetailsElement>(detailSelector).forEach(attachDetailsListener);
    };

    scanNode(document);

    const domObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          scanNode(node);
        });
      }
    });
    if (document.body) {
      domObserver.observe(document.body, { childList: true, subtree: true });
    }

    document.documentElement.dataset[trackerFlag] = "ready";

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
      domObserver.disconnect();
      sectionObserver.disconnect();
      trackedDetails.forEach((details) => details.removeEventListener("toggle", onToggle));
      document.removeEventListener("click", onLinkClick);
      delete document.documentElement.dataset[trackerFlag];
    };
  }, [pathname, serviceSlug]);

  return null;
}
