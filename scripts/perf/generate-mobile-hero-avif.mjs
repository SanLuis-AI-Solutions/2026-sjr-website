import { stat } from "node:fs/promises";
import sharp from "sharp";

const KB = 1024;
const DEFAULT_MIN_KB = 15;
const DEFAULT_MAX_KB = 25;
const DEFAULT_WIDTH = 640;

function parseArgs(argv) {
  const opts = {
    minKb: Number(process.env.PERF_HERO_MIN_KB || DEFAULT_MIN_KB),
    maxKb: Number(process.env.PERF_HERO_MAX_KB || DEFAULT_MAX_KB),
    width: Number(process.env.PERF_HERO_WIDTH || DEFAULT_WIDTH),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--min-kb") {
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
  const qualityCandidates = [90, 86, 82, 78, 74, 70, 66, 62, 58, 54, 50, 46, 42, 38, 34, 30, 26, 22];
  let best = null;

  for (const quality of qualityCandidates) {
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

const targets = [
  {
    input: "public/images/home/home-hero-ring.jpg",
    output: "public/images/home/home-hero-ring-mobile.avif",
  },
  {
    input: "public/images/services/ring-sizing-hero.jpg",
    output: "public/images/services/ring-sizing-hero-mobile.avif",
  },
  {
    input: "public/images/blog/ring-sizing-guide-cover.jpg",
    output: "public/images/blog/ring-sizing-guide-cover-mobile.avif",
  },
];

const opts = parseArgs(process.argv);
console.log(
  `Generating mobile AVIF heroes with target ${opts.minKb}-${opts.maxKb}KB at width ${opts.width}px`
);

for (const target of targets) {
  const source = await stat(target.input);
  const chosen = await encodeWithinBudget(target, opts);
  if (!chosen) {
    throw new Error(`Failed to generate ${target.output}`);
  }

  const saved = source.size - chosen.size;
  const pct = source.size > 0 ? Math.round((saved / source.size) * 100) : 0;
  const inRange = chosen.size >= kbToBytes(opts.minKb) && chosen.size <= kbToBytes(opts.maxKb);

  console.log(
    `${target.output} -> ${Math.round(chosen.size / KB)}KB @q${chosen.quality} ${
      inRange ? "[within target]" : "[closest]"
    } (saved ${Math.round(saved / KB)}KB, ${pct}%)`
  );
}
