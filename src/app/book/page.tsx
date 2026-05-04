import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { LeadFormTracker } from "@/components/analytics/lead-form-tracker";
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
  title: "Book a Repair | Susie’s Jewelry Repair",
  description:
    "Request a free 15-minute repair assessment with our in-house Pasadena jewelry and watch team, and get booking confirmation by email within 1 business day.",
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
      <section className="relative overflow-hidden bg-stone-100 py-16">
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
            <h1 className="lcp-heading mt-3 text-4xl text-stone-900">
              Reserve a free 15‑minute assessment
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Request a time that works for you. We confirm availability within 1 business day.
            </p>
            <ConversionQuickActions
              page="book"
              primary={{ href: "#booking-form", label: "Start Booking" }}
              secondary={[
                { href: quoteHref, label: "Get Fast Quote" },
                { href: "/contact", label: "Contact Us", tone: "muted" },
              ]}
            />

            <div className="mt-8 rounded-2xl border border-stone-200 bg-white/70 px-5 py-4 text-sm text-stone-600">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Good to know
              </div>
              <ul className="mt-3 space-y-2">
                <li>• Most services are Same Day/Next Day service</li>
                <li>• Your appointment confirms intake timing and next steps</li>
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
                placeholder="What should we know before you arrive?"
              />
            </label>

            <button
              type="submit"
              className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={false}
              id="booking-submit"
            >
              <span id="booking-submit-text">Request Booking</span>
            </button>
            <p className="mt-3 text-center text-xs text-stone-600">
              Secure form · Booking confirmation within 1 business day.
            </p>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
