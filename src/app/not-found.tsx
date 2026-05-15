import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const featuredLinks = [
  { href: "/services/watch-repair", label: "Watch Repair" },
  { href: "/services/ring-sizing", label: "Ring Sizing" },
  { href: "/services/heirloom-restoration", label: "Heirloom Restoration" },
  { href: "/contact", label: "Contact Us" },
];

export default function NotFoundPage() {
  return (
    <SiteShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Page not found", href: "/404" },
        ]}
      />
      <section className="relative overflow-hidden bg-stone-100 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">404</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
            That page is not here anymore.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-stone-700">
            If you were looking for repair help, the fastest path is one of the services below or a direct message to our Pasadena workshop.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/book"
              className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book a Repair
            </Link>
            <Link
              href="/quote"
              className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get a Quote
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {featuredLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-stone-200 bg-white p-5 text-left text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
