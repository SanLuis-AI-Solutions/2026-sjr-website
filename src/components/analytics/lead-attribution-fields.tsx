"use client";

import { useEffect, useRef } from "react";
import { readFirstTouch, type FirstTouch } from "@/components/analytics/ga-tracker";

type LeadAttributionFields = {
  landing_path: string;
  landing_search: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_id: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  first_touch_at: string;
  submit_path: string;
};

const FIELD_KEYS = [
  "landing_path",
  "landing_search",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "first_touch_at",
  "submit_path",
] as const;

function value(firstTouch: FirstTouch | null, key: keyof FirstTouch) {
  return firstTouch?.[key] || "";
}

export function LeadAttributionFields() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstTouch = readFirstTouch();
    const currentParams = new URLSearchParams(window.location.search);
    const paramValue = (key: string) => value(firstTouch, key as keyof FirstTouch) || currentParams.get(key) || "";
    const fields: LeadAttributionFields = {
      landing_path: value(firstTouch, "landing_path") || window.location.pathname,
      landing_search: value(firstTouch, "landing_search") || window.location.search,
      referrer: value(firstTouch, "referrer") || document.referrer || "",
      utm_source: paramValue("utm_source"),
      utm_medium: paramValue("utm_medium"),
      utm_campaign: paramValue("utm_campaign"),
      utm_term: paramValue("utm_term"),
      utm_content: paramValue("utm_content"),
      utm_id: paramValue("utm_id"),
      gclid: paramValue("gclid"),
      gbraid: paramValue("gbraid"),
      wbraid: paramValue("wbraid"),
      msclkid: paramValue("msclkid"),
      first_touch_at: value(firstTouch, "first_touch_at"),
      submit_path: `${window.location.pathname}${window.location.search}`,
    };

    for (const [key, fieldValue] of Object.entries(fields)) {
      const input = containerRef.current?.querySelector<HTMLInputElement>(
        `input[name="attribution_${key}"]`,
      );
      if (input) input.value = fieldValue;
    }
  }, []);

  return (
    <div ref={containerRef} hidden>
      {FIELD_KEYS.map((key) => (
        <input
          key={key}
          type="hidden"
          name={`attribution_${key}`}
          defaultValue=""
        />
      ))}
    </div>
  );
}
