import Link from "next/link";

/*
 * Date: 2026-02-27
 * Time: 20:56:34 -06:00 (CST)
 * Context/Notes: Rebuilt mobile hero into a layered luxury composition (cinematic overlays, editorial type rhythm, premium CTA stack) while preserving eager LCP image loading and desktop behavior.
 * Agent Name: Codex
 */

const mobileHeroImageSrc = "/images/home/home-hero-ring-mobile.avif";

export function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[#120b0d] md:min-h-[74vh]">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- Intentional eager hero image for fastest mobile LCP paint */}
        <img
          src={mobileHeroImageSrc}
          alt="Jewelry repair hero background"
          fetchPriority="high"
          decoding="sync"
          loading="eager"
          width={800}
          height={540}
          className="absolute inset-0 h-full w-full object-cover object-[72%_35%] animate-slow-zoom md:object-[center_right]"
        />
        {/* Mobile-only Cinematic Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,_rgba(18,11,13,0.84)_0%,_rgba(53,23,31,0.58)_42%,_rgba(18,11,13,0.82)_100%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,_rgba(209,184,130,0.22)_0%,_rgba(209,184,130,0.04)_34%,_transparent_62%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_72%,_rgba(255,255,255,0.18)_0%,_rgba(255,255,255,0)_48%)] md:hidden" />

        {/* Desktop-only Overlays */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)] md:block" />
      </div>
      <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-end px-5 pb-10 pt-24 md:min-h-[74vh] md:items-center md:px-6 md:py-14">
        <div className="relative w-full max-w-2xl">
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-7 rounded-[2.2rem] bg-gradient-to-b from-black/35 via-black/20 to-black/55 blur-2xl md:hidden" />
          <div className="relative">
            <div className="animate-fade-up reveal-delay-1 inline-flex items-center gap-3 rounded-full border border-brand-gold/50 bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-gold shadow-[0_8px_20px_rgba(0,0,0,0.24)] backdrop-blur-sm md:bg-white/80 md:text-brand-burgundy">
              In-House Repairs
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              Your Jewelry Stays On-Site.
            </div>
            <h1 className="lcp-heading animate-fade-up reveal-delay-2 mt-6 max-w-[10.5ch] text-[clamp(3rem,14vw,4.5rem)] leading-[0.9] text-white [text-wrap:balance] md:max-w-none md:text-6xl md:leading-[0.95] md:text-stone-900 lg:text-7xl">
              Your jewelry never leaves our hands.
            </h1>
            <p className="animate-fade-up reveal-delay-3 mt-6 max-w-[32ch] text-[1.08rem] leading-relaxed text-stone-100/92 md:text-lg md:font-normal md:text-stone-600">
              Master jeweler craftsmanship performed on-site. Clear starting pricing and Same Day/Next
              Day service for most repairs.
            </p>
            <div className="animate-fade-up reveal-delay-4 mt-7 h-px w-28 bg-gradient-to-r from-brand-gold/95 to-transparent md:hidden" />
            <div className="animate-fade-up reveal-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className="micro-interaction group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-burgundy to-[#8f3046] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_20px_45px_rgba(32,10,16,0.45)] ring-1 ring-inset ring-brand-gold/20 transition-all hover:from-brand-burgundy-deep hover:to-brand-burgundy hover:shadow-[0_28px_55px_rgba(32,10,16,0.55)] sm:w-auto"
              >
                <span className="relative z-10">Get Fast Quote</span>
                <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brand-gold/70 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-colors hover:bg-white/15 md:border md:border-brand-gold/80 md:bg-transparent md:text-brand-burgundy md:hover:bg-brand-gold/10 sm:w-auto"
              >
                Book a Repair
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
