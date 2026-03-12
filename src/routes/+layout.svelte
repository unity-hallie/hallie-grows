<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/stores';

  let { children } = $props();

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
    font-style: italic;
    color: var(--text-primary);
    border-bottom: none;
    letter-spacing: -0.01em;
    flex-shrink: 0;
    transition: color var(--dur-fast) var(--ease-emerge);
  }

  .wordmark:hover,
  .wordmark:focus-visible {
    color: var(--amber);
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
    color: var(--text-secondary);
    border-bottom: 1px solid transparent;
    transition:
      color var(--dur-fast) var(--ease-emerge),
      border-color var(--dur-fast) var(--ease-emerge);
  }

  [data-phase="salt"].nav-link:hover,
  [data-phase="salt"].nav-link[aria-current="page"] {
    color: var(--text-primary);
    border-bottom-color: var(--amber-deep);
  }

  [data-phase="volatile"].nav-link:hover,
  [data-phase="volatile"].nav-link[aria-current="page"] {
    color: var(--amber);
    border-bottom-color: var(--amber);
  }

  [data-phase="fluid"].nav-link:hover,
  [data-phase="fluid"].nav-link[aria-current="page"] {
    color: var(--amber-dim);
    border-bottom-color: var(--amber-dim);
  }

  main {
    min-height: 60dvh;
    padding-bottom: var(--space-24);
  }

  .site-footer {
    padding: var(--space-12) 0 var(--space-8);
    border-top: 1px solid oklch(30% 0.02 60 / 0.4);
  }

  .text-dim {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }
</style>
