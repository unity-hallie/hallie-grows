<script lang="ts">
  import { hrefFor } from '$lib/graph/types.js'
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>timeline — hallie grows</title></svelte:head>

<h1>timeline</h1>

{#if data.rows.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.rows as row}
      {#if row.rowKind === 'single'}
        <li>
          <time>{row.date.slice(0, 10)}</time>
          <a href={hrefFor(row)}>{row.title}</a>
          <span class="kind">{row.kind}{#if row.url} <a class="outgoing" href={row.url} target="_blank" rel="noopener">↗</a>{/if}</span>
        </li>
      {:else}
        <li class="series-row">
          <time>{row.date.slice(0, 10)}</time>
          <span class="series-title">{row.series}</span>
          <span class="kind">series</span>
          <ul class="parts">
            {#each row.parts as part}
              <li>
                <span class="part-label">Part {part.part}</span>
                <a href={hrefFor(part)}>{part.title}</a>
                {#if part.url}<a class="outgoing" href={part.url} target="_blank" rel="noopener">↗</a>{/if}
              </li>
            {/each}
          </ul>
        </li>
      {/if}
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

  .series-row {
    display: grid;
    grid-template-columns: 7rem 1fr auto;
    gap: 1rem;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border, #eee);
  }

  .parts {
    grid-column: 1 / -1;
    padding: 0 0 0 7rem;
    margin: 0.2rem 0 0;
    border: none;
  }

  .parts li {
    display: grid;
    grid-template-columns: 4rem 1fr auto;
    gap: 0.75rem;
    padding: 0.25rem 0;
    border-bottom: none;
    align-items: baseline;
  }

  .series-title { font-weight: 500; }
  .part-label { font-size: 0.72rem; opacity: 0.45; letter-spacing: 0.04em; }

  time, .kind { font-size: 0.8rem; opacity: 0.5; }
  .outgoing { opacity: 0.6; font-size: 0.7rem; }
  a { text-decoration: none; color: inherit; }
  a:hover { text-decoration: underline; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
