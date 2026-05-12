import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_LAST_MODIFIED = new Date("2026-04-21T12:00:00-05:00");
const SERVICE_LAST_MODIFIED = new Date("2026-05-12T12:00:00-05:00");

function getBlogLastModified(dateValue: string) {
  const parsed = new Date(`${dateValue}T12:00:00-05:00`);
  return Number.isNaN(parsed.getTime()) ? STATIC_LAST_MODIFIED : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/services`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/about`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/faq`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/quote`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/book`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/contact`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/privacy`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/terms`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/blog`, lastModified: STATIC_LAST_MODIFIED },
    { url: `${baseUrl}/site-map`, lastModified: SERVICE_LAST_MODIFIED },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = (SERVICES || []).map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: SERVICE_LAST_MODIFIED,
  }));

  const serviceAreaRoutes: MetadataRoute.Sitemap = (SERVICE_AREA_PAGES || []).map((page) => ({
    url: `${baseUrl}/services/${page.slug}`,
    lastModified: SERVICE_LAST_MODIFIED,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (BLOG_POSTS || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: getBlogLastModified(post.reviewedAt || post.publishedAt),
  }));

  return [...staticRoutes, ...serviceRoutes, ...serviceAreaRoutes, ...blogRoutes];
}
