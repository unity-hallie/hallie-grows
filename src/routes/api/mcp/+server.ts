import { json } from '@sveltejs/kit'
import { loadGraph, saveGraph, addContent, addRelation, allContent, related } from '$lib/graph/index.js'
import { fetchSubstackPosts } from '$lib/substack.js'
import { otterStep, makeEdge } from 'alkahest'
import type { Item, Edge } from 'alkahest'
import type { RequestHandler } from './$types'
import { SUBSTACK_API_KEY } from '$env/static/private'

// MCP JSON-RPC 2.0 handler
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { method, params, id } = body

  try {
    const result = await dispatch(method, params ?? {})
    return json({ jsonrpc: '2.0', id, result })
  } catch (err) {
    return json({
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: String(err) },
    })
  }
}

// MCP tool manifest
export const GET: RequestHandler = async () => {
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
            kind: { type: 'string', enum: ['post', 'explainer', 'work'] },
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
            fromKind: { type: 'string', enum: ['post', 'explainer', 'work'] },
            fromSlug: { type: 'string' },
            predicate: { type: 'string', description: 'e.g. "explains", "extends", "references"' },
            toKind: { type: 'string', enum: ['post', 'explainer', 'work'] },
            toSlug: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
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
          properties: {
            kind: { type: 'string', enum: ['post', 'explainer', 'work'] },
          },
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
    ],
  })
}

async function dispatch(method: string, params: Record<string, unknown>) {
  const graph = loadGraph()

  switch (method) {
    case 'add_item': {
      const updated = addContent(graph, params as never)
      saveGraph(updated)
      return { ok: true, name: `${params.kind}/${params.slug}` }
    }

    case 'add_edge': {
      const { fromKind, fromSlug, predicate, toKind, toSlug, confidence } = params as never
      const updated = addRelation(graph, fromSlug, fromKind, predicate, toSlug, toKind, confidence)
      saveGraph(updated)
      return { ok: true }
    }

    case 'otter_step': {
      const combineFn = (a: Item | Edge, b: Item | Edge) => {
        // Simple: if two items share a tag, derive a "shares-tag" edge
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
    }

    case 'query': {
      const { kind } = params as { kind?: never }
      return allContent(graph, kind)
    }

    case 'related': {
      const { kind, slug } = params as { kind: never; slug: string }
      return related(graph, kind, slug)
    }

    case 'sync_substack': {
      const posts = await fetchSubstackPosts(SUBSTACK_API_KEY)
      let g = graph
      for (const post of posts) g = addContent(g, post)
      saveGraph(g)
      return { added: posts.length }
    }

    case 'surface': {
      return graph.state.setOfSupport
        .map(i => ({ name: i.name, meta: graph.meta[i.name] ?? null }))
    }

    default:
      throw new Error(`Unknown method: ${method}`)
  }
}
