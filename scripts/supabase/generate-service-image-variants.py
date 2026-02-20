from __future__ import annotations

import io
import json
import random
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urlencode

import requests
from PIL import Image, ImageEnhance, ImageFilter

OUTPUT_DIR = Path("assets/generated/services-v4")
TARGET_SIZE = (1600, 1066)
OPENVERSE_URL = "https://api.openverse.org/v1/images/"
WIKIMEDIA_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "SJRWebsiteBot/1.0 (contact@susiesjewelryrepair.com)"
MIN_SIDE = 900

SLOTS = [
    # name, center_x, center_y, contrast, color, sharpness
    ("hero", 0.50, 0.50, 1.03, 1.03, 1.05),
    ("support", 0.44, 0.48, 1.05, 1.04, 1.08),
    ("process-a", 0.46, 0.44, 1.06, 1.04, 1.10),
    ("process-b", 0.57, 0.44, 1.07, 1.05, 1.11),
    ("process-c", 0.40, 0.58, 1.06, 1.04, 1.10),
    ("expect-a", 0.52, 0.52, 1.04, 1.03, 1.08),
    ("expect-b", 0.42, 0.42, 1.05, 1.03, 1.09),
    ("why", 0.50, 0.60, 1.04, 1.03, 1.08),
]

SERVICE_QUERIES = {
    "watch-repair": [
        "watch repair",
        "watchmaker",
        "wrist watch movement",
        "watch workshop",
    ],
    "ring-sizing": [
        "engagement ring",
        "ring jewelry",
        "jeweler ring",
        "diamond ring",
    ],
    "stone-setting": [
        "gemstone jewelry",
        "diamond setting",
        "jeweler gemstone",
        "ring gemstone closeup",
    ],
    "jewelry-cleaning": [
        "jewelry polishing",
        "jewelry shine",
        "jeweler bench",
        "gold jewelry closeup",
    ],
    "necklace-repair": [
        "necklace jewelry",
        "jewelry chain",
        "gold chain",
        "necklace clasp",
    ],
    "bracelet-repair": [
        "bracelet jewelry",
        "gold bracelet",
        "silver bracelet",
        "bracelet clasp",
    ],
    "pearl-restringing": [
        "pearl necklace",
        "pearls jewelry",
        "bead necklace",
        "white pearls",
    ],
    "custom-design": [
        "jewelry design",
        "jeweler sketch",
        "custom ring",
        "jewelry workshop",
    ],
    "heirloom-restoration": [
        "antique jewelry",
        "vintage ring",
        "heirloom jewelry",
        "restored jewelry",
    ],
}

GLOBAL_FALLBACK_QUERIES = [
    "jewelry",
    "jeweler bench",
    "luxury jewelry",
    "artisan workshop",
]

SERVICE_INCLUDE_TERMS = {
    "watch-repair": ["watch", "clock", "watchmaker", "repair"],
    "ring-sizing": ["ring", "rings", "jewelry", "jewellery", "jeweler", "goldsmith"],
    "stone-setting": ["stone", "gem", "diamond", "jewelry", "jewellery", "setting"],
    "jewelry-cleaning": ["jewelry", "jewellery", "gold", "silver", "polish", "clean"],
    "necklace-repair": ["necklace", "chain", "jewelry", "jewellery", "clasp"],
    "bracelet-repair": ["bracelet", "bangle", "jewelry", "jewellery", "clasp"],
    "pearl-restringing": ["pearl", "bead", "necklace", "jewelry", "jewellery"],
    "custom-design": ["design", "jewelry", "jewellery", "workshop", "goldsmith", "bench"],
    "heirloom-restoration": ["vintage", "antique", "jewelry", "jewellery", "restoration", "jeweler"],
}

GLOBAL_EXCLUDE_TERMS = [
    "mycenaean",
    "funerary",
    "protogeometric",
    "sepulture",
    "neolithic",
    "bronze age",
    "archaeological",
    "artifact",
    "pottery",
    "grave",
    "burial",
    "nama",
    "museum collection",
]


@dataclass
class Candidate:
    id: str
    url: str
    width: int
    height: int
    title: str
    license: str
    creator: str
    source: str


def openverse_search(query: str, page: int = 1, page_size: int = 80) -> list[Candidate]:
    params = {
        "q": query,
        "license": "cc0,pdm",
        "mature": "false",
        "page_size": str(page_size),
        "page": str(page),
    }
    url = f"{OPENVERSE_URL}?{urlencode(params)}"
    response = requests.get(
        url,
        timeout=45,
        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
    )
    if response.status_code == 429:
        return []
    response.raise_for_status()
    payload = response.json()

    results: list[Candidate] = []
    for item in payload.get("results", []):
        src = item.get("url") or ""
        width = int(item.get("width") or 0)
        height = int(item.get("height") or 0)
        if not src or width < MIN_SIDE or height < MIN_SIDE:
            continue
        results.append(
            Candidate(
                id=str(item.get("id") or src),
                url=src,
                width=width,
                height=height,
                title=str(item.get("title") or "Untitled"),
                license=str(item.get("license") or ""),
                creator=str(item.get("creator") or "Unknown"),
                source=str(item.get("source") or "openverse"),
            )
        )
    return results


def strip_html(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value or "").strip()


def wikimedia_search(query: str, limit: int = 50) -> list[Candidate]:
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "format": "json",
    }
    response = requests.get(
        WIKIMEDIA_URL,
        params=params,
        timeout=45,
        headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
    )
    response.raise_for_status()
    payload = response.json()
    pages = payload.get("query", {}).get("pages", {})

    results: list[Candidate] = []
    for item in pages.values():
        info = (item.get("imageinfo") or [{}])[0]
        mime = str(info.get("mime") or "")
        width = int(info.get("width") or 0)
        height = int(info.get("height") or 0)
        src = str(info.get("url") or "")
        if not src or width < MIN_SIDE or height < MIN_SIDE:
            continue
        if mime not in {"image/jpeg", "image/png"}:
            continue
        meta = info.get("extmetadata") or {}
        license_name = strip_html((meta.get("LicenseShortName") or {}).get("value", ""))
        creator = strip_html((meta.get("Artist") or {}).get("value", "Unknown"))
        results.append(
            Candidate(
                id=str(item.get("pageid") or src),
                url=src,
                width=width,
                height=height,
                title=strip_html(str(item.get("title") or "Untitled")),
                license=license_name or "Wikimedia",
                creator=creator or "Unknown",
                source="wikimedia",
            )
        )
    return results


def gather_candidates(queries: Iterable[str], needed: int) -> list[Candidate]:
    by_url: dict[str, Candidate] = {}
    for query in queries:
        for page in range(1, 3):
            try:
                rows = openverse_search(query, page=page, page_size=40)
            except Exception:
                rows = []
            for row in rows:
                by_url[row.url] = row
            if len(by_url) >= needed * 2:
                break
            time.sleep(0.25)

        if len(by_url) < needed:
            try:
                rows = wikimedia_search(query, limit=50)
            except Exception:
                rows = []
            for row in rows:
                by_url[row.url] = row

        if len(by_url) >= needed * 2:
            break
    return list(by_url.values())


def candidate_matches_service(candidate: Candidate, slug: str) -> bool:
    text = f"{candidate.title} {candidate.creator}".lower()
    for bad in GLOBAL_EXCLUDE_TERMS:
        if bad in text:
            return False
    include_terms = SERVICE_INCLUDE_TERMS.get(slug, [])
    if not include_terms:
        return True
    return any(token in text for token in include_terms)


def download_image(url: str) -> Image.Image:
    for attempt in range(1, 4):
        try:
            response = requests.get(
                url,
                timeout=60,
                headers={"User-Agent": USER_AGENT, "Accept": "image/*,*/*;q=0.8"},
            )
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content)).convert("RGB")
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.0 * attempt)
    raise RuntimeError(f"Failed to download {url}")


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def crop_variant(img: Image.Image, center_x: float, center_y: float) -> Image.Image:
    src_w, src_h = img.size
    target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]
    src_ratio = src_w / src_h if src_h else target_ratio

    if src_ratio > target_ratio:
        crop_h = src_h
        crop_w = int(crop_h * target_ratio)
    else:
        crop_w = src_w
        crop_h = int(crop_w / target_ratio)

    cx = int(clamp(center_x, 0.0, 1.0) * src_w)
    cy = int(clamp(center_y, 0.0, 1.0) * src_h)
    left = int(clamp(cx - crop_w // 2, 0, src_w - crop_w))
    top = int(clamp(cy - crop_h // 2, 0, src_h - crop_h))
    cropped = img.crop((left, top, left + crop_w, top + crop_h))
    return cropped.resize(TARGET_SIZE, Image.Resampling.LANCZOS)


def style_variant(img: Image.Image, contrast: float, color: float, sharpness: float) -> Image.Image:
    out = ImageEnhance.Contrast(img).enhance(contrast)
    out = ImageEnhance.Color(out).enhance(color)
    out = ImageEnhance.Sharpness(out).enhance(sharpness)
    return out.filter(ImageFilter.UnsharpMask(radius=1.1, percent=115, threshold=2))


def pick_slot_sources(candidates: list[Candidate], slug: str) -> list[Candidate]:
    if not candidates:
        raise RuntimeError(f"No candidates available for {slug}")

    rng = random.Random(f"{slug}-v4-openverse")
    ranked = sorted(candidates, key=lambda c: (c.width * c.height), reverse=True)
    top_band = ranked[: max(len(SLOTS) * 3, 16)]
    rng.shuffle(top_band)

    chosen: list[Candidate] = []
    seen = set()
    for item in top_band:
        if item.url in seen:
            continue
        chosen.append(item)
        seen.add(item.url)
        if len(chosen) >= len(SLOTS):
            break

    while len(chosen) < len(SLOTS):
        chosen.append(rng.choice(ranked))
    return chosen


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, dict[str, str]] = {}
    source_manifest: dict[str, dict[str, dict[str, str]]] = {}
    cache: dict[str, Image.Image] = {}

    fallback_pool = gather_candidates(GLOBAL_FALLBACK_QUERIES, needed=64)

    for slug, queries in SERVICE_QUERIES.items():
        print(f"Generating Openverse variants for {slug} ...")
        service_pool = gather_candidates(queries, needed=len(SLOTS) * 2)
        pool = service_pool + [c for c in fallback_pool if c.url not in {x.url for x in service_pool}]
        filtered_pool = [c for c in pool if candidate_matches_service(c, slug)]
        if len(filtered_pool) >= len(SLOTS):
            pool = filtered_pool
        if len(pool) < len(SLOTS):
            raise RuntimeError(f"Not enough candidate images for {slug}: {len(pool)} found")

        slots = pick_slot_sources(pool, slug)
        manifest[slug] = {}
        source_manifest[slug] = {}

        for (slot_name, cx, cy, contrast, color, sharpness), source in zip(SLOTS, slots):
            if source.url not in cache:
                cache[source.url] = download_image(source.url)
            base_img = cache[source.url]
            variant = crop_variant(base_img, cx, cy)
            variant = style_variant(variant, contrast, color, sharpness)

            filename = f"{slug}-{slot_name}.jpg"
            file_path = OUTPUT_DIR / filename
            variant.save(
                file_path,
                format="JPEG",
                quality=90,
                optimize=False,
                progressive=False,
                subsampling="4:2:0",
            )

            manifest[slug][slot_name] = str(file_path).replace("\\", "/")
            source_manifest[slug][slot_name] = {
                "url": source.url,
                "title": source.title,
                "license": source.license,
                "creator": source.creator,
                "source": source.source,
            }
            print(f"  -> {file_path}")

    (OUTPUT_DIR / "manifest.local.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )
    (OUTPUT_DIR / "manifest.sources.json").write_text(
        json.dumps(source_manifest, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote manifests: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
