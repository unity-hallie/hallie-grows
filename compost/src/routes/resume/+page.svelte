<svelte:head>
  <title>resume — hallie larsson</title>
</svelte:head>

<article class="resume">

  <header class="resume-header">
    <h1>Hallie Larsson</h1>
    <p class="contact">
      <a href="mailto:halsted.larsson@gmail.com">halsted.larsson@gmail.com</a>
    </p>
    <p class="statement">
      Operating at the vertical intersection of human and machine learning, I bridge technical
      execution with pedagogical theory to create educational AI that supports human judgment.
      My background in game design informs a critical view of how systems optimize for engagement
      versus growth, while my experience in classroom teaching and Clinical Pastoral Education
      grounds my work in the reality of human vulnerability. Currently exploring edge-first
      architectures and embedding strategies, I design systems that prioritize student agency,
      treating alignment not as an abstract technical problem, but as a commitment to meeting
      users where they learn and grow.
    </p>
  </header>

  <section class="resume-section">
    <h2>Current</h2>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Director of Cybernetic Design</span>
        <span class="entry-meta">Unity Environmental University · 2025–Present</span>
      </div>
      <p>Direct the Learning Technology unit, leading development of educational AI tools and internal process automation. Continue building and refining automation tools that support Learning Designers across the course development lifecycle.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">ALIGN — Educational AI Scaffolding System</span>
        <span class="entry-meta">Principal Developer · 2024–Present</span>
      </div>
      <p>Student-facing AI learning tool designed to provide educator-designed scaffolding at moments when students might otherwise reach for external AI tools. System architecture centers bounded prompt-response interactions where students engage with structured scenarios rather than open-ended chat. Preserves student agency and trust while surfacing the learning process to instructors for human assessment. Students control their own learning profiles with full edit/lock permissions. Achieves sub-cent per interaction costs through constrained task-specific design.</p>
      <a href="https://unity.edu/press-releases/unity-environmental-university-introduces-align-an-adaptive-ai-platform-designed-to-work-with-learners/" target="_blank" rel="noopener" class="entry-link">press release ↗</a>
    </div>
  </section>

  <section class="resume-section">
    <h2>Experience</h2>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Integrations and Automations Solutioneer</span>
        <span class="entry-meta">Unity Environmental University · 2024</span>
      </div>
      <p>Spearheaded development of Chrome extension using React/TypeScript to streamline course production in Canvas LMS, reducing deployment time by 3×. Implemented automated course validation processes with modular architecture. Developed student-facing chatbots for stakeholder interview practice.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Freelance Software Developer</span>
        <span class="entry-meta">Level 8 Design Studio, Portland ME · 2019–2022</span>
      </div>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Computer Science Teacher</span>
        <span class="entry-meta">Baxter Academy, Portland ME · 2015–2019</span>
      </div>
      <p>Designed and taught programming and computer science courses to high school students. Oversaw year-long game design projects. Led implementation of Slate standards-based grading system; co-designed and developed custom transcript generator.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Co-Founder / Developer</span>
        <span class="entry-meta">Final Form Games, Philadelphia PA · 2009–2012</span>
      </div>
      <p>Co-designed and co-programmed <em>Jamestown</em>. IGF Honorable Mention 2010, PAX 10 2011, Co-Optimus PC Game of the Year 2011.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Research Associate</span>
        <span class="entry-meta">LeapFrog Enterprises, Emeryville CA · 2006–2008</span>
      </div>
      <p>Co-designed Learning Path system and curriculum architecture for educational products.</p>
    </div>
  </section>

  <section class="resume-section">
    <h2>Crisis Support</h2>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Clinical Pastoral Education Intern</span>
        <span class="entry-meta">Thomas Jefferson University Hospital, Philadelphia PA · 2004</span>
      </div>
      <p>Provided spiritual care and crisis intervention for patients and families in acute medical settings. 800+ hours. Training emphasized presence, active listening, and supporting people through trauma and loss.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Peer Support Crisis Counselor</span>
        <span class="entry-meta">Trans Lifeline · 2019–2021</span>
      </div>
      <p>Provided peer-to-peer crisis support via national hotline for trans and questioning callers.</p>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Youth Program Facilitator</span>
        <span class="entry-meta">MaineTransNet · 2020–2023</span>
      </div>
      <p>Facilitated programming for trans high school students. Supported youth in crisis through online community moderation.</p>
    </div>
  </section>

  <section class="resume-section">
    <h2>Education</h2>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Stanford University School of Education</span>
        <span class="entry-meta">MA, Learning Design and Technology · 2006</span>
      </div>
    </div>

    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Haverford College</span>
        <span class="entry-meta">BA, Religious Studies · 2003</span>
      </div>
    </div>
  </section>

  <section class="resume-section">
    <h2>Skills</h2>
    <p class="skills">JavaScript · TypeScript · Python · PHP · Lua · C# · SQL · React · Svelte · Vue · Node.js · Canvas LMS API · PostgreSQL · Git · Claude · PyTorch</p>
  </section>

</article>

<style>
  .resume {
    max-width: 52rem;
    padding-bottom: var(--space-24);
  }

  .resume-header {
    padding-bottom: var(--space-12);
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: var(--space-12);
  }

  .resume-header h1 {
    font-size: var(--size-2xl);
    margin-bottom: var(--space-3);
  }

  .contact {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    color: var(--text-dim);
    margin-bottom: var(--space-8);
  }

  .statement {
    font-size: var(--size-md);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    font-style: italic;
    max-width: 60ch;
  }

  .resume-section {
    margin-bottom: var(--space-12);
    padding-bottom: var(--space-12);
    border-bottom: 1px solid var(--surface-border);
  }

  .resume-section:last-child {
    border-bottom: none;
  }

  h2 {
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    font-weight: 400;
    margin-bottom: var(--space-8);
  }

  .entry {
    margin-bottom: var(--space-8);
  }

  .entry:last-child {
    margin-bottom: 0;
  }

  .entry-header {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    flex-wrap: wrap;
    margin-bottom: var(--space-2);
  }

  .entry-title {
    font-size: var(--size-md);
    color: var(--text-primary);
    font-weight: 400;
  }

  .entry-meta {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    color: var(--text-dim);
    letter-spacing: 0.03em;
  }

  .entry p {
    font-size: var(--size-sm);
    color: var(--text-secondary);
    line-height: var(--leading-body);
    max-width: 60ch;
  }

  .entry-link {
    display: inline-block;
    margin-top: var(--space-2);
    font-family: var(--font-ui);
    font-size: var(--size-xs);
    letter-spacing: 0.04em;
    color: var(--text-dim);
  }

  .entry-link:hover {
    color: var(--lichen);
  }

  .skills {
    font-family: var(--font-mono);
    font-size: var(--size-sm);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    letter-spacing: 0.02em;
  }
</style>
