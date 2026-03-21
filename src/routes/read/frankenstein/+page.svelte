<script lang="ts">
  import { onMount } from 'svelte'

  const CHUNK_SIZE = 1200
  const PULL_THRESHOLD = 80   // px to commit advance
  const PULL_MAX       = 130  // max visual travel

  const MARKS = [
    { sym: '◆', bg: 'rgba(212,168,48,0.18)',  line: '#c49a20' },
    { sym: '●', bg: 'rgba(80,144,200,0.15)',   line: '#4880b8' },
    { sym: '■', bg: 'rgba(160,100,200,0.15)',  line: '#9060b8' },
    { sym: '▲', bg: 'rgba(80,160,100,0.15)',   line: '#409858' },
    { sym: '★', bg: 'rgba(200,80,80,0.15)',    line: '#b84040' },
  ]

  // ── state ────────────────────────────────────────────────
  let apiKey    = $state('')
  let showSetup = $state(false)

  let pos   = $state(0)
  let total = $state(0)
  let chunk = $state('')
  let html  = $state('')

  let general    = $state('')
  let highlights = $state<{ passage: string; thought: string; idx: number }[]>([])
  let aiLoading  = $state(false)
  let aiError    = $state('')

  let messages    = $state<{ role: 'user' | 'ai'; text: string }[]>([])
  let input       = $state('')
  let convLoading = $state(false)

  let bookmarks    = $state<{ pos: number; name: string; preview: string }[]>([])
  let bookmarkName = $state('')
  let showBM       = $state(false)

  // pull gesture
  let pullY       = $state(0)
  let pulling     = $state(false)
  let touchStartY = 0
  let readerEl: HTMLElement | null = null

  // ── init ────────────────────────────────────────────────
  onMount(() => {
    apiKey    = localStorage.getItem('fk-key') ?? ''
    pos       = parseInt(localStorage.getItem('fk-pos') ?? '0')
    bookmarks = JSON.parse(localStorage.getItem('fk-bookmarks') ?? '[]')
    showSetup = !apiKey

    fetchChunk(pos).then(() => { if (apiKey) readWithAI() })

    // Pull gesture — needs passive:false on touchmove to call preventDefault
    const el = readerEl!
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  })

  // ── pull gesture ─────────────────────────────────────────
  function onTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY
    pulling = true
  }

  function onTouchMove(e: TouchEvent) {
    if (!pulling) return
    const dy = e.touches[0].clientY - touchStartY
    if (dy <= 0) { pullY = 0; return }

    // resistance when AI is thinking
    const factor = aiLoading ? 0.2 : 1
    pullY = Math.min(dy * factor, PULL_MAX)

    if (pullY > 10) e.preventDefault() // stop scroll only when intentionally pulling
  }

  function onTouchEnd() {
    if (!pulling) return
    pulling = false
    if (pullY >= PULL_THRESHOLD && !aiLoading) {
      pullY = 0
      advance()
    } else {
      pullY = 0
    }
  }

  // ── chunk loading ────────────────────────────────────────
  async function fetchChunk(p: number) {
    const res  = await fetch(`/api/frankenstein-chunk?pos=${p}`)
    const data = await res.json()
    chunk = data.chunk
    total = data.total
    pos   = data.pos
    localStorage.setItem('fk-pos', String(pos))
    highlights = []
    general    = ''
    messages   = []
    renderHtml()
  }

  async function advance() {
    if (pos + CHUNK_SIZE >= total) return
    await fetchChunk(pos + CHUNK_SIZE)
    if (apiKey) readWithAI()
    window.scrollTo(0, 0)
  }

  async function back() {
    if (pos === 0) return
    await fetchChunk(Math.max(pos - CHUNK_SIZE, 0))
    if (apiKey) readWithAI()
    window.scrollTo(0, 0)
  }

  // ── rendering ────────────────────────────────────────────
  function renderHtml() {
    let out = esc(chunk)

    // apply highlights
    for (let i = highlights.length - 1; i >= 0; i--) {
      const h = highlights[i]
      const escaped = esc(h.passage)
      if (!out.includes(escaped)) continue
      const m = MARKS[h.idx % MARKS.length]
      out = out.replace(
        escaped,
        `<mark style="background:${m.bg};border-bottom:2px solid ${m.line};padding:1px 0" data-hi="${i}">${escaped}<sup style="font-size:0.6em;color:${m.line};margin-left:2px">${m.sym}</sup></mark>`,
      )
    }

    // _italics_ → <em>
    out = out.replace(/_(.*?)_/g, '<em>$1</em>')

    // paragraphs
    out = '<p>' + out.replace(/\n\n/g, '</p><p>') + '</p>'

    html = out
  }

  function esc(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  // ── ai ───────────────────────────────────────────────────
  async function readWithAI() {
    if (!apiKey || !chunk) return
    aiLoading = true
    aiError   = ''
    general   = ''
    highlights = []

    try {
      const res = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content:
`You are reading Frankenstein alongside a reader. Return JSON only — no markdown, no preamble.

{
  "general": "1–2 sentences on the motion or feeling of this passage",
  "highlights": [
    { "passage": "exact short phrase from the text (under 60 chars)", "thought": "1–2 sentences" }
  ]
}

2–4 highlights. Quote passages verbatim and briefly. Underscores in the text mean italics.

Passage:
${chunk}`,
          }],
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const parsed = JSON.parse(data.text)
      general    = parsed.general ?? ''
      highlights = (parsed.highlights ?? []).map((h: { passage: string; thought: string }, i: number) => ({ ...h, idx: i }))
      renderHtml()
    } catch (e: unknown) {
      aiError = e instanceof Error ? e.message : 'Could not reach your AI.'
    } finally {
      aiLoading = false
    }
  }

  // ── conversation ─────────────────────────────────────────
  async function send() {
    const msg = input.trim()
    if (!msg || !apiKey) return
    input       = ''
    messages    = [...messages, { role: 'user', text: msg }]
    convLoading = true

    try {
      const res = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: `You are reading Frankenstein alongside the reader. Current passage:\n\n${chunk}\n\nYour observations: ${general}\n\nBe direct. 2–4 sentences.`,
          messages: [
            ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: msg },
          ],
        }),
      })
      const data = await res.json()
      messages = [...messages, { role: 'ai', text: data.text ?? 'No response.' }]
    } catch {
      messages = [...messages, { role: 'ai', text: 'Something went wrong.' }]
    } finally {
      convLoading = false
    }
  }

  // ── bookmarks ────────────────────────────────────────────
  function addBookmark() {
    if (!bookmarkName.trim()) return
    const bm = { pos, name: bookmarkName.trim(), preview: chunk.slice(0, 60) }
    bookmarks = [bm, ...bookmarks.filter(b => b.pos !== pos)]
    localStorage.setItem('fk-bookmarks', JSON.stringify(bookmarks))
    bookmarkName = ''
  }

  async function jumpTo(p: number) {
    await fetchChunk(p)
    if (apiKey) readWithAI()
    showBM = false
    window.scrollTo(0, 0)
  }

  function removeBM(p: number) {
    bookmarks = bookmarks.filter(b => b.pos !== p)
    localStorage.setItem('fk-bookmarks', JSON.stringify(bookmarks))
  }

  function saveKey() {
    localStorage.setItem('fk-key', apiKey)
    showSetup = false
    if (chunk) readWithAI()
  }

  // ── derived ──────────────────────────────────────────────
  const percent   = $derived(total ? Math.round((pos / total) * 100) : 0)
  const navOpacity = $derived(Math.max(0, 1 - pullY / PULL_MAX))
  const pullHint   = $derived(
    pullY > 10
      ? aiLoading ? 'wait…' : pullY >= PULL_THRESHOLD ? 'release' : '↓'
      : ''
  )
</script>

<!-- ── KEY SETUP ──────────────────────────────────────────── -->
{#if showSetup}
<div class="overlay">
  <div class="setup-modal">
    <div class="label">frankenstein</div>
    <p>Paste your Anthropic API key to read with your AI.<br>It stays in your browser — never stored on this server.</p>
    <input
      type="password"
      bind:value={apiKey}
      placeholder="sk-ant-…"
      onkeydown={(e) => e.key === 'Enter' && saveKey()}
    />
    <div class="setup-actions">
      <button onclick={saveKey} disabled={!apiKey.trim()}>connect</button>
      <button class="ghost" onclick={() => showSetup = false}>read without AI</button>
    </div>
  </div>
</div>
{/if}

<!-- ── BOOKMARKS ─────────────────────────────────────────── -->
{#if showBM}
<div class="bm-panel">
  <div class="bm-header">
    <span class="label">bookmarks</span>
    <button class="ghost small" onclick={() => showBM = false}>×</button>
  </div>
  {#if bookmarks.length === 0}
    <p class="dim">none yet</p>
  {:else}
    {#each bookmarks as bm}
      <div class="bm-row">
        <button class="bm-jump" onclick={() => jumpTo(bm.pos)}>
          <span class="bm-name">{bm.name}</span>
          <span class="bm-preview">{bm.preview}…</span>
        </button>
        <button class="ghost small" onclick={() => removeBM(bm.pos)}>×</button>
      </div>
    {/each}
  {/if}
  <div class="bm-add">
    <input bind:value={bookmarkName} placeholder="name this place" onkeydown={(e) => e.key === 'Enter' && addBookmark()} />
    <button onclick={addBookmark} disabled={!bookmarkName.trim()}>save</button>
  </div>
</div>
{/if}

<!-- ── PULL HINT ──────────────────────────────────────────── -->
{#if pullHint}
<div class="pull-hint" style="opacity:{Math.min(pullY / PULL_THRESHOLD, 1)}">
  {pullHint}
</div>
{/if}

<!-- ── READER ─────────────────────────────────────────────── -->
<div
  class="reader"
  bind:this={readerEl}
  style="transform: translateY({pullY * 0.25}px); opacity: {1 - (pullY / PULL_MAX) * 0.4}"
>

  <!-- TEXT PANE -->
  <div class="text-pane">
    <div class="text-header">
      <span class="label">Frankenstein</span>
      <span class="dim">Mary Shelley · 1818</span>
    </div>

    <div class="chunk">
      {@html html}
    </div>
  </div>

  <!-- AI PANE -->
  <div class="ai-pane">

    {#if !apiKey}
      <button class="ghost small" onclick={() => showSetup = true}>connect your AI →</button>

    {:else if aiLoading}
      <div class="ai-status dim">reading…</div>

    {:else if aiError}
      <div class="ai-status err">{aiError}</div>

    {:else}

      {#if general}
        <p class="general">{general}</p>
      {/if}

      {#if highlights.length > 0}
        <div class="annotations">
          {#each highlights as h}
            {@const m = MARKS[h.idx % MARKS.length]}
            <div class="annotation" style="border-left-color:{m.line}">
              <span class="ann-sym" style="color:{m.line}">{m.sym}</span>
              <p class="ann-thought">{h.thought}</p>
            </div>
          {/each}
        </div>
      {/if}

    {/if}

    <!-- conversation -->
    {#if messages.length > 0}
      <div class="conv">
        {#each messages as msg}
          <div class="msg {msg.role}">
            <span class="msg-who">{msg.role === 'user' ? 'you' : 'ai'}</span>
            <p>{msg.text}</p>
          </div>
        {/each}
        {#if convLoading}
          <div class="msg ai">
            <span class="msg-who">ai</span>
            <p class="dim">…</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if apiKey}
      <form class="conv-input" onsubmit={(e) => { e.preventDefault(); send() }}>
        <input
          bind:value={input}
          placeholder={aiLoading ? 'AI is reading — pull when ready' : 'say something before moving on'}
          disabled={convLoading}
        />
        <button type="submit" disabled={!input.trim() || convLoading}>→</button>
      </form>
    {/if}

  </div>
</div>

<!-- ── NAV BAR ───────────────────────────────────────────── -->
<nav style="opacity:{navOpacity}; pointer-events:{navOpacity < 0.1 ? 'none' : 'auto'}">
  <button class="ghost small" onclick={back} disabled={pos === 0}>← back</button>
  <div class="nav-center">
    <span class="dim small">{percent}%</span>
    <button class="ghost small bm-btn" onclick={() => showBM = !showBM}>bookmarks</button>
    {#if apiKey}
      <button class="ghost small" onclick={() => showSetup = true}>key</button>
    {/if}
  </div>
  <button onclick={advance} disabled={pos + CHUNK_SIZE >= total || aiLoading}>
    {aiLoading ? 'reading…' : 'advance →'}
  </button>
</nav>

<style>
  :global(body) {
    background: #f5f0e8;
    color: #1a1208;
    margin: 0;
    font-family: Georgia, serif;
    overscroll-behavior: none;
  }

  /* ── OVERLAY ───────────────────────────────────────────── */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(10,8,4,0.72);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
  }
  .setup-modal {
    background: #f5f0e8;
    border: 1px solid #c8bca8;
    padding: 2.5rem;
    max-width: 420px; width: 90%;
  }
  .setup-modal p { font-size: 0.9rem; line-height: 1.75; color: #3a2a18; margin: 0.75rem 0 1.25rem; }
  .setup-modal input {
    width: 100%; box-sizing: border-box;
    background: #ede8dc; border: 1px solid #c8bca8;
    color: #1a1208; padding: 0.6rem 0.8rem;
    font-family: monospace; font-size: 0.85rem; margin-bottom: 1rem;
  }
  .setup-actions { display: flex; gap: 0.75rem; }

  /* ── BOOKMARKS ─────────────────────────────────────────── */
  .bm-panel {
    position: fixed; bottom: 3.5rem; right: 1rem;
    width: 280px; background: #f0ebe0;
    border: 1px solid #c8bca8; padding: 1rem;
    z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .bm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .bm-row { display: flex; align-items: flex-start; gap: 0.4rem; margin-bottom: 0.5rem; }
  .bm-jump { flex: 1; text-align: left; background: none; border: none; cursor: pointer; padding: 0; }
  .bm-jump:hover .bm-name { text-decoration: underline; }
  .bm-name { display: block; font-size: 0.82rem; color: #3a2a18; }
  .bm-preview { display: block; font-size: 0.7rem; color: #9a8868; font-style: italic; }
  .bm-add { display: flex; gap: 0.4rem; margin-top: 0.75rem; border-top: 1px solid #d4c8b0; padding-top: 0.75rem; }
  .bm-add input {
    flex: 1; background: #ede8dc; border: 1px solid #c8bca8;
    color: #1a1208; padding: 0.4rem 0.6rem;
    font-size: 0.82rem; font-family: inherit;
  }

  /* ── PULL HINT ─────────────────────────────────────────── */
  .pull-hint {
    position: fixed; bottom: 4rem; left: 50%; transform: translateX(-50%);
    font-size: 0.72rem; letter-spacing: 0.1em; color: #8a7050;
    pointer-events: none; z-index: 50;
    transition: opacity 0.1s;
  }

  /* ── LAYOUT ─────────────────────────────────────────────── */
  .reader {
    display: grid;
    grid-template-columns: 2fr 1fr;
    min-height: calc(100svh - 3rem);
    padding-bottom: 3rem;
    transition: transform 0.08s, opacity 0.08s;
    will-change: transform, opacity;
  }

  /* ── TEXT PANE ─────────────────────────────────────────── */
  .text-pane { padding: 3rem 2.5rem 2rem; border-right: 1px solid #d4c8b0; }

  .text-header { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 2.5rem; }

  .chunk { font-size: 1.1rem; line-height: 1.9; color: #1a1208; }
  .chunk :global(p) { margin: 0 0 1.2em; }
  .chunk :global(mark) { border-radius: 1px; }
  .chunk :global(em) { font-style: italic; }

  /* ── AI PANE ───────────────────────────────────────────── */
  .ai-pane {
    padding: 2.5rem 1.5rem 2rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }
  .ai-status { font-size: 0.78rem; font-style: italic; }
  .general {
    font-size: 0.88rem; line-height: 1.75; color: #3a2a18;
    font-style: italic; margin: 0;
    padding-bottom: 1.1rem; border-bottom: 1px solid #d4c8b0;
  }
  .annotations { display: flex; flex-direction: column; gap: 0.8rem; }
  .annotation { border-left: 2px solid; padding-left: 0.75rem; display: flex; gap: 0.35rem; align-items: flex-start; }
  .ann-sym { font-size: 0.65rem; padding-top: 0.2rem; flex-shrink: 0; }
  .ann-thought { font-size: 0.82rem; line-height: 1.65; color: #4a3828; margin: 0; }

  /* ── CONVERSATION ──────────────────────────────────────── */
  .conv { display: flex; flex-direction: column; gap: 0.65rem; }
  .msg { display: flex; gap: 0.5rem; align-items: flex-start; }
  .msg-who { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: #9a8868; min-width: 1.8rem; padding-top: 0.25rem; flex-shrink: 0; }
  .msg p { font-size: 0.84rem; line-height: 1.65; color: #3a2a18; margin: 0; }
  .msg.user .msg-who { color: #6a5038; }
  .conv-input { display: flex; gap: 0.4rem; padding-top: 0.75rem; border-top: 1px solid #d4c8b0; margin-top: auto; }
  .conv-input input {
    flex: 1; background: #ede8dc; border: 1px solid #c8bca8;
    color: #1a1208; padding: 0.45rem 0.7rem;
    font-size: 0.84rem; font-family: Georgia, serif;
  }
  .conv-input input::placeholder { color: #b0a080; font-style: italic; }

  /* ── NAV ───────────────────────────────────────────────── */
  nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 3rem;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem;
    background: #ede8dc; border-top: 1px solid #d4c8b0;
    transition: opacity 0.06s;
  }
  .nav-center { display: flex; align-items: center; gap: 0.75rem; }
  .small { font-size: 0.72rem; }

  /* ── SHARED ─────────────────────────────────────────────── */
  .label { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: #8a7050; }
  .dim { color: #9a8868; }
  .err { color: #a04040; }

  button {
    background: #e8e0d0; border: 1px solid #c8bca8; color: #3a2a18;
    padding: 0.4rem 0.9rem; font-size: 0.82rem;
    cursor: pointer; font-family: inherit; transition: background 0.1s;
  }
  button:hover:not(:disabled) { background: #ddd5c0; }
  button:disabled { opacity: 0.35; cursor: default; }
  button.ghost { background: transparent; border-color: transparent; color: #8a7050; }
  button.ghost:hover { color: #3a2a18; }
  button.small { padding: 0.25rem 0.5rem; font-size: 0.72rem; }

  /* ── MOBILE ─────────────────────────────────────────────── */
  @media (max-width: 700px) {
    .reader { grid-template-columns: 1fr; }
    .text-pane { border-right: none; border-bottom: 1px solid #d4c8b0; padding: 2rem 1.25rem; }
    .ai-pane { padding: 1.5rem 1.25rem; }
  }
</style>
