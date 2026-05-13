import Link from "next/link";

export function CtaBand() {
  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-stone-200 bg-white px-8 py-12 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Free 15‑Minute Assessment
          </p>
          <h3 className="mt-3 font-serif text-3xl text-stone-900">
            Book your repair or get a fast quote today.
          </h3>
          <p className="mt-3 text-sm text-stone-600">
            Tell us what you need and we’ll confirm options and timing.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-3 md:w-auto md:gap-4">
          <Link
            href="/quote"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto"
          >
            Get Fast Quote
          </Link>
          <Link
            href="/book"
            className="hidden min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-burgundy transition hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:inline-flex"
          >
            Book a Repair
          </Link>
        </div>
      </div>
    </section>
  );
}
