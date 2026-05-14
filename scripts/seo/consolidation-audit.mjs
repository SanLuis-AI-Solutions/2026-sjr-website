import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "Docs", "INDEXING_MANIFEST.json");
const outDir = path.join(root, ".health");
const docsPath = path.join(root, "Docs", "INDEXING_CONSOLIDATION_AUDIT.md");
const latestJson = path.join(outDir, "indexing-consolidation-audit-latest.json");
const latestMd = path.join(outDir, "indexing-consolidation-audit-latest.md");

const clusters = [
  {
    name: "Utility pages",
    unresolved: ["/site-map"],
    indexedAlternatives: ["/"],
    recommendation: "ignore-for-growth",
    rationale:
      "The sitemap page is not a commercial landing page and should not receive visible mobile link weight.",
  },
  {
    name: "Pearl restringing",
    unresolved: ["/services/pearl-restringing", "/blog/pearl-restringing-timing-guide"],
    indexedAlternatives: ["/blog/how-much-does-pearl-restringing-cost-pasadena", "/services/necklace-repair"],
    recommendation: "proof-first-then-merge-guide-if-stalled",
    rationale:
      "The service page is commercially important and should be held for real pearl proof. The timing guide overlaps the indexed pearl-cost article and is the cleaner merge candidate if no proof assets arrive.",
  },
  {
    name: "Watch battery diagnosis",
    unresolved: [
      "/blog/does-my-watch-need-battery-or-repair-pasadena",
      "/blog/where-to-get-watch-battery-replaced-pasadena",
    ],
    indexedAlternatives: ["/blog/watch-battery-replacement", "/services/watch-repair"],
    recommendation: "merge-location-guide-if-stalled",
    rationale:
      "Both unresolved guides overlap an indexed watch battery article and indexed service page. Keep only if real diagnostic proof is available; otherwise consolidate the location/same-day guide first.",
  },
  {
    name: "Stone, chain, and cleaning risk",
    unresolved: [
      "/blog/chain-repair-weak-points",
      "/blog/professional-cleaning-vs-home-care",
      "/blog/stone-security-checklist",
    ],
    indexedAlternatives: [
      "/services/necklace-repair",
      "/blog/safe-to-clean-vintage-diamond-ring-at-home",
      "/blog/can-a-severely-bent-ring-prong-be-fixed",
    ],
    recommendation: "proof-first-then-merge-overlapping-guides",
    rationale:
      "These pages answer useful repair-risk questions but need real inspection photos or case notes to justify remaining separate from indexed sibling pages.",
  },
  {
    name: "Jeweler trust guide",
    unresolved: ["/blog/how-to-choose-a-jeweler"],
    indexedAlternatives: ["/about", "/services/heirloom-restoration", "/blog/heirloom-restoration-planning-guide"],
    recommendation: "proof-first-or-fold-into-about",
    rationale:
      "The page is broad and lower commercial specificity. If it stays stalled without review-backed proof, fold the useful trust checklist into About or an indexed heirloom guide.",
  },
  {
    name: "Service-area pages",
    unresolved: [
      "/services/clear-lake",
      "/services/friendswood",
      "/services/la-porte",
      "/services/pasadena",
      "/services/webster",
    ],
    indexedAlternatives: ["/services/deer-park", "/services"],
    recommendation: "city-proof-first-then-service-area-hub",
    rationale:
      "The city pages have local value, but if they remain unindexed without city-specific proof, a single stronger service-area hub is safer than adding more templated city copy.",
  },
];

function readManifest() {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function statusFor(routes, pathName) {
  return routes.find((route) => route.path === pathName)?.observedStatus ?? "missing-from-manifest";
}

function isIndexed(status) {
  return status === "indexed";
}

function isUnresolved(status) {
  return status !== "indexed";
}

function buildAudit(manifest) {
  const rows = clusters.map((cluster) => {
    const unresolvedStatuses = cluster.unresolved.map((pathName) => ({
      path: pathName,
      status: statusFor(manifest.routes, pathName),
    }));
    const indexedAlternativeStatuses = cluster.indexedAlternatives.map((pathName) => ({
      path: pathName,
      status: statusFor(manifest.routes, pathName),
    }));
    const unresolvedCount = unresolvedStatuses.filter((entry) => isUnresolved(entry.status)).length;
    const indexedAlternativeCount = indexedAlternativeStatuses.filter((entry) => isIndexed(entry.status)).length;

    return {
      ...cluster,
      unresolvedStatuses,
      indexedAlternativeStatuses,
      unresolvedCount,
      indexedAlternativeCount,
      action:
        cluster.recommendation === "ignore-for-growth"
          ? "Do not weight visibly."
          : indexedAlternativeCount > 0 && unresolvedCount > 0
            ? "Prepare proof or consolidation decision."
            : "Monitor only.",
    };
  });

  return {
    generatedAt: manifest.generatedAt,
    manifestGeneratedAt: manifest.generatedAt,
    summary: {
      clusters: rows.length,
      unresolvedCommercialClusters: rows.filter(
        (row) => row.recommendation !== "ignore-for-growth" && row.unresolvedCount > 0,
      ).length,
      clustersWithIndexedAlternatives: rows.filter((row) => row.indexedAlternativeCount > 0).length,
    },
    rows,
  };
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function statusList(entries) {
  return entries.map((entry) => `${entry.path} (${entry.status})`).join("<br>");
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function renderMarkdown(audit) {
  return [
    "# Indexing Consolidation Audit",
    "",
    `- Generated: ${audit.generatedAt}`,
    `- Manifest date: ${audit.manifestGeneratedAt}`,
    `- Unresolved commercial clusters: ${audit.summary.unresolvedCommercialClusters}`,
    `- Clusters with indexed alternatives: ${audit.summary.clustersWithIndexedAlternatives}`,
    "",
    "## Decision Rule",
    "",
    mdList([
      "Do not add homepage hubs, footer expansions, or extra mobile CTAs for unresolved pages.",
      "Use real shop proof first when a page has clear commercial value and unique intent.",
      "Consolidate when the unresolved page overlaps an already indexed page and no approved first-party proof is available.",
      "Keep utility pages out of commercial weighting decisions.",
    ]),
    "",
    "## Cluster Summary",
    "",
    table(
      ["Cluster", "Unresolved URLs", "Indexed alternatives", "Recommendation", "Action"],
      audit.rows.map((row) => [
        row.name,
        statusList(row.unresolvedStatuses),
        statusList(row.indexedAlternativeStatuses),
        row.recommendation,
        row.action,
      ]),
    ),
    "",
    "## Cluster Notes",
    "",
    ...audit.rows.flatMap((row) => [
      `### ${row.name}`,
      "",
      row.rationale,
      "",
      `Recommendation: \`${row.recommendation}\``,
      "",
    ]),
    "## Next Action",
    "",
    "If the next authenticated GSC recheck shows the same unresolved commercial URLs and no proof assets are available, start with the lowest-risk consolidation candidates:",
    "",
    mdList([
      "`/blog/where-to-get-watch-battery-replaced-pasadena` into `/blog/watch-battery-replacement` or `/services/watch-repair`.",
      "`/blog/pearl-restringing-timing-guide` into `/blog/how-much-does-pearl-restringing-cost-pasadena` or `/services/pearl-restringing`.",
      "`/blog/professional-cleaning-vs-home-care` into `/blog/safe-to-clean-vintage-diamond-ring-at-home`.",
    ]),
    "",
  ].join("\n");
}

function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const audit = buildAudit(readManifest());
  const markdown = renderMarkdown(audit);

  fs.writeFileSync(latestJson, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMd, markdown, "utf8");
  fs.writeFileSync(docsPath, markdown, "utf8");

  console.log(`Indexing consolidation audit written: ${docsPath}`);
}

main();
