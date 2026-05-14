import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.susiesjewelryrepair.com";
const BASE_OBSERVED_ON = "2026-05-08";

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
  "/blog/how-much-does-pearl-restringing-cost-pasadena": {
    status: "indexed",
    note: "Moved from unresolved to indexed by the 2026-05-04 GSC re-inspection.",
  },
  "/services/clear-lake": { status: "discovered-currently-not-indexed" },
  "/services/friendswood": { status: "discovered-currently-not-indexed" },
  "/services/la-porte": { status: "discovered-currently-not-indexed" },
  "/services/pearl-restringing": { status: "discovered-currently-not-indexed" },
  "/services/webster": { status: "discovered-currently-not-indexed" },
  "/blog/chain-repair-weak-points": { status: "discovered-currently-not-indexed" },
  "/blog/does-my-watch-need-battery-or-repair-pasadena": {
    status: "discovered-currently-not-indexed",
    note: "Commercial blog sample still waiting on index selection.",
  },
  "/blog/heirloom-restoration-planning-guide": { status: "discovered-currently-not-indexed" },
  "/blog/how-to-choose-a-jeweler": { status: "discovered-currently-not-indexed" },
  "/blog/professional-cleaning-vs-home-care": { status: "discovered-currently-not-indexed" },
  "/blog/safe-to-clean-vintage-diamond-ring-at-home": {
    status: "discovered-currently-not-indexed",
  },
  "/blog/stone-security-checklist": { status: "discovered-currently-not-indexed" },
  "/services/pasadena": { status: "discovered-currently-not-indexed" },
};

function dateOnly(value) {
  return value ? value.slice(0, 10) : null;
}

function toObservedStatus(coverageState) {
  return {
    "Discovered - currently not indexed": "discovered-currently-not-indexed",
    "URL is unknown to Google": "unknown-to-google",
    "Submitted and indexed": "indexed",
    "Indexed, not submitted in sitemap": "indexed",
  }[coverageState] || null;
}

function readLatestIndexingStatus() {
  const latestPath = path.join(process.cwd(), ".health", "indexing-status-latest.json");

  if (!fs.existsSync(latestPath)) {
    return null;
  }

  const latest = JSON.parse(fs.readFileSync(latestPath, "utf8"));
  const observedOn = dateOnly(latest.generatedAt);
  const rows = new Map();

  for (const row of latest.rows || []) {
    const status = toObservedStatus(row.coverageState);
    if (!status) continue;

    rows.set(row.path, {
      status,
      observedOn,
      note: `Latest authenticated URL Inspection API recheck run on ${observedOn}. Coverage: ${row.coverageState}. Sitemap sources: ${row.sitemapCount}. Referring URLs: ${row.referringUrlCount}.`,
    });
  }

  return { generatedAt: observedOn, rows };
}

function readPreviousManifestStatuses() {
  const manifestPath = path.join(process.cwd(), "Docs", "INDEXING_MANIFEST.json");

  if (!fs.existsSync(manifestPath)) {
    return new Map();
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const rows = new Map();

  for (const route of manifest.routes || []) {
    if (!route.path || !route.observedStatus) continue;

    rows.set(route.path, {
      status: route.observedStatus,
      observedOn: route.observedOn || null,
      note: route.note,
    });
  }

  return rows;
}

function newerObservedState(a, b) {
  if (!a) return b;
  if (!b) return a;

  const aDate = a.observedOn || BASE_OBSERVED_ON;
  const bDate = b.observedOn || BASE_OBSERVED_ON;

  return aDate >= bDate ? a : b;
}

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

function applyObservedState(route, latestStatus, previousManifestStatuses) {
  const observed =
    latestStatus?.rows.get(route.path) ||
    newerObservedState(previousManifestStatuses.get(route.path), OBSERVED_STATUSES[route.path]);
  const status = observed?.status || "pending-gsc-inspection";
  const nextAction =
    status === "indexed" ? "monitor" : observed ? "request-indexing-and-recheck" : "inspect-and-request-indexing";
  const note =
    observed?.note ||
    (observed
      ? `GSC URL Inspection API recheck run on ${BASE_OBSERVED_ON} after the 2026-04-21 indexing submission batch.`
      : "Canonical URL from codebase; inspect in GSC and request indexing if not already indexed.");

  return {
    ...route,
    url: `${BASE_URL}${route.path}`,
    observedStatus: status,
    observedOn: observed?.observedOn || (observed ? BASE_OBSERVED_ON : null),
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
    "request-indexing-and-recheck": "Recheck and weight at next monitoring pass",
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
    "These URLs should be prioritized for weighting or follow-up rechecks based on the latest URL Inspection API evidence.",
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
    "## Next Monitoring Checkpoint",
    "",
    "Run these commands and compare the results with `Docs/INDEXING_DIAGNOSIS.md` and this manifest:",
    "",
    "```bash",
    "npm run google:indexing-status",
    "npm run google:indexing-manifest",
    "npm run seo:internal-link-audit",
    "npm run seo:index-quality-audit",
    "npm run seo:consolidation-audit",
    "npm run google:weekly-seo-health",
    "npm run google:seo-quick-wins",
    "```",
    "",
    "Decision rule:",
    "",
    "- Improvement means URLs are moving from `unknown` to `discovered` to `indexed`.",
    "- Conversion improvement means mobile sticky CTA clicks begin producing quote or booking starts/submits.",
    "- If unresolved commercial URLs remain `discovered` after the next full authenticated reinspection and the link/content audits still pass, escalate to proof assets or consolidation rather than adding generic visible link blocks.",
    "- Do not add homepage hubs, footer expansions, or extra mobile CTAs from indexing status alone; preserve the current mobile flow unless GA4 shows the compact sticky CTA is not producing downstream starts.",
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
  const latestStatus = readLatestIndexingStatus();
  const previousManifestStatuses = readPreviousManifestStatuses();
  const routes = [
    ...extractStaticRoutes(),
    ...extractServiceDetails(),
    ...extractServiceAreas(),
    ...extractBlogPosts(),
  ]
    .map((route) => applyObservedState(route, latestStatus, previousManifestStatuses))
    .sort(sortRoutes);

  const manifest = {
    generatedAt: latestStatus?.generatedAt || BASE_OBSERVED_ON,
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
