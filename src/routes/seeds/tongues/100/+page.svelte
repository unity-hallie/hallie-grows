<script lang="ts">
  import { onMount } from 'svelte'
  let visible = $state(false)
  onMount(() => { visible = true })

  // ── QUENYA BUILDER ──────────────────────────────────
  type Morpheme = { form: string; gloss: string; type: 'stem' | 'number' | 'case' | 'poss' }

  const qStems: Morpheme[] = [
    { form: 'cirya', gloss: 'ship', type: 'stem' },
    { form: 'lasse', gloss: 'leaf', type: 'stem' },
    { form: 'elen', gloss: 'star', type: 'stem' },
    { form: 'aran', gloss: 'king', type: 'stem' },
    { form: 'oma', gloss: 'voice', type: 'stem' },
    { form: 'alda', gloss: 'tree', type: 'stem' },
  ]

  const qNumbers: Morpheme[] = [
    { form: '—', gloss: 'singular', type: 'number' },
    { form: '-r/-i', gloss: 'plural', type: 'number' },
    { form: '-li', gloss: 'some of', type: 'number' },
  ]

  const qCases: Morpheme[] = [
    { form: '—', gloss: 'subject', type: 'case' },
    { form: '-o/-on', gloss: 'of, from', type: 'case' },
    { form: '-n', gloss: 'to, for', type: 'case' },
    { form: '-nen', gloss: 'by means of', type: 'case' },
    { form: '-sse', gloss: 'in, at', type: 'case' },
    { form: '-nna', gloss: 'toward', type: 'case' },
    { form: '-llo', gloss: 'away from', type: 'case' },
  ]

  const qPoss: Morpheme[] = [
    { form: '—', gloss: 'none', type: 'poss' },
    { form: '-nya', gloss: 'my', type: 'poss' },
    { form: '-lya', gloss: 'your', type: 'poss' },
    { form: '-rya', gloss: 'her/his', type: 'poss' },
  ]

  let qStem = $state<Morpheme | null>(null)
  let qNum = $state<Morpheme>(qNumbers[0])
  let qCase = $state<Morpheme>(qCases[0])
  let qPossessive = $state<Morpheme>(qPoss[0])

  function buildQuenya(): { word: string; gloss: string; parts: { form: string; gloss: string; color: string }[] } | null {
    if (!qStem) return null

    let word = qStem.form
    let gloss = qStem.gloss
    const parts: { form: string; gloss: string; color: string }[] = [
      { form: qStem.form, gloss: qStem.gloss, color: 'stem' }
    ]

    // Handle e-stems (lasse → lassi for plural)
    const eStem = word.endsWith('e')
    const aStem = word.endsWith('a')
    const consonantStem = !eStem && !aStem

    // Number
    if (qNum.form !== '—') {
      if (qNum.form === '-r/-i') {
        if (eStem) {
          word = word.slice(0, -1) + 'i'
          parts.push({ form: '-i', gloss: 'plural', color: 'number' })
        } else {
          word += 'r'
          parts.push({ form: '-r', gloss: 'plural', color: 'number' })
        }
        gloss += ' (plural)'
      } else {
        word += 'li'
        parts.push({ form: '-li', gloss: 'some of', color: 'number' })
        gloss = 'some ' + gloss + 's'
      }
    }

    // Case
    const isPlural = qNum.form !== '—'
    if (qCase.form !== '—') {
      let suffix = qCase.form.split('/')[0]
      // Plural genitive uses -on
      if (qCase.form === '-o/-on' && isPlural) suffix = '-on'
      // Plural locative/allative/ablative get special forms
      const caseName = qCase.gloss
      word += suffix.replace('-', '')
      parts.push({ form: suffix, gloss: caseName, color: 'case' })
      gloss = caseName + ' ' + gloss
    }

    // Possessive
    if (qPossessive.form !== '—') {
      const poss = qPossessive.form
      word += poss.replace('-', '')
      parts.push({ form: poss, gloss: qPossessive.gloss, color: 'poss' })
      gloss = gloss + ' (' + qPossessive.gloss + ')'
    }

    return { word, gloss, parts }
  }

  // ── SINDARIN MUTATION DEMO ──────────────────────────
  const mutations: Record<string, { soft: string; nasal: string }> = {
    'p': { soft: 'b', nasal: 'ph' },
    't': { soft: 'd', nasal: 'th' },
    'c': { soft: 'g', nasal: 'ch' },
    'b': { soft: 'v', nasal: 'm' },
    'd': { soft: 'dh', nasal: 'n' },
    'g': { soft: '', nasal: 'ng' },
    'm': { soft: 'v', nasal: 'm' },
    's': { soft: 'h', nasal: 's' },
    'h': { soft: 'ch', nasal: 'h' },
  }

  type SindarinWord = { base: string; gloss: string }
  const sinWords: SindarinWord[] = [
    { base: 'perian', gloss: 'halfling' },
    { base: 'caras', gloss: 'city' },
    { base: 'taur', gloss: 'forest' },
    { base: 'barad', gloss: 'tower' },
    { base: 'dûr', gloss: 'dark' },
    { base: 'galadh', gloss: 'tree' },
    { base: 'mellon', gloss: 'friend' },
    { base: 'sell', gloss: 'daughter' },
  ]

  let sinWord = $state<SindarinWord>(sinWords[0])
  let sinContext = $state<'none' | 'article' | 'nasal'>('none')

  function mutateSindarin(word: string, type: 'soft' | 'nasal'): { result: string; changed: string; original: string } {
    const first = word[0].toLowerCase()
    const mut = mutations[first]
    if (!mut) return { result: word, changed: '', original: '' }
    const replacement = mut[type]
    if (replacement === '') return { result: word.slice(1), changed: '(vanishes)', original: first }
    return {
      result: replacement + word.slice(1),
      changed: replacement,
      original: first
    }
  }

  function getSindarinResult(): { display: string; prefix: string; explanation: string } {
    if (sinContext === 'none') {
      return { display: sinWord.base, prefix: '', explanation: 'No mutation. The base form.' }
    }
    if (sinContext === 'article') {
      const { result } = mutateSindarin(sinWord.base, 'soft')
      return { display: result, prefix: 'i ', explanation: `Soft mutation after the article "i". ${sinWord.base[0]} → ${result[0]}.` }
    }
    const { result } = mutateSindarin(sinWord.base, 'nasal')
    return { display: result, prefix: 'in ', explanation: `Nasal mutation after "in" (in). ${sinWord.base[0]} → ${result[0]}.` }
  }

  // ── SINDARIN PLURALS DEMO ───────────────────────────
  const plurals = [
    { sg: 'aran', pl: 'erain', gloss: 'king', change: 'a→e, a→ai' },
    { sg: 'edhel', pl: 'edhil', gloss: 'elf', change: 'e→i' },
    { sg: 'orch', pl: 'yrch', gloss: 'orc', change: 'o→y' },
    { sg: 'Onod', pl: 'Enyd', gloss: 'Ent', change: 'O→E, o→y' },
    { sg: 'tâl', pl: 'tail', gloss: 'foot', change: 'â→ai' },
    { sg: 'naug', pl: 'noeg', gloss: 'dwarf', change: 'au→oe' },
  ]

  let showPlural = $state<number | null>(null)

  // ── BLACK SPEECH ────────────────────────────────────
  const ringWords = [
    { word: 'ash', gloss: 'one', morphemes: [{ form: 'ash', gloss: 'one', color: 'func' }] },
    { word: 'nazg', gloss: 'ring', morphemes: [{ form: 'nazg', gloss: 'ring', color: 'stem' }] },
    { word: 'durbatulûk', gloss: 'to rule them all', morphemes: [
      { form: 'durb', gloss: 'rule', color: 'stem' },
      { form: '-at', gloss: 'to (purpose)', color: 'func' },
      { form: '-ul', gloss: 'them', color: 'pron' },
      { form: '-ûk', gloss: 'all', color: 'quant' },
    ]},
    { word: 'gimbatul', gloss: 'to find them', morphemes: [
      { form: 'gimb', gloss: 'find', color: 'stem' },
      { form: '-at', gloss: 'to (purpose)', color: 'func' },
      { form: '-ul', gloss: 'them', color: 'pron' },
    ]},
    { word: 'thrakatulûk', gloss: 'to bring them all', morphemes: [
      { form: 'thrak', gloss: 'bring/drag', color: 'stem' },
      { form: '-at', gloss: 'to (purpose)', color: 'func' },
      { form: '-ul', gloss: 'them', color: 'pron' },
      { form: '-ûk', gloss: 'all', color: 'quant' },
    ]},
    { word: 'agh', gloss: 'and', morphemes: [{ form: 'agh', gloss: 'and', color: 'func' }] },
    { word: 'burzum-ishi', gloss: 'in the darkness', morphemes: [
      { form: 'burz', gloss: 'dark', color: 'stem' },
      { form: '-um', gloss: '-ness', color: 'func' },
      { form: '-ishi', gloss: 'in', color: 'case' },
    ]},
    { word: 'krimpatul', gloss: 'to bind them', morphemes: [
      { form: 'krimp', gloss: 'bind', color: 'stem' },
      { form: '-at', gloss: 'to (purpose)', color: 'func' },
      { form: '-ul', gloss: 'them', color: 'pron' },
    ]},
  ]

  let activeRingWord = $state<number | null>(null)

  // ── COMPARISON ──────────────────────────────────────
  const comparisons = [
    {
      meaning: '"of ships"',
      quenya: { word: 'ciryaron', parse: 'cirya (ship) + -r (plural) + -on (of)', method: 'suffix stacking' },
      sindarin: { word: 'na girith', parse: 'na (of) + cirith → girith (soft mutation)', method: 'preposition + mutation' },
      black: { word: '—', parse: 'no attested form', method: '—' },
    },
    {
      meaning: '"speak!"',
      quenya: { word: 'queta!', parse: 'quet- (speak) + -a (imperative)', method: 'suffix' },
      sindarin: { word: 'pedo!', parse: 'ped- (speak) + -o (imperative)', method: 'suffix' },
      black: { word: '—', parse: 'no attested imperative', method: '—' },
    },
  ]
</script>

<svelte:head>
  <title>100: Pieces — Tongues of Arda</title>
</svelte:head>

<article class:visible>
  <nav class="breadcrumb">
    <a href="/seeds/tongues">Tongues of Arda</a>
    <span class="sep">/</span>
    <span>100</span>
  </nav>

  <header>
    <div class="level-badge">100</div>
    <h1>Pieces</h1>
    <p class="subtitle">How words are built. Three languages, three strategies. Start by building — we'll explain after.</p>
  </header>

  <!-- ═══════════════════════════════════ QUENYA BUILDER -->
  <section class="block">
    <div class="section-label">Quenya — Build a word</div>
    <p class="intro-text">Pick a stem. Add pieces. Watch the word assemble. Every morpheme is visible — you can always see the seams.</p>

    <div class="builder">
      <div class="builder-group">
        <div class="group-label">Stem</div>
        <div class="chips">
          {#each qStems as stem}
            <button
              class="chip stem-chip"
              class:active={qStem === stem}
              onclick={() => qStem = qStem === stem ? null : stem}
            >
              <strong>{stem.form}</strong>
              <span class="chip-gloss">{stem.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Number</div>
        <div class="chips">
          {#each qNumbers as num}
            <button
              class="chip number-chip"
              class:active={qNum === num}
              onclick={() => qNum = num}
            >
              <strong>{num.form}</strong>
              <span class="chip-gloss">{num.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Case</div>
        <div class="chips">
          {#each qCases as c}
            <button
              class="chip case-chip"
              class:active={qCase === c}
              onclick={() => qCase = c}
            >
              <strong>{c.form}</strong>
              <span class="chip-gloss">{c.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Possessive</div>
        <div class="chips">
          {#each qPoss as p}
            <button
              class="chip poss-chip"
              class:active={qPossessive === p}
              onclick={() => qPossessive = p}
            >
              <strong>{p.form}</strong>
              <span class="chip-gloss">{p.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="result-box">
        {#if buildQuenya()}
          {@const result = buildQuenya()!}
          <div class="result-word">{result.word}</div>
          <div class="result-parts">
            {#each result.parts as part, i}
              <span class="result-morpheme {part.color}">{part.form}</span>
              {#if i < result.parts.length - 1}<span class="result-plus">+</span>{/if}
            {/each}
          </div>
          <div class="result-gloss">"{result.gloss}"</div>
        {:else}
          <div class="result-empty">Pick a stem to begin.</div>
        {/if}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════ PROSE: WHAT JUST HAPPENED -->
  <section class="prose">
    <h2>What you just did</h2>
    <p><strong>Stem + number + case + possessive.</strong> Each piece has one job. The stem stays the same no matter what you attach. This is agglutination — "gluing together." Finnish works the same way.</p>
    <p class="pull">The locative triad — <em>-sse</em> (at), <em>-nna</em> (toward), <em>-llo</em> (from) — mirrors Finnish's <em>-ssa</em>, <em>-seen</em>, <em>-sta</em>.</p>
  </section>

  <hr>

  <!-- ═══════════════════════════════════ SINDARIN MUTATION -->
  <section class="block">
    <div class="section-label">Sindarin — Watch it change</div>
    <p class="intro-text">Pick a word. Then change the context. Watch what happens to the first consonant.</p>

    <div class="mutation-demo">
      <div class="builder-group">
        <div class="group-label">Word</div>
        <div class="chips">
          {#each sinWords as w}
            <button
              class="chip stem-chip"
              class:active={sinWord === w}
              onclick={() => sinWord = w}
            >
              <strong>{w.base}</strong>
              <span class="chip-gloss">{w.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Context</div>
        <div class="chips">
          <button class="chip context-chip" class:active={sinContext === 'none'} onclick={() => sinContext = 'none'}>
            <strong>bare</strong>
            <span class="chip-gloss">no article</span>
          </button>
          <button class="chip context-chip" class:active={sinContext === 'article'} onclick={() => sinContext = 'article'}>
            <strong>i</strong>
            <span class="chip-gloss">the (singular)</span>
          </button>
          <button class="chip context-chip" class:active={sinContext === 'nasal'} onclick={() => sinContext = 'nasal'}>
            <strong>in</strong>
            <span class="chip-gloss">in (preposition)</span>
          </button>
        </div>
      </div>

      {#if true}
        {@const r = getSindarinResult()}
        <div class="result-box sindarin-result">
          <div class="result-word">
            {#if r.prefix}<span class="result-prefix">{r.prefix}</span>{/if}{r.display}
          </div>
          <div class="result-gloss">{r.explanation}</div>
        </div>
      {/if}
    </div>
  </section>

  <!-- ═══════════════════════════════════ PROSE: MUTATION -->
  <section class="prose">
    <h2>A different strategy</h2>
    <p>Sindarin doesn't add pieces — it changes what's already there. The article <em>i</em> triggers <strong>soft mutation</strong>: <em>perian</em> → <em>i berian</em>. The grammar is in the shift. Welsh does the same thing. <em>pen</em> (head) → <em>fy mhen</em> (my head).</p>

    <h3>Plurals shift too</h3>
    <p>No endings — the internal vowels change. Like English <em>goose → geese</em>, but systematic.</p>

    <div class="plural-demo">
      {#each plurals as p, i}
        <button class="plural-row" onclick={() => showPlural = showPlural === i ? null : i}>
          <span class="pl-sg">{p.sg}</span>
          <span class="pl-arrow">→</span>
          <span class="pl-pl">{p.pl}</span>
          <span class="pl-gloss">{p.gloss}</span>
          {#if showPlural === i}
            <span class="pl-change">{p.change}</span>
          {/if}
        </button>
      {/each}
    </div>
  </section>

  <hr>

  <!-- ═══════════════════════════════════ BLACK SPEECH -->
  <section class="block">
    <div class="section-label">The Black Speech — Tap each word</div>
    <p class="intro-text">The Ring inscription. The only complete sentence in the "pure" Black Speech. Tap a word to see its pieces.</p>

    <div class="ring-inscription">
      <div class="ring-text">
        {#each ringWords as rw, i}
          <button
            class="ring-word"
            class:active={activeRingWord === i}
            onclick={() => activeRingWord = activeRingWord === i ? null : i}
          >{rw.word}</button>
        {/each}
      </div>

      {#if activeRingWord !== null}
        {@const rw = ringWords[activeRingWord]}
        <div class="ring-detail">
          <div class="ring-detail-word">{rw.word}</div>
          <div class="ring-detail-morphemes">
            {#each rw.morphemes as m, i}
              <span class="ring-morpheme {m.color}">{m.form}<span class="rm-gloss">{m.gloss}</span></span>
              {#if i < rw.morphemes.length - 1}<span class="result-plus">+</span>{/if}
            {/each}
          </div>
          <div class="ring-detail-gloss">"{rw.gloss}"</div>
        </div>
      {:else}
        <div class="ring-detail empty">Tap a word above to break it apart.</div>
      {/if}
    </div>
  </section>

  <!-- ═══════════════════════════════════ PROSE: BLACK SPEECH -->
  <section class="prose">
    <h2>Same machinery, opposite intent</h2>
    <p><em>durbatulûk</em> stacks morphemes just like Quenya: root + purpose + object + quantifier. But every root is coercion — <em>durb</em> (rule), <em>thrak</em> (drag), <em>krimp</em> (bind). Back vowels where Quenya uses bright ones. Heavy closed syllables where Quenya flows open.</p>
    <p>Sauron designed it as a universal language for his servants. The orcs couldn't maintain it.</p>
  </section>

  <hr>

  <!-- ═══════════════════════════════════ NAVIGATION -->
  <nav class="page-nav">
    <a href="/seeds/tongues" class="nav-link prev">← Intro</a>
    <a href="/seeds/tongues/200" class="nav-link next">200: Movement →</a>
  </nav>
</article>

<style>
  article {
    max-width: 720px;
    margin: 0 auto;
    padding: 1.5rem 2rem 6rem;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  article.visible { opacity: 1; transform: translateY(0); }

  .breadcrumb {
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    margin-bottom: 2.5rem;
  }
  .breadcrumb a {
    text-decoration: none;
    opacity: 0.4;
    transition: opacity 0.15s;
  }
  .breadcrumb a:hover { opacity: 1; }
  .sep { opacity: 0.2; margin: 0 0.4rem; }

  header { margin-bottom: 3rem; }
  .level-badge {
    font-size: 2.5rem;
    font-weight: 900;
    color: #b87d2a;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  h1 {
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    font-weight: 900;
    letter-spacing: -0.025em;
    margin: 0 0 0.75rem;
  }
  .subtitle {
    font-size: 1.05rem;
    line-height: 1.75;
    color: #4a3f30;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8b6914;
    margin-bottom: 0.75rem;
  }
  .intro-text {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #4a3f30;
    margin-bottom: 1.5rem;
  }

  .block { margin-bottom: 1rem; }

  /* Builder */
  .builder, .mutation-demo {
    background: white;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04), 0 12px 36px rgba(37,26,16,0.04);
  }

  .builder-group { margin-bottom: 1.25rem; }
  .group-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a08070;
    margin-bottom: 0.5rem;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }

  .chip {
    font-family: 'Georgia', serif;
    padding: 0.4rem 0.75rem;
    border-radius: 100px;
    border: 1.5px solid #ede5d8;
    background: #faf7f2;
    font-size: 0.82rem;
    color: #6b5344;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    gap: 0.35rem;
    align-items: baseline;
  }
  .chip:hover { border-color: #8b7058; color: #251a10; }
  .chip-gloss { opacity: 0.5; font-size: 0.78em; }

  .chip.active.stem-chip { background: #d94f2a; border-color: #d94f2a; color: white; }
  .chip.active.stem-chip .chip-gloss { opacity: 0.7; }
  .chip.active.number-chip { background: #5b4fcf; border-color: #5b4fcf; color: white; }
  .chip.active.number-chip .chip-gloss { opacity: 0.7; }
  .chip.active.case-chip { background: #1b7a68; border-color: #1b7a68; color: white; }
  .chip.active.case-chip .chip-gloss { opacity: 0.7; }
  .chip.active.poss-chip { background: #8b6914; border-color: #8b6914; color: white; }
  .chip.active.poss-chip .chip-gloss { opacity: 0.7; }
  .chip.active.context-chip { background: #1b7a68; border-color: #1b7a68; color: white; }
  .chip.active.context-chip .chip-gloss { opacity: 0.7; }

  .result-box {
    background: #faf7f2;
    border-radius: 10px;
    padding: 1.25rem;
    margin-top: 0.5rem;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .result-word {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -0.02em;
  }
  .result-prefix {
    opacity: 0.4;
    font-weight: 400;
  }
  .result-parts {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
  }
  .result-morpheme {
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.85rem;
  }
  .result-morpheme.stem { background: rgba(217,79,42,0.1); color: #d94f2a; }
  .result-morpheme.number { background: rgba(91,79,207,0.1); color: #5b4fcf; }
  .result-morpheme.case { background: rgba(27,122,104,0.1); color: #1b7a68; }
  .result-morpheme.poss { background: rgba(139,105,20,0.1); color: #8b6914; }
  .result-plus { opacity: 0.25; font-size: 0.8rem; }
  .result-gloss { font-size: 0.88rem; color: #6b5344; font-style: italic; }
  .result-empty { color: #a08070; font-style: italic; font-size: 0.9rem; }

  /* Prose */
  .prose {
    max-width: 600px;
    margin: 3rem auto;
    padding: 0;
  }
  .prose h2 {
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .prose h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 2rem 0 0.75rem;
  }
  .prose p {
    font-size: 1.02rem;
    line-height: 1.85;
    margin: 0 0 1rem;
  }
  .prose .pull {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1b7a68;
    line-height: 1.5;
    border-left: 3px solid #1b7a68;
    padding: 0 0 0 1.25rem;
    margin: 2rem 0;
  }

  hr {
    border: none;
    border-top: 1px solid #ede5d8;
    margin: 2rem auto;
    max-width: 600px;
  }

  /* Sindarin result */
  .sindarin-result .result-word { transition: all 0.3s ease; }

  /* Plural demo */
  .plural-demo {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 1rem 0;
  }
  .plural-row {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    padding: 0.6rem 0;
    border: none;
    background: none;
    border-bottom: 1px solid rgba(26,18,8,0.06);
    cursor: pointer;
    font-family: 'Georgia', serif;
    font-size: 0.92rem;
    color: #251a10;
    text-align: left;
    width: 100%;
    transition: background 0.15s;
    flex-wrap: wrap;
  }
  .plural-row:hover { background: rgba(27,122,104,0.03); }
  .pl-sg { font-style: italic; min-width: 50px; }
  .pl-arrow { opacity: 0.25; }
  .pl-pl { font-style: italic; font-weight: 700; color: #1b7a68; min-width: 50px; }
  .pl-gloss { opacity: 0.4; font-size: 0.85em; }
  .pl-change {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    font-family: monospace;
    color: #1b7a68;
    opacity: 0.6;
    margin-top: 0.2rem;
  }

  /* Ring inscription */
  .ring-inscription {
    background: white;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04), 0 12px 36px rgba(37,26,16,0.04);
  }
  .ring-text {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    line-height: 2;
  }
  .ring-word {
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    font-weight: 600;
    font-style: italic;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    border: 1.5px solid rgba(139,69,19,0.15);
    background: rgba(139,69,19,0.03);
    color: #4a2a0a;
    cursor: pointer;
    transition: all 0.18s;
  }
  .ring-word:hover { border-color: #8b4513; background: rgba(139,69,19,0.08); }
  .ring-word.active { background: #8b4513; border-color: #8b4513; color: white; }

  .ring-detail {
    background: #faf7f2;
    border-radius: 10px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .ring-detail.empty {
    color: #a08070;
    font-style: italic;
    font-size: 0.9rem;
  }
  .ring-detail-word {
    font-size: 1.4rem;
    font-weight: 900;
    color: #4a2a0a;
  }
  .ring-detail-morphemes {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
  }
  .ring-morpheme {
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.82rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }
  .ring-morpheme.stem { background: rgba(139,69,19,0.1); color: #8b4513; }
  .ring-morpheme.func { background: rgba(107,83,68,0.1); color: #6b5344; }
  .ring-morpheme.pron { background: rgba(91,79,207,0.1); color: #5b4fcf; }
  .ring-morpheme.quant { background: rgba(217,79,42,0.1); color: #d94f2a; }
  .ring-morpheme.case { background: rgba(27,122,104,0.1); color: #1b7a68; }
  .rm-gloss {
    font-size: 0.65rem;
    font-weight: 400;
    opacity: 0.7;
  }
  .ring-detail-gloss {
    font-size: 0.88rem;
    color: #6b5344;
    font-style: italic;
  }

  /* Navigation */
  .page-nav {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #ede5d8;
  }
  .nav-link {
    text-decoration: none;
    font-weight: 600;
    font-size: 0.92rem;
    color: #b87d2a;
    transition: color 0.15s;
  }
  .nav-link:hover { color: #d94f2a; }

  @media (max-width: 600px) {
    .chip { font-size: 0.78rem; padding: 0.35rem 0.6rem; }
    .result-word { font-size: 1.6rem; }
    .ring-word { font-size: 0.95rem; }
  }
</style>
