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
    ];
  },
};

export default nextConfig;
