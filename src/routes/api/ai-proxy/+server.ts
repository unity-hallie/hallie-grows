import { json } from '@sveltejs/kit'

export async function POST({ request }) {
  const { key, model, max_tokens, messages, system } = await request.json()

  if (!key) return json({ error: 'no key' }, { status: 400 })

  const body: Record<string, unknown> = { model, max_tokens, messages }
  if (system) body.system = system

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) return json({ error: data.error?.message || 'API error' }, { status: res.status })

  return json({ text: data.content?.[0]?.text ?? '' })
}
