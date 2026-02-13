import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="bg-brand-burgundy-deep text-stone-100/80 selection:bg-brand-gold selection:text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl text-white">
              Susie’s <span className="text-brand-gold">Repair</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              In-house watch and jewelry repair in Pasadena. Master craftsmanship with clear communication and fast turnaround.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 lg:grid-cols-3">
            <div>
              <h4 className="mb-6 font-serif text-lg text-white">Our Services</h4>
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
              <h4 className="mb-6 font-serif text-lg text-white">Company</h4>
              <nav className="flex flex-col gap-4 text-sm font-sans uppercase tracking-widest">
                <Link href="/about" className="transition-colors hover:text-brand-gold">About Us</Link>
                <Link href="/faq" className="transition-colors hover:text-brand-gold">F.A.Q.</Link>
                <Link href="/contact" className="transition-colors hover:text-brand-gold">Connect</Link>
                <Link href="/blog" className="transition-colors hover:text-brand-gold">Journal</Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-6 font-serif text-lg text-white">Location</h4>
              <p className="text-sm italic text-stone-400">
                {BUSINESS.address.city}, {BUSINESS.address.state}.
              </p>
              <address className="mt-4 flex flex-col gap-2 text-sm not-italic font-sans letter-spacing-wide">
                <span>{BUSINESS.address.street}</span>
                <span>
                  {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </span>
                <span className="mt-4 text-brand-gold">{BUSINESS.phone}</span>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-t border-white/10 pt-10 text-[10px] font-sans uppercase tracking-[0.3em] md:flex-row">
          <p>© {new Date().getFullYear()} Susie’s Jewelry Repair. All Rights Reserved.</p>
          <div className="mt-4 flex gap-8 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
