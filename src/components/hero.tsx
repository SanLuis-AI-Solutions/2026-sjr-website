import Link from "next/link";
import Image from "next/image";

const mobileHeroImageSrc = "/images/home/home-hero-ring-mobile.avif";

export function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-stone-100 md:min-h-[74vh]">
      <div className="absolute inset-0">
        <Image
          src={mobileHeroImageSrc}
          alt="Jewelry repair hero background"
          priority
          fetchPriority="high"
          width={800}
          height={540}
          unoptimized={true}
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[center_right]"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)] md:block" />
      </div>
      <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-6 py-10 md:min-h-[74vh] md:py-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-brand-gold/40 bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-brand-burgundy">
            In-House Repairs
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            Your Jewelry Stays On-Site.
          </div>
          <h1 className="lcp-heading mt-6 text-5xl text-stone-900 md:text-6xl lg:text-7xl">
            Your jewelry never leaves our hands.
          </h1>
          <p className="mt-6 max-w-xl text-base text-stone-600 md:text-lg">
            Master jeweler craftsmanship performed on-site. Clear starting pricing and Same Day/Next
            Day service for most repairs.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/quote"
              className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10"
            >
              Book a Repair
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
