<svelte:head>
  <title>Jamestown — hallie larsson</title>
  <meta name="description" content="Neoclassical scrolling shooter set on British colonial Mars. PAX 10, Cooptimus PC Game of the Year. 81 Metacritic, 94% Steam." />
</svelte:head>

<article class="jamestown" data-phase="salt">

  <header class="page-header">
    <h1>Jamestown</h1>
    <p class="accolades">PAX 10 · Cooptimus PC Game of the Year · 81 Metacritic · 94% Steam</p>
    <a href="https://store.steampowered.com/app/94200/Jamestown/" target="_blank" rel="noopener" class="external-link">
      on Steam ↗
    </a>
  </header>

  <div class="content">

    <div class="video-wrap">
      <iframe
        src="https://www.youtube.com/embed/gk7UERiO3t4"
        title="Jamestown"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>

    <div class="video-wrap">
      <iframe
        src="https://www.youtube.com/embed/fCmSpwmHc7o"
        title="Jamestown+ Teaser Trailer: NINTENDO SWITCH"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>

    <!-- write here -->

  </div>

</article>

<style>
  .jamestown {
    max-width: 52rem;
  }

  .page-header {
    padding-bottom: var(--space-12);
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: var(--space-12);
  }

  h1 {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-4);
  }

  .accolades {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    letter-spacing: 0.06em;
    color: var(--amber);
    margin-bottom: var(--space-6);
  }

  .external-link {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }

  .external-link:hover {
    color: var(--rose);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  .content p {
    font-size: var(--size-lg);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
  }

  .video-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .video-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
</style>
