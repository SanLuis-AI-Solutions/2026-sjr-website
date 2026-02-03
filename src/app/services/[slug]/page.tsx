import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { getFaqsByService, getServiceBySlug } from "@/lib/content";
import { serviceFaqSchema, serviceSchema } from "@/lib/schema";

const UPDATED_DATE = "February 1, 2026";

type PageProps = {
  params: {
    slug: string;
  };
};

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
  const service = await getServiceBySlug(slug);
  const faqs = await getFaqsByService(slug);

  if (!service) {
    notFound();
  }

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
            {faqs.map((faq: { question: string; answer: string }) => (
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
          __html: JSON.stringify(serviceFaqSchema(service)),
        }}
      />
    </SiteShell>
  );
}
