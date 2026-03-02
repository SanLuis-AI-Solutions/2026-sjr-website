import { supabaseGet } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/constants";
import { cache } from "react";

function withFallback<T>(value: T | null | undefined, fallback: T): T {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return fallback;
  }
  return value;
}

function withFallbackText(value: unknown, fallback: string | undefined) {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return fallback;
}

function withFallbackArray<T>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value) && value.length > 0) return value as T[];
  return fallback;
}

function normalizeStringArray(value: unknown): string[] | null {
  // Supabase data can occasionally come back as:
  // - a single-element array containing a JSON stringified array
  // - a JSON stringified array (string)
  // Normalize those cases into a real string[].
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) {
      if (value.length === 1) {
        const s = (value[0] as string).trim();
        if (s.startsWith("[") && s.endsWith("]")) {
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
              return parsed;
            }
          } catch {
            // ignore
          }
        }
      }
      return value as string[];
    }
    return null;
  }

  if (typeof value === "string") {
    const s = value.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
  }

  return null;
}

type ServiceRecord = {
  [key: string]: unknown;
  name?: string;
  summary?: string;
  short_summary?: string;
  long_description?: string[];
  longDescription?: string[];
  includes?: string[];
  common_requests?: string[];
  commonRequests?: string[];
  time_estimate?: string;
  starting_price?: unknown;
};

function mergeServiceRecord(fallback: ServiceRecord, record: ServiceRecord | null | undefined) {
  if (!record) return fallback;

  const merged: ServiceRecord = { ...fallback, ...record };

  merged.name = withFallbackText(record.name, fallback.name);
  merged.summary = withFallbackText(record.summary, fallback.summary);
  merged.short_summary = withFallbackText(
    record.short_summary,
    fallback.short_summary || fallback.summary
  );

  // Supabase stores these as jsonb arrays. Keep fallback arrays when missing/empty.
  merged.long_description = withFallbackArray<string>(
    normalizeStringArray(record.long_description),
    fallback.long_description || fallback.longDescription || []
  );
  merged.longDescription = withFallbackArray<string>(
    normalizeStringArray(record.longDescription),
    fallback.longDescription || fallback.long_description || []
  );
  merged.includes = withFallbackArray<string>(
    normalizeStringArray(record.includes),
    fallback.includes || []
  );
  merged.common_requests = withFallbackArray<string>(
    normalizeStringArray(record.common_requests),
    fallback.common_requests || fallback.commonRequests || []
  );
  merged.commonRequests = withFallbackArray<string>(
    normalizeStringArray(record.commonRequests),
    fallback.commonRequests || fallback.common_requests || []
  );

  // New UI fields (may not exist in Supabase yet).
  merged.time_estimate = withFallbackText(record.time_estimate, fallback.time_estimate);
  merged.starting_price = record.starting_price ?? fallback.starting_price ?? null;

  return merged;
}

export const getServices = cache(async function getServices() {
  try {
    const data = await supabaseGet(
      "services",
      "?select=*&active=eq.true&order=priority.asc",
      { revalidate: 3600, tags: ["content:services"] }
    );
    if (!Array.isArray(data) || data.length === 0) return SERVICES;

    const bySlug = new Map(data.map((item) => [item.slug, item]));
    const merged = SERVICES.map((service) =>
      mergeServiceRecord(service, bySlug.get(service.slug))
    );
    const extras = data.filter((item) => !SERVICES.find((s) => s.slug === item.slug));
    return [...merged, ...extras];
  } catch {
    return SERVICES;
  }
});

export const getServiceBySlug = cache(async function getServiceBySlug(slug: string) {
  try {
    const data = await supabaseGet(
      "services",
      `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { revalidate: 3600, tags: [`content:service:${slug}`] }
    );
    if (Array.isArray(data) && data[0]) {
      const fallback = SERVICES.find((service) => service.slug === slug);
      return fallback ? mergeServiceRecord(fallback, data[0]) : data[0];
    }
  } catch {
    // ignore
  }

  return SERVICES.find((service) => service.slug === slug);
});

export const getFaqsByService = cache(async function getFaqsByService(slug: string) {
  try {
    const data = await supabaseGet(
      "faqs",
      `?select=*&service_slug=eq.${encodeURIComponent(slug)}&active=eq.true&order=priority.asc`,
      { revalidate: 3600, tags: [`content:faqs:${slug}`] }
    );
    if (Array.isArray(data)) return data;
  } catch {
    // ignore
  }

  const fallback = SERVICES.find((service) => service.slug === slug);
  return withFallback(fallback?.faqs || [], []);
});
