/**
 * Dev-only content save endpoint.
 * Writes to static/content.json so edits survive refresh.
 * In production (static build), this endpoint doesn't exist — content.json is baked in at build time.
 */

import { json } from '@sveltejs/kit';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const contentPath = join(process.cwd(), 'static', 'content.json');

export async function POST({ request }) {
  const { key, blocks }: { key: string; blocks: string[] } = await request.json();

  const current = JSON.parse(readFileSync(contentPath, 'utf-8'));
  current[key] = blocks;
  writeFileSync(contentPath, JSON.stringify(current, null, 2));

  return json({ ok: true });
}
