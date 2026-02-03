import { SiteShell } from "@/components/site-shell";

export default function BlogDetailPage() {
  return (
    <SiteShell>
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
            Blog Post
          </p>
          <h1 className="mt-3 font-serif text-4xl text-stone-900">
            Article Title Placeholder
          </h1>
          <p className="mt-4 text-sm text-stone-600">
            This is a template for future blog automation. Content will be
            generated and published via the planned workflow.
          </p>
          <div className="mt-8 space-y-4 text-sm text-stone-700">
            <p>
              Add structured content here: intro, bullet points, and service
              callouts.
            </p>
            <p>
              Include local keywords and internal links to services and FAQs
              for SEO.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
