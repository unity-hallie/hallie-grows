"""
Portfolio content as alkahest items.

Phase determines material behavior on the site:
  Salt     — shipped, consumed, permanent. Dense. Low luminance at rest.
  Fluid    — ongoing, stable until broken. Flows and settles.
  Volatile — experiments, toys. Always re-precipitates. Never quite still.
"""

import sys
sys.path.insert(0, '/Users/hlarsson/repos/unity/alkahest-py')

from dataclasses import dataclass, field
from alkahest.phases import Salt, Fluid, Volatile


@dataclass
class ContentItem:
    name: str
    slug: str
    title: str
    description: str
    tags: list[str] = field(default_factory=list)
    url: str | None = None
    year: int | None = None


@dataclass
class SaltItem(ContentItem, Salt):
    """Shipped work. Solid."""
    pass


@dataclass
class FluidItem(ContentItem, Fluid):
    """Ongoing projects, explainers. Liquid."""
    pass


@dataclass
class VolatileItem(ContentItem, Volatile):
    """Toys, experiments. Gas."""
    pass


# --- Content ---

WORK = [
    SaltItem(
        name="jamestown",
        slug="jamestown",
        title="Jamestown",
        description="Bullet hell shooter set in colonial Mars. Shipped on Steam.",
        tags=["game", "shipped", "realtime", "systems"],
        url="https://store.steampowered.com/app/94200/Jamestown/",
        year=2011,
    ),
    FluidItem(
        name="align",
        slug="align",
        title="Align",
        description="Trauma-informed Socratic learning platform. Salesforce-integrated.",
        tags=["education", "svelte", "knowledge", "systems"],
        year=2024,
    ),
    FluidItem(
        name="rhizome",
        slug="rhizome",
        title="Rhizome",
        description="Graph-native knowledge substrate. Edges as first-class citizens.",
        tags=["graph", "knowledge", "systems", "typescript"],
        year=2025,
    ),
]

TOYS = [
    VolatileItem(
        name="cosmo-sim",
        slug="cosmo-sim",
        title="Cosmo Sim",
        description="Relativistic N-body simulator. Observer rest frame. No big bang.",
        tags=["physics", "python", "realtime", "observer"],
        year=2026,
    ),
    VolatileItem(
        name="quantum-context",
        slug="quantum-context",
        title="Quantum Context",
        description="Observer-relative knowledge graph. Confidence ceiling 0.7.",
        tags=["graph", "knowledge", "observer", "python"],
        year=2025,
    ),
]

EXPLAINERS = [
    FluidItem(
        name="type-dissolution",
        slug="type-dissolution",
        title="Type Dissolution",
        description="What alkahest is and why types should be able to dissolve.",
        tags=["systems", "philosophy", "knowledge"],
        year=2025,
    ),
]

ALL_ITEMS = WORK + TOYS + EXPLAINERS
