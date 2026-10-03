"""Static checks for the portfolio: links, anchors, images, image files, assets, CSS variables,
and the downloadable resume PDF.

Uses only the Python standard library so it runs anywhere CI has Python.
"""

from __future__ import annotations

import hashlib
import re
import struct
import zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://mykoladotsenko.github.io/developer-profile/"
SITE_PATH = "/developer-profile/"
HTML_PATHS = sorted(ROOT.glob("*.html"))
CSS_PATHS = sorted(ROOT.glob("*.css"))
TEXT_SOURCES = HTML_PATHS + CSS_PATHS + sorted(ROOT.glob("*.js")) + [ROOT / "README.md"]
ASSET_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".woff2", ".txt", ".pdf"}
ASSET_IGNORES = {"sitemap.xml"}
SKIPPED_DIRS = {".git", "node_modules", "test-results", "playwright-report"}

RESUME_PDF = ROOT / "Mykola-Dotsenko-Resume.pdf"
RESUME_PDF_HASH = ROOT / "scripts" / "resume-pdf.sha256"
# Keep in sync with INPUTS in scripts/render_resume_pdf.js.
RESUME_PDF_INPUTS = [
    "resume.html",
    "resume.css",
    "assets/fonts/fraunces-latin-opsz-normal.woff2",
    "assets/fonts/inter-latin-wght-normal.woff2",
    "scripts/render_resume_pdf.js",
]

CSS_DEFINITION = re.compile(r"(--[\w-]+)\s*:")
CSS_USAGE = re.compile(r"var\(\s*(--[\w-]+)")
CSS_URL = re.compile(r"url\(\s*[\"']?([^\"')]+)[\"']?\s*\)")


class PageParser(HTMLParser):
    """Collect IDs, references, images, and new-tab links from one HTML page."""

    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.references: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.new_tab_links: list[dict[str, str | None]] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        attributes = dict(attrs)

        element_id = attributes.get("id")
        if element_id:
            self.ids.add(element_id)

        for attribute in ("href", "src"):
            value = attributes.get(attribute)
            if value:
                self.references.append(value)

        if tag == "meta" and attributes.get("content", "").startswith(SITE_URL):
            self.references.append(attributes["content"] or "")

        if tag == "img":
            self.images.append(attributes)

        if attributes.get("target") == "_blank":
            self.new_tab_links.append(attributes)


def local_path_for(reference: str, base: Path) -> Path | None:
    """Map a reference to a file in the repository, or None if it is external."""

    if reference.startswith(SITE_URL):
        reference = SITE_PATH + reference.removeprefix(SITE_URL)

    parsed = urlparse(reference)
    if parsed.scheme or parsed.netloc:
        return None

    path = parsed.path
    if not path:
        return None

    if path.startswith(SITE_PATH):
        target = ROOT / path.removeprefix(SITE_PATH)
    else:
        target = (base / path).resolve()

    if path.endswith("/"):
        target = target / "index.html"

    return target


def check_html(html_path: Path) -> list[str]:
    parser = PageParser()
    parser.feed(html_path.read_text(encoding="utf-8"))
    name = html_path.name
    errors: list[str] = []

    for reference in parser.references:
        if reference.startswith("#"):
            target = reference.removeprefix("#")
            if target and target not in parser.ids:
                errors.append(f"{name}: missing anchor target {reference}")
            continue

        local_path = local_path_for(reference, html_path.parent)
        if local_path is not None and not local_path.exists():
            errors.append(f"{name}: missing local file {reference}")

    for image in parser.images:
        source = image.get("src")
        if "alt" not in image:
            errors.append(f"{name}: <img src={source}> has no alt attribute")
        if not image.get("width") or not image.get("height"):
            errors.append(f"{name}: <img src={source}> needs width and height to avoid layout shift")

    for link in parser.new_tab_links:
        rel = (link.get("rel") or "").split()
        if "noopener" not in rel and "noreferrer" not in rel:
            errors.append(f"{name}: target=_blank link {link.get('href')} needs rel=noopener or noreferrer")

    return errors


def check_css(css_path: Path) -> list[str]:
    text = re.sub(r"/\*.*?\*/", "", css_path.read_text(encoding="utf-8"), flags=re.S)
    name = css_path.name
    errors: list[str] = []

    defined = set(CSS_DEFINITION.findall(text))
    for variable in sorted(set(CSS_USAGE.findall(text)) - defined):
        errors.append(f"{name}: var({variable}) is used but never defined")

    for reference in CSS_URL.findall(text):
        local_path = local_path_for(reference, css_path.parent)
        if local_path is not None and not local_path.exists():
            errors.append(f"{name}: missing file in url({reference})")

    return errors


def check_unused_assets() -> list[str]:
    corpus = "\n".join(path.read_text(encoding="utf-8") for path in TEXT_SOURCES if path.exists())
    errors: list[str] = []

    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT).as_posix()
        if (
            not path.is_file()
            or path.suffix.lower() not in ASSET_SUFFIXES
            or relative.split("/", 1)[0] in SKIPPED_DIRS
            or relative in ASSET_IGNORES
        ):
            continue
        if relative not in corpus:
            errors.append(f"{relative}: asset is not referenced by any page, stylesheet, script, or README")

    return errors


def png_error(data: bytes) -> str | None:
    """Walk the PNG chunks; a truncated or corrupted file fails here."""

    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "not a PNG signature"

    offset = 8
    while offset + 12 <= len(data):
        length, kind = struct.unpack(">I4s", data[offset : offset + 8])
        end = offset + 12 + length
        if end > len(data):
            return f"{kind.decode('latin1')} chunk is truncated"
        body = data[offset + 4 : offset + 8 + length]
        (crc,) = struct.unpack(">I", data[offset + 8 + length : end])
        if zlib.crc32(body) != crc:
            return f"{kind.decode('latin1')} chunk has a bad checksum"
        if kind == b"IEND":
            return None
        offset = end

    return "missing IEND chunk"


def webp_error(data: bytes) -> str | None:
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return "not a WebP header"
    if struct.unpack("<I", data[4:8])[0] + 8 != len(data):
        return "RIFF size does not match the file size"
    return None


def check_image_files() -> list[str]:
    validators = {".png": png_error, ".webp": webp_error}
    errors: list[str] = []

    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT).as_posix()
        validator = validators.get(path.suffix.lower())
        if validator is None or relative.split("/", 1)[0] in SKIPPED_DIRS:
            continue
        problem = validator(path.read_bytes())
        if problem:
            errors.append(f"{relative}: broken image file ({problem})")

    return errors


def resume_pdf_source_hash() -> str:
    digest = hashlib.sha256()
    for relative in RESUME_PDF_INPUTS:
        digest.update(relative.encode())
        digest.update(b"\0")
        digest.update((ROOT / relative).read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def check_resume_pdf() -> list[str]:
    """The PDF must exist, have two pages, and be rebuilt whenever its sources change."""

    name = RESUME_PDF.name
    if not RESUME_PDF.exists():
        return [f"{name}: missing; run npm run resume-pdf"]

    data = RESUME_PDF.read_bytes()
    errors: list[str] = []
    if not data.startswith(b"%PDF-") or b"%%EOF" not in data[-1024:]:
        errors.append(f"{name}: not a complete PDF file")

    pages = len(re.findall(rb"/Type\s*/Page[^s]", data))
    if pages != 2:
        errors.append(f"{name}: expected 2 pages, found {pages}")

    recorded = RESUME_PDF_HASH.read_text().strip() if RESUME_PDF_HASH.exists() else ""
    if recorded != resume_pdf_source_hash():
        errors.append(f"{name}: out of date with resume.html/resume.css; run npm run resume-pdf")

    return errors


def main() -> int:
    errors = [error for path in HTML_PATHS for error in check_html(path)]
    errors += [error for path in CSS_PATHS for error in check_css(path)]
    errors += check_unused_assets()
    errors += check_image_files()
    errors += check_resume_pdf()

    if errors:
        print("Site checks failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"Site checks passed: {len(HTML_PATHS)} HTML pages, {len(CSS_PATHS)} stylesheets, "
        "links, anchors, images, image files, assets, CSS variables, and the resume PDF.",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
