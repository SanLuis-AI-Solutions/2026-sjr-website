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
  const sentKeysRef = useRef<Set<string>>(new Set());
  const finderContext = resolveServicesFinderLeadContext(searchParams);
  const finderAnalyticsParams = getServicesFinderAnalyticsParams(finderContext);

  useEffect(() => {
    if (!hasError) return;
    const key = `error:${pathname || "/"}:${formId}`;
    if (sentKeysRef.current.has(key)) return;

    trackGaEvent("lead_form_error", {
      page_path: pathname || "/",
      form_id: formId,
      lead_type: leadType,
      ...finderAnalyticsParams,
    });
    sentKeysRef.current.add(key);
  }, [finderAnalyticsParams, formId, hasError, leadType, pathname]);

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    const seenFields = new Set<string>();
    let started = false;

    const markStarted = (source: string) => {
      if (started) return;
      started = true;
      const sharedParams = {
        page_path: pathname || "/",
        form_id: formId,
        lead_type: leadType,
        source,
        ...finderAnalyticsParams,
      };
      trackGaEvent("lead_form_start", sharedParams);
      trackGaEvent(`${leadType}_form_start`, sharedParams);
    };

    const onFocusIn = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const fieldName = (target.getAttribute("name") || target.id || target.tagName).toLowerCase();
      if (!fieldName) return;

      markStarted("focus");
      if (seenFields.has(fieldName)) return;
      seenFields.add(fieldName);

      trackGaEvent("lead_form_step", {
        page_path: pathname || "/",
        form_id: formId,
        lead_type: leadType,
        field_name: fieldName,
        ...finderAnalyticsParams,
      });
    };

    const onInput = () => {
      markStarted("input");
    };

    const onSubmit = () => {
      trackGaEvent("lead_form_submit_attempt", {
        page_path: pathname || "/",
        form_id: formId,
        lead_type: leadType,
        ...finderAnalyticsParams,
      });
    };

    form.addEventListener("focusin", onFocusIn);
    form.addEventListener("input", onInput);
    form.addEventListener("submit", onSubmit);

    return () => {
      form.removeEventListener("focusin", onFocusIn);
      form.removeEventListener("input", onInput);
      form.removeEventListener("submit", onSubmit);
    };
  }, [finderAnalyticsParams, formId, leadType, pathname]);

  return null;
}
