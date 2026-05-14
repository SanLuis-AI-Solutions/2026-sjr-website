import fs from "node:fs";
import path from "node:path";

const DEFAULT_BASE_URL = "https://www.susiesjewelryrepair.com";
const BASE_URL = (process.env.INDEX_QUALITY_AUDIT_ORIGIN || DEFAULT_BASE_URL).replace(/\/$/, "");
const HEALTH_DIR = path.join(process.cwd(), ".health");
const MANIFEST_PATH = path.join(process.cwd(), "Docs", "INDEXING_MANIFEST.json");
const INTERNAL_LINK_AUDIT_PATH = path.join(HEALTH_DIR, "internal-link-audit-latest.json");
const OUT_JSON = path.join(HEALTH_DIR, "index-quality-audit-latest.json");
const OUT_MD = path.join(HEALTH_DIR, "index-quality-audit-latest.md");

const MIN_WORDS = {
  blog: 900,
  "service-area": 700,
  "service-detail": 850,
  static: 300,
};

const MIN_H2 = {
  blog: 3,
  "service-area": 2,
  "service-detail": 3,
  static: 1,
};

const EXPECTED_SCHEMA = {
  blog: ["Article", "BlogPosting"],
  "service-area": ["Service", "LocalBusiness"],
  "service-detail": ["Service", "LocalBusiness"],
  static: [],
};

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function toAbsoluteUrl(routePath) {
  return new URL(routePath, `${BASE_URL}/`).toString();
}

function normalizePath(value) {
  return value.replace(/\/$/, "") || "/";
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&ndash;|&mdash;/g, "-");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function attrValue(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] || "";
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1] || "";
}

function extractMeta(html, name) {
  const matches = html.matchAll(/<meta\b[^>]*>/gi);
  for (const match of matches) {
    const tag = match[0];
    const metaName = attrValue(tag, "name") || attrValue(tag, "property");
    if (metaName.toLowerCase() === name.toLowerCase()) {
      return decodeHtml(attrValue(tag, "content"));
    }
  }
  return "";
}

function extractCanonical(html) {
  const matches = html.matchAll(/<link\b[^>]*>/gi);
  for (const match of matches) {
    const tag = match[0];
    if (/\bcanonical\b/i.test(attrValue(tag, "rel"))) {
      return attrValue(tag, "href");
    }
  }
  return "";
}

function extractHeadings(html, level) {
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
}

function cleanVisibleText(html) {
  return stripTags(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
      .replace(/<header\b[\s\S]*?<\/header>/gi, " ")
      .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")
      .replace(/<form\b[\s\S]*?<\/form>/gi, " "),
  );
}

function wordsFor(text) {
  return text.toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,}/g) || [];
}

function shingleSet(text, size = 5) {
  const words = wordsFor(text);
  const shingles = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    shingles.add(words.slice(index, index + size).join(" "));
  }
  return shingles;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

function collectSchemaTypes(value, types = new Set()) {
  if (!value || typeof value !== "object") return types;
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
    return types;
  }

  const type = value["@type"];
  if (Array.isArray(type)) {
    for (const item of type) types.add(String(item));
  } else if (type) {
    types.add(String(type));
  }

  if (Array.isArray(value["@graph"])) collectSchemaTypes(value["@graph"], types);
  for (const item of Object.values(value)) {
    if (item && typeof item === "object") collectSchemaTypes(item, types);
  }
  return types;
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type=(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  const errors = [];

  for (const script of scripts) {
    const raw = script[2].replace(/<!--|-->/g, "").trim();
    if (!raw) continue;
    try {
      parsed.push(JSON.parse(raw));
    } catch (error) {
      errors.push(error?.message || "Invalid JSON-LD");
    }
  }

  return {
    count: parsed.length,
    errors,
    types: [...collectSchemaTypes(parsed)].sort(),
  };
}

function expectedSchemaPresent(category, types) {
  const expected = EXPECTED_SCHEMA[category] || [];
  if (expected.length === 0) return true;
  return expected.some((type) => types.includes(type));
}

function contentBand(category, wordCount) {
  const min = MIN_WORDS[category] || 500;
  if (wordCount >= min) return "pass";
  if (wordCount >= Math.round(min * 0.72)) return "thin-watch";
  return "thin";
}

function statusFor(page) {
  if (!page.httpOk || page.httpStatus !== 200) return "technical-risk";
  if (page.hasNoindex || !page.canonicalMatches || page.h1Count !== 1 || !page.title) {
    return "technical-risk";
  }
  if (page.schemaErrors.length > 0 || !page.expectedSchemaPresent) return "schema-risk";
  if (page.contentBand !== "pass" || page.maxSimilarity >= 0.78 || page.h2Count < page.minH2) {
    return "content-risk";
  }
  if (
    page.observedStatus !== "indexed" &&
    page.category !== "static" &&
    page.internalLinks &&
    page.internalLinks.nonFooterIndexedSourceCount < 2
  ) {
    return "link-risk";
  }
  return "pass-monitor";
}

function recommendationsFor(page) {
  const recommendations = [];
  if (!page.httpOk || page.httpStatus !== 200) recommendations.push("Fix live HTTP status before requesting indexing.");
  if (page.hasNoindex) recommendations.push("Remove noindex before requesting indexing.");
  if (!page.canonicalMatches) recommendations.push("Fix canonical to match the submitted URL.");
  if (!page.title) recommendations.push("Add a unique title tag.");
  if (page.h1Count !== 1) recommendations.push("Keep exactly one visible H1.");
  if (page.metaDescriptionLength === 0) recommendations.push("Add a meta description.");
  if (page.schemaErrors.length > 0) recommendations.push("Fix invalid JSON-LD.");
  if (!page.expectedSchemaPresent) recommendations.push(`Add visible-content-aligned ${page.expectedSchema.join(" or ")} schema.`);
  if (page.contentBand !== "pass") recommendations.push(`Increase unique visible content depth toward ${page.minWords}+ words.`);
  if (page.h2Count < page.minH2) recommendations.push(`Add clearer section structure (${page.minH2}+ H2s).`);
  if (page.maxSimilarity >= 0.78) recommendations.push(`Reduce template overlap with ${page.similarTo}.`);
  if (
    page.observedStatus !== "indexed" &&
    page.category !== "static" &&
    page.internalLinks &&
    page.internalLinks.nonFooterIndexedSourceCount < 2
  ) {
    recommendations.push("Add contextual links from indexed pages.");
  }
  if (page.category === "static" && page.path === "/site-map") {
    recommendations.push("Non-commercial crawl utility; do not add visible homepage weight unless GSC remains stuck.");
  }
  if (recommendations.length === 0) recommendations.push("No technical/content/schema/link blocker found; monitor GSC and re-request indexing if needed.");
  return recommendations;
}

async function fetchPage(route) {
  const response = await fetch(route.url, {
    redirect: "follow",
    headers: {
      "user-agent": "SJRIndexQualityAudit/1.0 (+https://www.susiesjewelryrepair.com/site-map)",
    },
  });
  const html = await response.text();
  const finalUrl = response.url || route.url;
  const canonical = extractCanonical(html);
  const robots = extractMeta(html, "robots");
  const title = stripTags(firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = extractMeta(html, "description");
  const h1 = extractHeadings(html, 1);
  const h2 = extractHeadings(html, 2);
  const h3 = extractHeadings(html, 3);
  const visibleText = cleanVisibleText(html);
  const jsonLd = extractJsonLd(html);
  const expectedSchema = EXPECTED_SCHEMA[route.category] || [];
  const targetUrl = toAbsoluteUrl(route.path);
  const canonicalUrl = canonical ? new URL(canonical, targetUrl).toString().replace(/\/$/, "") : "";
  const normalizedTarget = targetUrl.replace(/\/$/, "");

  return {
    ...route,
    url: targetUrl,
    finalUrl,
    httpStatus: response.status,
    httpOk: response.ok,
    title,
    titleLength: title.length,
    metaDescriptionLength: description.length,
    h1Count: h1.length,
    h1: h1.slice(0, 2),
    h2Count: h2.length,
    h3Count: h3.length,
    wordCount: wordsFor(visibleText).length,
    visibleText,
    canonical: canonical || "",
    canonicalMatches: canonicalUrl === normalizedTarget,
    robots,
    hasNoindex: /\bnoindex\b/i.test(robots),
    jsonLdCount: jsonLd.count,
    schemaTypes: jsonLd.types,
    schemaErrors: jsonLd.errors,
    expectedSchema,
    expectedSchemaPresent: expectedSchemaPresent(route.category, jsonLd.types),
    hasFaqSchema: jsonLd.types.includes("FAQPage"),
    contentBand: contentBand(route.category, wordsFor(visibleText).length),
    minWords: MIN_WORDS[route.category] || 500,
    minH2: MIN_H2[route.category] || 1,
  };
}

function attachSimilarity(pages) {
  const byCategory = new Map();
  for (const page of pages) {
    if (!byCategory.has(page.category)) byCategory.set(page.category, []);
    byCategory.get(page.category).push(page);
  }

  const shinglesByPath = new Map(pages.map((page) => [page.path, shingleSet(page.visibleText)]));
  for (const page of pages) {
    let maxSimilarity = 0;
    let similarTo = null;
    const peers = byCategory.get(page.category) || [];
    for (const peer of peers) {
      if (peer.path === page.path) continue;
      const score = jaccard(shinglesByPath.get(page.path), shinglesByPath.get(peer.path));
      if (score > maxSimilarity) {
        maxSimilarity = score;
        similarTo = peer.path;
      }
    }
    page.maxSimilarity = Number(maxSimilarity.toFixed(3));
    page.similarTo = similarTo;
  }
}

function internalLinkMap() {
  const audit = readJson(INTERNAL_LINK_AUDIT_PATH, null);
  if (!audit?.targets) return new Map();
  return new Map(
    audit.targets.map((target) => [
      target.path,
      {
        indexedSourceCount: target.indexedSourceCount,
        nonFooterIndexedSourceCount: target.nonFooterIndexedSourceCount,
        hasSiteMapLink: target.hasSiteMapLink,
        recommendation: target.recommendation,
      },
    ]),
  );
}

function buildMarkdown(report) {
  const unresolved = report.pages.filter((page) => page.observedStatus !== "indexed");
  const blockers = unresolved.filter((page) => page.status !== "pass-monitor");

  return [
    "# Index Quality Audit",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Origin: ${report.baseUrl}`,
    `- Pages checked: ${report.pages.length}`,
    `- Unresolved checked: ${unresolved.length}`,
    `- Unresolved with no quality blocker found: ${unresolved.filter((page) => page.status === "pass-monitor").length}`,
    `- Unresolved needing action: ${blockers.length}`,
    "",
    "## Unresolved Queue",
    "",
    table(
      ["Path", "GSC Status", "Audit", "Words", "H1", "H2", "Schema", "Similarity", "Indexed Links", "Recommendation"],
      unresolved.map((page) => [
        `\`${page.path}\``,
        page.observedStatus,
        page.status,
        String(page.wordCount),
        String(page.h1Count),
        String(page.h2Count),
        page.schemaTypes.length ? page.schemaTypes.join(", ") : "-",
        page.similarTo ? `${page.maxSimilarity} vs \`${page.similarTo}\`` : "-",
        page.internalLinks ? String(page.internalLinks.nonFooterIndexedSourceCount) : "n/a",
        page.recommendations[0],
      ]),
    ),
    "",
    "## Technical / Content / Schema Findings",
    "",
    blockers.length
      ? blockers
          .map(
            (page) =>
              `- \`${page.path}\` (${page.status}): ${page.recommendations.join(" ")}`,
          )
          .join("\n")
      : "No unresolved commercial URL shows a clear technical, content-depth, schema, duplication, or internal-link blocker in this audit.",
    "",
    "## All Checked Pages",
    "",
    table(
      ["Path", "Category", "HTTP", "Canonical", "Noindex", "Words", "Schema Types", "Audit"],
      report.pages.map((page) => [
        `\`${page.path}\``,
        page.category,
        String(page.httpStatus),
        page.canonicalMatches ? "Self" : "Mismatch",
        page.hasNoindex ? "Yes" : "No",
        String(page.wordCount),
        page.schemaTypes.length ? page.schemaTypes.join(", ") : "-",
        page.status,
      ]),
    ),
    "",
  ].join("\n");
}

async function main() {
  const manifest = readJson(MANIFEST_PATH);
  if (!manifest?.routes) throw new Error("Docs/INDEXING_MANIFEST.json must contain routes.");

  const routes = manifest.routes
    .map((route) => ({
      category: route.category,
      path: normalizePath(route.path),
      label: route.label || route.path,
      observedStatus: route.observedStatus,
      observedOn: route.observedOn,
      url: toAbsoluteUrl(normalizePath(route.path)),
    }))
    .filter((route) => route.observedStatus !== "indexed" || route.category !== "static");

  const linkStats = internalLinkMap();
  const pages = [];
  for (const route of routes) {
    const page = await fetchPage(route);
    page.internalLinks = linkStats.get(route.path) || null;
    pages.push(page);
  }

  attachSimilarity(pages);

  for (const page of pages) {
    page.status = statusFor(page);
    page.recommendations = recommendationsFor(page);
    delete page.visibleText;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    manifestGeneratedAt: manifest.generatedAt,
    pages,
    summary: {
      checked: pages.length,
      unresolved: pages.filter((page) => page.observedStatus !== "indexed").length,
      byStatus: pages.reduce((acc, page) => {
        acc[page.status] = (acc[page.status] || 0) + 1;
        return acc;
      }, {}),
    },
  };

  fs.mkdirSync(HEALTH_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(OUT_MD, buildMarkdown(report), "utf8");

  const unresolved = report.pages.filter((page) => page.observedStatus !== "indexed");
  const blockers = unresolved.filter((page) => page.status !== "pass-monitor");
  console.log(
    `INDEX_QUALITY_AUDIT_OK checked=${report.pages.length} unresolved=${unresolved.length} action=${blockers.length}`,
  );
  console.log(`Report: ${path.relative(process.cwd(), OUT_MD)}`);
}

main().catch((error) => {
  console.error("INDEX_QUALITY_AUDIT_FAIL", error?.message || error);
  process.exit(1);
});
