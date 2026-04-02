import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { BUSINESS, SERVICES } from "@/lib/constants";
import type { ServiceAreaPage } from "@/lib/service-areas";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getHelpfulBlogPostsForServiceSlugs } from "@/lib/blog";
import { getServiceAreaHighlightedServiceSlugs } from "@/lib/service-taxonomy";

type Props = {
  page: ServiceAreaPage;
};

export function ServiceAreaLandingPage({ page }: Props) {
  const highlightedServices = SERVICES.filter((service) =>
    getServiceAreaHighlightedServiceSlugs().includes(service.slug)
  );
  const helpfulReads =
    page.helpfulReads ??
    getHelpfulBlogPostsForServiceSlugs(page.helpfulReadServiceSlugs ?? [], 3).map((post) => ({
      label: post.title,
      href: `/blog/${post.slug}`,
    }));

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: page.city, href: `/services/${page.slug}` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Jewelry Repair Near ${page.city}, TX`,
    serviceType: "Jewelry repair and watch repair",
    areaServed: {
      "@type": page.areaSchemaType ?? "City",
      name: page.city,
    },
    provider: {
      "@type": "JewelryStore",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.city,
        addressRegion: BUSINESS.address.state,
        postalCode: BUSINESS.address.zip,
        addressCountry: "US",
      },
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <BreadcrumbTrail items={breadcrumbItems} className="mb-5" />
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
              Service area
            </p>
            <h1 className="lcp-heading mt-4 font-serif text-5xl leading-[1.05] text-stone-900 md:text-6xl">
              Jewelry repair near {page.city}, handled in-house.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 md:text-lg">
              {page.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-700">
              {page.trustPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2"
                >
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedLink
                href="/quote"
                eventName="service_area_cta_click"
                eventParams={{ area_slug: page.slug, cta_target: "quote" }}
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </TrackedLink>
              <TrackedLink
                href="/book"
                eventName="service_area_cta_click"
                eventParams={{ area_slug: page.slug, cta_target: "book" }}
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </TrackedLink>
            </div>
          </div>

          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-stone-200 shadow-[0_24px_60px_rgba(58,25,16,0.18)] md:h-[480px]">
            <Image
              src={page.heroImage}
              alt={page.heroAlt}
              fill
              priority
              sizes="(max-width: 768px) calc(100vw - 3rem), 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="rounded-2xl border border-white/20 bg-black/45 px-4 py-4 text-white backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                  Visit the workshop
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-100">
                  {BUSINESS.address.street}
                  <br />
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <section>
              <h2 className="font-serif text-3xl text-stone-900">{page.whyHeading}</h2>
              <div className="mt-4 space-y-4">
                {page.whyBody.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-stone-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl text-stone-900">{page.commonRepairsHeading}</h2>
              <div className="mt-4 space-y-4">
                {page.commonRepairsBody.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-stone-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6">
              <h2 className="font-serif text-3xl text-stone-900">{page.visitHeading}</h2>
              <div className="mt-4 space-y-4">
                {page.visitBody.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-stone-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Nearby service menu
              </p>
              <div className="mt-4 space-y-2">
                {highlightedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </section>

            {helpfulReads.length ? (
              <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                  Helpful reads
                </p>
                <div className="mt-4 space-y-2">
                  {helpfulReads.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Quick answers
              </p>
              <div className="mt-4 space-y-4">
                {page.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h2 className="text-sm font-semibold text-stone-900">{faq.question}</h2>
                    <p className="mt-2 text-sm leading-7 text-stone-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
