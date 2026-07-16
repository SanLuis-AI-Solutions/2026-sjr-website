export type ServicesHubGroup = {
  id: string;
  label: string;
  description: string;
  slugs: string[];
};

export type ServicesHubFinderChip = {
  id: string;
  label: string;
  serviceSlugs: string[];
  searchTerms: string[];
};

export type ServicesHubFinderEntry = {
  slug: string;
  searchText: string;
  groupIds: string[];
  groupLabels: string[];
};

type ServicesHubFinderSourceService = {
  slug: string;
  name: string;
  summary?: string;
  short_summary?: string;
  commonRequests?: string[];
};

const SERVICES_HUB_GROUPS: ServicesHubGroup[] = [
  {
    id: "watches",
    label: "Watch Services",
    description:
      "Battery, water resistance checks, crystal and stem repair, and full service.",
    slugs: ["watch-repair"],
  },
  {
    id: "rings",
    label: "Rings",
    description:
      "Sizing, stone security, and setting integrity for daily wear and heirlooms.",
    slugs: ["ring-sizing", "stone-setting"],
  },
  {
    id: "chains",
    label: "Chains & Bracelets",
    description:
      "Clasp upgrades, broken links, and delicate chain repair with clean finishing.",
    slugs: ["necklace-repair", "bracelet-repair"],
  },
  {
    id: "care",
    label: "Care & Restoration",
    description: "Refresh, polish, and restore pieces you want to wear for decades.",
    slugs: ["jewelry-cleaning", "pearl-restringing", "heirloom-restoration"],
  },
  {
    id: "custom",
    label: "Custom & Remounting",
    description:
      "Handmade work, stone remounts, and custom builds with a guided process.",
    slugs: ["custom-design"],
  },
];

const SERVICES_HUB_PRIORITY_SERVICE_SLUGS = [
  "watch-repair",
  "ring-sizing",
  "heirloom-restoration",
] as const;

const SERVICE_AREA_HIGHLIGHTED_SERVICE_SLUGS = [
  "watch-repair",
  "ring-sizing",
  "stone-setting",
  "heirloom-restoration",
] as const;

const SERVICES_HUB_FINDER_CHIPS: ServicesHubFinderChip[] = [
  {
    id: "watch-stopped",
    label: "Watch stopped",
    serviceSlugs: ["watch-repair"],
    searchTerms: ["watch stopped", "watch battery", "battery replacement", "watch not working"],
  },
  {
    id: "ring-fit",
    label: "Ring too loose or tight",
    serviceSlugs: ["ring-sizing", "stone-setting"],
    searchTerms: ["ring too loose", "ring too tight", "ring sizing", "resize ring"],
  },
  {
    id: "stone-security",
    label: "Loose or missing stone",
    serviceSlugs: ["stone-setting", "heirloom-restoration"],
    searchTerms: ["loose stone", "missing stone", "diamond fell out", "stone reset"],
  },
  {
    id: "broken-chain",
    label: "Broken necklace or chain",
    serviceSlugs: ["necklace-repair"],
    searchTerms: ["broken chain", "broken necklace", "chain repair", "necklace clasp"],
  },
  {
    id: "broken-bracelet",
    label: "Broken bracelet or clasp",
    serviceSlugs: ["bracelet-repair"],
    searchTerms: ["broken bracelet", "bracelet clasp", "broken link", "clasp repair"],
  },
  {
    id: "needs-cleaning",
    label: "Jewelry needs cleaning",
    serviceSlugs: ["jewelry-cleaning"],
    searchTerms: ["jewelry cleaning", "polish jewelry", "clean ring", "tarnish removal"],
  },
  {
    id: "pearl-restringing",
    label: "Pearls need restringing",
    serviceSlugs: ["pearl-restringing"],
    searchTerms: ["pearls restringing", "pearl restringing", "broken pearl strand", "stretched pearls"],
  },
  {
    id: "redesign-heirloom",
    label: "Redesign or heirloom help",
    serviceSlugs: ["custom-design", "heirloom-restoration"],
    searchTerms: ["redesign jewelry", "heirloom repair", "custom design", "reset heirloom stones"],
  },
] as const;

function normalizeFinderText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getServicesHubGroups(): ServicesHubGroup[] {
  return SERVICES_HUB_GROUPS.map((group) => ({
    ...group,
    slugs: [...group.slugs],
  }));
}

export function getServicesHubPriorityServiceSlugs(count = 3): string[] {
  return [...SERVICES_HUB_PRIORITY_SERVICE_SLUGS].slice(0, count);
}

export function getServiceAreaHighlightedServiceSlugs(count = 4): string[] {
  return [...SERVICE_AREA_HIGHLIGHTED_SERVICE_SLUGS].slice(0, count);
}

export function getServicesHubFinderChips(): ServicesHubFinderChip[] {
  return SERVICES_HUB_FINDER_CHIPS.map((chip) => ({
    ...chip,
    serviceSlugs: [...chip.serviceSlugs],
    searchTerms: [...chip.searchTerms],
  }));
}

export function buildServicesHubFinderEntries(
  services: ServicesHubFinderSourceService[],
): ServicesHubFinderEntry[] {
  const groups = getServicesHubGroups();
  const groupsByServiceSlug = new Map<string, { groupIds: string[]; groupLabels: string[] }>();
  const chipTermsByServiceSlug = new Map<string, string[]>();

  for (const group of groups) {
    for (const slug of group.slugs) {
      const current = groupsByServiceSlug.get(slug) ?? { groupIds: [], groupLabels: [] };
      current.groupIds.push(group.id);
      current.groupLabels.push(group.label);
      groupsByServiceSlug.set(slug, current);
    }
  }

  for (const chip of SERVICES_HUB_FINDER_CHIPS) {
    for (const slug of chip.serviceSlugs) {
      const current = chipTermsByServiceSlug.get(slug) ?? [];
      current.push(...chip.searchTerms);
      chipTermsByServiceSlug.set(slug, current);
    }
  }

  return services.map((service) => {
    const groupMeta = groupsByServiceSlug.get(service.slug) ?? {
      groupIds: [],
      groupLabels: [],
    };
    const searchText = normalizeFinderText(
      [
        service.slug,
        service.name,
        service.summary,
        service.short_summary,
        ...(service.commonRequests ?? []),
        ...groupMeta.groupLabels,
        ...(chipTermsByServiceSlug.get(service.slug) ?? []),
      ]
        .filter(Boolean)
        .join(" "),
    );

    return {
      slug: service.slug,
      searchText,
      groupIds: [...groupMeta.groupIds],
      groupLabels: [...groupMeta.groupLabels],
    };
  });
}
