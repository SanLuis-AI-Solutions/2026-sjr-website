import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { BLOG_POSTS, sortBlogPostsForDiscovery } from "@/lib/blog";
import { SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Site Map | Susie's Jewelry Repair",
  description:
    "Browse Susie's Jewelry Repair pages, including services, nearby service areas, repair guides, and contact paths.",
  canonical: "/site-map",
});

const corePages = [
  { href: "/", label: "Home", description: "Jewelry and watch repair overview." },
  { href: "/services", label: "Services", description: "In-house repair service directory." },
  { href: "/book", label: "Book a Repair", description: "Reserve a repair assessment or get a starting price." },
  { href: "/blog", label: "Repair Guides", description: "Pricing, timing, and care articles." },
  { href: "/contact", label: "Contact", description: "Shop address, phone, and contact form." },
  { href: "/about", label: "About", description: "Local shop story and trust signals." },
  { href: "/faq", label: "FAQ", description: "Common repair questions." },
];

function SitemapSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
          Crawl path
        </p>
        <h2 className="mt-3 font-serif text-3xl text-stone-900">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-stone-700">{description}</p>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function SitemapCard({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:bg-white hover:shadow-[0_18px_44px_rgba(58,25,16,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
    >
      <span className="block font-serif text-2xl text-stone-900">{label}</span>
      <span className="mt-2 block text-sm leading-6 text-stone-700">{description}</span>
    </Link>
  );
}

export default function HtmlSitemapPage() {
  const blogPosts = sortBlogPostsForDiscovery(BLOG_POSTS, "blogFeatured");

  return (
    <SiteShell>
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
            Site map
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-stone-900 md:text-6xl">
            Every repair path, in one crawlable place.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700 md:text-lg">
            Use this page to find Susie&apos;s Jewelry Repair service pages, nearby city repair
            pages, and commercial repair guides. Search engines can also use it as a clean
            internal discovery path to the pages that matter most.
          </p>
          <Link
            href="/sitemap.xml"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-burgundy transition hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            XML Sitemap
          </Link>
        </div>
      </section>

      <div className="bg-background py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <SitemapSection
            title="Core pages"
            description="Main conversion, contact, and discovery pages for visitors who need repair help."
          >
            {corePages.map((page) => (
              <SitemapCard key={page.href} {...page} />
            ))}
          </SitemapSection>

          <SitemapSection
            title="Repair services"
            description="Commercial service pages for the in-house repairs customers request most often."
          >
            {SERVICES.map((service) => (
              <SitemapCard
                key={service.slug}
                href={`/services/${service.slug}`}
                label={service.name}
                description={service.summary}
              />
            ))}
          </SitemapSection>

          <SitemapSection
            title="Nearby service areas"
            description="Local service-area pages for nearby customers planning a repair visit to the Pasadena workshop."
          >
            {SERVICE_AREA_PAGES.map((area) => (
              <SitemapCard
                key={area.slug}
                href={`/services/${area.slug}`}
                label={`Jewelry repair near ${area.city}`}
                description={area.cardDescription}
              />
            ))}
          </SitemapSection>

          <SitemapSection
            title="Repair guides"
            description="Commercial-intent guides that answer pricing, timing, care, and repair-decision questions."
          >
            {blogPosts.map((post) => (
              <SitemapCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                label={post.title}
                description={post.excerpt}
              />
            ))}
          </SitemapSection>
        </div>
      </div>
    </SiteShell>
  );
}
