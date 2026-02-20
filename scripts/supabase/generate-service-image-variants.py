from __future__ import annotations

import io
import json
import urllib.request
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

OUTPUT_DIR = Path("assets/generated/services-v3")
TARGET_SIZE = (1600, 1066)

SOURCE_IMAGES = {
    "watch-repair": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/watch-repair.jpg",
    "ring-sizing": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/ring-sizing.jpg",
    "stone-setting": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/stone-setting.jpg",
    "jewelry-cleaning": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/jewelry-cleaning.png",
    "necklace-repair": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/necklace-repair.png",
    "bracelet-repair": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/bracelet-repair.jpg",
    "pearl-restringing": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/pearl-restringing.png",
    "custom-design": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/custom-design.jpg",
    "heirloom-restoration": "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/services/heirloom-restoration.jpg",
}

VARIANTS = [
    # name, crop width ratio, center x ratio, center y ratio, contrast, color, sharpness
    ("hero", 1.00, 0.50, 0.48, 1.05, 1.02, 1.04),
    ("support", 0.90, 0.43, 0.46, 1.08, 1.03, 1.08),
    ("process-a", 0.82, 0.48, 0.44, 1.10, 1.04, 1.11),
    ("process-b", 0.76, 0.62, 0.42, 1.11, 1.05, 1.12),
    ("process-c", 0.74, 0.36, 0.58, 1.09, 1.03, 1.13),
    ("expect-a", 0.84, 0.56, 0.50, 1.07, 1.02, 1.08),
    ("expect-b", 0.78, 0.40, 0.40, 1.10, 1.03, 1.10),
    ("why", 0.88, 0.52, 0.60, 1.08, 1.02, 1.09),
]


def download_image(url: str) -> Image.Image:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "image/*,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        data = response.read()
    return Image.open(io.BytesIO(data)).convert("RGB")


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def crop_variant(
    img: Image.Image,
    crop_ratio: float,
    center_x: float,
    center_y: float,
) -> Image.Image:
    src_w, src_h = img.size
    target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]

    crop_w = int(src_w * crop_ratio)
    crop_h = int(crop_w / target_ratio)
    if crop_h > src_h:
        crop_h = src_h
        crop_w = int(crop_h * target_ratio)

    cx = int(clamp(center_x, 0.0, 1.0) * src_w)
    cy = int(clamp(center_y, 0.0, 1.0) * src_h)

    left = int(clamp(cx - crop_w // 2, 0, src_w - crop_w))
    top = int(clamp(cy - crop_h // 2, 0, src_h - crop_h))
    right = left + crop_w
    bottom = top + crop_h

    cropped = img.crop((left, top, right, bottom))
    return cropped.resize(TARGET_SIZE, Image.Resampling.LANCZOS)


def style_variant(
    img: Image.Image,
    contrast: float,
    color: float,
    sharpness: float,
) -> Image.Image:
    out = ImageEnhance.Contrast(img).enhance(contrast)
    out = ImageEnhance.Color(out).enhance(color)
    out = ImageEnhance.Sharpness(out).enhance(sharpness)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.1, percent=115, threshold=2))
    return out


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, dict[str, str]] = {}

    for slug, url in SOURCE_IMAGES.items():
        print(f"Generating variants for {slug} ...")
        base = download_image(url)
        manifest[slug] = {}

        for name, crop_ratio, cx, cy, contrast, color, sharpness in VARIANTS:
            variant = crop_variant(base, crop_ratio, cx, cy)
            variant = style_variant(variant, contrast, color, sharpness)

            filename = f"{slug}-{name}.jpg"
            file_path = OUTPUT_DIR / filename
            variant.save(
                file_path,
                format="JPEG",
                quality=90,
                optimize=False,
                progressive=False,
                subsampling="4:2:0",
            )
            manifest[slug][name] = str(file_path).replace("\\", "/")
            print(f"  -> {file_path}")

    manifest_path = OUTPUT_DIR / "manifest.local.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote manifest: {manifest_path}")


if __name__ == "__main__":
    main()
