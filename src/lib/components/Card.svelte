<script lang="ts">
  import type { ManifestItem } from '$lib/types';

  let { item }: { item: ManifestItem } = $props();
</script>

<article
  class="card surface"
  data-phase={item.phase}
>
  <div class="card-inner">
    <header class="card-header">
      <h3 class="card-title">
        {#if item.url}
          <a href={item.url} target="_blank" rel="noopener">
            {item.title}
          </a>
        {:else}
          <a href={`/${item.section}/${item.slug}`}>
            {item.title}
          </a>
        {/if}
      </h3>
      {#if item.year}
        <span class="card-year">{item.year}</span>
      {/if}
    </header>

    <p class="card-description">{item.description}</p>

    <footer class="card-footer">
      <ul class="tag-list" role="list" aria-label="tags">
        {#each item.tags as tag}
          <li class="tag">{tag}</li>
        {/each}
      </ul>

      <span class="phase-mark" aria-label="phase: {item.phase}" title={item.phase}>
        {#if item.phase === 'salt'}◆{/if}
        {#if item.phase === 'fluid'}◈{/if}
        {#if item.phase === 'volatile'}◇{/if}
      </span>
    </footer>
  </div>
</article>

<style>
  .card {
    padding: var(--space-6);
    cursor: default;
  }

  .card-inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    height: 100%;
  }

  .card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .card-title {
    font-size: var(--size-md);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  .card-title a {
    color: var(--text-primary);
    border-bottom: none;
  }

  .card-title a:hover {
    color: var(--amber);
  }

  .card-year {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .card-description {
    font-size: var(--size-sm);
    color: var(--text-secondary);
    line-height: var(--leading-body);
    flex: 1;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--space-2);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    list-style: none;
  }

  .tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: var(--text-dim);
    background: oklch(100% 0 0 / 0.04);
    border: 1px solid oklch(100% 0 0 / 0.07);
    border-radius: 2px;
    padding: 1px 6px;
  }

  .phase-mark {
    font-size: var(--size-xs);
    color: var(--text-dim);
    opacity: 0.5;
    flex-shrink: 0;
  }

  [data-phase="volatile"] .phase-mark {
    opacity: 0.9;
    color: var(--amber);
  }
</style>
