import { SiteShell } from "@/components/site-shell";

const posts = [
  {
    slug: "how-to-choose-a-jeweler",
    title: "How to Choose a Trustworthy Jeweler",
    excerpt: "Key signs of in‑house craftsmanship, transparency, and local trust.",
    image:
      "https://images.unsplash.com/photo-1518544887872-6d1d3ed4b799?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "ring-sizing-guide",
    title: "Ring Sizing: What to Know Before You Resize",
    excerpt: "Best practices for resizing without compromising the band.",
    image:
      "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "watch-battery-replacement",
    title: "Watch Battery Replacement: Timing & Tips",
    excerpt: "When to replace, what to expect, and how to protect your watch.",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function BlogPage() {
  return (
    <SiteShell>
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Blog
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Repair tips & local guidance
          </h1>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-lg border border-stone-200 bg-white p-6 transition hover:shadow-md"
              >
                <div
                  className="mb-4 h-40 w-full rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.image}')` }}
                  aria-hidden="true"
                />
                <h2 className="font-serif text-xl text-stone-900">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm text-stone-600">{post.excerpt}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.25em] text-brand-gold">
                  Read more
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
