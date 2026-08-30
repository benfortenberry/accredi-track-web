"""One-off: convert dark-blue brand assets to grayscale, preserving alpha.

Backs up each original to <name>.orig<ext>, desaturates RGB with luminance
weights, keeps the alpha channel, and preserves all embedded .ico sizes.
"""

import os
import shutil
from PIL import Image

# PNG assets (relative to repo root: accredi-track-web).
PNG_TARGETS = [
    "public/logo_dark_blue2.png",
    "public/auth0_logo.png",
]

# .ico favicons, which may bundle multiple resolutions.
ICO_TARGETS = [
    "public/favicon.ico",
    "public/favicon-dark.ico",
]


def _grayscale_rgba(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    r, g, b, a = img.split()
    gray = Image.merge("RGB", (r, g, b)).convert("L")
    return Image.merge("RGBA", (gray, gray, gray, a))


def _backup(path: str) -> None:
    root, ext = os.path.splitext(path)
    backup = f"{root}.orig{ext}"
    if not os.path.exists(backup):
        shutil.copy2(path, backup)
        print(f"backup -> {backup}")


def convert_png(path: str) -> None:
    if not os.path.exists(path):
        print(f"skip (not found): {path}")
        return
    _backup(path)
    out = _grayscale_rgba(Image.open(path))
    out.save(path)
    print(f"grayscaled -> {path}")


def convert_ico(path: str) -> None:
    if not os.path.exists(path):
        print(f"skip (not found): {path}")
        return
    _backup(path)

    im = Image.open(path)
    # Collect the bundled sizes so we can re-emit them all.
    sizes = sorted(im.ico.sizes()) if hasattr(im, "ico") else [im.size]

    # Grayscale the largest available frame, then let save() regenerate sizes.
    im.size  # noqa: touch
    base = _grayscale_rgba(im)
    base.save(path, format="ICO", sizes=sizes)
    print(f"grayscaled -> {path} (sizes: {sizes})")


if __name__ == "__main__":
    for t in PNG_TARGETS:
        convert_png(t)
    for t in ICO_TARGETS:
        convert_ico(t)
    print("done")
