import { getContent } from '$lib/db/index.js'
import type { PageServerLoad } from './$types'

function parseSeries(title: string): { series: string; part: number } | null {
  let m = title.match(/^(.+?)\s*\(Part\s+(\d+)\)$/i)
  if (m) return { series: m[1].trim(), part: parseInt(m[2]) }
  m = title.match(/^(.+?),\s*Part\s+(\d+)$/i)
  if (m) return { series: m[1].trim(), part: parseInt(m[2]) }
  return null
}

export const load: PageServerLoad = async () => {
  const items = await getContent()

  const seriesMap = new Map<string, ({ part: number } & Awaited<ReturnType<typeof getContent>>[0])[]>()
  const singles: Awaited<ReturnType<typeof getContent>> = []

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

  const rows: unknown[] = []

  for (const item of singles) {
    rows.push({ rowKind: 'single', ...item })
  }

  for (const [series, parts] of seriesMap) {
    const sorted = [...parts].sort((a, b) => a.part - b.part)
    rows.push({ rowKind: 'series', series, date: sorted[0].date, parts: sorted })
  }

  rows.sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))

  return { rows }
}
