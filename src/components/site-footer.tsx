import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { PRIORITY_REPAIR_PATHS } from "@/lib/priority-repair-paths";
import { BrandMark } from "@/components/brand-mark";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { TrackedAnchor } from "@/components/analytics/tracked-anchor";

const COPYRIGHT_YEAR = 2026;

type FooterLink = { href: string; label: string };

function FooterNavLinks({ links }: { links: FooterLink[] }) {
  return (
    <nav className="flex flex-col gap-3 text-sm font-sans uppercase tracking-[0.15em] md:gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-12 items-center rounded-lg px-2 py-1 text-stone-300 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileFooterGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <summary className="cursor-pointer list-none font-serif text-lg text-white marker:hidden">
        <span className="flex min-h-11 items-center justify-between gap-4">
          {title}
          <span aria-hidden className="font-sans text-xs text-brand-gold group-open:hidden">+</span>
          <span aria-hidden className="hidden font-sans text-xs text-brand-gold group-open:inline">−</span>
        </span>
      </summary>
      <div className="mt-4 border-t border-white/10 pt-4">
        <FooterNavLinks links={links} />
      </div>
    </details>
  );
}

function AddressBlock() {
  return (
    <div className="mt-5 space-y-5">
      <address className="flex flex-col gap-1 text-sm not-italic leading-relaxed text-stone-300">
        <span>{BUSINESS.address.street}</span>
        <span>{BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}</span>
      </address>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold/80">Hours</p>
        <div className="grid gap-1">
          {BUSINESS.hours.map((row) => (
            <div key={row.day} className="flex justify-between text-xs text-stone-300">
              <span>{row.day}</span>
              <span className="font-medium text-stone-200">{row.hours}</span>
            </div>
          ))}
        </div>
      </div>

      <BusinessActionLink
        href={`tel:${BUSINESS.phone}`}
        action="phone_call"
        placement="footer"
        className="block font-semibold text-brand-gold transition-colors hover:text-white"
      >
        {BUSINESS.phone}
      </BusinessActionLink>

      <div className="flex flex-col gap-0.5">
        <BusinessActionLink
          href={BUSINESS.googleMapsUrl}
          action="directions"
          placement="footer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Get Directions
        </BusinessActionLink>
        <BusinessActionLink
          href={BUSINESS.googleMapsUrl}
          action="reviews"
          placement="footer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Read Google Reviews
        </BusinessActionLink>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const facebookUrl = BUSINESS.sameAs.find((entry) => entry.includes("facebook.com"));
  const yelpUrl = BUSINESS.sameAs.find((entry) => entry.includes("yelp.com"));

  const serviceLinks = SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.name }));
  const exploreLinks: FooterLink[] = [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "F.A.Q." },
    { href: "/showroom", label: "Showcase" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/book", label: "Book a Repair" },
    { href: "/site-map", label: "Sitemap" },
  ];
  const areaLinks = SERVICE_AREA_PAGES.map((p) => ({ href: `/services/${p.slug}`, label: p.city }));
  const guideLinks = PRIORITY_REPAIR_PATHS.map((p) => ({ href: p.href, label: p.label }));

  return (
    <footer className="relative overflow-hidden bg-brand-burgundy-deep text-stone-100 selection:bg-brand-gold selection:text-white">
      <div className="grain-layer absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-20">

        {/* Pre-footer CTA strip */}
        <div className="mb-12 flex flex-col gap-5 rounded-2xl border border-brand-gold/25 bg-white/[0.07] px-6 py-7 md:mb-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
              No payment to book
            </p>
            <p className="mt-2 font-serif text-2xl text-white md:text-3xl">
              Ready to restore it?
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-burgundy-deep transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-burgundy-deep md:w-auto"
          >
            Book a Repair
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:gap-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 font-serif text-2xl text-white">
              <span className="[filter:brightness(0)_invert(1)]">
                <BrandMark className="h-12 w-12 flex-none" />
              </span>
              <span>
                Susie&apos;s <span className="text-brand-gold">Jewelry Repair</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-300">
              In-house watch and jewelry repair in Pasadena. Master craftsmanship with clear
              communication and fast turnaround.
            </p>

            {/* Trust chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-brand-gold/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
                4.5 ★ Google
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                90-Day Warranty
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                In-House Only
              </span>
            </div>

            {/* Social links */}
            {(facebookUrl || yelpUrl) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {facebookUrl ? (
                  <TrackedAnchor
                    href={facebookUrl}
                    eventName="footer_social_click"
                    eventParams={{ network: "facebook", placement: "footer" }}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center rounded-full border border-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-300 transition-colors hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Facebook
                  </TrackedAnchor>
                ) : null}
                {yelpUrl ? (
                  <TrackedAnchor
                    href={yelpUrl}
                    eventName="footer_social_click"
                    eventParams={{ network: "yelp", placement: "footer" }}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center rounded-full border border-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-300 transition-colors hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Yelp
                  </TrackedAnchor>
                ) : null}
              </div>
            )}
          </div>

          {/* Mobile accordion nav */}
          <div className="grid gap-3 md:hidden">
            <MobileFooterGroup title="Our Services" links={serviceLinks} />
            <MobileFooterGroup title="Explore" links={exploreLinks} />
            <MobileFooterGroup title="Nearby Areas" links={areaLinks} />
            <MobileFooterGroup title="Repair Guides" links={guideLinks} />
          </div>

          {/* Desktop nav columns */}
          <div className="hidden grid-cols-2 gap-8 md:col-span-1 md:grid lg:grid-cols-5">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Our Services</p>
              <FooterNavLinks links={serviceLinks} />
            </div>
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Explore</p>
              <FooterNavLinks links={exploreLinks} />
            </div>
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Nearby Areas</p>
              <FooterNavLinks links={areaLinks} />
            </div>
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Repair Guides</p>
              <FooterNavLinks links={guideLinks} />
            </div>
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Visit & Verify</p>
              <p className="text-sm italic text-stone-300">
                {BUSINESS.address.city}, {BUSINESS.address.state}.
              </p>
              <AddressBlock />
            </div>
          </div>

          {/* Mobile Visit & Verify */}
          <div className="md:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Visit & Verify</p>
              <p className="mt-3 text-sm italic text-stone-300">
                {BUSINESS.address.city}, {BUSINESS.address.state}.
              </p>
              <AddressBlock />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 md:mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          <div className="flex flex-col items-center justify-between pt-8 text-center text-xs font-sans uppercase tracking-[0.25em] text-stone-400 md:flex-row md:text-left">
            <p>© {COPYRIGHT_YEAR} Susie&apos;s Jewelry Repair. All Rights Reserved.</p>
            <div className="mt-4 flex gap-8 md:mt-0">
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
