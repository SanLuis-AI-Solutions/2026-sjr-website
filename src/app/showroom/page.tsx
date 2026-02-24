"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { SiteShell } from "@/components/site-shell";

export default function ShowroomPage() {
    const [showIframe, setShowIframe] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);

    // White-Label URL: Appending -frame-categoryembed removes the Stuller header
    const stullerUrl = "https://susiesjewelryrepair-frame-categoryembed.jewelershowcase.com/browse";

    return (
        <SiteShell>
            <div className="bg-[#faf7f2] min-h-screen">
                {/* Luxury Header */}
                <div className="relative overflow-hidden bg-stone-900 py-24 text-center">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.15),_transparent_70%)]" />
                    <div className="relative z-10 mx-auto max-w-4xl px-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-brand-gold reveal-on-scroll">
                            The Boutique Collection
                        </p>
                        <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-[#faf7f2] reveal-on-scroll">
                            Design your future heirloom.
                        </h1>
                        <p className="mt-6 mx-auto max-w-2xl text-stone-300 reveal-on-scroll">
                            Explore our master-curated digital showroom featuring thousands of mountings, settings, and bespoke pieces. Find your inspiration, and let our Pasadena workshop bring it to life.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    {!showIframe ? (
                        <div className="mx-auto max-w-5xl">
                            {/* The Roadmap Intro */}
                            <div className="grid gap-8 md:grid-cols-3 mb-16">
                                {[
                                    {
                                        step: "01",
                                        title: "Discover Your Base",
                                        desc: "Explore 10,000+ ethically sourced settings and mountings.",
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        step: "02",
                                        title: "Customize & Dream",
                                        desc: "Switch metals (Gold, Platinum), stones, and sizes in real-time.",
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        )
                                    },
                                    {
                                        step: "03",
                                        title: "Craft with Susie",
                                        desc: "Found your piece? We'll source the gems and finish it in-house.",
                                        icon: (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="glass-card p-8 rounded-3xl border border-stone-200 bg-white/70 shadow-sm reveal-on-scroll" style={{ transitionDelay: `${idx * 150}ms` }}>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-burgundy text-white font-serif text-lg shadow-md">
                                                {item.step}
                                            </span>
                                            <div className="text-brand-burgundy/40">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <h3 className="font-serif text-xl text-stone-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <div className="inline-block glass-card rounded-full p-2 border border-brand-gold/20 bg-white/40 shadow-xl overflow-hidden group">
                                    <button
                                        onClick={() => setShowIframe(true)}
                                        className="micro-interaction flex items-center justify-center rounded-full bg-brand-burgundy px-12 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white hover:bg-brand-burgundy-deep transition-all duration-300 group-hover:px-14"
                                    >
                                        Start Your Journey <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-3 h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                    </button>
                                </div>
                                <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                                    Trusted by Pasadena Families since 1984
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-2xl bg-white min-h-[900px] relative transition-all duration-700">
                            {/* Shimmer/Skeleton Loader */}
                            {iframeLoading && (
                                <div className="absolute inset-0 z-20 bg-white p-8">
                                    <div className="animate-pulse space-y-8">
                                        <div className="h-12 bg-stone-100 rounded-xl w-3/4 mx-auto" />
                                        <div className="grid grid-cols-4 gap-4">
                                            {[1, 2, 3, 4].map(n => (
                                                <div key={n} className="h-64 bg-stone-50 rounded-2xl" />
                                            ))}
                                        </div>
                                        <div className="h-96 bg-stone-50 rounded-3xl" />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                        <div className="w-12 h-12 border-4 border-brand-gold/30 border-t-brand-burgundy rounded-full animate-spin"></div>
                                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-burgundy font-bold">Initializing Boutique...</p>
                                    </div>
                                </div>
                            )}

                            {/* Stuller iFrame (White-Label Mode) */}
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
                            {/* Resizer Script */}
                            <Script
                                src="https://assets.jewelershowcase.com/iframe-resizer-parent/main.js"
                                strategy="lazyOnload"
                            />
                        </div>
                    )}
                </div>
            </div>
        </SiteShell>
    );
}
