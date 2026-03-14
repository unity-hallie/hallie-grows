<script lang="ts">
  import type { ManifestItem } from '$lib/types';

  let { data } = $props();
  let item: ManifestItem = $derived(data.item);
  let related: ManifestItem[] = $derived(
    item.relations.map((r: { slug: string }) => data.manifest.find((i: ManifestItem) => i.slug === r.slug)).filter((x): x is ManifestItem => !!x)
  );

  let blocks = $state<string[]>([]);

  $effect(() => {
    blocks = (data.content as Record<string, string[]>)[item.slug] ?? ['tktktk', 'tktktk'];
  });

  async function save() {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: item.slug, blocks: [...blocks] }),
    });
  }

  function onblur(e: FocusEvent, i: number) {
    const text = (e.currentTarget as HTMLElement).innerText.trim();
    if (text !== blocks[i]) {
      blocks[i] = text;
      save();
    }
  }
</script>

<svelte:head>
  <title>{item.title} — hallie larsson</title>
  <meta name="description" content={item.description} />
</svelte:head>

<article data-phase={item.phase} class="item-page">
  <header class="item-header">
    <div class="item-meta">
      <span class="phase-label">{item.phase}</span>
      {#if item.year}<span class="item-year">{item.year}</span>{/if}
    </div>
    <h1 class="item-title">{item.title}</h1>
    <p class="item-description">{item.description}</p>
    {#if item.url}
      <a href={item.url} target="_blank" rel="noopener" class="item-link">
        visit ↗
      </a>
    {/if}
  </header>

  <div class="item-content">
    {#each blocks as block, i}
      <p
        class="tktk"
        class:filled={block !== 'tktktk'}
        contenteditable="true"
        spellcheck="false"
        onblur={(e) => onblur(e, i)}
      >{block}</p>
    {/each}
  </div>

  {#if related.length}
    <aside class="related" aria-labelledby="related-heading">
      <h2 id="related-heading" class="related-heading">related</h2>
      <ul role="list" class="related-list">
        {#each related as rel}
          <li>
            <a href="/{rel.section}/{rel.slug}" data-phase={rel.phase}>
              {rel.title}
            </a>
            <span class="related-phase">{rel.phase}</span>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</article>

<style>
  .item-page {
    max-width: 52rem;
  }

  .item-header {
    padding-bottom: var(--space-12);
    border-bottom: 1px solid oklch(35% 0.025 58 / 0.18);
    margin-bottom: var(--space-12);
  }

  .item-meta {
    display: flex;
    gap: var(--space-4);
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .phase-label {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    letter-spacing: 0.08em;
    color: var(--rose-dim);
  }

  .item-year {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    color: var(--text-dim);
  }

  .item-title {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-4);
  }

  .item-description {
    font-size: var(--size-lg);
    color: var(--text-secondary);
    font-style: italic;
    line-height: var(--leading-loose);
    margin-bottom: var(--space-6);
  }

  .item-link {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--rose-dim);
  }

  .tktk {
    border-bottom: 1px dashed var(--lichen-dim);
    color: var(--lichen-dim);
    cursor: text;
    outline: none;
    display: block;
    margin-bottom: var(--space-4);
  }

  .tktk:focus {
    border-bottom-color: var(--lichen);
    color: var(--text-secondary);
  }

  .tktk.filled {
    border-bottom-color: transparent;
    color: var(--text-secondary);
    font-style: italic;
    line-height: var(--leading-loose);
  }

  .tktk.filled:focus {
    border-bottom-color: var(--lichen-dim);
  }

  .related {
    margin-top: var(--space-16);
    padding-top: var(--space-8);
    border-top: 1px solid oklch(35% 0.025 58 / 0.15);
  }

  .related-heading {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    font-weight: 400;
    margin-bottom: var(--space-4);
  }

  .related-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .related-list li {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
  }

  .related-list a {
    color: var(--text-secondary);
  }

  .related-list a:hover {
    color: var(--rose);
  }

  .related-phase {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    color: var(--text-dim);
  }
</style>
