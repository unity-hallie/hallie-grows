<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>feed — move slow, fix things</title></svelte:head>

<div class="section-header">
  <h1>feed</h1>
  <p class="desc">conversations, made slowly. dispatches from thinking in progress.</p>
</div>

{#if data.posts.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.posts as post}
      <li>
        <a href="/read/{post.slug}">{post.title}</a>
        <time>{post.date.slice(0, 10)}</time>
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
    color: #2a1f0f;
    margin: 0;
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
  time { font-size: 0.75rem; opacity: 0.4; white-space: nowrap; font-style: normal; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
