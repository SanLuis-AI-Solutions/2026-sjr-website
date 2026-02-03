import { SiteShell } from "@/components/site-shell";

export default function QuotePage() {
  return (
    <SiteShell>
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Fast Quote
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Get a transparent starting‑at range
          </h1>
          <p className="mt-4 text-sm text-stone-600">
            Share details and photos to receive a quick price range before you
            visit.
          </p>
          <form
            action="/api/quote"
            method="post"
            className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm"
            />
            <textarea
              name="details"
              placeholder="Describe the repair needed"
              className="min-h-[140px] rounded-lg border border-stone-200 px-4 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="mt-2 rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-burgundy-deep"
            >
              Submit Fast Quote
            </button>
            <p className="text-xs text-stone-600">
              Secure form · We respond with a price range within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
