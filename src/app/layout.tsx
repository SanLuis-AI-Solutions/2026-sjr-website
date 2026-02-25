import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { LocalBusinessSchema } from "@/components/local-business-schema";

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

const CRITICAL_REVEAL_GUARD_SCRIPT = `(() => {
  const pathname = location.pathname.length > 1 && location.pathname.endsWith("/")
    ? location.pathname.slice(0, -1)
    : location.pathname;
  const disableReveal = pathname === "/" || pathname.startsWith("/services") || pathname.startsWith("/blog");
  if (!disableReveal) return;
  const root = document.documentElement;
  root.classList.remove("reveal-ready");
  root.classList.add("reveal-disabled");
})();`;

function getRuntimeEnhancementsScript(measurementId?: string) {
  return `(() => {
    const measurementId = ${JSON.stringify(measurementId ?? "")};
    const pathname = location.pathname.length > 1 && location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const disableReveal = pathname === "/" || pathname.startsWith("/services") || pathname.startsWith("/blog");
    const root = document.documentElement;

    if (!disableReveal) {
      const initReveal = () => {
        root.classList.remove("reveal-disabled");
        root.classList.add("reveal-ready");

        const prefersReduced =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const getElements = () =>
          Array.from(document.querySelectorAll(".reveal-on-scroll"));

        const elements = getElements();
        if (elements.length === 0) return;

        if (prefersReduced || typeof IntersectionObserver === "undefined") {
          elements.forEach((el) => el.classList.add("reveal-visible"));
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        let scheduled = false;
        const observePending = () => {
          scheduled = false;
          getElements().forEach((el) => {
            if (!el.classList.contains("reveal-visible")) observer.observe(el);
          });
        };

        const scheduleObserve = () => {
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(observePending);
        };

        observePending();

        const mutationObserver = new MutationObserver(() => {
          scheduleObserve();
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      };

      if (window.requestIdleCallback) {
        window.requestIdleCallback(initReveal);
      } else {
        window.setTimeout(initReveal, 100);
      }
    }

    if (!measurementId || window.__sjrGaLoaded) return;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: CRITICAL_REVEAL_GUARD_SCRIPT }} />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
        <LocalBusinessSchema />
        <script
          dangerouslySetInnerHTML={{
            __html: getRuntimeEnhancementsScript(gaMeasurementId),
          }}
        />
      </body>
    </html>
  );
}
