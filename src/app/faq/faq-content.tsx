"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FAQS, FAQ_CATEGORY_LABELS, type FaqCategory } from "@/lib/faq";

type FilterValue = "all" | FaqCategory;

export function FaqContent() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      const matchesQuery =
        value.length === 0 ||
        item.q.toLowerCase().includes(value) ||
        item.a.toLowerCase().includes(value);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const quickAnswers = useMemo(() => FAQS.filter((item) => item.pinned).slice(0, 3), []);

  return (
    <>
      <section className="reveal-on-scroll mt-8 rounded-3xl border border-stone-200 bg-white/86 p-5 shadow-sm md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-burgundy">
          Find your answer
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`min-h-11 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
              activeFilter === "all"
                ? "border-brand-burgundy bg-brand-burgundy text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-brand-gold"
            }`}
          >
            All
          </button>
          {FAQ_CATEGORY_LABELS.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveFilter(category.id)}
              className={`min-h-11 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
                activeFilter === category.id
                  ? "border-brand-burgundy bg-brand-burgundy text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-brand-gold"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
          Search questions
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: timing, pricing, ring sizing"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          />
        </label>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-3" aria-label="Quick answers">
        {quickAnswers.map((item, index) => (
          <article
            key={item.id}
            className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} rounded-2xl border border-stone-200 bg-white p-5 shadow-sm`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
              Quick answer
            </p>
            <h2 className="mt-3 font-serif text-[1.28rem] leading-7 text-stone-900">{item.q}</h2>
            <p className="mt-3 text-[15px] leading-7 text-stone-600">{item.a}</p>
          </article>
        ))}
      </section>

      <div className="mt-10 space-y-4" aria-label="Frequently asked questions">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-700">
            No results found. Try a broader term or choose another category.
          </div>
        ) : null}

        {filtered.map((faq, index) => (
          <details
            key={faq.id}
            className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-6`}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 pr-1 font-serif text-[1.18rem] leading-7 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
              <span>{faq.q}</span>
              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 text-brand-burgundy transition-transform group-open:rotate-45">
                <span className="text-base leading-none">+</span>
              </span>
            </summary>
            <p className="mt-4 text-[15px] leading-7 text-stone-600">{faq.a}</p>
            {faq.links && faq.links.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {faq.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="micro-interaction inline-flex min-h-11 items-center rounded-full border border-brand-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </details>
        ))}
      </div>
    </>
  );
}
