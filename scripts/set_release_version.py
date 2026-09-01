#!/usr/bin/env python3
"""Validate and update Deferred Actions release metadata from one version value."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import argparse
import re

ROOT = Path(__file__).resolve().parents[1]
SEMVER = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")


@dataclass(frozen=True)
class VersionSpec:
    """One version-bearing file and the patterns used to read and update it."""

    label: str
    path: str
    extract_pattern: str
    replace_pattern: str
    flags: int = 0


SPECS = (
    VersionSpec(
        "Python package",
        "pyproject.toml",
        r'^version = "([^"]+)"$',
        r'(^version = ")[^"]+("$)',
        re.MULTILINE,
    ),
    VersionSpec(
        "Home Assistant manifest",
        "custom_components/deferred_actions/manifest.json",
        r'^  "version": "([^"]+)"$',
        r'(^  "version": ")[^"]+("$)',
        re.MULTILINE,
    ),
    VersionSpec(
        "frontend package",
        "frontend/package.json",
        r'^  "version": "([^"]+)"$',
        r'(^  "version": ")[^"]+("$)',
        re.MULTILINE,
    ),
    VersionSpec(
        "frontend lockfile",
        "frontend/package-lock.json",
        r'^  "version": "([^"]+)"$',
        r'(^  "version": ")[^"]+("$)',
        re.MULTILINE,
    ),
    VersionSpec(
        "frontend lockfile root package",
        "frontend/package-lock.json",
        r'("packages": \{\n    "": \{\n      "name": "deferred-actions-frontend",\n      "version": ")([^"]+)(")',
        r'(\"packages\": \{\n    \"\": \{\n      \"name\": \"deferred-actions-frontend\",\n      \"version\": \ ")[^"]+(\")',
    ),
)


def _match_once(root: Path, spec: VersionSpec) -> tuple[str, str]:
    path = root / spec.path
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(spec.extract_pattern, text, spec.flags))
    if len(matches) != 1:
        raise RuntimeError(
            f"Expected exactly one {spec.label} version in {spec.path}; found {len(matches)}"
        )
    match = matches[0]
    version = match.group(1) if match.lastindex == 1 else match.group(2)
    return text, version


def read_versions(root: Path = ROOT) -> dict[str, str]:
    """Return every tracked release version."""
    return {spec.label: _match_once(root, spec)[1] for spec in SPECS}


def current_version(root: Path = ROOT) -> str:
    """Return the common tracked version, failing when metadata disagrees."""
    versions = read_versions(root)
    unique = set(versions.values())
    if len(unique) != 1:
        raise RuntimeError(f"Release versions are inconsistent: {versions}")
    return next(iter(unique))


def set_release_version(version: str, root: Path = ROOT) -> None:
    """Set every tracked release-version field to one semantic version."""
    if not SEMVER.fullmatch(version):
        raise ValueError(f"Release version must use X.Y.Z format, got {version!r}")

    current_version(root)

    for spec in SPECS:
        path = root / spec.path
        text = path.read_text(encoding="utf-8")

        def replacement(match: re.Match[str]) -> str:
            if match.lastindex == 2:
                return f"{match.group(1)}{version}{match.group(2)}"
            raise RuntimeError(f"Writable pattern for {spec.label} must expose two groups")

        updated, count = re.subn(
            spec.replace_pattern,
            replacement,
            text,
            count=1,
            flags=spec.flags,
        )
        if count != 1:
            raise RuntimeError(
                f"Expected exactly one writable {spec.label} version in {spec.path}; found {count}"
            )
        path.write_text(updated, encoding="utf-8")

    staged = current_version(root)
    if staged != version:
        raise RuntimeError(f"Version staging produced {staged!r}, expected {version!r}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("version", nargs="?", help="target release version in X.Y.Z format")
    parser.add_argument(
        "--check",
        action="store_true",
        help="only verify that all tracked release metadata agrees",
    )
    args = parser.parse_args()

    if args.check:
        if args.version is not None:
            parser.error("--check does not accept a target version")
        print(current_version())
        return

    if args.version is None:
        parser.error("a target version is required unless --check is used")

    before = current_version()
    set_release_version(args.version)
    print(f"Staged release version {before} -> {args.version}")


if __name__ == "__main__":
    main()
