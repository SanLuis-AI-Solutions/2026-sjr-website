import { stat } from "node:fs/promises";
import sharp from "sharp";

const targets = [
  {
    input: "public/images/home/home-hero-ring.jpg",
    output: "public/images/home/home-hero-ring-mobile.avif",
    width: 640,
    quality: 52,
  },
  {
    input: "public/images/services/ring-sizing-hero.jpg",
    output: "public/images/services/ring-sizing-hero-mobile.avif",
    width: 640,
    quality: 50,
  },
  {
    input: "public/images/blog/ring-sizing-guide-cover.jpg",
    output: "public/images/blog/ring-sizing-guide-cover-mobile.avif",
    width: 640,
    quality: 50,
  },
];

for (const target of targets) {
  await sharp(target.input)
    .resize({ width: target.width, withoutEnlargement: true })
    .avif({ quality: target.quality, effort: 4 })
    .toFile(target.output);

  const source = await stat(target.input);
  const result = await stat(target.output);
  const saved = source.size - result.size;
  const pct = source.size > 0 ? Math.round((saved / source.size) * 100) : 0;

  console.log(
    `${target.output} -> ${Math.round(result.size / 1024)}KB (saved ${Math.round(
      saved / 1024
    )}KB, ${pct}%)`
  );
}

