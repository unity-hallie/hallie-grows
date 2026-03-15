-- moveslow.works schema
-- Content-first graph: content table + sections table + edges for relationships

-- Content items (posts, explainers, work)
CREATE TABLE IF NOT EXISTS content (
  kind        TEXT NOT NULL,              -- post | explainer | work
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  date        DATE NOT NULL,
  url         TEXT,                       -- external attribution (Substack, etc.)
  description TEXT,
  tags        TEXT[]  DEFAULT '{}',
  series      TEXT,                       -- series name if part of a series
  part        INTEGER,                    -- part number within series
  PRIMARY KEY (kind, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_kind ON content(kind);
CREATE INDEX IF NOT EXISTS idx_content_date ON content(date DESC);
CREATE INDEX IF NOT EXISTS idx_content_series ON content(series) WHERE series IS NOT NULL;

-- Sections (typed content blocks within a post)
CREATE TABLE IF NOT EXISTS sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug     TEXT    NOT NULL,
  section_index INTEGER NOT NULL,
  section_type  TEXT    NOT NULL,         -- hallie | claude
  body          TEXT    NOT NULL,         -- HTML
  UNIQUE (post_slug, section_index)
);

CREATE INDEX IF NOT EXISTS idx_sections_post ON sections(post_slug);

-- Edges (relationships between content items, otter-derived connections)
CREATE TABLE IF NOT EXISTS edges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source       TEXT NOT NULL,             -- kind/slug
  relationship TEXT NOT NULL,             -- HAS_SECTION | RELATED_TO | shares-tag:x | etc.
  target       TEXT NOT NULL,             -- kind/slug
  confidence   REAL NOT NULL DEFAULT 0.7 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  via          TEXT DEFAULT '',           -- provenance: manual | otter | sync
  properties   JSONB DEFAULT '{}',
  invalidated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source) WHERE invalidated_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target) WHERE invalidated_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_edges_relationship ON edges(relationship) WHERE invalidated_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_edges_triple ON edges(source, relationship, target) WHERE invalidated_at IS NULL;
