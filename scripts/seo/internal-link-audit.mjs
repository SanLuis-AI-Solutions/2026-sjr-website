import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.susiesjewelryrepair.com";
const MAX_SOURCE_PAGES = 80;

function toPath(value) {
  try {
    const url = new URL(value, BASE_URL);
    if (url.hostname !== "www.susiesjewelryrepair.com") return null;
    return url.pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractLinks(html) {
  const links = new Set();
  const matches = html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi);

  for (const match of matches) {
    const href = match[2];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }

    const normalized = toPath(href);
    if (normalized) links.add(normalized);
  }

  return links;
}

function isInsideTag(html, index, tagName) {
  const lower = html.toLowerCase();
  const openIndex = lower.lastIndexOf(`<${tagName}`, index);
  if (openIndex === -1) return false;

  const closeIndex = lower.lastIndexOf(`</${tagName}>`, index);
  return closeIndex < openIndex;
}

function extractLinkContexts(html) {
  const contexts = new Map();
  const matches = html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi);

  for (const match of matches) {
    const href = match[2];
    const index = match.index || 0;
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }

    const normalized = toPath(href);
    if (!normalized) continue;

    const current = contexts.get(normalized) || { total: 0, footer: 0, nonFooter: 0 };
    current.total += 1;
    if (isInsideTag(html, index, "footer")) {
      current.footer += 1;
    } else {
      current.nonFooter += 1;
    }
    contexts.set(normalized, current);
  }

  return contexts;
}

async function fetchHtml(route) {
  const url = new URL(route.path, BASE_URL).toString();
  const response = await fetch(url, {
    headers: {
      "user-agent": "SJRInternalLinkAudit/1.0 (+https://www.susiesjewelryrepair.com/site-map)",
    },
  });

  const html = await response.text();
  return {
    path: route.path,
    url,
    status: response.status,
    ok: response.ok,
    html,
  };
}

function linkEvidenceFor(targetPath, sourceResults) {
  const exactPattern = new RegExp(`href=(["'])(?:${BASE_URL})?${escapeRegExp(targetPath)}(?:[?#][^"']*)?\\1`, "i");

  return sourceResults
    .filter((source) => source.ok && source.links.has(targetPath))
    .map((source) => ({
      path: source.path,
      status: source.status,
      exactHref: exactPattern.test(source.html),
      nonFooterLinks: source.linkContexts.get(targetPath)?.nonFooter || 0,
      footerLinks: source.linkContexts.get(targetPath)?.footer || 0,
    }));
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function buildMarkdown(report) {
  const rows = report.targets.map((target) => [
    `\`${target.path}\``,
    target.statusLabel,
    String(target.sourceCount),
    target.indexedSourceCount ? String(target.indexedSourceCount) : "0",
    target.nonFooterIndexedSourceCount ? String(target.nonFooterIndexedSourceCount) : "0",
    target.hasSiteMapLink ? "Yes" : "No",
    target.recommendation,
  ]);

  const weakRows = report.targets
    .filter((target) => target.category !== "static" && target.nonFooterIndexedSourceCount < 2)
    .map((target) => [
      `\`${target.path}\``,
      target.statusLabel,
      String(target.nonFooterIndexedSourceCount),
      target.sources
        .filter((source) => source.nonFooterLinks > 0)
        .slice(0, 4)
        .map((source) => `\`${source.path}\``)
        .join(", ") || "None",
    ]);

  return [
    "# Internal Link Audit",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Source pages fetched: ${report.sourcePages.length}`,
    `- Unresolved targets checked: ${report.targets.length}`,
    `- Base URL: ${BASE_URL}`,
    "",
    "## Summary",
    "",
    table(
      [
        "Target",
        "GSC Status",
        "All Source Links",
        "Indexed Source Links",
        "Non-Footer Indexed Links",
        "Site Map Link",
        "Recommendation",
      ],
      rows,
    ),
    "",
    "## Weak Indexed-Source Coverage",
    "",
    weakRows.length
      ? table(["Target", "GSC Status", "Non-Footer Indexed Links", "Non-Footer Sources"], weakRows)
      : "No unresolved targets have fewer than 2 non-footer indexed-source links.",
    "",
    "## Source Pages",
    "",
    table(
      ["Source", "Observed Status", "HTTP Status"],
      report.sourcePages.map((source) => [
        `\`${source.path}\``,
        source.observedStatus,
        String(source.status),
      ]),
    ),
    "",
  ].join("\n");
}

function mainRecommendation(target) {
  if (target.category === "static") {
    return "Utility URL; do not add visible weight unless it becomes commercially important";
  }
  if (target.indexedSourceCount === 0) {
    return "Add links from indexed pages";
  }
  if (target.nonFooterIndexedSourceCount < 2) {
    return "Add contextual indexed-source links";
  }
  if (!target.hasSiteMapLink) {
    return "Add to HTML site map";
  }
  if (target.indexedSourceCount < 2) {
    return "Add one more indexed-source link";
  }
  return "Monitor GSC";
}

async function main() {
  const manifestPath = path.join(process.cwd(), "Docs", "INDEXING_MANIFEST.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const routes = manifest.routes.map((route) => ({
    ...route,
    path: route.path.replace(/\/$/, "") || "/",
  }));

  const unresolvedRoutes = routes.filter((route) => route.observedStatus !== "indexed");
  const sourceRoutes = [
    ...routes.filter((route) => route.observedStatus === "indexed"),
    ...routes.filter((route) => route.path === "/site-map"),
  ]
    .filter((route, index, all) => all.findIndex((entry) => entry.path === route.path) === index)
    .slice(0, MAX_SOURCE_PAGES);

  const sourceResults = [];
  for (const route of sourceRoutes) {
    const result = await fetchHtml(route);
    sourceResults.push({
      ...route,
      status: result.status,
      ok: result.ok,
      html: result.html,
      links: extractLinks(result.html),
      linkContexts: extractLinkContexts(result.html),
    });
  }

  const indexedSourcePaths = new Set(
    sourceResults
      .filter((source) => source.observedStatus === "indexed" && source.ok)
      .map((source) => source.path),
  );

  const targets = unresolvedRoutes.map((route) => {
    const sources = linkEvidenceFor(route.path, sourceResults);
    const indexedSourceCount = sources.filter((source) => indexedSourcePaths.has(source.path)).length;
    const nonFooterIndexedSourceCount = sources.filter(
      (source) => indexedSourcePaths.has(source.path) && source.nonFooterLinks > 0,
    ).length;
    const hasSiteMapLink = sources.some((source) => source.path === "/site-map");
    const target = {
      path: route.path,
      category: route.category,
      statusLabel:
        route.observedStatus === "discovered-currently-not-indexed"
          ? "Discovered - currently not indexed"
          : route.observedStatus === "unknown-to-google"
            ? "URL is unknown to Google"
            : route.observedStatus,
      sourceCount: sources.length,
      indexedSourceCount,
      nonFooterIndexedSourceCount,
      hasSiteMapLink,
      sources,
      recommendation: "",
    };

    target.recommendation = mainRecommendation(target);
    return target;
  });

  const generatedAt = new Date().toISOString();
  const report = {
    generatedAt,
    baseUrl: BASE_URL,
    sourcePages: sourceResults.map((source) => ({
      path: source.path,
      observedStatus: source.observedStatus,
      status: source.status,
      linkCount: source.links.size,
    })),
    targets,
  };

  const healthDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(healthDir, { recursive: true });
  fs.writeFileSync(
    path.join(healthDir, "internal-link-audit-latest.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(healthDir, "internal-link-audit-latest.md"),
    buildMarkdown(report),
  );

  console.log(
    `INTERNAL_LINK_AUDIT_OK ${report.targets.length} targets, ${report.sourcePages.length} source pages`,
  );
}

main().catch((error) => {
  console.error("INTERNAL_LINK_AUDIT_FAIL", error?.message || error);
  process.exit(1);
});
