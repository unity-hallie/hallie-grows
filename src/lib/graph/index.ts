import { makeItem, makeEdge } from 'alkahest'
import type { Item, Edge, OtterState } from 'alkahest'
import type { ContentMeta, ContentKind } from './types.js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const GRAPH_PATH = resolve('data/graph.json')

export interface SiteGraph {
  state: OtterState<Item | Edge>
  meta: Record<string, ContentMeta>  // keyed by item name
}

function emptyGraph(): SiteGraph {
  return {
    state: {
      setOfSupport: [],
      usable: [],
      history: [],
      step: 0,
      halted: false,
      haltReason: '',
    },
    meta: {},
  }
}

export function loadGraph(): SiteGraph {
  if (!existsSync(GRAPH_PATH)) return emptyGraph()
  try {
    return JSON.parse(readFileSync(GRAPH_PATH, 'utf-8'))
  } catch {
    return emptyGraph()
  }
}

export function saveGraph(graph: SiteGraph): void {
  writeFileSync(GRAPH_PATH, JSON.stringify(graph, null, 2))
}

// Item name convention: kind/slug
function itemName(kind: ContentKind, slug: string): string {
  return `${kind}/${slug}`
}

export function addContent(graph: SiteGraph, meta: ContentMeta): SiteGraph {
  const name = itemName(meta.kind, meta.slug)

  // Idempotent — skip if already in graph
  const all = [...graph.state.setOfSupport, ...graph.state.usable]
  if (all.some(i => i.name === name)) return graph

  const item = makeItem(name, meta.title, ['ingested'])
  return {
    state: {
      ...graph.state,
      setOfSupport: [...graph.state.setOfSupport, item],
    },
    meta: { ...graph.meta, [name]: meta },
  }
}

export function addRelation(
  graph: SiteGraph,
  fromSlug: string,
  fromKind: ContentKind,
  predicate: string,
  toSlug: string,
  toKind: ContentKind,
  confidence = 0.7,
): SiteGraph {
  const subject = itemName(fromKind, fromSlug)
  const object = itemName(toKind, toSlug)
  const edge = makeEdge(subject, predicate, object, confidence, ['manual'])
  return {
    ...graph,
    state: {
      ...graph.state,
      setOfSupport: [...graph.state.setOfSupport, edge],
    },
  }
}

// Return all content items with metadata, sorted by date desc
export function allContent(graph: SiteGraph, kind?: ContentKind): ContentMeta[] {
  const all = [...graph.state.setOfSupport, ...graph.state.usable]
  return all
    .filter((i): i is Item => i.kind === 'item')
    .map(i => graph.meta[i.name])
    .filter(Boolean)
    .filter(m => !kind || m.kind === kind)
    .sort((a, b) => b.date.localeCompare(a.date))
}

// Return sections for a post in order
export function getSections(graph: SiteGraph, postSlug: string) {
  const postName = `post/${postSlug}`
  const all = [...graph.state.setOfSupport, ...graph.state.usable]
  const sectionNames = all
    .filter((i): i is Edge => (i as Edge).kind === 'edge')
    .filter(e => e.subject === postName && e.predicate === 'HAS_SECTION')
    .map(e => e.object)
  return sectionNames
    .map(n => graph.meta[n])
    .filter(Boolean)
    .filter(m => m.kind === 'section')
    .sort((a, b) => (a.sectionIndex ?? 0) - (b.sectionIndex ?? 0))
}

// Return items connected to a given item via edges
export function related(graph: SiteGraph, kind: ContentKind, slug: string): ContentMeta[] {
  const name = itemName(kind, slug)
  const all = [...graph.state.setOfSupport, ...graph.state.usable]
  const connected = new Set<string>()
  for (const item of all) {
    if (item.kind !== 'edge') continue
    const e = item as Edge
    if (e.subject === name) connected.add(e.object)
    if (e.object === name) connected.add(e.subject)
  }
  return [...connected]
    .map(n => graph.meta[n])
    .filter(Boolean)
}
