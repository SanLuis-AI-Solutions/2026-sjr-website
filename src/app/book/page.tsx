import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { LeadFormTracker } from "@/components/analytics/lead-form-tracker";
import { LeadAttributionFields } from "@/components/analytics/lead-attribution-fields";
import { ConversionQuickActions } from "@/components/analytics/conversion-quick-actions";
import { BookingDateTimeFields } from "@/components/booking-date-time-fields";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { FormSubmitInitializer } from "@/components/form-submit-initializer";
import { BUSINESS } from "@/lib/constants";
import { Suspense } from "react";
import { createPageMetadata } from "@/lib/metadata";
import { getServices } from "@/lib/content";
import {
  buildServicesFinderLeadContextHref,
  getServicesFinderHiddenFields,
  resolveServicesFinderLeadContext,
} from "@/lib/service-lead-context";

export const metadata = createPageMetadata({
  title: "Book a Repair Visit | Susie’s Jewelry Repair",
  description:
    "Book a preferred repair visit with our in-house Pasadena jewelry and watch team. No payment required; we confirm availability by email.",
  canonical: "/book",
});

export default async function BookPage({
  searchParams,
}: {
  searchParams?: Promise<{
    submitted?: string;
    error?: string;
    pending?: string;
    id?: string;
    from?: string;
    area?: string;
    service?: string;
    intent?: string;
    query?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const submitted = resolvedSearchParams?.submitted === "1";
  const error = resolvedSearchParams?.error === "1";
  const pending = resolvedSearchParams?.pending === "1";
  const services =
    resolvedSearchParams?.from === "services_finder" ? await getServices() : [];
  const finderContext = resolveServicesFinderLeadContext(resolvedSearchParams || {}, services);
  const hiddenFields = getServicesFinderHiddenFields(finderContext);
  const quoteHref = finderContext
    ? buildServicesFinderLeadContextHref("/quote", {
        serviceSlug: finderContext.serviceSlug,
        intentLabel: finderContext.intentLabel,
        query: finderContext.query,
      })
    : "/quote";
  const bookingEventName = pending
    ? "booking_submit_pending"
    : "booking_submit_success";
  return (
    <SiteShell>
      <FormSubmitInitializer />
      <section className="relative overflow-hidden bg-stone-100 py-10 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-start">
          <Suspense fallback={null}>
            <GaConversionTracker
              active={submitted}
              eventName={bookingEventName}
              submissionId={resolvedSearchParams?.id}
              leadType="booking"
              status={pending ? "pending" : "success"}
            />
            <LeadFormTracker formId="booking-form" leadType="booking" hasError={error} />
          </Suspense>
          <div>
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
                  We will confirm availability or send the closest option to your email.
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
              Repair time request
            </p>
            <h1
              className="lcp-sans"
              style={{
                marginTop: "0.75rem",
                fontSize: "2.25rem",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: "2.5rem",
                color: "#1c1917",
              }}
            >
              Book a repair visit
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Choose when you would like to bring the piece in. There is no payment today, and we
              confirm availability within 1 business day.
            </p>
            <ConversionQuickActions
              page="book"
              primary={{ href: "#booking-form", label: "Choose Time" }}
              secondary={[
                { href: quoteHref, label: "Get Fast Quote" },
                { href: "/contact", label: "Contact Us", tone: "muted" },
              ]}
            />

            <div className="mt-8 hidden rounded-2xl border border-stone-200 bg-white/70 px-5 py-4 text-sm text-stone-600 md:block">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Good to know
              </div>
              <ul className="mt-3 space-y-2">
                <li>• Most services are Same Day/Next Day service</li>
                <li>• This is a time request; the shop confirms the final appointment by email</li>
                <li>
                  • Need help fast? Call{" "}
                  <BusinessActionLink
                    href={`tel:${BUSINESS.phone}`}
                    action="phone_call"
                    placement="book_page"
                    className="font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    {BUSINESS.phone}
                  </BusinessActionLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {finderContext ? (
              <div className="reveal-on-scroll rounded-3xl border border-brand-gold/40 bg-brand-gold/10 p-5 text-sm text-stone-700">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Repair focus
                </div>
                <div className="mt-3 space-y-2">
                  {finderContext.serviceName || finderContext.serviceSlug ? (
                    <p>
                      Suggested service:{" "}
                      <span className="font-semibold text-stone-900">
                        {finderContext.serviceName || finderContext.serviceSlug}
                      </span>
                    </p>
                  ) : null}
                  {finderContext.areaLabel ? (
                    <p>
                      Customer area:{" "}
                      <span className="font-semibold text-stone-900">
                        {finderContext.areaLabel}
                      </span>
                    </p>
                  ) : null}
                  {finderContext.intentLabel ? (
                    <p>
                      Selected issue:{" "}
                      <span className="font-semibold text-stone-900">
                        {finderContext.intentLabel}
                      </span>
                    </p>
                  ) : null}
                  {finderContext.query ? (
                    <p>
                      Search phrase:{" "}
                      <span className="font-semibold text-stone-900">
                        {finderContext.query}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
            <form
              id="booking-form"
              action="/api/book"
              method="post"
              className="reveal-on-scroll scroll-mt-24 rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm md:p-6"
            >
            <div className="mb-4 rounded-2xl border border-brand-gold/35 bg-brand-gold/10 px-4 py-3 text-sm text-stone-700">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
                No payment required
              </p>
              <p className="mt-2 leading-6">
                Pick the time you prefer. We confirm by email or send the closest available option.
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
            <LeadAttributionFields />
            {hiddenFields ? (
              <>
                <input type="hidden" name="lead_source_context" value={hiddenFields.lead_source_context} />
                <input type="hidden" name="area_slug" value={hiddenFields.area_slug} />
                <input type="hidden" name="service_slug" value={hiddenFields.service_slug} />
                <input type="hidden" name="intent_label" value={hiddenFields.intent_label} />
                <input type="hidden" name="intent_query" value={hiddenFields.intent_query} />
              </>
            ) : null}

            <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
              Full name <span className="text-brand-burgundy">*</span>
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
              Email <span className="text-brand-burgundy">*</span>
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

            <BookingDateTimeFields />

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Details (optional)
              <textarea
                name="details"
                className="mt-2 min-h-[100px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:min-h-[140px]"
                defaultValue={finderContext?.detailsSeed || undefined}
                aria-describedby="booking-details-help"
                placeholder="Example: Ring sizing, watch battery, loose stone, or not sure yet."
              />
            </label>
            <p id="booking-details-help" className="mt-2 text-xs leading-5 text-stone-600">
              A short note helps us prepare, but you can leave this blank if you only need an assessment.
            </p>

            <button
              type="submit"
              className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={false}
              id="booking-submit"
            >
              <span id="booking-submit-text">Request Repair Visit</span>
            </button>
            <p className="mt-3 text-center text-xs text-stone-600">
              Secure form · No payment required · Final appointment confirmed by email.
            </p>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
