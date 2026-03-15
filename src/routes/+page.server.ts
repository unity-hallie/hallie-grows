import { getContent } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const [posts, explainers, work] = await Promise.all([
    getContent('post'),
    getContent('explainer'),
    getContent('work'),
  ])
  return {
    posts: posts.slice(0, 3),
    explainers: explainers.slice(0, 3),
    work: work.slice(0, 3),
  }
}
