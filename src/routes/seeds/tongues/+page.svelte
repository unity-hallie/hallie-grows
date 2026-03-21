<script lang="ts">
  let activeTab = $state<'quenya' | 'sindarin' | 'black'>('quenya')

  type Example = { stem: string; pieces: string[]; result: string; gloss: string }

  const quenyaExamples: Example[] = [
    { stem: 'cirya', pieces: ['cirya', '-r', '-on'], result: 'ciryaron', gloss: 'of ships' },
    { stem: 'cirya', pieces: ['cirya', '-nna', '-r'], result: 'ciryannar', gloss: 'toward ships' },
    { stem: 'cirya', pieces: ['cirya', '-li', '-llo'], result: 'ciryalillo', gloss: 'from some ships' },
    { stem: 'lasse', pieces: ['lasse', '-i', '-nen'], result: 'lassinen', gloss: 'by/with leaves' },
    { stem: 'oma', pieces: ['oma', '-rya', '-o'], result: 'omaryo', gloss: 'of her voice' },
  ]

  const sindarinMutations: { base: string; soft: string; nasal: string }[] = [
    { base: 'p', soft: 'b', nasal: 'ph' },
    { base: 't', soft: 'd', nasal: 'th' },
    { base: 'c', soft: 'g', nasal: 'ch' },
    { base: 'b', soft: 'v', nasal: 'm' },
    { base: 'd', soft: 'dh', nasal: 'n' },
    { base: 'g', soft: '—', nasal: 'ng' },
    { base: 'm', soft: 'v', nasal: 'm' },
    { base: 's', soft: 'h', nasal: 's' },
  ]

  const sindarinPlurals: { singular: string; plural: string; gloss: string }[] = [
    { singular: 'aran', plural: 'erain', gloss: 'king / kings' },
    { singular: 'edhel', plural: 'edhil', gloss: 'elf / elves' },
    { singular: 'orch', plural: 'yrch', gloss: 'orc / orcs' },
    { singular: 'tâl', plural: 'tail', gloss: 'foot / feet' },
    { singular: 'naug', plural: 'noeg', gloss: 'dwarf / dwarves' },
  ]

  const blackSpeechBreakdown = [
    { word: 'durb-at-ul-ûk', morphemes: ['durb', '-at', '-ul', '-ûk'], glosses: ['rule', 'to', 'them', 'all'], full: 'to rule them all' },
    { word: 'gimb-at-ul', morphemes: ['gimb', '-at', '-ul'], glosses: ['find', 'to', 'them'], full: 'to find them' },
    { word: 'thrak-at-ul-ûk', morphemes: ['thrak', '-at', '-ul', '-ûk'], glosses: ['bring', 'to', 'them', 'all'], full: 'to bring them all' },
    { word: 'burzum-ishi', morphemes: ['burz', '-um', '-ishi'], glosses: ['dark', '-ness', 'in'], full: 'in the darkness' },
    { word: 'krimp-at-ul', morphemes: ['krimp', '-at', '-ul'], glosses: ['bind', 'to', 'them'], full: 'to bind them' },
  ]
</script>

<svelte:head>
  <title>Tongues of Arda — move slow, fix things</title>
</svelte:head>

<article>
  <a href="/seeds" class="back">← seeds</a>

  <header>
    <div class="meta">
      <span class="year">2026</span>
      <span class="role">Language / primer</span>
    </div>
    <h1>Tongues of Arda</h1>
    <p class="lede">Three invented languages, three relationships to power. A primer through the lens of agglutinative morphology.</p>
  </header>

  <section class="intro">
    <p>Tolkien was a philologist before he was a novelist. The languages came first; the stories grew to house them. Each language encodes a theory about how speech relates to the people who speak it.</p>
    <p><strong>Quenya</strong> draws from Finnish — agglutinative, suffixing, transparent. You build words by stacking pieces. <strong>Sindarin</strong> draws from Welsh — mutating, shifting, worn by time. Words change from the inside. <strong>The Black Speech</strong> uses the same agglutinative machinery as Quenya, but weaponized — every morpheme is about control.</p>
  </section>

  <nav class="tabs">
    <button class:active={activeTab === 'quenya'} onclick={() => activeTab = 'quenya'}>Quenya</button>
    <button class:active={activeTab === 'sindarin'} onclick={() => activeTab = 'sindarin'}>Sindarin</button>
    <button class:active={activeTab === 'black'} onclick={() => activeTab = 'black'}>Black Speech</button>
  </nav>

  {#if activeTab === 'quenya'}
  <section class="tab-content">
    <h2>Quenya — the preserved tongue</h2>
    <p class="flavor">Finnish aesthetic, Latin grammar. The language of ceremony, lore, and things held sacred. Tolkien called discovering Finnish "like finding a wine-cellar filled with bottles of an amazing wine of a kind and flavour never tasted before."</p>

    <h3>The case system</h3>
    <p>Quenya has ten noun cases. You build meaning by stacking suffixes onto stems: stem + number + case. Each piece is transparent — you can always see the seams.</p>

    <div class="case-table">
      <div class="case-row header">
        <span class="case-name">Case</span>
        <span class="case-suffix">Suffix</span>
        <span class="case-meaning">Meaning</span>
        <span class="case-example">cirya (ship)</span>
      </div>
      <div class="case-row"><span class="case-name">Nominative</span><span class="case-suffix">—</span><span class="case-meaning">subject</span><span class="case-example">cirya</span></div>
      <div class="case-row"><span class="case-name">Genitive</span><span class="case-suffix">-o</span><span class="case-meaning">of, from</span><span class="case-example">ciryo</span></div>
      <div class="case-row"><span class="case-name">Possessive</span><span class="case-suffix">-va</span><span class="case-meaning">belonging to</span><span class="case-example">ciryava</span></div>
      <div class="case-row"><span class="case-name">Dative</span><span class="case-suffix">-n</span><span class="case-meaning">to, for</span><span class="case-example">ciryan</span></div>
      <div class="case-row"><span class="case-name">Instrumental</span><span class="case-suffix">-nen</span><span class="case-meaning">by means of</span><span class="case-example">ciryanen</span></div>
      <div class="case-row"><span class="case-name">Locative</span><span class="case-suffix">-sse</span><span class="case-meaning">in, at, on</span><span class="case-example">ciryasse</span></div>
      <div class="case-row"><span class="case-name">Allative</span><span class="case-suffix">-nna</span><span class="case-meaning">toward</span><span class="case-example">ciryanna</span></div>
      <div class="case-row"><span class="case-name">Ablative</span><span class="case-suffix">-llo</span><span class="case-meaning">away from</span><span class="case-example">ciryallo</span></div>
    </div>

    <p class="aside">The locative triad — <em>-sse</em> (at), <em>-nna</em> (toward), <em>-llo</em> (from) — mirrors Finnish's <em>-ssa</em> (in), <em>-seen</em> (into), <em>-sta</em> (out of). Same logic, different sounds.</p>

    <h3>Building words</h3>
    <p>Stem + number marker + case ending. Each morpheme is visible. This is the agglutinative principle: transparent stacking.</p>

    <div class="examples">
      {#each quenyaExamples as ex}
        <div class="example">
          <div class="morphemes">
            {#each ex.pieces as piece, i}
              <span class="morpheme">{piece}</span>
              {#if i < ex.pieces.length - 1}<span class="plus">+</span>{/if}
            {/each}
          </div>
          <div class="arrow">→</div>
          <div class="result"><strong>{ex.result}</strong></div>
          <div class="gloss">{ex.gloss}</div>
        </div>
      {/each}
    </div>

    <h3>From Namárië</h3>
    <blockquote>
      <em>Ai! laurië lantar lassi súrinen</em><br>
      Ah! Like gold fall the leaves in the wind
    </blockquote>
    <p><em>lassi</em> = lasse (leaf) + -i (plural). <em>súrinen</em> = súre (wind) + -nen (instrumental, "by means of"). Two words, and you can see every piece.</p>
  </section>

  {:else if activeTab === 'sindarin'}
  <section class="tab-content">
    <h2>Sindarin — the living tongue</h2>
    <p class="flavor">Welsh aesthetic. The daily language of Middle-earth's Elves. Where Quenya preserves, Sindarin evolves — worn smooth by millennia of use, its grammar carried in mutations and vowel shifts rather than neat suffixes.</p>

    <h3>Consonant mutation</h3>
    <p>The defining feature. What comes before a word changes how it begins. The article <em>i</em> triggers soft mutation: <em>perian</em> (halfling) becomes <em>i berian</em> (the halfling). The word's initial consonant shifts based on grammatical context.</p>

    <div class="mutation-table">
      <div class="mut-row header">
        <span>Base</span>
        <span>Soft</span>
        <span>Nasal</span>
      </div>
      {#each sindarinMutations as m}
        <div class="mut-row">
          <span class="base-cons">{m.base}</span>
          <span>{m.soft}</span>
          <span>{m.nasal}</span>
        </div>
      {/each}
    </div>

    <p class="aside">Welsh does the same thing. <em>pen</em> (head) → <em>fy mhen</em> (my head) → <em>ei phen</em> (her head). The initial consonant carries grammar. Tolkien saw Welsh words on coal trucks as a boy and never recovered.</p>

    <h3>Plurals by vowel shift</h3>
    <p>Where Quenya adds <em>-r</em> or <em>-i</em> to make plurals, Sindarin changes the vowels inside the word. Like English <em>goose/geese</em>, but systematic.</p>

    <div class="plural-table">
      {#each sindarinPlurals as p}
        <div class="plural-row">
          <span class="sg">{p.singular}</span>
          <span class="arrow-sm">→</span>
          <span class="pl">{p.plural}</span>
          <span class="pl-gloss">{p.gloss}</span>
        </div>
      {/each}
    </div>

    <h3>From the Doors of Moria</h3>
    <blockquote>
      <em>Ennyn Durin Aran Moria. Pedo mellon a minno.</em><br>
      Doors of Durin, Lord of Moria. Speak "friend" and enter.
    </blockquote>
    <p><em>Pedo</em> = ped- (speak) + -o (imperative). <em>Minno</em> = minna- (enter) + -o. Sindarin imperatives end in <em>-o</em>. The grammar is in the ending, not a mutation — but say a common noun after an article and watch the front of the word shift.</p>

    <h3>The contrast</h3>
    <p>Quenya and Sindarin descend from the same ancestor (Common Eldarin). Quenya was preserved in the Blessed Realm. Sindarin evolved in Middle-earth for millennia. The difference is what time does to a language: Quenya keeps its suffixes neat; Sindarin wears them away and compensates with internal change.</p>
  </section>

  {:else}
  <section class="tab-content">
    <h2>The Black Speech — the imposed tongue</h2>
    <p class="flavor">Sauron's construction. Designed to be the universal language of all who served him. It uses the same agglutinative principle as Quenya — stacking morphemes — but every piece is about domination. And it failed. The orcs corrupted it into mutually unintelligible pidgins. You cannot impose a language from above.</p>

    <h3>The Ring inscription</h3>
    <blockquote class="ring">
      <em>Ash nazg durbatulûk, ash nazg gimbatul,<br>
      ash nazg thrakatulûk, agh burzum-ishi krimpatul.</em>
    </blockquote>

    <p>Five verbs. Every one stacks the same way: root + purpose + object + (totality). The machinery is Quenya's. The intent is the opposite.</p>

    <div class="black-breakdown">
      {#each blackSpeechBreakdown as b}
        <div class="bs-word">
          <div class="bs-morphemes">
            {#each b.morphemes as m, i}
              <div class="bs-morpheme">
                <span class="bs-form">{m}</span>
                <span class="bs-gloss">{b.glosses[i]}</span>
              </div>
              {#if i < b.morphemes.length - 1}<span class="bs-join">+</span>{/if}
            {/each}
          </div>
          <div class="bs-result">= {b.full}</div>
        </div>
      {/each}
    </div>

    <h3>Engineered to wound</h3>
    <p>The phonology is deliberate. Back vowels (<em>u, û</em>) where Quenya uses bright ones (<em>a, e, i</em>). Heavy closed syllables (<em>nazg, thrak, krimp</em>) where Quenya flows open (<em>cirya, lasse, namárië</em>). Guttural clusters where Quenya sings. Tolkien found it unpleasant to compose. That was the point.</p>

    <h3>Language and power</h3>
    <p>The Ring is an instrument of domination. Its inscription is in the Black Speech because the two are expressions of the same will. The Ring does not create loyalty; it compels obedience. The Black Speech does not foster communication; it commands submission.</p>
    <p>And it doesn't work. After Sauron's first defeat, the orcs can't maintain it. They fragment it, corrupt it, mix it with borrowed words until tribes can't understand each other. Tolkien the philologist is making an argument: language comes from community, not from power. Compulsion is not communion.</p>
  </section>
  {/if}

  <section class="coda">
    <h3>Three strategies, one question</h3>
    <p>How does grammar carry meaning?</p>
    <ul>
      <li><strong>Quenya</strong> adds pieces to the end. The root stays stable. You can always find it.</li>
      <li><strong>Sindarin</strong> changes what's already there. The root shifts under grammatical pressure. Time wears language smooth.</li>
      <li><strong>The Black Speech</strong> stacks pieces like Quenya — but every piece is a command. Same machinery, opposite intent.</li>
    </ul>
    <p>Tolkien needed 300 patterns. He wrote 6 primitives — three phonological systems, three theories of what language is for.</p>
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
  h2 { font-size: 1.4rem; font-weight: 400; margin: 0 0 1rem; }
  h3 { font-size: 1rem; font-weight: 600; margin: 2rem 0 0.75rem; }
  .lede { font-size: 1.05rem; line-height: 1.75; color: #2a1f0f; margin: 0; }
  .flavor { font-size: 0.95rem; line-height: 1.75; color: #2a1f0f; opacity: 0.7; font-style: italic; margin: 0 0 1.5rem; }

  .intro { margin-bottom: 2rem; }
  .intro p { font-size: 1rem; line-height: 1.85; margin: 0 0 1rem; }

  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.15);
    margin-bottom: 2rem;
  }
  .tabs button {
    font-family: 'Georgia', serif;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    padding: 0.6rem 1.2rem;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.35;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    color: #1a1208;
  }
  .tabs button:hover { opacity: 0.7; }
  .tabs button.active {
    opacity: 1;
    border-bottom-color: #1a1208;
  }

  .tab-content p { font-size: 1rem; line-height: 1.85; margin: 0 0 1rem; }

  .case-table {
    margin: 1.5rem 0;
    font-size: 0.85rem;
  }
  .case-row {
    display: grid;
    grid-template-columns: 1fr 0.6fr 1fr 1fr;
    gap: 0.5rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
    align-items: baseline;
  }
  .case-row.header {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.4;
    border-bottom-color: rgba(26, 18, 8, 0.15);
    padding-bottom: 0.5rem;
  }
  .case-name { font-weight: 500; }
  .case-suffix { font-family: monospace; color: #4a6741; }
  .case-example { font-style: italic; opacity: 0.7; }

  .aside {
    font-size: 0.88rem;
    opacity: 0.6;
    border-left: 2px solid rgba(26, 18, 8, 0.1);
    padding-left: 1rem;
    margin: 1.5rem 0;
    line-height: 1.7;
  }

  .examples {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
  }
  .example {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
  }
  .morphemes { display: flex; align-items: baseline; gap: 0.2rem; }
  .morpheme {
    font-family: monospace;
    font-size: 0.85rem;
    color: #4a6741;
    background: rgba(74, 103, 65, 0.06);
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
  }
  .plus { opacity: 0.3; font-size: 0.75rem; }
  .arrow { opacity: 0.3; margin: 0 0.3rem; }
  .result { font-style: italic; }
  .gloss { font-size: 0.85rem; opacity: 0.5; margin-left: auto; }

  .mutation-table {
    margin: 1.5rem 0;
    font-size: 0.85rem;
  }
  .mut-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
    text-align: center;
  }
  .mut-row.header {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.4;
    border-bottom-color: rgba(26, 18, 8, 0.15);
  }
  .base-cons { font-weight: 600; }

  .plural-table { margin: 1.5rem 0; }
  .plural-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.35rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
    font-size: 0.9rem;
  }
  .sg { font-style: italic; min-width: 60px; }
  .arrow-sm { opacity: 0.3; font-size: 0.75rem; }
  .pl { font-style: italic; font-weight: 500; min-width: 60px; }
  .pl-gloss { opacity: 0.5; font-size: 0.8rem; }

  blockquote {
    border-left: 2px solid rgba(26, 18, 8, 0.15);
    padding: 0.75rem 1rem;
    margin: 1.5rem 0;
    font-size: 1rem;
    line-height: 1.7;
    background: rgba(26, 18, 8, 0.02);
  }
  blockquote.ring {
    border-left-color: rgba(139, 69, 19, 0.4);
    background: rgba(139, 69, 19, 0.03);
  }

  .black-breakdown {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  .bs-word {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(26, 18, 8, 0.06);
  }
  .bs-morphemes {
    display: flex;
    align-items: flex-start;
    gap: 0.3rem;
    flex-wrap: wrap;
  }
  .bs-morpheme {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }
  .bs-form {
    font-family: monospace;
    font-size: 0.85rem;
    color: #8b4513;
    background: rgba(139, 69, 19, 0.06);
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
  }
  .bs-gloss {
    font-size: 0.65rem;
    opacity: 0.5;
    letter-spacing: 0.03em;
  }
  .bs-join { opacity: 0.3; font-size: 0.75rem; align-self: center; }
  .bs-result {
    font-size: 0.85rem;
    opacity: 0.6;
    margin-top: 0.3rem;
    font-style: italic;
  }

  .coda {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(26, 18, 8, 0.1);
  }
  .coda p { font-size: 1rem; line-height: 1.85; margin: 0 0 1rem; }
  .coda ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  .coda li {
    padding: 0.4rem 0;
    font-size: 0.95rem;
    line-height: 1.7;
  }
  .coda li::before {
    content: '';
    display: inline;
  }

  @media (max-width: 600px) {
    .case-row {
      grid-template-columns: 1fr 0.5fr 1fr;
    }
    .case-example { display: none; }
    .example { font-size: 0.85rem; }
    .bs-morphemes { gap: 0.2rem; }
  }
</style>
