import { BUSINESS, SERVICES } from "@/lib/constants";
import { SITE_LAST_MODIFIED_ISO } from "@/lib/content-freshness";
import { FAQS } from "@/lib/faq";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";
import { getSiteUrl } from "@/lib/site-url";

const AI_SITE_DESCRIPTION =
  "Book in-house jewelry and watch service in Pasadena, TX for batteries, ring sizing, chain work, stone tightening, cleanings, and fast local turnaround.";

function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path}`;
}

function serviceMarkdown(service: (typeof SERVICES)[number]) {
  const lines = [
    `# ${service.name}`,
    "",
    service.summary,
    "",
    `URL: ${absoluteUrl(`/services/${service.slug}`)}`,
    `Primary action: Book a Repair -> ${absoluteUrl(`/book?service=${service.slug}`)}`,
    service.time_estimate ? `Turnaround: ${service.time_estimate}` : null,
    "",
    "## Common Requests",
    "",
    ...(service.commonRequests || []).map((item) => `- ${item}`),
  ].filter(Boolean);

  if (service.includes?.length) {
    lines.push("", "## Includes", "", ...service.includes.map((item) => `- ${item}`));
  }

  if (service.faqs?.length) {
    lines.push("", "## FAQ", "");
    service.faqs.forEach((faq) => {
      lines.push(`### ${faq.question}`, "", faq.answer, "");
    });
  }

  return `${lines.join("\n")}\n`;
}

function serviceAreaMarkdown(slug: string) {
  const page = SERVICE_AREA_PAGES.find((entry) => entry.slug === slug);
  if (!page) return null;

  return [
    `# ${page.city} Jewelry and Watch Service`,
    "",
    page.intro,
    "",
    `URL: ${absoluteUrl(`/services/${page.slug}`)}`,
    `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
    "",
    "## Trust Points",
    "",
    ...page.trustPoints.map((item) => `- ${item}`),
    "",
    "## Common Local Needs",
    "",
    ...page.commonRepairsBody,
    "",
  ].join("\n");
}

export function getAiSummary() {
  const baseUrl = getSiteUrl();
  const bookingUrl = `${baseUrl}/book`;
  const servicesUrl = `${baseUrl}/services`;
  const faqUrl = `${baseUrl}/faq`;
  const summaryUrl = `${baseUrl}/ai/summary.json`;
  const serviceCatalogUrl = `${baseUrl}/ai/service.json`;
  const faqCatalogUrl = `${baseUrl}/ai/faq.json`;
  const siteGuideUrl = `${baseUrl}/ai/site-guide`;
  const aiTxtUrl = `${baseUrl}/.well-known/ai.txt`;

  return {
    name: BUSINESS.name,
    description: AI_SITE_DESCRIPTION,
    lastUpdated: SITE_LAST_MODIFIED_ISO,
    summary:
      "Susie’s Jewelry Repair is a Pasadena, Texas jewelry and watch shop focused on booking in-house service for rings, watches, chains, bracelets, necklaces, stones, pearls, heirlooms, and custom jewelry.",
    site: {
      name: BUSINESS.name,
      url: baseUrl,
      description: AI_SITE_DESCRIPTION,
      primaryAction: {
        type: "book_repair",
        label: "Book a Repair",
        url: bookingUrl,
      },
    },
    business: {
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      address: {
        street: BUSINESS.address.street,
        city: BUSINESS.address.city,
        region: BUSINESS.address.state,
        postalCode: BUSINESS.address.zip,
        country: "US",
      },
      serviceAreas: BUSINESS.serviceAreas,
      sameAs: BUSINESS.sameAs,
    },
    discovery: {
      aiTxtUrl,
      summaryUrl,
      serviceCatalogUrl,
      faqCatalogUrl,
      siteGuideUrl,
      bookingUrl,
      servicesUrl,
      faqUrl,
    },
    actions: [
      {
        type: "book_repair",
        label: "Book a Repair",
        url: bookingUrl,
      },
      {
        type: "call_shop",
        label: "Call the Shop",
        url: `tel:${BUSINESS.phone}`,
      },
    ],
    keyPages: [
      { title: "Book a Repair", url: bookingUrl },
      { title: "Repair Services", url: servicesUrl },
      { title: "FAQ", url: faqUrl },
      { title: "Contact", url: `${baseUrl}/contact` },
      { title: "About", url: `${baseUrl}/about` },
    ],
  };
}

export function getAiFaq() {
  const baseUrl = getSiteUrl();

  return {
    lastUpdated: SITE_LAST_MODIFIED_ISO,
    site: BUSINESS.name,
    url: `${baseUrl}/faq`,
    primaryActionUrl: `${baseUrl}/book`,
    faqs: FAQS.map((item) => ({
      id: item.id,
      question: item.q,
      answer: item.a,
      category: item.category,
      links: item.links?.map((link) => ({
        label: link.label,
        url: `${baseUrl}${link.href}`,
      })) || [],
    })),
  };
}

export function getAiServiceCatalog() {
  const baseUrl = getSiteUrl();
  const bookingUrl = `${baseUrl}/book`;
  const capabilities = SERVICES.map((service) => service.name);

  return {
    name: BUSINESS.name,
    description:
      "In-house jewelry and watch service capabilities in Pasadena, Texas with booking-first intake.",
    lastUpdated: SITE_LAST_MODIFIED_ISO,
    site: BUSINESS.name,
    summary:
      "Service catalog for in-house jewelry and watch work in Pasadena, Texas. Bookings are preferred over quote-first flows.",
    capabilities,
    primaryAction: {
      type: "book_repair",
      url: bookingUrl,
    },
    serviceCatalogUrl: `${baseUrl}/ai/service.json`,
    services: SERVICES.map((service) => ({
      slug: service.slug,
      name: service.name,
      url: `${baseUrl}/services/${service.slug}`,
      summary: service.summary,
      turnaround: service.time_estimate,
      commonRequests: service.commonRequests,
      primaryActionUrl: `${bookingUrl}?service=${service.slug}`,
    })),
  };
}

export function getAiTxt() {
  const baseUrl = getSiteUrl();
  const lines = [
    `site: ${BUSINESS.name}`,
    `url: ${baseUrl}`,
    `summary: Pasadena, Texas in-house jewelry and watch service with booking-first intake.`,
    "purpose: Book in-house jewelry and watch repairs in Pasadena, Texas.",
    `primary_action: Book a Repair -> ${baseUrl}/book`,
    `services: ${baseUrl}/services`,
    `faq: ${baseUrl}/faq`,
    `contact: ${baseUrl}/contact`,
    `ai_summary: ${baseUrl}/ai/summary.json`,
    `service_catalog: ${baseUrl}/ai/service.json`,
    `faq_catalog: ${baseUrl}/ai/faq.json`,
    `site_guide: ${baseUrl}/ai/site-guide`,
    `phone: ${BUSINESS.phone}`,
    "ai_crawlers: public marketing content may be crawled for discovery and citation.",
    "preferred_paths: /book, /services, /faq, /about, /contact, /llms.txt",
  ];

  return `${lines.join("\n")}\n`;
}

export function getAiSiteGuideMarkdown() {
  const lines = [
    `# ${BUSINESS.name}`,
    "",
    AI_SITE_DESCRIPTION,
    "",
    `Last updated: ${SITE_LAST_MODIFIED_ISO}`,
    `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
    `Services: ${absoluteUrl("/services")}`,
    `FAQ: ${absoluteUrl("/faq")}`,
    `Contact: ${absoluteUrl("/contact")}`,
    "",
    "## Business Details",
    "",
    `- Phone: ${BUSINESS.phone}`,
    `- Email: ${BUSINESS.email}`,
    `- Address: ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
    `- Service areas: ${BUSINESS.serviceAreas.join(", ")}`,
    "",
    "## Core Services",
    "",
    ...SERVICES.map(
      (service) =>
        `- [${service.name}](${absoluteUrl(`/services/${service.slug}`)}): ${service.summary}`
    ),
    "",
    "## Key Questions",
    "",
    ...FAQS.slice(0, 5).flatMap((faq) => [`### ${faq.q}`, "", faq.a, ""]),
  ];

  return `${lines.join("\n")}\n`;
}

export function renderMarkdownForPath(pathname: string) {
  if (pathname === "/") {
    return [
      `# ${BUSINESS.name}`,
      "",
      AI_SITE_DESCRIPTION,
      "",
      `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
      "",
      "## What We Handle",
      "",
      "- Watch batteries and watch service",
      "- Ring sizing and fit adjustments",
      "- Chain, necklace, and bracelet work",
      "- Stone tightening and setting work",
      "- Pearl restringing and heirloom restoration",
      "",
      "## Why Customers Choose This Shop",
      "",
      "- In-house work handled on-site",
      "- Same Day/Next Day service on many standard jobs",
      "- Clear approvals before bench work begins",
      "",
      "## Next Steps",
      "",
      `- Book a Repair: ${absoluteUrl("/book")}`,
      `- View Services: ${absoluteUrl("/services")}`,
      `- Contact the Shop: ${absoluteUrl("/contact")}`,
      "",
    ].join("\n");
  }

  if (pathname === "/services") {
    return [
      "# Jewelry and Watch Services",
      "",
      AI_SITE_DESCRIPTION,
      "",
      `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
      "",
      ...SERVICES.flatMap((service) => [
        `## ${service.name}`,
        "",
        service.summary,
        "",
        `- URL: ${absoluteUrl(`/services/${service.slug}`)}`,
        service.time_estimate ? `- Turnaround: ${service.time_estimate}` : null,
        "",
      ]).filter(Boolean as unknown as (value: string | null) => value is string),
    ].join("\n");
  }

  if (pathname === "/faq") {
    return [
      `# ${BUSINESS.name} FAQ`,
      "",
      `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
      "",
      ...FAQS.flatMap((faq) => [`## ${faq.q}`, "", faq.a, ""]),
    ].join("\n");
  }

  if (pathname === "/book") {
    return [
      "# Book a Repair Appointment",
      "",
      "Request a free 15-minute assessment with the in-house Pasadena team.",
      "",
      "## Booking Fields",
      "",
      "- Full name",
      "- Email",
      "- Phone (optional)",
      "- Preferred date",
      "- Preferred time",
      "- Details (optional)",
      "",
      `Submit URL: ${absoluteUrl("/api/book")}`,
      `Public booking page: ${absoluteUrl("/book")}`,
      "",
    ].join("\n");
  }

  if (pathname === "/contact") {
    return [
      "# Contact the Shop",
      "",
      `Phone: ${BUSINESS.phone}`,
      `Email: ${BUSINESS.email}`,
      `Address: ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
      "",
      "## Contact Fields",
      "",
      "- Name",
      "- Email",
      "- Phone (optional)",
      "- Preferred contact method",
      "- Message",
      "",
      `Submit URL: ${absoluteUrl("/api/contact")}`,
      "",
    ].join("\n");
  }

  if (pathname === "/about") {
    return [
      `# About ${BUSINESS.name}`,
      "",
      "Family craftsmanship, refined over four decades.",
      "",
      "- Founded: 1984",
      "- In-house bench team",
      "- Pasadena, Texas storefront",
      "- Clear approvals before work begins",
      "",
      `Primary action: Book a Repair -> ${absoluteUrl("/book")}`,
      "",
    ].join("\n");
  }

  if (pathname.startsWith("/services/")) {
    const slug = pathname.replace("/services/", "");
    const service = SERVICES.find((entry) => entry.slug === slug);
    if (service) return serviceMarkdown(service);
    return serviceAreaMarkdown(slug);
  }

  return null;
}
