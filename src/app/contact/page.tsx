import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact Susie’s Jewelry Repair | Call, Email, or Message Us",
  description:
    "Talk to our Pasadena in-house repair team. Call, email, or send a quick message for jewelry and watch service guidance.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { submitted?: string; error?: string; id?: string };
}) {
  const submitted = searchParams?.submitted === "1";
  const error = searchParams?.error === "1";

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-start">
          <div className="reveal-on-scroll">
            <Suspense fallback={null}>
              <GaConversionTracker
                active={submitted}
                eventName="contact_submit_success"
                submissionId={searchParams?.id}
                leadType="contact"
                status="success"
              />
            </Suspense>
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
              >
                <p className="font-semibold">Message received.</p>
                <p className="mt-1 text-emerald-800">
                  We will reply within 1 business day.
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
                  Please try again or call us directly for immediate help.
                </p>
              </div>
            ) : null}
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Contact
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              Talk to a local expert
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Call, email, or send a quick note. We will guide you to the best next step and
              confirm what to bring.
            </p>
            <div
              className="mt-6 flex flex-wrap gap-3"
              role="region"
              aria-label="Quick actions"
            >
              <Link
                href="/quote"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
            </div>

            <div className="mt-8 space-y-2 text-sm text-stone-600">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex min-h-11 items-center font-semibold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="inline-flex min-h-11 items-center font-semibold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.email}
              </a>
              <div className="mt-3">
                {BUSINESS.address.street}, {BUSINESS.address.city},{" "}
                {BUSINESS.address.state} {BUSINESS.address.zip}
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white/80 p-5 text-sm text-stone-600">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                What happens next
              </div>
              <ul className="mt-3 space-y-2">
                <li>• We review your message and respond within 1 business day</li>
                <li>• If needed, we suggest a quick in-store assessment</li>
                <li>• You approve scope and timing before work begins</li>
              </ul>
            </div>
          </div>
          <form
            action="/api/contact"
            method="post"
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
              Name
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
              Preferred contact method
              <select
                name="preferredContact"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <option value="">No preference</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Message
              <textarea
                name="message"
                className="mt-2 min-h-[140px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="How can we help?"
                required
              />
            </label>
            <button
              type="submit"
              className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Send Message
            </button>
            <p className="mt-3 text-center text-xs text-stone-600">
              Secure form · We reply within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
