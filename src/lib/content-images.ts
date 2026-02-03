import { getServices } from "@/lib/content";
import { SERVICES } from "@/lib/constants";

export async function resolveServiceImage(service) {
  if (!service) return null;
  if (service.image_url) return service.image_url;
  if (service.image) return service.image;
  const fallback = SERVICES.find((item) => item.slug === service.slug);
  return fallback?.image || null;
}

export async function getServicesWithImages() {
  const services = await getServices();
  const resolved = [];
  for (const service of services) {
    const imageUrl = await resolveServiceImage(service);
    resolved.push({ ...service, image_url: imageUrl });
  }
  return resolved;
}
