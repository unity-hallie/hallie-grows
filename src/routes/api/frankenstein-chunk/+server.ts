import { json } from '@sveltejs/kit'
import { readFileSync } from 'fs'

const TEXT_PATH = '/Users/hallie/Documents/repos/bro/data/frankenstein.txt'
const CHUNK_SIZE = 1200

let _cleaned: string | null = null

function getCleanedText(): string {
  if (_cleaned) return _cleaned

  const raw = readFileSync(TEXT_PATH, 'utf-8')

  // Strip Gutenberg header — real content starts after the ToC, at the second "Letter 1"
  // The ToC has "Letter 1" on a line by itself; actual text has "Letter 1" then "_To Mrs. Saville"
  const startIdx = raw.indexOf('\nLetter 1\n\n_To')
  const start = startIdx > 0 ? startIdx + 1 : 0

  // Strip Gutenberg footer
  const endIdx = raw.indexOf('End of the Project Gutenberg')
  const end = endIdx > 0 ? endIdx : raw.length

  const slice = raw.slice(start, end).trim()

  // Join hard-wrapped lines within paragraphs.
  // Paragraphs are separated by 2+ newlines.
  // Within a paragraph, single newlines are just wrapping — join them with a space.
  const paragraphs = slice.split(/\n{2,}/)
  const cleaned = paragraphs
    .map(p => p.trim().replace(/\n/g, ' '))
    .filter(p => p.length > 0)
    .join('\n\n')

  _cleaned = cleaned
  return _cleaned
}

export function GET({ url }) {
  const text = getCleanedText()
  const pos  = Math.max(0, Math.min(parseInt(url.searchParams.get('pos') ?? '0'), text.length - 1))
  const chunk = text.slice(pos, pos + CHUNK_SIZE)
  return json({ chunk, pos, total: text.length })
}
