import { getContent } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  return { posts: await getContent('post') }
}
