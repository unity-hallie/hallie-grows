<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  function href(item: { kind: string; slug: string }) {
    return item.kind === 'explainer' ? `/explainers/${item.slug}` : `/read/${item.slug}`
  }
</script>

<svelte:head><title>feed — move slow, fix things</title></svelte:head>

<div class="section-header">
  <h1>feed</h1>
</div>

{#if data.items.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.items as item}
      <li>
        <a href={href(item)} target={item.kind === 'explainer' ? '_blank' : undefined} rel={item.kind === 'explainer' ? 'noopener noreferrer' : undefined}>{item.title}</a>
        <div class="meta">
          {#if item.kind === 'explainer'}<span class="kind">explainer</span>{/if}
          <time>{item.date.slice(0, 10)}</time>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .section-header { margin-bottom: 3rem; }
  h1 {
    font-size: 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 400;
    margin: 0 0 0.75rem;
    opacity: 0.4;
  }
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(140, 120, 100, 0.12);
    gap: 1rem;
  }
  a { text-decoration: none; font-size: 1rem; }
  a:hover { text-decoration: underline; }
  .meta { display: flex; align-items: baseline; gap: 0.6rem; flex-shrink: 0; }
  .kind { font-size: 0.68rem; opacity: 0.35; letter-spacing: 0.06em; text-transform: uppercase; }
  time { font-size: 0.75rem; opacity: 0.4; white-space: nowrap; font-style: normal; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
