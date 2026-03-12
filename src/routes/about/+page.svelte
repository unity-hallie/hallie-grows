<svelte:head>
  <title>about — hallie larsson</title>
</svelte:head>

<section class="about" aria-labelledby="page-heading">
  <h1 id="page-heading" class="page-heading">about</h1>

  <div class="bio">
    <p>
      I make things that think — games, tools, substrates for other people's thinking.
      The material matters. How it behaves under pressure matters.
      What it invites matters more than what it allows.
    </p>

    <p>
      Shipped <a href="/work">Jamestown</a> at Final Form Games.
      Building <a href="/work">Align</a> for people who learn sideways.
      Thinking through <a href="/toys">cosmo-sim</a> and <a href="/work">rhizome</a>
      in the margins.
    </p>

    <p>
      Based wherever the work is. She/her.
    </p>
  </div>

  <div class="contact">
    <p class="label">elsewhere</p>
    <!-- fill in as needed -->
    <ul role="list">
      <li><a href="https://github.com/hlarsson" target="_blank" rel="noopener">github</a></li>
    </ul>
  </div>
</section>

<style>
  .about {
    max-width: 52rem;
  }

  .page-heading {
    font-size: var(--size-2xl);
    font-style: italic;
    margin-bottom: var(--space-12);
  }

  .bio {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    margin-bottom: var(--space-16);
  }

  .bio p {
    font-size: var(--size-lg);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-style: italic;
  }

  .contact .label {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: var(--space-4);
  }

  .contact ul {
    list-style: none;
    display: flex;
    gap: var(--space-6);
  }

  .contact a {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--text-secondary);
  }

  .contact a:hover {
    color: var(--amber);
  }
</style>
