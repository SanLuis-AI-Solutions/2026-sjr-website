import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { LeadFormTracker } from "@/components/analytics/lead-form-tracker";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Fast Quote | Susie’s Jewelry Repair",
  description:
    "Get a transparent starting-at quote for jewelry or watch repair from our in-house Pasadena team.",
  alternates: {
    canonical: "/quote",
  },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams?: Promise<{ submitted?: string; error?: string; id?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const submitted = resolvedSearchParams?.submitted === "1";
  const error = resolvedSearchParams?.error === "1";
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-start">
          <Suspense fallback={null}>
            <GaConversionTracker
              active={submitted}
              eventName="quote_submit_success"
              submissionId={resolvedSearchParams?.id}
              leadType="quote"
              status="success"
            />
            <LeadFormTracker formId="quote-form" leadType="quote" hasError={error} />
          </Suspense>
          <div className="reveal-on-scroll">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
              >
                <p className="font-semibold">Request received.</p>
                <p className="mt-1 text-emerald-800">
                  We will respond with a price range within 1 business day.
                </p>
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
              >
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
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Share details and photos to receive a quick price range before you visit.
            </p>
            <div
              className="mt-6 flex flex-wrap gap-3"
              role="region"
              aria-label="Quick actions"
            >
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
              <Link
                href="/contact"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 space-y-3 text-sm text-stone-600">
              <div className="rounded-2xl border border-stone-200 bg-white/70 px-5 py-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  What happens next
                </div>
                <ul className="mt-3 space-y-2">
                  <li>• We reply within 1 business day with a starting range</li>
                  <li>• If photos are unclear, we may request 1 quick follow-up photo</li>
                  <li>• You stay in control: we confirm final pricing after inspection</li>
                </ul>
              </div>
              <p>
                Prefer to talk now? Call{" "}
                <a
                  className="inline-flex min-h-11 items-center font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  href={`tel:${BUSINESS.phone}`}
                >
                  {BUSINESS.phone}
                </a>
                .
              </p>
            </div>
          </div>

          <form
            id="quote-form"
            action="/api/quote"
            method="post"
            encType="multipart/form-data"
            className="reveal-on-scroll rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm"
          >
            <input
              type="text"
              name="company"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
              Full name
              <input
                type="text"
                name="name"
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="Your name"
                required
              />
            </label>

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="you@email.com"
                required
              />
            </label>

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Phone (optional)
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="(281) 555-1234"
              />
            </label>

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Repair details
              <textarea
                name="details"
                className="mt-2 min-h-[160px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="What needs repair? Include metal type, stones, and anything that seems loose or broken."
                required
              />
            </label>

            <div className="mt-5 grid gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-stone-600" htmlFor="photos">
                Photos (optional)
              </label>
              <input
                id="photos"
                type="file"
                name="photos"
                accept="image/*"
                multiple
                className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              />
              <p className="text-xs text-stone-600">
                Add up to 4 images. Close-ups of the issue help us quote accurately.
              </p>
            </div>

            <button
              type="submit"
              className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep"
            >
              Request Quote
            </button>
            <p className="mt-3 text-center text-xs text-stone-600">
              Secure form · We respond within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
