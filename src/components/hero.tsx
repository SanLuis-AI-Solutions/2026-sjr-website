import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-100">
      <div className="absolute inset-0">
        <div
          className="parallax-hero h-full w-full bg-cover bg-[center_right] animate-slow-zoom"
          style={{
            backgroundImage:
              "url('https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/hero-ring.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/85 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.1),_transparent_60%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[74vh] max-w-6xl items-center px-6 py-10 md:py-14">
        <div className="max-w-2xl animate-fade-up">
          <div className="inline-flex items-center gap-3 rounded-full border border-brand-gold/40 bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-brand-burgundy">
            In-House Repairs
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            No Shipping. No Outsourcing.
          </div>
          <h1 className="mt-6 font-serif text-5xl text-stone-900 md:text-6xl lg:text-7xl">
            Your jewelry never leaves our hands.
          </h1>
          <p className="mt-6 max-w-xl text-base text-stone-600 md:text-lg">
            Master jeweler craftsmanship performed entirely on-site. Transparent pricing,
            same-week timing, and meticulous care for heirlooms and daily pieces.
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
