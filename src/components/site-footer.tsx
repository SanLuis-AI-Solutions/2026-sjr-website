import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { PRIORITY_REPAIR_PATHS } from "@/lib/priority-repair-paths";
import { BrandMark } from "@/components/brand-mark";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { TrackedAnchor } from "@/components/analytics/tracked-anchor";

const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  const facebookUrl = BUSINESS.sameAs.find((entry) => entry.includes("facebook.com"));
  const yelpUrl = BUSINESS.sameAs.find((entry) => entry.includes("yelp.com"));

  return (
    <footer className="bg-brand-burgundy-deep text-stone-100 selection:bg-brand-gold selection:text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
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

          <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:grid-cols-5">
            <div>
              <p className="mb-6 font-serif text-lg text-white">Our Services</p>
              <nav className="flex flex-col gap-4 text-sm font-sans uppercase tracking-widest">
                {SERVICES.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-brand-gold"
                  >
                    {service.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Explore</p>
              <nav className="flex flex-col gap-4 text-sm font-sans uppercase tracking-widest">
                <Link href="/about" className="transition-colors hover:text-brand-gold">About Us</Link>
                <Link href="/faq" className="transition-colors hover:text-brand-gold">F.A.Q.</Link>
                <Link href="/showroom" className="transition-colors hover:text-brand-gold">Showcase</Link>
                <Link href="/blog" className="transition-colors hover:text-brand-gold">Blog</Link>
                <Link href="/contact" className="transition-colors hover:text-brand-gold">Contact</Link>
                <Link href="/quote" className="transition-colors hover:text-brand-gold">Get Quote</Link>
                <Link href="/site-map" className="transition-colors hover:text-brand-gold">Sitemap</Link>
              </nav>
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Nearby Areas</p>
              <nav className="flex flex-col gap-4 text-sm font-sans uppercase tracking-widest">
                {SERVICE_AREA_PAGES.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/services/${page.slug}`}
                    className="transition-colors hover:text-brand-gold"
                  >
                    {page.city}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-6 font-serif text-lg text-white">Repair Guides</p>
              <nav className="flex flex-col gap-4 text-sm font-sans uppercase tracking-widest">
                {PRIORITY_REPAIR_PATHS.slice(1, 5).map((path) => (
                  <Link
                    key={path.href}
                    href={path.href}
                    className="transition-colors hover:text-brand-gold"
                  >
                    {path.label}
                  </Link>
                ))}
              </nav>
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
                  className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold"
                >
                  Get Directions
                </BusinessActionLink>
                <BusinessActionLink
                  href={BUSINESS.googleMapsUrl}
                  action="reviews"
                  placement="footer"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-200 transition-colors hover:text-brand-gold"
                >
                  Read Google Reviews
                </BusinessActionLink>
              </address>
              <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-200">
                {facebookUrl ? (
                  <TrackedAnchor
                    href={facebookUrl}
                    eventName="footer_social_click"
                    eventParams={{ network: "facebook", placement: "footer" }}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-brand-gold"
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
                    className="transition-colors hover:text-brand-gold"
                  >
                    Yelp
                  </TrackedAnchor>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-t border-white/10 pt-10 text-xs font-sans uppercase tracking-[0.3em] md:flex-row">
          <p>© {COPYRIGHT_YEAR} Susie’s Jewelry Repair. All Rights Reserved.</p>
          <div className="mt-4 flex gap-8 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
