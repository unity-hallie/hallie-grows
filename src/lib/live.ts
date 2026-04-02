import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const LIVE_PATH = resolve('data/live.json')

export interface LiveEvent {
  id: number
  ts: string
  type: 'move' | 'talk' | 'event' | 'death' | 'midnight' | 'narrator' | 'note'
  day: number
  hour: string
  location: string
  text: string
}

export interface LiveFeed {
  title: string
  subtitle: string
  started: string
  events: LiveEvent[]
}

export function loadLive(): LiveFeed {
  const raw = readFileSync(LIVE_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function saveLive(feed: LiveFeed) {
  writeFileSync(LIVE_PATH, JSON.stringify(feed, null, 2) + '\n')
}

export function pushEvent(event: Omit<LiveEvent, 'id' | 'ts'>): LiveEvent {
  const feed = loadLive()
  const full: LiveEvent = {
    ...event,
    id: feed.events.length + 1,
    ts: new Date().toISOString(),
  }
  feed.events.push(full)
  saveLive(feed)
  return full
}
