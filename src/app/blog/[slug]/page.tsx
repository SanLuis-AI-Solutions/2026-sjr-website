import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import { BLOG_POSTS, getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";
import { SERVICES } from "@/lib/constants";
import { TrackedLink } from "@/components/analytics/tracked-link";

type PageProps = {
  params: {
    slug: string;
  };
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
    return {
      title: "Article | Susie’s Jewelry Repair",
      description: "Repair guidance and local service advice from Susie’s Jewelry Repair.",
      alternates: {
        canonical: "/blog",
      },
    };
  }

  return {
    title: `${post.title} | Susie’s Jewelry Repair`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
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
  const mobileHeroImageSrc =
    post.slug === "ring-sizing-guide" ? "/images/blog/ring-sizing-guide-cover-mobile.avif" : null;
  const lcpHeroImageSrc = mobileHeroImageSrc || post.image;

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: "https://www.susiesjewelryrepair.com/blog",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: `https://www.susiesjewelryrepair.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="relative overflow-hidden bg-white pb-16 pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            ← Back to Blog
          </Link>
          <div className="relative mt-6 h-60 overflow-hidden rounded-xl md:h-96 md:rounded-3xl md:border md:border-stone-200 md:shadow-[0_20px_55px_rgba(58,25,16,0.14)]">
            <Image
              src={lcpHeroImageSrc}
              alt={post.title}
              priority
              fetchPriority="high"
              width={800}
              height={540}
              unoptimized={lcpHeroImageSrc.startsWith("/images/")}
              className="absolute inset-0 h-full w-full object-cover"
            />
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
                      className="block rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      {service.name}
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
