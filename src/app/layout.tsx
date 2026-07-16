import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { defaultShareImagePath } from "@/lib/metadata";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { GaHeadScripts } from "@/components/analytics/ga-head-scripts";
import { NonCriticalClientHelpers } from "@/components/non-critical-client-helpers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const DEFAULT_TITLE = "Susie’s Jewelry Repair | Modern Luxury Master Craftsmanship";
const DEFAULT_DESCRIPTION =
  "Expert in-house jewelry, watch, and eyeglass repairs in Pasadena. Experience modern luxury meets master craftsmanship with transparent pricing and fast turnaround.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "Susie’s Jewelry Repair",
    type: "website",
    images: [
      {
        url: defaultShareImagePath,
        width: 1200,
        height: 630,
        alt: "Susie’s Jewelry Repair",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [defaultShareImagePath],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>{gaMeasurementId ? <GaHeadScripts measurementId={gaMeasurementId} /> : null}</head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
        <LocalBusinessSchema />
        <Suspense fallback={null}>
          <NonCriticalClientHelpers analyticsEnabled={Boolean(gaMeasurementId)} />
        </Suspense>
      </body>
    </html>
  );
}
