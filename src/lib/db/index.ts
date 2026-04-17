import postgres from 'postgres'
import { env } from '$env/dynamic/private'
import type { ContentKind } from '$lib/graph/types.js'

// Single connection pool for the process lifetime
let _sql: ReturnType<typeof postgres> | null = null

export function db() {
  if (!_sql) {
    _sql = postgres(env.DATABASE_URL, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return _sql
}

// ── TYPES ────────────────────────────────────────────────────

export interface ContentRow {
  kind: ContentKind
  slug: string
  title: string
  date: string
  url?: string | null
  description?: string | null
  tags: string[]
  series?: string | null
  part?: number | null
}

export interface SectionRow {
  id: string
  post_slug: string
  section_index: number
  section_type: 'hallie' | 'claude'
  body: string
}

export interface EdgeRow {
  id: string
  created_at: Date
  source: string
  relationship: string
  target: string
  confidence: number
  via: string
  properties: Record<string, unknown>
}

// ── CONTENT ──────────────────────────────────────────────────

export async function getContent(kind?: string): Promise<ContentRow[]> {
  const sql = db()
  if (kind) {
    return sql<ContentRow[]>`
      SELECT *, date::text AS date FROM content WHERE kind = ${kind} ORDER BY content.date DESC
    `
  }
  return sql<ContentRow[]>`
    SELECT *, date::text AS date FROM content WHERE kind IN ('post', 'explainer', 'work') ORDER BY content.date DESC
  `
}

export async function getPost(slug: string): Promise<ContentRow | null> {
  const sql = db()
  const rows = await sql<ContentRow[]>`
    SELECT *, date::text AS date FROM content WHERE kind = 'post' AND slug = ${slug}
  `
  return rows[0] ?? null
}

export async function upsertContent(item: ContentRow): Promise<void> {
  const sql = db()
  await sql`
    INSERT INTO content (kind, slug, title, date, url, description, tags, series, part)
    VALUES (
      ${item.kind}, ${item.slug}, ${item.title}, ${item.date},
      ${item.url ?? null}, ${item.description ?? null}, ${item.tags},
      ${item.series ?? null}, ${item.part ?? null}
    )
    ON CONFLICT (kind, slug) DO UPDATE SET
      title       = EXCLUDED.title,
      date        = EXCLUDED.date,
      url         = EXCLUDED.url,
      description = EXCLUDED.description,
      tags        = EXCLUDED.tags,
      series      = EXCLUDED.series,
      part        = EXCLUDED.part
  `
}

// ── SECTIONS ─────────────────────────────────────────────────

export async function getSections(postSlug: string): Promise<SectionRow[]> {
  const sql = db()
  return sql<SectionRow[]>`
    SELECT * FROM sections
    WHERE post_slug = ${postSlug}
    ORDER BY section_index
  `
}

export async function replaceSections(
  postSlug: string,
  sections: Omit<SectionRow, 'id' | 'post_slug'>[],
): Promise<void> {
  const sql = db()
  await sql.begin(async (tx) => {
    await tx`DELETE FROM sections WHERE post_slug = ${postSlug}`
    if (sections.length === 0) return
    await tx`
      INSERT INTO sections (post_slug, section_index, section_type, body)
      SELECT * FROM ${tx(sections.map(s => ({
        post_slug: postSlug,
        section_index: s.section_index,
        section_type: s.section_type,
        body: s.body,
      })))}
    `
  })
}

// ── EDGES ────────────────────────────────────────────────────

export async function getEdges(source: string): Promise<EdgeRow[]> {
  const sql = db()
  return sql<EdgeRow[]>`
    SELECT * FROM edges
    WHERE (source = ${source} OR target = ${source})
      AND invalidated_at IS NULL
    ORDER BY confidence DESC
  `
}

export async function addEdge(
  source: string,
  relationship: string,
  target: string,
  confidence = 0.7,
  via = 'manual',
): Promise<void> {
  const sql = db()
  await sql`
    INSERT INTO edges (source, relationship, target, confidence, via)
    VALUES (${source}, ${relationship}, ${target}, ${confidence}, ${via})
    ON CONFLICT DO NOTHING
  `
}
