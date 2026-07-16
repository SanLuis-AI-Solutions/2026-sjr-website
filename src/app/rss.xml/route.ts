import { BLOG_POSTS } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRssDate(value: string) {
  const date = new Date(`${value}T12:00:00-05:00`);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

export function GET() {
  const baseUrl = getSiteUrl();
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const lastBuildDate = sortedPosts[0]?.reviewedAt || sortedPosts[0]?.publishedAt || "2026-07-09";

  const items = sortedPosts.map((post) => {
    const url = `${baseUrl}/blog/${post.slug}`;
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${toRssDate(post.publishedAt)}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml("Susie's Jewelry Repair Blog")}</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml("Repair guidance, pricing context, and in-house jewelry and watch service advice from Susie's Jewelry Repair.")}</description>
    <language>en-us</language>
    <lastBuildDate>${toRssDate(lastBuildDate)}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
