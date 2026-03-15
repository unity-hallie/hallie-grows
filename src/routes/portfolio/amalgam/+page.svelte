<svelte:head>
  <title>AMALGAM — move slow, fix things</title>
</svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <header>
    <div class="meta">
      <span class="year">2019</span>
      <span class="role">Designer — Final Form Games</span>
    </div>
    <h1>AMALGAM</h1>
    <p class="lede">A tabletop RPG built on Powered by the Apocalypse. Characters made from the broken parts of dead gods.</p>
  </header>

  <section class="body">
    <p>AMALGAM exists because as a teen I devoured Shadowrun sourcebooks, and it always struck me as wrong that the people who augment their bodies somehow had less connection to the spirit world.</p>

    <p>AMALGAM exists because, around the time I was searching out my first consultations for bottom surgery, I had the opportunity to work on a Game Chef entry that let me play with piecemeal bodies.</p>

    <p>AMALGAM exists because I need it to.</p>

    <p>The game is built to validate body modification and celebrate the process of everyone discovering their own relationship with their heritage and physicality. It's a place to explore the fuzzy boundaries between bodies, identities, communities, and selves. It had a full playtest cycle. It was never published.</p>

    <div class="detail-block">
      <div class="detail">
        <span class="detail-label">System</span>
        <span>Powered by the Apocalypse</span>
      </div>
      <div class="detail">
        <span class="detail-label">Status</span>
        <span>Playtested, unpublished</span>
      </div>
    </div>
  </section>
</article>

<style>
  article {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem 2rem 8rem;
  }
  .back {
    display: inline-block;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    opacity: 0.4;
    margin-bottom: 3rem;
    transition: opacity 0.15s;
  }
  .back:hover { opacity: 1; }
  header { margin-bottom: 2.5rem; }
  .meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    opacity: 0.45;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }
  h1 { font-size: 1.8rem; font-weight: 400; margin: 0 0 0.75rem; }
  .lede { font-size: 1.05rem; line-height: 1.75; color: #2a1f0f; margin: 0; }
  .body p { font-size: 1rem; line-height: 1.85; margin: 0 0 1.4rem; color: #1a1208; }
  .detail-block {
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(140, 120, 100, 0.15);
  }
  .detail { display: flex; gap: 1.5rem; font-size: 0.88rem; align-items: baseline; }
  .detail-label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.4;
    min-width: 60px;
  }
</style>
