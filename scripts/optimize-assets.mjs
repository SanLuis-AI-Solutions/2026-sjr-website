#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

function parseArgs(argv) {
  const args = { dir: "", maxSize: "400kb" };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--dir") args.dir = argv[i + 1] || "";
    if (token === "--max-size") args.maxSize = argv[i + 1] || "";
  }
  if (!args.dir) {
    throw new Error("Missing required --dir argument.");
  }
  return args;
}

function parseSizeToBytes(input) {
  const raw = String(input || "").trim().toLowerCase();
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb)?$/);
  if (!match) throw new Error(`Invalid size format: ${input}`);
  const value = Number(match[1]);
  const unit = match[2] || "b";
  if (unit === "kb") return Math.round(value * 1024);
  if (unit === "mb") return Math.round(value * 1024 * 1024);
  return Math.round(value);
}

async function listImageFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listImageFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function getProfile(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes("-hero")) {
    return { maxWidth: 1920, quality: 80, minWidth: 960 };
  }
  return { maxWidth: 1200, quality: 75, minWidth: 640 };
}

async function optimizeFile(filePath, maxBytes) {
  const baseName = path.basename(filePath);
  const profile = getProfile(baseName);
  const originalMeta = await fs.stat(filePath);
  const inputBytes = await fs.readFile(filePath);
  const metadata = await sharp(inputBytes).metadata();
  const sourceWidth = metadata.width || profile.maxWidth;

  let width = Math.min(sourceWidth, profile.maxWidth);
  let quality = profile.quality;
  let output = Buffer.alloc(0);
  let attempts = 0;

  while (attempts < 14) {
    attempts += 1;
    output = await sharp(inputBytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();

    if (output.length <= maxBytes) break;

    if (width > profile.minWidth) {
      width = Math.max(profile.minWidth, Math.floor(width * 0.9));
      continue;
    }

    if (quality > 55) {
      quality -= 5;
      continue;
    }

    break;
  }

  await fs.writeFile(filePath, output);
  const finalMeta = await fs.stat(filePath);

  return {
    filePath,
    before: originalMeta.size,
    after: finalMeta.size,
    width,
    quality,
    ok: finalMeta.size <= maxBytes,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const args = parseArgs(process.argv);
  const rootDir = path.resolve(args.dir);
  const maxBytes = parseSizeToBytes(args.maxSize);

  const files = await listImageFiles(rootDir);
  if (files.length === 0) {
    console.log(`No images found in ${rootDir}`);
    return;
  }

  const results = [];
  for (const filePath of files) {
    results.push(await optimizeFile(filePath, maxBytes));
  }

  let failures = 0;
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const result of results) {
    beforeTotal += result.before;
    afterTotal += result.after;
    if (!result.ok) failures += 1;
    const relative = path.relative(rootDir, result.filePath);
    console.log(
      `${result.ok ? "OK" : "FAIL"} ${relative} | ${formatBytes(result.before)} -> ${formatBytes(result.after)} | width=${result.width} quality=${result.quality}`
    );
  }

  const saved = beforeTotal - afterTotal;
  const pct = beforeTotal > 0 ? ((saved / beforeTotal) * 100).toFixed(1) : "0.0";
  console.log("");
  console.log(`Optimized ${results.length} files in ${rootDir}`);
  console.log(`Total size: ${formatBytes(beforeTotal)} -> ${formatBytes(afterTotal)} (saved ${formatBytes(saved)}, ${pct}%)`);
  console.log(`Target threshold: ${formatBytes(maxBytes)}`);

  if (failures > 0) {
    throw new Error(`${failures} file(s) are still above the maximum size threshold.`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
