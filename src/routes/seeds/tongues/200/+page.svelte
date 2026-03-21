<script lang="ts">
  import { onMount } from 'svelte'
  let visible = $state(false)
  onMount(() => { visible = true })

  // ── QUENYA VERB BUILDER ─────────────────────────────
  const verbRoots = [
    { root: 'quet', gloss: 'speak', type: 'basic' as const },
    { root: 'tul', gloss: 'come', type: 'basic' as const },
    { root: 'car', gloss: 'do/make', type: 'basic' as const },
    { root: 'lanta', gloss: 'fall', type: 'a-stem' as const },
    { root: 'ora', gloss: 'urge', type: 'a-stem' as const },
  ]

  const tenses = [
    { name: 'Aorist', desc: 'general truth', basic: (r: string) => r + 'e', astem: (r: string) => r },
    { name: 'Present', desc: 'ongoing', basic: (r: string) => r.slice(0,-1) + r.slice(-2,-1) + r.slice(-1) + 'a', astem: (r: string) => r.slice(0,-1) + 'ea' },
    { name: 'Past', desc: 'completed', basic: (r: string) => {
      // Nasal infixion approximation
      if (r === 'quet') return 'quentë'
      if (r === 'tul') return 'tullë'
      if (r === 'car') return 'carnë'
      return r + 'në'
    }, astem: (r: string) => r.slice(0,-1) + 'anë' },
    { name: 'Perfect', desc: 'completed, present relevance', basic: (r: string) => {
      // Augment + -ië
      const vowel = r.match(/[aeiou]/)?.[0] ?? 'a'
      if (r === 'quet') return 'aquétië'
      if (r === 'tul') return 'utúlië'
      if (r === 'car') return 'acárië'
      return vowel + r + 'ië'
    }, astem: (r: string) => {
      const vowel = r.match(/[aeiou]/)?.[0] ?? 'a'
      return vowel + r.slice(0,-1) + 'ië'
    }},
    { name: 'Future', desc: 'will happen', basic: (r: string) => r + 'uva', astem: (r: string) => r.slice(0,-1) + 'uva' },
  ]

  const pronounSuffixes = [
    { suffix: '—', gloss: '(bare)', person: '' },
    { suffix: '-n', gloss: 'I', person: '1s' },
    { suffix: '-l', gloss: 'you', person: '2s' },
    { suffix: '-s', gloss: 'he/she/it', person: '3s' },
    { suffix: '-lmë', gloss: 'we (excl)', person: '1p' },
  ]

  let activeVerb = $state(verbRoots[0])
  let activeTense = $state(tenses[0])
  let activePronoun = $state(pronounSuffixes[0])

  function conjugate(): string {
    const fn = activeVerb.type === 'basic' ? activeTense.basic : activeTense.astem
    let form = fn(activeVerb.root)
    if (activePronoun.suffix !== '—') {
      // Remove final ë/a/e for pronoun attachment
      if (form.endsWith('ë')) form = form.slice(0, -1)
      else if (form.endsWith('e') && activeTense.name === 'Aorist') form = form.slice(0, -1)
      form += activePronoun.suffix.replace('-', '')
    }
    return form
  }

  // ── UTÚVIENYES ──────────────────────────────────────
  let utuvStep = $state(0)
  const utuvSteps = [
    { highlight: 'utúvienyes', label: 'The whole word', desc: '"I have found it" — Aragorn at his coronation. Five morphemes, one word, one sentence.' },
    { highlight: 'u-túvienyes', label: 'u-', desc: 'The augment. A copy of the stem vowel, prefixed. Marks the perfect tense — completed action with present relevance.' },
    { highlight: 'u-túv-ienyes', label: '-túv-', desc: 'The root: tuv-, "to find." The ú is lengthened in the perfect.' },
    { highlight: 'utúv-ië-nyes', label: '-ië-', desc: 'The perfect tense suffix. Combined with the augment prefix, this marks "has found" — not just past, but completed-and-relevant-now.' },
    { highlight: 'utúvie-nye-s', label: '-nye-', desc: 'First person pronoun suffix: "I." The subject is built into the verb.' },
    { highlight: 'utúvienye-s', label: '-s', desc: 'Third person object suffix: "it." The object too. Five morphemes. One word. One complete sentence.' },
  ]

  // ── SINDARIN VERBS ──────────────────────────────────
  const sinVerbs = [
    { root: 'ped-', gloss: 'speak', imp: 'pedo', pres: 'pedon', past: 'pent', fut: 'peditha' },
    { root: 'lasta-', gloss: 'listen', imp: 'lasto', pres: 'laston', past: 'lassant', fut: 'lastatha' },
    { root: 'tol-', gloss: 'come', imp: 'tolo', pres: 'tolon', past: 'toll', fut: 'toltha' },
    { root: 'car-', gloss: 'do/make', imp: 'caro', pres: 'caron', past: 'agor', fut: 'cartha' },
    { root: 'minna-', gloss: 'enter', imp: 'minno', pres: 'minnon', past: 'minnant', fut: 'minnatha' },
  ]

  let activeSinVerb = $state(sinVerbs[0])
</script>

<svelte:head>
  <title>200: Movement — Tongues of Arda</title>
</svelte:head>

<article class:visible>
  <nav class="breadcrumb">
    <a href="/seeds/tongues">Tongues of Arda</a>
    <span class="sep">/</span>
    <span>200</span>
  </nav>

  <header>
    <div class="level-badge">200</div>
    <h1>Movement</h1>
    <p class="subtitle">Verbs encode action in time. Each language does it differently — and the differences reveal what Tolkien valued.</p>
  </header>

  <!-- ═══════════════════════════════════ QUENYA VERBS -->
  <section class="block">
    <div class="section-label">Quenya — Conjugate a verb</div>
    <p class="intro-text">Pick a root, a tense, and a pronoun. The verb carries subject, tense, and aspect in a single word.</p>

    <div class="builder">
      <div class="builder-group">
        <div class="group-label">Root</div>
        <div class="chips">
          {#each verbRoots as v}
            <button class="chip stem-chip" class:active={activeVerb === v} onclick={() => activeVerb = v}>
              <strong>{v.root}-</strong>
              <span class="chip-gloss">{v.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Tense</div>
        <div class="chips">
          {#each tenses as t}
            <button class="chip tense-chip" class:active={activeTense === t} onclick={() => activeTense = t}>
              <strong>{t.name}</strong>
              <span class="chip-gloss">{t.desc}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="builder-group">
        <div class="group-label">Subject</div>
        <div class="chips">
          {#each pronounSuffixes as p}
            <button class="chip pron-chip" class:active={activePronoun === p} onclick={() => activePronoun = p}>
              <strong>{p.suffix}</strong>
              <span class="chip-gloss">{p.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="result-box">
        <div class="result-word">{conjugate()}</div>
        <div class="result-gloss">{activeVerb.gloss} — {activeTense.name.toLowerCase()}{activePronoun.person ? ', ' + activePronoun.gloss : ''}</div>
      </div>
    </div>
  </section>

  <section class="prose">
    <h2>Five tenses, two verb classes</h2>
    <p>Quenya verbs come in two types: <strong>basic verbs</strong> with consonant-final roots (<em>quet-, tul-, car-</em>) and <strong>A-stem verbs</strong> with roots ending in <em>-a</em> (<em>lanta-, ora-</em>). They conjugate differently but follow the same five-tense system.</p>
    <p>The past tense is the most interesting. Basic verbs use <strong>nasal infixion</strong> — inserting an <em>n</em> before the final consonant: <em>quet-</em> → <em>quentë</em>. This is Latin/Greek, not Finnish. The verb system is where Quenya stops being Finnish and starts being Classical.</p>
    <p class="pull">The perfect tense prefixes a copy of the stem vowel (the "augment") and adds <em>-ië</em>. This is straight from Ancient Greek: λέλυκα (leluka, "I have loosened"). Tolkien the classicist, not the Fenno-phile.</p>
  </section>

  <hr>

  <!-- ═══════════════════════════════════ UTÚVIENYES -->
  <section class="block">
    <div class="section-label">Anatomy of a word — utúvienyes</div>
    <p class="intro-text">Aragorn's exclamation at his coronation. One word = one sentence. Step through it.</p>

    <div class="builder">
      <div class="utuv-display">
        <div class="utuv-word">{utuvSteps[utuvStep].highlight}</div>
        <div class="utuv-label">{utuvSteps[utuvStep].label}</div>
        <div class="utuv-desc">{utuvSteps[utuvStep].desc}</div>
      </div>

      <div class="utuv-controls">
        <button class="utuv-btn" disabled={utuvStep === 0} onclick={() => utuvStep--}>← prev</button>
        <span class="utuv-counter">{utuvStep + 1} / {utuvSteps.length}</span>
        <button class="utuv-btn" disabled={utuvStep === utuvSteps.length - 1} onclick={() => utuvStep++}>next →</button>
      </div>
    </div>
  </section>

  <section class="prose">
    <h2>This is the agglutinative argument</h2>
    <p><em>utúvienyes</em> carries everything — tense (perfect), aspect (completed), subject (I), object (it) — in five transparent morphemes glued onto one root. No separate words for "I" or "it" or "have." The verb <em>is</em> the sentence.</p>
    <p>Turkish does the same thing. <em>yapabilecekmiydim</em> = "was I going to be able to do it?" Finnish does it. Inuktitut does it. The morphemes compose. The seams stay clean.</p>
  </section>

  <hr>

  <!-- ═══════════════════════════════════ SINDARIN VERBS -->
  <section class="block">
    <div class="section-label">Sindarin verbs — a different approach</div>
    <p class="intro-text">Where Quenya stacks suffixes, Sindarin changes the root itself. Pick a verb to see all four forms.</p>

    <div class="builder">
      <div class="builder-group">
        <div class="group-label">Verb</div>
        <div class="chips">
          {#each sinVerbs as v}
            <button class="chip stem-chip" class:active={activeSinVerb === v} onclick={() => activeSinVerb = v}>
              <strong>{v.root}</strong>
              <span class="chip-gloss">{v.gloss}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="verb-grid">
        <div class="verb-cell">
          <div class="verb-tense-label">Imperative</div>
          <div class="verb-form">{activeSinVerb.imp}</div>
          <div class="verb-note">root + -o</div>
        </div>
        <div class="verb-cell">
          <div class="verb-tense-label">Present (I...)</div>
          <div class="verb-form">{activeSinVerb.pres}</div>
          <div class="verb-note">root + -on (1st person)</div>
        </div>
        <div class="verb-cell">
          <div class="verb-tense-label">Past</div>
          <div class="verb-form">{activeSinVerb.past}</div>
          <div class="verb-note">nasal infix or vowel change</div>
        </div>
        <div class="verb-cell">
          <div class="verb-tense-label">Future</div>
          <div class="verb-form">{activeSinVerb.fut}</div>
          <div class="verb-note">root + -tha</div>
        </div>
      </div>
    </div>
  </section>

  <section class="prose">
    <h2>The past tense tells the story</h2>
    <p>Look at the past tense of <em>car-</em> (to do): <strong>agor</strong>. That's not a suffix — the whole word changed. The root vowel shifted, a prefix appeared. This is ablaut, the same process that gives English <em>sing/sang/sung</em> and <em>drive/drove/driven</em>.</p>
    <p>Meanwhile <em>ped-</em> (speak) becomes <em>pent</em> — nasal infixion, where an <em>n</em> appears inside the root. Same mechanism as Quenya's past tense, but the results look more different because Sindarin has worn further from the shared ancestor.</p>
    <p class="pull">Quenya and Sindarin both descend from Common Eldarin. Quenya was preserved in the Blessed Realm — change was slow. Sindarin evolved in Middle-earth for millennia. The difference is what time does to a language.</p>
    <p>When the Noldor returned to Middle-earth, they found Sindarin so changed they could barely understand it. Then Thingol banned Quenya entirely — after learning of the Kinslaying. The Noldor adopted Sindarin for daily speech. Quenya survived as a language of lore, ceremony, and names.</p>
  </section>

  <hr>

  <nav class="page-nav">
    <a href="/seeds/tongues/100" class="nav-link prev">← 100: Pieces</a>
    <a href="/seeds/tongues/300" class="nav-link next">300: Namárië →</a>
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

  .breadcrumb { font-size: 0.72rem; letter-spacing: 0.06em; margin-bottom: 2.5rem; }
  .breadcrumb a { text-decoration: none; opacity: 0.4; transition: opacity 0.15s; }
  .breadcrumb a:hover { opacity: 1; }
  .sep { opacity: 0.2; margin: 0 0.4rem; }

  header { margin-bottom: 3rem; }
  .level-badge { font-size: 2.5rem; font-weight: 900; color: #b87d2a; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.5rem; }
  h1 { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 900; letter-spacing: -0.025em; margin: 0 0 0.75rem; }
  .subtitle { font-size: 1.05rem; line-height: 1.75; color: #4a3f30; }

  .section-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #8b6914; margin-bottom: 0.75rem; }
  .intro-text { font-size: 0.95rem; line-height: 1.7; color: #4a3f30; margin-bottom: 1.5rem; }
  .block { margin-bottom: 1rem; }

  .builder {
    background: white;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04), 0 12px 36px rgba(37,26,16,0.04);
  }
  .builder-group { margin-bottom: 1.25rem; }
  .group-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #a08070; margin-bottom: 0.5rem; }
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
  .chip.active.tense-chip { background: #5b4fcf; border-color: #5b4fcf; color: white; }
  .chip.active.tense-chip .chip-gloss { opacity: 0.7; }
  .chip.active.pron-chip { background: #1b7a68; border-color: #1b7a68; color: white; }
  .chip.active.pron-chip .chip-gloss { opacity: 0.7; }

  .result-box {
    background: #faf7f2;
    border-radius: 10px;
    padding: 1.25rem;
    margin-top: 0.5rem;
  }
  .result-word { font-size: 2rem; font-weight: 900; letter-spacing: -0.02em; }
  .result-gloss { font-size: 0.88rem; color: #6b5344; font-style: italic; margin-top: 0.3rem; }

  /* Utúvienyes stepper */
  .utuv-display { text-align: center; padding: 1.5rem 0; }
  .utuv-word {
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.01em;
    margin-bottom: 0.75rem;
    font-family: 'Georgia', serif;
  }
  .utuv-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #d94f2a;
    margin-bottom: 0.5rem;
  }
  .utuv-desc {
    font-size: 0.92rem;
    line-height: 1.7;
    color: #4a3f30;
    max-width: 480px;
    margin: 0 auto;
  }
  .utuv-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #ede5d8;
  }
  .utuv-btn {
    font-family: 'Georgia', serif;
    font-size: 0.82rem;
    padding: 0.4rem 1rem;
    border: 1.5px solid #ede5d8;
    border-radius: 100px;
    background: white;
    color: #6b5344;
    cursor: pointer;
    transition: all 0.15s;
  }
  .utuv-btn:hover:not(:disabled) { border-color: #b87d2a; color: #b87d2a; }
  .utuv-btn:disabled { opacity: 0.25; cursor: default; }
  .utuv-counter { font-size: 0.75rem; opacity: 0.4; font-variant-numeric: tabular-nums; }

  /* Sindarin verb grid */
  .verb-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  @media (max-width: 500px) { .verb-grid { grid-template-columns: 1fr; } }
  .verb-cell {
    background: #faf7f2;
    border-radius: 10px;
    padding: 1rem;
  }
  .verb-tense-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a08070;
    margin-bottom: 0.3rem;
  }
  .verb-form {
    font-size: 1.4rem;
    font-weight: 800;
    font-style: italic;
    color: #1b7a68;
  }
  .verb-note {
    font-size: 0.75rem;
    color: #a08070;
    margin-top: 0.25rem;
  }

  .prose { max-width: 600px; margin: 3rem auto; }
  .prose h2 { font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 900; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem; }
  .prose p { font-size: 1.02rem; line-height: 1.85; margin: 0 0 1rem; }
  .prose .pull { font-size: 1.05rem; font-weight: 700; color: #1b7a68; line-height: 1.5; border-left: 3px solid #1b7a68; padding: 0 0 0 1.25rem; margin: 2rem 0; }

  hr { border: none; border-top: 1px solid #ede5d8; margin: 2rem auto; max-width: 600px; }

  .page-nav { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ede5d8; }
  .nav-link { text-decoration: none; font-weight: 600; font-size: 0.92rem; color: #b87d2a; transition: color 0.15s; }
  .nav-link:hover { color: #d94f2a; }

  @media (max-width: 600px) { .chip { font-size: 0.78rem; padding: 0.35rem 0.6rem; } }
</style>
