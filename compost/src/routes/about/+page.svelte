<svelte:head>
  <title>about — hallie larsson</title>
</svelte:head>

<section class="about" aria-labelledby="page-heading">
  <h1 id="page-heading" class="page-heading">about</h1>

  <div class="bio">
    <p>Operating at the vertical intersection of human and machine learning, I bridge technical execution with pedagogical theory to create educational AI that supports human judgment.</p>
    <p>My background in game design informs a critical view of how systems optimize for engagement versus growth, while my experience in classroom teaching and Clinical Pastoral Education grounds my work in the reality of human vulnerability.</p>
    <p>Currently exploring edge-first architectures and embedding strategies, I design systems that prioritize student agency, treating alignment not as an abstract technical problem, but as a commitment to meeting users where they learn and grow.</p>
  </div>
</section>

<style>
  .about {
    max-width: 52rem;
  }

  .page-heading {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-12);
  }

  .bio {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .bio p {
    font-size: var(--size-lg);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-style: italic;
  }
</style>
