"use client";

import { useEffect, useRef, useState } from "react";

type DeferredGoogleMapEmbedProps = {
  embedUrl: string;
  title: string;
};

export function DeferredGoogleMapEmbed({ embedUrl, title }: DeferredGoogleMapEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);

  useEffect(() => {
    if (shouldLoadIframe) return;
    if (typeof IntersectionObserver === "undefined") return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadIframe(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "320px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadIframe]);

  if (shouldLoadIframe) {
    return (
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full overflow-hidden rounded-2xl border border-stone-200 grayscale-[20%] contrast-[1.05]"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-[#f8efe2] via-[#f5ede4] to-[#efe0d0] px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,_rgba(209,184,130,0.22),_transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,_rgba(122,46,58,0.12),_transparent_48%)]" />
      <div className="relative max-w-md space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-burgundy">
          Interactive map
        </p>
        <p className="text-sm leading-7 text-stone-700">
          Load the live map only when you are ready to view directions.
        </p>
        <button
          type="button"
          onClick={() => setShouldLoadIframe(true)}
          className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-burgundy px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy hover:bg-brand-burgundy/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Load Live Map
        </button>
      </div>
    </div>
  );
}

