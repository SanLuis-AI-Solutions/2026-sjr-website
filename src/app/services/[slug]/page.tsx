import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/site-shell";
import { CtaBand } from "@/components/cta-band";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { getFaqsByService, getServiceBySlug, getServices } from "@/lib/content";
import { serviceFaqSchema, serviceSchema } from "@/lib/schema";
import { formatStartingAt, formatTimeEstimate } from "@/lib/format";

type PageProps = {
  params: {
    slug: string;
  };
};

type FaqItem = {
  question: string;
  answer: string;
};

type ServiceDetail = {
  slug: string;
  name: string;
  summary?: string;
  short_summary?: string;
  image_url?: string | null;
  image?: string | null;
  starting_price?: string | number | null;
  startingPrice?: string | number | null;
  time_estimate?: string | null;
  timeEstimate?: string | null;
  longDescription?: string[];
  long_description?: string[];
  includes?: string[];
  commonRequests?: string[];
  common_requests?: string[];
  faqs?: FaqItem[];
};

function svgDataUri(title: string) {
  const safe = (title || "Service").replace(/&/g, "and").slice(0, 40);
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

function buildFallbackFaqs(serviceName: string): FaqItem[] {
  return [
    {
      question: `How long does ${serviceName.toLowerCase()} usually take?`,
      answer:
        "Most pieces follow Same Day/Next Day service. Final timing depends on parts and repair complexity, and we confirm that before work begins.",
    },
    {
      question: "Is the repair done in-house?",
      answer:
        "Yes. All repair work is completed in our Pasadena shop by our in-house team, so your piece is not shipped out.",
    },
    {
      question: "Can I get a quote before I commit?",
      answer:
        "Yes. Use our Fast Quote form or visit the shop for a free assessment, and we will provide clear starting-at pricing before you approve work.",
    },
    {
      question: "Do I need an appointment?",
      answer:
        "Appointments are optional. Walk-ins are welcome, or you can book a time if you prefer a guaranteed slot.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring the item you want serviced and any relevant parts or notes (for example: extra watch links, missing stones, or a quick description of what changed).",
    },
  ];
}

function buildSupplementalFaqs(slug: string, serviceName: string): FaqItem[] {
  if (slug === "watch-repair") {
    return [
      {
        question: "How much does a watch battery replacement cost?",
        answer:
          "Pricing depends on the watch type, battery, and any sealing work needed. We’ll confirm options and cost during your in-house assessment before you approve service.",
      },
      {
        question: "How long does a watch battery replacement take?",
        answer:
          "Many battery replacements are completed with Same Day/Next Day service. We confirm fit, function, and timing before we begin service.",
      },
      {
        question: "Can you replace a watch crystal?",
        answer:
          "Yes. We can replace cracked or scratched crystals on many watches. We’ll confirm the correct part, pricing, and timing before work begins.",
      },
      {
        question: "Can you repair a broken watch crown or stem?",
        answer:
          "Often, yes. Crown and stem issues can be caused by wear, impact, or water exposure. We’ll assess the safest repair option and confirm pricing first.",
      },
      {
        question: "Can you pressure test or check water resistance after service?",
        answer:
          "When appropriate, we can inspect seals and perform pressure testing to help confirm sealing at the time of service. Water resistance can’t be guaranteed for all watches or future conditions.",
      },
      {
        question: "Do you service automatic and mechanical watches?",
        answer:
          "Yes. We service modern, automatic, and vintage watches. If specialized parts are needed, we confirm availability and timing up front.",
      },
      {
        question: "Do I need an appointment for watch repair?",
        answer:
          "Appointments are optional. Walk-ins are welcome, or you can book a time if you prefer a guaranteed slot.",
      },
    ];
  }

  if (slug === "ring-sizing") {
    return [
      {
        question: "How much does ring sizing cost?",
        answer:
          "Pricing depends on metal type, how many sizes you need to move, and whether additional work is needed. We confirm your exact estimate before service.",
      },
      {
        question: "How long does ring sizing take?",
        answer:
          "Most ring sizing jobs follow our Same Day/Next Day service. If extra metalwork or stone checks are needed, we confirm timing before you approve work.",
      },
      {
        question: "Can you size a ring up or down?",
        answer:
          "Yes. We size rings both up and down when the design allows it, using methods that preserve fit, strength, and finish.",
      },
      {
        question: "Will resizing affect my stones?",
        answer:
          "Stone settings are checked before and after sizing. If prongs or settings need reinforcement, we explain options before proceeding.",
      },
      {
        question: "Do white gold rings need rhodium after sizing?",
        answer:
          "Many white gold rings benefit from rhodium refinishing after sizing for consistent color. We’ll recommend it when appropriate.",
      },
      {
        question: "Can eternity or patterned bands be resized?",
        answer:
          "Some full-eternity, engraved, or alternative-metal bands have resizing limits. We assess safely and suggest the best path before service.",
      },
      {
        question: "Do I need an appointment for ring sizing?",
        answer:
          "Appointments are optional. Walk-ins are welcome, or you can book ahead for a dedicated assessment time.",
      },
    ];
  }

  return [
    {
      question: `What affects the price of ${serviceName.toLowerCase()}?`,
      answer:
        "Complexity, materials, condition, and any required parts affect pricing. We confirm starting-at pricing and options before work begins.",
    },
  ];
}

function canonicalFaqKey(slug: string, question: string): string {
  const q = (question || "").toLowerCase();

  if (slug === "watch-repair") {
    if (q.includes("battery") && (q.includes("cost") || q.includes("price") || q.includes("how much")))
      return "watch:battery:cost";
    if (q.includes("battery") && (q.includes("how long") || q.includes("take")))
      return "watch:battery:time";
    if (q.includes("crystal")) return "watch:crystal";
    if (q.includes("crown") || q.includes("stem")) return "watch:crown-stem";
    if (q.includes("pressure") || q.includes("water") || q.includes("resistan") || q.includes("gasket") || q.includes("seal"))
      return "watch:water-resistance";
    if (q.includes("automatic") || q.includes("mechanical") || q.includes("movement") || q.includes("manual"))
      return "watch:mechanical";
    if (q.includes("appointment") || q.includes("walk in") || q.includes("walk-in") || q.includes("walkins"))
      return "watch:appointment";
  }

  if (slug === "ring-sizing") {
    if (q.includes("cost") || q.includes("price") || q.includes("how much")) return "ring:cost";
    if (q.includes("how long") || q.includes("timing") || q.includes("take")) return "ring:time";
    if ((q.includes("size") || q.includes("sizing")) && (q.includes("up") || q.includes("down")))
      return "ring:up-down";
    if (q.includes("stone") || q.includes("setting") || q.includes("prong")) return "ring:stones";
    if (q.includes("rhodium") || q.includes("white gold")) return "ring:rhodium";
    if (q.includes("eternity") || q.includes("pattern") || q.includes("engraved") || q.includes("alternative metal"))
      return "ring:limits";
    if (q.includes("appointment") || q.includes("walk in") || q.includes("walk-in") || q.includes("walkins"))
      return "ring:appointment";
  }

  return q.replace(/\s+/g, " ").trim();
}

function ensureMinFaqs(baseFaqs: FaqItem[], slug: string, serviceName: string): FaqItem[] {
  const basePool = Array.isArray(baseFaqs) ? baseFaqs : [];
  const target = slug === "watch-repair" || slug === "ring-sizing" ? 7 : 5;
  const pool =
    slug === "watch-repair"
      ? [...buildSupplementalFaqs(slug, serviceName), ...basePool, ...buildFallbackFaqs(serviceName)]
      : [...basePool, ...buildSupplementalFaqs(slug, serviceName), ...buildFallbackFaqs(serviceName)];

  const seen = new Set<string>();
  const out: FaqItem[] = [];

  for (const item of pool) {
    const question = (item?.question || "").trim();
    const answer = (item?.answer || "").trim();
    if (!question || !answer) continue;

    const key = canonicalFaqKey(slug, question);
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ question, answer });
    if (out.length >= target) break;
  }

  return out;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Service | ${BUSINESS.name}`,
      description:
        "Explore our in-house jewelry and watch repair services in Pasadena, TX.",
    };
  }

  const location = `${BUSINESS.address.city}, ${BUSINESS.address.state}`;
  const title = `${service.name} in ${location} | ${BUSINESS.name}`;
  const summary = service.summary || service.short_summary || "";
  const description = `${summary} Local, in-house service with transparent pricing and fast turnaround.`;

  return {
    title,
    description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [serviceData, faqs, services] = await Promise.all([
    getServiceBySlug(slug),
    getFaqsByService(slug),
    getServices(),
  ]);
  const service = serviceData as ServiceDetail | undefined;

  if (!service) {
    notFound();
  }

  const embeddedFaqs = service.faqs;
  const resolvedFaqsRaw = Array.isArray(faqs) && faqs.length > 0
    ? faqs
    : Array.isArray(embeddedFaqs) && embeddedFaqs.length > 0
      ? embeddedFaqs
      : buildFallbackFaqs(service.name);
  const resolvedFaqs = ensureMinFaqs(resolvedFaqsRaw, slug, service.name);
  const relatedServices = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 4);
  const startingAt =
    formatStartingAt(service.starting_price ?? service.startingPrice ?? null) ??
    formatStartingAt(service.startingPrice ?? null);
  const timeEstimate =
    formatTimeEstimate(service.time_estimate ?? service.timeEstimate ?? null) ??
    formatTimeEstimate(service.timeEstimate ?? null);
  const defaultTimeEstimate =
    slug === "custom-design" ? "7 business days" : "Same Day/Next Day service";
  const timeEstimateDisplay = timeEstimate ?? defaultTimeEstimate;

  const isWatchRepair = slug === "watch-repair";
  const isRingSizing = slug === "ring-sizing";
  const isFlagshipService = isWatchRepair || isRingSizing;
  const commonRequests = (
    service.commonRequests ||
    service.common_requests ||
    []
  ).filter(Boolean);
  const heroImageSrc =
    service.image_url || service.image || svgDataUri(service.name);
  const schemaBase = SERVICES.find((item) => item.slug === service.slug) || SERVICES[0];
  const schemaService = {
    ...schemaBase,
    ...service,
    summary: service.summary || service.short_summary || schemaBase.summary,
    time_estimate: service.time_estimate || schemaBase.time_estimate,
    longDescription: service.longDescription || service.long_description || schemaBase.longDescription,
    includes: service.includes || schemaBase.includes,
    commonRequests: commonRequests.length > 0 ? commonRequests : schemaBase.commonRequests,
    image: service.image || service.image_url || schemaBase.image,
    faqs: resolvedFaqs,
  };

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-50 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(122,46,58,0.08),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.20),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Service Detail
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-950">
              {service.name} in {BUSINESS.address.city}, {BUSINESS.address.state}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-stone-700">
              {service.summary || service.short_summary}
            </p>
            {(startingAt || timeEstimateDisplay) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-700">
                {startingAt && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
                    Starts at {startingAt}
                  </span>
                )}
                {timeEstimateDisplay && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2 shadow-sm">
                    Service: {timeEstimateDisplay}
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 rounded-2xl border border-brand-gold/30 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-stone-900">
                Need {service.name} in {BUSINESS.address.city}?
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                {isWatchRepair
                  ? "Yes. We service watches in-house with clear options, transparent estimates, and a confirmed pickup timeline before work begins."
                  : `Yes. We provide in-house ${service.name.toLowerCase()} with transparent pricing, clear timing, and local pickup at our ${BUSINESS.address.city} shop.`}
              </p>
            </div>

            {/* "Last updated" removed (adds clutter and doesn't improve conversion). */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="micro-interaction rounded-full bg-brand-burgundy px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction rounded-full border border-brand-gold px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
            </div>
          </div>
          <div className="relative reveal-on-scroll">
            <div className="relative h-[320px] overflow-hidden rounded-3xl border border-stone-200 shadow-[0_28px_70px_rgba(58,25,16,0.18)] md:h-[380px]">
              <Image
                src={heroImageSrc}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(209,184,130,0.20),_transparent_55%)]" />
            </div>
            <div className="absolute -bottom-8 left-6 right-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.25em] text-brand-burgundy">
                In-house assessment
              </div>
              <p className="mt-2 text-sm text-stone-600">
                Fast, local evaluations with transparent starting-at pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isFlagshipService ? (
        <section className="relative bg-white py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  How it works
                </p>
                <h2 className="mt-3 font-serif text-3xl text-stone-900">
                  What happens next.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                  {isWatchRepair
                    ? "Three simple steps, with a clear approval point before any work begins."
                    : "Three simple steps for precise fit, comfort, and a clean final finish."}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {(isWatchRepair
                    ? [
                        {
                          step: "1",
                          title: "Bring your watch",
                          detail: "Walk in or book. Extra links help with sizing.",
                        },
                        {
                          step: "2",
                          title: "Free assessment",
                          detail: "We confirm the fix, price, and timing before service.",
                        },
                        {
                          step: "3",
                          title: "Approve, then service",
                          detail: "Same Day/Next Day service is common for battery work. Full service varies by parts.",
                        },
                      ]
                    : [
                        {
                          step: "1",
                          title: "Bring your ring",
                          detail: "Walk in or book. Tell us if the fit is tight, loose, or seasonal.",
                        },
                        {
                          step: "2",
                          title: "Sizing assessment",
                          detail: "We measure fit, inspect stones, and confirm pricing before any work.",
                        },
                        {
                          step: "3",
                          title: "Approve, then size",
                          detail: "We complete your sizing with clean finishing and confirm pickup timing.",
                        },
                      ]
                  ).map((item, index) => {
                    const delayClass = `reveal-delay-${(index % 3) + 1}`;
                    return (
                      <article
                        key={item.step}
                        className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-burgundy text-xs font-semibold text-white shadow">
                            {item.step}
                          </span>
                          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                            Step {item.step}
                          </div>
                        </div>
                        <div className="mt-4 font-serif text-xl text-stone-900">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-stone-600">
                          {item.detail}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="reveal-on-scroll relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-sm">
                <div className="relative h-64">
                  <Image
                    src={
                      isWatchRepair
                        ? "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg"
                        : heroImageSrc
                    }
                    alt={
                      isWatchRepair
                        ? "Watch on the jeweler's bench"
                        : "Ring sizing work at the jeweler's bench"
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                </div>
                <div className="px-6 py-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Typical turnaround
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {timeEstimateDisplay}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {isWatchRepair
                      ? "We’ll confirm pricing and pickup timing before service begins."
                      : "We confirm your exact ring size, pricing, and pickup timing before work begins."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/quote"
                      className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Get Fast Quote
                    </Link>
                    <Link
                      href="/book"
                      className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                    >
                      Book Repair
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {(isWatchRepair
                ? [
                    {
                      url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg",
                      alt: "Workbench and tools in the workshop",
                      label: "On the bench",
                    },
                    {
                      url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg",
                      alt: "Detailed sketches and precision work",
                      label: "Precision first",
                    },
                    {
                      url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg",
                      alt: "Watch movement on the jeweler's bench",
                      label: "Careful finishing",
                    },
                  ]
                : [
                    {
                      url: heroImageSrc,
                      alt: service.name,
                      label: "Sizing precision",
                    },
                    {
                      url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg",
                      alt: "Ring repair in progress at the workshop bench",
                      label: "In-house bench work",
                    },
                    {
                      url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg",
                      alt: "Final finishing details for jewelry repairs",
                      label: "Clean finishing",
                    },
                  ]
              ).map((img, index) => {
                const delayClass = `reveal-delay-${(index % 3) + 1}`;
                return (
                  <div
                    key={img.url}
                    className={`reveal-on-scroll ${delayClass} relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm`}
                  >
                    <div className="relative h-44">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                    </div>
                    <div className="px-5 py-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                        {img.label}
                      </div>
                      <p className="mt-2 text-sm text-stone-700">
                        {isWatchRepair
                          ? "In-house work with a clear approval point before service begins."
                          : "In-house sizing and finishing with a clear approval step before work begins."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {isFlagshipService ? (
        <>
          <section className="relative bg-stone-50 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                What to expect
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Service options, explained clearly.
              </h2>

              <div className="mt-6 grid gap-4">
                {(isWatchRepair
                  ? [
                      {
                        title: "Battery replacement",
                        eyebrow: "Quick service",
                        copy:
                          "Often completed while you wait. We confirm fit and function, and can inspect seals when applicable.",
                        bullets: [
                          "Fresh battery + function check",
                          "Basic gasket inspection",
                          "Optional pressure test (when applicable)",
                        ],
                      },
                      {
                        title: "Full service",
                        eyebrow: "Preventive maintenance",
                        copy:
                          "For slow running, moisture, or overdue maintenance. We confirm timing and parts before work begins.",
                        bullets: [
                          "Movement cleaning + lubrication",
                          "Worn parts evaluation (if needed)",
                          "Regulation + final testing",
                        ],
                      },
                      {
                        title: "Repairs & parts",
                        eyebrow: "When something breaks",
                        copy:
                          "Crystal, crown/stem, gaskets, and other components. We’ll recommend the safest option and confirm pricing first.",
                        bullets: [
                          "Crystal replacement",
                          "Stem and crown repair",
                          "Seal and gasket replacement",
                        ],
                      },
                    ]
                  : [
                      {
                        title: "Sizing up",
                        eyebrow: "When your ring is tight",
                        copy:
                          "We add metal as needed and finish the seam cleanly so fit and appearance stay premium.",
                        bullets: [
                          "Fit assessment before sizing",
                          "Metal matched to your ring",
                          "Polish and final comfort check",
                        ],
                      },
                      {
                        title: "Sizing down",
                        eyebrow: "When your ring is loose",
                        copy:
                          "We remove a precise amount, then reshape and finish for secure daily wear.",
                        bullets: [
                          "Measured size reduction",
                          "Roundness and balance check",
                          "Clean finishing at pickup",
                        ],
                      },
                      {
                        title: "Setting safety",
                        eyebrow: "Protecting your stones",
                        copy:
                          "We inspect prongs and stone security before and after sizing, and explain any recommended reinforcement.",
                        bullets: [
                          "Pre-size setting inspection",
                          "Post-size stability check",
                          "Optional refinishing for white gold",
                        ],
                      },
                    ]
                ).map((block, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <article
                      key={block.title}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-white p-6 shadow-sm`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                        {block.eyebrow}
                      </div>
                      <h3 className="mt-3 font-serif text-2xl text-stone-900">
                        {block.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-stone-600">
                        {block.copy}
                      </p>
                      <ul className="mt-5 space-y-2 text-sm text-stone-600">
                        {block.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3">
                            <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {(isWatchRepair
                  ? [
                      {
                        url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg",
                        alt: "Pocket watch on the jeweler's bench",
                      },
                      {
                        url: heroImageSrc,
                        alt: service.name,
                      },
                    ]
                  : [
                      {
                        url: heroImageSrc,
                        alt: service.name,
                      },
                      {
                        url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg",
                        alt: "Jeweler performing ring work at the bench",
                      },
                    ]
                ).map((img) => (
                  <div
                    key={img.url}
                    className="reveal-on-scroll relative h-44 overflow-hidden rounded-3xl border border-stone-200 shadow-sm md:h-52"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/25 via-transparent to-transparent" />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-brand-gold/25 bg-white/80 p-5 text-sm text-stone-700 reveal-on-scroll shadow-sm">
                <span className="font-semibold text-stone-900">
                  {isWatchRepair ? "Water resistance note:" : "Ring sizing note:"}
                </span>{" "}
                {isWatchRepair
                  ? "pressure testing helps confirm sealing at the time of service, but water resistance can’t be guaranteed for all watches or future conditions."
                  : "some styles (eternity bands, certain metals, engraved patterns) can have sizing limits. We confirm the safest path before service."}
              </div>
            </div>
          </section>

          <section className="relative bg-white py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,_rgba(122,46,58,0.06),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Pricing & timing
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Clear estimates. Confirmed pickup.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                We confirm pricing, options, and timing before work begins. No surprises.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Starting at
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {startingAt ?? "Request quote"}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {isWatchRepair
                      ? "Final price depends on parts and condition. We confirm before service."
                      : "Final price depends on metal type, size change, and setting checks. We confirm before service."}
                  </p>
                </div>
                <div className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Typical turnaround
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {timeEstimateDisplay}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {isWatchRepair
                      ? "Same Day/Next Day service is common for battery work. Full service varies by parts availability."
                      : "Most sizing jobs follow Same Day/Next Day service. Complex structural work may require additional time."}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    What to bring
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-stone-600">
                    {(isWatchRepair
                      ? [
                          "The watch (and any extra links if you have them)",
                          "A quick note on the issue: slow/fast, stopping, moisture, crown/stem, crystal",
                          "Any recent service history (optional, but helpful)",
                        ]
                      : [
                          "The ring and your preferred fit (snug, comfort, or stack fit)",
                          "Any sizing history or recent fit changes (optional)",
                          "If white gold: let us know if you want rhodium refinishing",
                        ]
                    ).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    Common requests
                  </div>
                  <ul
                    className="mt-3 space-y-2 text-sm text-stone-600"
                    data-testid="service-common-requests"
                  >
                    {(commonRequests.length > 0
                      ? commonRequests
                      : isWatchRepair
                        ? ["Battery replacement", "Crystal replacement", "Crown/stem repair"]
                        : ["Sizing up", "Sizing down", "Prong/security check"]
                    ).map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="relative bg-stone-50 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgba(209,184,130,0.14),_transparent_55%)]" />
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                    Why customers choose us
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-stone-900">
                    {isWatchRepair
                      ? "In-house service, clear approval, careful finishing."
                      : "Precise fit, clean finish, and transparent approvals."}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                    {isWatchRepair
                      ? "We do the work here in Pasadena. If anything changes during assessment, we pause, explain your options, and only continue with your approval."
                      : "Your ring stays with our in-house team in Pasadena. If we identify setting or structural concerns, we pause and review options before continuing."}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {(isWatchRepair
                  ? [
                      {
                        title: "In-house watch service",
                        detail: "Your watch stays with our team. No shipping, no outsourcing.",
                      },
                      {
                        title: "Transparent approvals",
                        detail: "You see the price and timing before work begins. No surprises.",
                      },
                      {
                        title: "Quality checks",
                        detail: "Function checks and final testing are part of our process before pickup.",
                      },
                    ]
                  : [
                      {
                        title: "In-house ring sizing",
                        detail: "Your ring stays in our workshop. No shipping or outsourced handling.",
                      },
                      {
                        title: "Transparent approvals",
                        detail: "You approve price, timing, and method before we begin service.",
                      },
                      {
                        title: "Finish quality checks",
                        detail: "We check fit, shape, and polish before pickup so the ring wears comfortably.",
                      },
                    ]
                ).map((item, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <div
                      key={item.title}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-white p-6 shadow-sm`}
                    >
                      <div className="font-serif text-xl text-stone-900">{item.title}</div>
                      <p className="mt-2 text-sm leading-7 text-stone-700">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.2fr]">
                <div className="reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-white/85 p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    Trust note
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-700">
                    {isWatchRepair
                      ? "We’ll confirm price and timing before service begins. If parts are needed, we pause and get your approval before ordering or proceeding."
                      : "We confirm final ring size, method, and timing before service. If setting reinforcement is recommended, we review options and wait for approval."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-700">
                    {(isWatchRepair
                      ? ["In-house only", "Clear estimates", "Final checks"]
                      : ["In-house only", "Fit precision", "Setting checks"]
                    ).map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="reveal-on-scroll reveal-delay-2 relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                  <div className="relative h-56 md:h-full">
                    <Image
                      src={heroImageSrc}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f10]/55 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                What to expect
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Service options, explained clearly.
              </h2>
              {(service.longDescription || service.long_description || []).map((paragraph: string) => (
                <p key={paragraph} className="mt-4 text-sm text-stone-600">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-100/60 p-6">
              {(startingAt || timeEstimateDisplay) && (
                <>
                  <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                    Pricing & timing
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-stone-600">
                    {startingAt && (
                      <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                        <span className="font-semibold text-stone-900">Starting at</span>
                        <span>{startingAt}</span>
                      </div>
                    )}
                    {timeEstimateDisplay && (
                      <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-white/80 px-4 py-3">
                        <span className="font-semibold text-stone-900">Typical turnaround</span>
                        <span>{timeEstimateDisplay}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 border-t border-stone-200 pt-4" />
                </>
              )}

              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Includes
              </div>
              <ul
                className="mt-4 space-y-3 text-sm text-stone-600"
                data-testid="service-includes"
              >
                {(service.includes || []).map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  Common requests
                </div>
                <ul
                  className="mt-3 space-y-2 text-sm text-stone-600"
                  data-testid="service-common-requests"
                >
                  {(service.commonRequests || service.common_requests || []).map((item: string) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  Why customers choose us
                </div>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>• In-house repairs with no outsourcing</li>
                  <li>• Same Day/Next Day service on most pieces</li>
                  <li>• Clear approval before work starts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isFlagshipService ? (
        <section className="bg-stone-100 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Service area
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Local care for {BUSINESS.address.city} and nearby communities.
              </h2>
              <p className="mt-4 text-sm text-stone-600">
                Visit us at {BUSINESS.address.street}, {BUSINESS.address.city}, {" "}
                {BUSINESS.address.state} {BUSINESS.address.zip}. We serve {" "}
                {BUSINESS.serviceAreas.join(", ")}. Call {BUSINESS.phone} for
                timing or pricing questions.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Hours
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-600">
                {BUSINESS.hours.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
                  >
                    <span className="font-semibold text-stone-900">{row.day}</span>
                    <span>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            FAQs
          </p>
          <h2 className="mt-3 font-serif text-3xl text-stone-900">
            Answers about {service.name}.
          </h2>
          <div className="mt-8 space-y-4">
            {resolvedFaqs.map((faq: FaqItem) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-stone-200 bg-stone-100/60 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition group-open:rotate-45 group-open:text-brand-burgundy"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Related services
              </p>
              <h2 className="mt-2 font-serif text-2xl text-stone-900">
                Compare nearby repair options
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              View all services →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />

      {/* Mobile conversion bar (75%+ traffic). Keeps primary actions one tap away. */}
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div
          role="region"
          aria-label="Quick actions"
          className="rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="flex-1 rounded-full bg-brand-burgundy px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="flex-1 rounded-full border border-brand-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Repair
            </Link>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema(schemaService)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceFaqSchema(schemaService)),
        }}
      />
    </SiteShell>
  );
}
