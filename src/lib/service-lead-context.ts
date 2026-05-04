import { SERVICES } from "@/lib/constants";
import { SERVICE_AREA_PAGES } from "@/lib/service-areas";

export const SERVICES_FINDER_SOURCE = "services_finder";
export const SERVICES_FINDER_WEBSITE_SOURCE = "website:services_finder";
export const SERVICE_AREA_SOURCE = "service_area";
export const SERVICE_AREA_WEBSITE_SOURCE = "website:service_area";

type QueryLike =
  | URLSearchParams
  | { get(name: string): string | null }
  | Record<string, string | null | undefined>;

type ServiceIdentity = {
  slug: string;
  name?: string | null;
};

export type ServicesFinderLeadContext = {
  leadSourceContext: typeof SERVICES_FINDER_SOURCE | typeof SERVICE_AREA_SOURCE;
  prefillSource: typeof SERVICES_FINDER_SOURCE | typeof SERVICE_AREA_SOURCE;
  areaSlug: string | null;
  areaLabel: string | null;
  serviceSlug: string | null;
  serviceName: string | null;
  intentLabel: string | null;
  query: string | null;
  detailsSeed: string;
};

export type StoredServicesFinderLeadContext = {
  isServicesFinderLead: boolean;
  sourceLabel: string | null;
  areaSlug: string | null;
  areaLabel: string | null;
  serviceSlug: string | null;
  serviceName: string | null;
  intentLabel: string | null;
  query: string | null;
  cleanCustomerNotes: string;
  internalSummaryLines: string[];
};

type ServicesFinderLeadContextInput = {
  from?: unknown;
  area?: unknown;
  service?: unknown;
  intent?: unknown;
  query?: unknown;
};

function normalizeContextValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readQueryValue(queryLike: QueryLike, key: string): string | null {
  if ("get" in queryLike && typeof queryLike.get === "function") {
    return normalizeContextValue(queryLike.get(key));
  }

  return normalizeContextValue(
    (queryLike as Record<string, string | null | undefined>)[key],
  );
}

function buildServiceNameLookup(services?: Iterable<ServiceIdentity>) {
  const lookup = new Map(
    SERVICES.map((service) => [service.slug, service.name] as const),
  );

  if (!services) return lookup;

  for (const service of services) {
    const name = normalizeContextValue(service.name);
    if (!name) continue;
    lookup.set(service.slug, name);
  }

  return lookup;
}

function buildAreaLookup() {
  return new Map(
    SERVICE_AREA_PAGES.map((page) => [page.slug, page.city] as const),
  );
}

function buildServiceIdentityLookup(services?: Iterable<ServiceIdentity>) {
  const lookup = new Map<string, { slug: string; name: string }>();

  for (const service of SERVICES) {
    const normalizedName = service.name.trim().toLowerCase();
    lookup.set(service.slug, { slug: service.slug, name: service.name });
    lookup.set(normalizedName, { slug: service.slug, name: service.name });
  }

  if (!services) return lookup;

  for (const service of services) {
    const normalizedName = normalizeContextValue(service.name);
    if (!normalizedName) continue;
    const identity = { slug: service.slug, name: normalizedName };
    lookup.set(service.slug, identity);
    lookup.set(normalizedName.toLowerCase(), identity);
  }

  return lookup;
}

function buildDetailsSeed({
  areaLabel,
  serviceName,
  serviceSlug,
  intentLabel,
  query,
}: {
  areaLabel: string | null;
  serviceName: string | null;
  serviceSlug: string | null;
  intentLabel: string | null;
  query: string | null;
}) {
  const lines: string[] = [];
  if (areaLabel) {
    lines.push(`Customer area: ${areaLabel}`);
  }
  const resolvedService = serviceName || serviceSlug;
  if (resolvedService) {
    lines.push(`Repair focus: ${resolvedService}`);
  }
  if (intentLabel || query) {
    lines.push(`Issue: ${intentLabel || query}`);
  }
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

function normalizeServicesFinderLeadContextInput(
  input: ServicesFinderLeadContextInput,
  services?: Iterable<ServiceIdentity>,
): ServicesFinderLeadContext | null {
  const source = normalizeContextValue(input.from);
  if (source !== SERVICES_FINDER_SOURCE && source !== SERVICE_AREA_SOURCE) {
    return null;
  }

  const areaLookup = buildAreaLookup();
  const rawAreaSlug = normalizeContextValue(input.area);
  const areaSlug = rawAreaSlug && areaLookup.has(rawAreaSlug) ? rawAreaSlug : null;
  const areaLabel = areaSlug ? areaLookup.get(areaSlug) || null : null;
  const rawServiceSlug = normalizeContextValue(input.service);
  const intentLabel = normalizeContextValue(input.intent);
  const query = normalizeContextValue(input.query);

  const serviceNameLookup = buildServiceNameLookup(services);
  const serviceSlug =
    rawServiceSlug && serviceNameLookup.has(rawServiceSlug) ? rawServiceSlug : null;
  const serviceName = serviceSlug ? serviceNameLookup.get(serviceSlug) || null : null;

  if (!areaSlug && !serviceSlug && !intentLabel && !query) {
    return null;
  }

  return {
    leadSourceContext: source,
    prefillSource: source,
    areaSlug,
    areaLabel,
    serviceSlug,
    serviceName,
    intentLabel,
    query,
    detailsSeed: buildDetailsSeed({
      areaLabel,
      serviceName,
      serviceSlug,
      intentLabel,
      query,
    }),
  };
}

function stripDetailsSeed(details: string, seed: string) {
  if (!details || !seed) return details.trim();

  const variants = [seed, seed.replace(/\n/g, "\r\n")];
  for (const variant of variants) {
    if (details.startsWith(variant)) {
      return details.slice(variant.length).replace(/^\s+/, "").trim();
    }
  }

  return details.trim();
}

function parseStoredLeadContextBlock(details: string | null | undefined) {
  const normalizedDetails =
    typeof details === "string" ? details.replace(/\r\n/g, "\n").trim() : "";

  if (!normalizedDetails.startsWith("Lead context")) {
    return {
      hasStructuredContext: false,
      sourceLabel: null,
      areaLabel: null,
      serviceName: null,
      intentLabel: null,
      query: null,
      cleanCustomerNotes: normalizedDetails,
    };
  }

  const [contextBlock, ...noteBlocks] = normalizedDetails.split(/\n{2,}/);
  const lines = contextBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const originLine = lines.find((line) => line.startsWith("Origin: "));
  if (lines[0] !== "Lead context" || !originLine) {
    return {
      hasStructuredContext: false,
      sourceLabel: null,
      areaLabel: null,
      serviceName: null,
      intentLabel: null,
      query: null,
      cleanCustomerNotes: normalizedDetails,
    };
  }

  const readPrefixedLine = (prefix: string) => {
    const match = lines.find((line) => line.startsWith(prefix));
    return match ? normalizeContextValue(match.slice(prefix.length)) : null;
  };

  return {
    hasStructuredContext: true,
    sourceLabel: normalizeContextValue(originLine.slice("Origin: ".length)),
    areaLabel: readPrefixedLine("Customer area: "),
    serviceName: readPrefixedLine("Suggested service: "),
    intentLabel: readPrefixedLine("Intent: "),
    query: readPrefixedLine("Search phrase: "),
    cleanCustomerNotes: noteBlocks.join("\n\n").trim(),
  };
}

function buildStoredLeadInternalSummaryLines(input: {
  sourceLabel: string | null;
  areaLabel: string | null;
  serviceName: string | null;
  serviceSlug: string | null;
  intentLabel: string | null;
  query: string | null;
}) {
  const lines: string[] = [];

  if (input.sourceLabel) {
    lines.push(`Lead source: ${input.sourceLabel}`);
  }
  if (input.areaLabel) {
    lines.push(`Customer area: ${input.areaLabel}`);
  }
  if (input.serviceName || input.serviceSlug) {
    lines.push(`Suggested service: ${input.serviceName || input.serviceSlug}`);
  }
  if (input.intentLabel) {
    lines.push(`Intent: ${input.intentLabel}`);
  }
  if (input.query) {
    lines.push(`Search phrase: ${input.query}`);
  }

  return lines;
}

export function resolveStoredServicesFinderLeadContext(
  input: {
    source?: string | null;
    details?: string | null;
  },
  services?: Iterable<ServiceIdentity>,
): StoredServicesFinderLeadContext {
  const source = normalizeContextValue(input.source);
  const parsedDetails = parseStoredLeadContextBlock(input.details);
  const isServicesFinderLead =
    source === SERVICES_FINDER_WEBSITE_SOURCE ||
    source === SERVICE_AREA_WEBSITE_SOURCE ||
    source === SERVICES_FINDER_SOURCE ||
    parsedDetails.hasStructuredContext;

  if (!isServicesFinderLead) {
    return {
      isServicesFinderLead: false,
      sourceLabel: null,
      areaSlug: null,
      areaLabel: null,
      serviceSlug: null,
      serviceName: null,
      intentLabel: null,
      query: null,
      cleanCustomerNotes: parsedDetails.cleanCustomerNotes,
      internalSummaryLines: [],
    };
  }

  const serviceIdentityLookup = buildServiceIdentityLookup(services);
  const resolvedService =
    (parsedDetails.serviceName &&
      serviceIdentityLookup.get(parsedDetails.serviceName.toLowerCase())) ||
    (parsedDetails.serviceName &&
      serviceIdentityLookup.get(parsedDetails.serviceName)) ||
    null;

  const normalizedSourceLabel = parsedDetails.sourceLabel?.toLowerCase() || "";
  const sourceLabel =
    source === SERVICE_AREA_WEBSITE_SOURCE || normalizedSourceLabel === "service area page"
      ? "Service area page"
      : "Services finder";
  const areaLabel = parsedDetails.areaLabel;
  const areaSlug =
    areaLabel
      ? SERVICE_AREA_PAGES.find((page) => page.city.toLowerCase() === areaLabel.toLowerCase())?.slug ||
        null
      : null;
  const serviceSlug = resolvedService?.slug || null;
  const serviceName = resolvedService?.name || parsedDetails.serviceName;
  const intentLabel = parsedDetails.intentLabel;
  const query = parsedDetails.query;

  return {
    isServicesFinderLead: true,
    sourceLabel,
    areaSlug,
    areaLabel,
    serviceSlug,
    serviceName,
    intentLabel,
    query,
    cleanCustomerNotes: parsedDetails.cleanCustomerNotes,
    internalSummaryLines: buildStoredLeadInternalSummaryLines({
      sourceLabel,
      areaLabel,
      serviceSlug,
      serviceName,
      intentLabel,
      query,
    }),
  };
}

export function resolveServicesFinderLeadContext(
  queryLike: QueryLike | ServicesFinderLeadContextInput,
  services?: Iterable<ServiceIdentity>,
): ServicesFinderLeadContext | null {
  const input =
    "get" in queryLike || queryLike instanceof URLSearchParams
      ? {
          from: readQueryValue(queryLike, "from"),
          area: readQueryValue(queryLike, "area"),
          service: readQueryValue(queryLike, "service"),
          intent: readQueryValue(queryLike, "intent"),
          query: readQueryValue(queryLike, "query"),
        }
      : queryLike;

  return normalizeServicesFinderLeadContextInput(input, services);
}

export function resolveServicesFinderLeadContextFromFormData(
  formData: FormData,
  services?: Iterable<ServiceIdentity>,
) {
  return normalizeServicesFinderLeadContextInput(
    {
      from: formData.get("lead_source_context"),
      area: formData.get("area_slug"),
      service: formData.get("service_slug"),
      intent: formData.get("intent_label"),
      query: formData.get("intent_query"),
    },
    services,
  );
}

export function buildServicesFinderLeadContextHref(
  pathname: string,
  input: {
    areaSlug?: string | null;
    serviceSlug?: string | null;
    intentLabel?: string | null;
    query?: string | null;
  },
) {
  const source =
    normalizeContextValue(input.areaSlug) && !normalizeContextValue(input.serviceSlug) && !normalizeContextValue(input.intentLabel) && !normalizeContextValue(input.query)
      ? SERVICE_AREA_SOURCE
      : SERVICES_FINDER_SOURCE;
  const params = new URLSearchParams({ from: source });
  const areaSlug = normalizeContextValue(input.areaSlug);
  const serviceSlug = normalizeContextValue(input.serviceSlug);
  const intentLabel = normalizeContextValue(input.intentLabel);
  const query = normalizeContextValue(input.query);

  if (areaSlug) params.set("area", areaSlug);
  if (serviceSlug) params.set("service", serviceSlug);
  if (intentLabel) params.set("intent", intentLabel);
  if (query) params.set("query", query);

  return `${pathname}?${params.toString()}`;
}

export function appendServicesFinderLeadContextToUrl(
  url: URL,
  context: ServicesFinderLeadContext | null,
) {
  if (!context) return url;

  url.searchParams.set("from", context.leadSourceContext);
  if (context.areaSlug) {
    url.searchParams.set("area", context.areaSlug);
  }
  if (context.serviceSlug) {
    url.searchParams.set("service", context.serviceSlug);
  }
  if (context.intentLabel) {
    url.searchParams.set("intent", context.intentLabel);
  }
  if (context.query) {
    url.searchParams.set("query", context.query);
  }
  return url;
}

export function getServicesFinderHiddenFields(context: ServicesFinderLeadContext | null) {
  if (!context) return null;

  return {
    lead_source_context: context.leadSourceContext,
    area_slug: context.areaSlug || "",
    service_slug: context.serviceSlug || "",
    intent_label: context.intentLabel || "",
    intent_query: context.query || "",
  };
}

export function getServicesFinderAnalyticsParams(context: ServicesFinderLeadContext | null) {
  if (!context) return {};

  return {
    prefill_source: context.prefillSource,
    area_slug: context.areaSlug || "",
    service_slug: context.serviceSlug || "",
    finder_intent: context.intentLabel || "",
    finder_query: context.query || "",
  };
}

export function prependServicesFinderLeadContext(
  details: string,
  context: ServicesFinderLeadContext | null,
) {
  const normalizedDetails = typeof details === "string" ? details : "";
  if (!context) return normalizedDetails.trim();

  const userDetails = stripDetailsSeed(normalizedDetails, context.detailsSeed);
  const originLabel =
    context.leadSourceContext === SERVICE_AREA_SOURCE ? "Service area page" : "Services finder";
  const lines = ["Lead context", `Origin: ${originLabel}`];

  if (context.areaLabel) {
    lines.push(`Customer area: ${context.areaLabel}`);
  }
  if (context.serviceName || context.serviceSlug) {
    lines.push(`Suggested service: ${context.serviceName || context.serviceSlug}`);
  }
  if (context.intentLabel) {
    lines.push(`Intent: ${context.intentLabel}`);
  }
  if (context.query) {
    lines.push(`Search phrase: ${context.query}`);
  }

  return userDetails ? `${lines.join("\n")}\n\n${userDetails}` : lines.join("\n");
}
