import type { ContentMeta, SectionType } from '$lib/graph/types.js'
// TODO: Lets phase this out. Heuristics from substack is not going to do it I dont think, we'll need to hand author anyway


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
  body_html?: string
}

export interface ParsedSection {
  sectionType: SectionType
  sectionIndex: number
  body: string
}

// Parse Substack body_html into typed sections.
// Speaker markers: <p><strong>Hallie:</strong> ... → hallie
//                  <p><strong>Claude:</strong> ... → claude
//                  everything else → story
// Consecutive same-speaker paragraphs are merged into one section.
export function parseSections(bodyHtml: string): ParsedSection[] {
  // Split on paragraph boundaries and <hr> (hr forces a new section)
  const paragraphs = bodyHtml
    .split(/(?=<p[ >])|(?=<h[1-6][ >])|(?=<hr[\s/>])/)
    .map(s => s.trim())
    .filter(Boolean)

  const chunks: { type: SectionType; html: string }[] = []
  let forceNewSection = false

  for (const p of paragraphs) {
    // <hr> marks a forced section break — don't emit it, just flag
    if (/^<hr[\s/>]/i.test(p)) {
      forceNewSection = true
      continue
    }

    // Detect speaker from opening <strong>Speaker:</strong>
    const speakerMatch = p.match(/^<p[^>]*>\s*<strong>(Hallie|Claude):<\/strong>\s*/i)
    let type: SectionType
    let html: string

    if (speakerMatch) {
      type = speakerMatch[1].toLowerCase() as SectionType
      // Strip the speaker label from the output — the section type carries that info
      html = p.replace(/^(<p[^>]*>)\s*<strong>(Hallie|Claude):<\/strong>\s*/i, '$1')
    } else {
      type = 'story'
      html = p
    }

    // Merge with previous chunk if same type and no forced break
    const last = chunks[chunks.length - 1]
    if (last && last.type === type && !forceNewSection) {
      last.html += '\n' + html
    } else {
      chunks.push({ type, html })
    }
    forceNewSection = false
  }

  return chunks.map((c, i) => ({
    sectionType: c.type,
    sectionIndex: i,
    body: c.html,
  }))
}

export async function fetchSubstackPosts(_apiKey: string, limit = 50): Promise<ContentMeta[]> {
  const res = await fetch(`${SUBSTACK_API}/posts?limit=${limit}`)
  if (!res.ok) throw new Error(`Substack fetch failed: ${res.status} ${res.statusText}`)
  const posts: SubstackPost[] = await res.json()
  return posts.map(p => ({
    kind: 'post' as const,
    slug: p.slug,
    title: p.title,
    date: p.post_date,
    url: p.canonical_url,       // kept as attribution, not redirect
    description: p.subtitle ?? p.description,
    tags: [],
  }))
}

export async function fetchSubstackPostWithSections(slug: string): Promise<{
  meta: ContentMeta
  sections: ParsedSection[]
} | null> {
  const res = await fetch(`${SUBSTACK_API}/posts/${slug}`)
  if (!res.ok) return null
  const post: SubstackPost = await res.json()
  return {
    meta: {
      kind: 'post' as const,
      slug: post.slug,
      title: post.title,
      date: post.post_date,
      url: post.canonical_url,
      description: post.subtitle ?? post.description,
      tags: [],
    },
    sections: post.body_html ? parseSections(post.body_html) : [],
  }
}
