import Link from "next/link";

/*
 * Date: 2026-02-27
 * Time: 21:22:41 -06:00 (CST)
 * Context/Notes: Option 1.5 mobile hero pass: luxury dark editorial mood with reduced text footprint to keep the ring visible and add stronger visual drama without hiding product detail.
 * Agent Name: Codex
 */

const mobileHeroImageSrc = "/images/home/home-hero-ring-mobile.avif";

export function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[#13090d] md:min-h-[74vh]">
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
          className="absolute inset-0 h-full w-full object-cover object-[80%_34%] animate-slow-zoom md:object-[center_right]"
        />
        {/* Mobile-only Dramatic Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(104deg,_rgba(15,6,10,0.9)_0%,_rgba(30,11,18,0.74)_38%,_rgba(30,11,18,0.32)_67%,_rgba(30,11,18,0.08)_100%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,_rgba(209,184,130,0.26)_0%,_rgba(209,184,130,0.05)_36%,_transparent_62%)] md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_48%,_rgba(255,241,223,0.38)_0%,_rgba(255,241,223,0.12)_32%,_transparent_56%)] md:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(24,8,14,0.44)_0%,_transparent_42%)] md:hidden" />

        {/* Desktop-only Overlays */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)] md:block" />
      </div>
      <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-end px-5 pb-10 pt-24 md:min-h-[74vh] md:items-center md:px-6 md:py-14">
        <div className="relative w-full max-w-[21rem] rounded-[1.85rem] border border-white/16 bg-[linear-gradient(160deg,_rgba(18,8,12,0.56)_0%,_rgba(18,8,12,0.32)_58%,_rgba(18,8,12,0.16)_100%)] p-6 shadow-[0_26px_58px_rgba(8,2,5,0.46)] backdrop-blur-[3px] md:max-w-2xl md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
          <div className="relative">
            <div className="animate-fade-up reveal-delay-1 inline-flex items-center gap-3 rounded-full border border-brand-gold/45 bg-black/28 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-gold shadow-[0_8px_18px_rgba(0,0,0,0.3)] md:bg-white/80 md:text-brand-burgundy">
              In-House Repairs
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              Your Jewelry Stays On-Site.
            </div>
            <h1 className="lcp-heading animate-fade-up reveal-delay-2 mt-6 max-w-[8.8ch] text-[clamp(2.85rem,13.2vw,4.35rem)] leading-[0.9] text-white [text-wrap:balance] md:max-w-none md:text-6xl md:leading-[0.95] md:text-stone-900 lg:text-7xl">
              Your jewelry never leaves our hands.
            </h1>
            <p className="animate-fade-up reveal-delay-3 mt-5 max-w-[27ch] text-[1.08rem] leading-relaxed text-stone-100/92 md:max-w-[32ch] md:mt-6 md:text-lg md:font-normal md:text-stone-600">
              Master jeweler craftsmanship performed on-site. Clear starting pricing and Same Day/Next
              Day service for most repairs.
            </p>
            <div className="animate-fade-up reveal-delay-4 mt-7 h-px w-28 bg-gradient-to-r from-brand-gold/95 to-transparent md:hidden" />
            <div className="animate-fade-up reveal-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/quote"
                className="micro-interaction group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-brand-burgundy to-[#97445e] px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_22px_48px_rgba(24,7,13,0.5)] ring-1 ring-inset ring-brand-gold/25 transition-all hover:from-brand-burgundy-deep hover:to-brand-burgundy hover:shadow-[0_28px_56px_rgba(24,7,13,0.6)] sm:w-auto"
              >
                <span className="relative z-10">Get Fast Quote</span>
                <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brand-gold/70 bg-white/7 px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-colors hover:bg-white/14 md:border md:border-brand-gold/80 md:bg-transparent md:text-brand-burgundy md:hover:bg-brand-gold/10 sm:w-auto"
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
