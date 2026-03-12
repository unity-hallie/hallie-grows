<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ShaderCanvas from '$lib/components/ShaderCanvas.svelte';

  let { children } = $props();

  onMount(() => {
    const saved = localStorage.getItem('hallie-font-choice');
    if (saved) document.documentElement.style.setProperty('--font-body', saved);
  });

  const nav = [
    { href: '/work',       label: 'work',       phase: 'salt'     },
    { href: '/toys',       label: 'toys',       phase: 'volatile' },
    { href: '/explainers', label: 'explainers', phase: 'fluid'    },
    { href: '/about',      label: 'about',      phase: 'fluid'    },
  ] as const;

  let currentPath = $derived($page.url.pathname);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

<ShaderCanvas />

<!-- SVG filter definitions — organic/fractal edges, like burned marks on pine -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;">
  <defs>
    <filter id="burn" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.028" numOctaves="4" seed="12" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="burn-strong" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.030 0.022" numOctaves="5" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>

<div class="site-wrapper">
  <header class="site-header">
    <a href="/" class="wordmark" aria-label="hallie larsson — home">
      hallie larsson
    </a>

    <nav aria-label="primary navigation">
      <ul role="list">
        {#each nav as item}
          <li>
            <a
              href={item.href}
              data-phase={item.phase}
              aria-current={currentPath.startsWith(item.href) ? 'page' : undefined}
              class="nav-link"
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </header>

  <main id="main-content">
    {@render children()}
  </main>

  <footer class="site-footer">
    <p class="text-dim">grown from uncarved wood</p>
  </footer>
</div>

<style>
  .site-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: var(--space-8) 0 var(--space-12);
    gap: var(--space-8);
  }

  .wordmark {
    font-family: var(--font-body);
    font-size: var(--size-lg);
    color: var(--panel);
    border-bottom: none;
    letter-spacing: -0.01em;
    flex-shrink: 0;
    transition: color var(--dur-fast) var(--ease-emerge);
  }

  .wordmark:hover,
  .wordmark:focus-visible {
    color: var(--rose);
    border-bottom: none;
  }

  nav ul {
    display: flex;
    list-style: none;
    gap: var(--space-6);
    flex-wrap: wrap;
  }

  .nav-link {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.06em;
    text-transform: lowercase;
    color: oklch(70% 0.015 70);
    border-bottom: 1px solid transparent;
    transition:
      color var(--dur-fast) var(--ease-emerge),
      border-color var(--dur-fast) var(--ease-emerge);
  }

  [data-phase="salt"].nav-link:hover,
  [data-phase="salt"].nav-link[aria-current="page"] {
    color: var(--text-primary);
    border-bottom-color: var(--rose-deep);
  }

  [data-phase="volatile"].nav-link:hover,
  [data-phase="volatile"].nav-link[aria-current="page"] {
    color: var(--rose);
    border-bottom-color: var(--rose);
  }

  [data-phase="fluid"].nav-link:hover,
  [data-phase="fluid"].nav-link[aria-current="page"] {
    color: var(--lichen);
    border-bottom-color: var(--lichen);
  }

  main {
    min-height: 60dvh;
    padding-bottom: var(--space-24);
  }

  .site-footer {
    padding: var(--space-12) 0 var(--space-8);
    border-top: 1px solid oklch(35% 0.025 58 / 0.18);
  }

  .text-dim {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    color: oklch(45% 0.012 65);
    letter-spacing: 0.04em;
  }
</style>
