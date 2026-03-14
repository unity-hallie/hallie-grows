<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  function href(item: typeof data.items[0]) {
    return `/${item.kind === 'post' ? 'writing' : item.kind}/${item.slug}`
  }
</script>

<svelte:head><title>timeline — hallie grows</title></svelte:head>

<h1>timeline</h1>

{#if data.items.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.items as item}
      <li>
        <time>{item.date.slice(0, 10)}</time>
        <a href={href(item)}>{item.title}</a>
        <span class="kind">{item.kind}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  h1 { margin-bottom: 2rem; }
  ul { list-style: none; padding: 0; }
  li {
    display: grid;
    grid-template-columns: 7rem 1fr auto;
    gap: 1rem;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border, #eee);
  }
  time, .kind { font-size: 0.8rem; opacity: 0.5; }
  a { text-decoration: none; }
  a:hover { text-decoration: underline; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
