import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/services` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/faq` },
    { url: `${baseUrl}/quote` },
    { url: `${baseUrl}/book` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
    { url: `${baseUrl}/blog` },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = (SERVICES || []).map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
  }));

  return [...staticRoutes, ...serviceRoutes];
}

