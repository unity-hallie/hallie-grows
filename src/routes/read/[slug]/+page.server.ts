import { error } from '@sveltejs/kit'
import { getPost, getSections, db } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const post = await getPost(params.slug)
  if (!post) error(404, 'Not found')
  const sections = await getSections(params.slug)

  // If this post is part of a series, find the next part
  let nextPart = null
  if (post.series && post.part != null) {
    const sql = db()
    const rows = await sql`
      SELECT slug, title FROM content
      WHERE kind = 'post' AND series = ${post.series} AND part = ${post.part + 1}
      LIMIT 1
    `
    nextPart = rows[0] ?? null
  }

  return { post, sections, nextPart }
}
