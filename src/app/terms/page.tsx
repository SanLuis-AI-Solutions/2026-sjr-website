import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";

const UPDATED_DATE = "February 13, 2026";

export const metadata = createPageMetadata({
  title: "Terms of Service | Susie’s Jewelry Repair",
  description:
    "Review the website and service request terms for Susie’s Jewelry Repair, including booking requests, quote ranges, repair timing, and communication expectations.",
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Terms
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-stone-500">
            Last updated {UPDATED_DATE}
          </p>

          <div className="mt-10 space-y-6 rounded-3xl border border-stone-200 bg-white/80 p-8 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm">
            <p className="text-sm leading-7 text-stone-600">
              These terms provide general guidelines for using our website and
              requesting services. If you have questions, contact us and we will
              help.
            </p>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Appointments and requests</h2>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                <li>• Online bookings are requests and are confirmed by email.</li>
                <li>• Quote ranges are estimates until we inspect the item in person.</li>
                <li>• Timing and pricing can vary based on parts availability and repair complexity.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Website usage</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                You agree not to misuse the website, attempt unauthorized access,
                or interfere with normal operation.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Disclaimer</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                We provide the website on an “as is” basis and make no guarantees
                that it will always be available without interruption. For
                service-specific questions, please contact us directly.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <h2 className="font-serif text-2xl text-stone-900">Contact</h2>
              <p className="mt-4 text-sm text-stone-600">
                {BUSINESS.name} ·{" "}
                <a
                  className="font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  href={`mailto:${BUSINESS.email}`}
                >
                  {BUSINESS.email}
                </a>{" "}
                ·{" "}
                <a
                  className="hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  href={`tel:${BUSINESS.phone}`}
                >
                  {BUSINESS.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
