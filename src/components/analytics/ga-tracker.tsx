"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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

function sendGtagEvent(eventName: string, params: GtagEventParams) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  // Queue event arguments so events triggered before GA bootstrap are not dropped.
  const queuedArgs: ["event", string, GtagEventParams] = ["event", eventName, params];
  window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
  window.dataLayer.push(queuedArgs);
}

export function trackGaEvent(eventName: string, params: GtagEventParams = {}) {
  sendGtagEvent(eventName, params);
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
    };

    sendGtagEvent(eventName, params);
    markEventSent(eventName, submissionId);
  }, [active, eventName, submissionId, leadType, status, pathname, searchKey, searchParams]);

  return null;
}
