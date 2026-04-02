<script lang="ts">
  import type { PageData } from './$types'
  let { data }: { data: PageData } = $props()

  const typeIcons: Record<string, string> = {
    move: '🚶',
    talk: '💬',
    event: '⚡',
    death: '💀',
    midnight: '🕛',
    narrator: '🪸',
    note: '📝',
  }
</script>

<svelte:head>
  <title>{data.title} — move slow, fix things</title>
  <meta http-equiv="refresh" content="30">
  <link rel="alternate" type="application/rss+xml" title="Live Playthrough RSS" href="/live/rss.xml">
</svelte:head>

<div class="live-feed">
  <header>
    <h1>{data.title}</h1>
    <p class="subtitle">{data.subtitle}</p>
    <p class="meta">auto-refreshes every 30s · <a href="/live/rss.xml">rss</a></p>
  </header>

  {#if data.events.length === 0}
    <p class="empty">the town is quiet. waiting for the first move.</p>
  {:else}
    <div class="events">
      {#each data.events as event}
        <article class="event {event.type}">
          <div class="event-header">
            <span class="icon">{typeIcons[event.type] ?? '·'}</span>
            <span class="location">{event.location}</span>
            <span class="time">Day {event.day}, {event.hour}</span>
          </div>
          <p class="text">{event.text}</p>
          <time class="real-time">{new Date(event.ts).toLocaleTimeString()}</time>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .live-feed { max-width: 640px; margin: 0 auto; }
  header { margin-bottom: 2rem; }
  h1 { font-size: 1.2rem; font-weight: 400; margin: 0 0 0.25rem; }
  .subtitle { opacity: 0.5; font-size: 0.85rem; margin: 0 0 0.25rem; }
  .meta { opacity: 0.3; font-size: 0.75rem; }
  .meta a { opacity: 0.6; }

  .events { display: flex; flex-direction: column; gap: 1rem; }

  .event {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(140, 120, 100, 0.12);
  }
  .event-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
  }
  .icon { font-size: 0.9rem; }
  .location { font-size: 0.8rem; opacity: 0.5; letter-spacing: 0.04em; text-transform: uppercase; }
  .time { font-size: 0.75rem; opacity: 0.35; margin-left: auto; }
  .text { margin: 0; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; }
  .real-time { font-size: 0.65rem; opacity: 0.2; display: block; margin-top: 0.25rem; }

  .event.death { border-left: 2px solid rgba(180, 40, 40, 0.4); padding-left: 0.75rem; }
  .event.midnight { border-left: 2px solid rgba(60, 60, 120, 0.4); padding-left: 0.75rem; }
  .event.narrator { border-left: 2px solid rgba(120, 180, 160, 0.3); padding-left: 0.75rem; font-style: italic; }

  .empty { opacity: 0.4; font-style: italic; }
</style>
