import { SiteShell } from "@/components/site-shell";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Contact
            </p>
            <h1 className="mt-3 font-serif text-4xl text-stone-900">
              Talk to a local expert
            </h1>
            <p className="mt-4 text-sm text-stone-600">
              Call, email, or send a quick note. We’ll guide you to the next
              step.
            </p>
            <div className="mt-6 text-sm text-stone-600">
              <div>{BUSINESS.phone}</div>
              <div>{BUSINESS.email}</div>
              <div className="mt-3">
                {BUSINESS.address.street}, {BUSINESS.address.city},{" "}
                {BUSINESS.address.state} {BUSINESS.address.zip}
              </div>
            </div>
          </div>
          <form className="rounded-lg border border-stone-200 bg-stone-100 p-6">
            <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
              Name
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="Your name"
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="you@email.com"
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-stone-600">
              Message
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-800"
                placeholder="How can we help?"
              />
            </label>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-brand-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-burgundy-deep"
            >
              Send Message
            </button>
            <p className="mt-3 text-xs text-stone-600">
              Secure form · We reply within 1 business day.
            </p>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
