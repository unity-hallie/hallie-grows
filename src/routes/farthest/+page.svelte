<script lang="ts">
  /* WHAT'S FARTHEST FROM HOME
     A toy for Toni, who asked what the most orthogonal word to "ball" was, and then asked the real one.

     THE TWO QUESTIONS, AND WHY THEY'RE DIFFERENT
       • The OPPOSITE of a word = the most NEGATIVE cosine. The thing that points against it.
       • The FARTHEST from a word = the cosine nearest ZERO. The thing off at a right angle — not its
         enemy, just entirely unrelated. Neither for nor against.

     Whether a word HAS an opposite depends on the map you're standing on. In this space (GloVe, trained
     on Wikipedia + newswire) cosines spread out and go negative freely — most common words really do
     have something in the language that points against them. Neural/LLM embedding spaces are different:
     their vectors huddle in a narrow cone, so almost every cosine comes back positive, and "nothing has
     a true opposite" can look like a law of language when it's really a property of that particular map.
     When a word's floor genuinely never goes negative here, "farthest" can only mean *orthogonal* — and
     what comes back is almost never what you'd guess.

     THE THING PEOPLE GET WRONG (and it's the whole point of the toy):
     **Antonyms live NEXT DOOR, not far away.** hot/cold, up/down, queer/straight all sit close together
     in this space, because embeddings measure what a word is ABOUT — and opposites are about the same
     thing. They appear in the same sentences, in the same arguments, doing the same job. So if you ask
     for the farthest thing from a word, you will not get its enemy. Its enemy is standing right beside it.

     Everything runs in the browser. 30k words, unit-normalised and int8-quantised, so cosine is just a
     dot product. No server, no key, no network after load. */
  import { onMount } from 'svelte'

  const DIMS = 300

  let words: string[] = $state([])
  let vecs: Int8Array | null = $state(null)
  let index = new Map<string, number>()
  let loading = $state(true)
  let error = $state('')

  let query = $state('home')
  let submitted = $state('home')

  onMount(async () => {
    try {
      const [w, v] = await Promise.all([
        fetch('/embed/words.json').then((r) => r.json()),
        fetch('/embed/vecs.i8').then((r) => r.arrayBuffer())
      ])
      words = w
      vecs = new Int8Array(v)
      index = new Map(words.map((x, i) => [x, i]))
      loading = false
    } catch (e) {
      error = 'could not load the word space'
      loading = false
    }
  })

  /* Cosine against every word. The vectors are unit-length, so this is a bare dot product —
     which is the only reason 30,000 × 300 is fast enough to feel instant. */
  function scoresFor(w: string): Float32Array | null {
    const i = index.get(w)
    if (i === undefined || !vecs) return null
    const out = new Float32Array(words.length)
    const base = i * DIMS
    for (let j = 0; j < words.length; j++) {
      const b = j * DIMS
      let s = 0
      for (let d = 0; d < DIMS; d++) s += vecs[base + d] * vecs[b + d]
      out[j] = s / (127 * 127)
    }
    return out
  }

  const result = $derived.by(() => {
    const w = submitted.trim().toLowerCase()
    if (loading || !w) return null
    if (!index.has(w)) return { missing: true, word: w } as const

    const s = scoresFor(w)!
    const ids = [...s.keys()].filter((j) => words[j] !== w)

    const nearest = [...ids].sort((a, b) => s[b] - s[a]).slice(0, 8)
    // the true opposite: most negative. If the minimum is still positive, there ISN'T one.
    const against = [...ids].sort((a, b) => s[a] - s[b]).slice(0, 8)
    // orthogonal: cosine closest to zero. Off at a right angle — unrelated, not opposed.
    const sideways = [...ids].sort((a, b) => Math.abs(s[a]) - Math.abs(s[b])).slice(0, 12)

    return {
      missing: false as const,
      word: w,
      nearest: nearest.map((j) => ({ w: words[j], s: s[j] })),
      against: against.map((j) => ({ w: words[j], s: s[j] })),
      sideways: sideways.map((j) => ({ w: words[j], s: s[j] })),
      hasOpposite: s[against[0]] < 0,
      floor: s[against[0]]
    }
  })

  function go(e: Event) {
    e.preventDefault()
    submitted = query
  }
</script>

<svelte:head><title>What's farthest from home</title></svelte:head>

<article>
  <h1>What's farthest from home</h1>

  <p class="lede">
    Toni asked what the most <em>orthogonal</em> word to <em>ball</em> was. And then, almost in passing,
    asked the real one: <em>I need to know what's farthest from home.</em>
  </p>

  <p>
    There are two questions hiding in that, and they have different answers.
    The <strong>opposite</strong> of a word is the one that points hardest <em>against</em> it.
    The <strong>farthest</strong> from a word is the one that has nothing to do with it at all —
    off at a right angle, neither for nor against.
  </p>

  <p class="warn">
    Fair warning, and it's the good part: <strong>antonyms live next door, not far away.</strong>
    <em>Hot</em> and <em>cold</em>, <em>up</em> and <em>down</em>, <em>queer</em> and <em>straight</em> sit
    right beside each other here — because this measures what a word is <em>about</em>, and opposites are
    about the same thing. They turn up in the same sentences, in the same arguments, doing the same job.
    So the farthest thing from a word is never its enemy. <strong>Its enemy is standing right next to it.</strong>
  </p>

  <form onsubmit={go}>
    <input bind:value={query} spellcheck="false" autocomplete="off" placeholder="a word" />
    <button type="submit">go</button>
  </form>

  <div class="tries">
    {#each ['home', 'queer', 'ball', 'mother', 'god', 'work', 'body'] as w}
      <button class="chip" onclick={() => { query = w; submitted = w }}>{w}</button>
    {/each}
  </div>

  {#if loading}
    <p class="status">loading the word space… (9 MB, once)</p>
  {:else if error}
    <p class="status">{error}</p>
  {:else if result?.missing}
    <p class="status">“{result.word}” isn't in the 30,000 most common words. Try another.</p>
  {:else if result}
    <section class="verdict">
      {#if result.hasOpposite}
        <p>
          <strong>{result.word}</strong> does have an opposite — something in the language leans
          against it. Faintly, but it's there.
        </p>
      {:else}
        <p>
          <strong>There is no opposite of “{result.word}.”</strong>
          The least-similar word in the language is <em>still, faintly, on its side</em>
          ({result.floor.toFixed(3)} — never negative). Nothing points against it.
          So “farthest” can't mean its enemy. It can only mean the thing with
          <em>nothing to do with it at all.</em>
        </p>
      {/if}
    </section>

    <section>
      <h2>Farthest — off at a right angle</h2>
      <p class="sub">Unrelated. Not opposed. This is the real answer.</p>
      <ul class="words big">
        {#each result.sideways as x}<li>{x.w}<span>{x.s.toFixed(3)}</span></li>{/each}
      </ul>
    </section>

    <section class="two">
      <div>
        <h2>Nearest</h2>
        <ul class="words">
          {#each result.nearest as x}<li>{x.w}<span>{x.s.toFixed(2)}</span></li>{/each}
        </ul>
      </div>
      <div>
        <h2>{result.hasOpposite ? 'Most against it' : 'Least on its side'}</h2>
        <ul class="words">
          {#each result.against as x}<li>{x.w}<span>{x.s.toFixed(2)}</span></li>{/each}
        </ul>
      </div>
    </section>
  {/if}

  <hr />
  <p class="foot">
    30,000 words, GloVe 6B (Wikipedia + newswire), 300 dimensions, all of it running in your browser.
    Cosine similarity, not Euclidean distance — Euclidean gives you something antonym-shaped;
    cosine-near-zero gives you the thing that's simply <em>elsewhere</em>.
  </p>
  <p class="foot">
    A correction, in the spirit of the toy: an earlier write-up of this idea said <em>home</em> has no
    opposite — that the number never goes negative. In this GloVe space it does: −0.240. That claim was
    true of the neural embedding it was first checked against, not of language in general — LLM vector
    spaces are anisotropic (everything crowds into a narrow cone, so cosines stay stubbornly positive);
    GloVe's older, plainer geometry spreads out and lets things point against each other. Type
    <em>home</em> above and see for yourself. (One more caveat: the tail end of GloVe's vocabulary has
    some Gigaword sludge
    in it — stray fragments, typos, wire-service junk — so an occasional nonsense word in these lists
    is the corpus talking, not a hidden meaning.)
  </p>
</article>

<style>
  article {
    max-width: 46rem;
    margin: 0 auto;
    padding: 3rem 1.25rem 6rem;
    color: var(--ink, #251a10);
  }
  h1 { font-size: clamp(1.9rem, 5vw, 2.8rem); line-height: 1.1; margin: 0 0 1.5rem; }
  h2 { font-size: 1.05rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--brass, #b87d2a); margin: 2rem 0 0.4rem; }
  p { line-height: 1.65; margin: 0 0 1.1rem; }
  .lede { font-size: 1.15rem; color: var(--ink-mid, #6b5344); }
  .sub { font-size: 0.9rem; color: var(--ink-light, #a08070); margin: 0 0 0.8rem; }
  .warn { border-left: 3px solid var(--coral, #d94f2a); padding-left: 1rem; }
  .status { color: var(--ink-light, #a08070); font-style: italic; }

  form { display: flex; gap: 0.5rem; margin: 2rem 0 0.75rem; }
  input {
    flex: 1; padding: 0.75rem 1rem; font-size: 1.1rem; font-family: inherit;
    border: 1px solid var(--grid, #ede5d8); border-radius: 2px;
    background: var(--paper, #fdfaf6); color: inherit;
  }
  input:focus { outline: 2px solid var(--coral, #d94f2a); outline-offset: -1px; }
  button {
    padding: 0.75rem 1.4rem; font-family: inherit; font-size: 1rem; cursor: pointer;
    border: 1px solid var(--ink, #251a10); background: var(--ink, #251a10); color: var(--cream, #faf7f2);
    border-radius: 2px;
  }
  .tries { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 2rem; }
  .chip {
    padding: 0.3rem 0.7rem; font-size: 0.85rem; background: transparent;
    color: var(--ink-mid, #6b5344); border: 1px solid var(--grid, #ede5d8);
  }
  .chip:hover { border-color: var(--coral, #d94f2a); color: var(--coral, #d94f2a); }

  .verdict {
    background: var(--paper, #fdfaf6); border: 1px solid var(--grid, #ede5d8);
    padding: 1.1rem 1.3rem; margin: 1.5rem 0;
  }
  .verdict p { margin: 0; }

  .words { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .words li {
    display: flex; align-items: baseline; gap: 0.4rem;
    padding: 0.35rem 0.7rem; background: var(--paper, #fdfaf6);
    border: 1px solid var(--grid, #ede5d8);
  }
  .words span { font-size: 0.72rem; color: var(--ink-light, #a08070); font-variant-numeric: tabular-nums; }
  .words.big li { font-size: 1.15rem; border-color: var(--brass, #b87d2a); }

  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media (max-width: 34rem) { .two { grid-template-columns: 1fr; } }

  hr { border: 0; border-top: 1px solid var(--grid, #ede5d8); margin: 3rem 0 1.5rem; }
  .foot { font-size: 0.85rem; color: var(--ink-light, #a08070); }
</style>
