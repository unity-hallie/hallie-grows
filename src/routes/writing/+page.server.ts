import { loadGraph, allContent } from '$lib/graph/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return { posts: allContent(loadGraph(), 'post') }
}
