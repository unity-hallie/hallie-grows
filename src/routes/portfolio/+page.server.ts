import { getContent } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  return { work: await getContent('work') }
}
