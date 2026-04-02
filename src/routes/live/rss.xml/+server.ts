import { loadLive } from '$lib/live.js'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  const feed = loadLive()
  const events = feed.events.slice().reverse().slice(0, 50)

  const items = events.map(e => `
    <item>
      <title>${escXml(e.type.toUpperCase())}: ${escXml(e.location)} — Day ${e.day}, ${escXml(e.hour)}</title>
      <description>${escXml(e.text)}</description>
      <pubDate>${new Date(e.ts).toUTCString()}</pubDate>
      <guid isPermaLink="false">live-${e.id}</guid>
    </item>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escXml(feed.title)}</title>
    <description>${escXml(feed.subtitle)}</description>
    <link>https://moveslow.info/live</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'max-age=15',
    },
  })
}

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
