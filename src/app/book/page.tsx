import { SiteShell } from "@/components/site-shell";

export default function BookPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Book a Repair
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Reserve a free 15‑minute assessment
          </h1>
          <p className="mt-4 text-sm text-stone-600">
            Select a time and we’ll confirm your booking. We add a 15‑minute
            buffer between appointments.
          </p>
          <form
            action="/api/book"
            method="post"
            className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-stone-100 p-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
            />
            <input
              type="date"
              name="date"
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
              required
            />
            <input
              type="time"
              name="time"
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
              required
            />
            <textarea
              name="details"
              placeholder="Tell us about the repair"
              className="min-h-[120px] rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="mt-2 rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-burgundy-deep"
            >
              Book Assessment
            </button>
            <p className="text-xs text-stone-600">
              Secure form · We confirm bookings within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
