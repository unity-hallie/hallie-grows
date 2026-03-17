import { loadGraph, allContent, related } from '$lib/graph/index.js'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
  const graph = loadGraph()
  const meta = allContent(graph, 'post').find(p => p.slug === params.slug)
  if (!meta) error(404, 'Not found')

  // Posts live here now — redirect to reader
  redirect(302, `/read/${params.slug}`)

  return {
    meta,
    related: related(graph, 'post', params.slug),
  }
}
