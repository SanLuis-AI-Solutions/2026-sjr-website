"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { readCurrentCtaVariant } from "./cta-variant";
import { isProductionAnalyticsHost } from "@/lib/analytics-host";

type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

type FirstTouch = {
  landing_path: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __sjrGaHostAllowed?: boolean;
  }
}

const FIRST_TOUCH_KEY = "sjr_first_touch";
const EVENT_SENT_PREFIX = "sjr_ga4_sent";

function readFirstTouch(): FirstTouch | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirstTouch;
  } catch {
    return null;
  }
}

function writeFirstTouch(firstTouch: FirstTouch) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
}

function getOrCreateFirstTouch(pathname: string, search: URLSearchParams): FirstTouch {
  const existing = readFirstTouch();
  if (existing) return existing;

  const firstTouch: FirstTouch = {
    landing_path: pathname || "/",
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_term: search.get("utm_term"),
    utm_content: search.get("utm_content"),
  };
  writeFirstTouch(firstTouch);
  return firstTouch;
}

function eventKey(eventName: string, submissionId?: string) {
  return `${EVENT_SENT_PREFIX}:${eventName}:${submissionId || "none"}`;
}

function wasEventSent(eventName: string, submissionId?: string) {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(eventKey(eventName, submissionId)) === "1";
}

function markEventSent(eventName: string, submissionId?: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(eventKey(eventName, submissionId), "1");
}

function isGaTrackingAllowed() {
  if (typeof window === "undefined") return false;
  if (typeof window.__sjrGaHostAllowed === "boolean") {
    return window.__sjrGaHostAllowed;
  }
  return isProductionAnalyticsHost(window.location.hostname);
}

function sendGtagEvent(eventName: string, params: GtagEventParams) {
  if (typeof window === "undefined") return;
  if (!isGaTrackingAllowed()) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  // Queue event arguments so events triggered before GA bootstrap are not dropped.
  const queuedArgs: ["event", string, GtagEventParams] = ["event", eventName, params];
  window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  window.dataLayer.push(queuedArgs);
}

function sendPageView(pathname: string, search: string) {
  if (typeof window === "undefined") return;
  if (!isGaTrackingAllowed()) return;

  const pagePath = search ? `${pathname}?${search}` : pathname;
  sendGtagEvent("page_view", {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  });
}

export function trackGaEvent(eventName: string, params: GtagEventParams = {}) {
  const ctaVariant = readCurrentCtaVariant();
  sendGtagEvent(eventName, {
    ...params,
    ...(ctaVariant ? { cta_variant: ctaVariant } : {}),
  });
}

export function GaFirstTouchCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    getOrCreateFirstTouch(pathname || "/", searchParams);
  }, [pathname, searchKey, searchParams]);

  return null;
}

export function GaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const lastPagePathRef = useRef<string>("");

  useEffect(() => {
    const resolvedPathname = pathname || "/";
    const pagePath = searchKey ? `${resolvedPathname}?${searchKey}` : resolvedPathname;
    if (lastPagePathRef.current === pagePath) return;
    lastPagePathRef.current = pagePath;
    sendPageView(resolvedPathname, searchKey);
  }, [pathname, searchKey, searchParams]);

  return null;
}

export function GaConversionTracker({
  active,
  eventName,
  submissionId,
  leadType,
  status,
}: {
  active: boolean;
  eventName: string;
  submissionId?: string;
  leadType: "quote" | "booking" | "contact";
  status: "success" | "pending";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (!active) return;
    if (wasEventSent(eventName, submissionId)) return;

    const firstTouch = getOrCreateFirstTouch(pathname || "/", searchParams);

    const params: GtagEventParams = {
      submission_id: submissionId || null,
      lead_type: leadType,
      lead_status: status,
      landing_path: firstTouch.landing_path,
      utm_source: firstTouch.utm_source,
      utm_medium: firstTouch.utm_medium,
      utm_campaign: firstTouch.utm_campaign,
      utm_term: firstTouch.utm_term,
      utm_content: firstTouch.utm_content,
      page_path: pathname || "/",
      cta_variant: readCurrentCtaVariant(),
    };

    sendGtagEvent(eventName, params);
    markEventSent(eventName, submissionId);
  }, [active, eventName, submissionId, leadType, status, pathname, searchKey, searchParams]);

  return null;
}
