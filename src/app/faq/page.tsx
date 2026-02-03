import { SiteShell } from "@/components/site-shell";

const faqs = [
  {
    q: "Do you repair jewelry in‑house?",
    a: "Yes. Repairs are completed in‑house so your valuables stay under our care.",
  },
  {
    q: "How long does a typical repair take?",
    a: "Most repairs are completed within the week. We confirm timing during your assessment.",
  },
  {
    q: "Can I get a price before I come in?",
    a: "Yes. Submit a Fast Quote request to receive a transparent starting‑at range.",
  },
  {
    q: "Do I need an appointment?",
    a: "Walk‑ins are welcome, and you can also book a 15‑minute assessment online.",
  },
];

export default function FaqPage() {
  return (
    <SiteShell>
      <section className="bg-stone-100 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            FAQ
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Answers before you visit
          </h1>
          <div className="mt-10 space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-stone-200 bg-white p-6"
              >
                <h2 className="font-serif text-xl text-stone-900">{faq.q}</h2>
                <p className="mt-3 text-sm text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
