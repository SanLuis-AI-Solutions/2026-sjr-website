"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

export function BlogTopicFilterTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const pagePath = pathname || "/";
    let teardown = () => { };

    const initTracking = () => {
      const onClick = (event: Event) => {
        const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
          'a[data-track-event="blog_topic_click"]'
        );
        if (!anchor) return;
        const eventName = anchor.dataset.trackEvent;
        if (!eventName) return;
        trackGaEvent(eventName, {
          page_path: pagePath,
          destination: anchor.href,
          topic: anchor.dataset.trackTopic || "",
          placement: anchor.dataset.trackPlacement || "",
        });
      };

      document.addEventListener("click", onClick, { passive: true });
      return () => {
        document.removeEventListener("click", onClick);
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
    let removeLoadListener: (() => void) | undefined;

    const queueInitAfterLoad = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => {
          teardown = initTracking();
        }, { timeout: 3000 });
        return;
      }
      timeoutHandle = window.setTimeout(() => {
        teardown = initTracking();
      }, 1200);
    };

    if (document.readyState === "complete") {
      queueInitAfterLoad();
    } else {
      const onLoad = () => {
        window.removeEventListener("load", onLoad);
        queueInitAfterLoad();
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
      teardown();
    };
  }, [pathname]);

  return null;
}
