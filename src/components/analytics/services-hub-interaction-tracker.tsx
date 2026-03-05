"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

export function ServicesHubInteractionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const pagePath = pathname || "/";

    const onLinkClick = (event: Event) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-track-event]");
      if (!anchor) return;

      const eventName = anchor.dataset.trackEvent;
      if (!eventName) return;

      trackGaEvent(eventName, {
        page_path: pagePath,
        destination: anchor.href,
        placement: anchor.dataset.trackPlacement || "",
        cta_target: anchor.dataset.trackTarget || "",
        service_slug: anchor.dataset.trackSlug || "",
        service_name: anchor.dataset.trackServiceName || "",
      });
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
    let removeLoadListener: (() => void) | undefined;
    let attached = false;

    const attachListener = () => {
      if (attached) return;
      attached = true;
      document.addEventListener("click", onLinkClick, { passive: true });
    };

    const queueAttachAfterLoad = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(attachListener, { timeout: 3000 });
        return;
      }
      timeoutHandle = window.setTimeout(attachListener, 1200);
    };

    if (document.readyState === "complete") {
      queueAttachAfterLoad();
    } else {
      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        queueAttachAfterLoad();
      };
      window.addEventListener("load", onLoad);
      removeLoadListener = () => window.removeEventListener("load", onLoad);
    }

    return () => {
      if (removeLoadListener) {
        removeLoadListener();
      }
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
      if (attached) {
        document.removeEventListener("click", onLinkClick);
      }
    };
  }, [pathname]);

  return null;
}
