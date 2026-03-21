<script lang="ts">
  import { onMount } from 'svelte'

  type Kind = 'noticed' | 'felt' | 'question' | 'connection'
  type Note = { text: string; kind: Kind; time: string; id: number }

  let notes = $state<Note[]>([])
  let text = $state('')
  let kind = $state<Kind>('noticed')
  let inputEl: HTMLTextAreaElement
  let listEl: HTMLDivElement
  let startTime = $state<number>(0)

  const kindLabels: Record<Kind, string> = {
    noticed: 'noticed',
    felt: 'felt',
    question: 'question',
    connection: 'connection'
  }

  function elapsed(): string {
    if (!startTime) return ''
    const diff = Math.floor((Date.now() - startTime) / 1000)
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    if (h > 0) return `${h}h${String(m).padStart(2, '0')}m`
    return `${m}m`
  }

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    const note: Note = {
      text: trimmed,
      kind,
      time: elapsed(),
      id: Date.now()
    }
    notes = [note, ...notes]
    text = ''
    save()
    // scroll list to top
    if (listEl) listEl.scrollTop = 0
  }

  function remove(id: number) {
    notes = notes.filter(n => n.id !== id)
    save()
  }

  function save() {
    try {
      localStorage.setItem('watch-notes', JSON.stringify(notes))
      localStorage.setItem('watch-start', String(startTime))
    } catch {}
  }

  function load() {
    try {
      const saved = localStorage.getItem('watch-notes')
      const savedStart = localStorage.getItem('watch-start')
      if (saved) notes = JSON.parse(saved)
      if (savedStart) startTime = Number(savedStart)
    } catch {}
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function startTimer() {
    startTime = Date.now()
    save()
  }

  function clearAll() {
    if (confirm('Clear all notes?')) {
      notes = []
      startTime = 0
      localStorage.removeItem('watch-notes')
      localStorage.removeItem('watch-start')
    }
  }

  onMount(() => {
    load()
    if (!startTime) startTimer()
  })
</script>

<svelte:head>
  <title>watch</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

<div class="watch">
  <div class="input-area">
    <div class="kinds">
      {#each Object.entries(kindLabels) as [k, label]}
        <button
          class="kind-btn"
          class:active={kind === k}
          onclick={() => kind = k as Kind}
        >{label}</button>
      {/each}
    </div>
    <div class="compose">
      <textarea
        bind:this={inputEl}
        bind:value={text}
        onkeydown={handleKeydown}
        placeholder="what do you see?"
        rows="2"
      ></textarea>
      <button class="send" onclick={submit}>+</button>
    </div>
  </div>

  <div class="notes" bind:this={listEl}>
    {#each notes as note (note.id)}
      <div class="note {note.kind}">
        <span class="note-kind">{note.kind}</span>
        <span class="note-time">{note.time}</span>
        <span class="note-text">{note.text}</span>
        <button class="note-remove" onclick={() => remove(note.id)}>x</button>
      </div>
    {/each}
    {#if notes.length === 0}
      <p class="empty">no notes yet. watch. type. send.</p>
    {/if}
  </div>

  <div class="footer">
    <button class="clear" onclick={clearAll}>clear</button>
  </div>
</div>

<style>
  .watch {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100px);
    height: calc(100dvh - 100px);
    max-width: 100%;
    gap: 0;
  }

  .input-area {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f5f2ec;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(26, 18, 8, 0.1);
  }

  .kinds {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .kind-btn {
    font-family: 'Georgia', serif;
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid rgba(26, 18, 8, 0.2);
    border-radius: 1rem;
    background: transparent;
    color: #1a1208;
    opacity: 0.4;
    cursor: pointer;
    transition: all 0.15s;
  }

  .kind-btn.active {
    opacity: 1;
    background: #1a1208;
    color: #f5f2ec;
  }

  .compose {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  textarea {
    flex: 1;
    font-family: 'Georgia', serif;
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
    border: 1px solid rgba(26, 18, 8, 0.2);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    color: #1a1208;
    resize: none;
    line-height: 1.4;
  }

  textarea::placeholder {
    color: rgba(26, 18, 8, 0.3);
    font-style: italic;
  }

  textarea:focus {
    outline: none;
    border-color: rgba(26, 18, 8, 0.4);
  }

  .send {
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgba(26, 18, 8, 0.2);
    border-radius: 50%;
    background: #1a1208;
    color: #f5f2ec;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notes {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 0;
    -webkit-overflow-scrolling: touch;
  }

  .note {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
    flex-wrap: wrap;
  }

  .note-kind {
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    opacity: 0.5;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .note.noticed .note-kind { color: #4a6741; }
  .note.felt .note-kind { color: #8b4513; }
  .note.question .note-kind { color: #4a5568; }
  .note.connection .note-kind { color: #6b46c1; }

  .note-time {
    font-size: 0.65rem;
    opacity: 0.3;
    flex-shrink: 0;
  }

  .note-text {
    font-size: 0.9rem;
    line-height: 1.4;
    flex: 1;
    min-width: 60%;
  }

  .note-remove {
    font-family: 'Georgia', serif;
    font-size: 0.65rem;
    background: none;
    border: none;
    opacity: 0.2;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    flex-shrink: 0;
  }

  .note-remove:hover {
    opacity: 0.6;
  }

  .empty {
    text-align: center;
    opacity: 0.3;
    font-style: italic;
    padding: 2rem 0;
  }

  .footer {
    padding: 0.5rem 0;
    text-align: center;
  }

  .clear {
    font-family: 'Georgia', serif;
    font-size: 0.7rem;
    background: none;
    border: none;
    opacity: 0.2;
    cursor: pointer;
    letter-spacing: 0.05em;
  }

  .clear:hover {
    opacity: 0.5;
  }

  /* mobile: bigger touch targets */
  @media (max-width: 600px) {
    .kind-btn {
      padding: 0.45rem 0.8rem;
      font-size: 0.8rem;
    }
    textarea {
      font-size: 1rem;
    }
  }
</style>
