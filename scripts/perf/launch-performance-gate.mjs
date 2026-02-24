#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DEFAULT_PATHS = ["/", "/services/ring-sizing", "/blog/ring-sizing-guide"];

function parseNumber(value, name) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value for ${name}: ${value}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const defaults = {
    baseUrl:
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.susiesjewelryrepair.com",
    runs: 3,
    lcpThresholdMs: 2500,
    seoThreshold: 100,
    outputDir: ".health",
    paths: [...DEFAULT_PATHS],
  };

  const pathOverrides = [];

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--base-url") defaults.baseUrl = argv[++i];
    else if (token === "--runs") defaults.runs = parseNumber(argv[++i], "--runs");
    else if (token === "--lcp-threshold-ms") {
      defaults.lcpThresholdMs = parseNumber(argv[++i], "--lcp-threshold-ms");
    } else if (token === "--seo-threshold") {
      defaults.seoThreshold = parseNumber(argv[++i], "--seo-threshold");
    } else if (token === "--output-dir") defaults.outputDir = argv[++i];
    else if (token === "--path") pathOverrides.push(argv[++i]);
    else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (pathOverrides.length > 0) {
    defaults.paths = pathOverrides;
  }
  if (!defaults.baseUrl) throw new Error("Missing base URL.");
  if (defaults.runs < 1) throw new Error("--runs must be >= 1");

  return defaults;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function safeSlug(routePath) {
  if (routePath === "/") return "home";
  return routePath.replace(/^\/+/, "").replace(/[^a-z0-9]+/gi, "-");
}

function joinUrl(baseUrl, routePath) {
  return new URL(routePath, baseUrl).toString();
}

async function run() {
  const opts = parseArgs(process.argv);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = path.join(opts.outputDir, `perf-gate-${stamp}`);
  await fs.mkdir(runDir, { recursive: true });

  const results = [];

  for (const routePath of opts.paths) {
    const url = joinUrl(opts.baseUrl, routePath);
    const slug = safeSlug(routePath);
    const runs = [];

    for (let runIndex = 1; runIndex <= opts.runs; runIndex += 1) {
      const reportPath = path.join(runDir, `lighthouse-${slug}-run${runIndex}.json`);
      const args = [
        "lighthouse",
        url,
        "--output=json",
        `--output-path=${reportPath}`,
        "--quiet",
        '--chrome-flags=--headless=new --disable-gpu --no-sandbox',
      ];

      console.log(`Running ${routePath} (${runIndex}/${opts.runs})`);
      const isWindows = process.platform === "win32";
      const proc = spawnSync("npx", args, {
        encoding: "utf8",
        shell: isWindows,
      });

      if (proc.error) {
        throw proc.error;
      }

      const reportExists = await fs
        .access(reportPath)
        .then(() => true)
        .catch(() => false);

      if (!reportExists) {
        const stderr = String(proc.stderr || "").trim();
        const stdout = String(proc.stdout || "").trim();
        if (stderr) console.error(stderr);
        if (stdout) console.error(stdout);
        throw new Error(`Lighthouse report missing: ${reportPath}`);
      }
      if (proc.status !== 0) {
        const stderr = String(proc.stderr || "");
        const isKnownWindowsCleanupError = stderr.includes("EPERM, Permission denied");
        if (isKnownWindowsCleanupError) {
          console.warn(
            `Warning: lighthouse exited with code ${proc.status} (Windows temp cleanup EPERM) for ${routePath} run ${runIndex}; report file was generated.`
          );
        } else {
          console.warn(
            `Warning: lighthouse exited with code ${proc.status} for ${routePath} run ${runIndex}; report file was generated.`
          );
          if (stderr.trim()) {
            console.warn(stderr.trim());
          }
        }
      }

      const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
      runs.push({
        run: runIndex,
        perf: Math.round((report.categories.performance.score || 0) * 100),
        seo: Math.round((report.categories.seo.score || 0) * 100),
        lcp: Math.round(report.audits["largest-contentful-paint"]?.numericValue || 0),
        fcp: Math.round(report.audits["first-contentful-paint"]?.numericValue || 0),
        tbt: Math.round(report.audits["total-blocking-time"]?.numericValue || 0),
        cls: Number((report.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
      });
    }

    const routeResult = {
      path: routePath,
      url,
      runs,
      median: {
        perf: median(runs.map((r) => r.perf)),
        seo: median(runs.map((r) => r.seo)),
        lcp: median(runs.map((r) => r.lcp)),
        fcp: median(runs.map((r) => r.fcp)),
        tbt: median(runs.map((r) => r.tbt)),
        cls: median(runs.map((r) => r.cls)),
      },
    };
    results.push(routeResult);
  }

  const failedRoutes = results.filter(
    (result) =>
      result.median.lcp > opts.lcpThresholdMs || result.median.seo < opts.seoThreshold
  );

  const summary = {
    generatedAt: new Date().toISOString(),
    config: {
      baseUrl: opts.baseUrl,
      runs: opts.runs,
      lcpThresholdMs: opts.lcpThresholdMs,
      seoThreshold: opts.seoThreshold,
      paths: opts.paths,
    },
    results,
    pass: failedRoutes.length === 0,
    failedPaths: failedRoutes.map((route) => route.path),
  };

  const summaryPath = path.join(runDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  await fs.writeFile(path.join(opts.outputDir, "perf-gate-latest.json"), JSON.stringify(summary, null, 2));

  console.log("");
  console.log("Median Results");
  for (const result of results) {
    console.log(
      `${result.path.padEnd(28)} perf=${String(result.median.perf).padStart(3)} seo=${String(
        result.median.seo
      ).padStart(3)} lcp=${String(result.median.lcp).padStart(4)}ms tbt=${String(
        result.median.tbt
      ).padStart(4)}ms cls=${result.median.cls}`
    );
  }
  console.log(`Summary written: ${summaryPath}`);

  if (failedRoutes.length > 0) {
    console.error("");
    console.error(
      `Performance gate failed. LCP must be <= ${opts.lcpThresholdMs}ms and SEO must be >= ${opts.seoThreshold}.`
    );
    for (const route of failedRoutes) {
      console.error(
        `- ${route.path}: lcp=${route.median.lcp}ms seo=${route.median.seo}`
      );
    }
    process.exit(1);
  }

  console.log("");
  console.log("Performance gate passed.");
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
