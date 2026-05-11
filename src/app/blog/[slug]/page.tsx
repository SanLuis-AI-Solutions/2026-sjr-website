import type { Metadata } from "next";
import Link from "next/link";
import { getImageProps } from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import {
  BLOG_MOBILE_HERO_IMAGE_BY_SLUG,
  BLOG_POSTS,
  getBlogPostBySlug,
  getCommercialIntentRelatedPosts,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { SERVICES } from "@/lib/constants";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPublishedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Article | Susie’s Jewelry Repair",
      description: "Repair guidance and local service advice from Susie’s Jewelry Repair.",
      canonical: "/blog",
    });
  }

  return createPageMetadata({
    title: `${post.title} | Susie’s Jewelry Repair`,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedServices = SERVICES.filter((service) =>
    post.relatedServiceSlugs.includes(service.slug)
  ).slice(0, 3);
  const relatedReads = getRelatedBlogPosts(post.slug, 2);
  const commercialGuides = getCommercialIntentRelatedPosts(post.slug, 2);
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const mobileHeroImageSrc = BLOG_MOBILE_HERO_IMAGE_BY_SLUG[post.slug] || null;
  const heroImageSizes = "(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) calc(100vw - 3rem), 1200px";
  const desktopHeroImageProps = getImageProps({
    src: post.image,
    alt: post.title,
    width: 1200,
    height: 720,
    sizes: heroImageSizes,
  }).props;
  const mobileHeroImageProps = mobileHeroImageSrc
    ? getImageProps({
        src: mobileHeroImageSrc,
        alt: post.title,
        width: 1200,
        height: 720,
        sizes: heroImageSizes,
      }).props
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.reviewedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Susie’s Jewelry Repair",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.susiesjewelryrepair.com/blog/${post.slug}`,
    },
    image: [post.image],
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <article className="relative overflow-hidden bg-white pb-16 pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <BreadcrumbTrail items={breadcrumbItems} />
          <div className="relative mt-6 h-60 overflow-hidden rounded-xl md:h-96 md:rounded-3xl md:border md:border-stone-200 md:shadow-[0_20px_55px_rgba(58,25,16,0.14)]">
            <picture>
              {mobileHeroImageProps?.srcSet ? (
                <source
                  media="(max-width: 767px)"
                  srcSet={mobileHeroImageProps.srcSet}
                  sizes={heroImageSizes}
                />
              ) : null}
              <img
                {...desktopHeroImageProps}
                alt={post.title}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 hidden bg-gradient-to-t from-[#1a0f10]/45 via-transparent to-transparent md:block" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-brand-burgundy">Blog Post</p>
          <h1
            className="lcp-heading md:text-5xl"
            style={{ marginTop: "0.75rem", fontSize: "2.25rem", lineHeight: "2.5rem", color: "#1c1917" }}
          >
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-700">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
              {post.readTime}
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
              Published{" "}
              <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt)}</time>
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
              Reviewed{" "}
              <time dateTime={post.reviewedAt}>{formatPublishedDate(post.reviewedAt)}</time>
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
              Reviewed by
            </p>
            <p className="mt-2 font-semibold text-stone-900">{post.authorName}</p>
            <p className="text-stone-600">{post.authorRole}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mt-2 space-y-8">
                {post.sections.map((section, index) => (
                  <section key={section.heading}>
                    <h2 className="font-serif text-2xl text-stone-900">{section.heading}</h2>
                    <div className="mt-3 space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-7 text-stone-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {index === 0 ? (
                      <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-burgundy">
                          Need a repair estimate?
                        </p>
                        <p className="mt-2 text-sm leading-7 text-stone-700">
                          We can confirm starting-at pricing and timing before you visit.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <TrackedLink
                            href="/quote"
                            eventName="article_mid_cta_click"
                            eventParams={{ blog_slug: post.slug, cta_target: "quote" }}
                            className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                          >
                            Get Fast Quote
                          </TrackedLink>
                          <TrackedLink
                            href="/book"
                            eventName="article_mid_cta_click"
                            eventParams={{ blog_slug: post.slug, cta_target: "book" }}
                            className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                          >
                            Book Repair
                          </TrackedLink>
                        </div>
                      </div>
                    ) : null}
                  </section>
                ))}

                {post.faqs && post.faqs.length > 0 ? (
                  <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                      In-body FAQ
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">
                      {post.faqHeading || "Common questions"}
                    </h2>
                    <div className="mt-5 space-y-4">
                      {post.faqs.map((faq) => (
                        <div
                          key={faq.question}
                          className="rounded-2xl border border-stone-200 bg-white p-5"
                        >
                          <h3 className="text-base font-semibold text-stone-900">{faq.question}</h3>
                          <p className="mt-2 text-sm leading-7 text-stone-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {post.decisionSignals && post.decisionSignals.length > 0 ? (
                  <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                      Repair decision guide
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">
                      What the symptom usually means
                    </h2>
                    <div className="mt-5 grid gap-4">
                      {post.decisionSignals.map((item) => (
                        <article
                          key={item.signal}
                          className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
                        >
                          <h3 className="text-base font-semibold text-stone-900">{item.signal}</h3>
                          <p className="mt-2 text-sm leading-7 text-stone-700">
                            <span className="font-semibold text-stone-900">Likely meaning: </span>
                            {item.meaning}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-stone-700">
                            <span className="font-semibold text-stone-900">Best next action: </span>
                            {item.nextAction}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                ) : null}

                {post.nextSteps && post.nextSteps.length > 0 ? (
                  <section className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-[0_18px_48px_rgba(58,25,16,0.08)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                      Next step
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">
                      {post.nextStepsHeading || "Get the right repair path"}
                    </h2>
                    {post.nextStepsIntro ? (
                      <p className="mt-3 text-sm leading-7 text-stone-700">{post.nextStepsIntro}</p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {post.nextSteps.map((item) => (
                        <TrackedLink
                          key={item.href}
                          href={item.href}
                          eventName="article_mid_cta_click"
                          eventParams={{ blog_slug: post.slug, cta_target: item.href }}
                          className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-900 hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                        >
                          {item.label}
                        </TrackedLink>
                      ))}
                    </div>
                  </section>
                ) : null}

                {commercialGuides.length > 0 ? (
                  <section className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                      Pricing and diagnosis guides
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">
                      Keep reading the articles customers compare before booking
                    </h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {commercialGuides.map((entry) => (
                        <TrackedLink
                          key={entry.slug}
                          href={`/blog/${entry.slug}`}
                          eventName="related_read_click"
                          eventParams={{
                            from_blog_slug: post.slug,
                            to_blog_slug: entry.slug,
                            section: "commercial_guides",
                          }}
                          className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
                            Commercial guide
                          </p>
                          <h3 className="mt-3 text-base font-semibold text-stone-900">
                            {entry.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-stone-700">{entry.excerpt}</p>
                        </TrackedLink>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                  Key takeaways
                </p>
                <ul className="mt-4 space-y-3 text-sm text-stone-700">
                  {post.keyTakeaways.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                  Related services
                </p>
                <div className="mt-4 space-y-2">
                  {relatedServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="block rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      <p className="text-sm font-semibold text-stone-900">{service.name}</p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {service.summary}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                        View service <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/quote"
                    className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Get Fast Quote
                  </Link>
                  <Link
                    href="/services"
                    className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    View Services
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {relatedReads.length > 0 ? (
            <section className="mt-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                Related reads
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {relatedReads.map((entry) => (
                  <TrackedLink
                    key={entry.slug}
                    href={`/blog/${entry.slug}`}
                    eventName="related_read_click"
                    eventParams={{ from_blog_slug: post.slug, to_blog_slug: entry.slug }}
                    className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_16px_38px_rgba(58,25,16,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
                      {entry.readTime}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">{entry.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-stone-600">{entry.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                      Read article <span aria-hidden="true">→</span>
                    </span>
                  </TrackedLink>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <CtaBand />
    </SiteShell>
  );
}
