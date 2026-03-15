<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>seeds — move slow, fix things</title></svelte:head>

<div class="section-header">
  <h1>seeds</h1>
  <p class="desc">interactive artifacts and experiments. planted, still growing.</p>
</div>

{#if data.explainers.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.explainers as e}
      <li>
        <div class="item">
          <a href={e.url ?? `/explainers/${e.slug}`} target={e.url ? '_blank' : undefined} rel={e.url ? 'noopener noreferrer' : undefined}>
            {e.title}
          </a>
          {#if e.description}<p class="item-desc">{e.description}</p>{/if}
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
  .desc {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #2a2520;
    margin: 0;
  }
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(120, 110, 100, 0.12);
  }
  .item { flex: 1; }
  a { text-decoration: none; font-size: 1rem; font-weight: 500; }
  a:hover { text-decoration: underline; }
  .item-desc { margin: 0.3rem 0 0; font-size: 0.9rem; opacity: 0.6; line-height: 1.6; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
