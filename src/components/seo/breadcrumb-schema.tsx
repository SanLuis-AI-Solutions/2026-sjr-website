import { getSiteUrl } from "@/lib/site-url";

type BreadcrumbItem = {
  name: string;
  href: string;
};

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const siteUrl = getSiteUrl();
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.href}`,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement,
        }),
      }}
    />
  );
}
