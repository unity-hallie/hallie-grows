<script lang="ts">
  import { onMount } from 'svelte'
  let visible = $state(false)
  onMount(() => { visible = true })

  let filter = $state('')
  let activeSection = $state<'cases' | 'mutations' | 'verbs' | 'stems' | 'film'>('cases')

  // ── CASE TABLE ──────────────────────────────────────
  const cases = [
    { name: 'Nominative', quenya: '—', finnish: '—', meaning: 'subject', example: 'cirya (a ship)' },
    { name: 'Genitive', quenya: '-o / -on (pl)', finnish: '-n', meaning: 'of, from (source)', example: 'ciryo (of a ship)' },
    { name: 'Possessive', quenya: '-va', finnish: '—', meaning: 'belonging to', example: 'ciryava (a ship\'s)' },
    { name: 'Dative', quenya: '-n', finnish: '-lle', meaning: 'to, for', example: 'ciryan (for a ship)' },
    { name: 'Instrumental', quenya: '-nen', finnish: '-lla', meaning: 'by means of', example: 'ciryanen (by ship)' },
    { name: 'Locative', quenya: '-sse', finnish: '-ssa/-ssä', meaning: 'in, at, on', example: 'ciryasse (on a ship)' },
    { name: 'Allative', quenya: '-nna', finnish: '-Vn (illative)', meaning: 'toward', example: 'ciryanna (toward a ship)' },
    { name: 'Ablative', quenya: '-llo', finnish: '-sta/-stä', meaning: 'away from', example: 'ciryallo (from a ship)' },
  ]

  // ── MUTATION TABLE ──────────────────────────────────
  const mutationRows = [
    { base: 'p', soft: 'b', nasal: 'ph', example: 'perian → i berian' },
    { base: 't', soft: 'd', nasal: 'th', example: 'taur → i daur' },
    { base: 'c', soft: 'g', nasal: 'ch', example: 'caras → i garas' },
    { base: 'b', soft: 'v', nasal: 'm', example: 'barad → i varad' },
    { base: 'd', soft: 'dh', nasal: 'n', example: 'dûr → i dhûr' },
    { base: 'g', soft: '(vanishes)', nasal: 'ng', example: 'galadh → i \'aladh' },
    { base: 'm', soft: 'v', nasal: 'm', example: 'mellon → i vellon' },
    { base: 's', soft: 'h', nasal: 's', example: 'sell → i hell' },
  ]

  // ── VERB REFERENCE ──────────────────────────────────
  const verbRef = [
    { tense: 'Aorist', qBasic: 'root + -ë', qAstem: 'root (bare)', sindarin: '—', meaning: 'general truth, habit' },
    { tense: 'Present', qBasic: 'lengthen vowel + -a', qAstem: 'root → -ea', sindarin: 'root + -on (1sg)', meaning: 'ongoing action' },
    { tense: 'Past', qBasic: 'nasal infix', qAstem: 'root → -anë', sindarin: 'nasal infix / ablaut', meaning: 'completed action' },
    { tense: 'Perfect', qBasic: 'augment + root + -ië', qAstem: 'augment + root + -ië', sindarin: '—', meaning: 'completed, still relevant' },
    { tense: 'Future', qBasic: 'root + -uva', qAstem: 'root → -uva', sindarin: 'root + -tha', meaning: 'will happen' },
    { tense: 'Imperative', qBasic: 'root + -a', qAstem: 'root (bare)', sindarin: 'root + -o', meaning: 'command' },
  ]

  // ── STEM GLOSSARY ───────────────────────────────────
  const stems = [
    { word: 'alda', lang: 'Q', gloss: 'tree', notes: 'pl. aldar' },
    { word: 'aran', lang: 'Q/S', gloss: 'king', notes: 'S. pl. erain (vowel shift)' },
    { word: 'burz', lang: 'BS', gloss: 'dark', notes: 'cf. Lugbúrz "dark tower"' },
    { word: 'caras', lang: 'S', gloss: 'city, moated fortress', notes: 'Caras Galadhon' },
    { word: 'car-', lang: 'Q/S', gloss: 'do, make', notes: 'Q. past: carnë. S. past: agor' },
    { word: 'cirya', lang: 'Q', gloss: 'ship', notes: 'the Plotz paradigm noun' },
    { word: 'durb-', lang: 'BS', gloss: 'rule, constrain', notes: 'Ring inscription' },
    { word: 'edhel', lang: 'S', gloss: 'elf', notes: 'pl. edhil' },
    { word: 'elen', lang: 'Q', gloss: 'star', notes: 'pl. eleni' },
    { word: 'galadh', lang: 'S', gloss: 'tree', notes: 'Lothlórien = "blossom of golden tree"' },
    { word: 'gimb-', lang: 'BS', gloss: 'find, seek out', notes: 'Ring inscription' },
    { word: 'krimp-', lang: 'BS', gloss: 'bind', notes: 'Ring inscription' },
    { word: 'lante', lang: 'Q', gloss: 'fall', notes: 'A-stem verb: lanta-' },
    { word: 'lasse', lang: 'Q', gloss: 'leaf', notes: 'pl. lassi (e→i)' },
    { word: 'mellon', lang: 'S', gloss: 'friend', notes: '"speak friend and enter"' },
    { word: 'nazg', lang: 'BS', gloss: 'ring', notes: 'Nazgûl = ring-wraith' },
    { word: 'oma', lang: 'Q', gloss: 'voice', notes: 'ómaryo = "of her voice"' },
    { word: 'orch', lang: 'S', gloss: 'orc', notes: 'pl. yrch (o→y)' },
    { word: 'ped-', lang: 'S', gloss: 'speak', notes: 'imp. pedo, past pent' },
    { word: 'perian', lang: 'S', gloss: 'halfling', notes: 'i berian (soft mut.)' },
    { word: 'quet-', lang: 'Q', gloss: 'speak', notes: 'past: quentë' },
    { word: 'súre', lang: 'Q', gloss: 'wind', notes: 'súrinen = "by the wind"' },
    { word: 'thrak-', lang: 'BS', gloss: 'bring, drag', notes: 'coercive: forced movement' },
    { word: 'tul-', lang: 'Q', gloss: 'come', notes: 'cf. Finnish tulla' },
    { word: 'Varda', lang: 'Q', gloss: 'star-queen (Vala)', notes: 'gen. Vardo' },
  ]

  $effect(() => {
    // filter stems when user types
    filter
  })

  function filteredStems() {
    if (!filter) return stems
    const f = filter.toLowerCase()
    return stems.filter(s =>
      s.word.toLowerCase().includes(f) ||
      s.gloss.toLowerCase().includes(f) ||
      s.notes.toLowerCase().includes(f)
    )
  }

  // ── FILM DIALOGUE ───────────────────────────────────
  const filmLines = [
    { lang: 'Sindarin', scene: 'Doors of Moria', line: 'Ennyn Durin Aran Moria. Pedo mellon a minno.', translation: 'Doors of Durin, Lord of Moria. Speak "friend" and enter.' },
    { lang: 'Sindarin', scene: 'Arwen at Bruinen', line: 'Nîn o Chithaeglir lasto beth daer; rimmo nîn Bruinen dan in Ulaer!', translation: 'Waters of the Misty Mountains, hear the great word; flow, waters of Loudwater, against the Ringwraiths!' },
    { lang: 'Quenya', scene: 'Saruman on Caradhras', line: 'Cuiva nwalca Carnirasse! Nai yarvaxea rasselya taltuva notto-carinnar!', translation: 'Wake up, cruel Redhorn! May your bloodstained horn fall upon enemy heads!' },
    { lang: 'Sindarin', scene: 'Council of Elrond', line: 'Havo dad.', translation: 'Sit down.' },
    { lang: 'Sindarin', scene: 'Aragorn to Arwen', line: 'Ae ú-esteliach nad, estelio han. Estelio ammen.', translation: 'If you trust nothing else, trust this. Trust us.' },
    { lang: 'Sindarin', scene: 'Haldir in Lothlórien', line: 'Le suilon.', translation: 'I greet you.' },
    { lang: 'Black Speech', scene: 'Council of Elrond (Gandalf)', line: 'Ash nazg durbatulûk, ash nazg gimbatul, ash nazg thrakatulûk, agh burzum-ishi krimpatul.', translation: 'One Ring to rule them all, one Ring to find them, one Ring to bring them all, and in the darkness bind them.' },
  ]
</script>

<svelte:head>
  <title>Glossary — Tongues of Arda</title>
</svelte:head>

<article class:visible>
  <nav class="breadcrumb">
    <a href="/seeds/tongues">Tongues of Arda</a>
    <span class="sep">/</span>
    <span>glossary</span>
  </nav>

  <header>
    <div class="level-badge">ref</div>
    <h1>Glossary</h1>
    <p class="subtitle">All the tables. All the morphemes. The reference you build as you go.</p>
  </header>

  <nav class="section-tabs">
    <button class:active={activeSection === 'cases'} onclick={() => activeSection = 'cases'}>Cases</button>
    <button class:active={activeSection === 'mutations'} onclick={() => activeSection = 'mutations'}>Mutations</button>
    <button class:active={activeSection === 'verbs'} onclick={() => activeSection = 'verbs'}>Verbs</button>
    <button class:active={activeSection === 'stems'} onclick={() => activeSection = 'stems'}>Stems</button>
    <button class:active={activeSection === 'film'} onclick={() => activeSection = 'film'}>Film</button>
  </nav>

  {#if activeSection === 'cases'}
  <section class="table-section">
    <h2>Quenya noun cases</h2>
    <p class="table-intro">The locative triad (-sse, -nna, -llo) mirrors Finnish (-ssa, -seen, -sta). The possessive case (-va) is Tolkien's invention — Finnish uses a single genitive where Quenya splits source from ownership.</p>
    <div class="ref-table">
      <div class="ref-row header">
        <span>Case</span>
        <span>Quenya</span>
        <span>Finnish</span>
        <span>Meaning</span>
      </div>
      {#each cases as c}
        <div class="ref-row">
          <span class="case-name">{c.name}</span>
          <span class="mono">{c.quenya}</span>
          <span class="mono dim">{c.finnish}</span>
          <span class="dim">{c.meaning}</span>
        </div>
      {/each}
    </div>
  </section>

  {:else if activeSection === 'mutations'}
  <section class="table-section">
    <h2>Sindarin consonant mutations</h2>
    <p class="table-intro">Soft mutation is triggered by the singular article <em>i</em> and most prepositions. Nasal mutation by <em>in</em> (in) and related prepositions. Welsh has the same three-way system.</p>
    <div class="ref-table">
      <div class="ref-row header">
        <span>Base</span>
        <span>Soft</span>
        <span>Nasal</span>
        <span>Example</span>
      </div>
      {#each mutationRows as m}
        <div class="ref-row">
          <span class="base-cons">{m.base}</span>
          <span class="mono">{m.soft}</span>
          <span class="mono">{m.nasal}</span>
          <span class="dim example-text">{m.example}</span>
        </div>
      {/each}
    </div>
  </section>

  {:else if activeSection === 'verbs'}
  <section class="table-section">
    <h2>Verb tense formation</h2>
    <p class="table-intro">Quenya has two verb classes (basic + A-stem) and five tenses plus imperative. Sindarin has fewer attested forms but shows the same tense distinctions.</p>
    <div class="ref-table wide">
      <div class="ref-row header">
        <span>Tense</span>
        <span>Q. basic</span>
        <span>Q. A-stem</span>
        <span>Sindarin</span>
      </div>
      {#each verbRef as v}
        <div class="ref-row">
          <span class="case-name">{v.tense}</span>
          <span class="mono small">{v.qBasic}</span>
          <span class="mono small">{v.qAstem}</span>
          <span class="mono small">{v.sindarin}</span>
        </div>
      {/each}
    </div>
  </section>

  {:else if activeSection === 'stems'}
  <section class="table-section">
    <h2>Stem glossary</h2>
    <div class="search-bar">
      <input type="text" bind:value={filter} placeholder="Search stems..." />
    </div>
    <div class="stem-list">
      {#each filteredStems() as s}
        <div class="stem-row">
          <span class="stem-word">{s.word}</span>
          <span class="stem-lang">{s.lang}</span>
          <span class="stem-gloss">{s.gloss}</span>
          <span class="stem-notes">{s.notes}</span>
        </div>
      {/each}
      {#if filteredStems().length === 0}
        <div class="stem-empty">No matches.</div>
      {/if}
    </div>
  </section>

  {:else if activeSection === 'film'}
  <section class="table-section">
    <h2>Elvish in Fellowship of the Ring</h2>
    <p class="table-intro">Most film Elvish is Sindarin (the daily language of Middle-earth's Elves). Quenya appears in ceremony and lore. David Salo composed the film dialogue from Tolkien's published and unpublished material.</p>
    <div class="film-list">
      {#each filmLines as fl}
        <div class="film-card">
          <div class="film-meta">
            <span class="film-lang">{fl.lang}</span>
            <span class="film-scene">{fl.scene}</span>
          </div>
          <div class="film-line">{fl.line}</div>
          <div class="film-trans">{fl.translation}</div>
        </div>
      {/each}
    </div>
  </section>
  {/if}

  <hr>

  <nav class="page-nav">
    <a href="/seeds/tongues/300" class="nav-link prev">← 300: Namárië</a>
    <a href="/seeds/tongues" class="nav-link next">Back to intro →</a>
  </nav>
</article>

<style>
  article {
    max-width: 780px;
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
  h1 { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 900; letter-spacing: -0.025em; margin: 0 0 0.75rem; }
  h2 { font-size: 1.3rem; font-weight: 800; margin: 0 0 0.75rem; }
  .subtitle { font-size: 1.05rem; line-height: 1.75; color: #4a3f30; }

  .section-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #ede5d8;
    margin-bottom: 2rem;
    overflow-x: auto;
  }
  .section-tabs button {
    font-family: 'Georgia', serif;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    padding: 0.6rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.35;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    color: #1a1208;
    white-space: nowrap;
  }
  .section-tabs button:hover { opacity: 0.7; }
  .section-tabs button.active { opacity: 1; border-bottom-color: #b87d2a; }

  .table-section { margin-bottom: 2rem; }
  .table-intro { font-size: 0.92rem; line-height: 1.7; color: #4a3f30; margin-bottom: 1.5rem; }

  .ref-table {
    font-size: 0.82rem;
    border-collapse: collapse;
  }
  .ref-row {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 0.8fr 1.5fr;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(26,18,8,0.06);
    align-items: baseline;
  }
  .ref-table.wide .ref-row {
    grid-template-columns: 0.8fr 1fr 1fr 1fr;
  }
  .ref-row.header {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.4;
    border-bottom-color: rgba(26,18,8,0.15);
    padding-bottom: 0.6rem;
    font-weight: 700;
  }
  .case-name { font-weight: 600; }
  .base-cons { font-weight: 800; font-size: 1.1em; }
  .mono { font-family: monospace; color: #4a6741; }
  .dim { opacity: 0.6; }
  .small { font-size: 0.78em; }
  .example-text { font-style: italic; font-size: 0.82em; }

  /* Search */
  .search-bar { margin-bottom: 1rem; }
  .search-bar input {
    font-family: 'Georgia', serif;
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
    border: 1.5px solid #ede5d8;
    border-radius: 8px;
    background: white;
    color: #251a10;
    width: 100%;
    max-width: 300px;
  }
  .search-bar input:focus { outline: none; border-color: #b87d2a; }
  .search-bar input::placeholder { color: #a08070; }

  /* Stems */
  .stem-list { display: flex; flex-direction: column; }
  .stem-row {
    display: grid;
    grid-template-columns: 1fr 0.4fr 1fr 2fr;
    gap: 0.5rem;
    padding: 0.45rem 0;
    border-bottom: 1px solid rgba(26,18,8,0.06);
    font-size: 0.82rem;
    align-items: baseline;
  }
  .stem-word { font-weight: 700; font-style: italic; }
  .stem-lang {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    opacity: 0.4;
  }
  .stem-gloss { color: #4a3f30; }
  .stem-notes { opacity: 0.5; font-size: 0.8em; }
  .stem-empty { color: #a08070; font-style: italic; padding: 1rem 0; }

  /* Film */
  .film-list { display: flex; flex-direction: column; gap: 1rem; }
  .film-card {
    background: white;
    border-radius: 10px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(37,26,16,0.06), 0 4px 12px rgba(37,26,16,0.04);
  }
  .film-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
  }
  .film-lang {
    font-weight: 700;
    text-transform: uppercase;
    color: #b87d2a;
  }
  .film-scene { opacity: 0.4; }
  .film-line {
    font-size: 1rem;
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 0.4rem;
  }
  .film-trans {
    font-size: 0.85rem;
    opacity: 0.5;
    line-height: 1.5;
  }

  hr { border: none; border-top: 1px solid #ede5d8; margin: 2rem auto; max-width: 600px; }

  .page-nav { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #ede5d8; }
  .nav-link { text-decoration: none; font-weight: 600; font-size: 0.92rem; color: #b87d2a; transition: color 0.15s; }
  .nav-link:hover { color: #d94f2a; }

  @media (max-width: 600px) {
    .ref-row { grid-template-columns: 1fr 1fr 1fr !important; font-size: 0.75rem; }
    .ref-row span:nth-child(4) { display: none; }
    .stem-row { grid-template-columns: 1fr 0.3fr 1fr; }
    .stem-notes { display: none; }
  }
</style>
