import Link from "next/link";

/*
 * Date: 2026-02-26
 * Time: 18:14:40 -06:00 (CST)
 * Context/Notes: Preserved eager hero paint while adding mobile readability hardening (frosted text backing + stronger CTA contrast), safe page-load sequencing, and refined CTA motion.
 * Agent Name: Codex
 */

const mobileHeroImageSrc = "/images/home/home-hero-ring-mobile.avif";

export function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-stone-100 md:min-h-[74vh]">
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
          className="absolute inset-0 h-full w-full object-cover object-center animate-slow-zoom md:object-[center_right]"
        />
        {/* Mobile-only Premium Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/80 md:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(250,247,242,0.92),_rgba(250,247,242,0.15)_60%,_transparent_85%)] md:hidden" />

        {/* Desktop-only Overlays */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)] md:block" />
      </div>
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-6 py-10 md:min-h-[74vh] md:py-14">
        <div className="w-full max-w-2xl rounded-[2.5rem] border border-stone-200/80 bg-white/95 p-8 shadow-2xl shadow-brand-burgundy/5 backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_30px_70px_rgba(58,25,16,0.22)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0 md:hover:shadow-none">
          <div className="animate-fade-up reveal-delay-1 inline-flex items-center gap-3 rounded-full border border-brand-gold/40 bg-white px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-brand-burgundy font-semibold shadow-sm md:bg-white/80">
            In-House Repairs
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
            Your Jewelry Stays On-Site.
          </div>
          <h1 className="lcp-heading animate-fade-up reveal-delay-2 mt-6 font-serif text-5xl text-stone-900 md:text-6xl lg:text-7xl">
            Your jewelry never leaves our hands.
          </h1>
          <p className="animate-fade-up reveal-delay-3 mt-6 max-w-xl text-base font-medium leading-relaxed text-stone-800 md:text-lg md:font-normal md:text-stone-600">
            Master jeweler craftsmanship performed on-site. Clear starting pricing and Same Day/Next
            Day service for most repairs.
          </p>
          <div className="animate-fade-up reveal-delay-4 mt-10 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="micro-interaction group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-burgundy px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl ring-1 ring-inset ring-brand-burgundy-deep/20 transition-all hover:bg-brand-burgundy-deep hover:shadow-brand-burgundy/20 hover:shadow-2xl"
            >
              <span className="relative z-10">Get Fast Quote</span>
              <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
            <Link
              href="/book"
              className="micro-interaction inline-flex items-center justify-center rounded-full border-2 border-brand-burgundy bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy transition-colors hover:bg-brand-burgundy hover:text-white md:border md:border-brand-gold/80 md:bg-transparent md:shadow-none md:backdrop-blur-0 md:text-brand-burgundy md:hover:bg-brand-gold/10"
            >
              Book a Repair
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
