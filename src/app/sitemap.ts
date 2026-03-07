import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
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

  const serviceAreaRoutes: MetadataRoute.Sitemap = (SERVICE_AREA_PAGES || []).map((page) => ({
    url: `${baseUrl}/services/${page.slug}`,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (BLOG_POSTS || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  return [...staticRoutes, ...serviceRoutes, ...serviceAreaRoutes, ...blogRoutes];
}
