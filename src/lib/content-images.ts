import { getServices } from "@/lib/content";
import { SERVICES } from "@/lib/constants";
import { cache } from "react";

type ServiceLike = {
  slug?: string;
  image_url?: string | null;
  image?: string | null;
};

export async function resolveServiceImage(service: ServiceLike | null | undefined) {
  if (!service) return null;
  if (service.image_url) return service.image_url;
  if (service.image) return service.image;
  const fallback = SERVICES.find((item) => item.slug === service.slug);
  return fallback?.image || null;
}

export const getServicesWithImages = cache(async function getServicesWithImages() {
  const services = await getServices();
  const resolved = [];
  for (const service of services) {
    const imageUrl = await resolveServiceImage(service);
    resolved.push({ ...service, image_url: imageUrl });
  }
  return resolved;
});
