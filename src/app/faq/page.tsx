import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";
import { FAQS } from "@/lib/faq";
import { BusinessActionLink } from "@/components/analytics/business-action-link";
import { FaqContent } from "./faq-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Jewelry Repair FAQ | Susie’s Jewelry Repair",
  description:
    "Read frequently asked questions about in-house jewelry and watch repair in Pasadena, including timing, pricing, approvals, and appointment guidance.",
  canonical: "/faq",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <SiteShell>
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="relative overflow-hidden bg-stone-100 py-14 md:py-16" aria-labelledby="faq-hero-title">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.14),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="reveal-on-scroll text-xs uppercase tracking-[0.3em] text-brand-burgundy">FAQ</p>
          <h1 id="faq-hero-title" className="reveal-on-scroll mt-3 max-w-3xl text-balance font-serif text-[2.15rem] leading-[1.12] text-stone-900 md:text-5xl">
            Answers before you hand over a meaningful piece.
          </h1>
          <p className="reveal-on-scroll mt-4 max-w-3xl text-[15px] leading-7 text-stone-600">
            Clear guidance on timing, approvals, and in-house repair so you know what to expect
            before you visit.
          </p>
          <div className="reveal-on-scroll mt-7">
            <Link
              href="/book"
              className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Book a Repair
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 pb-16" aria-label="FAQ library">
        <div className="mx-auto max-w-6xl px-6">
          <FaqContent />

          <div className="reveal-on-scroll mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl text-stone-900">Still need help?</h2>
            <p className="mt-3 text-[15px] leading-7 text-stone-600">
              Call us at{" "}
              <BusinessActionLink
                href={`tel:${BUSINESS.phone}`}
                action="phone_call"
                placement="faq_help"
                className="font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {BUSINESS.phone}
              </BusinessActionLink>{" "}
              or send a message and we’ll guide you to the best next step.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
