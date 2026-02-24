"use client";

import { useState } from "react";
import Script from "next/script";
import { SiteShell } from "@/components/site-shell";

export default function ShowroomPage() {
    const [showIframe, setShowIframe] = useState(false);
    // Default URL to be changed by the user later when they get their unique URL
    const stullerUrl = process.env.NEXT_PUBLIC_STULLER_URL || "https://demo-frame-categoryembed.jewelershowcase.com/browse";

    return (
        <SiteShell>
            <div className="bg-[#faf7f2] min-h-screen">
                {/* Luxury Header */}
                <div className="relative overflow-hidden bg-stone-900 py-24 text-center">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.15),_transparent_70%)]" />
                    <div className="relative z-10 mx-auto max-w-4xl px-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                            The Curated Collection
                        </p>
                        <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-[#faf7f2]">
                            Design your future heirloom.
                        </h1>
                        <p className="mt-6 mx-auto max-w-2xl text-stone-300">
                            Explore our master-curated digital showroom featuring thousands of mountings, settings, and bespoke pieces. Find your inspiration, and let our Pasadena workshop bring it to life.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    {!showIframe ? (
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="glass-card rounded-3xl p-12 border border-brand-gold/20 shadow-xl bg-white/60">
                                <span className="flex mx-auto h-16 w-16 items-center justify-center rounded-full bg-brand-burgundy/10 text-brand-burgundy mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                                <h2 className="font-serif text-3xl text-stone-900 mb-4">Enter the Virtual Showroom</h2>
                                <p className="text-stone-600 mb-8 max-w-xl mx-auto">
                                    You are about to enter our extended interactive catalog. This immersive experience allows you to customize metals, stones, and styles in real-time.
                                </p>
                                <button
                                    onClick={() => setShowIframe(true)}
                                    className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-brand-burgundy-deep shadow-lg transition-all"
                                >
                                    Unlock Collection <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-2xl bg-white min-h-[800px] relative">
                            {/* Fallback loader while iframe boots */}
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-0">
                                <div className="flex flex-col items-center animate-pulse">
                                    <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-burgundy rounded-full animate-spin"></div>
                                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-500">Loading Collection...</p>
                                </div>
                            </div>

                            {/* Stuller iFrame */}
                            <iframe
                                className="relative z-10 bg-white"
                                style={{ width: "1px", minWidth: "100%" }}
                                scrolling="yes"
                                width="100%"
                                height="1500px"
                                frameBorder="0"
                                sandbox="allow-scripts allow-forms allow-same-origin"
                                src={stullerUrl}
                            />
                            {/* Stuller script to prevent double scroll mapping */}
                            <Script src="https://assets.jewelershowcase.com/iframe-resizer-parent/main.js" strategy="lazyOnload" />
                        </div>
                    )}
                </div>
            </div>
        </SiteShell>
    );
}
