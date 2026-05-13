import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES, type ServiceAreaPage } from "@/lib/service-areas";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getHelpfulBlogPostsForServiceSlugs } from "@/lib/blog";
import { buildServicesFinderLeadContextHref } from "@/lib/service-lead-context";
import { getServiceAreaHighlightedServiceSlugs } from "@/lib/service-taxonomy";

type Props = {
  page: ServiceAreaPage;
};

const PRIORITY_SERVICE_AREA_SLUGS = [
  "pasadena",
  "friendswood",
  "webster",
  "clear-lake",
  "la-porte",
];

export function ServiceAreaLandingPage({ page }: Props) {
  const serviceLookup = new Map(SERVICES.map((service) => [service.slug, service] as const));
  const highlightedServiceSlugs =
    page.helpfulReadServiceSlugs && page.helpfulReadServiceSlugs.length > 0
      ? page.helpfulReadServiceSlugs
      : getServiceAreaHighlightedServiceSlugs();
  const highlightedServices = highlightedServiceSlugs
    .map((slug) => serviceLookup.get(slug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));
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
  const nearbyAreas = SERVICE_AREA_PAGES.filter((entry) => entry.slug !== page.slug)
    .sort((a, b) => {
      const aPriority = PRIORITY_SERVICE_AREA_SLUGS.indexOf(a.slug);
      const bPriority = PRIORITY_SERVICE_AREA_SLUGS.indexOf(b.slug);
      const normalizedA = aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
      const normalizedB = bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;
      return normalizedA - normalizedB;
    })
    .slice(0, 5);
  const canonicalUrl = `https://www.susiesjewelryrepair.com/services/${page.slug}`;
  const quoteHref = buildServicesFinderLeadContextHref("/quote", { areaSlug: page.slug });
  const bookingHref = buildServicesFinderLeadContextHref("/book", { areaSlug: page.slug });

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
    "@id": `${canonicalUrl}#service-area`,
    url: canonicalUrl,
    name: `Jewelry Repair Near ${page.city}, TX`,
    serviceType: "Jewelry repair and watch repair",
    description: page.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    areaServed: {
      "@type": page.areaSchemaType ?? "City",
      name: page.city,
    },
    provider: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Common repair paths for ${page.city}`,
      itemListElement: highlightedServices.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          "@id": `https://www.susiesjewelryrepair.com/services/${service.slug}#service`,
          url: `https://www.susiesjewelryrepair.com/services/${service.slug}`,
          name: service.name,
          description: service.summary,
        },
      })),
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
              {page.heroHeading ?? `Jewelry repair near ${page.city}, handled in-house.`}
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
                href={quoteHref}
                eventName="service_area_cta_click"
                eventParams={{ area_slug: page.slug, cta_target: "quote" }}
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </TrackedLink>
              <TrackedLink
                href={bookingHref}
                eventName="service_area_cta_click"
                eventParams={{ area_slug: page.slug, cta_target: "book" }}
                className="micro-interaction hidden min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:inline-flex"
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

            {page.repairPathGuide ? (
              <section className="rounded-3xl border border-brand-gold/30 bg-[#fffaf0] p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                  Local repair triage
                </p>
                <h2 className="mt-3 font-serif text-3xl text-stone-900">
                  {page.repairPathGuide.heading}
                </h2>
                <p className="mt-4 text-[15px] leading-8 text-stone-700">
                  {page.repairPathGuide.intro}
                </p>
                <div className="mt-6 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  {page.repairPathGuide.items.map((item) => (
                    <article key={item.situation} className="grid gap-4 p-4 md:grid-cols-[1fr_0.8fr_1fr]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                          Situation
                        </p>
                        <h3 className="mt-2 text-sm font-semibold leading-6 text-stone-900">
                          {item.situation}
                        </h3>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                          Likely path
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-brand-burgundy">
                          {item.likelyPath}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                          Next step
                        </p>
                        <p className="mt-2 text-sm leading-7 text-stone-700">{item.nextStep}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

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

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Best starting points for {page.city}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {page.localScenarios.map((scenario) => (
                  <article key={scenario.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <h2 className="font-serif text-2xl text-stone-900">{scenario.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-stone-700">{scenario.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Popular with {page.city} customers
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                These are the repair categories and quote-first topics we most often point {page.city} customers to before they make the drive to Pasadena.
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

            {nearbyAreas.length ? (
              <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                  Nearby cities we also serve
                </p>
                <div className="mt-4 space-y-2">
                  {nearbyAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/services/${area.slug}`}
                      className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Jewelry repair near {area.city}
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
