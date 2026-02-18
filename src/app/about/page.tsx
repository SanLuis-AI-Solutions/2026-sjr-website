import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Susie’s Jewelry Repair | Family-Owned In-House Craftsmanship",
  description:
    "Meet the family behind Susie’s Jewelry Repair in Pasadena, TX. Three generations, in-house service, and clear approvals on every repair.",
  alternates: {
    canonical: "/about",
  },
};

const VALUES = [
  {
    title: "In-house only",
    body: "Your jewelry and watches stay with one local team from intake to final checks.",
  },
  {
    title: "Clear approvals",
    body:
      "We confirm scope, pricing, and timing before service starts. If anything changes, we pause and ask first.",
  },
  {
    title: "Careful finishing",
    body:
      "Repairs are cleaned, checked, and reviewed before pickup so pieces are ready to wear confidently.",
  },
];

const TIMELINE = [
  {
    year: "1984",
    detail:
      "Started with a bench, hand tools, and a promise to keep every repair local and transparent.",
  },
  {
    year: "1997",
    detail: "Opened a dedicated storefront and expanded into full jewelry and watch repair service.",
  },
  {
    year: "2008",
    detail: "Moved to Fairmont Parkway with a larger workshop and stronger in-house capacity.",
  },
  {
    year: "Today",
    detail:
      "Three generations continue the craft with modern tools, clear communication, and local accountability.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-50 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,_rgba(122,46,58,0.08),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,_rgba(209,184,130,0.18),_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">About</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-stone-900 md:text-5xl">
              Family craftsmanship, refined over four decades.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-700">
              Susie’s Jewelry Repair is built on one simple standard: your piece stays local,
              your approvals stay clear, and your final result is finished with care.
            </p>
            <div className="mt-7 flex flex-wrap gap-3" role="region" aria-label="Quick actions">
              <Link
                href="/quote"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Get Fast Quote
              </Link>
              <Link
                href="/book"
                className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Book Repair
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-700">
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                In-house only
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                Same Day/Next Day service
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                No outsourcing
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_24px_65px_rgba(58,25,16,0.16)] sm:col-span-2">
              <Image
                src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg"
                alt="Susie's Jewelry Repair in-house workshop"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1416]/55 via-transparent to-transparent" />
            </div>
            <div className="relative min-h-[170px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <Image
                src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg"
                alt="Detailed repair planning and sketch work"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[170px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <Image
                src="https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/before-after/after-ring.png"
                alt="Finished ring restoration detail"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-story">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Our story</p>
            <h2 id="about-story" className="mt-3 font-serif text-3xl text-stone-900">
              Built on trust, not handoffs.
            </h2>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm">
            <h3 className="font-serif text-2xl text-stone-900">What customers can expect</h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
              <p>
                We are an in-house repair team serving Pasadena families who need dependable
                jewelry and watch care. Your piece stays under one roof while we assess, repair,
                and finish.
              </p>
              <p>
                Before work begins, we explain the plan and confirm starting pricing. If scope
                changes, we pause and ask for approval first.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-14" aria-labelledby="about-values">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Our standard</p>
          <h2 id="about-values" className="mt-3 max-w-3xl font-serif text-3xl text-stone-900">
            Premium repair quality without premium uncertainty.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {VALUES.map((item, index) => (
              <article
                key={item.title}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-burgundy">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-stone-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-timeline">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Our timeline</p>
          <h2 id="about-timeline" className="mt-3 font-serif text-3xl text-stone-900">
            A local craft tradition that keeps evolving.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item) => (
              <article
                key={item.year}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">{item.year}</p>
                <p className="mt-3 text-sm leading-7 text-stone-700">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-14" aria-labelledby="about-visit">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Visit us</p>
          <h2 id="about-visit" className="mt-3 font-serif text-3xl text-stone-900">
            Stop by our Pasadena workshop.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Address</h3>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                {BUSINESS.address.zip}
              </p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Phone</h3>
              <Link
                href={`tel:${BUSINESS.phone}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.phone}
              </Link>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Email</h3>
              <Link
                href={`mailto:${BUSINESS.email}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.email}
              </Link>
            </article>
          </div>
          <div className="mt-8 flex flex-wrap gap-3" role="region" aria-label="Visit quick actions">
            <Link
              href="/quote"
              className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </Link>
            <Link
              href="/book"
              className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book Repair
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-cta">
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="about-cta" className="font-serif text-3xl text-stone-900">
            Why local families keep coming back
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-700">
            The same standards apply whether you need a quick sizing adjustment or a complex
            restoration: honest guidance, careful craftsmanship, and a finished piece you can wear
            with confidence.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-700">
            Questions before you visit? Call {BUSINESS.phone} or send a request and we’ll respond
            with clear next steps.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="micro-interaction inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-800 hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
