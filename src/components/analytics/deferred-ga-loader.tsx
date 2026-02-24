"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __sjrGaLoaded?: boolean;
  }
}

type DeferredGaLoaderProps = {
  measurementId: string;
  idleDelayMs?: number;
};

function ensureGtagStub() {
  window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

export function DeferredGaLoader({
  measurementId,
  idleDelayMs = 15000,
}: DeferredGaLoaderProps) {
  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return;
    if (window.__sjrGaLoaded) return;

    ensureGtagStub();

    const loadGa = () => {
      if (window.__sjrGaLoaded) return;
      window.__sjrGaLoaded = true;

      window.gtag?.("js", new Date());
      window.gtag?.("config", measurementId);

      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.async = true;
      document.head.appendChild(script);
    };

    const onFirstIntent = () => {
      cleanup();
      loadGa();
    };

    const listeners: Array<[keyof WindowEventMap, EventListener, AddEventListenerOptions]> =
      [
        ["pointerdown", onFirstIntent, { once: true, passive: true }],
        ["keydown", onFirstIntent, { once: true, passive: true }],
      ];

    listeners.forEach(([event, handler, options]) => {
      window.addEventListener(event, handler, options);
    });

    const timeoutId = window.setTimeout(onFirstIntent, idleDelayMs);

    const cleanup = () => {
      listeners.forEach(([event, handler]) => {
        window.removeEventListener(event, handler);
      });
      window.clearTimeout(timeoutId);
    };

    return cleanup;
  }, [measurementId, idleDelayMs]);

  return null;
}
