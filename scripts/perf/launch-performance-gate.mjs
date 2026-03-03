#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DEFAULT_INTER_RUN_COOLDOWN_MS = 12000;

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
    runs: 10,
    percentile: 75,
    lcpThresholdMs: 2500,
    seoThreshold: 100,
    outputDir: ".health",
    paths: [...DEFAULT_PATHS],
    cooldownMs: DEFAULT_INTER_RUN_COOLDOWN_MS,
    diagnostics: false,
    isolate: false,
    isolateWorker: false,
  };

  const pathOverrides = [];

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--base-url") defaults.baseUrl = argv[++i];
    else if (token === "--runs") defaults.runs = parseNumber(argv[++i], "--runs");
    else if (token === "--percentile") defaults.percentile = parseNumber(argv[++i], "--percentile");
    else if (token === "--lcp-threshold-ms") {
      defaults.lcpThresholdMs = parseNumber(argv[++i], "--lcp-threshold-ms");
    } else if (token === "--seo-threshold") {
      defaults.seoThreshold = parseNumber(argv[++i], "--seo-threshold");
    } else if (token === "--output-dir") defaults.outputDir = argv[++i];
    else if (token === "--cooldown-ms") {
      defaults.cooldownMs = parseNumber(argv[++i], "--cooldown-ms");
    } else if (token === "--diagnostics") {
      defaults.diagnostics = true;
    } else if (token === "--isolate") {
      defaults.isolate = true;
    } else if (token === "--isolate-worker") {
      defaults.isolateWorker = true;
    }
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
  if (defaults.percentile <= 0 || defaults.percentile > 100) {
    throw new Error("--percentile must be > 0 and <= 100");
  }
  if (defaults.cooldownMs < 0) {
    throw new Error("--cooldown-ms must be >= 0");
  }

  return defaults;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const rank = Math.ceil((p / 100) * sorted.length);
  const index = Math.min(sorted.length - 1, Math.max(0, rank - 1));
  return sorted[index];
}

function safeSlug(routePath) {
  if (routePath === "/") return "home";
  return routePath.replace(/^\/+/, "").replace(/[^a-z0-9]+/gi, "-");
}

function joinUrl(baseUrl, routePath) {
  return new URL(routePath, baseUrl).toString();
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

function extractLcpDiagnostics(report) {
  const breakdownItems = report.audits["lcp-breakdown-insight"]?.details?.items?.[0]?.items || [];
  const phases = {
    ttfb: 0,
    resourceLoadDelay: 0,
    resourceLoadDuration: 0,
    elementRenderDelay: 0,
  };

  for (const item of breakdownItems) {
    if (item?.subpart === "timeToFirstByte") phases.ttfb = Math.round(item.duration || 0);
    else if (item?.subpart === "resourceLoadDelay") phases.resourceLoadDelay = Math.round(item.duration || 0);
    else if (item?.subpart === "resourceLoadDuration") phases.resourceLoadDuration = Math.round(item.duration || 0);
    else if (item?.subpart === "elementRenderDelay") phases.elementRenderDelay = Math.round(item.duration || 0);
  }

  const discoveryItems = report.audits["lcp-discovery-insight"]?.details?.items || [];
  const node = discoveryItems.find((item) => item?.type === "node") || null;
  const snippet = decodeHtmlEntities(node?.snippet || "");
  const srcMatch = snippet.match(/\ssrc="([^"]+)"/i);

  return {
    phases,
    lcpElementSelector: node?.selector || null,
    lcpElementSnippet: snippet || null,
    lcpImageUrl: srcMatch ? srcMatch[1] : null,
  };
}

function summarizeRouteDiagnostics(routePath, runs) {
  const medianPhases = {
    ttfb: median(runs.map((run) => run.diagnostics?.phases?.ttfb || 0)),
    resourceLoadDelay: median(runs.map((run) => run.diagnostics?.phases?.resourceLoadDelay || 0)),
    resourceLoadDuration: median(runs.map((run) => run.diagnostics?.phases?.resourceLoadDuration || 0)),
    elementRenderDelay: median(runs.map((run) => run.diagnostics?.phases?.elementRenderDelay || 0)),
  };

  const lcpValues = runs.map((run) => run.lcp).sort((a, b) => a - b);
  const medianLcp = lcpValues[Math.floor(lcpValues.length / 2)];
  const representativeRun =
    runs.find((run) => run.lcp === medianLcp && run.diagnostics?.lcpElementSelector) ||
    runs.find((run) => run.lcp === medianLcp) ||
    runs[0];

  return {
    route: routePath,
    medianPhases,
    lcpElementSelector: representativeRun?.diagnostics?.lcpElementSelector || null,
    lcpImageUrl: representativeRun?.diagnostics?.lcpImageUrl || null,
  };
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function buildChildArgs(opts, routePath, outputDir) {
  const args = [
    process.argv[1],
    "--base-url",
    opts.baseUrl,
    "--runs",
    String(opts.runs),
    "--percentile",
    String(opts.percentile),
    "--lcp-threshold-ms",
    String(opts.lcpThresholdMs),
    "--seo-threshold",
    String(opts.seoThreshold),
    "--output-dir",
    outputDir,
    "--path",
    routePath,
    "--cooldown-ms",
    String(opts.cooldownMs),
    "--isolate-worker",
  ];
  if (opts.diagnostics) args.push("--diagnostics");
  return args;
}

function printSummary(opts, summary, summaryPath) {
  console.log("");
  console.log(`P${opts.percentile} Baseline Results`);
  for (const result of summary.results) {
    console.log(
      `${result.path.padEnd(28)} perf=${String(result.baseline.perf).padStart(3)} seo=${String(
        result.baseline.seo
      ).padStart(3)} lcp=${String(result.baseline.lcp).padStart(4)}ms tbt=${String(
        result.baseline.tbt
      ).padStart(4)}ms cls=${result.baseline.cls}`
    );
    if (opts.diagnostics && result.diagnostics?.medianPhases) {
      const phase = result.diagnostics.medianPhases;
      console.log(
        `  diagnostics: ttfb=${phase.ttfb}ms loadDelay=${phase.resourceLoadDelay}ms loadTime=${phase.resourceLoadDuration}ms renderDelay=${phase.elementRenderDelay}ms`
      );
      if (result.diagnostics.lcpElementSelector) {
        console.log(`  lcp-element: ${result.diagnostics.lcpElementSelector}`);
      }
      if (result.diagnostics.lcpImageUrl) {
        console.log(`  lcp-image: ${result.diagnostics.lcpImageUrl}`);
      }
    }
  }
  console.log(`Summary written: ${summaryPath}`);
}

async function runIsolatedRoutes(opts, runDir) {
  const childRoot = path.join(runDir, "_isolated");
  await fs.mkdir(childRoot, { recursive: true });

  const routeResults = [];
  for (const routePath of opts.paths) {
    const routeSlug = safeSlug(routePath);
    const routeOutputDir = path.join(childRoot, routeSlug);
    await fs.mkdir(routeOutputDir, { recursive: true });

    const childArgs = buildChildArgs(opts, routePath, routeOutputDir);
    const child = spawnSync(process.execPath, childArgs, {
      cwd: process.cwd(),
      encoding: "utf8",
      shell: false,
    });

    if (child.stdout?.trim()) process.stdout.write(child.stdout);
    if (child.stderr?.trim()) process.stderr.write(child.stderr);
    if (child.error) throw child.error;

    const childLatestPath = path.join(routeOutputDir, "perf-gate-latest.json");
    const childSummary = await readJson(childLatestPath);
    if (!Array.isArray(childSummary.results) || childSummary.results.length !== 1) {
      throw new Error(`Isolated run produced unexpected summary shape for ${routePath}`);
    }
    routeResults.push(childSummary.results[0]);
  }

  const failedRoutes = routeResults.filter(
    (result) =>
      result.baseline.lcp > opts.lcpThresholdMs || result.baseline.seo < opts.seoThreshold
  );

  const summary = {
    generatedAt: new Date().toISOString(),
    config: {
      baseUrl: opts.baseUrl,
      runs: opts.runs,
      percentile: opts.percentile,
      lcpThresholdMs: opts.lcpThresholdMs,
      seoThreshold: opts.seoThreshold,
      paths: opts.paths,
      cooldownMs: opts.cooldownMs,
      diagnostics: opts.diagnostics,
      isolate: true,
    },
    results: routeResults,
    pass: failedRoutes.length === 0,
    failedPaths: failedRoutes.map((route) => route.path),
  };

  const summaryPath = path.join(runDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  await fs.writeFile(path.join(opts.outputDir, "perf-gate-latest.json"), JSON.stringify(summary, null, 2));
  printSummary(opts, summary, summaryPath);

  if (failedRoutes.length > 0) {
    console.error("");
    console.error(
      `Performance gate failed (P${opts.percentile} baseline). LCP must be <= ${opts.lcpThresholdMs}ms and SEO must be >= ${opts.seoThreshold}.`
    );
    for (const route of failedRoutes) {
      console.error(`- ${route.path}: lcp=${route.baseline.lcp}ms seo=${route.baseline.seo}`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("Performance gate passed.");
}

async function run() {
  const opts = parseArgs(process.argv);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDir = path.join(opts.outputDir, `perf-gate-${stamp}`);
  await fs.mkdir(runDir, { recursive: true });

  if (opts.isolate && !opts.isolateWorker && opts.paths.length > 1) {
    await runIsolatedRoutes(opts, runDir);
    return;
  }

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
      // Cool down between runs to reduce Chrome process residual CPU pressure.
      if (runIndex > 1) {
        await sleep(opts.cooldownMs);
      }
      const isWindows = process.platform === "win32";
      let proc = null;
      let reportExists = false;

      for (let attempt = 1; attempt <= 2; attempt += 1) {
        if (attempt > 1) {
          console.warn(
            `Retrying ${routePath} run ${runIndex} (attempt ${attempt}/2) due to missing report.`
          );
        }

        proc = spawnSync("npx", args, {
          encoding: "utf8",
          shell: isWindows,
        });

        if (proc.error) {
          throw proc.error;
        }

        reportExists = await fs
          .access(reportPath)
          .then(() => true)
          .catch(() => false);

        if (reportExists) break;
      }

      if (!reportExists) {
        const stderr = String(proc?.stderr || "").trim();
        const stdout = String(proc?.stdout || "").trim();
        if (stderr) console.error(stderr);
        if (stdout) console.error(stdout);
        throw new Error(`Lighthouse report missing: ${reportPath}`);
      }

      if (proc && proc.status !== 0) {
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
      const runResult = {
        run: runIndex,
        perf: Math.round((report.categories.performance.score || 0) * 100),
        seo: Math.round((report.categories.seo.score || 0) * 100),
        lcp: Math.round(report.audits["largest-contentful-paint"]?.numericValue || 0),
        fcp: Math.round(report.audits["first-contentful-paint"]?.numericValue || 0),
        tbt: Math.round(report.audits["total-blocking-time"]?.numericValue || 0),
        cls: Number((report.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
      };
      if (opts.diagnostics) {
        runResult.diagnostics = extractLcpDiagnostics(report);
      }
      runs.push(runResult);
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
      baseline: {
        perf: percentile(runs.map((r) => r.perf), opts.percentile),
        seo: percentile(runs.map((r) => r.seo), opts.percentile),
        lcp: percentile(runs.map((r) => r.lcp), opts.percentile),
        fcp: percentile(runs.map((r) => r.fcp), opts.percentile),
        tbt: percentile(runs.map((r) => r.tbt), opts.percentile),
        cls: percentile(runs.map((r) => r.cls), opts.percentile),
      },
    };
    if (opts.diagnostics) {
      routeResult.diagnostics = summarizeRouteDiagnostics(routePath, runs);
    }
    results.push(routeResult);
  }

  const failedRoutes = results.filter(
    (result) =>
      result.baseline.lcp > opts.lcpThresholdMs || result.baseline.seo < opts.seoThreshold
  );

  const summary = {
    generatedAt: new Date().toISOString(),
    config: {
      baseUrl: opts.baseUrl,
      runs: opts.runs,
      percentile: opts.percentile,
      lcpThresholdMs: opts.lcpThresholdMs,
      seoThreshold: opts.seoThreshold,
      paths: opts.paths,
      cooldownMs: opts.cooldownMs,
      diagnostics: opts.diagnostics,
      isolate: Boolean(opts.isolate),
    },
    results,
    pass: failedRoutes.length === 0,
    failedPaths: failedRoutes.map((route) => route.path),
  };

  const summaryPath = path.join(runDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  await fs.writeFile(path.join(opts.outputDir, "perf-gate-latest.json"), JSON.stringify(summary, null, 2));

  printSummary(opts, summary, summaryPath);

  if (failedRoutes.length > 0) {
    console.error("");
    console.error(
      `Performance gate failed (P${opts.percentile} baseline). LCP must be <= ${opts.lcpThresholdMs}ms and SEO must be >= ${opts.seoThreshold}.`
    );
    for (const route of failedRoutes) {
      console.error(
        `- ${route.path}: lcp=${route.baseline.lcp}ms seo=${route.baseline.seo}`
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
