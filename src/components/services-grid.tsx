import Image from "next/image";
import { formatTimeEstimate } from "@/lib/format";
import { TrackedLink } from "@/components/analytics/tracked-link";

type ServiceItem = {
  slug?: string;
  name?: string;
  summary?: string;
  short_summary?: string;
  text?: string;
  image?: string | null;
  image_url?: string | null;
  starting_price?: number | string | null;
  startingPrice?: number | string | null;
  time_estimate?: string | null;
  timeEstimate?: string | null;
};

type ServicesGridProps = {
  services: ServiceItem[];
  kicker?: string;
  title?: string;
  id?: string;
  hideHeader?: boolean;
};

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
    `<circle cx="260" cy="720" r="320" fill="#6f1f2a" opacity="0.12"/>` +
    `<text x="72" y="780" font-size="54" font-family="Georgia, serif" fill="#2b2621" opacity="0.85">` +
    `${safe}` +
    `</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function ServicesGrid({
  services,
  kicker = "Our Expertise",
  title = "Expert Repair Services",
  id = "services",
  hideHeader = false,
}: ServicesGridProps) {
  if (!services || !Array.isArray(services) || services.length === 0) return null;
  const [titleLead, ...titleRest] = title.split(" ");
  const titleAccent = titleRest.join(" ");

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f6e4d7_0%,#efd1be_100%)] py-14 md:py-24"
      id={id}
    >
      <div className="pointer-events-none absolute -left-32 top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(209,184,130,0.25),_transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <header className="mb-10 text-center reveal-on-scroll md:mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-burgundy">
              {kicker}
            </p>
            <h2 aria-label={title} className="mt-4 font-serif text-3xl text-neutral-900 md:text-5xl">
              {titleLead}
              {titleAccent ? (
                <>
                  {" "}
                  <span className="text-brand-burgundy italic">{titleAccent}</span>
                </>
              ) : null}
            </h2>
            <div className="mx-auto mt-6 h-1 w-12 bg-brand-gold/30" />
          </header>
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {services.map((service, index) => {
            if (!service) return null;
            const slug = service.slug || "unavailable";
            const name = service.name || "Untitled Service";
            const summary = service.summary || service.short_summary || service.text || "";
            const image = service.image || service.image_url || svgDataUri(name);
            const timeEstimateRaw = service.time_estimate ?? service.timeEstimate ?? null;
            const timeEstimate = formatTimeEstimate(timeEstimateRaw);
            const delayClass = `reveal-delay-${(index % 3) + 1}`;
            const mobileVisibilityClass = index > 3 ? "hidden sm:block" : "";
            const cardClass = `reveal-on-scroll ${delayClass} ${mobileVisibilityClass} group relative block overflow-hidden rounded-3xl border border-brand-burgundy/15 bg-white shadow-[0_18px_42px_rgba(58,25,16,0.14)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(58,25,16,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:shadow-[0_24px_60px_rgba(58,25,16,0.18)]`;
            const cardBody = (
              <>
                <div className="relative hidden aspect-[4/3] w-full overflow-hidden sm:block">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
                </div>

                <div className="p-5 md:p-8">
                  <h3 className="font-serif text-xl text-neutral-900 md:text-2xl">
                    {name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    {summary}
                  </p>

                  {timeEstimate ? (
                    <div className="mt-4 flex flex-wrap gap-4 border-t border-stone-200 pt-4 md:mt-6 md:pt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-stone-600">Turnaround</span>
                        <span className="font-sans text-sm font-semibold text-neutral-900">
                          {timeEstimate}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-5 flex items-center text-xs font-bold uppercase tracking-widest text-brand-burgundy transition-colors group-hover:text-brand-burgundy-deep md:mt-8">
                    Explore Details
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 h-3 w-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </>
            );

            return (
              service.slug ? (
                <TrackedLink
                  key={slug}
                  href={`/services/${slug}`}
                  eventName="service_card_click"
                  eventParams={{
                    service_slug: slug,
                    service_name: name,
                    placement: id,
                  }}
                  className={cardClass}
                  id={`service-${slug}`}
                >
                  {cardBody}
                </TrackedLink>
              ) : (
                <article
                  key={slug}
                  className={cardClass}
                  id={`service-${slug}`}
                >
                  {cardBody}
                </article>
              )
            );
          })}
        </div>

        {services.length > 4 ? (
          <div className="mt-5 rounded-3xl border border-brand-burgundy/15 bg-white/82 p-4 shadow-[0_14px_34px_rgba(58,25,16,0.12)] sm:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-burgundy">
              More repair services
            </p>
            <div className="mt-3 grid gap-2">
              {services.slice(4).map((service) => {
                const slug = service.slug || "unavailable";
                const name = service.name || "Untitled Service";
                if (!service.slug) return null;

                return (
                  <TrackedLink
                    key={slug}
                    href={`/services/${slug}`}
                    eventName="service_card_click"
                    eventParams={{
                      service_slug: slug,
                      service_name: name,
                      placement: `${id}_mobile_compact`,
                    }}
                    className="inline-flex min-h-12 items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    aria-label={`Explore details for ${name}`}
                  >
                    <span>{name}</span>
                    <span aria-hidden className="text-brand-burgundy">
                      →
                    </span>
                  </TrackedLink>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
