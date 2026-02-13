import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getServicesWithImages } from "@/lib/content-images";
import Image from "next/image";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";

export default async function ServicesPage() {
  const services = await getServicesWithImages();
  const servicesBySlug = new Map<string, any>();
  for (const s of services as any[]) servicesBySlug.set(s.slug, s);

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
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
              Services Directory
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-stone-900 md:text-6xl">
              A curated menu of in-house repairs.
            </h1>
            <p className="mt-6 max-w-xl text-base text-stone-600 md:text-lg">
              Designed like a luxury workshop: clear options, consistent quality, and a fast path to a quote or booking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-600">
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                In-house work
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Same-week timing
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Clear approval
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10"
              >
                Book a Repair
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Featured
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl text-stone-900">
                    {featured?.name || "Watch Repair"}
                  </div>
                  <div className="mt-1 text-sm text-stone-600">
                    {featured?.summary || "Precision servicing for modern and vintage watches."}
                  </div>
                </div>
                <Link
                  href="/services/watch-repair"
                  className="text-xs font-bold uppercase tracking-[0.35em] text-brand-gold hover:text-brand-burgundy"
                >
                  View details →
                </Link>
              </div>
            </div>
          </div>

          <div className="relative reveal-on-scroll">
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
                  {formatTimeEstimate(featured?.time_estimate ?? featured?.timeEstimate ?? null) ?? "Same Day or Next Day"}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {groups.slice(0, 3).map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="micro-interaction rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left shadow-sm hover:border-brand-gold/40"
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    {g.label}
                  </div>
                  <div className="mt-2 text-xs text-stone-600">Explore →</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-stone-200 bg-stone-100/60 p-6">
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
                      className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-brand-gold/50 hover:text-brand-burgundy"
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
                    Upload a photo and we will confirm pricing and timing.
                  </p>
                  <Link
                    href="/quote"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep"
                  >
                    Get Fast Quote
                  </Link>
                </div>
              </div>
            </aside>

            <div className="space-y-12">
              {groups.map((group, groupIndex) => {
                const items = group.slugs
                  .map((slug) => servicesBySlug.get(slug))
                  .filter(Boolean);

                return (
                  <section
                    key={group.id}
                    id={`group-${group.id}`}
                    className={`reveal-on-scroll reveal-delay-${(groupIndex % 3) + 1}`}
                  >
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
                          {group.label}
                        </p>
                        <h2 className="mt-3 font-serif text-3xl text-stone-900">
                          {group.description}
                        </h2>
                      </div>
                      <a
                        href="#top"
                        className="text-xs font-bold uppercase tracking-[0.35em] text-stone-500 hover:text-brand-burgundy"
                      >
                        Back to top ↑
                      </a>
                    </div>

                    <div className="mt-6 space-y-6">
                      {items.map((service: any, index: number) => {
                        const startingAt = formatStartingAt(
                          service.starting_price ?? service.startingPrice ?? null
                        );
                        const turnaround = formatTimeEstimate(
                          service.time_estimate ?? service.timeEstimate ?? null
                        );
                        const imageSrc =
                          service.image_url || service.image || svgDataUri(service.name);

                        return (
                          <article
                            key={service.slug}
                            id={`service-${service.slug}`}
                            className={`scroll-mt-[120px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid md:grid-cols-[240px_1fr]`}
                          >
                            <div className="relative h-48 md:h-full">
                              <Image
                                src={imageSrc}
                                alt={service.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 240px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/35 via-transparent to-transparent" />
                            </div>
                            <div className="p-6 md:p-8">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-serif text-2xl text-stone-900">
                                    {service.name}
                                  </h3>
                                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                                    {service.summary || service.short_summary}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Link
                                    href={`/services/${service.slug}`}
                                    className="text-xs font-bold uppercase tracking-[0.35em] text-brand-gold hover:text-brand-burgundy"
                                  >
                                    View details →
                                  </Link>
                                </div>
                              </div>

                              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-stone-200 bg-stone-100/60 px-4 py-3">
                                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                                    Starting at
                                  </div>
                                  <div className="mt-1 text-sm font-semibold text-brand-burgundy">
                                    {startingAt ?? "Request quote"}
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-stone-200 bg-stone-100/60 px-4 py-3">
                                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                                    Turnaround
                                  </div>
                                  <div className="mt-1 text-sm font-semibold text-stone-900">
                                    {turnaround ?? "Same Day or Next Day"}
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-stone-200 bg-stone-100/60 px-4 py-3">
                                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                                    Popular
                                  </div>
                                  <div className="mt-1 text-sm font-semibold text-stone-900">
                                    {(service.commonRequests?.[0] as string) || "Assessment"}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                  href="/quote"
                                  className="rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep"
                                >
                                  Get Fast Quote
                                </Link>
                                <Link
                                  href="/book"
                                  className="rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10"
                                >
                                  Book a Repair
                                </Link>
                              </div>
                            </div>
                          </article>
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
    </SiteShell>
  );
}
