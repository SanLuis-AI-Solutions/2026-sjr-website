import { supabaseGet } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/constants";

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

function mergeServiceRecord(fallback: any, record: any) {
  if (!record) return fallback;

  const merged = { ...fallback, ...record };

  merged.name = withFallbackText(record.name, fallback.name);
  merged.summary = withFallbackText(record.summary, fallback.summary);
  merged.short_summary = withFallbackText(
    record.short_summary,
    fallback.short_summary || fallback.summary
  );

  // Supabase stores these as jsonb arrays. Keep fallback arrays when missing/empty.
  merged.long_description = withFallbackArray<string>(
    record.long_description,
    fallback.long_description || fallback.longDescription || []
  );
  merged.longDescription = withFallbackArray<string>(
    record.longDescription,
    fallback.longDescription || fallback.long_description || []
  );
  merged.includes = withFallbackArray<string>(record.includes, fallback.includes || []);
  merged.common_requests = withFallbackArray<string>(
    record.common_requests,
    fallback.common_requests || fallback.commonRequests || []
  );
  merged.commonRequests = withFallbackArray<string>(
    record.commonRequests,
    fallback.commonRequests || fallback.common_requests || []
  );

  // New UI fields (may not exist in Supabase yet).
  merged.time_estimate = withFallbackText(record.time_estimate, fallback.time_estimate);
  merged.starting_price = record.starting_price ?? fallback.starting_price ?? null;

  return merged;
}

export async function getServices() {
  try {
    const data = await supabaseGet("services", "?select=*&active=eq.true&order=priority.asc");
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
}

export async function getServiceBySlug(slug: string) {
  try {
    const data = await supabaseGet(
      "services",
      `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`
    );
    if (Array.isArray(data) && data[0]) {
      const fallback = SERVICES.find((service) => service.slug === slug);
      return fallback ? mergeServiceRecord(fallback, data[0]) : data[0];
    }
  } catch {
    // ignore
  }

  return SERVICES.find((service) => service.slug === slug);
}

export async function getFaqsByService(slug: string) {
  try {
    const data = await supabaseGet(
      "faqs",
      `?select=*&service_slug=eq.${encodeURIComponent(slug)}&active=eq.true&order=priority.asc`
    );
    if (Array.isArray(data)) return data;
  } catch {
    // ignore
  }

  const fallback = SERVICES.find((service) => service.slug === slug);
  return withFallback(fallback?.faqs || [], []);
}
