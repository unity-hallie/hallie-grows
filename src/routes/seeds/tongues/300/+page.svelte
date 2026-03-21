<script lang="ts">
  import { onMount } from 'svelte'
  let visible = $state(false)
  onMount(() => { visible = true })

  type WordAnalysis = { quenya: string; morphemes: { form: string; gloss: string; color: string }[]; english: string }

  const lines: { quenya: string; english: string; words: WordAnalysis[] }[] = [
    {
      quenya: 'Ai! laurië lantar lassi súrinen',
      english: 'Ah! Like gold fall the leaves in the wind',
      words: [
        { quenya: 'Ai', morphemes: [{ form: 'Ai', gloss: 'alas!', color: 'func' }], english: 'Ah!' },
        { quenya: 'laurië', morphemes: [{ form: 'laurea', gloss: 'golden', color: 'stem' }, { form: '-ë', gloss: 'plural adj.', color: 'number' }], english: 'like gold' },
        { quenya: 'lantar', morphemes: [{ form: 'lanta-', gloss: 'fall', color: 'stem' }, { form: '-r', gloss: 'plural (they)', color: 'number' }], english: 'fall (they)' },
        { quenya: 'lassi', morphemes: [{ form: 'lasse', gloss: 'leaf', color: 'stem' }, { form: '-i', gloss: 'plural', color: 'number' }], english: 'leaves' },
        { quenya: 'súrinen', morphemes: [{ form: 'súre', gloss: 'wind', color: 'stem' }, { form: '-nen', gloss: 'instrumental', color: 'case' }], english: 'in/by the wind' },
      ]
    },
    {
      quenya: 'Yéni únótimë ve rámar aldaron!',
      english: 'Long years numberless as the wings of trees!',
      words: [
        { quenya: 'Yéni', morphemes: [{ form: 'yén', gloss: 'long year (144 yrs)', color: 'stem' }, { form: '-i', gloss: 'plural', color: 'number' }], english: 'long years' },
        { quenya: 'únótimë', morphemes: [{ form: 'ú-', gloss: 'not', color: 'func' }, { form: 'not-', gloss: 'count', color: 'stem' }, { form: '-ima', gloss: '-able', color: 'func' }, { form: '-ë', gloss: 'plural', color: 'number' }], english: 'uncountable' },
        { quenya: 've', morphemes: [{ form: 've', gloss: 'as, like', color: 'func' }], english: 'as' },
        { quenya: 'rámar', morphemes: [{ form: 'ráma', gloss: 'wing', color: 'stem' }, { form: '-r', gloss: 'plural', color: 'number' }], english: 'wings' },
        { quenya: 'aldaron', morphemes: [{ form: 'alda', gloss: 'tree', color: 'stem' }, { form: '-r', gloss: 'plural', color: 'number' }, { form: '-on', gloss: 'genitive', color: 'case' }], english: 'of trees' },
      ]
    },
    {
      quenya: 'Vardo tellumar nu luini',
      english: 'Beneath the blue vaults of Varda',
      words: [
        { quenya: 'Vardo', morphemes: [{ form: 'Varda', gloss: 'Varda (star-queen)', color: 'stem' }, { form: '-o', gloss: 'genitive', color: 'case' }], english: 'of Varda' },
        { quenya: 'tellumar', morphemes: [{ form: 'telluma', gloss: 'vault, dome', color: 'stem' }, { form: '-r', gloss: 'plural', color: 'number' }], english: 'vaults' },
        { quenya: 'nu', morphemes: [{ form: 'nu', gloss: 'beneath', color: 'func' }], english: 'beneath' },
        { quenya: 'luini', morphemes: [{ form: 'luine', gloss: 'blue', color: 'stem' }, { form: '-i', gloss: 'plural', color: 'number' }], english: 'blue' },
      ]
    },
    {
      quenya: 'yassen tintilar i eleni',
      english: 'wherein the stars tremble',
      words: [
        { quenya: 'yassen', morphemes: [{ form: 'ya', gloss: 'which (relative)', color: 'func' }, { form: '-sse', gloss: 'locative', color: 'case' }, { form: '-n', gloss: 'plural', color: 'number' }], english: 'in which' },
        { quenya: 'tintilar', morphemes: [{ form: 'tintila-', gloss: 'twinkle', color: 'stem' }, { form: '-r', gloss: 'plural', color: 'number' }], english: 'twinkle' },
        { quenya: 'i', morphemes: [{ form: 'i', gloss: 'the', color: 'func' }], english: 'the' },
        { quenya: 'eleni', morphemes: [{ form: 'elen', gloss: 'star', color: 'stem' }, { form: '-i', gloss: 'plural', color: 'number' }], english: 'stars' },
      ]
    },
    {
      quenya: 'ómaryo airetári-lírinen',
      english: 'in the song of her voice, holy and queenly',
      words: [
        { quenya: 'ómaryo', morphemes: [{ form: 'óma', gloss: 'voice', color: 'stem' }, { form: '-rya', gloss: 'her', color: 'poss' }, { form: '-o', gloss: 'genitive', color: 'case' }], english: 'of her voice' },
        { quenya: 'airetári-lírinen', morphemes: [{ form: 'aire', gloss: 'holy', color: 'stem' }, { form: 'tári', gloss: 'queen', color: 'stem' }, { form: 'líre', gloss: 'song', color: 'stem' }, { form: '-nen', gloss: 'instrumental', color: 'case' }], english: 'in the song of the holy queen' },
      ]
    },
    {
      quenya: 'Sí vanwa ná, Rómello vanwa, Valimar!',
      english: 'Now lost, lost to those from the East, Valimar!',
      words: [
        { quenya: 'Sí', morphemes: [{ form: 'sí', gloss: 'now', color: 'func' }], english: 'now' },
        { quenya: 'vanwa', morphemes: [{ form: 'vanya-', gloss: 'depart', color: 'stem' }, { form: '-nwa', gloss: 'past participle', color: 'func' }], english: 'gone, lost' },
        { quenya: 'ná', morphemes: [{ form: 'ná', gloss: 'is (copula)', color: 'func' }], english: 'is' },
        { quenya: 'Rómello', morphemes: [{ form: 'Rómen', gloss: 'East', color: 'stem' }, { form: '-llo', gloss: 'ablative (from)', color: 'case' }], english: 'from the East' },
        { quenya: 'Valimar', morphemes: [{ form: 'Valimar', gloss: 'Valimar (the blessed land)', color: 'stem' }], english: 'Valimar' },
      ]
    },
    {
      quenya: 'Namárië!',
      english: 'Farewell!',
      words: [
        { quenya: 'Namárië', morphemes: [{ form: 'ná', gloss: 'be (imperative)', color: 'func' }, { form: 'márië', gloss: 'goodness', color: 'stem' }], english: '"be well" — farewell' },
      ]
    },
  ]

  let activeLine = $state(0)
  let activeWord = $state<number | null>(null)
  let seen = $state([true, false, false, false, false, false, false])
  const allSeen = $derived(seen.every(Boolean))
</script>

<svelte:head>
  <title>300: Namárië — Tongues of Arda</title>
</svelte:head>

<article class:visible>
  <nav class="breadcrumb">
    <a href="/seeds/tongues">Tongues of Arda</a>
    <span class="sep">/</span>
    <span>300</span>
  </nav>

  <header>
    <div class="level-badge">300</div>
    <h1>Namárië</h1>
    <p class="subtitle">Galadriel's lament. The longest Quenya text in The Lord of the Rings. Walk through it morpheme by morpheme.</p>
  </header>

  <section class="poem-intro">
    <p>This is <em>Altariello Nainië Lóriendessë</em> — "Galadriel's Lament in Lórien." Tolkien published a detailed interlinear commentary in <em>The Road Goes Ever On</em> (1967). It is the capstone of his Quenya: every grammatical feature you've learned appears here.</p>
    <p>Tap any word to see its pieces. Everything you built in 100 and 200 is here, alive in poetry.</p>
  </section>

  <!-- ═══════════════════════════════════ POEM -->
  <section class="poem">
    <div class="line-nav">
      {#each lines as line, i}
        <button class="line-tab" class:active={activeLine === i} class:seen={seen[i]} onclick={() => { seen[i] = true; activeLine = i; activeWord = null }}>
          {i + 1}
        </button>
      {/each}
    </div>

    <div class="line-display">
      <div class="line-quenya">
        {#each lines[activeLine].words as word, wi}
          <button
            class="poem-word"
            class:active={activeWord === wi}
            onclick={() => activeWord = activeWord === wi ? null : wi}
          >{word.quenya}</button>
        {/each}
      </div>
      <div class="line-english">{lines[activeLine].english}</div>
    </div>

    {#if activeWord !== null}
      {@const word = lines[activeLine].words[activeWord]}
      <div class="word-analysis">
        <div class="wa-word">{word.quenya}</div>
        <div class="wa-morphemes">
          {#each word.morphemes as m, i}
            <span class="wa-morpheme {m.color}">
              <span class="wa-form">{m.form}</span>
              <span class="wa-gloss">{m.gloss}</span>
            </span>
            {#if i < word.morphemes.length - 1}<span class="wa-plus">+</span>{/if}
          {/each}
        </div>
        <div class="wa-english">"{word.english}"</div>
      </div>
    {:else}
      <div class="word-analysis empty">Tap a word above to see its morphemes.</div>
    {/if}
  </section>

  <hr>

  <section class="prose">
    <h2>What to notice</h2>

    <h3>ómaryo</h3>
    <p><em>óma</em> (voice) + <em>-rya</em> (her) + <em>-o</em> (genitive). One word where English needs four.</p>

    <h3>súrinen</h3>
    <p><em>súre</em> (wind) + <em>-nen</em> (instrumental). Not "in the wind" — "by-wind-means." The grammar carries the causation.</p>

    <h3>aldaron</h3>
    <p><em>alda</em> (tree) + <em>-r</em> (plural) + <em>-on</em> (genitive). You built this exact form in 100.</p>

    <h3>Rómello</h3>
    <p><em>Rómen</em> (East) + <em>-llo</em> (ablative). Valimar is lost <em>from the perspective of</em> those in Middle-earth. The ablative carries exile.</p>

    <h3>Namárië</h3>
    <p><em>ná</em> (be) + <em>márië</em> (goodness). Two pieces. Be well.</p>
  </section>

  <hr>

  {#if allSeen}
    <section class="full-poem">
      {#each lines as line}
        <p class="fp-quenya">{line.quenya}</p>
      {/each}
    </section>
  {/if}

  <hr>

  <nav class="page-nav">
    <a href="/seeds/tongues/200" class="nav-link prev">← 200: Movement</a>
    <a href="/seeds/tongues/gloss" class="nav-link next">Glossary →</a>
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

  header { margin-bottom: 2rem; }
  .level-badge { font-size: 2.5rem; font-weight: 900; color: #b87d2a; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.5rem; }
  h1 { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 900; letter-spacing: -0.025em; margin: 0 0 0.75rem; font-style: italic; }
  .subtitle { font-size: 1.05rem; line-height: 1.75; color: #4a3f30; }

  .poem-intro { max-width: 600px; margin: 0 auto 2.5rem; }
  .poem-intro p { font-size: 1rem; line-height: 1.85; margin: 0 0 1rem; }

  /* Poem display */
  .poem {
    background: white;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04), 0 12px 36px rgba(37,26,16,0.04);
  }

  .line-nav {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .line-tab {
    font-family: 'Georgia', serif;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1.5px solid #ede5d8;
    background: #faf7f2;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b5344;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line-tab:hover { border-color: #b87d2a; }
  .line-tab.seen { border-color: #d4c4a8; }
  .line-tab.active { background: #b87d2a; border-color: #b87d2a; color: white; }

  .line-display { margin-bottom: 1rem; }
  .line-quenya {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    line-height: 2.2;
  }
  .poem-word {
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    font-style: italic;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    border: 1.5px solid transparent;
    background: none;
    color: #251a10;
    cursor: pointer;
    transition: all 0.18s;
  }
  .poem-word:hover { border-color: #b87d2a; background: rgba(184,125,42,0.05); }
  .poem-word.active { background: #b87d2a; color: white; border-color: #b87d2a; }

  .line-english {
    font-size: 0.88rem;
    color: #6b5344;
    font-style: italic;
    padding-left: 0.5rem;
  }

  .word-analysis {
    background: #faf7f2;
    border-radius: 10px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .word-analysis.empty {
    color: #a08070;
    font-style: italic;
    font-size: 0.9rem;
  }
  .wa-word { font-size: 1.6rem; font-weight: 900; font-style: italic; }
  .wa-morphemes {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.3rem;
  }
  .wa-morpheme {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.85rem;
  }
  .wa-morpheme.stem { background: rgba(217,79,42,0.1); color: #d94f2a; }
  .wa-morpheme.number { background: rgba(91,79,207,0.1); color: #5b4fcf; }
  .wa-morpheme.case { background: rgba(27,122,104,0.1); color: #1b7a68; }
  .wa-morpheme.poss { background: rgba(139,105,20,0.1); color: #8b6914; }
  .wa-morpheme.func { background: rgba(107,83,68,0.1); color: #6b5344; }
  .wa-form { font-size: 0.9em; }
  .wa-gloss { font-size: 0.6rem; font-weight: 400; opacity: 0.7; }
  .wa-plus { opacity: 0.25; font-size: 0.8rem; align-self: center; }
  .wa-english { font-size: 0.88rem; color: #6b5344; font-style: italic; }

  .prose { max-width: 600px; margin: 3rem auto; }
  .prose h2 { font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 900; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem; }
  .prose h3 { font-size: 1rem; font-weight: 700; margin: 2rem 0 0.5rem; color: #b87d2a; }
  .prose p { font-size: 1.02rem; line-height: 1.85; margin: 0 0 1rem; }
  hr { border: none; border-top: 1px solid #ede5d8; margin: 2rem auto; max-width: 600px; }

  /* full poem — appears after all lines visited */
  .full-poem {
    max-width: 480px;
    margin: 3rem auto;
    text-align: center;
    animation: poemFade 1.2s ease both;
  }
  @keyframes poemFade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fp-quenya {
    font-size: 1.15rem;
    font-style: italic;
    font-weight: 600;
    line-height: 2.2;
    margin: 0;
    color: #251a10;
  }

  .page-nav { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ede5d8; }
  .nav-link { text-decoration: none; font-weight: 600; font-size: 0.92rem; color: #b87d2a; transition: color 0.15s; }
  .nav-link:hover { color: #d94f2a; }
</style>
