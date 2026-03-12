"""
Build-time manifest generator.

Runs the Otter engine over content items to establish relationships,
then outputs static/manifest.json for the SvelteKit site to consume.

Usage: python content/build.py
"""

import sys
import json
import os
from collections import deque
from dataclasses import asdict

sys.path.insert(0, '/Users/hlarsson/repos/unity/alkahest-py')

from alkahest.engine import run_otter
from alkahest.state import OtterState
from items import ALL_ITEMS, SaltItem, FluidItem, VolatileItem


def phase_of(item) -> str:
    if isinstance(item, SaltItem):
        return "salt"
    if isinstance(item, FluidItem):
        return "fluid"
    if isinstance(item, VolatileItem):
        return "volatile"
    return "fluid"


def section_of(item) -> str:
    from items import WORK, TOYS, EXPLAINERS
    if item in WORK:
        return "work"
    if item in TOYS:
        return "toys"
    if item in EXPLAINERS:
        return "explainers"
    return "work"


def tag_affinity(a, b) -> float:
    """Shared tags as a simple affinity measure."""
    shared = set(a.tags) & set(b.tags)
    total = set(a.tags) | set(b.tags)
    return len(shared) / len(total) if total else 0.0


class RelationItem:
    """Wrapper so Otter can combine content items."""
    def __init__(self, content, relations=None):
        self.content = content
        self.name = content.slug
        self.relations = relations or []  # (slug, affinity)

    def __eq__(self, other):
        return self.name == other.name

    def __hash__(self):
        return hash(self.name)


def combine(focus: RelationItem, other: RelationItem) -> list:
    """Combine two items if they share meaningful affinity."""
    affinity = tag_affinity(focus.content, other.content)
    if affinity > 0.15 and focus.name != other.name:
        # Add relation in both directions
        focus.relations.append((other.name, round(affinity, 2)))
        other.relations.append((focus.name, round(affinity, 2)))
    return []  # we mutate in place, no new items needed


def build_manifest():
    items = [RelationItem(item) for item in ALL_ITEMS]

    # All items in set_of_support, usable starts empty.
    # Each step pops a focus and combines with growing usable — full pairwise scan.
    state = OtterState(
        set_of_support=deque(items),
        usable=[],
    )

    run_otter(state, combine, max_steps=len(items) * len(items), verbose=False)

    # Build manifest
    manifest = []
    item_lookup = {r.name: r for r in items}
    from items import WORK, TOYS, EXPLAINERS

    for item in ALL_ITEMS:
        ri = item_lookup[item.slug]
        # Deduplicate relations
        seen = {}
        for slug, affinity in ri.relations:
            if slug not in seen or seen[slug] < affinity:
                seen[slug] = affinity
        relations = [{"slug": s, "affinity": a} for s, a in sorted(seen.items(), key=lambda x: -x[1])]

        manifest.append({
            "slug": item.slug,
            "title": item.title,
            "description": item.description,
            "tags": item.tags,
            "url": item.url,
            "year": item.year,
            "phase": phase_of(item),
            "section": section_of(item),
            "relations": relations,
        })

    out_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'manifest.json')
    with open(out_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"Manifest written: {len(manifest)} items")
    for entry in manifest:
        print(f"  [{entry['phase']:8}] {entry['slug']:20} → {[r['slug'] for r in entry['relations']]}")


if __name__ == '__main__':
    build_manifest()
