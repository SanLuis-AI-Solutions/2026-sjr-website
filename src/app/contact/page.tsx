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
      <section className="relative overflow-hidden bg-stone-100 py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,_rgba(122,46,58,0.12),_transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_8%,_rgba(209,184,130,0.2),_transparent_46%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(122,46,58,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(122,46,58,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.08fr_0.92fr] md:items-start">
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
                className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
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
                className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
              >
                <p className="font-semibold">Something went wrong.</p>
                <p className="mt-1 text-rose-800">
                  Please try again or call us directly for immediate help.
                </p>
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Contact</p>
            <h1 className="mt-3 text-balance font-serif text-[2.15rem] leading-[1.12] text-stone-900 md:text-5xl">
              Talk to a local expert
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-stone-600">
              Call, email, or send a quick note. We guide you to the best next step, confirm what
              to bring, and keep your approvals clear before service begins.
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

            <section className="mt-8 reveal-on-scroll">
              <div className="rounded-[1.75rem] border border-stone-200 bg-white/86 p-5 shadow-[0_16px_40px_rgba(58,25,16,0.14)] backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Contact channels
                </p>
                <h2 className="mt-3 font-serif text-2xl text-stone-900 md:text-[1.8rem]">
                  Reach us the way you prefer.
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-stone-600">
                  Fast call support, photo-friendly email, and clear visit details for in-store
                  assessments.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-2xl border border-brand-gold/35 bg-stone-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                      Call now
                    </p>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="mt-3 inline-flex min-h-11 items-center text-lg font-semibold text-stone-900 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      {BUSINESS.phone}
                    </a>
                    <p className="mt-2 text-xs leading-6 text-stone-600">
                      Best for same-day guidance and urgent repair questions.
                    </p>
                  </article>

                  <article className="rounded-2xl border border-brand-gold/35 bg-stone-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                      Email photos
                    </p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="mt-3 inline-flex min-h-11 items-center break-all text-sm font-semibold text-stone-900 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      {BUSINESS.email}
                    </a>
                    <p className="mt-2 text-xs leading-6 text-stone-600">
                      Share close-up images and any timing details before you visit.
                    </p>
                  </article>
                </div>
              </div>
            </section>

            <section className="mt-4 reveal-on-scroll">
              <div className="grid gap-4 rounded-[1.75rem] border border-stone-200 bg-white/84 p-5 shadow-[0_10px_28px_rgba(58,25,16,0.12)] md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    Visit the workshop
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {BUSINESS.address.street}
                    <br />
                    {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Hours
                  </p>
                  <div className="mt-2 space-y-1.5 text-sm text-stone-700">
                    {BUSINESS.hours.map((row) => (
                      <div key={row.day} className="flex items-center justify-between gap-3">
                        <span>{row.day}</span>
                        <span className="font-medium text-stone-800">{row.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 reveal-on-scroll rounded-[1.75rem] border border-stone-200 bg-white/82 p-5 text-sm text-stone-600 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                What happens next
              </div>
              <ol className="mt-3 space-y-3">
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    1
                  </span>
                  <span>We review your message and reply within 1 business day.</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    2
                  </span>
                  <span>If needed, we suggest a quick in-store assessment.</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    3
                  </span>
                  <span>You approve scope and timing before work begins.</span>
                </li>
              </ol>
            </section>
          </div>

          <form
            action="/api/contact"
            method="post"
            className="reveal-on-scroll rounded-[1.9rem] border border-stone-200 bg-white/90 p-6 shadow-[0_22px_55px_rgba(58,25,16,0.15)] backdrop-blur-sm md:sticky md:top-28"
          >
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Contact form
              </p>
              <h2 className="mt-3 font-serif text-[1.75rem] leading-tight text-stone-900">
                Send us a message
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-stone-600">
                Tell us what needs attention and how you prefer we reply.
              </p>
            </div>

            <input
              type="text"
              name="company"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
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
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
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
              <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
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
            </div>

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
            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center text-xs text-stone-600">
              Secure form · We reply within 1 business day.
              <a
                href={`tel:${BUSINESS.phone}`}
                className="ml-1 inline-flex min-h-11 items-center font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Need urgent help? Call now.
              </a>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
