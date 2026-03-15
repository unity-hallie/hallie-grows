import { error } from '@sveltejs/kit'
import { getPost, getSections } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const post = await getPost(params.slug)
  if (!post) error(404, 'Not found')
  const sections = await getSections(params.slug)
  return { post, sections }
}
