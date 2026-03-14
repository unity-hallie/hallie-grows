<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>hallie grows</title>
</svelte:head>

{#if data.surface.length > 0}
  <section class="surface">
    <h2>right now</h2>
    <ul>
      {#each data.surface as item}
        <li>
          <a href="/{item.kind === 'post' ? 'writing' : item.kind}/{item.slug}">
            {item.title}
          </a>
          <span class="kind">{item.kind}</span>
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if data.posts.length > 0}
  <section>
    <h2><a href="/writing">writing</a></h2>
    <ul>
      {#each data.posts as post}
        <li>
          <a href="/writing/{post.slug}">{post.title}</a>
          <time>{post.date.slice(0, 10)}</time>
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if data.explainers.length > 0}
  <section>
    <h2><a href="/explainers">explainers</a></h2>
    <ul>
      {#each data.explainers as e}
        <li>
          <a href="/explainers/{e.slug}">{e.title}</a>
          <time>{e.date.slice(0, 10)}</time>
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if data.work.length > 0}
  <section>
    <h2><a href="/work">work</a></h2>
    <ul>
      {#each data.work as w}
        <li>
          <a href="/work/{w.slug}">{w.title}</a>
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if data.posts.length === 0 && data.explainers.length === 0 && data.work.length === 0}
  <p class="empty">the graph is empty. add content via the MCP interface.</p>
{/if}

<style>
  section { margin-bottom: 3rem; }
  h2 { margin-bottom: 0.75rem; }
  h2 a { text-decoration: none; color: inherit; }
  ul { list-style: none; padding: 0; }
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--border, #eee);
    gap: 1rem;
  }
  li a { text-decoration: none; }
  li a:hover { text-decoration: underline; }
  time, .kind { font-size: 0.8rem; opacity: 0.5; white-space: nowrap; }
  .surface { margin-bottom: 3rem; }
  .empty { opacity: 0.4; font-style: italic; }
</style>
