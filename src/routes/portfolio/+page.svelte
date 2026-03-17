<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  const heroSlugs = ['align', 'jamestown']
  const heroes = $derived(data.work.filter(w => heroSlugs.includes(w.slug)))
  const rest   = $derived(data.work.filter(w => !heroSlugs.includes(w.slug)))

  const images: Record<string, string> = {
    jamestown: '/images/jamestown-header.jpg',
    align: '/images/align-screenshot.png',
  }
</script>

<svelte:head><title>portfolio — move slow, fix things</title></svelte:head>

<div class="section-header">
  <h1>portfolio</h1>
</div>

{#if data.work.length === 0}
  <p class="empty">nothing yet.</p>
{:else}

  <!-- hero pieces -->
  <div class="heroes">
    {#each heroes as w}
      <a href={`/portfolio/${w.slug}`} class="hero-card">
        {#if images[w.slug]}
          <div class="hero-img-wrap">
            <img src={images[w.slug]} alt={w.title} />
          </div>
        {:else}
          <div class="hero-img-wrap hero-placeholder"></div>
        {/if}
        <div class="hero-body">
          <div class="hero-title">{w.title}</div>
          {#if w.description}
            <p class="hero-desc">{w.description}</p>
          {/if}
          <span class="hero-year">{w.date.slice(0, 4)}</span>
        </div>
      </a>
    {/each}
  </div>

  <!-- rest of work -->
  {#if rest.length > 0}
    <ul class="rest">
      {#each rest as w}
        <li>
          <div class="item">
            <a href={w.url ?? `/portfolio/${w.slug}`} target={w.url ? '_blank' : undefined} rel={w.url ? 'noopener noreferrer' : undefined}>{w.title}</a>
            {#if w.description}<p class="item-desc">{w.description}</p>{/if}
          </div>
          {#if w.date}<time>{w.date.slice(0, 4)}</time>{/if}
        </li>
      {/each}
    </ul>
  {/if}

  <div class="explainers-link">
    <a href="/explainers">all explainers →</a>
  </div>

{/if}

<style>
  .section-header { margin-bottom: 2.5rem; }
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
    color: #18202c;
    margin: 0;
  }

  /* heroes */
  .heroes {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .hero-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(140, 120, 100, 0.15);
    transition: border-color 0.15s;
  }
  .hero-card:hover { border-color: rgba(140, 120, 100, 0.4); }

  .hero-img-wrap {
    width: 100%;
    height: 220px;
    overflow: hidden;
  }
  .hero-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    transition: transform 0.4s ease;
  }
  .hero-card:hover .hero-img-wrap img { transform: scale(1.02); }
  .hero-placeholder {
    background: rgba(140, 120, 100, 0.06);
  }

  .hero-body {
    padding: 1.25rem 1.5rem 1.5rem;
  }
  .hero-title {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
  }
  .hero-desc {
    font-size: 0.88rem;
    line-height: 1.6;
    opacity: 0.6;
    margin: 0 0 0.75rem;
  }
  .hero-year {
    font-size: 0.72rem;
    opacity: 0.35;
    letter-spacing: 0.06em;
  }

  /* rest */
  .rest { list-style: none; padding: 0; margin: 0; }
  .rest li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(100, 120, 140, 0.1);
    gap: 2rem;
  }
  .item { flex: 1; }
  .item a { text-decoration: none; font-size: 1rem; font-weight: 500; }
  .item a:hover { text-decoration: underline; }
  .item-desc { margin: 0.3rem 0 0; font-size: 0.88rem; opacity: 0.55; line-height: 1.6; }
  time { font-size: 0.72rem; opacity: 0.35; white-space: nowrap; font-style: normal; padding-top: 0.2rem; }
  .empty { opacity: 0.4; font-style: italic; }

  .explainers-link {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(100, 120, 140, 0.1);
  }
  .explainers-link a { text-decoration: none; font-size: 1rem; font-weight: 500; opacity: 0.5; }
  .explainers-link a:hover { opacity: 1; text-decoration: underline; }
</style>
