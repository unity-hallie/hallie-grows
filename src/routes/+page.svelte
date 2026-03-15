<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sections = [...document.querySelectorAll<HTMLElement>('section[data-kind]')]

    const temps: Record<string, { bg: number[]; text: number[] }> = {
      hallie: { bg: [240, 235, 224], text: [42, 31, 15] },
      claude: { bg: [237, 240, 245], text: [24, 32, 44] },
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
    function lerpColor(c1: number[], c2: number[], t: number) {
      return c1.map((v, i) => Math.round(lerp(v, c2[i], t)))
    }
    function rgb(c: number[]) { return `rgb(${c[0]},${c[1]},${c[2]})` }

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

    function onScroll() {
      const vh = window.innerHeight, mid = vh / 2
      const focused = getFocused()
      sections.forEach(s => s.classList.toggle('focused', s === focused))

      if (prefersReducedMotion) {
        if (focused) {
          const c = temps[focused.dataset.kind || 'hallie']
          document.body.style.background = rgb(c.bg)
          document.body.style.color = rgb(c.text)
        }
        return
      }

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
    return () => window.removeEventListener('scroll', onScroll)
  })
</script>

<svelte:head>
  <title>move slow, fix things — hallie larsson</title>
</svelte:head>

<!-- landing -->
<section data-kind="hallie" class="landing">
  <div class="text">
    <div class="roles">
      Director of Cybernetic Design
      <span class="sep">·</span> Educational Technologist
      <span class="sep">·</span> Game Designer
      <span class="sep">·</span> Sometime Teacher
      <span class="sep">·</span> Sometime Grief and Crisis Worker
    </div>

    <h1>Hallie Larsson</h1>

    <p class="interest">I'm interested in how systems learn and turn difficulty into growth, whether those systems are human, machine, cultures, organizations, 30 second loops or millenia-long evolutions. This is my personal website and portfolio for sharing some of the things I make in one place.</p>

    <nav class="section-nav">
      <a href="/feed">feed</a>
      <a href="/portfolio">portfolio</a>
      <a href="/seeds">seeds</a>
      <a href="/resume">resume</a>
    </nav>
  </div>
</section>

<!-- featured work -->
{#if data.work.length > 0}
  <section data-kind="claude" class="featured-work">
    <div class="text">
      <div class="item-label">things you might have heard of</div>
      <div class="featured-list">
        {#each data.work.filter(w => ['align', 'jamestown'].includes(w.slug)) as w}
          <a href="/portfolio/{w.slug}" class="featured-item">
            {#if w.slug === 'jamestown'}
              <div class="featured-img">
                <img src="/images/jamestown-header.jpg" alt={w.title} />
              </div>
            {:else}
              <div class="featured-img featured-img-placeholder"></div>
            {/if}
            <span class="featured-title">{w.title}</span>
          </a>
        {/each}
      </div>
      <a class="more-link" href="/portfolio">all work →</a>
    </div>
  </section>
{/if}

<!-- recent feed -->
{#if data.posts.length > 0}
  {#each data.posts as post}
    <section data-kind="hallie" class="post-item">
      <div class="text">
        <div class="item-label">writing</div>
        <a class="item-title" href="/read/{post.slug}">{post.title}</a>
        {#if post.description}<p class="item-desc">{post.description}</p>{/if}
        <time>{post.date.slice(0, 10)}</time>
      </div>
    </section>
  {/each}
{/if}

<!-- closing -->
<section data-kind="hallie" class="closing">
  <div class="text">
    <a class="feed-link" href="/feed">everything in the feed →</a>
  </div>
</section>

<style>
  :global(body) {
    font-family: 'Georgia', serif;
    background: #f0ebe0;
    color: #1a1814;
    margin: 0;
  }

  section {
    min-height: 92svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10vh 2rem 6rem;
    position: relative;
  }

  .text {
    max-width: 560px;
    width: 100%;
  }

  /* landing */
  .landing { align-items: flex-start; padding-top: 22vh; }

  .roles {
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: #8a6a40;
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  .sep { opacity: 0.4; margin: 0 0.3em; }

  h1 {
    font-size: 2.2rem;
    font-weight: 400;
    margin: 0 0 1.75rem;
    letter-spacing: 0.01em;
    line-height: 1.2;
  }

  .interest {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2a1f0f;
    margin: 0 0 0.75rem;
  }

  .tagline {
    font-size: 0.9rem;
    line-height: 1.7;
    opacity: 0.5;
    margin: 0 0 2.5rem;
  }

  .section-nav {
    display: flex;
    gap: 1.75rem;
    flex-wrap: wrap;
  }
  .section-nav a {
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    color: inherit;
    opacity: 0.45;
    transition: opacity 0.15s;
  }
  .section-nav a:hover { opacity: 1; }

  /* post items */
  .item-label {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8a6a40;
    margin-bottom: 0.75rem;
  }

  .item-title {
    display: block;
    font-size: 1.25rem;
    line-height: 1.5;
    color: inherit;
    text-decoration: none;
    margin-bottom: 0.6rem;
    font-weight: 500;
  }
  .item-title:hover { text-decoration: underline; }

  .item-desc {
    font-size: 0.95rem;
    line-height: 1.7;
    opacity: 0.65;
    margin: 0 0 0.6rem;
  }

  time {
    font-size: 0.72rem;
    opacity: 0.35;
    white-space: nowrap;
    font-style: normal;
    display: block;
  }

  /* featured work */
  .featured-work { align-items: flex-start; padding-top: 18vh; }
  .featured-list {
    display: flex;
    gap: 1.25rem;
    margin: 1.25rem 0 1.5rem;
    flex-wrap: wrap;
  }
  .featured-item {
    flex: 1;
    min-width: 200px;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .featured-img {
    width: 100%;
    height: 140px;
    overflow: hidden;
    margin-bottom: 0.6rem;
    border: 1px solid rgba(100, 120, 140, 0.12);
  }
  .featured-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    transition: transform 0.4s ease;
  }
  .featured-item:hover .featured-img img { transform: scale(1.03); }
  .featured-img-placeholder { background: rgba(100, 120, 140, 0.06); }
  .featured-title {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.8;
  }
  .more-link {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: inherit;
    opacity: 0.35;
    transition: opacity 0.15s;
  }
  .more-link:hover { opacity: 1; }

  /* closing */
  .closing { min-height: 50svh; align-items: flex-start; padding-top: 18vh; }
  .feed-link {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: inherit;
    text-decoration: none;
    opacity: 0.4;
    transition: opacity 0.2s;
  }
  .feed-link:hover { opacity: 1; }

  @media (prefers-reduced-motion: reduce) {
    section { opacity: 1 !important; filter: none !important; }
  }
</style>
