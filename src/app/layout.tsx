import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { ScrollRevealManager } from "@/components/scroll-reveal-manager";

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

function getGaBootstrapScript(measurementId: string) {
  return `(() => {
    const measurementId = ${JSON.stringify(measurementId)};
    if (window.__sjrGaLoaded) return;

    window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    if (typeof window.gtag !== "function") {
      window.gtag = (...args) => {
        window.dataLayer.push(args);
      };
    }

    const loadGa = () => {
      if (window.__sjrGaLoaded) return;
      window.__sjrGaLoaded = true;
      window.gtag("js", new Date());
      window.gtag("config", measurementId);

      const script = document.createElement("script");
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
      script.async = true;
      document.head.appendChild(script);
    };

    const onFirstIntent = () => {
      cleanup();
      loadGa();
    };

    const listeners = [
      ["pointerdown", onFirstIntent, { once: true, passive: true }],
      ["keydown", onFirstIntent, { once: true, passive: true }],
    ];

    listeners.forEach(([eventName, handler, options]) => {
      window.addEventListener(eventName, handler, options);
    });

    const timeoutId = window.setTimeout(onFirstIntent, 15000);

    const cleanup = () => {
      listeners.forEach(([eventName, handler]) => {
        window.removeEventListener(eventName, handler);
      });
      window.clearTimeout(timeoutId);
    };
  })();`;
}

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
          <script
            dangerouslySetInnerHTML={{
              __html: getGaBootstrapScript(gaMeasurementId),
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
