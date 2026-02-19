export function TrustStrip() {
  return (
    <section className="border-y border-stone-200 bg-stone-100">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            In‑House
          </div>
          <div className="mt-2 font-serif text-2xl text-brand-burgundy">
            Master Jeweler On‑Site
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Your valuables stay on-site under our care.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Transparent
          </div>
          <div className="mt-2 font-serif text-2xl text-brand-burgundy">
            Starting‑At Pricing
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Clear price ranges before work begins.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Trusted
          </div>
          <div className="mt-2 font-serif text-2xl text-brand-burgundy">
            Local Reputation
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Family‑owned, serving Pasadena and nearby communities.
          </p>
        </div>
      </div>
    </section>
  );
}
