"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { trackGaEvent } from "@/components/analytics/ga-tracker";
import type {
  ServicesHubFinderChip,
  ServicesHubFinderEntry,
} from "@/lib/service-taxonomy";
import { buildServicesFinderLeadContextHref } from "@/lib/service-lead-context";

export type ServicesHubCardView = {
  slug: string;
  name: string;
  summary: string;
  imageSrc: string;
  startingAt: string | null;
  serviceSpeed: string | null;
  popular: string;
};

export type ServicesHubGroupView = {
  id: string;
  label: string;
  description: string;
  items: ServicesHubCardView[];
};

type ServicesHubBrowserProps = {
  groups: ServicesHubGroupView[];
  finderChips: ServicesHubFinderChip[];
  finderEntries: ServicesHubFinderEntry[];
};

function normalizeFinderText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function ServicesHubBrowser({
  groups,
  finderChips,
  finderEntries,
}: ServicesHubBrowserProps) {
  const pathname = usePathname();
  const [activeChipId, setActiveChipId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const lastTrackedQueryRef = useRef("");
  const lastZeroStateRef = useRef("");
  const activeChip = finderChips.find((chip) => chip.id === activeChipId) ?? null;
  const normalizedQuery = normalizeFinderText(deferredQuery);
  const matchingSlugs =
    activeChip?.serviceSlugs ??
    (normalizedQuery
      ? finderEntries
          .filter((entry) => entry.searchText.includes(normalizedQuery))
          .map((entry) => entry.slug)
      : null);
  const matchingSlugSet = matchingSlugs ? new Set(matchingSlugs) : null;
  const filteredGroups = matchingSlugSet
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => matchingSlugSet.has(item.slug)),
        }))
        .filter((group) => group.items.length > 0)
    : groups;
  const visibleServiceCount = filteredGroups.reduce((count, group) => count + group.items.length, 0);
  const hasActiveFinder = Boolean(activeChip || normalizedQuery);
  const pagePath = pathname || "/services";
  const primaryMatchSlug =
    activeChip?.serviceSlugs[0] ?? filteredGroups[0]?.items[0]?.slug ?? null;
  const trimmedQuery = query.trim() || null;
  const quoteHref =
    hasActiveFinder && visibleServiceCount > 0
      ? buildServicesFinderLeadContextHref("/quote", {
          serviceSlug: primaryMatchSlug,
          intentLabel: activeChip?.label ?? null,
          query: trimmedQuery,
        })
      : null;
  const bookingHref =
    hasActiveFinder && visibleServiceCount > 0
      ? buildServicesFinderLeadContextHref("/book", {
          serviceSlug: primaryMatchSlug,
          intentLabel: activeChip?.label ?? null,
          query: trimmedQuery,
        })
      : null;
  const zeroStateQuoteHref = buildServicesFinderLeadContextHref("/quote", {
    query: trimmedQuery,
  });

  useEffect(() => {
    if (!normalizedQuery || normalizedQuery.length < 2) return;
    if (lastTrackedQueryRef.current === normalizedQuery) return;
    lastTrackedQueryRef.current = normalizedQuery;
    trackGaEvent("services_finder_query", {
      page_path: pagePath,
      query: normalizedQuery,
      match_count: visibleServiceCount,
    });
  }, [normalizedQuery, pagePath, visibleServiceCount]);

  useEffect(() => {
    const zeroStateKey =
      hasActiveFinder && visibleServiceCount === 0
        ? `${activeChip?.id || "query"}:${normalizedQuery || activeChip?.label || ""}`
        : "";
    if (!zeroStateKey || lastZeroStateRef.current === zeroStateKey) return;
    lastZeroStateRef.current = zeroStateKey;
    trackGaEvent("services_finder_zero_results", {
      page_path: pagePath,
      chip_id: activeChip?.id || "",
      chip_label: activeChip?.label || "",
      query: normalizedQuery,
    });
  }, [activeChip, hasActiveFinder, normalizedQuery, pagePath, visibleServiceCount]);

  function clearFinder() {
    setActiveChipId(null);
    setQuery("");
    lastTrackedQueryRef.current = "";
    trackGaEvent("services_finder_clear", {
      page_path: pagePath,
      chip_id: activeChip?.id || "",
      chip_label: activeChip?.label || "",
      query: normalizedQuery,
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="hidden rounded-3xl border border-stone-200 bg-stone-100/60 p-6 lg:block">
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
            Directory
          </div>
          <p className="mt-3 text-sm text-stone-600">
            Jump to a category or browse down the page.
          </p>
          <div className="mt-6 space-y-2">
            {filteredGroups.map((group) => (
              <a
                key={group.id}
                href={`#group-${group.id}`}
                className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold/50 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {group.label}
              </a>
            ))}
          </div>
          <div className="mt-6 border-t border-stone-200 pt-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
              Not sure?
            </div>
            <p className="mt-2 text-sm text-stone-600">
              Send one photo and we will recommend the right next step.
            </p>
            <TrackedLink
              href="/quote"
              eventName="services_hub_cta_click"
              eventParams={{ placement: "directory_aside", cta_target: "quote" }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </TrackedLink>
          </div>
        </div>
      </aside>

      <div className="space-y-10" data-testid="services-finder-region">
        <section
          aria-labelledby="services-finder-heading"
          className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Service finder
              </p>
              <h2 id="services-finder-heading" className="mt-3 font-serif text-3xl text-stone-900">
                What do you need fixed?
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
                Start with the problem, not the service name. Choose a common repair need or type a
                short description to narrow the list instantly.
              </p>
            </div>
            {hasActiveFinder ? (
              <button
                type="button"
                onClick={clearFinder}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-700 hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Clear finder
              </button>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {finderChips.map((chip) => {
              const isActive = chip.id === activeChipId;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    const nextActive = isActive ? null : chip.id;
                    setActiveChipId(nextActive);
                    setQuery("");
                    trackGaEvent("services_finder_chip_click", {
                      page_path: pagePath,
                      chip_id: chip.id,
                      chip_label: chip.label,
                      selected: nextActive === chip.id,
                      match_count: chip.serviceSlugs.length,
                    });
                  }}
                  className={`inline-flex min-h-12 items-center justify-center rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-brand-burgundy bg-brand-burgundy text-white"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:border-brand-gold hover:text-brand-burgundy"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <label htmlFor="services-finder-query" className="sr-only">
              Describe the repair you need
            </label>
            <input
              id="services-finder-query"
              value={query}
              onChange={(event) => {
                setActiveChipId(null);
                setQuery(event.target.value);
              }}
              placeholder="Try 'broken chain' or 'watch battery'"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-900 placeholder:text-stone-500 focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            />
          </div>

          {hasActiveFinder ? (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-700">
              {visibleServiceCount > 0 ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <p>
                    Showing{" "}
                    <span className="font-semibold text-stone-900">{visibleServiceCount}</span>{" "}
                    matching {visibleServiceCount === 1 ? "service" : "services"}
                    {activeChip ? (
                      <>
                        {" "}for <span className="font-semibold text-brand-burgundy">{activeChip.label}</span>
                      </>
                    ) : normalizedQuery ? (
                      <>
                        {" "}for <span className="font-semibold text-brand-burgundy">&quot;{query.trim()}&quot;</span>
                      </>
                    ) : null}
                    .
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {quoteHref ? (
                      <TrackedLink
                        href={quoteHref}
                        eventName="services_finder_cta_click"
                        eventParams={{
                          page_path: pagePath,
                          cta_target: "quote",
                          service_slug: primaryMatchSlug || "",
                          chip_id: activeChip?.id || "",
                          chip_label: activeChip?.label || "",
                          finder_intent: activeChip?.label || "",
                          finder_query: trimmedQuery || "",
                          match_count: visibleServiceCount,
                        }}
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                      >
                        Use this for a quote
                      </TrackedLink>
                    ) : null}
                    {bookingHref ? (
                      <TrackedLink
                        href={bookingHref}
                        eventName="services_finder_cta_click"
                        eventParams={{
                          page_path: pagePath,
                          cta_target: "book",
                          service_slug: primaryMatchSlug || "",
                          chip_id: activeChip?.id || "",
                          chip_label: activeChip?.label || "",
                          finder_intent: activeChip?.label || "",
                          finder_query: trimmedQuery || "",
                          match_count: visibleServiceCount,
                        }}
                        className="hidden min-h-12 items-center justify-center rounded-full border border-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:inline-flex"
                      >
                        Use this for booking
                      </TrackedLink>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">No direct service match yet.</p>
                    <p className="mt-1 text-sm text-stone-700">
                      Clear the finder to browse everything, or send a photo and we will point you
                      to the right repair path.
                    </p>
                  </div>
                  <TrackedLink
                    href={zeroStateQuoteHref}
                    eventName="services_finder_cta_click"
                    eventParams={{
                      cta_target: "quote",
                      service_slug: "",
                      chip_id: activeChip?.id || "",
                      chip_label: activeChip?.label || "",
                      finder_intent: activeChip?.label || "",
                      finder_query: trimmedQuery || "",
                      match_count: visibleServiceCount,
                    }}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    Get Fast Quote
                  </TrackedLink>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <div className="space-y-16" data-testid="services-finder-results">
          {filteredGroups.map((group) => (
            <section
              key={group.id}
              id={`group-${group.id}`}
              aria-labelledby={`group-heading-${group.id}`}
              className="scroll-mt-[120px]"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id={`group-heading-${group.id}`} className="text-3xl text-stone-900">
                    {group.label}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{group.description}</p>
                </div>
                <a
                  href="#top"
                  className="text-xs font-bold uppercase tracking-[0.35em] text-stone-500 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Back to top ↑
                </a>
              </div>

              <div className="mt-7 h-px bg-[linear-gradient(90deg,rgba(122,46,58,0.25),rgba(209,184,130,0.35),rgba(0,0,0,0))]" />

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {group.items.map((service) => {
                  const isSingle = group.items.length === 1;
                  return (
                    <TrackedLink
                      key={service.slug}
                      id={`service-${service.slug}`}
                      className={`group scroll-mt-[120px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_18px_55px_rgba(58,25,16,0.12)] transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_28px_70px_rgba(58,25,16,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 ${isSingle ? "md:col-span-2" : ""}`}
                      href={`/services/${service.slug}`}
                      eventName="service_card_click"
                      eventParams={{
                        placement: `services_hub_${group.id}`,
                        service_slug: service.slug,
                        service_name: service.name,
                      }}
                      aria-label={`View details: ${service.name}`}
                    >
                      <div className="relative h-48">
                        <Image
                          src={service.imageSrc}
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 520px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/65 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(209,184,130,0.20),_transparent_55%)]" />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full border border-brand-gold/35 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-sm">
                            In-house
                          </span>
                          <span className="inline-flex items-center rounded-full border border-brand-gold/35 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-sm">
                            Same Day/Next Day service
                          </span>
                        </div>
                      </div>

                      <div className="p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                              Service
                            </div>
                            <h3 className="mt-3 font-serif text-2xl leading-[1.1] text-stone-900">
                              {service.name}
                            </h3>
                          </div>
                          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-burgundy transition group-hover:border-brand-gold/60 group-hover:bg-brand-gold/10">
                            View details
                            <span aria-hidden="true">→</span>
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-stone-700">{service.summary}</p>

                        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]">
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                            Starting at{" "}
                            <span className="font-semibold text-brand-burgundy">
                              {service.startingAt ?? "Request quote"}
                            </span>
                          </span>
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                            Service{" "}
                            <span className="font-semibold text-stone-900">
                              {service.serviceSpeed ?? "Same Day/Next Day service"}
                            </span>
                          </span>
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                            Popular{" "}
                            <span className="font-semibold text-stone-900">{service.popular}</span>
                          </span>
                        </div>
                      </div>
                    </TrackedLink>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
