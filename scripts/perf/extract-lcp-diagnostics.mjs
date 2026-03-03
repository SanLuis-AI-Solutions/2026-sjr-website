#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const opts = {
    dir: "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--dir") {
      opts.dir = argv[++i] || "";
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!opts.dir) {
    throw new Error("Missing required argument: --dir <perf-gate-dir>");
  }

  return opts;
}

function decodeHtmlEntities(value) {
  if (!value) return value;
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function walkJsonFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkJsonFiles(full)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(full);
    }
  }
  return files;
}

function safeSlug(routePath) {
  if (routePath === "/") return "home";
  return routePath.replace(/^\/+/, "").replace(/[^a-z0-9]+/gi, "-");
}

function extractBreakdown(report) {
  const items = report.audits["lcp-breakdown-insight"]?.details?.items?.[0]?.items || [];
  const phases = {
    ttfb: 0,
    resourceLoadDelay: 0,
    resourceLoadDuration: 0,
    elementRenderDelay: 0,
  };

  for (const item of items) {
    if (item?.subpart === "timeToFirstByte") phases.ttfb = Math.round(item.duration || 0);
    else if (item?.subpart === "resourceLoadDelay") phases.resourceLoadDelay = Math.round(item.duration || 0);
    else if (item?.subpart === "resourceLoadDuration") phases.resourceLoadDuration = Math.round(item.duration || 0);
    else if (item?.subpart === "elementRenderDelay") phases.elementRenderDelay = Math.round(item.duration || 0);
  }

  return phases;
}

function extractLcpNode(report) {
  const items = report.audits["lcp-discovery-insight"]?.details?.items || [];
  const node = items.find((item) => item?.type === "node") || null;
  const snippet = decodeHtmlEntities(node?.snippet || "");
  const srcMatch = snippet.match(/\ssrc="([^"]+)"/i);
  return {
    selector: node?.selector || null,
    snippet: snippet || null,
    imageUrl: srcMatch ? srcMatch[1] : null,
  };
}

function median(values) {
  const sorted = [...values].filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  return sorted[Math.floor(sorted.length / 2)];
}

async function run() {
  const opts = parseArgs(process.argv);
  const sourceDir = path.resolve(opts.dir);
  const summaryPath = path.join(sourceDir, "summary.json");
  const summary = JSON.parse(await fs.readFile(summaryPath, "utf8"));

  const slugToRoute = new Map(
    (summary.results || []).map((result) => [safeSlug(result.path), result.path])
  );

  const allJson = await walkJsonFiles(sourceDir);
  const lhrFiles = allJson.filter((file) => /lighthouse-.+-run\d+\.json$/i.test(path.basename(file)));
  const records = [];

  for (const file of lhrFiles) {
    const base = path.basename(file);
    const match = base.match(/^lighthouse-(.+)-run(\d+)\.json$/i);
    if (!match) continue;
    const slug = match[1];
    const run = Number(match[2]);
    const report = JSON.parse(await fs.readFile(file, "utf8"));
    const phases = extractBreakdown(report);
    const node = extractLcpNode(report);

    records.push({
      route: slugToRoute.get(slug) || slug,
      slug,
      run,
      lcp: Math.round(report.audits["largest-contentful-paint"]?.numericValue || 0),
      fcp: Math.round(report.audits["first-contentful-paint"]?.numericValue || 0),
      tbt: Math.round(report.audits["total-blocking-time"]?.numericValue || 0),
      phases,
      lcpElementSelector: node.selector,
      lcpElementImageUrl: node.imageUrl,
      lcpElementSnippet: node.snippet,
      reportPath: path.relative(process.cwd(), file).replaceAll("\\", "/"),
    });
  }

  const routeDiagnostics = [];
  const grouped = new Map();
  for (const record of records) {
    if (!grouped.has(record.route)) grouped.set(record.route, []);
    grouped.get(record.route).push(record);
  }

  for (const [route, routeRecords] of grouped) {
    routeDiagnostics.push({
      route,
      runs: routeRecords.length,
      median: {
        lcp: median(routeRecords.map((item) => item.lcp)),
        fcp: median(routeRecords.map((item) => item.fcp)),
        tbt: median(routeRecords.map((item) => item.tbt)),
        ttfb: median(routeRecords.map((item) => item.phases.ttfb)),
        resourceLoadDelay: median(routeRecords.map((item) => item.phases.resourceLoadDelay)),
        resourceLoadDuration: median(routeRecords.map((item) => item.phases.resourceLoadDuration)),
        elementRenderDelay: median(routeRecords.map((item) => item.phases.elementRenderDelay)),
      },
      sampleLcpElementSelector:
        routeRecords.find((item) => item.lcpElementSelector)?.lcpElementSelector || null,
      sampleLcpImageUrl:
        routeRecords.find((item) => item.lcpElementImageUrl)?.lcpElementImageUrl || null,
    });
  }

  routeDiagnostics.sort((a, b) => a.route.localeCompare(b.route));
  records.sort((a, b) => a.route.localeCompare(b.route) || a.run - b.run);

  const label = path.basename(sourceDir).replace(/^perf-gate-/, "") || "run";
  const outputPath = path.join(process.cwd(), ".health", `lcp-diagnostics-${label}.json`);
  const output = {
    generatedAt: new Date().toISOString(),
    sourceDir: sourceDir.replaceAll("\\", "/"),
    summaryPath: path.relative(process.cwd(), summaryPath).replaceAll("\\", "/"),
    config: summary.config || null,
    routeDiagnostics,
    records,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Diagnostics written: ${path.relative(process.cwd(), outputPath)}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

