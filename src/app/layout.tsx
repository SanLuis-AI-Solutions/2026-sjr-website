import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { ScrollRevealManager } from "@/components/scroll-reveal-manager";
import { GaFirstTouchCapture, GaPageViewTracker } from "@/components/analytics/ga-tracker";
import { DeferredGaLoader } from "@/components/analytics/deferred-ga-loader";

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Susie’s Jewelry Repair | Modern Luxury Master Craftsmanship",
  description:
    "Expert in-house jewelry, watch, and eyeglass repairs in Pasadena. Experience modern luxury meets master craftsmanship with transparent pricing and fast turnaround.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
        <ScrollRevealManager />
        <LocalBusinessSchema />
        {gaMeasurementId ? (
          <Suspense fallback={null}>
            <DeferredGaLoader measurementId={gaMeasurementId} />
            <GaFirstTouchCapture />
            <GaPageViewTracker />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
