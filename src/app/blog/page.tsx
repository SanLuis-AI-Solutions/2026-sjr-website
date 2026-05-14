import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import {
  BLOG_POSTS,
  BLOG_TOPICS,
  getBlogHubPopularServiceSlugs,
  sortBlogPostsForDiscovery,
} from "@/lib/blog";
import { BlogTopicFilterTracker } from "@/components/analytics/blog-topic-filter-tracker";
import { createPageMetadata } from "@/lib/metadata";
import { SERVICES } from "@/lib/constants";

export const metadata = createPageMetadata({
  title: "Jewelry Repair Tips and Guides | Susie’s Jewelry Repair Blog",
  description:
    "Practical repair guidance from our Pasadena in-house team: ring sizing, watch care, stone setting safety, and maintenance tips.",
  canonical: "/blog",
});

type BlogPageProps = {
  searchParams?: Promise<{
    topic?: string;
  }>;
};

function resolveTopic(topic?: string) {
  if (!topic) return null;
  return BLOG_TOPICS.find((entry) => entry.toLowerCase() === topic.toLowerCase()) || null;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedTopic = resolveTopic(resolvedSearchParams?.topic);
  const scopedPosts = selectedTopic
    ? BLOG_POSTS.filter((post) => post.topics.includes(selectedTopic))
    : BLOG_POSTS;
  const visiblePosts = sortBlogPostsForDiscovery(scopedPosts.length > 0 ? scopedPosts : BLOG_POSTS);
  const [featuredPost, ...libraryPosts] = visiblePosts;
  const popularServiceLinks = getBlogHubPopularServiceSlugs(3)
    .map((slug) => SERVICES.find((service) => service.slug === slug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-14 md:py-16" aria-labelledby="blog-hero-title">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Blog
          </p>
          <h1 id="blog-hero-title" className="lcp-heading mt-3 text-4xl text-stone-900 md:text-5xl">
            Repair tips and local guidance.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-600">
            Clear, practical advice from our in-house Pasadena team to help you protect your
            jewelry and watches between visits.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="micro-interaction hidden min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:inline-flex"
            >
              Book Repair
            </Link>
          </div>
          <details className="mt-6 rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-900 marker:hidden">
              Filter repair guides
              <span aria-hidden="true" className="text-brand-burgundy">
                +
              </span>
            </summary>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-200 pt-3" aria-label="Blog topics">
              {selectedTopic ? (
                <Link
                  href="/blog"
                  data-track-event="blog_topic_click"
                  data-track-topic="all"
                  data-track-placement="topic_filter"
                  className="inline-flex min-h-11 items-center rounded-full border border-brand-burgundy bg-brand-burgundy px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  All topics
                </Link>
              ) : null}
              {BLOG_TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={`/blog?topic=${encodeURIComponent(topic)}`}
                  data-track-event="blog_topic_click"
                  data-track-topic={topic}
                  data-track-placement="topic_filter"
                  className={`inline-flex min-h-11 items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
                    selectedTopic === topic
                      ? "border-brand-burgundy bg-brand-burgundy text-white"
                      : "border-stone-200 bg-white/85 text-stone-700"
                  }`}
                >
                  {topic}
                </Link>
              ))}
            </div>
          </details>
          <div className="mt-6 hidden flex-wrap gap-2 md:flex" aria-label="Blog topics">
            {selectedTopic ? (
              <Link
                href="/blog"
                data-track-event="blog_topic_click"
                data-track-topic="all"
                data-track-placement="topic_filter"
                className="inline-flex min-h-11 items-center rounded-full border border-brand-burgundy bg-brand-burgundy px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                All topics
              </Link>
            ) : null}
            {BLOG_TOPICS.map((topic) => (
              <Link
                key={topic}
                href={`/blog?topic=${encodeURIComponent(topic)}`}
                data-track-event="blog_topic_click"
                data-track-topic={topic}
                data-track-placement="topic_filter"
                className={`inline-flex min-h-11 items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
                  selectedTopic === topic
                    ? "border-brand-burgundy bg-brand-burgundy text-white"
                    : "border-stone-200 bg-white/85 text-stone-700"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
          {selectedTopic ? (
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">
              Showing topic: {selectedTopic}
            </p>
          ) : null}
          <details className="mt-5 rounded-2xl border border-stone-200 bg-white/85 px-4 py-3 shadow-sm md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-stone-900 marker:hidden">
              Start with a repair page
              <span aria-hidden="true" className="text-brand-burgundy">
                +
              </span>
            </summary>
            <div className="mt-3 grid gap-2 border-t border-stone-200 pt-3">
              {popularServiceLinks.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-11 items-center rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </details>
          <div className="mt-6 hidden rounded-2xl border border-stone-200 bg-white/85 p-4 shadow-sm md:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
              Start with a repair page
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularServiceLinks.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_22px_64px_rgba(58,25,16,0.15)] transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_28px_75px_rgba(58,25,16,0.17)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="relative min-h-[16rem] md:min-h-[22rem]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  priority
                  loading="eager"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
                    Featured guide
                  </p>
                  <h2 className="lcp-heading mt-3 text-3xl leading-tight text-stone-900">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-7 text-stone-600">{featuredPost.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featuredPost.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-stone-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.25em]">
                  <span className="font-semibold text-brand-burgundy">{featuredPost.readTime}</span>
                  <span className="text-stone-500">{featuredPost.publishedAt}</span>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {libraryPosts.map((post, index) => {
              const delayClass = `reveal-delay-${(index % 3) + 1}`;
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`reveal-on-scroll ${delayClass} group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_55px_rgba(58,25,16,0.12)] transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_28px_70px_rgba(58,25,16,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2`}
                >
                  <div className="relative h-44">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
                      {post.readTime}
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone-500">
                      {post.publishedAt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.topics.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-stone-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">{post.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-burgundy">
                      Read article
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <BlogTopicFilterTracker />
      </section>
    </SiteShell>
  );
}
