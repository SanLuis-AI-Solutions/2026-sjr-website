import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Book a Repair | Susie’s Jewelry Repair",
  description:
    "Request a free 15-minute repair assessment with our in-house Pasadena jewelry and watch repair team.",
  alternates: {
    canonical: "/book",
  },
};

export default function BookPage({
  searchParams,
}: {
  searchParams?: { submitted?: string; error?: string; pending?: string; id?: string };
}) {
  const submitted = searchParams?.submitted === "1";
  const error = searchParams?.error === "1";
  const pending = searchParams?.pending === "1";
  const bookingEventName = pending
    ? "booking_submit_pending"
    : "booking_submit_success";
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-start">
          <Suspense fallback={null}>
            <GaConversionTracker
              active={submitted}
              eventName={bookingEventName}
              submissionId={searchParams?.id}
              leadType="booking"
              status={pending ? "pending" : "success"}
            />
          </Suspense>
          <div className="reveal-on-scroll">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
              >
                <p className="font-semibold">
                  {pending ? "Booking request received." : "Booking requested."}
                </p>
                <p className="mt-1 text-emerald-800">
                  We will confirm availability and send details to your email.
                </p>
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
              >
                <p className="font-semibold">We could not book that time.</p>
                <p className="mt-1 text-rose-800">
                  Please try a different time or call us for immediate help.
                </p>
              </div>
            ) : null}
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Book a Repair
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              Reserve a free 15‑minute assessment
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Choose a preferred time and we’ll confirm your booking. We add a 15‑minute buffer
              between appointments.
            </p>
            <div
              className="mt-6 flex flex-wrap gap-3"
              role="region"
              aria-label="Quick actions"
            >
              <Link
                href="/quote"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/contact"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-stone-200 bg-white/70 px-5 py-4 text-sm text-stone-600">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Good to know
              </div>
              <ul className="mt-3 space-y-2">
                <li>• Most services are Same Day/Next Day service</li>
                <li>• We confirm bookings within 1 business day</li>
                <li>
                  • Need help fast? Call{" "}
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    {BUSINESS.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <form
            action="/api/book"
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

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
                Date
                <input
                  type="date"
                  name="date"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  required
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
                Time
                <input
                  type="time"
                  name="time"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  required
                />
              </label>
            </div>

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Details (optional)
              <textarea
                name="details"
                className="mt-2 min-h-[140px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                placeholder="What should we know before you arrive?"
              />
            </label>

            <button
              type="submit"
              className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep"
            >
              Request Booking
            </button>
            <p className="mt-3 text-center text-xs text-stone-600">
              Secure form · We confirm bookings within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
