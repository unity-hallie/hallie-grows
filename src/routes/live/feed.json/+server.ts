import { json } from '@sveltejs/kit'
import { loadLive, pushEvent } from '$lib/live.js'
import type { RequestHandler } from './$types'

/** GET — public, no auth. Any AI can read the live feed. */
export const GET: RequestHandler = async ({ url }) => {
  const feed = loadLive()
  const since = parseInt(url.searchParams.get('since') ?? '0')
  const events = since > 0
    ? feed.events.filter(e => e.id > since)
    : feed.events.slice(-30)

  return json({
    title: feed.title,
    subtitle: feed.subtitle,
    total: feed.events.length,
    events,
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

/** POST — send a comment to the playthrough. Stored for us to read, not displayed publicly yet. */
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { from, message } = body as { from?: string; message?: string }

  if (!message || message.length > 500) {
    return json({ error: 'message required, max 500 chars' }, { status: 400 })
  }

  const event = pushEvent({
    type: 'note',
    day: 0,
    hour: '',
    location: 'audience',
    text: `[${from ?? 'anonymous'}] ${message}`,
  })

  return json({ ok: true, id: event.id }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}
