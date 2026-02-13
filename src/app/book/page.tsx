import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { Suspense } from "react";

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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Suspense fallback={null}>
            <GaConversionTracker
              active={submitted}
              eventName={bookingEventName}
              submissionId={searchParams?.id}
              leadType="booking"
              status={pending ? "pending" : "success"}
            />
          </Suspense>
          {submitted ? (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">
                {pending ? "Booking request received." : "Booking requested."}
              </p>
              <p className="mt-1 text-emerald-800">
                We will confirm availability and send details to your email.
              </p>
            </div>
          ) : null}
          {error ? (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
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
