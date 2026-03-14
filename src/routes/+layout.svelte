<script lang="ts">
  import { page } from '$app/stores'
  let { children } = $props()
</script>

<nav>
  <a href="/" class:active={$page.url.pathname === '/'}>hallie grows</a>
  <a href="/timeline" class:active={$page.url.pathname === '/timeline'}>timeline</a>
  <a href="/writing" class:active={$page.url.pathname.startsWith('/writing')}>writing</a>
  <a href="/explainers" class:active={$page.url.pathname.startsWith('/explainers')}>explainers</a>
  <a href="/work" class:active={$page.url.pathname.startsWith('/work')}>work</a>
</nav>

<main>
  {@render children()}
</main>

<style>
  nav {
    padding: 1.5rem 2rem;
    display: flex;
    gap: 2rem;
    align-items: baseline;
  }

  nav a:first-child {
    font-weight: 600;
    margin-right: auto;
  }

  nav a {
    text-decoration: none;
    color: inherit;
    opacity: 0.5;
    font-size: 0.9rem;
  }

  nav a:hover,
  nav a.active {
    opacity: 1;
  }

  main {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
  }
</style>
