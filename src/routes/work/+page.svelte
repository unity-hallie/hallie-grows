<script lang="ts">
  import type { ManifestItem } from '$lib/types';
  import Card from '$lib/components/Card.svelte';

  let { data } = $props();
  let items: ManifestItem[] = $derived(data.manifest.filter((i: ManifestItem) => i.section === 'work'));
</script>

<svelte:head>
  <title>work — hallie larsson</title>
</svelte:head>

<section aria-labelledby="page-heading">
  <h1 id="page-heading" class="page-heading">work</h1>
  <p class="page-sub">shipped things and ongoing practice</p>

  <ul class="card-grid" role="list">
    {#each items as item}
      <li><Card {item} /></li>
    {/each}
  </ul>
</section>

<style>
  .page-heading {
    font-size: var(--size-2xl);
    font-style: italic;
    margin-bottom: var(--space-3);
  }
  .page-sub {
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: var(--space-12);
  }
  .card-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-4);
  }
</style>
