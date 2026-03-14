import { loadGraph, allContent, getSections } from '$lib/graph/index.js'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
  const graph = loadGraph()
  const post = allContent(graph, 'post').find(p => p.slug === params.slug)
  if (!post) error(404, 'Not found')

  const sections = getSections(graph, params.slug)

  return { post, sections }
}
