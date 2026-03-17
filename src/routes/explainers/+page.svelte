<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>explainers — move slow, fix things</title></svelte:head>

<div class="section-header">
  <h1>explainers</h1>
</div>

{#if data.explainers.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul class="list">
    {#each data.explainers as e}
      <li>
        <a href="/explainers/{e.slug}" class="card" target="_blank" rel="noopener noreferrer">
          {#if e.image}
            <div class="img-wrap">
              <img src={e.image} alt={e.title} />
            </div>
          {/if}
          <div class="body">
            <h2>{e.title}</h2>
            {#if e.description}<p class="desc">{e.description}</p>{/if}
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .section-header { margin-bottom: 2.5rem; }
  h1 {
    font-size: 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 400;
    margin: 0;
    opacity: 0.4;
  }

  .list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2rem; }

  .card {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(140, 120, 100, 0.12);
    transition: border-color 0.15s;
  }
  .card:hover { border-color: rgba(140, 120, 100, 0.35); }

  .img-wrap {
    overflow: hidden;
    height: 180px;
  }
  .img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
    transition: transform 0.4s ease;
  }
  .card:hover .img-wrap img { transform: scale(1.02); }

  .body {
    padding: 1.25rem 1.5rem 1.25rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 0.6rem;
    line-height: 1.3;
  }

  .desc {
    margin: 0;
    font-size: 0.88rem;
    opacity: 0.6;
    line-height: 1.7;
  }

  .empty { opacity: 0.4; font-style: italic; }

  @media (max-width: 600px) {
    .card { grid-template-columns: 1fr; }
    .img-wrap { height: 160px; }
    .body { padding: 1rem; }
  }
</style>
