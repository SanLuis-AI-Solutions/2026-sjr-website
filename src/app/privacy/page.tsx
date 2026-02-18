import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";

const UPDATED_DATE = "February 13, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | Susie’s Jewelry Repair",
  description:
    "Read how Susie’s Jewelry Repair collects, uses, and protects customer information for quote, booking, and contact requests.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-stone-100 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(209,184,130,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Privacy
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-stone-500">
            Last updated {UPDATED_DATE}
          </p>

          <div className="mt-10 space-y-6 rounded-3xl border border-stone-200 bg-white/80 p-8 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm">
            <p className="text-sm leading-7 text-stone-600">
              We respect your privacy. This policy explains what information we
              collect, how we use it, and the choices you have.
            </p>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Information we collect</h2>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                <li>• Contact details you submit (name, email, phone).</li>
                <li>• Service details you provide (messages, repair notes, photos for quotes).</li>
                <li>• Basic website usage data (only if analytics is enabled).</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">How we use your information</h2>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                <li>• To respond to your requests and provide service updates.</li>
                <li>• To schedule and confirm bookings.</li>
                <li>• To improve the website experience and reliability.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Sharing</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                We do not sell your personal information. We may share information
                with service providers only as needed to operate the website and
                communicate with you (for example, email delivery).
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-stone-900">Your choices</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                You can request access, updates, or deletion of your contact
                information by emailing{" "}
                <a
                  className="font-semibold text-brand-burgundy hover:text-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  href={`mailto:${BUSINESS.email}`}
                >
                  {BUSINESS.email}
                </a>
                .
              </p>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <h2 className="font-serif text-2xl text-stone-900">Contact</h2>
              <p className="mt-4 text-sm text-stone-600">
                {BUSINESS.name} · {BUSINESS.address.street},{" "}
                {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                {BUSINESS.address.zip} ·{" "}
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
