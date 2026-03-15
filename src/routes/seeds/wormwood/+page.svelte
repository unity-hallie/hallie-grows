<script lang="ts">
  import { onMount } from 'svelte'

  let consented = $state(false)
  let gender = $state('')
  let customGender = $state('')
  let monsterName = $state('')
  let customMonsterName = $state('')
  let monsterGoal = $state('')
  let customMonsterGoal = $state('')

  let canvas: HTMLCanvasElement
  let drawing = $state(false)
  let hasDrawn = $state(false)

  const genders = ['I don\'t care', 'male', 'female', 'transfemme', 'metabinary', 'fluid', 'queer', 'nonbinary', 'butch', 'femme', 'woman', 'man', 'dunno', 'agender', 'negapunk', 'something else']
  const monsterNames = ['Azrael', 'Pazuzu', 'Leviathan', 'Theodora', 'Moxie', 'Scylla', 'Medusa', 'Brendon']
  const monsterGoals = ['mete out justice', 'punish unbelievers', 'build a new world', 'reconcile warring people', 'burn it all down', 'something else']

  onMount(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = '#1a1208'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    let last = { x: 0, y: 0 }

    function pos(e: MouseEvent | Touch) {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    canvas.addEventListener('mousedown', e => {
      drawing = true
      last = pos(e)
    })
    canvas.addEventListener('mousemove', e => {
      if (!drawing) return
      const p = pos(e)
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      last = p
      hasDrawn = true
    })
    canvas.addEventListener('mouseup', () => { drawing = false })
    canvas.addEventListener('mouseleave', () => { drawing = false })

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      drawing = true
      last = pos(e.touches[0])
    }, { passive: false })
    canvas.addEventListener('touchmove', e => {
      e.preventDefault()
      if (!drawing) return
      const p = pos(e.touches[0])
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      last = p
      hasDrawn = true
    }, { passive: false })
    canvas.addEventListener('touchend', () => { drawing = false })
  })

  function clearCanvas() {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasDrawn = false
  }

  const displayGender = $derived(gender === 'something else' ? customGender : gender)
  const displayName = $derived(monsterName === 'something else' ? customMonsterName : monsterName)
  const displayGoal = $derived(monsterGoal === 'something else' ? customMonsterGoal : monsterGoal)
</script>

<svelte:head>
  <title>The Name of the Star Is Called Wormwood</title>
</svelte:head>

<article>

  <h1>The Name of the Star Is Called Wormwood</h1>
  <p class="byline">a game by Hallie Larsson</p>

  <p>We're going to play a game together. Well, you're going to play a game and I'm going to help you by setting down some rules beforehand. (Which is still sortof playing? To me at least?)</p>

  <p>First we're going to decide who you are.</p>

  <p>OH WAIT I forgot a thing.</p>

  <p>Before we play, I'm going to ask for your consent to continue. This game touches on themes of self, gender, religion, and apocalypse. I'll add more stuff to this later if I think of it.</p>

  <p>A few times through the text, I might not tell you everything up front because I think it might make a better experience for you. I'm going to try hard never to lie to you outright and I really think if you suspend disbelief you'll have an OK time.</p>

  <p>For example, we both know that when I said "I forgot a thing" above I could have totally gone back and changed it. I presented the truth that way in order to help convey a feeling and a tone of conversationality, even if it wasn't a literal truth at that moment.</p>

  <p>If you get badly t-boned, please do tell me — hopefully I can figure out a way to make it better for other people who might play this later? Or if you find this in, like, 10 years and feel like you know how you would do it better? PLEASE do it. Take this and remix it.</p>

  <p>ANYWAY.</p>

  <div class="consent-block">
    <p class="prompt">Do You Consent to Playing?</p>
    {#if !consented}
      <div class="consent-buttons">
        <button class="yes" onclick={() => consented = true}>YES</button>
        <button class="no" onclick={() => window.history.back()}>NO</button>
      </div>
      <p class="no-note">If you selected NO, I can't exactly stop you, but know that I really don't want you playing the game without consenting to it or feeling forced to consent. If someone is standing over your shoulder looking at you with, like, a "C'MON" face on, even if it's a figure of authority in your life, even if it's me, I'd like them to read this next sentence:</p>
      <p class="no-shout">DON'T FORCE PEOPLE TO PLAY THIS. IT NEGATES THE ENTIRE PURPOSE.</p>
    {:else}
      <p class="approved">OK! You selected YES. Keep reading with my approval!</p>
    {/if}
  </div>

  {#if consented}
  <hr />

  <p>I'm about to list out a bunch of genders. Pick the one you want to try to embody during our game. If you don't care, that's cool. There's an option for that. If there's not something there that feels like it fits? Feel free to put something else in. My lens is very gender-focused these days and I'm leaning into it.</p>

  <div class="field-block">
    <p class="field-label">CURRENT GENDER</p>
    <div class="chips">
      {#each genders as g}
        <button
          class="chip"
          class:selected={gender === g}
          onclick={() => gender = g}
        >{g}</button>
      {/each}
    </div>
    {#if gender === 'something else'}
      <input type="text" bind:value={customGender} placeholder="write it in" class="text-input" />
    {/if}
    {#if displayGender}
      <p class="filled">you are: <em>{displayGender}</em></p>
    {/if}
  </div>

  <p>OK, now that, maybe, we know a little more about you, let's start fleshing out the place we're playing in.</p>

  <p>This is a game about the apocalypse, like a christian-style apocalypse with angels and demons and disappearing and totalitarianism and all that good bad stuff. You can add your own spin on it, though, and change up the imagery if you want! Here, I'll show you what I mean.</p>

  <p>Draw a picture of something badass that happens in your version of the apocalypse but might not be in someone else's? Maybe it's a rad rainbow angel, or a unicorn with a hoagie for a horn? Don't worry about how well you draw. You only show this to the people you want to.</p>

  <p>OH. Or, if you don't like to draw, you can totally skip it.</p>

  <div class="canvas-block">
    <canvas bind:this={canvas} width="480" height="320"></canvas>
    {#if hasDrawn}
      <button class="clear-btn" onclick={clearCanvas}>clear</button>
    {/if}
  </div>

  <p>See? You can totally customize this apocalypse. That is totally going to show up later.</p>

  <p>Which reminds me, can you give it a name?</p>

  <div class="field-block">
    <p class="field-label">MONSTER NAME</p>
    <div class="chips">
      {#each monsterNames as n}
        <button
          class="chip"
          class:selected={monsterName === n}
          onclick={() => monsterName = n}
        >{n}</button>
      {/each}
      <button
        class="chip"
        class:selected={monsterName === 'something else'}
        onclick={() => monsterName = 'something else'}
      >something else</button>
    </div>
    {#if monsterName === 'something else'}
      <input type="text" bind:value={customMonsterName} placeholder="name your monster" class="text-input" />
    {/if}
    {#if displayName}
      <p class="filled">your monster is called: <em>{displayName}</em></p>
    {/if}
  </div>

  <p>Great. And can you please describe what it wants? That way we can figure out how it might act in different circumstances.</p>

  <div class="field-block">
    <p class="field-label">MONSTER GOAL</p>
    <p class="field-sub">It's instinct is to:</p>
    <div class="chips">
      {#each monsterGoals as g}
        <button
          class="chip"
          class:selected={monsterGoal === g}
          onclick={() => monsterGoal = g}
        >{g}</button>
      {/each}
    </div>
    {#if monsterGoal === 'something else'}
      <input type="text" bind:value={customMonsterGoal} placeholder="what does it want?" class="text-input" />
    {/if}
    {#if displayGoal}
      <p class="filled"><em>{displayName || 'your monster'}</em> wants to: <em>{displayGoal}</em></p>
    {/if}
  </div>

  <p>Thank you!!</p>

  <p>OK. So now that we have some flavor, let's figure out a little bit about who you are and WHERE you are.</p>

  <p>Where this happens isn't super important, but it sort of is. From where I'm writing, I'm picturing a modern world a lot like the one that exists around me circa 2019 in Spring, in Maine. The weather is just turning nice. There's a good mix of industry and rural and wilderness and working class and people with lots and lots of money.</p>

  <div class="sketch-note">
    <p>— this is where the game stops, for now. it's a sketch. 2019. if you find this and want to finish it, please do. take it and remix it. that's always been the point. —</p>
    <p class="sketch-attribution">— Hallie Larsson</p>
  </div>
  {/if}

</article>

<style>
  article {
    max-width: 580px;
    margin: 0 auto;
    padding: 4rem 2rem 8rem;
    font-size: 1.05rem;
    line-height: 1.8;
    color: #1a1208;
  }

  h1 {
    font-size: 1.3rem;
    font-weight: 400;
    line-height: 1.4;
    margin: 0 0 0.25rem;
  }

  .byline {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    opacity: 0.45;
    margin: 0 0 3rem;
    font-style: normal;
  }

  p { margin: 0 0 1.4rem; }

  hr {
    border: none;
    border-top: 1px solid rgba(140, 120, 100, 0.2);
    margin: 2.5rem 0;
  }

  /* consent */
  .consent-block { margin: 2rem 0; }
  .prompt {
    font-weight: 500;
    letter-spacing: 0.04em;
    margin-bottom: 1rem;
  }
  .consent-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .yes, .no {
    font-family: inherit;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    padding: 0.5rem 1.5rem;
    border: 1px solid currentColor;
    background: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .yes { color: #2a1f0f; }
  .yes:hover { background: #2a1f0f; color: #f5f2ec; }
  .no { color: #8a7a6a; }
  .no:hover { background: #8a7a6a; color: #f5f2ec; }
  .no-note { font-size: 0.9rem; opacity: 0.7; }
  .no-shout {
    font-size: 0.85rem;
    letter-spacing: 0.06em;
    font-weight: 500;
    margin-top: 0.5rem;
  }
  .approved { font-style: italic; opacity: 0.6; font-size: 0.95rem; }

  /* fields */
  .field-block { margin: 1.5rem 0 2rem; }
  .field-label {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.45;
    margin: 0 0 0.75rem;
  }
  .field-sub {
    font-size: 0.9rem;
    opacity: 0.6;
    margin: 0 0 0.75rem;
    font-style: italic;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }
  .chip {
    font-family: inherit;
    font-size: 0.82rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid rgba(140, 120, 100, 0.3);
    background: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.65;
    transition: all 0.12s;
    border-radius: 0;
  }
  .chip:hover { opacity: 1; border-color: rgba(140, 120, 100, 0.7); }
  .chip.selected {
    opacity: 1;
    background: #2a1f0f;
    color: #f5f2ec;
    border-color: #2a1f0f;
  }
  .text-input {
    font-family: inherit;
    font-size: 0.95rem;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(140, 120, 100, 0.4);
    padding: 0.25rem 0;
    width: 100%;
    color: inherit;
    margin-top: 0.5rem;
  }
  .text-input:focus { outline: none; border-bottom-color: #2a1f0f; }
  .filled {
    font-size: 0.9rem;
    opacity: 0.55;
    margin: 0.5rem 0 0;
    font-style: italic;
  }

  /* canvas */
  .canvas-block {
    margin: 1.5rem 0;
    position: relative;
  }
  canvas {
    display: block;
    width: 100%;
    max-width: 480px;
    height: auto;
    border: 1px solid rgba(140, 120, 100, 0.25);
    background: rgba(255,255,255,0.4);
    cursor: crosshair;
    touch-action: none;
  }
  .clear-btn {
    font-family: inherit;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    color: #8a7a6a;
    padding: 0.4rem 0;
    opacity: 0.6;
  }
  .clear-btn:hover { opacity: 1; }

  /* sketch note */
  .sketch-note {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(140, 120, 100, 0.15);
    font-size: 0.85rem;
    line-height: 1.7;
    opacity: 0.45;
    font-style: italic;
  }
  .sketch-attribution {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
</style>
