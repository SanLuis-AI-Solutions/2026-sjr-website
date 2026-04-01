import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ServicesGrid } from "@/components/services-grid";
import { CraftStory, HomeCta, HomeFaq, InHouseBadge, ProcessSteps, ProofBand, ShowroomBand, Testimonials } from "@/components/home-sections";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { TrackedAnchor } from "@/components/analytics/tracked-anchor";
import { servicesSchema, faqSchema } from "@/lib/schema";
import { getServicesWithImages } from "@/lib/content-images";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Jewelry Repair in Pasadena, TX | Watch, Ring & Stone Repair | Susie’s Jewelry Repair",
  description:
    "Visit our Pasadena, TX workshop for in-house jewelry repair, watch batteries, ring sizing, stone replacement, and heirloom restoration with clear quote-first guidance.",
  alternates: {
    canonical: "/",
  },
};

async function ServicesGridSection() {
  const services = await getServicesWithImages();
  return <ServicesGrid services={services} />;
}

async function HomeDeferredContent() {
  await Promise.resolve();

  return (
    <>
      <ProofBand />
      <InHouseBadge />
      <ProcessSteps />
      <ServicesGridSection />
      <CraftStory />
      <ShowroomBand />
      <Testimonials />
      <HomeFaq />
      <HomeCta />
    </>
  );
}

export default async function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="pointer-events-none fixed left-4 top-4 z-[999] -translate-y-24 rounded-full bg-brand-burgundy px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition focus:pointer-events-auto focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="overflow-hidden pt-24 md:pt-28">
        <Hero />
        <Suspense fallback={null}>
          <HomeDeferredContent />
        </Suspense>
      </main>
      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div
          role="region"
          aria-label="Homepage quick actions"
          className="rounded-2xl border border-stone-200 bg-white/90 p-3 shadow-[0_24px_60px_rgba(58,25,16,0.22)] backdrop-blur-sm"
        >
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-600">
            Same Day/Next Day service • In-house repairs
          </p>
          <div className="flex items-center gap-3">
            <TrackedLink
              href="/quote"
              eventName="home_mobile_quick_action_click"
              eventParams={{ placement: "mobile_quick_actions", cta_target: "quote" }}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand-burgundy px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Get Fast Quote
            </TrackedLink>
            <TrackedAnchor
              href={`tel:${BUSINESS.phone}`}
              eventName="home_mobile_quick_action_click"
              eventParams={{ placement: "mobile_quick_actions", cta_target: "call" }}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-brand-gold px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              aria-label={`Call ${BUSINESS.phone}`}
            >
              Call Now
            </TrackedAnchor>
          </div>
          <div className="mt-3 text-center">
            <TrackedLink
              href="/book"
              eventName="home_mobile_quick_action_click"
              eventParams={{ placement: "mobile_quick_actions", cta_target: "book" }}
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-700 underline decoration-brand-gold/60 underline-offset-4"
            >
              Prefer to reserve a time? Book repair
            </TrackedLink>
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
