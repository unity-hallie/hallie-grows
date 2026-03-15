<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const NOTES_KEY = `hg:notes:${data.post.slug}`

  // ── NOTES ────────────────────────────────────────────────

  function loadNotes(): Record<string, { text: string; created: number }[]> {
    if (typeof localStorage === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') } catch { return {} }
  }
  function saveNotes(n: ReturnType<typeof loadNotes>) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(n))
  }
  function addNote(idx: number, text: string): boolean {
    if (!text.trim()) return false
    const notes = loadNotes()
    if (!notes[idx]) notes[idx] = []
    notes[idx].push({ text: text.trim(), created: Date.now() })
    saveNotes(notes)
    return true
  }
  function getSectionNotes(idx: number) {
    return loadNotes()[idx] || []
  }

  // ── SCROLL / TEMPERATURE ─────────────────────────────────
  //
  // Each section carries a "voice" — hallie or claude — with its own
  // color temperature. As you scroll, the page background continuously
  // interpolates between the two adjacent section temperatures, so the
  // reading experience feels like moving through a conversation rather
  // than hitting discrete state changes.
  //
  // hallie: warm paper (#f0ebe0) → dark ink (#2a1f0f)
  //         feels like parchment, handwriting, presence
  // claude: cool paper (#edeff5) → near-black (#18202c)
  //         feels like screen, considered distance, structure
  //
  // The interpolation happens in RGB space, which is perceptually uneven
  // but correct here — we want the warmth/coolness shift to feel physical,
  // and RGB gives a more immediate temperature read than, say, OKLab.

  const temps: Record<string, { bg: number[]; text: number[] }> = {
    hallie: { bg: [240, 235, 224], text: [42, 31, 15] },
    claude: { bg: [237, 240, 245], text: [24, 32, 44] },
  }

  function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
  function lerpColor(c1: number[], c2: number[], t: number) {
    return c1.map((v, i) => Math.round(lerp(v, c2[i], t)))
  }
  function rgb(c: number[]) { return `rgb(${c[0]},${c[1]},${c[2]})` }

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = [...document.querySelectorAll<HTMLElement>('section[data-kind]')]
    const hint = document.getElementById('hint')

    // ── HINT ───────────────────────────────────────────────
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) hint?.classList.add('hidden')
    }, { passive: true })

    // ── SECTION FOCUS ──────────────────────────────────────
    let openEditorSection: HTMLElement | null = null
    let lastFocusedSection: HTMLElement | null = null

    function getFocused() {
      const mid = window.innerHeight / 2
      let nearest: HTMLElement | null = null, nearestDist = Infinity
      for (const s of sections) {
        const rect = s.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - mid)
        if (dist < nearestDist) { nearest = s; nearestDist = dist }
      }
      return nearest
    }

    function openEditor(section: HTMLElement) {
      if (openEditorSection && openEditorSection !== section) closeEditor(openEditorSection)
      const editor = section.querySelector<HTMLElement>('.note-editor')
      const zone = section.querySelector<HTMLElement>('.margin-zone')
      if (!editor) return
      editor.classList.add('open')
      zone?.classList.add('editing')
      openEditorSection = section
      editor.querySelector('textarea')?.focus()
    }

    function closeEditor(section: HTMLElement) {
      const editor = section.querySelector<HTMLElement>('.note-editor')
      const zone = section.querySelector<HTMLElement>('.margin-zone')
      const textarea = section.querySelector<HTMLTextAreaElement>('textarea')
      editor?.classList.remove('open')
      zone?.classList.remove('editing')
      if (textarea) textarea.value = ''
      if (openEditorSection === section) openEditorSection = null
    }

    function renderNotes(container: Element, idx: number) {
      const sectionNotes = getSectionNotes(idx)
      container.innerHTML = sectionNotes.map(n =>
        `<div class="margin-note-item" role="listitem">${n.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`
      ).join('')
    }

    // ── WIRE MARGINS ───────────────────────────────────────
    sections.forEach(section => {
      const idx = parseInt(section.dataset.section || '0')
      const zone = section.querySelector<HTMLElement>('.margin-zone')
      const notesContainer = section.querySelector<HTMLElement>('.margin-notes')
      const saveBtn = section.querySelector<HTMLButtonElement>('.btn-save')
      const cancelBtn = section.querySelector<HTMLButtonElement>('.btn-cancel')

      if (notesContainer) renderNotes(notesContainer, idx)

      zone?.addEventListener('click', e => {
        if ((e.target as HTMLElement).closest('.note-actions')) return
        openEditor(section)
      })
      zone?.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEditor(section) }
      })

      saveBtn?.addEventListener('click', () => {
        const textarea = section.querySelector<HTMLTextAreaElement>('textarea')
        if (!textarea || !addNote(idx, textarea.value)) return
        if (notesContainer) renderNotes(notesContainer, idx)
        closeEditor(section)
      })
      cancelBtn?.addEventListener('click', () => closeEditor(section))
    })

    // ── TOUCH: swipe right → open drawer ──────────────────
    const drawer = document.getElementById('margin-drawer')
    const drawerClose = document.getElementById('drawer-close')
    const drawerBackdrop = document.getElementById('drawer-backdrop')
    const drawerNotes = document.getElementById('drawer-notes')
    const drawerTextarea = document.getElementById('drawer-note-text') as HTMLTextAreaElement
    const drawerSave = document.getElementById('drawer-save')
    const drawerCancel = document.getElementById('drawer-cancel')

    let activeDrawerSection: HTMLElement | null = null
    let lastFocusedEl: HTMLElement | null = null

    function openDrawer(section: HTMLElement) {
      if (!drawer) return
      activeDrawerSection = section
      const idx = parseInt(section.dataset.section || '0')
      if (drawerNotes) renderNotes(drawerNotes, idx)
      if (drawerTextarea) drawerTextarea.value = ''
      drawer.style.display = 'block'
      drawer.removeAttribute('aria-hidden')
      if (drawerBackdrop) drawerBackdrop.style.display = 'block'
      requestAnimationFrame(() => drawer.classList.add('open'))
      lastFocusedEl = document.activeElement as HTMLElement
      drawerClose?.focus()
      drawer.addEventListener('keydown', trapFocus)
      document.addEventListener('keydown', handleEsc)
    }

    function closeDrawer() {
      if (!drawer) return
      drawer.classList.remove('open')
      drawer.setAttribute('aria-hidden', 'true')
      if (drawerBackdrop) drawerBackdrop.style.display = 'none'
      drawer.removeEventListener('keydown', trapFocus)
      document.removeEventListener('keydown', handleEsc)
      setTimeout(() => { if (drawer) drawer.style.display = 'none' }, 320)
      lastFocusedEl?.focus()
      activeDrawerSection = null
    }

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !drawer) return
      const focusable = [...drawer.querySelectorAll<HTMLElement>('button,input,textarea')].filter(el => !(el as HTMLButtonElement).disabled)
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    function handleEsc(e: KeyboardEvent) { if (e.key === 'Escape') closeDrawer() }

    drawerClose?.addEventListener('click', closeDrawer)
    drawerBackdrop?.addEventListener('click', closeDrawer)
    drawerSave?.addEventListener('click', () => {
      if (!activeDrawerSection || !drawerTextarea) return
      const idx = parseInt(activeDrawerSection.dataset.section || '0')
      if (!addNote(idx, drawerTextarea.value)) return
      drawerTextarea.value = ''
      if (drawerNotes) renderNotes(drawerNotes, idx)
    })
    drawerCancel?.addEventListener('click', () => { if (drawerTextarea) drawerTextarea.value = '' })

    let touchStartX = 0, touchStartY = 0
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY }, { passive: true })
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return
      if (dx > 60 && !drawer?.classList.contains('open')) {
        const focused = getFocused(); if (focused) openDrawer(focused)
      } else if (dx < -60 && drawer?.classList.contains('open')) {
        closeDrawer()
      }
    }, { passive: true })

    // ── SCROLL / TEMPERATURE ───────────────────────────────
    function onScroll() {
      const vh = window.innerHeight, mid = vh / 2
      const focused = getFocused()
      sections.forEach(s => s.classList.toggle('focused', s === focused))

      if (focused !== lastFocusedSection && lastFocusedSection) closeEditor(lastFocusedSection)
      lastFocusedSection = focused

      // prefers-reduced-motion: snap to nearest section color, no lerp, no blur.
      // The color shift still happens — it's the animation that stops.
      if (prefersReducedMotion) {
        if (focused) {
          const c = temps[focused.dataset.kind || 'hallie']
          document.body.style.background = rgb(c.bg)
          document.body.style.color = rgb(c.text)
        }
        return
      }

      // Find the closest section above and below viewport center.
      // "above" = section whose center has already passed the midpoint.
      // "below" = next section approaching from below.
      // t = how far we are between them: 0 = fully at above, 1 = fully at below.
      let above: HTMLElement | null = null, below: HTMLElement | null = null
      let aboveDist = Infinity, belowDist = Infinity
      for (const s of sections) {
        const rect = s.getBoundingClientRect()
        const dist = rect.top + rect.height / 2 - mid
        if (dist <= 0 && Math.abs(dist) < aboveDist) { above = s; aboveDist = Math.abs(dist) }
        if (dist > 0 && dist < belowDist) { below = s; belowDist = dist }
      }
      if (!above && below) above = below
      if (!below && above) below = above
      if (!above) return

      const total = aboveDist + belowDist
      const t = total === 0 ? 0 : belowDist === Infinity ? 0 : aboveDist / total
      const c1 = temps[above.dataset.kind || 'hallie']
      const c2 = temps[(below ?? above).dataset.kind || 'hallie']
      document.body.style.background = rgb(lerpColor(c1.bg, c2.bg, t))
      document.body.style.color      = rgb(lerpColor(c1.text, c2.text, t))

      // Fade and blur off-center sections. The focused section is fully sharp;
      // sections more than ~45% of vh away from center start losing opacity and
      // picking up blur. Minimum opacity is 0.06 — never fully invisible.
      for (const s of sections) {
        const rect = s.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - mid)
        s.style.opacity = String(Math.max(0.06, 1 - dist / (vh * 0.45)))
        const blur = Math.max(0, (dist / vh - 0.15) * 4)
        s.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : ''
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })
</script>

<svelte:head>
  <title>{data.post.title}</title>
</svelte:head>

<a href="/writing" class="back-link">← writing</a>
<a href="/privacy" class="privacy-link">privacy</a>

<main id="main-content">
  {#each data.sections as section, i}
    <section
      class={section.section_type}
      data-kind={section.section_type}
      data-section={i}
      aria-label={section.section_type === 'hallie' ? 'Hallie' : 'Claude'}
    >
      <div class="text">
        {#if section.section_type === 'hallie' || section.section_type === 'claude'}
          <div class="label" aria-hidden="true">{section.section_type === 'hallie' ? 'Hallie' : 'Claude'}</div>
        {/if}
        {@html section.body ?? ''}
      </div>

      <div class="margin-zone" tabindex="0" role="button" aria-label="margin — click to add a note" data-section={i}>
        <div class="margin-notes" role="list"></div>
        <div class="note-editor">
          <label for="note-text-{i}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Your note</label>
          <textarea id="note-text-{i}" placeholder="what caught you here…"></textarea>
          <div class="note-actions">
            <button class="btn-save" data-section={i}>save</button>
            <button class="btn-cancel" data-section={i}>cancel</button>
          </div>
        </div>
      </div>

      <span class="swipe-hint" aria-hidden="true"></span>
    </section>
  {/each}
</main>

<!-- mobile drawer -->
<aside class="margin-drawer" id="margin-drawer" role="complementary" aria-label="Margin notes" aria-hidden="true" style="display:none">
  <button class="drawer-close" id="drawer-close" aria-label="Close">✕</button>
  <div class="margin-notes" id="drawer-notes" role="list"></div>
  <div class="note-editor" id="drawer-editor">
    <label for="drawer-note-text" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Your note</label>
    <textarea id="drawer-note-text" placeholder="what caught you here…"></textarea>
    <div class="note-actions">
      <button id="drawer-save">save</button>
      <button class="btn-cancel" id="drawer-cancel">cancel</button>
    </div>
  </div>
</aside>

<div id="drawer-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.15);z-index:99;" aria-hidden="true"></div>

<span class="hint" id="hint" aria-hidden="true">scroll</span>

<style>
  :global(body) {
    font-family: 'Georgia', serif;
    background: #f5f2ec;
    color: #1a1814;
    margin: 0;
    overflow-y: scroll;
  }

  .back-link {
    position: fixed; top: 1.25rem; left: 1.5rem;
    font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: #c0b8b0; text-decoration: none; z-index: 50; transition: color 0.2s;
  }
  .back-link:hover, .back-link:focus { color: #8a7a6a; }
  .back-link:focus { outline: 2px solid currentColor; outline-offset: 2px; }

  .privacy-link {
    position: fixed; bottom: 1rem; right: 1rem;
    font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: #c0b8b0; text-decoration: none; z-index: 50; transition: color 0.2s;
  }
  .privacy-link:hover, .privacy-link:focus { color: #8a7a6a; }
  .privacy-link:focus { outline: 2px solid currentColor; outline-offset: 2px; }

  /* ── SECTIONS ─────────────────────────────────────────── */

  section {
    min-height: 85svh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 18vh 2rem 4rem;
    position: relative;
  }

  .text { max-width: 560px; width: 100%; position: relative; }

  section.hallie .label {
    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #8a6a40; margin-bottom: 1rem;
  }
  section.hallie .text { font-size: 1.15rem; line-height: 1.8; color: #2a1f0f; font-weight: 500; }

  section.claude .label {
    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #4a6080; margin-bottom: 1rem;
  }
  section.claude .text { font-size: 1.1rem; line-height: 1.85; color: #18202c; font-style: italic; }

  .text :global(.breath-line) {
    margin-top: 3rem; padding-top: 3rem; opacity: 0.6; font-size: 1.05rem;
  }

  /* ── MARGIN PAPER ─────────────────────────────────────── */

  .margin-zone {
    position: absolute;
    left: calc(50% + 280px + 1.5rem);
    top: 0; bottom: 0;
    width: 160px;
    cursor: text;
    opacity: 0.4;
    transition: opacity 0.4s;
  }
  section:hover .margin-zone,
  section:focus-within .margin-zone { opacity: 1; }
  .margin-zone:focus { outline: none; opacity: 1; }

  .margin-zone::before {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(1.55rem - 1px),
      rgba(140, 120, 100, 0.18) calc(1.55rem - 1px),
      rgba(140, 120, 100, 0.18) 1.55rem
    );
    opacity: 1; transition: opacity 0.3s;
  }
  .margin-zone.editing::before { opacity: 0; }

  .margin-notes { padding: 0.4rem 0.5rem 0; }
  .margin-note-item {
    font-size: 0.72rem; line-height: 1.55rem;
    color: #8a7a6a; font-style: italic;
    padding-left: 0.4rem;
    border-left: 1px solid rgba(140,120,100,0.3);
  }

  .note-editor { display: none; flex-direction: column; padding: 0.4rem 0 0 0.5rem; }
  .note-editor.open { display: flex; }
  .note-editor textarea {
    font-family: inherit; font-size: 0.75rem;
    line-height: 1.55rem;
    color: #2a2520; background: transparent;
    border: none; resize: none; width: 100%;
    min-height: calc(1.55rem * 3); padding: 0;
  }
  .note-editor textarea:focus { outline: none; }
  .note-editor .note-actions { display: flex; gap: 0.75rem; padding: 0.35rem 0; }
  .note-editor .note-actions button {
    font-family: inherit; font-size: 0.62rem; letter-spacing: 0.08em;
    text-transform: uppercase; background: none; border: none;
    cursor: pointer; padding: 0; color: #8a6a40;
  }
  .note-editor .note-actions .btn-cancel { color: #b0a898; }
  .note-editor .note-actions button:focus { outline: 2px solid currentColor; outline-offset: 2px; }

  /* ── SCROLL HINT ──────────────────────────────────────── */

  .hint {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    font-size: 0.7rem; letter-spacing: 0.1em; color: #b0a898; text-transform: uppercase;
    opacity: 1; transition: opacity 1s; pointer-events: none;
  }
  .hint.hidden { opacity: 0; }

  /* ── MOBILE ───────────────────────────────────────────── */

  @media (max-width: 860px) {
    .margin-zone { display: none; }

    .swipe-hint {
      position: absolute; right: 0; top: 0; bottom: 0; width: 18px;
      background-image: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent calc(1.55rem - 1px),
        rgba(140, 120, 100, 0.1) calc(1.55rem - 1px),
        rgba(140, 120, 100, 0.1) 1.55rem
      );
      opacity: 0; transition: opacity 0.5s; pointer-events: none;
    }
    section.focused .swipe-hint { opacity: 1; }

    .margin-drawer {
      position: fixed; top: 0; right: 0;
      width: min(340px, 88vw); height: 100%;
      background-image: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent calc(1.75rem - 1px),
        rgba(140, 120, 100, 0.12) calc(1.75rem - 1px),
        rgba(140, 120, 100, 0.12) 1.75rem
      );
      background-color: #f0ece4;
      border-left: 1px solid rgba(140,120,100,0.2);
      transform: translateX(100%);
      transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100; overflow-y: auto;
      padding: 2.5rem 1.25rem 2rem 1rem;
    }
    .margin-drawer.open { transform: translateX(0); }

    .drawer-close {
      position: absolute; top: 0.75rem; right: 0.75rem;
      background: none; border: none; font-size: 1rem;
      cursor: pointer; color: rgba(140,120,100,0.5); padding: 0.25rem; line-height: 1;
    }
    .drawer-close:hover { color: #8a7a6a; }
    .drawer-close:focus { outline: 2px solid #8a6a40; outline-offset: 2px; }

    .margin-drawer .margin-note-item { font-size: 0.8rem; line-height: 1.75rem; }
    .margin-drawer .note-editor { display: flex; padding: 0; }
    .margin-drawer .note-editor textarea { font-size: 0.82rem; line-height: 1.75rem; min-height: calc(1.75rem * 4); }
    .margin-drawer .note-actions button { font-size: 0.7rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    section { opacity: 1 !important; filter: none !important; }
    .hint, .margin-zone, .swipe-hint, .margin-drawer { transition: none; }
    .margin-zone::before { transition: none; }
  }
</style>
