import Link from "next/link";

/*
 * Date: 2026-02-27
 * Time: 21:09:42 -06:00 (CST)
 * Context/Notes: Option 2 mobile hero restyle with a brighter champagne direction (soft luminous overlays, translucent editorial panel, and refined premium CTA treatment) while preserving eager LCP image loading and desktop behavior.
 * Agent Name: Codex
 */

const mobileHeroImageSrc = "/images/home/home-hero-ring-mobile.avif";

export function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[#f5ede2] md:min-h-[74vh]">
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
          className="absolute inset-0 h-full w-full object-cover object-[68%_34%] animate-slow-zoom md:object-[center_right]"
        />
        {/* Mobile-only Champagne Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(162deg,_rgba(250,246,239,0.92)_0%,_rgba(250,246,239,0.72)_44%,_rgba(250,246,239,0.46)_100%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,_rgba(209,184,130,0.32)_0%,_rgba(209,184,130,0.08)_38%,_transparent_66%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_46%,_rgba(255,255,255,0.45)_0%,_rgba(255,255,255,0.12)_34%,_transparent_58%)] md:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(64,30,35,0.28)_0%,_transparent_36%)] md:hidden" />

        {/* Desktop-only Overlays */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)] md:block" />
      </div>
      <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-end px-5 pb-10 pt-24 md:min-h-[74vh] md:items-center md:px-6 md:py-14">
        <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/75 bg-[linear-gradient(165deg,_rgba(255,255,255,0.82)_0%,_rgba(250,243,233,0.66)_56%,_rgba(250,243,233,0.5)_100%)] p-6 shadow-[0_20px_52px_rgba(89,58,44,0.22)] backdrop-blur-[6px] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
          <div className="relative">
            <div className="animate-fade-up reveal-delay-1 inline-flex items-center gap-3 rounded-full border border-brand-gold/50 bg-white/72 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-burgundy shadow-[0_6px_16px_rgba(89,58,44,0.16)]">
              In-House Repairs
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              Your Jewelry Stays On-Site.
            </div>
            <h1 className="lcp-heading animate-fade-up reveal-delay-2 mt-6 max-w-[10.5ch] text-[clamp(2.85rem,13.2vw,4.45rem)] leading-[0.9] text-[#221416] [text-wrap:balance] md:max-w-none md:text-6xl md:leading-[0.95] md:text-stone-900 lg:text-7xl">
              Your jewelry never leaves our hands.
            </h1>
            <p className="animate-fade-up reveal-delay-3 mt-6 max-w-[32ch] text-[1.08rem] leading-relaxed text-[#433133] md:text-lg md:font-normal md:text-stone-600">
              Master jeweler craftsmanship performed on-site. Clear starting pricing and Same Day/Next
              Day service for most repairs.
            </p>
            <div className="animate-fade-up reveal-delay-4 mt-7 h-px w-28 bg-gradient-to-r from-brand-gold/95 to-transparent md:hidden" />
            <div className="animate-fade-up reveal-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className="micro-interaction group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-burgundy to-[#96445b] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_42px_rgba(70,28,40,0.34)] ring-1 ring-inset ring-brand-gold/20 transition-all hover:from-brand-burgundy-deep hover:to-brand-burgundy hover:shadow-[0_24px_48px_rgba(70,28,40,0.44)] sm:w-auto"
              >
                <span className="relative z-10">Get Fast Quote</span>
                <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brand-burgundy/70 bg-white/48 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy transition-colors hover:bg-white/72 md:border md:border-brand-gold/80 md:bg-transparent md:text-brand-burgundy md:hover:bg-brand-gold/10 sm:w-auto"
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
