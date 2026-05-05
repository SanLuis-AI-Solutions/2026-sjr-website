"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { readCurrentCtaVariant } from "./cta-variant";
import { isProductionAnalyticsHost } from "@/lib/analytics-host";
import { readFirstTouch, writeFirstTouch, type FirstTouch } from "@/lib/first-touch";
import {
  getServicesFinderAnalyticsParams,
  resolveServicesFinderLeadContext,
} from "@/lib/service-lead-context";

type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __sjrGaHostAllowed?: boolean;
  }
}

const EVENT_SENT_PREFIX = "sjr_ga4_sent";

function getOrCreateFirstTouch(pathname: string, search: URLSearchParams): FirstTouch {
  const existing = readFirstTouch();
  if (existing) return existing;

  const firstTouch: FirstTouch = {
    landing_path: pathname || "/",
    landing_search: search.toString() ? `?${search.toString()}` : null,
    referrer: document.referrer || null,
    utm_source: search.get("utm_source"),
    utm_medium: search.get("utm_medium"),
    utm_campaign: search.get("utm_campaign"),
    utm_term: search.get("utm_term"),
    utm_content: search.get("utm_content"),
    utm_id: search.get("utm_id"),
    gclid: search.get("gclid"),
    gbraid: search.get("gbraid"),
    wbraid: search.get("wbraid"),
    msclkid: search.get("msclkid"),
    first_touch_at: new Date().toISOString(),
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
  const finderContext = resolveServicesFinderLeadContext(searchParams);
  const finderAnalyticsParams = getServicesFinderAnalyticsParams(finderContext);

  useEffect(() => {
    if (!active) return;
    if (wasEventSent(eventName, submissionId)) return;

    const firstTouch = getOrCreateFirstTouch(pathname || "/", searchParams);

    const params: GtagEventParams = {
      submission_id: submissionId || null,
      lead_type: leadType,
      lead_status: status,
      landing_path: firstTouch.landing_path,
      landing_search: firstTouch.landing_search,
      referrer: firstTouch.referrer,
      utm_source: firstTouch.utm_source,
      utm_medium: firstTouch.utm_medium,
      utm_campaign: firstTouch.utm_campaign,
      utm_term: firstTouch.utm_term,
      utm_content: firstTouch.utm_content,
      utm_id: firstTouch.utm_id,
      gclid: firstTouch.gclid,
      gbraid: firstTouch.gbraid,
      wbraid: firstTouch.wbraid,
      msclkid: firstTouch.msclkid,
      first_touch_at: firstTouch.first_touch_at,
      page_path: pathname || "/",
      cta_variant: readCurrentCtaVariant(),
      ...finderAnalyticsParams,
    };

    sendGtagEvent(eventName, params);
    markEventSent(eventName, submissionId);
  }, [
    active,
    eventName,
    submissionId,
    leadType,
    status,
    pathname,
    searchKey,
    searchParams,
    finderAnalyticsParams,
  ]);

  return null;
}
