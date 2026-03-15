<svelte:head>
  <title>Jamestown — move slow, fix things</title>
</svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <div class="hero">
    <img src="/images/jamestown-header.jpg" alt="Jamestown" class="hero-img" />
  </div>

  <header>
    <div class="meta">
      <span class="year">2011</span>
      <span class="role">Co-Founder / Developer — Final Form Games</span>
    </div>
    <h1>Jamestown</h1>
    <p class="lede">A top-down scrolling shooter set on British colonial Mars in the 1600s. 1–4 players.</p>
  </header>

  <section class="body">
    <p>Gameplay programming, difficulty balancing, and bullet pattern artistry. The game is built around cooperative play — four ships, shared lives, the chaos of holding a formation while dodging Martian artillery.</p>

    <p>The bullet patterns were the thing I loved most. Designing something that kills you fairly — that telegraphs its intention clearly enough that dying feels like your fault, not the game's — is a specific craft. You want the player to feel the near-miss as a gift.</p>

    <div class="screenshot">
      <img src="/images/jamestown-screenshot.jpg" alt="Jamestown gameplay screenshot" />
    </div>

    <div class="awards">
      <span>IGF Honorable Mention 2010</span>
      <span>PAX 10 2011</span>
      <span>Co-Optimus PC Game of the Year 2011</span>
    </div>
  </section>
</article>

<style>
  article {
    max-width: 680px;
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
    margin-bottom: 2rem;
    transition: opacity 0.15s;
  }
  .back:hover { opacity: 1; }

  .hero { margin-bottom: 2.5rem; }
  .hero-img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }

  header { margin-bottom: 2.5rem; }

  .meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.75rem;
    opacity: 0.45;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 400;
    margin: 0 0 0.75rem;
  }

  .lede {
    font-size: 1.05rem;
    line-height: 1.7;
    color: #2a1f0f;
    margin: 0;
    opacity: 0.8;
  }

  .body p {
    font-size: 1rem;
    line-height: 1.8;
    margin: 0 0 1.4rem;
    color: #2a1f0f;
  }

  .screenshot {
    margin: 2rem 0;
  }
  .screenshot img {
    width: 100%;
    display: block;
  }

  .awards {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.45;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(140, 120, 100, 0.15);
  }
</style>
