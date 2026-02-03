import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            About
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Our Story
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.35em] text-stone-500">
            Four decades of family tradition and trusted craftsmanship
          </p>
          <h2 className="mt-6 font-serif text-2xl text-stone-900">
            The Beginning of Excellence
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            At Susie’s Jewelry Repair, every piece tells a story. Whether it’s an
            engagement ring, a watch passed down through generations, or a necklace that
            carries sentimental value, we understand the emotional significance of what
            you entrust to our care. We combine traditional family techniques with modern
            tools to restore both vintage heirlooms and contemporary jewelry with precision.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            We take the time to understand each customer’s needs, explain the process, and
            ensure complete satisfaction. Your trust is our most valuable asset, and we
            never take it for granted.
          </p>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Built on family values
            </p>
            <h2 className="mt-3 font-serif text-2xl text-stone-900">
              Three generations committed to excellence.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Family Heritage",
                body:
                  "Three generations contribute to a tradition of meticulous repair and honest guidance.",
              },
              {
                title: "Community Trust",
                body:
                  "We build lasting relationships by protecting the pieces families trust us with.",
              },
              {
                title: "Unwavering Standards",
                body:
                  "Every repair gets the same careful attention, from battery replacements to full restorations.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-stone-200 bg-stone-100/60 p-6"
              >
                <h3 className="font-serif text-xl text-stone-900">{item.title}</h3>
                <p className="mt-3 text-sm text-stone-600">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Our journey through the years
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900">
              A Pasadena story built over decades.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                {
                  year: "1985",
                  detail:
                    "The Beginning: a Houston flea market storefront powered by basic tools and a clear vision.",
                },
                {
                  year: "1997",
                  detail:
                    "Expansion & Growth: opened an official store on Spencer Hwy in South Houston.",
                },
                {
                  year: "2008",
                  detail:
                    "Bigger & Better: moved to the Fairmont location with a larger store and more merchandise.",
                },
                {
                  year: "2020",
                  detail:
                    "A Legacy Continues: the next generations joined to carry the family tradition forward.",
                },
              ].map((item) => (
                <div
                  key={item.year}
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                    {item.year}
                  </div>
                  <p className="mt-3 text-sm text-stone-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-100/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Our Philosophy
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Our philosophy begins with understanding you. The jewelry you bring us is
              more than an accessory—it’s a cherished memory, a family heirloom, or a
              symbol of a milestone. This belief guides our hands as we combine time‑honored
              family techniques with the best of modern technology, earning trust through a
              transparent process and dedication to quality.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { label: "40+ Years in Business", value: "Family-owned tradition" },
              { label: "10,000+ Repairs Completed", value: "Handled with care" },
              { label: "4.5★ Local Reputation", value: "Trusted in Pasadena" },
              { label: "Family Owned & Operated", value: "Three generations strong" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-stone-200 bg-stone-100/60 p-5 text-center"
              >
                <div className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
                  {item.label}
                </div>
                <p className="mt-2 text-sm text-stone-600">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Susie’s
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              For over 40 years, our family has had the privilege of serving the Pasadena
              community with expert jewelry and watch repair services. Our legacy is built on
              meticulous restoration, personal care, and treating each piece with the respect
              it deserves.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Visit Us",
                body: "3910 Fairmont Pkwy, Suite-C, Pasadena, TX 77504",
              },
              { title: "Call", body: "(281) 991-6500" },
              { title: "Email", body: "contact@susiesjewelryrepair.com" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-stone-200 bg-stone-100/60 p-5 text-center"
              >
                <div className="text-xs uppercase tracking-[0.35em] text-brand-burgundy">
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-stone-600">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-brand-gold/30 bg-white p-6">
            <h3 className="font-serif text-2xl text-stone-900">
              Ready to experience the difference?
            </h3>
            <p className="text-sm text-stone-600">
              Visit our family‑owned shop and see why Pasadena has trusted us for over 40 years.
            </p>
            <Link
              href="/contact"
              className="micro-interaction inline-flex items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-brand-burgundy-deep"
            >
              Visit Us Today
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
