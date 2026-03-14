import { loadGraph, allContent } from '$lib/graph/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  const graph = loadGraph()
  // Front page: most recent from each bucket
  const posts = allContent(graph, 'post').slice(0, 3)
  const explainers = allContent(graph, 'explainer').slice(0, 3)
  const work = allContent(graph, 'work').slice(0, 3)
  // Surface: what the graph thinks is active right now
  const surface = graph.state.setOfSupport
    .map(i => graph.meta[i.name])
    .filter(Boolean)
    .slice(0, 5)

  return { posts, explainers, work, surface }
}
