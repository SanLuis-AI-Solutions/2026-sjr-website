"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/constants";
import { BrandMark } from "@/components/brand-mark";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { TrackedLink } from "@/components/analytics/tracked-link";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/showroom", label: "Showcase" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const currentPath = pathname || "/";
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileNavOpen = mobileMenuPath === currentPath;

  return (
    <header className="fixed top-0 z-[120] w-full border-b border-stone-200/70 bg-[#faf7f2]/95 py-4 backdrop-blur">
      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close mobile navigation"
          className="fixed inset-0 z-[110] bg-stone-950/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileMenuPath(null)}
        />
      ) : null}
      <div className="relative z-[120] mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" prefetch={false} className="group flex min-h-11 items-center gap-3 py-1.5 sm:py-0">
          <BrandMark className="hidden h-11 w-11 flex-none drop-shadow-[0_6px_18px_rgba(122,46,58,0.16)] sm:block" />
          <span className="flex flex-col">
            <span className="font-serif text-lg leading-none tracking-tight text-neutral-900 sm:text-xl xl:text-2xl">
              Susie’s <span className="text-brand-burgundy">Jewelry Repair</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.34em] text-stone-600 transition-colors group-hover:text-brand-gold sm:text-[10px]">
              <span className="sm:hidden">Est. 1984</span>
              <span className="hidden sm:inline">Master Craftsmanship Est. 1984</span>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 flex items-center py-2 px-1 text-sm uppercase tracking-[0.2em] text-stone-900 transition-colors hover:text-brand-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <BusinessActionLink
            href={`tel:${BUSINESS.phone}`}
            action="phone_call"
            placement="header"
            className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold/55 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy shadow-sm transition hover:border-brand-gold hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:px-4"
            aria-label={`Call ${BUSINESS.phone}`}
          >
            <span className="lg:hidden">Call</span>
            <span className="hidden lg:inline">Call {BUSINESS.phone}</span>
          </BusinessActionLink>

          <TrackedLink
            href="/book"
            eventName="header_cta_click"
            eventParams={{ target: "book", placement: "header" }}
            className="micro-interaction hidden min-h-11 items-center justify-center rounded-full border border-brand-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-burgundy transition hover:bg-brand-gold/10 lg:inline-flex"
          >
            Book Repair
          </TrackedLink>

          <TrackedLink
            href="/quote"
            eventName="header_cta_click"
            eventParams={{ target: "quote", placement: "header" }}
            className="micro-interaction group relative hidden overflow-hidden rounded-full bg-brand-burgundy px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_14px_30px_rgba(58,18,28,0.16)] sm:inline-flex sm:min-h-11 sm:items-center sm:justify-center"
          >
            <span className="relative z-10 font-sans">Get Fast Quote</span>
            <span className="absolute inset-0 z-0 translate-y-full bg-brand-burgundy-deep transition-transform duration-300 group-hover:translate-y-0" />
          </TrackedLink>

          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 lg:hidden"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuPath(isMobileNavOpen ? null : currentPath)}
          >
            Menu
          </button>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-label="Mobile navigation"
          className="absolute inset-x-4 top-[calc(100%+0.75rem)] z-[130] rounded-3xl border border-stone-200 bg-[#faf7f2] p-5 shadow-2xl lg:hidden"
        >
          <div className="mb-4 rounded-2xl border border-brand-gold/30 bg-white/90 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-burgundy">
              Quick help
            </p>
            <div className="mt-3 grid gap-2">
              <TrackedLink
                href="/quote"
                eventName="header_cta_click"
                eventParams={{ target: "quote", placement: "mobile_menu_quick_help" }}
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
                onClick={() => setMobileMenuPath(null)}
              >
                Get Fast Quote
              </TrackedLink>
              <BusinessActionLink
                href={`tel:${BUSINESS.phone}`}
                action="phone_call"
                placement="mobile_menu"
                className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold/50 hover:text-brand-burgundy"
                onClick={() => setMobileMenuPath(null)}
              >
                Call {BUSINESS.phone}
              </BusinessActionLink>
            </div>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold/50 hover:text-brand-burgundy"
                onClick={() => setMobileMenuPath(null)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/book"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.24em] text-brand-burgundy underline-offset-4 hover:underline"
            onClick={() => setMobileMenuPath(null)}
          >
            Prefer an appointment? Book repair
          </Link>
        </div>
      ) : null}
    </header>
  );
}
