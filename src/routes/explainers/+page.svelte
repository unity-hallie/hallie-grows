<script lang="ts">
  import type { ManifestItem } from '$lib/types';
  import Card from '$lib/components/Card.svelte';

  let { data } = $props();
  let items: ManifestItem[] = $derived(data.manifest.filter((i: ManifestItem) => i.section === 'explainers'));
</script>

<svelte:head>
  <title>explainers — hallie larsson</title>
</svelte:head>

<section aria-labelledby="page-heading">
  <h1 id="page-heading" class="page-heading">explainers</h1>
  <p class="page-sub">technical ideas that want to be felt, not just understood</p>

  <ul class="card-grid" role="list">
    {#each items as item}
      <li><Card {item} /></li>
    {/each}
  </ul>
</section>

<style>
  .page-heading {
    color: var(--panel);
    font-size: var(--size-2xl);
    margin-bottom: var(--space-3);
  }
  .page-sub {
    color: oklch(62% 0.018 72);
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: var(--space-12);
  }
  .card-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-8);
  }
</style>
