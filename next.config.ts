import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://assets.jewelershowcase.com",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://lrzrltjlfvvrdvxqqklm.supabase.co",
      "frame-src 'self' https://assets.jewelershowcase.com https://www.google.com",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
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
