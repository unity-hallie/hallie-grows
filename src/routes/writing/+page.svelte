<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head><title>writing — hallie grows</title></svelte:head>

<h1>writing</h1>

{#if data.posts.length === 0}
  <p class="empty">nothing yet.</p>
{:else}
  <ul>
    {#each data.posts as post}
      <li>
        <a href="/writing/{post.slug}">{post.title}</a>
        <time>{post.date.slice(0, 10)}</time>
      </li>
    {/each}
  </ul>
{/if}

<style>
  h1 { margin-bottom: 2rem; }
  ul { list-style: none; padding: 0; }
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border, #eee);
  }
  a { text-decoration: none; }
  a:hover { text-decoration: underline; }
  time { font-size: 0.8rem; opacity: 0.5; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
