import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { getFaqsByService, getServiceBySlug, getServices } from "@/lib/content";
import { serviceFaqSchema, serviceSchema } from "@/lib/schema";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";

const UPDATED_DATE = "February 1, 2026";

type PageProps = {
  params: {
    slug: string;
  };
};

type FaqItem = {
  question: string;
  answer: string;
};

function buildFallbackFaqs(serviceName: string): FaqItem[] {
  return [
    {
      question: `How long does ${serviceName.toLowerCase()} usually take?`,
      answer:
        "Most pieces are assessed the same day. Final timing depends on parts and repair complexity, and we confirm that before work begins.",
    },
    {
      question: "Is the repair done in-house?",
      answer:
        "Yes. All repair work is completed in our Pasadena shop by our in-house team, so your piece is not shipped out.",
    },
    {
      question: "Can I get a quote before I commit?",
      answer:
        "Yes. Use our Fast Quote form or visit the shop for a free assessment, and we will provide clear starting-at pricing before you approve work.",
    },
  ];
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Service | ${BUSINESS.name}`,
      description:
        "Explore our in-house jewelry and watch repair services in Pasadena, TX.",
    };
  }

  const location = `${BUSINESS.address.city}, ${BUSINESS.address.state}`;
  const title = `${service.name} in ${location} | ${BUSINESS.name}`;
  const summary = service.summary || service.short_summary || "";
  const description = `${summary} Local, in-house service with transparent pricing and fast turnaround.`;

  return {
    title,
    description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, faqs, services] = await Promise.all([
    getServiceBySlug(slug),
    getFaqsByService(slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const resolvedFaqs =
    Array.isArray(faqs) && faqs.length > 0 ? faqs : buildFallbackFaqs(service.name);
  const relatedServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 4);
  const startingAt =
    formatStartingAt((service as any).starting_price ?? (service as any).startingPrice ?? null) ??
    formatStartingAt((service as any).startingPrice ?? null);
  const timeEstimate =
    formatTimeEstimate((service as any).time_estimate ?? (service as any).timeEstimate ?? null) ??
    formatTimeEstimate((service as any).timeEstimate ?? null);

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Service Detail
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              {service.name} in {BUSINESS.address.city}, {BUSINESS.address.state}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-stone-600">
              {service.summary || service.short_summary}
            </p>
            {(startingAt || timeEstimate) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-600">
                {startingAt && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                    Starts at {startingAt}
                  </span>
                )}
                {timeEstimate && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                    Typical: {timeEstimate}
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 rounded-xl border border-brand-gold/30 bg-white/80 p-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Need {service.name} in {BUSINESS.address.city}?
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Yes. We provide in-house {service.name.toLowerCase()} with
                transparent pricing, clear timing, and local pickup at our{" "}
                {BUSINESS.address.city} shop.
              </p>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone-600">
              Last updated {UPDATED_DATE}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-burgundy-deep"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="rounded-lg border border-brand-gold px-6 py-3 text-sm font-semibold text-brand-burgundy transition hover:bg-brand-gold/10"
              >
                Book a Repair
              </Link>
            </div>
          </div>
          <div className="relative">
            <div
              className="h-[320px] rounded-2xl border border-stone-200 bg-cover bg-center shadow-sm md:h-[380px]"
              style={{ backgroundImage: `url('${service.image_url || service.image || ""}')` }}
              aria-hidden="true"
            />
            <div className="absolute -bottom-8 left-6 right-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.25em] text-brand-burgundy">
                In-house assessment
              </div>
              <p className="mt-2 text-sm text-stone-600">
                Fast, local evaluations with transparent starting-at pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              What to expect
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              Clear guidance and careful workmanship.
            </h2>
            {(service.longDescription || service.long_description || []).map((paragraph: string) => (
              <p key={paragraph} className="mt-4 text-sm text-stone-600">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-100/60 p-6">
            {(startingAt || timeEstimate) && (
              <>
                <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  Pricing & timing
                </div>
                <div className="mt-4 grid gap-3 text-sm text-stone-600">
                  {startingAt && (
                    <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                      <span className="font-semibold text-stone-900">Starting at</span>
                      <span>{startingAt}</span>
                    </div>
                  )}
                  {timeEstimate && (
                    <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                      <span className="font-semibold text-stone-900">Typical turnaround</span>
                      <span>{timeEstimate}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 border-t border-stone-200 pt-4" />
              </>
            )}
            <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Includes
            </div>
            <ul className="mt-4 space-y-3 text-sm text-stone-600">
              {(service.includes || []).map((item: string) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-stone-200 pt-4">
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Common requests
              </div>
              <ul className="mt-3 space-y-2 text-sm text-stone-600">
                {(service.commonRequests || service.common_requests || []).map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 border-t border-stone-200 pt-4">
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Why customers choose us
              </div>
              <ul className="mt-3 space-y-2 text-sm text-stone-600">
                <li>• In-house repairs with no outsourcing</li>
                <li>• Same-day assessments on most pieces</li>
                <li>• Clear approval before work starts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Service area
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              Local care for {BUSINESS.address.city} and nearby communities.
            </h2>
            <p className="mt-4 text-sm text-stone-600">
              Visit us at {BUSINESS.address.street}, {BUSINESS.address.city}, {" "}
              {BUSINESS.address.state} {BUSINESS.address.zip}. We serve {" "}
              {BUSINESS.serviceAreas.join(", ")}. Call {BUSINESS.phone} for
              timing or pricing questions.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Hours
            </div>
            <div className="mt-4 grid gap-3 text-sm text-stone-600">
              {BUSINESS.hours.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
                >
                  <span className="font-semibold text-stone-900">{row.day}</span>
                  <span>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            FAQs
          </p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">
            Answers about {service.name}.
          </h2>
          <div className="mt-8 space-y-4">
            {resolvedFaqs.map((faq: FaqItem) => (
              <div
                key={faq.question}
                className="rounded-xl border border-stone-200 bg-stone-100/60 p-5"
              >
                <div className="font-semibold text-stone-900">
                  {faq.question}
                </div>
                <p className="mt-2 text-sm text-stone-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Related services
              </p>
              <h2 className="mt-2 font-serif text-2xl text-stone-900">
                Compare nearby repair options
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep"
            >
              View all services →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema(service)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceFaqSchema({ ...service, faqs: resolvedFaqs })),
        }}
      />
    </SiteShell>
  );
}
