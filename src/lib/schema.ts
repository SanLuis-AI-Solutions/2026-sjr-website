import { BUSINESS, SERVICES } from "./constants";
import { SITE_LAST_MODIFIED_ISO } from "./content-freshness";
import { FAQS } from "./faq";
import { SERVICE_AREA_PAGES } from "./service-areas";

type Service = (typeof SERVICES)[number] & {
  short_summary?: string;
};
type ServiceFaq = {
  question: string;
  answer: string;
};

const BUSINESS_DESCRIPTION =
  "Book in-house jewelry and watch service in Pasadena, TX for batteries, ring sizing, chain work, stone tightening, cleanings, and fast local turnaround.";

export function localBusinessSchema() {
  const areaServed = Array.from(
    new Set([BUSINESS.address.city, ...SERVICE_AREA_PAGES.map((page) => page.city)]),
  ).map((area) => ({
    "@type": "City",
    name: area,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    name: BUSINESS.name,
    alternateName: "Susie's Jewelry and Watch Repair",
    url: "https://www.susiesjewelryrepair.com/",
    description: BUSINESS_DESCRIPTION,
    image: [
      "https://www.susiesjewelryrepair.com/images/about/storefront.jpg",
      "https://www.susiesjewelryrepair.com/images/home/home-hero-ring.jpg",
    ],
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    foundingDate: "1984",
    priceRange: "$$",
    knowsAbout: SERVICES.map((service) => service.name),
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
    dateModified: SITE_LAST_MODIFIED_ISO,
    areaServed,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      contactType: "customer service",
      areaServed: "US-TX",
      availableLanguage: "en",
    },
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
    name: "Jewelry and Watch Services",
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

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.susiesjewelryrepair.com/#website",
    name: BUSINESS.name,
    url: "https://www.susiesjewelryrepair.com/",
    description: BUSINESS_DESCRIPTION,
    publisher: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: "https://www.susiesjewelryrepair.com/book",
      name: "Book a jewelry or watch repair",
    },
  };
}

export function homePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.susiesjewelryrepair.com/#homepage",
    name: "Book Jewelry Service Pasadena TX | Watch and Ring Service",
    url: "https://www.susiesjewelryrepair.com/",
    description: BUSINESS_DESCRIPTION,
    isPartOf: {
      "@id": "https://www.susiesjewelryrepair.com/#website",
    },
    about: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://www.susiesjewelryrepair.com/images/home/home-hero-ring-mobile.avif",
    },
    dateModified: SITE_LAST_MODIFIED_ISO,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "main p"],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.susiesjewelryrepair.com/#organization",
    name: BUSINESS.name,
    alternateName: "Susie's Jewelry and Watch Repair",
    url: "https://www.susiesjewelryrepair.com/",
    description: BUSINESS_DESCRIPTION,
    logo: "https://www.susiesjewelryrepair.com/images/brand/susies-logo-full-burgundy.png",
    image: "https://www.susiesjewelryrepair.com/images/brand/susies-logo-full-burgundy.png",
    dateModified: SITE_LAST_MODIFIED_ISO,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    foundingDate: "1984",
    areaServed: BUSINESS.serviceAreas,
    knowsAbout: SERVICES.map((service) => service.name),
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      contactType: "customer service",
      areaServed: "US-TX",
      availableLanguage: "en",
    },
    sameAs: BUSINESS.sameAs,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.filter((item) => item.pinned).slice(0, 3).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://www.susiesjewelryrepair.com/about#about",
    name: "About Susie’s Jewelry Repair",
    url: "https://www.susiesjewelryrepair.com/about",
    description:
      "About the family-run, in-house Pasadena jewelry and watch workshop behind Susie’s Jewelry Repair.",
    isPartOf: {
      "@id": "https://www.susiesjewelryrepair.com/#website",
    },
    about: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    mainEntity: {
      "@id": "https://www.susiesjewelryrepair.com/#organization",
    },
    dateModified: SITE_LAST_MODIFIED_ISO,
  };
}
export function serviceSchema(service: Service | undefined) {
  if (!service) return {};
  const areaServed = Array.from(
    new Set([BUSINESS.address.city, ...SERVICE_AREA_PAGES.map((page) => page.city)]),
  ).map((area) => ({
    "@type": "City",
    name: area,
  }));
  const summary = service.summary || service.short_summary || "";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.susiesjewelryrepair.com/services/${service.slug}#service`,
    name: service.name,
    description: summary,
    dateModified: SITE_LAST_MODIFIED_ISO,
    provider: {
      "@id": "https://www.susiesjewelryrepair.com/#localbusiness",
    },
    areaServed,
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
