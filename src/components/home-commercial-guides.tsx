import Link from "next/link";
import { getCommercialIntentBlogPosts } from "@/lib/blog";

export function HomeCommercialGuides() {
  const commercialGuides = getCommercialIntentBlogPosts(6);

  if (commercialGuides.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
              Pricing and repair guides
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              Start with the questions customers ask before they book.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
              These guides answer the pricing, timing, and battery-vs-repair questions that
              usually drive the first call or quote request.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            View all articles →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {commercialGuides.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_18px_44px_rgba(58,25,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
                Commercial intent
              </p>
              <h3 className="mt-3 font-serif text-2xl text-stone-900">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-700">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
