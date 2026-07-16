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
            Book your visit and get clear next steps today.
          </h3>
          <p className="mt-3 text-sm text-stone-600">
            Tell us what you need and we will confirm timing, intake, and what to bring.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/book"
            className="rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-burgundy-deep"
          >
            Book a Repair
          </Link>
          <Link
            href="/services"
            className="rounded-lg border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-burgundy transition hover:bg-brand-gold/10"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
