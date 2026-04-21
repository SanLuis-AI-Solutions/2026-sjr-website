import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.susiesjewelryrepair.com";
const GENERATED_AT = "2026-04-21";

const OBSERVED_ON = "2026-04-21";

const OBSERVED_STATUSES = {
  "/": { status: "indexed" },
  "/about": { status: "indexed" },
  "/blog": { status: "indexed" },
  "/book": { status: "indexed" },
  "/contact": { status: "indexed" },
  "/faq": { status: "indexed" },
  "/privacy": { status: "indexed" },
  "/quote": { status: "indexed" },
  "/services": { status: "indexed" },
  "/terms": { status: "indexed" },
  "/services/bracelet-repair": { status: "indexed" },
  "/services/custom-design": { status: "indexed" },
  "/services/deer-park": { status: "indexed" },
  "/services/heirloom-restoration": { status: "indexed" },
  "/services/jewelry-cleaning": { status: "indexed" },
  "/services/necklace-repair": { status: "indexed" },
  "/services/ring-sizing": { status: "indexed" },
  "/services/stone-setting": { status: "indexed" },
  "/services/watch-repair": { status: "indexed" },
  "/blog/can-a-severely-bent-ring-prong-be-fixed": { status: "indexed" },
  "/blog/cost-to-resize-gold-ring-pasadena": {
    status: "indexed",
    note: "Strongest confirmed indexed commercial blog sample.",
  },
  "/blog/custom-design-timeline-guide": { status: "indexed" },
  "/blog/heirloom-jewelry-restoration-repair-or-redesign": { status: "indexed" },
  "/blog/ring-sizing-guide": { status: "indexed" },
  "/blog/watch-battery-replacement": { status: "indexed" },
  "/services/clear-lake": { status: "discovered-currently-not-indexed" },
  "/services/friendswood": { status: "discovered-currently-not-indexed" },
  "/services/pearl-restringing": { status: "discovered-currently-not-indexed" },
  "/services/webster": { status: "discovered-currently-not-indexed" },
  "/blog/chain-repair-weak-points": { status: "discovered-currently-not-indexed" },
  "/blog/does-my-watch-need-battery-or-repair-pasadena": {
    status: "discovered-currently-not-indexed",
    note: "Commercial blog sample still waiting on index selection.",
  },
  "/blog/heirloom-restoration-planning-guide": { status: "discovered-currently-not-indexed" },
  "/blog/how-much-does-pearl-restringing-cost-pasadena": {
    status: "discovered-currently-not-indexed",
  },
  "/blog/how-to-choose-a-jeweler": { status: "discovered-currently-not-indexed" },
  "/blog/professional-cleaning-vs-home-care": { status: "discovered-currently-not-indexed" },
  "/blog/safe-to-clean-vintage-diamond-ring-at-home": {
    status: "discovered-currently-not-indexed",
  },
  "/blog/where-to-get-watch-battery-replaced-pasadena": {
    status: "discovered-currently-not-indexed",
  },
  "/services/la-porte": { status: "unknown-to-google" },
  "/services/pasadena": { status: "unknown-to-google" },
  "/blog/pearl-restringing-timing-guide": { status: "unknown-to-google" },
  "/blog/stone-security-checklist": { status: "unknown-to-google" },
};

function readFile(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

function ensureUniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractBlogPosts() {
  const source = readFile("src/lib/blog.ts");
  const matches = source.matchAll(
    /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"[\s\S]*?reviewedAt:\s*"([^"]+)"/g
  );

  return ensureUniqueBy(
    [...matches].map((match) => ({
      category: "blog",
      slug: match[1],
      label: match[2],
      publishedAt: match[3],
      reviewedAt: match[4],
      path: `/blog/${match[1]}`,
    })),
    (item) => item.path
  );
}

function extractServiceAreas() {
  const source = readFile("src/lib/service-areas.ts");
  const matches = source.matchAll(/slug:\s*"([^"]+)",[\s\S]*?city:\s*"([^"]+)"/g);

  return ensureUniqueBy(
    [...matches].map((match) => ({
      category: "service-area",
      slug: match[1],
      label: `${match[2]} service area`,
      city: match[2],
      path: `/services/${match[1]}`,
    })),
    (item) => item.path
  );
}

function extractServiceDetails() {
  const source = readFile("src/lib/constants.ts");
  const matches = source.matchAll(/slug:\s*"([^"]+)",[\s\S]*?name:\s*"([^"]+)"/g);

  return ensureUniqueBy(
    [...matches].map((match) => ({
      category: "service-detail",
      slug: match[1],
      label: match[2],
      path: `/services/${match[1]}`,
    })),
    (item) => item.path
  );
}

function extractStaticRoutes() {
  const source = readFile("src/app/sitemap.ts");
  const matches = source.matchAll(/{ url:\s*`\$\{baseUrl\}([^`]+)`/g);

  const routeLabels = {
    "/": "Homepage",
    "/services": "Services hub",
    "/about": "About",
    "/faq": "FAQ",
    "/quote": "Quote",
    "/book": "Book",
    "/contact": "Contact",
    "/privacy": "Privacy",
    "/terms": "Terms",
    "/blog": "Blog hub",
  };

  return ensureUniqueBy(
    [...matches].map((match) => ({
      category: "static",
      path: match[1],
      label: routeLabels[match[1]] || match[1],
    })),
    (item) => item.path
  );
}

function applyObservedState(route) {
  const observed = OBSERVED_STATUSES[route.path];
  const status = observed?.status || "pending-gsc-inspection";
  const nextAction =
    status === "indexed" ? "monitor" : observed ? "request-indexing-and-recheck" : "inspect-and-request-indexing";
  const note =
    observed?.note ||
    (observed
      ? "GSC inspection run on 2026-04-21 and request indexing was submitted from the inspection flow."
      : "Canonical URL from codebase; inspect in GSC and request indexing if not already indexed.");

  return {
    ...route,
    url: `${BASE_URL}${route.path}`,
    observedStatus: status,
    observedOn: observed ? OBSERVED_ON : null,
    nextAction,
    note,
  };
}

function toStatusLabel(status) {
  return {
    indexed: "Indexed",
    "discovered-currently-not-indexed": "Discovered - currently not indexed",
    "unknown-to-google": "URL is unknown to Google",
    "pending-gsc-inspection": "Pending GSC inspection",
  }[status] || status;
}

function toActionLabel(action) {
  return {
    monitor: "Monitor only",
    "request-indexing-and-recheck": "Request indexing and recheck on 2026-04-26/27",
    "inspect-and-request-indexing": "Inspect in GSC and request indexing",
  }[action] || action;
}

function sortRoutes(a, b) {
  const categoryOrder = {
    static: 0,
    "service-detail": 1,
    "service-area": 2,
    blog: 3,
  };

  const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
  if (categoryDiff !== 0) return categoryDiff;
  return a.path.localeCompare(b.path);
}

function summarizeBy(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const key = selector(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function buildMarkdown(manifest) {
  const unresolvedRows = manifest.routes.filter(
    (route) =>
      route.observedStatus !== "indexed" &&
      !(route.category === "static" && route.observedStatus === "pending-gsc-inspection")
  );
  const pendingRows = manifest.routes.filter((route) => route.observedStatus === "pending-gsc-inspection");

  const lines = [
    "# Indexing Manifest",
    "",
    `Generated on ${manifest.generatedAt} from canonical repo sources.`,
    "",
    "## Sources",
    "",
    ...manifest.sources.map((source) => `- \`${source}\``),
    "",
    "## Inventory Summary",
    "",
    `- Total canonical URLs in manifest: ${manifest.routes.length}`,
    ...manifest.countsByCategory.map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Observed GSC Status Summary",
    "",
    ...manifest.countsByObservedStatus.map(
      ([key, count]) => `- ${toStatusLabel(key)}: ${count}`
    ),
    "",
    "## Immediate GSC Queue",
    "",
    "These URLs should be prioritized for indexing requests or follow-up rechecks based on the April 21 baseline.",
    "",
    "| URL | Category | Current Status | Next Action | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...unresolvedRows.map(
      (route) =>
        `| \`${route.path}\` | ${route.category} | ${toStatusLabel(route.observedStatus)} | ${toActionLabel(route.nextAction)} | ${route.note} |`
    ),
    "",
    "## Remaining Canonical URLs Pending First Inspection",
    "",
    pendingRows.length === 0
      ? "- None."
      : `- Count: ${pendingRows.length}`,
    ...(pendingRows.length === 0
      ? []
      : [
          "",
          "| URL | Category | Label | Recommended Action |",
          "| --- | --- | --- | --- |",
          ...pendingRows.map(
            (route) =>
              `| \`${route.path}\` | ${route.category} | ${route.label} | ${toActionLabel(route.nextAction)} |`
          ),
        ]),
    "",
    "## April 26-27 Checkpoint",
    "",
    "Run these commands and compare the results with `Docs/INDEXING_DIAGNOSIS.md` and this manifest:",
    "",
    "```bash",
    "npm run google:weekly-seo-health",
    "npm run google:seo-quick-wins",
    "```",
    "",
    "Decision rule:",
    "",
    "- Improvement means URLs are moving from `unknown` to `discovered` to `indexed`.",
    "- If the same URLs are still stuck, move to a pruning and weighting pass instead of waiting another cycle.",
    "",
    "## Canonical URL Inventory",
    "",
    "| URL | Category | Label | Observed Status |",
    "| --- | --- | --- | --- |",
    ...manifest.routes.map(
      (route) =>
        `| \`${route.path}\` | ${route.category} | ${route.label} | ${toStatusLabel(route.observedStatus)} |`
    ),
    "",
    "Generated by `npm run google:indexing-manifest`.",
    "",
  ];

  return lines.join("\n");
}

function main() {
  const routes = [
    ...extractStaticRoutes(),
    ...extractServiceDetails(),
    ...extractServiceAreas(),
    ...extractBlogPosts(),
  ]
    .map(applyObservedState)
    .sort(sortRoutes);

  const manifest = {
    generatedAt: GENERATED_AT,
    baseUrl: BASE_URL,
    sources: [
      "src/app/sitemap.ts",
      "src/lib/constants.ts",
      "src/lib/service-areas.ts",
      "src/lib/blog.ts",
      "Docs/INDEXING_DIAGNOSIS.md",
    ],
    countsByCategory: summarizeBy(routes, (route) => route.category),
    countsByObservedStatus: summarizeBy(routes, (route) => route.observedStatus),
    routes,
  };

  const docsDir = path.join(process.cwd(), "Docs");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, "INDEXING_MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(docsDir, "INDEXING_MANIFEST.md"), buildMarkdown(manifest));

  const unresolved = manifest.routes.filter((route) => route.observedStatus !== "indexed").length;
  console.log(`Wrote Docs/INDEXING_MANIFEST.json and Docs/INDEXING_MANIFEST.md (${manifest.routes.length} URLs, ${unresolved} unresolved).`);
}

main();
