import type { Item, Edge, OtterState } from 'alkahest'

export type ContentKind = 'post' | 'explainer' | 'work'

export interface ContentMeta {
  kind: ContentKind
  slug: string
  title: string
  date: string        // ISO 8601
  url?: string        // external URL (e.g. Substack)
  description?: string
  tags?: string[]
}

// Content items carry metadata in their content field as JSON
export interface ContentItem extends Item {
  meta: ContentMeta
}

export type SiteGraph = OtterState<Item>
