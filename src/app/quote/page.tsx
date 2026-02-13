import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { Suspense } from "react";

export default function QuotePage({
  searchParams,
}: {
  searchParams?: { submitted?: string; error?: string; id?: string };
}) {
  const submitted = searchParams?.submitted === "1";
  const error = searchParams?.error === "1";
  return (
    <SiteShell>
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Suspense fallback={null}>
            <GaConversionTracker
              active={submitted}
              eventName="quote_submit_success"
              submissionId={searchParams?.id}
              leadType="quote"
              status="success"
            />
          </Suspense>
          {submitted ? (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Request received.</p>
              <p className="mt-1 text-emerald-800">
                We will respond with a price range within 1 business day.
              </p>
            </div>
          ) : null}
          {error ? (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-semibold">Something went wrong.</p>
              <p className="mt-1 text-rose-800">
                Please try again or call us for immediate help.
              </p>
            </div>
          ) : null}
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
            encType="multipart/form-data"
            className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-6"
          >
            <input
              type="text"
              name="company"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
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
            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-800" htmlFor="photos">
                Photos (optional)
              </label>
              <input
                id="photos"
                type="file"
                name="photos"
                accept="image/*"
                multiple
                className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm"
              />
              <p className="text-xs text-stone-600">
                Add up to 4 images. Close-ups help us quote accurately.
              </p>
            </div>
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
