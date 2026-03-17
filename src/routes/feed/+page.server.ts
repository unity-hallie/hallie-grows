import { getContent } from '$lib/db/index.js'
import { EXPLAINERS } from '$lib/explainers.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const posts = await getContent('post')
  const all = [
    ...posts.map(p => ({ kind: 'post' as const, slug: p.slug, title: p.title, date: p.date })),
    ...EXPLAINERS.map(e => ({ kind: 'explainer' as const, slug: e.slug, title: e.title, date: e.date })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  return { items: all }
}
