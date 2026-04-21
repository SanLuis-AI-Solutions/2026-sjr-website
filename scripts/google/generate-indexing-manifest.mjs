import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.susiesjewelryrepair.com";
const GENERATED_AT = "2026-04-21";

const OBSERVED_STATUSES = {
  "/": {
    category: "static",
    status: "indexed",
    observedOn: "2026-04-21",
    action: "monitor",
    note: "GSC reported `URL is on Google`.",
  },
  "/services/watch-repair": {
    category: "service-detail",
    status: "indexed",
    observedOn: "2026-04-21",
    action: "monitor",
    note: "GSC reported `URL is on Google`.",
  },
  "/blog/cost-to-resize-gold-ring-pasadena": {
    category: "blog",
    status: "indexed",
    observedOn: "2026-04-21",
    action: "monitor",
    note: "Strongest confirmed indexed commercial blog sample.",
  },
  "/services/pasadena": {
    category: "service-area",
    status: "discovered-currently-not-indexed",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC showed sitemap source and homepage as referring page.",
  },
  "/services/la-porte": {
    category: "service-area",
    status: "discovered-currently-not-indexed",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC showed sitemap source and a referring page under `/blog`.",
  },
  "/services/friendswood": {
    category: "service-area",
    status: "discovered-currently-not-indexed",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC showed sitemap source and a referring page under `/blog`.",
  },
  "/services/clear-lake": {
    category: "service-area",
    status: "discovered-currently-not-indexed",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC showed sitemap source and a referring page under `/blog`.",
  },
  "/blog/does-my-watch-need-battery-or-repair-pasadena": {
    category: "blog",
    status: "discovered-currently-not-indexed",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "Commercial blog sample still waiting on index selection.",
  },
  "/services/webster": {
    category: "service-area",
    status: "unknown-to-google",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC reported no referring sitemap detected even though production sitemap includes it.",
  },
  "/services/pearl-restringing": {
    category: "service-detail",
    status: "unknown-to-google",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC reported no referring sitemap detected even though production sitemap includes it.",
  },
  "/blog/how-much-does-pearl-restringing-cost-pasadena": {
    category: "blog",
    status: "unknown-to-google",
    observedOn: "2026-04-21",
    action: "request-indexing-and-recheck",
    note: "GSC reported no referring sitemap detected even though production sitemap includes it.",
  },
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
  return {
    ...route,
    url: `${BASE_URL}${route.path}`,
    observedStatus: observed?.status || "pending-gsc-inspection",
    observedOn: observed?.observedOn || null,
    nextAction: observed?.action || "inspect-and-request-indexing",
    note: observed?.note || "Canonical URL from codebase; inspect in GSC and request indexing if not already indexed.",
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
