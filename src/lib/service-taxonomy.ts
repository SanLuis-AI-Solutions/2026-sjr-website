export type ServicesHubGroup = {
  id: string;
  label: string;
  description: string;
  slugs: string[];
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
