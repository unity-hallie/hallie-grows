<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  // ── NOTES (commented out — revisit after launch) ─────────
  // const NOTES_KEY = `hg:notes:${data.post.slug}`
  // function loadNotes() { ... }
  // function saveNotes() { ... }
  // function addNote() { ... }
  // function getSectionNotes() { ... }

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
    const sections = [...document.querySelectorAll<HTMLElement>('[data-kind]')]
    const hint = document.getElementById('hint')

    // ── HINT ───────────────────────────────────────────────
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) hint?.classList.add('hidden')
    }, { passive: true })

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

    // ── SCROLL / TEMPERATURE ───────────────────────────────
    function onScroll() {
      const vh = window.innerHeight, mid = vh / 2
      const focused = getFocused()
      sections.forEach(s => s.classList.toggle('focused', s === focused))

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

      // Fade/blur logic — two independent distances, whichever is larger wins:
      //
      // leaveDist: how far the section's bottom has risen above the "safe zone"
      //   threshold (vh - ~3em). Full opacity while bottom is near the screen
      //   bottom; fades once it rises past that line.
      //
      // enterDist: how far the section's top still is below viewport center.
      //   Fades in as it scrolls up from below; fully opaque once top clears mid.
      //
      // Off-screen sections use section-center distance (original behavior).
      const margin = vh * 0.06 // ≈ 3em — threshold above screen bottom
      const threshold = vh - margin
      for (const s of sections) {
        const rect = s.getBoundingClientRect()
        let dist
        if (rect.bottom < 0 || rect.top > vh) {
          dist = Math.abs(rect.top + rect.height / 2 - mid)
        } else {
          const leaveDist = Math.max(0, threshold - rect.bottom)
          const enterDist = Math.max(0, rect.top - vh * 0.4)
          dist = Math.max(leaveDist, enterDist)
        }
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

      <!-- notes/margin feature commented out — revisit after launch
      <div class="margin-zone" ...>...</div>
      <span class="swipe-hint" aria-hidden="true"></span>
      -->
    </section>
  {/each}

  <footer class="post-footer">
    {#if data.nextPart}
      <a href="/read/{data.nextPart.slug}" class="next-link">
        {data.nextPart.title} →
      </a>
    {/if}
    <a href="/feed" class="feed-link">← feed</a>
  </footer>
</main>

<!-- mobile drawer commented out — revisit after launch
<aside class="margin-drawer" ...>...</aside>
<div id="drawer-backdrop" ...></div>
-->

<span class="hint" id="hint" aria-hidden="true">scroll</span>

<style>
  :global(body) {
    font-family: 'Georgia', serif;
    background: #f5f2ec;
    color: #1a1814;
    margin: 0;
    overflow-y: scroll;
  }

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

  /* ── MARGIN NOTES (commented out — revisit after launch) ── */
  /* .margin-zone { ... } .note-editor { ... } .margin-drawer { ... } */

  /* ── POST FOOTER ──────────────────────────────────────── */

  .post-footer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 3rem 2rem 6rem;
    max-width: 560px;
    margin: 0 auto;
    gap: 1rem;
  }

  .next-link {
    font-size: 1.1rem;
    font-weight: 500;
    color: inherit;
    text-decoration: none;
  }
  .next-link:hover { text-decoration: underline; }

  .feed-link {
    font-size: 1rem;
    color: inherit;
    opacity: 0.45;
    transition: opacity 0.15s;
  }
  .feed-link:hover { opacity: 1; }

  /* ── SCROLL HINT ──────────────────────────────────────── */

  .hint {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    font-size: 0.7rem; letter-spacing: 0.1em; color: #b0a898; text-transform: uppercase;
    opacity: 1; transition: opacity 1s; pointer-events: none;
  }
  .hint.hidden { opacity: 0; }

  /* ── MOBILE ───────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    section { opacity: 1 !important; filter: none !important; }
    .hint { transition: none; }
  }
</style>
