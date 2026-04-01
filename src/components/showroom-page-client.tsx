"use client";

import { useState } from "react";
import Script from "next/script";
import { SiteShell } from "@/components/site-shell";

export function ShowroomPageClient() {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const stullerUrl = "https://susiesjewelryrepair-frame-categoryembed.jewelershowcase.com/browse";

  return (
    <SiteShell>
      <div className="min-h-screen bg-[#faf7f2]">
        <div className="relative overflow-hidden bg-stone-900 py-24 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.15),_transparent_70%)]" />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-gold reveal-on-scroll">
              Custom Design Showcase
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[#faf7f2] reveal-on-scroll md:text-5xl lg:text-6xl">
              Design your future heirloom.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-stone-300 reveal-on-scroll">
              Browse mountings, settings, and bespoke inspiration in our digital showcase, then let
              our Pasadena workshop turn the right direction into a finished piece.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {!showIframe ? (
            <div className="mx-auto max-w-5xl">
              <div className="mb-16 grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Find your direction",
                    desc: "Browse thousands of settings, mountings, and design foundations at your own pace.",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    ),
                  },
                  {
                    step: "02",
                    title: "Refine the details",
                    desc: "Compare metals, stones, and silhouettes in real time until the piece feels like yours.",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    ),
                  },
                  {
                    step: "03",
                    title: "Build it with Susie",
                    desc: "When you find the right direction, our in-house team sources, guides, and finishes the piece locally.",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                      </svg>
                    ),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-3xl border border-stone-200 bg-white/70 p-8 shadow-sm reveal-on-scroll"
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-burgundy font-serif text-lg text-white shadow-md">
                        {item.step}
                      </span>
                      <div className="text-brand-burgundy/40">{item.icon}</div>
                    </div>
                    <h3 className="mb-2 font-serif text-xl text-stone-900">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-stone-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="group inline-block overflow-hidden rounded-full border border-brand-gold/20 bg-white/40 p-2 shadow-xl">
                  <button
                    onClick={() => setShowIframe(true)}
                    className="micro-interaction flex items-center justify-center rounded-full bg-brand-burgundy px-12 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 group-hover:px-14 hover:bg-brand-burgundy-deep"
                  >
                    Explore the Showcase
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-3 h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
                <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                  Trusted by Pasadena families since 1984
                </p>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[900px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl transition-all duration-700">
              {iframeLoading ? (
                <div className="absolute inset-0 z-20 bg-white p-8">
                  <div className="animate-pulse space-y-8">
                    <div className="mx-auto h-12 w-3/4 rounded-xl bg-stone-100" />
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-64 rounded-2xl bg-stone-50" />
                      ))}
                    </div>
                    <div className="h-96 rounded-3xl bg-stone-50" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold/30 border-t-brand-burgundy" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-burgundy">
                      Loading the showcase...
                    </p>
                  </div>
                </div>
              ) : null}

              <iframe
                id="stuller-showcase"
                className={`relative z-10 bg-white transition-opacity duration-1000 ${iframeLoading ? "opacity-0" : "opacity-100"}`}
                style={{ width: "1px", minWidth: "100%" }}
                scrolling="yes"
                width="100%"
                height="1500px"
                frameBorder="0"
                sandbox="allow-scripts allow-forms allow-same-origin"
                src={stullerUrl}
                onLoad={() => setIframeLoading(false)}
              />
              <Script src="https://assets.jewelershowcase.com/iframe-resizer-parent/main.js" strategy="lazyOnload" />
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
