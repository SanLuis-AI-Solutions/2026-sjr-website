import Link from "next/link";

export function SiteHeader() {
  const navItems = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/showroom", label: "Showroom" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-stone-200/70 bg-[#faf7f2]/95 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl leading-none tracking-tight text-neutral-900 md:text-2xl">
            Susie’s <span className="text-brand-burgundy">Jewelry Repair</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-stone-600 transition-colors group-hover:text-brand-gold">
            Master Craftsmanship Est. 1984
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-3">
          <Link
            href="/quote"
            className="micro-interaction group relative hidden overflow-hidden rounded-full bg-brand-burgundy px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white md:block"
          >
            <span className="relative z-10 font-sans">Get Fast Quote</span>
            <span className="absolute inset-0 z-0 translate-y-full bg-brand-burgundy-deep transition-transform duration-300 group-hover:translate-y-0" />
          </Link>

          <details className="relative md:hidden">
            <summary
              className="cursor-pointer list-none rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-900"
              aria-label="Toggle Menu"
            >
              Menu
            </summary>
            <div
              id="mobile-nav"
              role="dialog"
              aria-label="Mobile navigation"
              className="absolute right-0 mt-3 w-[19rem] rounded-3xl border border-stone-200 bg-[#faf7f2] p-5 shadow-2xl"
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
                  href="/quote"
                  className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Get Fast Quote
                </Link>
                <Link
                  href="/book"
                  className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy"
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
