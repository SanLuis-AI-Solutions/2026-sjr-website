import Link from "next/link";

type CtaBandProps = {
  serviceName?: string;
};

export function CtaBand({ serviceName }: CtaBandProps = {}) {
  const headline = serviceName
    ? `Ready to book your ${serviceName.toLowerCase()}?`
    : "Schedule your repair today.";
  const subtext = serviceName
    ? `Drop off or book online. We confirm ${serviceName.toLowerCase()} options and pricing before any work begins.`
    : "Drop off, walk in, or book online — we discuss options and confirm pricing before any work begins.";

  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-stone-200 bg-white px-8 py-12 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            In-house · Pasadena · Same-day available
          </p>
          <h3 className="mt-3 font-serif text-3xl text-stone-900">
            {headline}
          </h3>
          <p className="mt-3 text-sm text-stone-600">
            {subtext}
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:w-auto"
        >
          Book a Repair
        </Link>
      </div>
    </section>
  );
}
