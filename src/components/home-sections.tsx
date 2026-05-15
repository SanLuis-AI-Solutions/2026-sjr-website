import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/constants";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { TrackedAnchor } from "@/components/analytics/tracked-anchor";

export function ProofBand() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#faf7f2_0%,#f4ecdf_100%)]">
      <div className="mx-auto grid max-w-6xl gap-3 px-6 py-7 md:grid-cols-4">
        {[
          {
            title: "Since 1984",
            description: "Local, family-owned craftsmanship.",
          },
          {
            title: "4.5 ★ on Google",
            description: "51 verified reviews you can verify in one tap.",
            href: BUSINESS.googleMapsUrl,
            eventName: "home_reviews_click",
          },
          {
            title: "90-day workmanship warranty",
            description: "Coverage on repair workmanship.",
          },
          {
            title: "Serving Pasadena",
            description: "Deer Park • La Porte • Houston Area",
          },
        ].map((item, index) => {
          const delayClass = `reveal-delay-${(index % 4) + 1}`;
          const cardClass = `reveal-on-scroll ${delayClass} rounded-xl bg-white/72 px-4 py-4 shadow-[0_10px_30px_rgba(90,55,35,0.08)] ring-1 ring-brand-gold/20`;
          const cardContent = (
            <>
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                {item.title}
              </div>
              <p className="mt-2 text-sm text-stone-600">{item.description}</p>
              {"href" in item && item.href ? (
                <span className="mt-4 inline-flex text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                  Read reviews →
                </span>
              ) : null}
            </>
          );

          if ("href" in item && item.href) {
            return (
              <TrackedAnchor
                key={item.title}
                href={item.href}
                eventName="review_click"
                eventParams={{ business_action: "reviews", placement: "proof_band" }}
                target="_blank"
                rel="noreferrer"
                className={`${cardClass} transition hover:-translate-y-0.5 hover:ring-brand-gold/55`}
              >
                {cardContent}
              </TrackedAnchor>
            );
          }

          return (
            <div
              key={item.title}
              className={cardClass}
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function InHouseBadge() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2] py-10 md:py-14">
      <div className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,46,58,0.18),_transparent_70%)]" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center reveal-on-scroll">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
          In-House Repairs
        </p>
        <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
          100% in-house repairs. Handled on-site from drop-off to pickup.
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Every repair is handled by one local team, with clear approvals before work starts.
        </p>
      </div>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdfa_0%,#f2e7d7_100%)] py-12 md:py-20">
      <div className="pointer-events-none absolute -right-32 top-10 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(209,184,130,0.25),_transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="reveal-on-scroll space-y-4 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              How it works
            </p>
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              A simple, transparent repair process.
            </h2>
            <p className="text-sm text-stone-600">
              You stay in control at every step, with clear updates and no surprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Same Day/Next Day service", "In-house only", "Clear estimates"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-brand-gold/30 bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-stone-600"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative space-y-5 pl-8 md:space-y-10">
            <div className="absolute left-3 top-0 h-full w-px bg-brand-gold/40" />
            {[
              {
                step: "1",
                title: "Drop off & assessment",
                detail: "We inspect your piece, explain the repair, and confirm pricing.",
              },
              {
                step: "2",
                title: "In-house repair",
                detail: "Your jewelry stays on our bench with meticulous, insured care.",
              },
              {
                step: "3",
                title: "Pickup & polish",
                detail: "Final inspection, professional cleaning, and a ready-to-wear finish.",
              },
            ].map((item, index) => {
              const delayClass = `reveal-delay-${(index % 3) + 1}`;
              return (
                <div
                  key={item.step}
                  className={`reveal-on-scroll ${delayClass} relative rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_45px_rgba(58,25,16,0.16)] md:p-7`}
                >
                  <span className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-burgundy text-xs font-semibold text-white shadow-lg">
                    {item.step}
                  </span>
                  <div className="text-xs uppercase tracking-[0.4em] text-brand-burgundy">
                    Step {item.step}
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-600">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CraftStory() {
  return (
    <section className="relative overflow-hidden bg-[#f5ede2] py-16">
      <div className="pointer-events-none absolute -left-28 bottom-10 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,46,58,0.16),_transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4 reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-white/80 p-8 shadow-[0_16px_40px_rgba(58,25,16,0.12)]">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            The Workshop
          </p>
          <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
            A boutique workshop built for precision and trust.
          </h2>
          <p className="text-sm text-stone-600">
            From prong repairs to heirloom restorations, we combine legacy
            techniques with modern tools for flawless finishes.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Master jeweler on-site",
              "Transparent starting prices",
              "Detailed service notes",
              "Careful inspection & cleaning",
            ].map((item, index) => {
              const delayClass = `reveal-delay-${(index % 4) + 1}`;
              return (
                <div
                  key={item}
                  className={`reveal-on-scroll ${delayClass} rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-stone-600`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 reveal-on-scroll">
          <div className="relative h-60 overflow-hidden rounded-3xl border border-stone-200 shadow-md">
            <Image
              src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg"
              alt="Susie's Jewelry Repair workshop with jeweler's bench and tools"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg", alt: "Custom jewelry design sketches and planning notes" },
              { url: "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg", alt: "Pocket watch restoration work in progress" },
            ].map(({ url, alt }) => (
              <div
                key={url}
                className="relative h-32 overflow-hidden rounded-2xl border border-stone-200 shadow-sm"
              >
                <Image
                  src={url}
                  alt={alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShowcaseBand() {
  return (
    <section className="relative hidden overflow-hidden bg-stone-900 py-24 text-[#faf7f2] md:block">
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(209,184,130,0.15),_transparent_70%)]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,46,58,0.2),_transparent_70%)]" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center reveal-on-scroll">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
          Custom Design Showcase
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-[#faf7f2]">
          Design your future heirloom.
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-300 md:text-base">
          Explore our digital design showcase of mountings, settings, and bespoke inspiration, then work with our Pasadena bench to shape the right direction into a finished piece.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/showroom"
            className="micro-interaction inline-flex items-center justify-center rounded-full border border-brand-gold bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold hover:bg-brand-gold/10 transition-colors"
          >
            Explore the Showcase
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="cv-section bg-[#f7efe6] py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy reveal-on-scroll">
          FAQs
        </p>
        <h2 className="mt-3 font-serif text-3xl text-stone-900 reveal-on-scroll">
          Common questions about repairs.
        </h2>
        <div className="mt-4 h-1 w-16 bg-brand-gold/60 reveal-on-scroll" />
        <div className="mt-8 space-y-4">
          {[
            {
              question: "Are you a jewelry store or a repair shop?",
              answer:
                "We are a local jewelry repair shop in Pasadena focused on in-house repairs, watch batteries, ring sizing, stone setting, cleaning, and custom design guidance.",
            },
            {
              question: "Do repairs stay in-house?",
              answer: "Yes. All repairs are handled on-site by our jeweler.",
            },
            {
              question: "How long do repairs take?",
              answer:
                "Most repairs follow Same Day/Next Day service. Timing depends on the job and parts availability.",
            },
            {
              question: "Can I get an estimate before service?",
              answer: "Yes. We provide clear starting prices and confirm final pricing after inspection.",
            },
            {
              question: "Is my jewelry insured while it’s here?",
              answer: "Yes. Your items are handled with insured care while in our workshop.",
            },
            {
              question: "Do you offer rush service?",
              answer: "For many repairs, yes. Ask us about rush options when you visit.",
            },
          ].map((item, index) => {
            const delayClass = `reveal-delay-${(index % 4) + 1}`;
            return (
              <div
                key={item.question}
                className={`reveal-on-scroll ${delayClass} rounded-xl border border-brand-gold/30 bg-white p-5 shadow-[0_18px_40px_rgba(90,55,35,0.14)]`}
              >
                <h3 className="font-semibold text-stone-900">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{item.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="cv-section bg-[#f1e4d7] py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between reveal-on-scroll">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Trusted locally
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900 md:text-4xl">
              Families trust us with their most meaningful pieces.
            </h2>
            <div className="mt-4 h-1 w-16 bg-brand-gold/60" />
          </div>
          <BusinessActionLink
            href={BUSINESS.googleMapsUrl}
            action="reviews"
            placement="testimonials_heading"
            target="_blank"
            rel="noreferrer"
            className="hidden text-xs uppercase tracking-[0.35em] text-stone-600 transition-colors hover:text-brand-burgundy md:block"
          >
            4.5 ★ from 51 Google reviews
          </BusinessActionLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "My engagement ring looks brand new. The team explained every step and kept it on-site.",
              name: "Lydia R.",
              service: "Ring Sizing & Repair",
            },
            {
              quote:
                "Fast turnaround and honest pricing. I appreciated the in-house guarantee.",
              name: "Carlos M.",
              service: "Watch Repair",
            },
            {
              quote:
                "They restored my grandmother’s necklace flawlessly. The craftsmanship is unreal.",
              name: "Jasmine K.",
              service: "Heirloom Restoration",
            },
          ].map((item, index) => {
            const delayClass = `reveal-delay-${(index % 3) + 1}`;
            return (
              <div
                key={item.name}
                className={`reveal-on-scroll ${delayClass} rounded-2xl border border-brand-burgundy/15 bg-white p-6 shadow-[0_20px_45px_rgba(65,35,22,0.18)]`}
              >
                <p className="text-sm text-stone-600">“{item.quote}”</p>
                <div className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  {item.name}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-stone-500">
                  {item.service}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="cv-section bg-brand-burgundy py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center reveal-on-scroll">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">
          Start Today
        </p>
        <h2 className="font-serif text-3xl text-white md:text-4xl">
          Book your repair and keep your jewelry in trusted hands.
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="micro-interaction inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy sm:w-auto"
          >
            Book a Repair
          </Link>
          <Link
            href="/quote"
            className="micro-interaction inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white sm:w-auto"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
