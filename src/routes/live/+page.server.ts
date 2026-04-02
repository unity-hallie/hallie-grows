import { loadLive } from '$lib/live.js'

export function load() {
  const feed = loadLive()
  return {
    title: feed.title,
    subtitle: feed.subtitle,
    events: feed.events.slice().reverse(), // newest first
  }
}
