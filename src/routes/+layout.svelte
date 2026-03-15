<script lang="ts">
  import { page } from '$app/stores'
  import PaperCanvas from '$lib/components/PaperCanvas.svelte'
  let { children } = $props()
</script>

<PaperCanvas />

<!-- SVG filters for ink-on-paper text treatment -->
<svg style="display:none" aria-hidden="true">
  <defs>
    <filter id="ink">
      <feTurbulence type="fractalNoise" baseFrequency="0.06 0.04" numOctaves="3" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

<nav>
  <a href="/" class="wordmark">move slow, fix things</a>
  <a href="/feed"      class:active={$page.url.pathname.startsWith('/feed')}>feed</a>
  <a href="/portfolio" class:active={$page.url.pathname.startsWith('/portfolio')}>portfolio</a>
  <a href="/seeds"     class:active={$page.url.pathname.startsWith('/seeds')}>seeds</a>
  <a href="/resume"    class:active={$page.url.pathname === '/resume'}>resume</a>
</nav>

<main class:wide={$page.url.pathname === '/'}>
  {@render children()}
</main>

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; }
  :global(body) {
    margin: 0;
    font-family: 'Georgia', serif;
    background: #f5f2ec;
    color: #1a1208;
  }
  :global(a) { color: inherit; }

  /* ── ACCESSIBILITY GUARD ────────────────────────────────
     Images without alt text get a screaming pink outline.
     If you see this, add alt text before shipping. */
  :global(img:not([alt])) {
    outline: 6px solid hotpink !important;
    filter: saturate(0) brightness(0.6) !important;
  }

  nav {
    padding: 1.5rem 2rem;
    display: flex;
    gap: 2rem;
    align-items: baseline;
    position: relative;
    z-index: 10;
  }

  .wordmark {
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    font-weight: 600;
    margin-right: auto;
    text-decoration: none;
    opacity: 1 !important;
    color: #1a1208;
  }

  nav a {
    text-decoration: none;
    color: inherit;
    opacity: 0.4;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    transition: opacity 0.15s;
  }

  nav a:hover,
  nav a.active {
    opacity: 1;
  }

  main {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  main.wide {
    max-width: none;
    padding: 0;
    margin: 0;
  }
</style>
