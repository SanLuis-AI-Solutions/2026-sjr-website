import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const KB = 1024;
const DEFAULT_MIN_KB = 35;
const DEFAULT_MAX_KB = 55;
const DEFAULT_WIDTH = 720;
const MANIFEST_PATH = ".health/service-mobile-hero-manifest-step6-pilot.json";
const QUALITY_CANDIDATES = [92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58, 56, 54, 52, 50];

function parseArgs(argv) {
  const opts = {
    minKb: Number(process.env.PERF_HERO_MIN_KB || DEFAULT_MIN_KB),
    maxKb: Number(process.env.PERF_HERO_MAX_KB || DEFAULT_MAX_KB),
    width: Number(process.env.PERF_HERO_WIDTH || DEFAULT_WIDTH),
    slugs: [],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--slugs") {
      opts.slugs = String(argv[++i] || "")
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean);
    } else if (token === "--min-kb") {
      opts.minKb = Number(argv[++i]);
    } else if (token === "--max-kb") {
      opts.maxKb = Number(argv[++i]);
    } else if (token === "--width") {
      opts.width = Number(argv[++i]);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!Number.isFinite(opts.minKb) || opts.minKb <= 0) {
    throw new Error(`Invalid --min-kb value: ${opts.minKb}`);
  }
  if (!Number.isFinite(opts.maxKb) || opts.maxKb <= opts.minKb) {
    throw new Error(`Invalid --max-kb value: ${opts.maxKb}`);
  }
  if (!Number.isFinite(opts.width) || opts.width < 200) {
    throw new Error(`Invalid --width value: ${opts.width}`);
  }
  if (opts.slugs.length === 0) {
    throw new Error("Missing required --slugs argument (comma-separated service slugs).");
  }

  return opts;
}

function kbToBytes(kb) {
  return Math.round(kb * KB);
}

async function renderAvif(input, output, width, quality) {
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality, effort: 4 })
    .toFile(output);
  const out = await stat(output);
  return out.size;
}

async function encodeWithinBudget(target, opts) {
  const minBytes = kbToBytes(opts.minKb);
  const maxBytes = kbToBytes(opts.maxKb);
  let best = null;

  for (const quality of QUALITY_CANDIDATES) {
    const size = await renderAvif(target.input, target.output, opts.width, quality);
    const delta = size > maxBytes ? size - maxBytes : size < minBytes ? minBytes - size : 0;
    const candidate = { quality, size, delta };
    if (!best || candidate.delta < best.delta) best = candidate;
    if (size >= minBytes && size <= maxBytes) {
      return candidate;
    }
  }

  return best;
}

function toTarget(slug) {
  return {
    slug,
    input: `public/images/services/${slug}-hero.jpg`,
    output: `public/images/services/${slug}-hero-mobile.avif`,
  };
}

const opts = parseArgs(process.argv);
const targets = Array.from(new Set(opts.slugs)).map(toTarget);
console.log(
  `Generating service mobile AVIF heroes for [${targets.map((target) => target.slug).join(", ")}] with target ${opts.minKb}-${opts.maxKb}KB at width ${opts.width}px`
);

const manifestRows = [];

for (const target of targets) {
  const source = await stat(target.input);
  const chosen = await encodeWithinBudget(target, opts);
  if (!chosen) {
    throw new Error(`Failed to generate ${target.output}`);
  }

  const saved = source.size - chosen.size;
  const pct = source.size > 0 ? Math.round((saved / source.size) * 100) : 0;
  const inRange = chosen.size >= kbToBytes(opts.minKb) && chosen.size <= kbToBytes(opts.maxKb);
  const finalKb = Number((chosen.size / KB).toFixed(1));

  manifestRows.push({
    slug: target.slug,
    source: target.input,
    output: target.output,
    quality: chosen.quality,
    finalKB: finalKb,
    inRange,
  });

  console.log(
    `${target.output} -> ${Math.round(chosen.size / KB)}KB @q${chosen.quality} ${
      inRange ? "[within target]" : "[closest]"
    } (saved ${Math.round(saved / KB)}KB, ${pct}%)`
  );
}

const manifest = {
  generatedAt: new Date().toISOString(),
  config: {
    minKb: opts.minKb,
    maxKb: opts.maxKb,
    width: opts.width,
    slugs: targets.map((target) => target.slug),
  },
  results: manifestRows,
};

await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Manifest written to ${MANIFEST_PATH}`);
