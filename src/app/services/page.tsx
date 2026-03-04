import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { getServicesWithImages } from "@/lib/content-images";
import Image from "next/image";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";
import { TrackedLink } from "@/components/analytics/tracked-link";

type ServiceListItem = {
  slug: string;
  name: string;
  summary?: string;
  short_summary?: string;
  image_url?: string | null;
  image?: string | null;
  starting_price?: unknown;
  startingPrice?: unknown;
  time_estimate?: unknown;
  timeEstimate?: unknown;
  commonRequests?: string[];
};

export const metadata: Metadata = {
  title: "Jewelry & Watch Repair Services | Susie’s Jewelry Repair",
  description:
    "Browse in-house jewelry and watch repair services with transparent pricing, Same Day/Next Day service on most work, and a fast path to quote or booking.",
  alternates: {
    canonical: "/services",
  },
};

export default async function ServicesPage() {
  const services = (await getServicesWithImages()) as ServiceListItem[];
  const servicesBySlug = new Map<string, ServiceListItem>();
  for (const s of services) servicesBySlug.set(s.slug, s);

  const groups = [
    {
      id: "watches",
      label: "Watch Services",
      description: "Battery, water resistance checks, crystal and stem repair, and full service.",
      slugs: ["watch-repair"],
    },
    {
      id: "rings",
      label: "Rings",
      description: "Sizing, stone security, and setting integrity for daily wear and heirlooms.",
      slugs: ["ring-sizing", "stone-setting"],
    },
    {
      id: "chains",
      label: "Chains & Bracelets",
      description: "Clasp upgrades, broken links, and delicate chain repair with clean finishing.",
      slugs: ["necklace-repair", "bracelet-repair"],
    },
    {
      id: "care",
      label: "Care & Restoration",
      description: "Refresh, polish, and restore pieces you want to wear for decades.",
      slugs: ["jewelry-cleaning", "pearl-restringing", "heirloom-restoration"],
    },
    {
      id: "custom",
      label: "Custom & Remounting",
      description: "Handmade work, stone remounts, and custom builds with a guided process.",
      slugs: ["custom-design"],
    },
  ] as const;

  function svgDataUri(title: string) {
    const safe = (title || "Service").replace(/&/g, "and").slice(0, 36);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">` +
      `<defs>` +
      `<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">` +
      `<stop offset="0" stop-color="#faf7f2"/>` +
      `<stop offset="1" stop-color="#e9d6c7"/>` +
      `</linearGradient>` +
      `</defs>` +
      `<rect width="1200" height="900" fill="url(#g)"/>` +
      `<circle cx="980" cy="170" r="260" fill="#d1b882" opacity="0.25"/>` +
      `<circle cx="260" cy="720" r="320" fill="#7a2e3a" opacity="0.10"/>` +
      `<text x="72" y="780" font-size="54" font-family="Georgia, serif" fill="#2b2621" opacity="0.85">` +
      `${safe}` +
      `</text>` +
      `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const featured = servicesBySlug.get("watch-repair") || services[0];
  const featuredImage =
    (featured?.image_url as string) ||
    (featured?.image as string) ||
    svgDataUri(featured?.name || "Watch Repair");
  return (
    <SiteShell>
      <div id="top" className="sr-only" />
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
              Services Directory
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-stone-900 md:text-6xl">
              A curated menu of in-house repairs.
            </h1>
            <p className="mt-6 max-w-xl text-base text-stone-600 md:text-lg">
              Compare services quickly, review starting context, and move straight to quote or booking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-600">
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                In-house work
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Same Day/Next Day service
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Clear approval
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <TrackedLink
                href="/quote"
                eventName="services_hub_cta_click"
                eventParams={{ placement: "hero", cta_target: "quote" }}
                className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </TrackedLink>
              <TrackedLink
                href="/book"
                eventName="services_hub_cta_click"
                eventParams={{ placement: "hero", cta_target: "book" }}
                className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </TrackedLink>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-stone-200 shadow-[0_28px_70px_rgba(58,25,16,0.18)] md:h-[520px]">
              <Image
                src={featuredImage}
                alt={featured?.name || "Featured service"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-brand-gold/30 bg-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-sm">
                  Typical turnaround
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  {formatTimeEstimate(featured?.time_estimate ?? featured?.timeEstimate ?? null) ?? "Same Day/Next Day service"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured section (standalone, clean, Apple-like). */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal-on-scroll relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-[0_22px_60px_rgba(58,25,16,0.14)]">
            <div className="absolute inset-0">
              <Image
                src={featuredImage}
                alt={featured?.name || "Featured service"}
                fill
                sizes="100vw"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,247,242,0.96),rgba(250,247,242,0.62),rgba(250,247,242,0.20))]" />
            </div>

            <div className="relative grid gap-8 px-7 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-10">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Featured service
                </div>
                <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-stone-900 md:text-5xl">
                  {featured?.name || "Watch Repair"}
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                  {featured?.summary || "Precision servicing for modern and vintage watches."}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <TrackedLink
                    href="/services/watch-repair"
                    eventName="service_card_click"
                    eventParams={{ placement: "services_hub_featured", service_slug: "watch-repair" }}
                    className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  >
                    View details
                  </TrackedLink>
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white/70 p-6 backdrop-blur-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-700">
                  Typical turnaround
                </div>
                <div className="mt-2 font-serif text-2xl text-stone-900">
                  {formatTimeEstimate(featured?.time_estimate ?? featured?.timeEstimate ?? null) ??
                    "Same Day/Next Day service"}
                </div>
                <div className="mt-6 h-px bg-stone-200" />
                <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-stone-700">
                  Best for
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Battery replacement, crystal issues, moisture checks, and full service when needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-stone-50 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,_rgba(122,46,58,0.08),_transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
              {/* Desktop: keep a persistent sticky directory for quick navigation. */}
              <div className="hidden rounded-3xl border border-stone-200 bg-stone-100/60 p-6 lg:block">
                <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  Directory
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  Jump to a category or browse down the page.
                </p>
                <div className="mt-6 space-y-2">
                  {groups.map((g) => (
                    <a
                      key={g.id}
                      href={`#group-${g.id}`}
                      className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold/50 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      {g.label}
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

            <div className="space-y-16">
              {groups.map((group, groupIndex) => {
                const items = group.slugs
                  .map((slug) => servicesBySlug.get(slug))
                  .filter((item): item is ServiceListItem => Boolean(item));

                return (
                  <section
                    key={group.id}
                    id={`group-${group.id}`}
                    aria-labelledby={`group-heading-${group.id}`}
                    className={`scroll-mt-[120px] reveal-on-scroll reveal-delay-${(groupIndex % 3) + 1}`}
                  >
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <h2 id={`group-heading-${group.id}`} className="text-3xl text-stone-900">
                          {group.label}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-stone-700">
                          {group.description}
                        </p>
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
                      {items.map((service) => {
                        const startingAt = formatStartingAt(
                          service.starting_price ?? service.startingPrice ?? null
                        );
                        const serviceSpeed = formatTimeEstimate(
                          service.time_estimate ?? service.timeEstimate ?? null
                        );
                        const imageSrc =
                          service.image_url || service.image || svgDataUri(service.name);
                        const popular =
                          (service.commonRequests?.[0] as string) || "Assessment";
                        const isSingle = items.length === 1;

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
                                src={imageSrc}
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

                              <p className="mt-4 text-sm leading-7 text-stone-700">
                                {service.summary || service.short_summary}
                              </p>

                              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]">
                                <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                                  Starting at{" "}
                                  <span className="font-semibold text-brand-burgundy">
                                    {startingAt ?? "Request quote"}
                                  </span>
                                </span>
                                <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                                  Service{" "}
                                  <span className="font-semibold text-stone-900">
                                    {serviceSpeed ?? "Same Day/Next Day service"}
                                  </span>
                                </span>
                                <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-700">
                                  Popular{" "}
                                  <span className="font-semibold text-stone-900">
                                    {popular}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </TrackedLink>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile conversion bar (75%+ traffic). Keeps primary actions one tap away. */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div
          role="region"
          aria-label="Quick actions"
          className="rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <TrackedLink
              href="/quote"
              eventName="services_hub_cta_click"
              eventParams={{ placement: "mobile_quick_actions", cta_target: "quote" }}
              className="flex-1 rounded-full bg-brand-burgundy px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </TrackedLink>
            <TrackedLink
              href="/book"
              eventName="services_hub_cta_click"
              eventParams={{ placement: "mobile_quick_actions", cta_target: "book" }}
              className="flex-1 rounded-full border border-brand-gold px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Repair
            </TrackedLink>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />
    </SiteShell>
  );
}
