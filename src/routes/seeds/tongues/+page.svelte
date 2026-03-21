<script lang="ts">
  import { onMount } from 'svelte'

  let visible = $state(false)
  onMount(() => { visible = true })

  const levels = [
    { href: '/seeds/tongues/100', num: '100', title: 'Pieces', desc: 'Nouns, cases, and the word builder. How Quenya stacks, Sindarin mutates, and the Black Speech commands.' },
    { href: '/seeds/tongues/200', num: '200', title: 'Movement', desc: 'Verbs, tense, and time. How each language encodes action — and what the differences reveal.' },
    { href: '/seeds/tongues/300', num: '300', title: 'Namárië', desc: 'Walk through Galadriel\'s lament morpheme by morpheme. The capstone.' },
    { href: '/seeds/tongues/gloss', num: 'gloss', title: 'Reference', desc: 'All morphemes, all tables. The dictionary you build as you go.' },
  ]
</script>

<svelte:head>
  <title>Tongues of Arda — move slow, fix things</title>
</svelte:head>

<article class:visible>
  <a href="/seeds" class="back">← seeds</a>

  <header>
    <div class="eyebrow">Language · Structure · Power</div>
    <h1>Tongues of <em>Arda</em></h1>
    <p class="subtitle">Tolkien was a philologist before he was a novelist. The languages came first. The stories grew to house them.</p>
  </header>

  <section class="tri">
    <div class="lang-card quenya">
      <h2>Quenya</h2>
      <p class="origin">← Finnish</p>
      <p class="method">Stacks pieces onto the end. The root stays stable. You can always find it.</p>
      <div class="sample">
        <span class="word">ciryaron</span>
        <span class="parse">cirya + -r + -on</span>
        <span class="gloss">"of ships"</span>
      </div>
    </div>
    <div class="lang-card sindarin">
      <h2>Sindarin</h2>
      <p class="origin">← Welsh</p>
      <p class="method">Changes what's already there. The root shifts under grammatical pressure.</p>
      <div class="sample">
        <span class="word">i berian</span>
        <span class="parse">perian → berian (after article)</span>
        <span class="gloss">"the halfling"</span>
      </div>
    </div>
    <div class="lang-card black">
      <h2>Black Speech</h2>
      <p class="origin">← imposed</p>
      <p class="method">Same stacking as Quenya. Every morpheme is a command. It failed.</p>
      <div class="sample">
        <span class="word">durbatulûk</span>
        <span class="parse">durb + -at + -ul + -ûk</span>
        <span class="gloss">"to rule them all"</span>
      </div>
    </div>
  </section>

  <section class="thesis">
    <blockquote>
      Three invented languages. Three relationships to power. Three theories of what grammar is for.
    </blockquote>
    <p>Quenya draws from Finnish — agglutinative, transparent, preserving. Sindarin draws from Welsh — mutating, evolving, worn by time. The Black Speech uses the same machinery as Quenya, but every piece is about domination. And the orcs couldn't maintain it.</p>
    <p>This is a primer built for people who are interested in <em>how languages work</em>, not just what the Elvish words mean. It moves through three levels, each one earning the next.</p>
  </section>

  <nav class="levels">
    {#each levels as level}
      <a href={level.href} class="level-card">
        <span class="level-num">{level.num}</span>
        <div>
          <span class="level-title">{level.title}</span>
          <span class="level-desc">{level.desc}</span>
        </div>
      </a>
    {/each}
  </nav>

  <section class="coda">
    <p>Tolkien needed hundreds of words. He wrote a handful of primitives — stems, suffixes, mutations, sound changes — and let them compose. "I always felt like math was beautiful," said someone else who built complex patterns from simple pieces. The method is the same.</p>
  </section>
</article>

<style>
  article {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 2rem 6rem;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  article.visible { opacity: 1; transform: translateY(0); }

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

  header { text-align: center; margin-bottom: 3rem; }
  .eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #8b6914;
    margin-bottom: 1rem;
  }
  h1 {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin: 0 0 1rem;
  }
  h1 em { font-style: normal; color: #b87d2a; }
  .subtitle {
    font-size: 1.05rem;
    line-height: 1.75;
    color: #4a3f30;
    max-width: 480px;
    margin: 0 auto;
  }

  .tri {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 3rem 0;
  }
  @media (max-width: 640px) {
    .tri { grid-template-columns: 1fr; }
  }

  .lang-card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04);
    border-top: 3px solid transparent;
  }
  .lang-card.quenya { border-top-color: #4a6741; }
  .lang-card.sindarin { border-top-color: #1b7a68; }
  .lang-card.black { border-top-color: #8b4513; }

  .lang-card h2 {
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0 0 0.25rem;
  }
  .origin {
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    opacity: 0.4;
    margin: 0 0 0.75rem;
  }
  .method {
    font-size: 0.88rem;
    line-height: 1.6;
    margin: 0 0 1rem;
    color: #4a3f30;
  }
  .sample {
    background: #faf7f2;
    border-radius: 6px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .word { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.01em; }
  .parse { font-family: monospace; font-size: 0.75rem; opacity: 0.5; }
  .gloss { font-size: 0.8rem; font-style: italic; opacity: 0.6; }

  .thesis {
    margin: 3rem 0;
    max-width: 580px;
    margin-left: auto;
    margin-right: auto;
  }
  .thesis blockquote {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.5;
    color: #1b7a68;
    border-left: 3px solid #1b7a68;
    padding: 0 0 0 1.25rem;
    margin: 0 0 1.5rem;
  }
  .thesis p {
    font-size: 1rem;
    line-height: 1.85;
    margin: 0 0 1rem;
  }

  .levels {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 3rem 0;
  }

  .level-card {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    background: white;
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .level-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(37,26,16,0.08), 0 8px 24px rgba(37,26,16,0.08);
  }

  .level-num {
    font-size: 1.4rem;
    font-weight: 900;
    color: #b87d2a;
    min-width: 3rem;
    letter-spacing: -0.02em;
  }
  .level-title {
    display: block;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  .level-desc {
    display: block;
    font-size: 0.88rem;
    line-height: 1.6;
    opacity: 0.6;
  }

  .coda {
    max-width: 520px;
    margin: 3rem auto 0;
    text-align: center;
  }
  .coda p {
    font-size: 0.92rem;
    line-height: 1.75;
    opacity: 0.5;
    font-style: italic;
  }
</style>
