import { SiteShell } from "@/components/site-shell";
import { GaConversionTracker } from "@/components/analytics/ga-tracker";
import { LeadFormTracker } from "@/components/analytics/lead-form-tracker";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { FormSubmitInitializer } from "@/components/form-submit-initializer";
import { BookingFormSteps } from "@/app/book/booking-form-steps";
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
  title: "Book a Jewelry Repair | Pasadena, TX | Susie’s Jewelry Repair",
  description:
    "Schedule your ring, watch, or heirloom repair with our in-house Pasadena team. No payment required to book — we confirm availability by email within 1 business day.",
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
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">
              Pick a preferred drop-off time. No payment today; we confirm by email within 1
              business day.
            </p>
            <div className="mt-8 hidden rounded-2xl border border-stone-200 bg-white/70 px-5 py-4 text-sm text-stone-600 md:block">
              <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
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
                <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
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
            <BookingFormSteps finderContext={finderContext} hiddenFields={hiddenFields} />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
