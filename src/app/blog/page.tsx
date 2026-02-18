import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Jewelry Repair Tips and Guides | Susie’s Jewelry Repair Blog",
  description:
    "Practical repair guidance from our Pasadena in-house team: ring sizing, watch care, stone setting safety, and maintenance tips.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Blog
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900 md:text-5xl">
            Repair tips and local guidance.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Clear, practical advice from our in-house Pasadena team to help you protect your
            jewelry and watches between visits.
          </p>
          <div className="mt-7 flex flex-wrap gap-3" role="region" aria-label="Quick actions">
            <Link
              href="/quote"
              className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Repair
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BLOG_POSTS.map((post, index) => {
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
      </section>
    </SiteShell>
  );
}
