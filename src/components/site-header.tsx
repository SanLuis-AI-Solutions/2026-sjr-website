import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/showroom", label: "Showcase" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-[120] w-full border-b border-stone-200/70 bg-[#faf7f2]/95 py-4 backdrop-blur">
      <div className="relative z-[120] mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" prefetch={false} className="group flex items-center gap-3">
          <BrandMark
            priority
            className="h-12 w-12 flex-none object-contain drop-shadow-[0_6px_18px_rgba(122,46,58,0.16)] sm:h-14 sm:w-14"
          />
          <span className="flex flex-col">
            <span className="font-serif text-lg leading-none tracking-tight text-neutral-900 sm:text-xl xl:text-2xl">
              Susie’s <span className="text-brand-burgundy">Jewelry Repair</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.34em] text-stone-600 transition-colors group-hover:text-brand-gold sm:text-[10px]">
              Master Craftsmanship Est. 1984
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-stone-900 transition-colors hover:text-brand-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/book"
            data-track-event="header_cta_click"
            data-track-placement="header"
            data-track-target="book"
            className="micro-interaction group relative hidden overflow-hidden rounded-full bg-brand-burgundy px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_14px_30px_rgba(58,18,28,0.16)] sm:inline-flex sm:min-h-11 sm:items-center sm:justify-center"
          >
            <span className="relative z-10 font-sans">Book Repair</span>
            <span className="absolute inset-0 z-0 translate-y-full bg-brand-burgundy-deep transition-transform duration-300 group-hover:translate-y-0" />
          </Link>

          <details className="relative lg:hidden">
            <summary className="inline-flex min-h-11 list-none items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900 marker:hidden">
              Menu
            </summary>
            <div
              id="mobile-nav"
              role="dialog"
              aria-label="Mobile navigation"
              className="absolute right-0 top-[calc(100%+0.75rem)] z-[130] w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-stone-200 bg-[#faf7f2] p-5 shadow-2xl"
            >
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold/50 hover:text-brand-burgundy"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 grid gap-3">
                <Link
                  href="/book"
                  data-track-event="header_cta_click"
                  data-track-placement="mobile_menu"
                  data-track-target="book"
                  className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Book a Repair
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
