"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/showroom", label: "Showroom" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent background scroll when the mobile menu is open.
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "glass-card py-3 shadow-md" : "bg-transparent py-5"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex flex-col"
          >
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

          <div className="flex items-center gap-4">
            <Link
              href="/quote"
              className="micro-interaction group relative hidden overflow-hidden rounded-full bg-brand-burgundy px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white md:block"
            >
              <span className="relative z-10 font-sans">Get Fast Quote</span>
              <div className="absolute inset-0 z-0 bg-brand-burgundy-deep transition-transform duration-300 translate-y-full group-hover:translate-y-0" />
            </Link>

            <button
              type="button"
              className="text-stone-900 md:hidden"
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-over menu */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-[visibility,opacity] duration-300 ${menuOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"
          }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/30"
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
        />

        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto border-l border-stone-200 bg-[#faf7f2] shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
              Menu
            </div>
            <button
              type="button"
              className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-800"
              onClick={() => setMenuOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="px-6 pb-8">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-brand-gold/50 hover:text-brand-burgundy"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-brand-gold/25 bg-white/70 p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Quick actions
              </div>
              <div className="mt-4 grid gap-3">
                <Link
                  href="/quote"
                  className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Fast Quote
                </Link>
                <Link
                  href="/book"
                  className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy"
                  onClick={() => setMenuOpen(false)}
                >
                  Book a Repair
                </Link>
              </div>
              <p className="mt-4 text-xs text-stone-600">
                Most services are <span className="font-semibold text-stone-900">Same Day/Next Day service</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
