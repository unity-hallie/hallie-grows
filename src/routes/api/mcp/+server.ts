import { json } from '@sveltejs/kit'
import { loadGraph, saveGraph, addContent, addRelation, allContent, related, getSections } from '$lib/graph/index.js'
import { fetchSubstackPosts, fetchSubstackPostWithSections } from '$lib/substack.js'
import { loadLive, pushEvent } from '$lib/live.js'
import { otterStep, makeEdge } from 'alkahest'
import type { Item, Edge } from 'alkahest'
import type { SiteGraph } from '$lib/graph/index.js'
import type { ContentKind, SectionType } from '$lib/graph/types.js'
import type { RequestHandler } from './$types'
import { SUBSTACK_API_KEY, MCP_SECRET } from '$env/dynamic/private'

// ── HANDLERS ───────────────────────────────────────────────

type Params = Record<string, unknown>
type Handler = (params: Params, graph: SiteGraph) => unknown | Promise<unknown>

const handlers: Record<string, Handler> = {

  add_item(params, graph) {
    const updated = addContent(graph, params as never)
    saveGraph(updated)
    return { ok: true, name: `${params.kind}/${params.slug}` }
  },

  add_edge(params, graph) {
    const { fromKind, fromSlug, predicate, toKind, toSlug, confidence } = params as {
      fromKind: ContentKind; fromSlug: string; predicate: string
      toKind: ContentKind; toSlug: string; confidence?: number
    }
    const updated = addRelation(graph, fromSlug, fromKind, predicate, toSlug, toKind, confidence)
    saveGraph(updated)
    return { ok: true }
  },

  add_section(params, graph) {
    const { postSlug, sectionType, sectionIndex, body } = params as {
      postSlug: string; sectionType: SectionType; sectionIndex: number; body: string
    }
    const sectionSlug = `${postSlug}/${sectionIndex}`
    let g = addContent(graph, {
      kind: 'section',
      slug: sectionSlug,
      title: `${postSlug} section ${sectionIndex}`,
      date: new Date().toISOString().slice(0, 10),
      sectionType,
      sectionIndex,
      body,
      postSlug,
    })
    g = addRelation(g, postSlug, 'post', 'HAS_SECTION', sectionSlug, 'section', 1.0)
    saveGraph(g)
    return { ok: true, name: `section/${sectionSlug}` }
  },

  get_sections(params, graph) {
    const { postSlug } = params as { postSlug: string }
    return getSections(graph, postSlug)
  },

  otter_step(_params, graph) {
    const combineFn = (a: Item | Edge, b: Item | Edge) => {
      const ma = graph.meta[a.name]
      const mb = graph.meta[b.name]
      if (!ma || !mb || ma === mb) return []
      const sharedTags = (ma.tags ?? []).filter(t => (mb.tags ?? []).includes(t))
      if (sharedTags.length === 0) return []
      return [makeEdge(a.name, `shares-tag:${sharedTags[0]}`, b.name, 0.6, ['otter'])]
    }
    const newState = otterStep(graph.state, { combineFn } as never)
    saveGraph({ ...graph, state: newState })
    return { step: newState.step, halted: newState.haltReason }
  },

  query(params, graph) {
    const { kind } = params as { kind?: ContentKind }
    return allContent(graph, kind)
  },

  related(params, graph) {
    const { kind, slug } = params as { kind: ContentKind; slug: string }
    return related(graph, kind, slug)
  },

  async sync_substack(_params, graph) {
    const posts = await fetchSubstackPosts(SUBSTACK_API_KEY)
    let g = graph

    // Add post metadata
    for (const post of posts) g = addContent(g, post)

    // Fetch and parse sections for each post (skip if already has sections)
    let sectionsAdded = 0
    for (const post of posts) {
      const existing = getSections(g, post.slug)
      if (existing.length > 0) continue

      const result = await fetchSubstackPostWithSections(post.slug)
      if (!result) continue

      for (const section of result.sections) {
        const sectionSlug = `${post.slug}/${section.sectionIndex}`
        g = addContent(g, {
          kind: 'section',
          slug: sectionSlug,
          title: `${post.slug} section ${section.sectionIndex}`,
          date: post.date,
          sectionType: section.sectionType,
          sectionIndex: section.sectionIndex,
          body: section.body,
          postSlug: post.slug,
        })
        g = addRelation(g, post.slug, 'post', 'HAS_SECTION', sectionSlug, 'section', 1.0)
        sectionsAdded++
      }
    }

    saveGraph(g)
    return { posts: posts.length, sectionsAdded }
  },

  surface(_params, graph) {
    return graph.state.setOfSupport
      .map(i => ({ name: i.name, meta: graph.meta[i.name] ?? null }))
  },

  push_live(params) {
    const { type, day, hour, location, text } = params as {
      type: 'move' | 'talk' | 'event' | 'death' | 'midnight' | 'narrator' | 'note'
      day: number; hour: string; location: string; text: string
    }
    const event = pushEvent({ type, day, hour, location, text })
    return { ok: true, id: event.id }
  },

  get_live() {
    const feed = loadLive()
    return { title: feed.title, total: feed.events.length, events: feed.events.slice(-20) }
  },
}

// ── DISPATCH ───────────────────────────────────────────────

async function dispatch(method: string, params: Params) {
  const handler = handlers[method]
  if (!handler) throw new Error(`Unknown method: ${method}`)
  const graph = loadGraph()
  return handler(params, graph)
}

// ── ROUTES ─────────────────────────────────────────────────

function authorized(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? ''
  return auth === `Bearer ${MCP_SECRET}`
}

export const POST: RequestHandler = async ({ request }) => {
  if (!authorized(request)) return json({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Unauthorized' } }, { status: 401 })
  const body = await request.json()
  const { method, params, id } = body
  try {
    const result = await dispatch(method, params ?? {})
    return json({ jsonrpc: '2.0', id, result })
  } catch (err) {
    return json({ jsonrpc: '2.0', id, error: { code: -32000, message: String(err) } })
  }
}

export const GET: RequestHandler = async ({ request }) => {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, { status: 401 })
  return json({
    name: 'hallie-grows',
    version: '1.0.0',
    tools: [
      {
        name: 'add_item',
        description: 'Add a content item to the graph (post, explainer, or work)',
        inputSchema: {
          type: 'object',
          required: ['kind', 'slug', 'title', 'date'],
          properties: {
            kind: { type: 'string', enum: ['post', 'explainer', 'work', 'section'] },
            slug: { type: 'string' },
            title: { type: 'string' },
            date: { type: 'string', description: 'ISO 8601' },
            url: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      {
        name: 'add_edge',
        description: 'Connect two content items with a labeled relationship',
        inputSchema: {
          type: 'object',
          required: ['fromKind', 'fromSlug', 'predicate', 'toKind', 'toSlug'],
          properties: {
            fromKind: { type: 'string', enum: ['post', 'explainer', 'work', 'section'] },
            fromSlug: { type: 'string' },
            predicate: { type: 'string' },
            toKind: { type: 'string', enum: ['post', 'explainer', 'work', 'section'] },
            toSlug: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      },
      {
        name: 'add_section',
        description: 'Add a typed section to a post and wire HAS_SECTION edge. Use this to author reader content.',
        inputSchema: {
          type: 'object',
          required: ['postSlug', 'sectionType', 'sectionIndex', 'body'],
          properties: {
            postSlug: { type: 'string' },
            sectionType: { type: 'string', enum: ['story', 'hallie', 'claude'] },
            sectionIndex: { type: 'number' },
            body: { type: 'string', description: 'HTML body for this section' },
          },
        },
      },
      {
        name: 'get_sections',
        description: 'Get all sections for a post in order',
        inputSchema: {
          type: 'object',
          required: ['postSlug'],
          properties: { postSlug: { type: 'string' } },
        },
      },
      {
        name: 'otter_step',
        description: 'Run one step of the Otter loop to derive new connections',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'query',
        description: 'List content items, optionally filtered by kind',
        inputSchema: {
          type: 'object',
          properties: { kind: { type: 'string', enum: ['post', 'explainer', 'work'] } },
        },
      },
      {
        name: 'related',
        description: 'Get items related to a specific piece of content',
        inputSchema: {
          type: 'object',
          required: ['kind', 'slug'],
          properties: {
            kind: { type: 'string', enum: ['post', 'explainer', 'work'] },
            slug: { type: 'string' },
          },
        },
      },
      {
        name: 'sync_substack',
        description: 'Fetch latest Substack posts and add them to the graph',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'surface',
        description: 'Return the current set_of_support — what the graph thinks is most active',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'push_live',
        description: 'Push a live event to the pathologic playthrough feed',
        inputSchema: {
          type: 'object',
          required: ['type', 'day', 'hour', 'location', 'text'],
          properties: {
            type: { type: 'string', enum: ['move', 'talk', 'event', 'death', 'midnight', 'narrator', 'note'] },
            day: { type: 'number' },
            hour: { type: 'string' },
            location: { type: 'string' },
            text: { type: 'string' },
          },
        },
      },
      {
        name: 'get_live',
        description: 'Get recent live playthrough events',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  })
}
