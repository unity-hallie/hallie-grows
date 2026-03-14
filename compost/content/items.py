"""
Portfolio content as alkahest items.

Phase determines material behavior on the site:
  Salt     — shipped, consumed, permanent. Dense. Low luminance at rest.
  Fluid    — ongoing, stable until broken. Flows and settles.
  Volatile — experiments, toys. Always re-precipitates. Never quite still.
"""

import sys
sys.path.insert(0, '/Users/hallie/Documents/repos/alkahest-py')

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
        description="Neoclassical scrolling shooter set on British colonial Mars. PAX 10, Cooptimus PC Game of the Year. 81 Metacritic, 94% Steam.",
        tags=["game", "shipped", "realtime", "systems"],
        url="https://store.steampowered.com/app/94200/Jamestown/",
        year=2011,
    ),
    FluidItem(
        name="align",
        slug="align",
        title="Align",
        description="Trauma-informed Socratic learning platform. Built for Unity Environmental University.",
        tags=["education", "svelte", "knowledge", "systems"],
        year=2024,
    ),
]

SKETCHES = []

EXPLAINERS = [
    FluidItem(
        name="meaning",
        slug="meaning",
        title="Why I'm Wrong Sometimes",
        description="Where AI mistakes come from. Not randomness. Shape.",
        tags=[],
        url="https://unity-hallie.github.io/explainers/meaning.html",
        year=2025,
    ),
]

ALL_ITEMS = WORK + SKETCHES + EXPLAINERS
