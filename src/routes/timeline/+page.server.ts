import { getContent, type ContentRow } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

type PartRow = ContentRow & { part: number }
type SingleRow = ContentRow & { rowKind: 'single' }
type SeriesRow = { rowKind: 'series'; series: string; date: string; parts: PartRow[] }
type TimelineRow = SingleRow | SeriesRow

function parseSeries(title: string): { series: string; part: number } | null {
  let m = title.match(/^(.+?)\s*\(Part\s+(\d+)\)$/i)
  if (m) return { series: m[1].trim(), part: parseInt(m[2]) }
  m = title.match(/^(.+?),\s*Part\s+(\d+)$/i)
  if (m) return { series: m[1].trim(), part: parseInt(m[2]) }
  return null
}

export const load: PageServerLoad = async () => {
  const items = await getContent()

  const seriesMap = new Map<string, PartRow[]>()
  const singles: ContentRow[] = []

  for (const item of items) {
    const parsed = parseSeries(item.title)
    if (parsed) {
      const existing = seriesMap.get(parsed.series) ?? []
      existing.push({ ...item, part: parsed.part })
      seriesMap.set(parsed.series, existing)
    } else {
      singles.push(item)
    }
  }

  const rows: TimelineRow[] = []

  for (const item of singles) {
    rows.push({ rowKind: 'single', ...item })
  }

  for (const [series, parts] of seriesMap) {
    const sorted = [...parts].sort((a, b) => a.part - b.part)
    rows.push({ rowKind: 'series', series, date: sorted[0].date, parts: sorted })
  }

  rows.sort((a, b) => String(b.date).localeCompare(String(a.date)))

  return { rows }
}
