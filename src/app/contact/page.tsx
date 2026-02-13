import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { submitted?: string; error?: string; id?: string };
}) {
  const submitted = searchParams?.submitted === "1";
  const error = searchParams?.error === "1";

  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
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
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Message received.</p>
                <p className="mt-1 text-emerald-800">
                  We will reply within 1 business day.
                </p>
              </div>
            ) : null}
            {error ? (
              <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
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
            <p className="mt-4 text-sm text-stone-600">
              Call, email, or send a quick note. We’ll guide you to the next step.
            </p>
            <div className="mt-6 space-y-2 text-sm text-stone-600">
              <a href={`tel:${BUSINESS.phone}`} className="block hover:text-brand-burgundy">
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="block hover:text-brand-burgundy">
                {BUSINESS.email}
              </a>
              <div className="mt-3">
                {BUSINESS.address.street}, {BUSINESS.address.city},{" "}
                {BUSINESS.address.state} {BUSINESS.address.zip}
              </div>
            </div>
          </div>
          <form
            action="/api/contact"
            method="post"
            className="rounded-lg border border-stone-200 bg-stone-100 p-6"
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
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="Your name"
                required
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Email
              <input
                type="email"
                name="email"
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="you@email.com"
                required
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Phone (optional)
              <input
                type="tel"
                name="phone"
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="(281) 555-1234"
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Preferred contact method
              <select
                name="preferredContact"
                defaultValue=""
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
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
                className="mt-2 min-h-[120px] w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="How can we help?"
                required
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-burgundy-deep"
            >
              Send Message
            </button>
            <p className="mt-3 text-xs text-stone-600">
              Secure form · We reply within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
