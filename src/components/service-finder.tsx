"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ServiceFinderItem = {
  name: string;
  slug: string;
  summary?: string | null;
  keywords?: string[] | null;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ServiceFinder({ services }: { services: ServiceFinderItem[] }) {
  const [query, setQuery] = useState("");

  const index = useMemo(() => {
    return services.map((s) => {
      const keywords = (s.keywords || []).join(" ");
      const text = normalize([s.name, s.slug, s.summary || "", keywords].join(" "));
      return { ...s, _text: text };
    });
  }, [services]);

  const q = normalize(query);
  const matches = useMemo(() => {
    if (!q) return [];
    return index
      .filter((s) => s._text.includes(q))
      .slice(0, 9)
      .map(({ _text: _ignored, ...rest }) => rest);
  }, [index, q]);

  const suggestions = useMemo(() => {
    // Curated order for mobile scanning.
    const preferred = [
      "watch-repair",
      "ring-sizing",
      "stone-setting",
      "jewelry-cleaning",
      "necklace-repair",
      "bracelet-repair",
      "pearl-restringing",
      "custom-design",
      "heirloom-restoration",
    ];
    const map = new Map(index.map((s) => [s.slug, s]));
    const curated = preferred
      .map((slug) => map.get(slug))
      .filter(Boolean)
      .slice(0, 9) as Array<(typeof index)[number]>;
    return curated.map(({ _text: _ignored, ...rest }) => rest);
  }, [index]);

  return (
    <div
      data-testid="service-finder"
      className="mt-10 rounded-3xl border border-stone-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm reveal-on-scroll"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
            Find your service
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Search by item or repair need (watch, ring sizing, pearl, cleaning).
          </p>
        </div>
        <Link
          href="/quote"
          className="text-xs font-bold uppercase tracking-[0.35em] text-brand-burgundy hover:text-brand-burgundy-deep"
        >
          Not sure? Get a quote →
        </Link>
      </div>

      <div className="mt-5">
        <label className="sr-only" htmlFor="service-finder">
          Search services
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            fill="none"
          >
            <path
              d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="service-finder"
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-2xl border border-stone-200 bg-white px-10 py-3 text-sm text-stone-900 shadow-sm outline-none placeholder:text-stone-400 focus:border-brand-gold/60 focus:ring-4 focus:ring-brand-gold/15"
          />
        </div>
      </div>

      <div className="mt-5" data-testid="service-finder-results">
        {q ? (
          matches.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {matches.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="micro-interaction rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm hover:border-brand-gold/50"
                >
                  <div className="font-serif text-lg text-stone-900">{s.name}</div>
                  {s.summary ? (
                    <div className="mt-1 text-sm text-stone-600">{s.summary}</div>
                  ) : null}
                  <div className="mt-3 text-xs font-bold uppercase tracking-[0.35em] text-brand-gold">
                    View details →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 px-5 py-4 text-sm text-stone-600">
              No matches. Try: “watch”, “ring”, “pearl”, “cleaning”.
            </div>
          )
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="micro-interaction rounded-full border border-stone-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-700 hover:border-brand-gold/50 hover:text-brand-burgundy"
              >
                {s.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
