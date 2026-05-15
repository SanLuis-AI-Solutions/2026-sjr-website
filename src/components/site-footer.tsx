import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { PRIORITY_REPAIR_PATHS } from "@/lib/priority-repair-paths";
import { BrandMark } from "@/components/brand-mark";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { TrackedAnchor } from "@/components/analytics/tracked-anchor";

const COPYRIGHT_YEAR = 2026;

type FooterLink = {
  href: string;
  label: string;
};

function FooterNavLinks({ links }: { links: FooterLink[] }) {
  return (
    <nav className="flex flex-col gap-3 text-sm font-sans uppercase tracking-widest md:gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-12 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileFooterGroup({
  title,
  links,
  defaultOpen = false,
}: {
  title: string;
  links: FooterLink[];
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none font-serif text-lg text-white marker:hidden">
        <span className="flex min-h-8 items-center justify-between gap-4">
          {title}
          <span aria-hidden className="font-sans text-xs text-brand-gold group-open:hidden">
            +
          </span>
          <span aria-hidden className="hidden font-sans text-xs text-brand-gold group-open:inline">
            -
          </span>
        </span>
      </summary>
      <div className="mt-4 border-t border-white/10 pt-4">
        <FooterNavLinks links={links} />
      </div>
    </details>
  );
}

export function SiteFooter() {
  const facebookUrl = BUSINESS.sameAs.find((entry) => entry.includes("facebook.com"));
  const yelpUrl = BUSINESS.sameAs.find((entry) => entry.includes("yelp.com"));
  const serviceLinks = SERVICES.map((service) => ({
    href: `/services/${service.slug}`,
    label: service.name,
  }));
  const exploreLinks = [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "F.A.Q." },
    { href: "/showroom", label: "Showcase" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/quote", label: "Get Quote" },
    { href: "/site-map", label: "Sitemap" },
  ];
  const areaLinks = SERVICE_AREA_PAGES.map((page) => ({
    href: `/services/${page.slug}`,
    label: page.city,
  }));
  const guideLinks = PRIORITY_REPAIR_PATHS.map((path) => ({
    href: path.href,
    label: path.label,
  }));

  return (
    <footer className="bg-brand-burgundy-deep text-stone-100 selection:bg-brand-gold selection:text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:gap-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 font-serif text-2xl text-white">
              <BrandMark className="h-12 w-12 flex-none" />
              <span>
                Susie’s <span className="text-brand-gold">Jewelry Repair</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              In-house watch and jewelry repair in Pasadena. Master craftsmanship with clear communication and fast turnaround.
            </p>
          </div>

          <div className="grid gap-3 md:hidden">
            <MobileFooterGroup title="Our Services" links={serviceLinks} />
            <MobileFooterGroup title="Explore" links={exploreLinks} />
            <MobileFooterGroup title="Nearby Areas" links={areaLinks} />
            <MobileFooterGroup title="Repair Guides" links={guideLinks} />
          </div>

          <div className="hidden grid-cols-2 gap-8 md:col-span-1 md:grid lg:grid-cols-5">
            <div>
              <p className="mb-6 font-serif text-lg text-white">Our Services</p>
              <FooterNavLinks links={serviceLinks} />
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Explore</p>
              <FooterNavLinks links={exploreLinks} />
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Nearby Areas</p>
              <FooterNavLinks links={areaLinks} />
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Repair Guides</p>
              <FooterNavLinks links={guideLinks} />
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Visit & Verify</p>
              <p className="text-sm italic text-stone-200">
                {BUSINESS.address.city}, {BUSINESS.address.state}.
              </p>
              <address className="mt-4 flex flex-col gap-2 text-sm not-italic font-sans letter-spacing-wide">
                <span>{BUSINESS.address.street}</span>
                <span>
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </span>
                <BusinessActionLink
                  href={`tel:${BUSINESS.phone}`}
                  action="phone_call"
                  placement="footer"
                  className="mt-4 font-semibold text-brand-gold transition-colors hover:text-white"
                >
                  {BUSINESS.phone}
                </BusinessActionLink>
                <BusinessActionLink
                  href={BUSINESS.googleMapsUrl}
                  action="directions"
                  placement="footer"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Get Directions
                </BusinessActionLink>
                <BusinessActionLink
                  href={BUSINESS.googleMapsUrl}
                  action="reviews"
                  placement="footer"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Read Google Reviews
                </BusinessActionLink>
              </address>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.24em] text-stone-200">
                {facebookUrl ? (
                  <TrackedAnchor
                    href={facebookUrl}
                    eventName="footer_social_click"
                    eventParams={{ network: "facebook", placement: "footer" }}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
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
                    className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Yelp
                  </TrackedAnchor>
                ) : null}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-serif text-lg text-white">Visit & Verify</p>
              <p className="mt-4 text-sm italic text-stone-200">
                {BUSINESS.address.city}, {BUSINESS.address.state}.
              </p>
              <address className="mt-4 flex flex-col gap-2 text-sm not-italic font-sans letter-spacing-wide">
                <span>{BUSINESS.address.street}</span>
                <span>
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </span>
                <BusinessActionLink
                  href={`tel:${BUSINESS.phone}`}
                  action="phone_call"
                  placement="footer"
                  className="mt-4 font-semibold text-brand-gold transition-colors hover:text-white"
                >
                  {BUSINESS.phone}
                </BusinessActionLink>
                <BusinessActionLink
                  href={BUSINESS.googleMapsUrl}
                  action="directions"
                  placement="footer"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Get Directions
                </BusinessActionLink>
                <BusinessActionLink
                  href={BUSINESS.googleMapsUrl}
                  action="reviews"
                  placement="footer"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Read Google Reviews
                </BusinessActionLink>
              </address>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.24em] text-stone-200">
                {facebookUrl ? (
                  <TrackedAnchor
                    href={facebookUrl}
                    eventName="footer_social_click"
                    eventParams={{ network: "facebook", placement: "footer" }}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
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
                    className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Yelp
                  </TrackedAnchor>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-center text-xs font-sans uppercase tracking-[0.3em] md:mt-20 md:flex-row md:pt-10 md:text-left">
          <p>© {COPYRIGHT_YEAR} Susie’s Jewelry Repair. All Rights Reserved.</p>
          <div className="mt-4 flex gap-8 md:mt-0">
            <Link href="/privacy" className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center rounded-lg px-2 py-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
