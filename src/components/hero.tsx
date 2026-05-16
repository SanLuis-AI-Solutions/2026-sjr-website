import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { BusinessActionLink } from "@/components/analytics/business-action-link";

/*
 * Date: 2026-04-29
 * Context/Notes: High-end hero composition inspired by luxury jewelry campaign art:
 * asymmetric image-left framing, copy-right conversion path, original readable fonts.
 * Agent Name: Codex
 */

const heroImageSrc = "/images/home/home-hero-ring.jpg";
const logoSrc = "/images/brand/sjr-logo.png";

export function Hero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-[#120d10] text-white md:min-h-[760px]">
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element -- Intentional eager hero image for fastest above-the-fold paint */}
        <img
          src={heroImageSrc}
          alt="Diamond ring showcased for Susie's Jewelry Repair"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          width={1920}
          height={897}
          className="h-full w-full scale-[1.03] object-cover object-[36%_center] md:object-[82%_center] md:[transform:scaleX(-1)_scale(1.03)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(18,13,16,0.18)_0%,_rgba(18,13,16,0.52)_38%,_rgba(18,13,16,0.94)_74%,_rgba(18,13,16,0.98)_100%)] md:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,_rgba(18,13,16,0.03)_0%,_rgba(18,13,16,0.08)_34%,_rgba(18,13,16,0.72)_66%,_rgba(18,13,16,0.97)_100%)] md:block" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_42%,_rgba(209,184,130,0.28)_0%,_rgba(209,184,130,0.08)_28%,_transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#120d10] to-transparent" />
      </div>

      <div className="pointer-events-none absolute right-6 top-28 hidden opacity-[0.09] md:block" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- Decorative brand watermark */}
        <img src={logoSrc} alt="Susie's Jewelry Repair logo" width={389} height={474} className="h-56 w-auto object-contain" />
      </div>

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-10 pt-28 md:min-h-[760px] md:items-center md:px-8 md:py-28">
        <div className="ml-auto w-full max-w-[35rem] md:pr-2 lg:pr-10">
          <div className="animate-fade-up reveal-delay-1 home-hero-mobile-static inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-brand-gold/35 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- Small brand seal from provided logo */}
              <img src={logoSrc} alt="Susie's Jewelry Repair" width={389} height={474} className="h-9 w-9 object-contain" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-gold">
              Pasadena
              <span className="mx-2 text-white/35">/</span>
              Since 1984
            </span>
          </div>

          <h1 className="lcp-heading animate-fade-up reveal-delay-2 home-hero-mobile-static mt-6 max-w-[11ch] text-[clamp(3rem,13vw,4.4rem)] leading-[0.88] text-white [text-wrap:balance] md:max-w-[10.5ch] md:text-[clamp(4.25rem,7vw,6.25rem)]">
            Beauty restored. Elegance preserved.
          </h1>

          <p className="animate-fade-up reveal-delay-3 home-hero-mobile-static mt-6 max-w-[34rem] text-base leading-7 text-white/78 md:text-lg md:leading-8">
            A local jewelry repair shop in Pasadena for pieces that deserve in-house care,
            clear quotes, and lasting workmanship.
          </p>

          <div className="animate-fade-up reveal-delay-4 home-hero-mobile-static mt-7 flex">
            <Link
              href="/book"
              className="micro-interaction group relative inline-flex min-h-[54px] items-center justify-center overflow-hidden rounded-full bg-brand-gold px-7 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#181112] shadow-[0_24px_54px_rgba(0,0,0,0.34)] ring-1 ring-inset ring-white/25 transition-all hover:bg-[#e3cc92] sm:w-auto"
            >
              <span className="relative z-10">Book a Repair</span>
              <span
                aria-hidden="true"
                className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#181112]/10 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          <div className="animate-fade-up reveal-delay-3 home-hero-mobile-static mt-6 flex max-w-[35rem] flex-wrap gap-x-5 gap-y-2 border-t border-white/14 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/72">
            <BusinessActionLink
              href={BUSINESS.googleMapsUrl}
              action="reviews"
              placement="home_hero"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-brand-gold"
            >
              4.5 Google rating
            </BusinessActionLink>
            <span>90-day workmanship warranty</span>
            <span>Family owned</span>
          </div>
        </div>
      </div>
    </section>
  );
}
