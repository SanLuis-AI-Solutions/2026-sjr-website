import { BUSINESS, SERVICES } from "./constants";

type Service = (typeof SERVICES)[number] & {
  short_summary?: string;
};
type ServiceFaq = {
  question: string;
  answer: string;
};

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    name: BUSINESS.name,
    url: "https://www.susiesjewelryrepair.com/",
    image: [
      "https://www.susiesjewelryrepair.com/images/about/storefront.jpg",
      "https://www.susiesjewelryrepair.com/images/home/home-hero-ring.jpg",
    ],
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.6504877,
      longitude: -95.1863662,
    },
    hasMap: BUSINESS.googleMapsUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "51",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Lydia R." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "My engagement ring looks brand new. The team explained every step and kept it on-site.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Carlos M." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "Fast turnaround and honest pricing. I appreciated the in-house guarantee.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Jasmine K." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: "They restored my grandmother’s necklace flawlessly. The craftsmanship is unreal.",
      },
    ],
    openingHoursSpecification: (BUSINESS.hours || []).flatMap((h) => {
      const hoursStr = h.hours || "";
      if (hoursStr.toLowerCase() === "closed") return [];
      const times = hoursStr.includes("–") ? hoursStr.split("–") : hoursStr.split("-");
      const parseTime = (t: string) => {
        const cleaned = t.trim();
        if (cleaned.toLowerCase() === "closed") return null;
        const [time, period] = cleaned.split(" ");
        const [hoursRaw, minutes] = (time || "0:0").split(":").map(Number);
        let hours = hoursRaw;
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
      };

      const opens = parseTime(times[0] || "");
      const closes = times[1] ? parseTime(times[1]) : opens;

      return [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: opens || "00:00",
        closes: closes || "00:00",
      }];
    }),
    sameAs: BUSINESS.sameAs,
  };
}

export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jewelry Repair Services",
    itemListElement: (SERVICES || []).map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
      },
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you repair jewelry in-house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all repairs are performed on-site.",
        },
      },
    ],
  };
}
export function serviceSchema(service: Service | undefined) {
  if (!service) return {};
  const summary = service.summary || service.short_summary || "";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.susiesjewelryrepair.com/services/${service.slug}#service`,
    name: service.name,
    description: summary,
    provider: {
      "@type": "JewelryStore",
      name: BUSINESS.name,
    },
    areaServed: (BUSINESS.serviceAreas || []).map((area) => ({
      "@type": "City",
      name: area,
    })),
  };
}

export function serviceFaqSchema(service: (Service & { faqs?: ServiceFaq[] }) | undefined) {
  if (!service || !service.faqs) return {};
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (service.faqs || []).map((faq: ServiceFaq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
