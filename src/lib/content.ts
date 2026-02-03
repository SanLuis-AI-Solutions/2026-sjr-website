import { supabaseGet } from "@/lib/supabase/server";
import { SERVICES } from "@/lib/constants";

function withFallback(value, fallback) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return fallback;
  }
  return value;
}

export async function getServices() {
  try {
    const data = await supabaseGet("services", "?select=*&active=eq.true&order=priority.asc");
    if (!Array.isArray(data) || data.length === 0) return SERVICES;

    const bySlug = new Map(data.map((item) => [item.slug, item]));
    const merged = SERVICES.map((service) => bySlug.get(service.slug) || service);
    const extras = data.filter((item) => !SERVICES.find((s) => s.slug === item.slug));
    return [...merged, ...extras];
  } catch {
    return SERVICES;
  }
}

export async function getServiceBySlug(slug) {
  try {
    const data = await supabaseGet(
      "services",
      `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`
    );
    if (Array.isArray(data) && data[0]) return data[0];
  } catch {
    // ignore
  }

  return SERVICES.find((service) => service.slug === slug);
}

export async function getFaqsByService(slug) {
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
