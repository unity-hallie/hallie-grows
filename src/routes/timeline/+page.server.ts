import { loadGraph, allContent } from '$lib/graph/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  const graph = loadGraph()
  return { items: allContent(graph) }
}
