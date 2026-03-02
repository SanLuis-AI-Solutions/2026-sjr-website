import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Susie’s Jewelry Repair | In-House Family Craftsmanship",
  description:
    "Meet the family behind Susie’s Jewelry Repair in Pasadena, TX. Three generations, in-house service, and clear approvals on every repair.",
  alternates: {
    canonical: "/about",
  },
};

const TIMELINE = [
  {
    year: "1984",
    title: "The foundation",
    detail:
      "Started with a single bench, hand tools, and a commitment to transparent, local craftsmanship.",
  },
  {
    year: "1997",
    title: "A dedicated storefront",
    detail:
      "Opened our first official store and expanded from quick fixes to full-service jewelry and watch repair.",
  },
  {
    year: "2008",
    title: "Larger workshop",
    detail:
      "Moved to Fairmont Parkway, adding capacity while keeping the same family-run service model.",
  },
  {
    year: "Today",
    title: "Three generations",
    detail:
      "The next generation now works side-by-side at the bench, carrying the same standards forward.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Intake & inspection",
    detail:
      "We document condition, review concerns, and explain options in plain language.",
  },
  {
    step: "02",
    title: "Approval before work",
    detail:
      "You approve price and timing first. If scope changes, we pause and ask before continuing.",
  },
  {
    step: "03",
    title: "In-house craftsmanship",
    detail:
      "Your piece stays with our local bench team through repair, refinement, and cleaning.",
  },
  {
    step: "04",
    title: "Final quality review",
    detail:
      "Fit, function, and finish are checked before pickup so your piece is ready to wear.",
  },
];

const STANDARDS = [
  {
    title: "In-house only",
    body: "One local team handles your piece on-site from intake to pickup.",
  },
  {
    title: "Clear communication",
    body: "You get straightforward recommendations, not pressure, and approvals before service starts.",
  },
  {
    title: "Premium finish",
    body: "Repairs are cleaned, inspected, and refined so results look intentional, not temporary.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-white pt-16 pb-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,_rgba(122,46,58,0.09),_transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,_rgba(209,184,130,0.18),_transparent_52%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">About</p>
            <h1 className="mt-3 max-w-3xl text-balance font-serif text-[2.15rem] leading-[1.12] text-stone-950 md:text-5xl">
              Family craftsmanship, refined over four decades.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-stone-700">
              Susie’s Jewelry Repair is built for people who expect premium work without guesswork.
              Your piece stays local, your approvals stay clear, and your finish is checked before pickup.
            </p>

            <div className="mt-7 flex flex-wrap gap-3" role="region" aria-label="Quick actions">
              <Link
                href="/quote"
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 text-center sm:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <p className="text-lg font-semibold text-stone-900">40+</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-600">Years</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <p className="text-lg font-semibold text-stone-900">3</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-600">Generations</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <p className="text-lg font-semibold text-stone-900">In-House</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-600">Repairs</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <p className="text-lg font-semibold text-stone-900">Same Day</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-600">Service</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="reveal-on-scroll reveal-delay-1 sm:col-span-2 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_26px_70px_rgba(58,25,16,0.18)]">
              <div className="relative min-h-[300px]">
                <Image
                  src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg"
                  alt="Inside Susie's Jewelry Repair workshop"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-burgundy-deep/58 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-xl border border-white/20 bg-black/35 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                    Local workshop
                  </p>
                  <p className="mt-1 text-sm text-white">Pasadena, Texas</p>
                </div>
              </div>
            </article>
            <article className="reveal-on-scroll reveal-delay-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="relative min-h-[150px]">
                <Image
                  src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg"
                  alt="Repair planning and sketch details"
                  fill
                  sizes="(max-width: 768px) 100vw, 24vw"
                  className="object-cover"
                />
              </div>
            </article>
            <article className="reveal-on-scroll reveal-delay-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="relative min-h-[150px]">
                <Image
                  src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg"
                  alt="Heirloom restoration detail"
                  fill
                  sizes="(max-width: 768px) 100vw, 24vw"
                  className="object-cover"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-burgundy py-14" aria-labelledby="about-manifesto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,_rgba(209,184,130,0.22),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_85%,_rgba(94,34,48,0.45),_transparent_58%)]" />
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">Our manifesto</p>
            <h2 id="about-manifesto" className="mt-3 text-balance font-serif text-[2rem] leading-[1.18] text-white md:text-3xl">
              Premium care should feel precise, calm, and transparent.
            </h2>
          </div>
          <blockquote className="reveal-on-scroll reveal-delay-2 rounded-3xl border border-white/20 bg-white/10 p-6 text-[15px] leading-7 text-stone-100">
            “We treat each piece as if it were our own family’s heirloom. No shortcuts, no rushed
            handoffs, and no surprises before pickup.”
          </blockquote>
        </div>
      </section>

      <section className="relative overflow-hidden py-18 md:py-24">
        <div
          className="parallax-hero absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-burgundy/88 via-brand-burgundy/70 to-brand-burgundy-deep/78" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="reveal-on-scroll max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">Legacy care</p>
            <h2 className="mt-3 text-balance font-serif text-[2rem] leading-[1.2] text-white md:text-4xl">
              Some pieces carry generations of memory. We repair them accordingly.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-stone-100">
              Our restoration work focuses on structural integrity, faithful finishing, and clear
              approvals before every major step.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-14" aria-labelledby="about-standards">
        <div className="mx-auto max-w-6xl px-6">
          <p className="reveal-on-scroll text-xs uppercase tracking-[0.35em] text-brand-burgundy">Our standards</p>
          <h2
            id="about-standards"
            className="reveal-on-scroll mt-3 max-w-3xl text-balance font-serif text-[2rem] leading-[1.2] text-stone-900 md:text-3xl"
          >
            What makes our process different from generic repair counters.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STANDARDS.map((item, index) => (
              <article
                key={item.title}
                className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_16px_46px_rgba(58,25,16,0.10)]`}
              >
                <h3 className="font-serif text-[1.6rem] leading-[1.2] text-stone-900 md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-stone-700">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-process">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div className="reveal-on-scroll">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">How we work</p>
              <h2
                id="about-process"
                className="mt-3 text-balance font-serif text-[2rem] leading-[1.2] text-stone-900 md:text-3xl"
              >
                A clear process from first conversation to final pickup.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-stone-700">
                Whether you bring a watch, ring, bracelet, or heirloom, the same four-step standard
                applies every time.
              </p>
            </div>

            <ol className="space-y-4">
              {PROCESS.map((item, index) => (
                <li
                  key={item.step}
                  className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} rounded-3xl border border-stone-200 bg-stone-50 p-5 shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-burgundy text-xs font-semibold text-white">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-serif text-[1.45rem] leading-[1.2] text-stone-900 md:text-2xl">{item.title}</h3>
                      <p className="mt-2 text-[15px] leading-7 text-stone-700">{item.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-14" aria-labelledby="about-timeline">
        <div className="mx-auto max-w-6xl px-6">
          <p className="reveal-on-scroll text-xs uppercase tracking-[0.35em] text-brand-burgundy">Our timeline</p>
          <h2
            id="about-timeline"
            className="reveal-on-scroll mt-3 text-balance font-serif text-[2rem] leading-[1.2] text-stone-900 md:text-3xl"
          >
            Four decades of local trust, with the same family standards.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item, index) => (
              <article
                key={item.year}
                className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} rounded-2xl border border-stone-200 bg-white p-5 shadow-sm`}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">{item.year}</p>
                <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.2] text-stone-900 md:text-2xl">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-stone-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-workshop">
        <div className="mx-auto max-w-6xl px-6">
          <p className="reveal-on-scroll text-xs uppercase tracking-[0.35em] text-brand-burgundy">Inside the workshop</p>
          <h2
            id="about-workshop"
            className="reveal-on-scroll mt-3 text-balance font-serif text-[2rem] leading-[1.2] text-stone-900 md:text-3xl"
          >
            Authentic, in-house craftsmanship.
          </h2>
          <p className="reveal-on-scroll mt-4 text-[15px] leading-7 text-stone-700 max-w-2xl">
            We are a family of jewelers spanning three generations. When you drop off a piece, it never leaves our sight. We prefer to let our work speak for itself—no outsourced labor, just authentic local dedication at our Pasadena workshop.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { title: "Master Craftsmanship", desc: "Hands at work on a detailed repair", image: "/images/about/master-craftsmanship.png" },
              { title: "The Jeweler's Bench", desc: "Precision tools and equipment", image: "/images/about/jewelers-bench.png" },
              { title: "Our Local Storefront", desc: "Serving Pasadena & Deer Park", image: "/images/about/storefront.jpg" }
            ].map((item, index) => (
              <article key={item.title} className={`reveal-on-scroll reveal-delay-${(index % 3) + 1} group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50`}>
                <div className="aspect-[3/4] w-full bg-stone-200 relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="relative z-10 -mt-1 p-5 border-t border-stone-100 bg-white shadow-sm">
                  <h3 className="font-serif text-xl text-stone-900">{item.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-gold">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-14" aria-labelledby="about-visit">
        <div className="mx-auto max-w-6xl px-6">
          <p className="reveal-on-scroll text-xs uppercase tracking-[0.35em] text-brand-burgundy">Visit us</p>
          <h2
            id="about-visit"
            className="reveal-on-scroll mt-3 font-serif text-[2rem] leading-[1.2] text-stone-900 md:text-3xl"
          >
            Stop by our Pasadena workshop.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="reveal-on-scroll rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Address</h3>
              <p className="mt-3 text-[15px] leading-7 text-stone-700">
                {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state} {" "}
                {BUSINESS.address.zip}
              </p>
            </article>
            <article className="reveal-on-scroll reveal-delay-1 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Phone</h3>
              <Link
                href={`tel:${BUSINESS.phone}`}
                className="mt-3 inline-flex min-h-12 items-center text-[15px] font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.phone}
              </Link>
            </article>
            <article className="reveal-on-scroll reveal-delay-2 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Email</h3>
              <Link
                href={`mailto:${BUSINESS.email}`}
                className="mt-3 inline-flex min-h-12 items-center text-[15px] font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.email}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
