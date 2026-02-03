"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
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

  return (
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

          <button className="text-stone-900 md:hidden" aria-label="Toggle Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
