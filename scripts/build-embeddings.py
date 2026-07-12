#!/usr/bin/env python3
"""build-embeddings.py — turn GloVe into something a browser can hold.

    python3 scripts/build-embeddings.py

Reads .embeddings/glove.6B.300d.txt, keeps the most frequent VOCAB words (GloVe's file is already
frequency-ordered, so "keep the first N" IS "keep the most common N"), normalises every vector to unit
length, quantises to int8, and writes:

    static/embed/words.json   the vocabulary, in order
    static/embed/vecs.i8      VOCAB * DIMS signed bytes, row-major

WHY INT8 AND WHY UNIT-NORM
Once every vector is unit length, **cosine similarity is just the dot product** — no division, no norms
at runtime. That's what makes it fast enough to score 30,000 words on every keystroke in a browser.
And once they're unit length, every component is in [-1, 1], so int8 (÷127) costs about 0.4% precision
and cuts the payload 4×. 30k × 300 int8 = 9 MB. That ships.

WHY GLOVE 6B SPECIFICALLY
Hallie's original run (on a machine we no longer have) produced this as the farthest-from-*home*
neighbourhood: `def, genus, mm, yen, cents, trillion, index, species` … and `GMT`. That word list is a
*fingerprint*: `mm/yen/cents/trillion` is newswire, `genus/species/def.` is Wikipedia. GloVe 6B is
trained on Wikipedia + Gigaword. So this is almost certainly the same space, which means the finding
should REPRODUCE rather than merely rhyme. If `home` comes back with the ledger, we've recovered it.
"""
import json
import pathlib
import struct
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / ".embeddings" / "glove.6B.300d.txt"
OUT = ROOT / "static" / "embed"

VOCAB = 30_000   # most-frequent words. GloVe's file is frequency-ordered.
DIMS = 300


def main() -> int:
    if not SRC.exists():
        print(f"missing {SRC} — unzip glove.6B.zip into .embeddings/ first", file=sys.stderr)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    words: list[str] = []
    rows = bytearray()

    with SRC.open(encoding="utf-8") as f:
        for line in f:
            if len(words) >= VOCAB:
                break
            parts = line.rstrip().split(" ")
            w = parts[0]
            # skip pure punctuation / junk tokens, keep everything else (numbers included — "trillion"
            # and "cents" are part of the finding, so we must NOT filter the ledger out of the ledger)
            if not any(c.isalnum() for c in w):
                continue
            v = [float(x) for x in parts[1:]]
            if len(v) != DIMS:
                continue

            norm = sum(x * x for x in v) ** 0.5
            if norm == 0:
                continue
            # unit-norm, then quantise: cosine becomes a plain dot product at runtime.
            rows.extend(max(-127, min(127, round(x / norm * 127))) & 0xFF for x in v)
            words.append(w)

    (OUT / "words.json").write_text(json.dumps(words, ensure_ascii=False))
    (OUT / "vecs.i8").write_bytes(bytes(rows))

    mb = len(rows) / 1_000_000
    print(f"  {len(words):,} words × {DIMS} dims")
    print(f"  static/embed/vecs.i8    {mb:.1f} MB")
    print(f"  static/embed/words.json {len(json.dumps(words)) / 1_000_000:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
