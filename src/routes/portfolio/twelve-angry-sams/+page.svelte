<svelte:head>
  <title>Twelve Angry Sams — move slow, fix things</title>
</svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <header>
    <div class="meta">
      <span class="year">2019</span>
      <span class="role">Designer</span>
    </div>
    <h1>Twelve Angry Sams</h1>
    <p class="lede">A GM-less tabletop RPG for 3–6 players. Double Ashcan Edition.</p>
  </header>

  <section class="body">
    <p>Hello! As you can see from the watermark in your lower-right field of vision, you are currently a simulation. Thank you for joining us! Today we are prototyping a new form of consensual criminal justice.</p>

    <p>You are a simulated future version of Sam — the you that's on trial right now. Together with other future-possible-yous, you will decide what crime was committed and what punishment to receive.</p>

    <p>Players take turns as GM, setting up and playing out scenes. There is no consistent authority — consensus-based decision making throughout. Safety tools built in from the start.</p>

    <div class="detail-block">
      <div class="detail">
        <span class="detail-label">Players</span>
        <span>3–6 (up to 12)</span>
      </div>
      <div class="detail">
        <span class="detail-label">Duration</span>
        <span>2–4 hours</span>
      </div>
      <div class="detail">
        <span class="detail-label">Status</span>
        <span>Double Ashcan Edition — playtested, unpublished</span>
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
