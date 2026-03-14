import type { ContentMeta } from '$lib/graph/types.js'

const PUBLICATION = 'h9000'
const SUBSTACK_API = `https://${PUBLICATION}.substack.com/api/v1`

interface SubstackPost {
  id: number
  slug: string
  title: string
  subtitle?: string
  post_date: string
  canonical_url: string
  description?: string
}

export async function fetchSubstackPosts(_apiKey: string, limit = 50): Promise<ContentMeta[]> {
  const res = await fetch(`${SUBSTACK_API}/posts?limit=${limit}`)

  if (!res.ok) {
    throw new Error(`Substack fetch failed: ${res.status} ${res.statusText}`)
  }

  const posts: SubstackPost[] = await res.json()

  return posts.map(p => ({
    kind: 'post' as const,
    slug: p.slug,
    title: p.title,
    date: p.post_date,
    url: p.canonical_url,
    description: p.subtitle ?? p.description,
    tags: [],
  }))
}
