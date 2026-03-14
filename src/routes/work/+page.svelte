<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>work — hallie grows</title></svelte:head>

<h1>work</h1>

{#if data.work.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.work as w}
      <li>
        <a href="/work/{w.slug}">{w.title}</a>
        {#if w.description}<p>{w.description}</p>{/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  h1 { margin-bottom: 2rem; }
  ul { list-style: none; padding: 0; }
  li { padding: 0.75rem 0; border-bottom: 1px solid var(--border, #eee); }
  a { text-decoration: none; font-weight: 500; }
  a:hover { text-decoration: underline; }
  p { margin: 0.25rem 0 0; font-size: 0.9rem; opacity: 0.6; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
