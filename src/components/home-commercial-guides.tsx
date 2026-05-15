import Link from "next/link";
import { getCommercialIntentBlogPosts } from "@/lib/blog";

export function HomeCommercialGuides() {
  const commercialGuides = getCommercialIntentBlogPosts(6);
  const mobileGuides = commercialGuides.slice(0, 3);

  if (commercialGuides.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div
          data-mobile-crawl-hub
          className="rounded-3xl border border-stone-200 bg-stone-50 p-5 shadow-[0_14px_34px_rgba(58,25,16,0.08)] md:hidden"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
            Pricing help
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-tight text-stone-900">
            Price and timing guides, when you need them.
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The quote button above is the fastest path. Open these only if you want to compare
            common repair questions before contacting the shop.
          </p>
          <details
            data-mobile-sidebar-section
            className="mt-4 rounded-2xl border border-stone-200 bg-white px-4 py-2"
          >
            <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-stone-900">
              Show top repair guides
            </summary>
            <div className="mt-3 grid gap-2">
              {mobileGuides.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold leading-5 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {post.title}
                </Link>
              ))}
              <Link
                href="/blog"
                className="rounded-xl border border-brand-gold/45 bg-white px-4 py-3 text-sm font-semibold text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Browse all repair guides
              </Link>
            </div>
          </details>
        </div>

        <div className="hidden flex-wrap items-end justify-between gap-4 md:flex">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
              Pricing and repair guides
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              Start with the questions customers ask before they book.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700 md:block">
              These guides answer the pricing, timing, and battery-vs-repair questions that
              usually drive the first call or quote request.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep hover:bg-brand-burgundy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            View all articles →
          </Link>
        </div>

        <div className="mt-6 hidden gap-4 md:grid md:grid-cols-3">
          {commercialGuides.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_18px_44px_rgba(58,25,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${index > 2 ? "hidden md:block" : ""}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
                Repair guide
              </p>
              <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900 md:text-2xl">
                {post.title}
              </h3>
              <p className="mt-3 hidden text-sm leading-7 text-stone-700 md:block">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
