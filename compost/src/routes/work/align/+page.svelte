<svelte:head>
  <title>Align — hallie larsson</title>
  <meta name="description" content="Trauma-informed Socratic learning platform. Built for Unity Environmental University." />
</svelte:head>

<article class="align" data-phase="fluid">

  <header class="page-header">
    <h1>Align</h1>
    <a href="https://unity.edu/press-releases/unity-environmental-university-introduces-align-an-adaptive-ai-platform-designed-to-work-with-learners/" target="_blank" rel="noopener" class="external-link">
      press release ↗
    </a>
  </header>

  <div class="content">
    <p>Student-facing AI learning tool designed to provide educator-designed scaffolding at moments when students might otherwise reach for external AI tools. System architecture centers bounded prompt-response interactions where students engage with structured scenarios rather than open-ended chat.</p>
    <p>Preserves student agency and trust while surfacing the learning process to instructors for human assessment. Students control their own learning profiles with full edit/lock permissions. Achieves sub-cent per interaction costs through constrained task-specific design.</p>
  </div>

</article>

<style>
  .align {
    max-width: 52rem;
  }

  .page-header {
    padding-bottom: var(--space-12);
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: var(--space-12);
  }

  h1 {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-6);
  }

  .external-link {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }

  .external-link:hover {
    color: var(--lichen);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .content p {
    font-size: var(--size-md);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
  }
</style>
