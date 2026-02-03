import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const assets = [
  {
    source: "C:\\Users\\ninef\\Downloads\\before broken ring.jpg",
    dest: "before-after/before-ring.jpg",
  },
  {
    source: "C:\\Users\\ninef\\Downloads\\after repaired ring.png",
    dest: "before-after/after-ring.png",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_9a58b818ce1d49e3b7085f48759c7e97~mv2.jpg/v1/fill/w_1920,h_897,fp_0.57_0.48,q_85,enc_avif,quality_auto/d06bfd_9a58b818ce1d49e3b7085f48759c7e97~mv2.jpg",
    dest: "home/hero-ring.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/11062b_6c63015518d84e5da983ec6b65339fb9~mv2.jpeg/v1/fill/w_1400,h_900,al_c,q_90,enc_avif,quality_auto/11062b_6c63015518d84e5da983ec6b65339fb9~mv2.jpeg",
    dest: "home/workshop-main.jpeg",
  },
  {
    source:
      "https://static.wixstatic.com/media/11062b_cf4f37b0cadb4bbdb9e1b61241138aef~mv2.jpg/v1/fill/w_900,h_700,al_c,q_90,enc_avif,quality_auto/11062b_cf4f37b0cadb4bbdb9e1b61241138aef~mv2.jpg",
    dest: "home/workshop-sketches.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_0d2e7f67cc6f4694aad7421e9d0840b7~mv2.jpg/v1/fill/w_900,h_700,al_c,q_90,enc_avif,quality_auto/d06bfd_0d2e7f67cc6f4694aad7421e9d0840b7~mv2.jpg",
    dest: "home/workshop-pocket-watch.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_4ebbd859747640c082cd77706c7c8c02~mv2.jpg/v1/fill/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_4ebbd859747640c082cd77706c7c8c02~mv2.jpg",
    dest: "services/watch-repair.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_086f8237d5714df8bdbad481f641f7b7~mv2.jpg/v1/fill/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_086f8237d5714df8bdbad481f641f7b7~mv2.jpg",
    dest: "services/ring-sizing.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_ad017192378f4714b27ecc8474addbaf~mv2.jpg/v1/fill/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_ad017192378f4714b27ecc8474addbaf~mv2.jpg",
    dest: "services/stone-setting.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_504651541d6a4dd69e05a1972b5b38e6~mv2.png/v1/fit/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_504651541d6a4dd69e05a1972b5b38e6~mv2.png",
    dest: "services/jewelry-cleaning.png",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_dff02965e7234569bdf5f202d105b183~mv2.png/v1/fit/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_dff02965e7234569bdf5f202d105b183~mv2.png",
    dest: "services/necklace-repair.png",
  },
  {
    source:
      "https://static.wixstatic.com/media/11062b_c8169cb783c149dab1be58d1771dfaba~mv2.jpg/v1/fill/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/11062b_c8169cb783c149dab1be58d1771dfaba~mv2.jpg",
    dest: "services/bracelet-repair.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_2b06332d671b4ef3a9df907da5d11a31~mv2.png/v1/fit/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_2b06332d671b4ef3a9df907da5d11a31~mv2.png",
    dest: "services/pearl-restringing.png",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_0f268732483b44829e68dc353181fab1~mv2.jpg/v1/fit/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_0f268732483b44829e68dc353181fab1~mv2.jpg",
    dest: "services/custom-design.jpg",
  },
  {
    source:
      "https://static.wixstatic.com/media/d06bfd_4cb321b6aff64877a8e2793685958aca~mv2.jpg/v1/fill/w_1400,h_1000,al_c,q_90,enc_avif,quality_auto/d06bfd_4cb321b6aff64877a8e2793685958aca~mv2.jpg",
    dest: "services/heirloom-restoration.jpg",
  },
];

function contentTypeFor(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpeg") || lower.endsWith(".jpg")) return "image/jpeg";
  return "application/octet-stream";
}

async function readSource(source) {
  if (source.startsWith("http")) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to download ${source}: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  return fs.readFileSync(source);
}

async function uploadAsset(asset) {
  const buffer = await readSource(asset.source);
  const url = `${supabaseUrl}/storage/v1/object/site-assets/${asset.dest}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      "Content-Type": contentTypeFor(asset.dest),
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${asset.dest}: ${res.status} ${text}`);
  }
  return asset.dest;
}

async function main() {
  for (const asset of assets) {
    await uploadAsset(asset);
    console.log(`Uploaded ${asset.dest}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
