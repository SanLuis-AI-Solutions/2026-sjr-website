import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const BUSINESS_NAME = "Susie’s Jewelry Repair";
const DEFAULT_SHARE_IMAGE_PATH = "/opengraph-image";

type PageMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: "website" | "article";
};

function resolveAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function createPageMetadata({
  title,
  description,
  canonical,
  image = DEFAULT_SHARE_IMAGE_PATH,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = resolveAbsoluteUrl(canonical);
  const imageUrl = resolveAbsoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": `${getSiteUrl()}/rss.xml`,
      },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: BUSINESS_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const defaultShareImagePath = DEFAULT_SHARE_IMAGE_PATH;
