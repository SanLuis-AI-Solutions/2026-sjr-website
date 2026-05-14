"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";
import {
  getServicesFinderAnalyticsParams,
  resolveServicesFinderLeadContext,
} from "@/lib/service-lead-context";

type LeadType = "quote" | "booking" | "contact";

type LeadFormTrackerProps = {
  formId: string;
  leadType: LeadType;
  hasError: boolean;
};

export function LeadFormTracker({ formId, leadType, hasError }: LeadFormTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const sentKeysRef = useRef<Set<string>>(new Set());
  const finderContext = resolveServicesFinderLeadContext(searchParams);
  const finderAnalyticsParams = getServicesFinderAnalyticsParams(finderContext);
  const pagePath = searchKey ? `${pathname || "/"}?${searchKey}` : pathname || "/";

  useEffect(() => {
    if (!hasError) return;
    const key = `error:${pathname || "/"}:${formId}`;
    if (sentKeysRef.current.has(key)) return;

    trackGaEvent("lead_form_error", {
      page_path: pathname || "/",
      page_path_with_query: pagePath,
      form_id: formId,
      lead_type: leadType,
      ...finderAnalyticsParams,
    });
    sentKeysRef.current.add(key);
  }, [finderAnalyticsParams, formId, hasError, leadType, pagePath, pathname]);

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    const sharedParams = {
      page_path: pathname || "/",
      page_path_with_query: pagePath,
      page_location:
        typeof window !== "undefined" ? `${window.location.origin}${pagePath}` : pagePath,
      form_id: formId,
      lead_type: leadType,
      ...finderAnalyticsParams,
    };
    let viewed = false;
    const seenFields = new Set<string>();
    let started = false;

    const markViewed = (source: string) => {
      if (viewed) return;
      viewed = true;
      trackGaEvent("lead_form_view", { ...sharedParams, source });
      trackGaEvent(`${leadType}_form_view`, { ...sharedParams, source });
    };

    const markStarted = (source: string) => {
      if (started) return;
      started = true;
      trackGaEvent("lead_form_start", { ...sharedParams, source });
      trackGaEvent(`${leadType}_form_start`, { ...sharedParams, source });
    };

    const isFormVisible = () => {
      const rect = form.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < viewportHeight * 0.85 && rect.bottom > viewportHeight * 0.15;
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            markViewed("viewport");
            observer?.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(form);
    } else if (isFormVisible()) {
      markViewed("viewport_fallback");
    }

    const onFocusIn = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const fieldName = (target.getAttribute("name") || target.id || target.tagName).toLowerCase();
      if (!fieldName) return;

      markViewed("focus");
      markStarted("focus");
      if (seenFields.has(fieldName)) return;
      seenFields.add(fieldName);

      trackGaEvent("lead_form_step", {
        page_path: pathname || "/",
        page_path_with_query: pagePath,
        form_id: formId,
        lead_type: leadType,
        field_name: fieldName,
        ...finderAnalyticsParams,
      });
    };

    const onInput = () => {
      markViewed("input");
      markStarted("input");
    };

    const onSubmit = () => {
      trackGaEvent("lead_form_submit_attempt", {
        page_path: pathname || "/",
        page_path_with_query: pagePath,
        form_id: formId,
        lead_type: leadType,
        ...finderAnalyticsParams,
      });
    };

    form.addEventListener("focusin", onFocusIn);
    form.addEventListener("input", onInput);
    form.addEventListener("submit", onSubmit);

    return () => {
      observer?.disconnect();
      form.removeEventListener("focusin", onFocusIn);
      form.removeEventListener("input", onInput);
      form.removeEventListener("submit", onSubmit);
    };
  }, [finderAnalyticsParams, formId, leadType, pagePath, pathname]);

  return null;
}
