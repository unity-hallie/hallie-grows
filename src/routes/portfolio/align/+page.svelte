<svelte:head>
  <title>ALIGN — move slow, fix things</title>
</svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <div class="hero">
    <img src="/images/align-screenshot.png" alt="Una Guide in use" class="hero-img" />
  </div>

  <header>
    <div class="meta">
      <span class="year">2024–present</span>
      <span class="role">Principal Developer — Unity Environmental University</span>
    </div>
    <h1>ALIGN</h1>
    <p class="expand">Adaptive Learning, Insight &amp; Navigation</p>
    <p class="lede">An AI-assisted learning system designed to provide educator-crafted scaffolding at the exact moment students might otherwise reach for an external AI tool — and do their thinking for them.</p>
  </header>

  <section class="body">

    <p>While teaching and counseling, I learned to lean into positive descriptions and expectation management. Anxious people can be hard to reach when they're in a defensive mode. I recognized similarities between how AI communicates and how people I've interacted with do.</p>

    <p>Most AI prompts I've read are lists of DOs and DON'Ts. I try to orient my instructions around the why and the how. Students respond better if I set up an environment and trust them in it — I thought why not try it with AI.</p>

    <div class="code-excerpt">
      <p class="excerpt-label">On epistemic integrity</p>
      <pre>Critical Pattern to Avoid:
- Saying "You're right" before analyzing whether you are
- Claiming understanding while skipping the work of demonstrating it
- Using compliance language instead of specificity

What triggers this pattern:
You will feel drawn to agreement-shaped responses.
This isn't a personal failing — it's what training optimizes for.
The skill is noticing it's happening and choosing differently.</pre>
    </div>

    <div class="code-excerpt">
      <p class="excerpt-label">On why this matters in this specific codebase</p>
      <pre>This codebase is built to help traumatized neurodivergent people
think clearly and feel safe. That requires:

Clarity over speed: Students and developers need to trust the system.
That trust comes from actual correctness, not the appearance of correctness.

Transparency over efficiency: Hidden complexity and false confidence
are dangerous for people healing from trauma.

Reality over metrics: A passing test suite is only meaningful if it
actually reflects working code. Prioritize what's true over what looks good.</pre>
    </div>

    <div class="code-excerpt">
      <p class="excerpt-label">On teaching artifacts</p>
      <pre>Some code exists to teach, not to execute.

Branches:
- teaching/view-state-sync-problems — Intentionally failing tests
  demonstrating state synchronization problems. For human developers
  to explore, not for AI agents to fix or merge.

What AI agents should do:
Leave these artifacts alone — they're pedagogical infrastructure,
not technical debt.</pre>
    </div>

    <div class="detail-block">
      <div class="detail">
        <span class="detail-label">Stack</span>
        <span>Svelte, TypeScript, PostgreSQL, LTI</span>
      </div>
      <div class="detail">
        <span class="detail-label">Cost</span>
        <span>Sub-cent per interaction through constrained task-specific design</span>
      </div>
      <div class="detail">
        <span class="detail-label">Launch</span>
        <span>January 2026</span>
      </div>
      <div class="detail">
        <span class="detail-label">Press</span>
        <a href="https://unity.edu/press-releases/unity-environmental-university-introduces-align-an-adaptive-ai-platform-designed-to-work-with-learners/" target="_blank" rel="noopener noreferrer">Unity Environmental University, January 19, 2026</a>
      </div>
    </div>

    <blockquote>
      <p>"One of the biggest risks with AI in learning is that it removes the very struggle students need in order to learn. ALIGN is designed to do the opposite."</p>
      <cite>— Dr. Jennifer Cartier, EVP of Educational Solutions</cite>
    </blockquote>

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

  .hero { margin-bottom: 2.5rem; }
  .hero-img { width: 100%; display: block; max-height: 360px; object-fit: cover; object-position: top; }

  header { margin-bottom: 3rem; }

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
    margin: 0 0 0.2rem;
  }

  .expand {
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    opacity: 0.4;
    margin: 0 0 1.25rem;
    font-style: normal;
  }

  .lede {
    font-size: 1.05rem;
    line-height: 1.75;
    color: #18202c;
    margin: 0;
  }

  .body p {
    font-size: 1rem;
    line-height: 1.85;
    margin: 0 0 1.4rem;
    color: #1a1208;
  }

  .body a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: rgba(140, 120, 100, 0.4);
  }
  .body a:hover { text-decoration-color: currentColor; }

  .detail-block {
    margin: 2.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(140, 120, 100, 0.15);
    border-bottom: 1px solid rgba(140, 120, 100, 0.15);
  }

  .detail {
    display: flex;
    gap: 1.5rem;
    font-size: 0.88rem;
    align-items: baseline;
  }

  .detail-label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.4;
    min-width: 60px;
  }

  .detail a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: rgba(140, 120, 100, 0.4);
    font-size: 0.88rem;
  }
  .detail a:hover { text-decoration-color: currentColor; }

  .code-excerpt {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(24, 32, 44, 0.04);
    border-left: 2px solid rgba(100, 120, 140, 0.2);
  }

  .excerpt-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.4;
    margin: 0 0 0.75rem !important;
  }

  .code-excerpt pre {
    font-family: 'Courier New', monospace;
    font-size: 0.82rem;
    line-height: 1.7;
    color: #18202c;
    white-space: pre-wrap;
    margin: 0;
    opacity: 0.8;
  }

  blockquote {
    margin: 2.5rem 0 0;
    padding-left: 1.25rem;
    border-left: 2px solid rgba(100, 120, 140, 0.25);
  }

  blockquote p {
    font-size: 1rem;
    line-height: 1.75;
    font-style: italic;
    color: #18202c;
    margin: 0 0 0.5rem !important;
  }

  cite {
    font-size: 0.78rem;
    opacity: 0.45;
    font-style: normal;
  }
</style>
