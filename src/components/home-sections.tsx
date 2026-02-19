import Link from "next/link";

export function ProofBand() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7ef_0%,#f0d7c7_100%)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(209,184,130,0.35),_transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-4">
        {[
          {
            title: "Since 1984",
            description: "Local, family-owned craftsmanship.",
          },
          {
            title: "4.5 ★ on Google",
            description: "51 verified reviews.",
          },
          {
            title: "90-day workmanship warranty",
            description: "Coverage on repair workmanship.",
          },
          {
            title: "Serving Pasadena",
            description: "Deer Park • La Porte • Houston Area",
          },
        ].map((item, index) => {
          const delayClass = `reveal-delay-${(index % 4) + 1}`;
          return (
            <div
              key={item.title}
              className={`reveal-on-scroll ${delayClass} rounded-2xl border border-brand-gold/30 bg-white/80 px-4 py-4 shadow-[0_12px_30px_rgba(90,55,35,0.12)]`}
            >
              <div className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                {item.title}
              </div>
              <p className="mt-2 text-sm text-stone-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function InHouseBadge() {
  return (
    <section className="relative overflow-hidden bg-[#f7e4d7] py-14">
      <div className="pointer-events-none absolute -left-24 top-8 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,46,58,0.18),_transparent_70%)]" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center reveal-on-scroll">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
          In-House Repairs
        </p>
        <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
          100% in-house repairs. Handled on-site from drop-off to pickup.
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Every repair is performed on-site by a master jeweler. You get security,
          transparency, and the confidence that your jewelry stays under one roof.
        </p>
      </div>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#f3dfcf_100%)] py-20">
      <div className="pointer-events-none absolute -right-32 top-10 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(209,184,130,0.25),_transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="reveal-on-scroll space-y-4 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              How it works
            </p>
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              A simple, transparent repair process.
            </h2>
            <p className="text-sm text-stone-600">
              You stay in control at every step, with clear updates and no surprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Same Day/Next Day service", "In-house only", "Clear estimates"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-brand-gold/30 bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-stone-600"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative space-y-10 pl-8">
            <div className="absolute left-3 top-0 h-full w-px bg-brand-gold/40" />
            {[
              {
                step: "1",
                title: "Drop off & assessment",
                detail: "We inspect your piece, explain the repair, and confirm pricing.",
              },
              {
                step: "2",
                title: "In-house repair",
                detail: "Your jewelry stays on our bench with meticulous, insured care.",
              },
              {
                step: "3",
                title: "Pickup & polish",
                detail: "Final inspection, professional cleaning, and a ready-to-wear finish.",
              },
            ].map((item, index) => {
              const delayClass = `reveal-delay-${(index % 3) + 1}`;
              return (
                <div
                  key={item.step}
                  className={`reveal-on-scroll ${delayClass} relative rounded-3xl border border-stone-200 bg-white p-7 shadow-[0_18px_45px_rgba(58,25,16,0.16)]`}
                >
                  <span className="absolute -left-10 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-burgundy text-xs font-semibold text-white shadow-lg">
                    {item.step}
                  </span>
                  <div className="text-xs uppercase tracking-[0.4em] text-brand-gold">
                    Step {item.step}
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-600">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CraftStory() {
  return (
    <section className="relative overflow-hidden bg-[#f1dccb] py-16">
      <div className="pointer-events-none absolute -left-28 bottom-10 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,_rgba(122,46,58,0.16),_transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div className="space-y-4 reveal-on-scroll rounded-3xl border border-brand-gold/25 bg-white/80 p-8 shadow-[0_16px_40px_rgba(58,25,16,0.12)]">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            The Workshop
          </p>
          <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
            A boutique workshop built for precision and trust.
          </h2>
          <p className="text-sm text-stone-600">
            From prong repairs to heirloom restorations, we combine legacy
            techniques with modern tools for flawless finishes.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Master jeweler on-site",
              "Transparent starting prices",
              "Detailed service notes",
              "Careful inspection & cleaning",
            ].map((item, index) => {
              const delayClass = `reveal-delay-${(index % 4) + 1}`;
              return (
                <div
                  key={item}
                  className={`reveal-on-scroll ${delayClass} rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-stone-600`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid gap-4 reveal-on-scroll">
          <div
            className="h-60 rounded-3xl border border-stone-200 bg-cover bg-center shadow-md"
            style={{
              backgroundImage:
                "url('https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-main.jpeg')",
            }}
            aria-hidden="true"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-sketches.jpg",
              "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/home/workshop-pocket-watch.jpg",
            ].map((url) => (
              <div
                key={url}
                className="h-32 rounded-2xl border border-stone-200 bg-cover bg-center shadow-sm"
                style={{ backgroundImage: `url('${url}')` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="bg-[#f0d3c0] py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy reveal-on-scroll">
          FAQs
        </p>
        <h2 className="mt-3 font-serif text-3xl text-stone-900 reveal-on-scroll">
          Common questions about repairs.
        </h2>
        <div className="mt-4 h-1 w-16 bg-brand-gold/60 reveal-on-scroll" />
        <div className="mt-8 space-y-4">
          {[
            {
              question: "Do repairs stay in-house?",
              answer: "Yes. All repairs are handled on-site by our jeweler.",
            },
            {
              question: "How long do repairs take?",
              answer:
                "Most repairs follow Same Day/Next Day service. Timing depends on the job and parts availability.",
            },
            {
              question: "Can I get an estimate before service?",
              answer: "Yes. We provide clear starting prices and confirm final pricing after inspection.",
            },
            {
              question: "Is my jewelry insured while it’s here?",
              answer: "Yes. Your items are handled with insured care while in our workshop.",
            },
            {
              question: "Do you offer rush service?",
              answer: "For many repairs, yes. Ask us about rush options when you visit.",
            },
          ].map((item, index) => {
            const delayClass = `reveal-delay-${(index % 4) + 1}`;
            return (
              <div
                key={item.question}
                className={`reveal-on-scroll ${delayClass} rounded-xl border border-brand-gold/30 bg-white p-5 shadow-[0_18px_40px_rgba(90,55,35,0.14)]`}
              >
                <div className="font-semibold text-stone-900">
                  {item.question}
                </div>
                <p className="mt-2 text-sm text-stone-600">{item.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-[#e7c4ae] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between reveal-on-scroll">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Trusted locally
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900 md:text-4xl">
              Families trust us with their most meaningful pieces.
            </h2>
            <div className="mt-4 h-1 w-16 bg-brand-gold/60" />
          </div>
          <span className="hidden text-xs uppercase tracking-[0.35em] text-stone-600 md:block">
            4.5 ★ from 51 Google reviews
          </span>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "My engagement ring looks brand new. The team explained every step and kept it on-site.",
              name: "Lydia R.",
              service: "Ring Sizing & Repair",
            },
            {
              quote:
                "Fast turnaround and honest pricing. I appreciated the in-house guarantee.",
              name: "Carlos M.",
              service: "Watch Repair",
            },
            {
              quote:
                "They restored my grandmother’s necklace flawlessly. The craftsmanship is unreal.",
              name: "Jasmine K.",
              service: "Heirloom Restoration",
            },
          ].map((item, index) => {
            const delayClass = `reveal-delay-${(index % 3) + 1}`;
            return (
              <div
                key={item.name}
                className={`reveal-on-scroll ${delayClass} rounded-2xl border border-brand-burgundy/15 bg-white p-6 shadow-[0_20px_45px_rgba(65,35,22,0.18)]`}
              >
                <p className="text-sm text-stone-600">“{item.quote}”</p>
                <div className="mt-4 text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                  {item.name}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-stone-500">
                  {item.service}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="bg-brand-burgundy py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center reveal-on-scroll">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">
          Start Today
        </p>
        <h2 className="font-serif text-3xl text-white md:text-4xl">
          Get a fast, transparent quote and keep your jewelry in trusted hands.
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/quote"
            className="micro-interaction rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy"
          >
            Get Fast Quote
          </Link>
          <Link
            href="/book"
            className="micro-interaction rounded-full border border-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            Book a Repair
          </Link>
        </div>
      </div>
    </section>
  );
}
