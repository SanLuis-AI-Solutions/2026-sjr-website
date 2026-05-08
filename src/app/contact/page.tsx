import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { LeadFormTracker } from "@/components/analytics/lead-form-tracker";
import { LeadAttributionFields } from "@/components/analytics/lead-attribution-fields";
import { ConversionQuickActions } from "@/components/analytics/conversion-quick-actions";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";
import { createPageMetadata } from "@/lib/metadata";

const GOOGLE_MAPS_PRIMARY_URL = "https://maps.app.goo.gl/3ZyG1hF1Y9Z9rcQC8";

export const metadata = createPageMetadata({
  title: "Contact Susie’s Jewelry Repair | Call, Email, or Message Us",
  description:
    "Talk to our Pasadena in-house repair team by phone, email, or message for jewelry and watch service guidance, next steps, and appointment support.",
  canonical: "/contact",
});

async function DeferredContactSection() {
  return (
    <section className="cv-section relative overflow-hidden bg-stone-100 py-14 md:py-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,_rgba(209,184,130,0.2),_transparent_44%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_74%,_rgba(122,46,58,0.11),_transparent_46%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-7 hidden rounded-[1.7rem] border border-stone-200 bg-white/85 p-5 shadow-[0_16px_42px_rgba(58,25,16,0.12)] md:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
            Visit experience
          </p>
          <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-stone-900 md:text-[2.35rem]">
            A clear path from first message to finished repair.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-600">
            Know when to come in, how intake works, and what gets confirmed before service
            begins.
          </p>
        </div>
        <div className="mb-7 grid gap-3 md:hidden">
          <BusinessActionLink
            href={`tel:${BUSINESS.phone}`}
            action="phone_call"
            placement="contact_direct_panel"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-brand-burgundy shadow-[0_10px_26px_rgba(58,25,16,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Call now
          </BusinessActionLink>
          <BusinessActionLink
            href={`mailto:${BUSINESS.email}`}
            action="email_contact"
            placement="contact_direct_panel"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-brand-burgundy shadow-[0_10px_26px_rgba(58,25,16,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            {BUSINESS.email}
          </BusinessActionLink>
          <BusinessActionLink
            href={GOOGLE_MAPS_PRIMARY_URL}
            action="directions"
            placement="contact_visit_panel"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-brand-burgundy shadow-[0_10px_26px_rgba(58,25,16,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Open in Google Maps
          </BusinessActionLink>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 reveal-on-scroll">
            <section className="relative overflow-hidden rounded-[2rem] border border-brand-burgundy/20 bg-brand-burgundy p-6 text-white shadow-[0_20px_55px_rgba(30,20,22,0.3)]">
              <div className="absolute right-[-5rem] top-[-3rem] h-40 w-40 rounded-full bg-brand-gold/20 blur-2xl" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
                Visit the workshop
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-100">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-100">
                  In-house team
                </span>
                <span className="rounded-full border border-white/25 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone-100">
                  Transparent approvals
                </span>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-5 shadow-[0_12px_34px_rgba(58,25,16,0.11)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                What happens next
              </p>
              <ol className="mt-4 space-y-4 text-sm text-stone-700">
                <li className="flex gap-3 border-l-2 border-brand-gold/45 pl-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    1
                  </span>
                  <span>We review your message and reply within 1 business day.</span>
                </li>
                <li className="flex gap-3 border-l-2 border-brand-gold/45 pl-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    2
                  </span>
                  <span>If needed, we suggest a quick in-store assessment.</span>
                </li>
                <li className="flex gap-3 border-l-2 border-brand-gold/45 pl-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-[11px] font-semibold text-white">
                    3
                  </span>
                  <span>You approve scope and timing before work begins.</span>
                </li>
              </ol>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-gradient-to-br from-white to-stone-100 p-5 shadow-[0_12px_34px_rgba(58,25,16,0.11)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Workshop hours
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {BUSINESS.hours.map((row) => (
                  <div
                    key={row.day}
                    className="rounded-xl border border-stone-200 bg-white/85 px-3 py-2 text-sm"
                  >
                    <p className="text-stone-600">{row.day}</p>
                    <p className="mt-1 font-medium text-stone-800">{row.hours}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <form
            id="contact-form"
            action="/api/contact"
            method="post"
            className="reveal-on-scroll relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_60px_rgba(58,25,16,0.18)] md:p-7"
          >
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-burgundy via-brand-gold to-brand-burgundy" />
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Contact form
              </p>
              <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-stone-900">
                Send us a message
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-stone-600">
                Tell us what needs attention and your preferred reply method.
              </p>
            </div>

            <div className="mb-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-stone-600">
              <span className="rounded-full border border-stone-300 px-3 py-1">Secure form</span>
              <span className="rounded-full border border-stone-300 px-3 py-1">Local team</span>
              <span className="rounded-full border border-stone-300 px-3 py-1">Fast response</span>
            </div>

            <input
              type="text"
              name="company"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <LeadAttributionFields />

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
              Secure form · Local in-house team support.
              <BusinessActionLink
                href={`tel:${BUSINESS.phone}`}
                action="phone_call"
                placement="contact_form_notice"
                className="ml-1 inline-flex min-h-11 items-center font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Need urgent help? Call now.
              </BusinessActionLink>
            </div>
          </form>
        </div>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white/90 p-4 shadow-[0_14px_34px_rgba(58,25,16,0.12)] md:mt-10 md:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Map
              </p>
              <h2 className="mt-2 font-serif text-xl text-stone-900">Find our storefront</h2>
            </div>
            <span className="rounded-full border border-brand-burgundy/30 bg-brand-burgundy/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
              Tap Anywhere For Directions
            </span>
          </div>
          <BusinessActionLink
            href={GOOGLE_MAPS_PRIMARY_URL}
            action="directions"
            placement="contact_map_card"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Susie's Jewelry and Watch Repair on Google Maps"
            className="group relative block overflow-hidden rounded-2xl border border-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Static map preview avoids iframe performance cost while preserving clear location context. */}
            <img
              src="/images/contact/susies-map-preview.webp"
              alt="Map preview centered on Susie’s Jewelry and Watch Repair in Pasadena, Texas"
              width={1365}
              height={768}
              loading="lazy"
              decoding="async"
              className="pointer-events-none h-[320px] w-full object-cover object-center grayscale-[14%] contrast-[1.03] transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl border border-white/35 bg-black/55 px-4 py-3 text-white shadow-[0_12px_30px_rgba(10,6,6,0.3)] backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Susie’s Jewelry and Watch Repair
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-100">
                3910 Fairmont Pkwy #C, Pasadena, TX 77504
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/95">
                Open In Google Maps
              </p>
            </div>
          </BusinessActionLink>
        </section>
      </div>
    </section>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ submitted?: string; error?: string; id?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const submitted = resolvedSearchParams?.submitted === "1";
  const error = resolvedSearchParams?.error === "1";

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-brand-burgundy-deep py-8 text-white md:py-20">
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_16%_8%,_rgba(209,184,130,0.3),_transparent_45%)] md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_84%_18%,_rgba(250,247,242,0.14),_transparent_50%)] md:block" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(30,20,22,0.22)_0%,rgba(122,46,58,0.05)_55%,rgba(30,20,22,0.28)_100%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 rounded-2xl border border-emerald-200/70 bg-emerald-100/95 p-4 text-sm text-emerald-900"
              >
                <p className="font-semibold">Message received.</p>
                <p className="mt-1 text-emerald-800">We will reply within 1 business day.</p>
              </div>
            ) : null}
            {error ? (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-rose-200/70 bg-rose-100/95 p-4 text-sm text-rose-900"
              >
                <p className="font-semibold">Something went wrong.</p>
                <p className="mt-1 text-rose-800">
                  Please try again or call us directly for immediate help.
                </p>
              </div>
            ) : null}

            <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">Contact desk</p>
            <h1 className="lcp-sans mt-2 max-w-2xl text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white md:mt-3 md:text-6xl">
              Talk to a local expert
            </h1>
            <p className="lcp-sans mt-3 max-w-lg text-sm leading-6 text-stone-100/90 md:mt-5 md:text-[15px]">
              <span className="md:hidden">Call, email, or send a quick note for the fastest next step.</span>
              <span className="hidden md:inline">
                Call, email, or send a quick note. We reply with the fastest next step and confirm
                timing before work begins.
              </span>
            </p>

            <ConversionQuickActions
              page="contact"
              tone="dark"
              className="mt-5 flex flex-wrap gap-3 md:mt-7"
              primary={{ href: "#contact-form", label: "Send Message" }}
              secondary={[
                { href: "/quote", label: "Get Fast Quote" },
                { href: "/book", label: "Book Repair", tone: "muted" },
              ]}
            />

            <div className="mt-8 hidden gap-3 sm:grid-cols-3 md:grid">
              <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Response
                </p>
                <p className="mt-2 font-serif text-2xl">1 day</p>
                <p className="mt-1 text-xs text-stone-100/85">Business-day reply window.</p>
              </article>
              <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Location
                </p>
                <p className="mt-2 font-serif text-2xl">Pasadena</p>
                <p className="mt-1 text-xs text-stone-100/85">In-house repair workshop.</p>
              </article>
              <article className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Service
                </p>
                <p className="mt-2 font-serif text-2xl">Same Day</p>
                <p className="mt-1 text-xs text-stone-100/85">When applicable.</p>
              </article>
            </div>
          </div>

          <aside className="hidden rounded-[1.9rem] border border-white/20 bg-white/12 p-6 shadow-[0_28px_60px_rgba(15,9,10,0.28)] lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Direct lines
            </p>
            <h2 className="mt-3 font-serif text-[1.95rem] leading-tight text-white">
              Reach us immediately.
            </h2>
            <div className="mt-5 space-y-3">
              <BusinessActionLink
                href={`tel:${BUSINESS.phone}`}
                action="phone_call"
                placement="contact_direct_panel"
                className="micro-interaction block rounded-2xl border border-white/25 bg-white/10 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-burgundy-deep"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Call now
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{BUSINESS.phone}</p>
              </BusinessActionLink>
              <BusinessActionLink
                href={`mailto:${BUSINESS.email}`}
                action="email_contact"
                placement="contact_direct_panel"
                className="micro-interaction block rounded-2xl border border-white/25 bg-white/10 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-burgundy-deep"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Email photos
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-white">{BUSINESS.email}</p>
              </BusinessActionLink>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/20 bg-black/15">
              <div className="p-4 text-sm text-stone-100/90">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Visit
                </p>
                <p className="mt-2 leading-7">
                  {BUSINESS.address.street}
                  <br />
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </p>
                <BusinessActionLink
                  href={GOOGLE_MAPS_PRIMARY_URL}
                  action="directions"
                  placement="contact_visit_panel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro-interaction mt-4 inline-flex items-center justify-center rounded-full border border-brand-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-burgundy-deep"
                >
                  Open in Google Maps
                </BusinessActionLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Suspense fallback={null}>
        <DeferredContactSection />
      </Suspense>
      <Suspense fallback={null}>
        <GaConversionTracker
          active={submitted}
          eventName="contact_submit_success"
          submissionId={resolvedSearchParams?.id}
          leadType="contact"
          status="success"
        />
        <LeadFormTracker formId="contact-form" leadType="contact" hasError={error} />
      </Suspense>
    </SiteShell>
  );
}
