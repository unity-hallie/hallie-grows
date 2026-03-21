import type { Item, Edge, OtterState, Fluid } from 'alkahest'
//Bro -- is it possible to set this up to use alkahest matter states? 


export type ContentKind = 'post' | 'explainer' | 'work' | 'section'
export type SectionType = 'hallie' | 'claude'

// Kind registry — each kind declares its own UI properties
export const KINDS: Record<ContentKind, {
  visible: boolean    // surfaces in timeline, landing, nav buckets
  route: string       // base path for links (e.g. '/read', '/explainers')
}> = {
  post:      { visible: true,  route: '/read' },
  explainer: { visible: true,  route: '/explainers' },
  work:      { visible: true,  route: '/work' },
  section:   { visible: false, route: '' },
}

export function hrefFor(meta: ContentMeta): string {
  const config = KINDS[meta.kind]
  if (!config.visible || !config.route) return '#'
  return `${config.route}/${meta.slug}`
}

export interface ContentMeta {
  kind: ContentKind
  slug: string
  title: string
  date: string        // ISO 8601
  url?: string | null  // external URL (e.g. Substack)
  description?: string | null
  tags?: string[]
  // section-specific (kind === 'section')
  sectionType?: SectionType
  sectionIndex?: number
  body?: string       // HTML body for sections
  postSlug?: string
}

// Content items carry metadata in their content field as JSON
export interface ContentItem extends Item {
  meta: ContentMeta
}

export type SiteGraph = OtterState<Item>
