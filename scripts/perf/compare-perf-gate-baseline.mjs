#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function parseNumber(value, name) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value for ${name}: ${value}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const opts = {
    summary: "",
    baseline: "",
    maxRegressionMs: null,
    write: "",
    label: "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--summary") opts.summary = argv[++i] || "";
    else if (token === "--baseline") opts.baseline = argv[++i] || "";
    else if (token === "--max-regression-ms") {
      opts.maxRegressionMs = parseNumber(argv[++i], "--max-regression-ms");
    } else if (token === "--write") {
      opts.write = argv[++i] || "";
    } else if (token === "--label") {
      opts.label = argv[++i] || "";
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!opts.summary) throw new Error("Missing required argument: --summary <summary-json>");
  if (!opts.baseline) throw new Error("Missing required argument: --baseline <baseline-json>");
  return opts;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function normalizeBaselineRoutes(rawBaseline) {
  const rows = [];
  const source = rawBaseline?.routes;

  if (Array.isArray(source)) {
    for (const item of source) {
      if (!item || typeof item.path !== "string") continue;
      rows.push({
        path: item.path,
        lcpMs: Number(item.lcpMs),
        maxRegressionMs:
          item.maxRegressionMs == null ? null : Number(item.maxRegressionMs),
      });
    }
    return rows;
  }

  if (source && typeof source === "object") {
    for (const [routePath, item] of Object.entries(source)) {
      if (!item) continue;
      rows.push({
        path: routePath,
        lcpMs: Number(item.lcpMs),
        maxRegressionMs:
          item.maxRegressionMs == null ? null : Number(item.maxRegressionMs),
      });
    }
    return rows;
  }

  throw new Error("Baseline file must contain a 'routes' object or array.");
}

function resolveCurrentLcp(routeResult) {
  const lcp = routeResult?.baseline?.lcp ?? routeResult?.median?.lcp;
  return Number(lcp);
}

function formatDelta(delta) {
  if (!Number.isFinite(delta)) return "n/a";
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

async function run() {
  const opts = parseArgs(process.argv);
  const summaryPath = path.resolve(opts.summary);
  const baselinePath = path.resolve(opts.baseline);

  const summary = await readJson(summaryPath);
  const baseline = await readJson(baselinePath);

  const summaryResults = Array.isArray(summary?.results) ? summary.results : [];
  const currentByRoute = new Map(summaryResults.map((item) => [item.path, item]));

  const baselineRoutes = normalizeBaselineRoutes(baseline);
  const defaultBudget =
    opts.maxRegressionMs ??
    (baseline?.defaultMaxRegressionMs == null ? 150 : Number(baseline.defaultMaxRegressionMs));

  const rows = [];
  const failures = [];

  for (const row of baselineRoutes) {
    const routeResult = currentByRoute.get(row.path);
    if (!routeResult) {
      failures.push({
        path: row.path,
        reason: "missing_route",
      });
      rows.push({
        path: row.path,
        baselineLcpMs: row.lcpMs,
        currentLcpMs: null,
        deltaMs: null,
        maxRegressionMs: row.maxRegressionMs ?? defaultBudget,
        pass: false,
        reason: "missing_route",
      });
      continue;
    }

    const currentLcpMs = resolveCurrentLcp(routeResult);
    const deltaMs = currentLcpMs - row.lcpMs;
    const maxRegressionMs = row.maxRegressionMs ?? defaultBudget;
    const pass = Number.isFinite(currentLcpMs) && Number.isFinite(row.lcpMs) && deltaMs <= maxRegressionMs;

    const out = {
      path: row.path,
      baselineLcpMs: row.lcpMs,
      currentLcpMs,
      deltaMs,
      maxRegressionMs,
      pass,
      reason: pass ? null : "lcp_regression",
    };
    rows.push(out);
    if (!pass) failures.push(out);
  }

  const extraRoutes = summaryResults
    .map((item) => item.path)
    .filter((routePath) => !baselineRoutes.some((item) => item.path === routePath));

  const report = {
    generatedAt: new Date().toISOString(),
    label: opts.label || null,
    summaryPath: path.relative(process.cwd(), summaryPath).replaceAll("\\", "/"),
    baselinePath: path.relative(process.cwd(), baselinePath).replaceAll("\\", "/"),
    defaultMaxRegressionMs: defaultBudget,
    pass: failures.length === 0,
    rows,
    failedPaths: failures.map((item) => item.path),
    extraSummaryRoutes: extraRoutes,
  };

  console.log("");
  if (opts.label) console.log(`${opts.label} Baseline Delta Check`);
  else console.log("Baseline Delta Check");

  for (const row of rows) {
    const currentText = row.currentLcpMs == null ? "n/a" : `${row.currentLcpMs}`;
    const status = row.pass ? "PASS" : "FAIL";
    console.log(
      `${row.path.padEnd(30)} baseline=${String(row.baselineLcpMs).padStart(4)}ms current=${String(
        currentText
      ).padStart(4)}ms delta=${formatDelta(row.deltaMs).padStart(5)}ms budget=+${String(
        row.maxRegressionMs
      ).padStart(3)}ms ${status}`
    );
  }

  if (extraRoutes.length > 0) {
    console.log("");
    console.log(`Note: ${extraRoutes.length} route(s) in summary not present in baseline:`);
    for (const routePath of extraRoutes) {
      console.log(`- ${routePath}`);
    }
  }

  if (opts.write) {
    const outputPath = path.resolve(opts.write);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`Delta report written: ${path.relative(process.cwd(), outputPath)}`);
  }

  if (!report.pass) {
    console.error("");
    console.error("Baseline delta check failed.");
    for (const item of failures) {
      if (item.reason === "missing_route") {
        console.error(`- ${item.path}: missing in current summary`);
        continue;
      }
      console.error(
        `- ${item.path}: delta=${formatDelta(item.deltaMs)}ms exceeds allowed +${item.maxRegressionMs}ms`
      );
    }
    process.exit(1);
  }

  console.log("");
  console.log("Baseline delta check passed.");
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

