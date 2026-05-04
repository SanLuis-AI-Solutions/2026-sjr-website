import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lrzrltjlfvvrdvxqqklm.supabase.co",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "susiesjewelryrepair.com",
          },
        ],
        destination: "https://www.susiesjewelryrepair.com/:path*",
        permanent: true,
      },
      {
        source: "/services/ring-resizing",
        destination: "/services/ring-sizing",
        permanent: true,
      },
      {
        source: "/services/custom-engagement-rings",
        destination: "/services/custom-design",
        permanent: true,
      },
      {
        source: "/services/necklace-bracelet-repair",
        destination: "/services/necklace-repair",
        permanent: true,
      },
      {
        source: "/services/necklace-chain-repair",
        destination: "/services/necklace-repair",
        permanent: true,
      },
      {
        source: "/services/jewelry-appraisals",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/engraving",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/ring-sizing-repair",
        destination: "/services/ring-sizing",
        permanent: true,
      },
      {
        source: "/book-online",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/book-online/:path*",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/booking-form",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/booking-form/:path*",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/booking-calendar",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/booking-calendar/:path*",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/watch-repair-battery",
        destination: "/services/watch-repair",
        permanent: true,
      },
      {
        source: "/necklace-bracelet-repair",
        destination: "/services/necklace-repair",
        permanent: true,
      },
      {
        source: "/custom-work-restorations",
        destination: "/services/heirloom-restoration",
        permanent: true,
      },
      {
        source: "/accessibility",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/blank-2",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
