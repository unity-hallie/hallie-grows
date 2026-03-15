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
    <p>Infrastructure for building AI learning guides — educator-designed, embedded directly in coursework. Unity's learning designers and subject-matter experts use it to build guides that support learners through complex academic tasks, emphasizing metacognition, formative feedback, and learner agency.</p>

    <p>The first implementation, <a href="https://unity.edu/una/align-ai-support/" target="_blank" rel="noopener noreferrer">Una Guide</a>, launched January 2026 in select Unity courses. Students engage with structured Socratic coaching embedded in their coursework via Canvas LMS. Instructors receive transcripts for human assessment.</p>

    <p>Students control their own learning profiles with full edit and lock permissions.</p>

    <div class="detail-block">
      <div class="detail">
        <span class="detail-label">Stack</span>
        <span>PHP, Svelte, TypeScript, PostgreSQL, LTI</span>
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
