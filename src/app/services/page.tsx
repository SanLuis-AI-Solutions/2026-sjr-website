import { SiteShell } from "@/components/site-shell";
import { getServicesWithImages } from "@/lib/content-images";
import Image from "next/image";
import Link from "next/link";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { createPageMetadata } from "@/lib/metadata";
import {
  getServiceHubHelpfulGuides,
  getServicesHubFeaturedServiceSlug,
  getServicesHubHelpfulGuideServiceSlugs,
} from "@/lib/blog";
import {
  buildServicesHubFinderEntries,
  getServicesHubFinderChips,
  getServicesHubGroups,
} from "@/lib/service-taxonomy";
import {
  ServicesHubBrowser,
  type ServicesHubGroupView,
} from "@/components/services-hub-browser";
import { PRIORITY_REPAIR_PATHS } from "@/lib/priority-repair-paths";

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

export const metadata = createPageMetadata({
  title: "Jewelry & Watch Repair Services | Susie’s Jewelry Repair",
  description:
    "Browse in-house jewelry and watch repair services with transparent pricing, Same Day/Next Day service on most work, and a fast path to quote or booking.",
  canonical: "/services",
});

export default async function ServicesPage() {
  const services = (await getServicesWithImages()) as ServiceListItem[];
  const servicesBySlug = new Map<string, ServiceListItem>();
  for (const s of services) servicesBySlug.set(s.slug, s);
  const helpfulGuideServiceSlugs = getServicesHubHelpfulGuideServiceSlugs(3);
  const helpfulGuides = getServiceHubHelpfulGuides(
    helpfulGuideServiceSlugs,
    helpfulGuideServiceSlugs.length,
  );
  const featuredServiceSlug = getServicesHubFeaturedServiceSlug();
  const groups = getServicesHubGroups();
  const finderChips = getServicesHubFinderChips();
  const finderEntries = buildServicesHubFinderEntries(services);

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

  const featured = servicesBySlug.get(featuredServiceSlug) || services[0];
  const featuredImage =
    (featured?.image_url as string) ||
    (featured?.image as string) ||
    svgDataUri(featured?.name || "Featured Service");
  const featuredBestFor =
    featured?.commonRequests?.slice(0, 4).join(", ") ||
    "Battery replacement, crystal issues, moisture checks, and full service when needed.";
  const groupedServices: ServicesHubGroupView[] = groups.map((group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    items: group.slugs
      .map((slug) => servicesBySlug.get(slug))
      .filter((item): item is ServiceListItem => Boolean(item))
      .map((service) => ({
        slug: service.slug,
        name: service.name,
        summary: service.summary || service.short_summary || "",
        imageSrc: service.image_url || service.image || svgDataUri(service.name),
        startingAt: formatStartingAt(service.starting_price ?? service.startingPrice ?? null),
        serviceSpeed: formatTimeEstimate(
          service.time_estimate ?? service.timeEstimate ?? null,
        ),
        popular: (service.commonRequests?.[0] as string) || "Assessment",
      })),
  }));
  return (
    <SiteShell>
      <div id="top" className="sr-only" />
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)] md:block" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
              Services Directory
            </p>
            <h1 className="lcp-heading mt-4 font-serif text-5xl leading-[1.05] text-stone-900 md:text-6xl">
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

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink
                href="/quote"
                eventName="services_hub_cta_click"
                eventParams={{ placement: "hero", cta_target: "quote" }}
                className="micro-interaction inline-flex w-full items-center justify-center rounded-full bg-brand-burgundy px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto"
              >
                Get Fast Quote
              </TrackedLink>
              <TrackedLink
                href="/book"
                eventName="services_hub_cta_click"
                eventParams={{ placement: "hero", cta_target: "book" }}
                className="micro-interaction inline-flex w-full items-center justify-center rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto"
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
                sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc((100vw - 6rem) / 2), 528px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-brand-gold/30 bg-white/15 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white md:backdrop-blur-sm">
                  Typical turnaround
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  {formatTimeEstimate(featured?.time_estimate ?? featured?.timeEstimate ?? null) ?? "Same Day/Next Day service"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
              Nearby service areas
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              Repair guidance for nearby cities, not just Pasadena.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
              If you are coming from a nearby area, start with a city-specific page to see how
              local customers typically use our Pasadena workshop, which repairs are most common,
              and the fastest quote-first path before you drive over.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_AREA_PAGES.map((area) => (
                <TrackedLink
                  key={area.slug}
                  href={`/services/${area.slug}`}
                  eventName="service_area_card_click"
                  eventParams={{ area_slug: area.slug, placement: "services_hub_area_section" }}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_18px_44px_rgba(58,25,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
                    {area.city}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl text-stone-900">
                    Jewelry repair near {area.city}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{area.cardDescription}</p>
                </TrackedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured section (standalone, clean, Apple-like). */}
      <section className="cv-section bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-[0_22px_60px_rgba(58,25,16,0.14)]">
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
                <h2 className="lcp-heading mt-4 text-4xl leading-[1.05] text-stone-900 md:text-5xl">
                  {featured?.name || "Watch Repair"}
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                  {featured?.summary || "Precision servicing for modern and vintage watches."}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <TrackedLink
                    href={`/services/${featured?.slug || featuredServiceSlug}`}
                    eventName="service_card_click"
                    eventParams={{
                      placement: "services_hub_featured",
                      service_slug: featured?.slug || featuredServiceSlug,
                    }}
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
                  {featuredBestFor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cv-section relative bg-stone-50 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,_rgba(122,46,58,0.08),_transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <ServicesHubBrowser
            groups={groupedServices}
            finderChips={finderChips}
            finderEntries={finderEntries}
          />
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Helpful guides
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Research the repair before you bring it in.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
                These are the clearest next reads for the services customers ask about most.
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              View all articles →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {helpfulGuides.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_18px_44px_rgba(58,25,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
                  Blog guide
                </p>
                <h3 className="mt-3 font-serif text-2xl text-stone-900">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          <div
            role="region"
            aria-label="Repair planning paths"
            className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                Repair planning
              </p>
              <h3 className="mt-3 font-serif text-3xl text-stone-900">
                Not sure which repair path fits yet?
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                These routes answer the questions customers usually ask before they request a
                quote: whether the issue is routine, how urgent it is, and what service to start
                with first.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PRIORITY_REPAIR_PATHS.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-gold/45 hover:shadow-[0_18px_44px_rgba(58,25,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  <h4 className="font-serif text-2xl text-stone-900">{path.label}</h4>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{path.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
