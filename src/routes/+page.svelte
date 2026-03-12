<script lang="ts">
  import type { ManifestItem } from '$lib/types';
  import Card from '$lib/components/Card.svelte';

  let { data } = $props();
  let featured: ManifestItem[] = $derived(data.manifest.filter((i: ManifestItem) => i.section === 'work').slice(0, 3));
</script>

<svelte:head>
  <title>hallie larsson</title>
  <meta name="description" content="Hallie Larsson — builder of games, tools, and substrates." />
</svelte:head>

<section class="landing" aria-labelledby="site-headline">
  <div class="headline-block">
    <h1 id="site-headline" class="headline">
      hallie larsson
    </h1>
    <p class="subhead">
      builder of games, tools, and substrates.<br />
      the material knows what it wants to be.
    </p>
  </div>

  <div class="nav-phase-key" aria-label="phase key">
    <dl>
      <div>
        <dt><span aria-hidden="true">◆</span> salt</dt>
        <dd>shipped. solid. permanent.</dd>
      </div>
      <div>
        <dt><span aria-hidden="true">◈</span> fluid</dt>
        <dd>flowing. stable until broken.</dd>
      </div>
      <div>
        <dt><span aria-hidden="true">◇</span> volatile</dt>
        <dd>always re-precipitating.</dd>
      </div>
    </dl>
  </div>
</section>

{#if featured.length}
  <section class="featured" aria-labelledby="featured-heading">
    <h2 id="featured-heading" class="section-label">selected work</h2>
    <ul class="card-grid" role="list">
      {#each featured as item}
        <li>
          <Card {item} />
        </li>
      {/each}
    </ul>
    <a href="/work" class="see-all">all work →</a>
  </section>
{/if}

<style>
  .landing {
    padding: var(--space-16) 0 var(--space-16);
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  .headline {
    font-size: clamp(2.5rem, 6vw, var(--size-3xl));
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .subhead {
    margin-top: var(--space-4);
    font-size: var(--size-lg);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-style: italic;
    max-width: 44ch;
  }

  .nav-phase-key {
    max-width: 36rem;
  }

  .nav-phase-key dl {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .nav-phase-key div {
    display: flex;
    gap: var(--space-4);
    align-items: baseline;
  }

  .nav-phase-key dt {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    letter-spacing: 0.06em;
    color: var(--amber-dim);
    min-width: 7ch;
  }

  .nav-phase-key dd {
    font-size: var(--size-sm);
    color: var(--text-dim);
    font-style: italic;
  }

  .featured {
    padding-bottom: var(--space-16);
  }

  .section-label {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    font-weight: 400;
    margin-bottom: var(--space-6);
  }

  .card-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
    gap: var(--space-4);
  }

  .see-all {
    display: inline-block;
    margin-top: var(--space-6);
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }

  .see-all:hover {
    color: var(--amber);
    border-bottom-color: transparent;
  }
</style>
