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
        "Most pieces are assessed the same day. Final timing depends on parts and repair complexity, and we confirm that before work begins.",
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
        question: "Can you pressure test for water resistance?",
        answer:
          "We can perform pressure testing when appropriate to help confirm sealing at the time of service. Water resistance cannot be guaranteed for all watches or future conditions.",
      },
      {
        question: "How long does a watch battery replacement take?",
        answer:
          "Many battery replacements are completed the same day. We’ll confirm fit, function, and timing before we begin.",
      },
      {
        question: "Do you service automatic and vintage watches?",
        answer:
          "Yes. We service modern, automatic, and vintage watches. If a watch requires specialized parts, we confirm availability and timing up front.",
      },
      {
        question: "What if you find additional issues during service?",
        answer:
          "We pause and contact you with options and pricing. No additional work is performed without your approval.",
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

function ensureMinFaqs(baseFaqs: FaqItem[], slug: string, serviceName: string): FaqItem[] {
  const seen = new Set<string>();
  const out: FaqItem[] = [];

  const basePool = Array.isArray(baseFaqs) ? baseFaqs : [];
  for (const item of basePool) {
    const q = (item?.question || "").trim();
    const a = (item?.answer || "").trim();
    if (!q || !a) continue;

    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ question: q, answer: a });
  }

  if (out.length >= 5) return out;

  const fillPool = [
    ...buildSupplementalFaqs(slug, serviceName),
    ...buildFallbackFaqs(serviceName),
  ];
  for (const item of fillPool) {
    const q = (item?.question || "").trim();
    const a = (item?.answer || "").trim();
    if (!q || !a) continue;

    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ question: q, answer: a });
    if (out.length >= 5) break;
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
  const [service, faqs, services] = await Promise.all([
    getServiceBySlug(slug),
    getFaqsByService(slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const embeddedFaqs = (service as any).faqs as FaqItem[] | undefined;
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
    formatStartingAt((service as any).starting_price ?? (service as any).startingPrice ?? null) ??
    formatStartingAt((service as any).startingPrice ?? null);
  const timeEstimate =
    formatTimeEstimate((service as any).time_estimate ?? (service as any).timeEstimate ?? null) ??
    formatTimeEstimate((service as any).timeEstimate ?? null);
  const defaultTimeEstimate = slug === "custom-design" ? "7 business days" : "Same Day or Next Day";
  const timeEstimateDisplay = timeEstimate ?? defaultTimeEstimate;

  const isWatchRepair = slug === "watch-repair";
  const heroImageSrc =
    (service as any).image_url || (service as any).image || svgDataUri(service.name);

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.18),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Service Detail
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              {service.name} in {BUSINESS.address.city}, {BUSINESS.address.state}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-stone-600">
              {service.summary || service.short_summary}
            </p>
            {(startingAt || timeEstimateDisplay) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-stone-600">
                {startingAt && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                    Starts at {startingAt}
                  </span>
                )}
                {timeEstimateDisplay && (
                  <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                    Turnaround: {timeEstimateDisplay}
                  </span>
                )}
              </div>
            )}
            <div className="mt-6 rounded-xl border border-brand-gold/30 bg-white/80 p-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Need {service.name} in {BUSINESS.address.city}?
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                {isWatchRepair
                  ? "Yes. We service watches in-house with clear options, transparent estimates, and a confirmed pickup timeline before work begins."
                  : `Yes. We provide in-house ${service.name.toLowerCase()} with transparent pricing, clear timing, and local pickup at our ${BUSINESS.address.city} shop.`}
              </p>
            </div>

            {/* "Last updated" removed (adds clutter and doesn't improve conversion). */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="micro-interaction rounded-full bg-brand-burgundy px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-brand-burgundy-deep"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction rounded-full border border-brand-gold px-7 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10"
              >
                Book a Repair
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

      {isWatchRepair ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  How it works
                </p>
                <h2 className="mt-3 font-serif text-3xl text-stone-900">
                  What happens next.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
                  Three simple steps, with a clear approval point before any work begins.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {[
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
                      detail: "Battery is often same day. Full service varies by parts.",
                    },
                  ].map((item, index) => {
                    const delayClass = `reveal-delay-${(index % 3) + 1}`;
                    return (
                      <article
                        key={item.step}
                        className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-stone-100/60 p-6 shadow-sm`}
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
                    src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg"
                    alt="Watch on the jeweler's bench"
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
                    We’ll confirm pricing and pickup timing before service begins.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/quote"
                      className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep"
                    >
                      Get Fast Quote
                    </Link>
                    <Link
                      href="/book"
                      className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isWatchRepair ? (
        <>
          <section className="bg-white py-16">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                What to expect
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Service options, explained clearly.
              </h2>

              <div className="mt-6 grid gap-4">
                {[
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
                ].map((block, index) => {
                  const delayClass = `reveal-delay-${(index % 3) + 1}`;
                  return (
                    <article
                      key={block.title}
                      className={`reveal-on-scroll ${delayClass} rounded-3xl border border-stone-200 bg-stone-100/60 p-6 shadow-sm`}
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
                {[
                  {
                    url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg",
                    alt: "Pocket watch on the jeweler's bench",
                  },
                  {
                    url: heroImageSrc,
                    alt: service.name,
                  },
                ].map((img) => (
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

              <div className="mt-6 rounded-3xl border border-brand-gold/25 bg-white/70 p-5 text-sm text-stone-600 reveal-on-scroll">
                <span className="font-semibold text-stone-900">Water resistance note:</span>{" "}
                pressure testing helps confirm sealing at the time of service, but water resistance can’t be guaranteed for all watches or future conditions.
              </div>
            </div>
          </section>

          <section className="bg-stone-100 py-16">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Pricing & timing
              </p>
              <h2 className="mt-3 font-serif text-3xl text-stone-900">
                Clear estimates. Confirmed pickup.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
                We confirm pricing, options, and timing before work begins. No surprises.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Starting at
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {startingAt ?? "Request quote"}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Final price depends on parts and condition. We confirm before service.
                  </p>
                </div>
                <div className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
                    Typical turnaround
                  </div>
                  <div className="mt-2 font-serif text-2xl text-stone-900">
                    {timeEstimateDisplay}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Battery service is often same day. Full service varies by parts availability.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="reveal-on-scroll rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    What to bring
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-stone-600">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                      The watch (and any extra links if you have them)
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                      A quick note on the issue: slow/fast, stopping, moisture, crown/stem, crystal
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
                      Any recent service history (optional, but helpful)
                    </li>
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
                    {(service.commonRequests || service.common_requests || []).map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="reveal-on-scroll reveal-delay-3 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                    Why customers choose us
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-stone-600">
                    <li>• In-house repairs with no outsourcing</li>
                    <li>• Same-day assessments on most pieces</li>
                    <li>• Clear approval before work starts</li>
                  </ul>
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
                  <li>• Same-day assessments on most pieces</li>
                  <li>• Clear approval before work starts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

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
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900">
                  <span>{faq.question}</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition group-open:rotate-45 group-open:text-brand-burgundy">
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
              className="text-sm font-semibold text-brand-burgundy hover:text-brand-burgundy-deep"
            >
              View all services →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-900 transition hover:border-brand-gold hover:text-brand-burgundy"
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
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="flex-1 rounded-full bg-brand-burgundy px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white"
            >
              Get Quote
            </Link>
            <Link
              href="/book"
              className="flex-1 rounded-full border border-brand-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema(service)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceFaqSchema({ ...service, faqs: resolvedFaqs })),
        }}
      />
    </SiteShell>
  );
}
