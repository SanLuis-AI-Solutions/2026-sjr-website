import type { Metadata } from "next";
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
    title: "Family Heritage",
    body: "Three generations contribute to a tradition of meticulous repair and honest guidance.",
  },
  {
    title: "Community Trust",
    body: "We protect the pieces families trust us with and communicate clearly from start to finish.",
  },
  {
    title: "Unwavering Standards",
    body: "Every repair receives careful quality checks before pickup, from simple fixes to restorations.",
  },
];

const TIMELINE = [
  {
    year: "1985",
    detail:
      "The beginning: a Houston flea market storefront with basic tools, strong word of mouth, and a clear service promise.",
  },
  {
    year: "1997",
    detail: "Expansion: opened an official store on Spencer Highway in South Houston.",
  },
  {
    year: "2008",
    detail: "Growth: moved to Fairmont Parkway with a larger workshop and broader services.",
  },
  {
    year: "2020",
    detail: "Legacy: the next generation joined the bench and continued the family craft.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">About</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl text-stone-900 md:text-5xl">
            Family craftsmanship, refined over four decades.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
            Every piece you bring us carries meaning. We combine time-honored repair techniques
            with modern tools to deliver clear approvals, precise work, and dependable care.
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
        </div>
      </section>

      <section className="bg-stone-100 py-14" aria-labelledby="about-story">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Our story</p>
            <h2 id="about-story" className="mt-3 font-serif text-3xl text-stone-900">
              Built on trust, not handoffs.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-700">
            <p>
              We are an in-house repair team serving Pasadena families who need dependable jewelry
              and watch care. Your piece stays under one roof while we assess, repair, and finish.
            </p>
            <p>
              Before work begins, we explain the plan and confirm starting pricing. If scope
              changes, we pause and ask for approval first.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-values">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Built on family values
          </p>
          <h2 id="about-values" className="mt-3 font-serif text-3xl text-stone-900">
            Three generations committed to careful, transparent work.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {VALUES.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm"
              >
                <h3 className="font-serif text-2xl text-stone-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-14" aria-labelledby="about-timeline">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Our journey through the years
          </p>
          <h2 id="about-timeline" className="mt-3 font-serif text-3xl text-stone-900">
            A local story built over decades.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item) => (
              <article
                key={item.year}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">{item.year}</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14" aria-labelledby="about-visit">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Visit us</p>
          <h2 id="about-visit" className="mt-3 font-serif text-3xl text-stone-900">
            Stop by our Pasadena workshop.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Address</h3>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                {BUSINESS.address.zip}
              </p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Phone</h3>
              <Link
                href={`tel:${BUSINESS.phone}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.phone}
              </Link>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">Email</h3>
              <Link
                href={`mailto:${BUSINESS.email}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-800 hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
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
