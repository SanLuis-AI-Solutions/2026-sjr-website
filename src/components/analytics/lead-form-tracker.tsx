"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";

type LeadType = "quote" | "booking" | "contact";

type LeadFormTrackerProps = {
  formId: string;
  leadType: LeadType;
  hasError: boolean;
};

export function LeadFormTracker({ formId, leadType, hasError }: LeadFormTrackerProps) {
  const pathname = usePathname();
  const sentKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hasError) return;
    const key = `error:${pathname || "/"}:${formId}`;
    if (sentKeysRef.current.has(key)) return;

    trackGaEvent("lead_form_error", {
      page_path: pathname || "/",
      form_id: formId,
      lead_type: leadType,
    });
    sentKeysRef.current.add(key);
  }, [formId, hasError, leadType, pathname]);

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    const seenFields = new Set<string>();
    let started = false;

    const markStarted = (source: string) => {
      if (started) return;
      started = true;
      trackGaEvent("lead_form_start", {
        page_path: pathname || "/",
        form_id: formId,
        lead_type: leadType,
        source,
      });
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
  }, [formId, leadType, pathname]);

  return null;
}
