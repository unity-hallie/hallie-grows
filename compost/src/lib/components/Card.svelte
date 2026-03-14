<script lang="ts">
  import type { ManifestItem } from '$lib/types';

  let { item }: { item: ManifestItem } = $props();

  const external = !!item.url && (item.section === 'explainers' || item.section === 'sketches');
  const href = external ? item.url! : `/${item.section}/${item.slug}`;
</script>

<article
  class="card surface"
  data-phase={item.phase}
>
  <a {href} class="card-link" tabindex="-1" aria-hidden="true"
     target={external ? '_blank' : undefined}
     rel={external ? 'noopener' : undefined}>
    <div class="card-frame">
      {#if item.image}
        <img src={item.image} alt={item.title} class="card-image" />
      {:else}
        <div class="card-image-placeholder"></div>
      {/if}
    </div>
  </a>

  <div class="card-inner">
    <header class="card-header">
      <h3 class="card-title">
        <a {href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
          {item.title}
        </a>
      </h3>
      {#if item.year}
        <span class="card-year">{item.year}</span>
      {/if}
    </header>

    <p class="card-description">{item.description}</p>

    <footer class="card-footer">
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
    padding: 0;
    overflow: hidden;
    cursor: default;
  }

  /* Frame — recessed image area, like a print in a mat */
  .card-frame {
    padding: var(--space-6);
    background: var(--panel-deep);
    border-bottom: 1px solid var(--surface-border);
    position: relative;
  }

  .card-image,
  .card-image-placeholder {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 1px solid oklch(35% 0.025 58 / 0.15);
    box-shadow:
      inset 0 1px 4px oklch(20% 0.02 55 / 0.12),
      inset 0 0 0 1px oklch(100% 0 0 / 0.08);
  }

  .card-image {
    object-fit: cover;
    display: block;
  }

  .card-image-placeholder {
    background:
      repeating-linear-gradient(
        -45deg,
        oklch(78% 0.025 76) 0px,
        oklch(78% 0.025 76) 1px,
        oklch(85% 0.030 78) 1px,
        oklch(85% 0.030 78) 8px
      );
  }

  .card-link {
    display: block;
    border-bottom: none;
  }

  .card-link:hover .card-frame {
    background: var(--ground-grain);
  }

  .card-inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    height: 100%;
    padding: var(--space-6) var(--space-8) var(--space-8);
  }

  .card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .card-title {
    font-size: var(--size-md);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .card-title a {
    color: var(--text-primary);
    border-bottom: none;
  }

  .card-title a:hover {
    color: var(--rose);
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
    margin-top: var(--space-2);
  }

  .phase-mark {
    font-size: var(--size-xs);
    color: var(--text-dim);
    opacity: 0.5;
    flex-shrink: 0;
  }

  [data-phase="volatile"] .phase-mark {
    opacity: 0.9;
    color: var(--rose);
  }
</style>
