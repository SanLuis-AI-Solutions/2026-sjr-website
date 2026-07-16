"use client";

import { useEffect, useState } from "react";
import { ScrollRevealManager } from "@/components/scroll-reveal-manager";
import { SiteAnalytics } from "@/components/analytics/ga-tracker";

export function NonCriticalClientHelpers({
  analyticsEnabled,
}: {
  analyticsEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const activate = () => setEnabled(true);

    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => activate());
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(activate, 150);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <ScrollRevealManager />
      {analyticsEnabled ? <SiteAnalytics /> : null}
    </>
  );
}
