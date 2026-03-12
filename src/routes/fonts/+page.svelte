<script lang="ts">
  // Dev-only font explorer. Not in nav, not in manifest.
  // Visit /fonts to use.

  let chosen = $state(
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('hallie-font-name') ?? 'EB Garamond')
      : 'EB Garamond'
  );

  const fonts = [
    {
      name: 'EB Garamond',
      family: "'EB Garamond', Georgia, serif",
      character: 'The current font. Warm, literary, Italian Renaissance. It breathes.',
      italic: true,
    },
    {
      name: 'Cormorant',
      family: "'Cormorant', Georgia, serif",
      character: 'Very fine. Old French printing. Almost too delicate — but the delicacy is the point.',
      italic: true,
    },
    {
      name: 'Cormorant Garamond',
      family: "'Cormorant Garamond', Georgia, serif",
      character: 'Cormorant with more body. Still fine-boned but it can hold weight. Carved quality.',
      italic: true,
    },
    {
      name: 'Libre Caslon Text',
      family: "'Libre Caslon Text', Georgia, serif",
      character: 'Colonial American workhorse. Honest, no excess. Type set by hand, dried in cold air.',
      italic: true,
    },
    {
      name: 'Playfair Display',
      family: "'Playfair Display', Georgia, serif",
      character: '18th century engraving. High contrast between thick and thin strokes. Feels pressed into the page.',
      italic: true,
    },
    {
      name: 'Cinzel',
      family: "'Cinzel', Georgia, serif",
      character: 'Based on Roman stone inscription. Literally carved. No italics — it only knows one register.',
      italic: false,
    },
    {
      name: 'Spectral',
      family: "'Spectral', Georgia, serif",
      character: 'Screen-optimized but feels old. Quiet. Designed for long reading, like water that stays still.',
      italic: true,
    },
    {
      name: 'Libre Baskerville',
      family: "'Libre Baskerville', Georgia, serif",
      character: 'Solid, warm, nothing wasted. John Baskerville wanted to improve on Caslon. He did.',
      italic: true,
    },
  ];

  function apply(font: typeof fonts[0]) {
    document.documentElement.style.setProperty('--font-body', font.family);
    localStorage.setItem('hallie-font-choice', font.family);
    localStorage.setItem('hallie-font-name', font.name);
    chosen = font.name;
  }

  function reset() {
    document.documentElement.style.removeProperty('--font-body');
    localStorage.removeItem('hallie-font-choice');
    localStorage.removeItem('hallie-font-name');
    chosen = 'EB Garamond';
  }
</script>

<svelte:head>
  <title>fonts — dev</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Cinzel:wght@400;500&family=Spectral:ital,wght@0,400;0,500;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
  />
</svelte:head>

<section class="explorer">
  <header class="explorer-header">
    <h1>type specimens</h1>
    <p class="lede">
      Looking for something that feels new but carved. Old marks in fresh wood.
      Each specimen below shows the same text — the actual site vocabulary —
      so you can feel the difference without imagining it.
    </p>
    <p class="current-note">
      currently using: <strong>{chosen}</strong>
      {#if chosen !== 'EB Garamond'}
        — <button class="reset" onclick={reset}>reset</button>
      {/if}
    </p>
  </header>

  <div class="specimens">
    {#each fonts as font}
      <article
        class="specimen"
        class:active={chosen === font.name}
        style="font-family: {font.family};"
      >
        <div class="specimen-meta">
          <span class="specimen-name">{font.name}</span>
          <p class="specimen-character">{font.character}</p>
        </div>

        <div class="specimen-body">
          <div class="specimen-wordmark">
            {font.italic ? 'hallie larsson' : 'HALLIE LARSSON'}
          </div>

          <h2 class="specimen-heading">grown from uncarved wood</h2>

          <p class="specimen-subhead">
            {font.italic ? 'edges compose. statelessness is a feature.' : 'EDGES COMPOSE. STATELESSNESS IS A FEATURE.'}
          </p>

          <p class="specimen-prose">
            The material matters. How it behaves under pressure matters.
            What it invites matters more than what it allows.
            Things become real through sustained attention.
          </p>

          <div class="specimen-small">
            <span class="specimen-tags">systems · knowledge · graph · 2026</span>
            <span class="specimen-phases">◆ salt &nbsp; ◈ fluid &nbsp; ◇ volatile</span>
          </div>
        </div>

        <button
          class="use-button"
          class:active={chosen === font.name}
          onclick={() => apply(font)}
        >
          {chosen === font.name ? 'in use — navigate to see it' : 'use this font →'}
        </button>
      </article>
    {/each}
  </div>
</section>

<style>
  .explorer {
    max-width: 52rem;
    padding-bottom: var(--space-24);
  }

  .explorer-header {
    padding-bottom: var(--space-12);
    border-bottom: 1px solid oklch(35% 0.025 58 / 0.18);
    margin-bottom: var(--space-12);
  }

  .explorer-header h1 {
    font-size: var(--size-2xl);
    font-style: italic;
    margin-bottom: var(--space-4);
  }

  .lede {
    color: var(--text-secondary);
    font-style: italic;
    line-height: var(--leading-loose);
    margin-bottom: var(--space-4);
  }

  .current-note {
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    color: var(--text-dim);
  }

  .reset {
    background: none;
    border: none;
    color: var(--rose-dim);
    cursor: pointer;
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .reset:hover {
    color: var(--rose);
  }

  .specimens {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  .specimen {
    border: 1px solid oklch(35% 0.025 58 / 0.15);
    border-radius: 1px;
    padding: var(--space-8);
    transition: border-color var(--dur-mid) var(--ease-emerge);
  }

  .specimen.active {
    border-color: var(--rose-dim);
    background: oklch(97% 0.015 85);
  }

  .specimen-meta {
    display: flex;
    align-items: baseline;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid oklch(35% 0.025 58 / 0.10);
    font-family: var(--font-ui);
  }

  .specimen-name {
    font-size: var(--size-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .specimen-character {
    font-size: var(--size-sm);
    color: var(--text-dim);
    font-style: italic;
    font-family: var(--font-body);
    line-height: var(--leading-body);
  }

  /* Specimen text — rendered in the candidate font */

  .specimen-wordmark {
    font-size: var(--size-xl);
    font-style: italic;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
    letter-spacing: -0.01em;
  }

  .specimen-heading {
    font-size: var(--size-2xl);
    font-weight: 400;
    line-height: var(--leading-tight);
    color: var(--text-primary);
    margin-bottom: var(--space-3);
  }

  .specimen-subhead {
    font-size: var(--size-lg);
    font-style: italic;
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    margin-bottom: var(--space-4);
  }

  .specimen-prose {
    font-size: var(--size-md);
    color: var(--text-secondary);
    line-height: var(--leading-loose);
    margin-bottom: var(--space-6);
  }

  .specimen-small {
    display: flex;
    gap: var(--space-8);
    align-items: center;
  }

  .specimen-tags {
    font-family: var(--font-mono);
    font-size: var(--size-xs);
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .specimen-phases {
    font-size: var(--size-sm);
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .use-button {
    margin-top: var(--space-6);
    background: none;
    border: 1px solid oklch(35% 0.025 58 / 0.25);
    border-radius: 1px;
    padding: var(--space-2) var(--space-4);
    font-family: var(--font-ui);
    font-size: var(--size-sm);
    color: var(--text-secondary);
    cursor: pointer;
    letter-spacing: 0.03em;
    transition:
      color var(--dur-fast) var(--ease-emerge),
      border-color var(--dur-fast) var(--ease-emerge);
  }

  .use-button:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .use-button.active {
    color: var(--rose);
    border-color: var(--rose-dim);
  }
</style>
