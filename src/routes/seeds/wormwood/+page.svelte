<script lang="ts">
  import { onMount } from 'svelte'

  // ── TYPES ────────────────────────────────────────────────────
  type Phase = 'setup' | 'legacy-write' | 'pc-turn' | 'gm-react' | 'gm-downtime' | 'death'
  type CardType = 'item' | 'threat' | 'drop' | 'environment' | 'blank'

  interface Card {
    id: string
    type: CardType
    text: string
  }

  interface Location {
    id: string
    name: string
    threat: number
    revealed: boolean
    connections: string[]
    deck: Card[]
    x: number
    y: number
  }

  interface Player {
    name: string
    hand: Card[]
    legacy: string
    deaths: number
  }

  // ── STATE ────────────────────────────────────────────────────
  let solo = $state(true)
  let phase = $state<Phase>('setup')
  let players = $state<Player[]>([])
  let currentPCIdx = $state(0)
  let locations = $state<Location[]>([])
  let currentLocationId = $state('')
  let legacyDeck = $state<string[]>([])
  let log = $state<string[]>([])

  // setup form
  let setupNames = $state([''])
  let setupFirstLoc = $state('The Bonfire')

  // legacy writing
  let legacyWriteIdx = $state(0)
  let legacyText = $state('')

  // gm phase tracking
  let gmActed = $state<boolean[]>([])
  let gmDowntimeIdx = $state(1)
  let downtimeStep = $state<'choose' | 'add-location' | 'add-card' | 'done'>('choose')

  // add location form
  let newLocName = $state('')
  let newLocThreat = $state(1)

  // add card form
  let newCardType = $state<CardType>('item')
  let newCardText = $state('')
  let newCardLocation = $state('')

  // writing overlay
  let writingCard = $state<Card | null>(null)
  let writingText = $state('')

  // map SVG drag
  let svgEl = $state<SVGSVGElement | null>(null)
  let dragging = $state<string | null>(null)
  let dragOffset = $state({ x: 0, y: 0 })

  // ── DERIVED ──────────────────────────────────────────────────
  const currentPC = $derived(players[currentPCIdx])
  const currentLoc = $derived(locations.find(l => l.id === currentLocationId))
  const adjacent = $derived(
    currentLoc
      ? currentLoc.connections.map(id => locations.find(l => l.id === id)).filter(Boolean) as Location[]
      : []
  )
  const gmsInOrder = $derived(
    players.map((p, i) => ({ p, i })).filter(({ i }) => i !== currentPCIdx)
  )

  // ── HELPERS ──────────────────────────────────────────────────
  function uid() { return Math.random().toString(36).slice(2, 9) }

  function addLog(msg: string) {
    log = [msg, ...log].slice(0, 60)
  }

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function blankCards(n: number): Card[] {
    return Array.from({ length: n }, () => ({ id: uid(), type: 'blank' as CardType, text: '' }))
  }

  // ── SETUP ────────────────────────────────────────────────────
  function startGame() {
    if (solo) {
      const name = setupNames[0]?.trim() || 'Traveler'
      players = [{ name, hand: [], legacy: '', deaths: 0 }]
    } else {
      if (setupNames.some(n => !n.trim()) || setupNames.length < 2) return
      players = setupNames.map(name => ({ name: name.trim(), hand: [], legacy: '', deaths: 0 }))
    }

    const startLoc: Location = {
      id: uid(),
      name: setupFirstLoc.trim() || 'The Bonfire',
      threat: 0,
      revealed: true,
      connections: [],
      deck: blankCards(4),
      x: 280,
      y: 200,
    }
    locations = [startLoc]
    currentLocationId = startLoc.id

    legacyDeck = shuffle([
      'Something you lost that you cannot name',
      'A vow you made and then broke',
      'The last face you saw before your first death',
      'Something carried forward from before the fire',
      'A title that no longer fits who you became',
      'The weight of a choice you never made',
      'What you were before the curse found you',
      'An oath to someone who no longer remembers',
      'The thing you were searching for when you first came here',
      'A name that still echoes in empty rooms',
      'What you would burn, if you could burn anything',
      'Something you learned from watching someone else die',
    ])

    phase = 'legacy-write'
    legacyWriteIdx = 0
    legacyText = legacyDeck[0]
  }

  function addPlayer() { setupNames = [...setupNames, ''] }
  function removePlayer(i: number) {
    if (setupNames.length <= 2) return
    setupNames = setupNames.filter((_, idx) => idx !== i)
  }

  // ── LEGACY WRITING ───────────────────────────────────────────
  function submitLegacy() {
    const text = legacyText.trim()
    if (!text) return
    players[legacyWriteIdx].legacy = text
    legacyWriteIdx++
    if (legacyWriteIdx >= players.length) {
      phase = 'pc-turn'
      gmActed = players.map(() => false)
      addLog(`The fire dims. ${currentPC.name} descends into the dark.`)
    } else {
      legacyText = legacyDeck[legacyWriteIdx % legacyDeck.length]
    }
  }

  // ── PC TURN ──────────────────────────────────────────────────
  function movePC(locId: string) {
    const loc = locations.find(l => l.id === locId)
    if (!loc) return
    currentLocationId = locId
    if (!loc.revealed) loc.revealed = true
    if (loc.deck.length < 2) loc.deck = [...loc.deck, ...blankCards(3 - loc.deck.length)]
    addLog(`${currentPC.name} moves to ${loc.name} (threat ${loc.threat}).`)
    beginGMReact()
  }

  function pcTakesAction(action: string) {
    if (!action.trim()) return
    addLog(`${currentPC.name}: "${action}"`)
    beginGMReact()
  }

  function beginGMReact() {
    if (solo) {
      // Solo: skip GM reactions, go straight to build phase
      phase = 'gm-downtime'
      gmDowntimeIdx = 0
      downtimeStep = 'choose'
      addLog('What will you leave behind?')
      return
    }
    gmActed = players.map(() => false)
    phase = 'gm-react'
    addLog('GMs may now draw and react.')
  }

  // ── GM REACTIONS ─────────────────────────────────────────────
  function gmDraw(playerIdx: number) {
    const loc = currentLoc
    if (!loc || loc.deck.length === 0) return
    const [card, ...rest] = loc.deck
    loc.deck = rest
    players[playerIdx].hand = [...players[playerIdx].hand, card]
    addLog(`${players[playerIdx].name} draws a card from ${loc.name}.`)
    if (!card.text) {
      writingCard = card
      writingText = ''
    }
  }

  function submitCardText() {
    if (!writingCard || !writingText.trim()) return
    writingCard.text = writingText.trim()
    addLog(`A ${writingCard.type} description is written.`)
    writingCard = null
  }

  function gmSpend(playerIdx: number, cardId: string) {
    const card = players[playerIdx].hand.find(c => c.id === cardId)
    if (!card) return
    players[playerIdx].hand = players[playerIdx].hand.filter(c => c.id !== cardId)
    gmActed[playerIdx] = true
    addLog(`${players[playerIdx].name} spends: "${card.text || `[${card.type}]`}"`)
  }

  function gmSkipReact(playerIdx: number) {
    gmActed[playerIdx] = true
  }

  const allGMsActed = $derived(
    players.every((_, i) => i === currentPCIdx || gmActed[i])
  )

  function proceedToDowntime() {
    phase = 'gm-downtime'
    gmDowntimeIdx = (currentPCIdx + 1) % players.length
    downtimeStep = 'choose'
  }

  // ── GM DOWNTIME ──────────────────────────────────────────────
  function doAddLocation() {
    if (!newLocName.trim()) return
    const from = currentLoc!
    const angle = Math.random() * Math.PI * 2
    const dist = 110 + Math.random() * 70
    const newLoc: Location = {
      id: uid(),
      name: newLocName.trim(),
      threat: newLocThreat,
      revealed: false,
      connections: [from.id],
      deck: blankCards(3),
      x: Math.max(40, Math.min(560, from.x + Math.cos(angle) * dist)),
      y: Math.max(30, Math.min(380, from.y + Math.sin(angle) * dist)),
    }
    from.connections = [...from.connections, newLoc.id]
    locations = [...locations, newLoc]
    addLog(`${players[gmDowntimeIdx].name} reveals a new passage. [${newLoc.name} hidden from PC]`)
    newLocName = ''
    newLocThreat = (currentLoc?.threat ?? 0) + 1
    advanceDowntime()
  }

  function doAddCard() {
    if (!newCardText.trim() || !newCardLocation) return
    const loc = locations.find(l => l.id === newCardLocation)
    if (!loc) return
    loc.deck = shuffle([...loc.deck, { id: uid(), type: newCardType, text: newCardText.trim() }])
    addLog(`${players[gmDowntimeIdx].name} adds a ${newCardType} to ${loc.name}.`)
    newCardText = ''
    newCardLocation = ''
    advanceDowntime()
  }

  function skipDowntime() { advanceDowntime() }

  function advanceDowntime() {
    downtimeStep = 'choose'
    if (solo) {
      phase = 'pc-turn'
      addLog(`— ${currentPC.name} steps forward.`)
      return
    }
    let next = (gmDowntimeIdx + 1) % players.length
    // skip PC
    if (next === currentPCIdx) next = (next + 1) % players.length
    if (next === (currentPCIdx + 1) % players.length && gmDowntimeIdx !== currentPCIdx) {
      // all GMs had downtime — advance PC
      currentPCIdx = (currentPCIdx + 1) % players.length
      phase = 'pc-turn'
      gmActed = players.map(() => false)
      addLog(`— ${currentPC.name} steps forward.`)
    } else {
      gmDowntimeIdx = next
    }
  }

  // ── PC DEATH ─────────────────────────────────────────────────
  function pcDies() {
    const pc = currentPC
    // All hands go to current location
    players.forEach(p => {
      if (currentLoc) currentLoc.deck = shuffle([...currentLoc.deck, ...p.hand])
      p.hand = []
    })
    // Discard all legacies
    players.forEach(p => { p.legacy = '' })
    pc.deaths++
    addLog(`${pc.name} has died. All cards return to ${currentLoc?.name}. All legacies are lost.`)

    // Dead player writes new legacy
    legacyText = `Something that happened, was new, or was learned during ${pc.name}'s run...`
    legacyWriteIdx = currentPCIdx
    phase = 'death'
  }

  function submitDeathLegacy() {
    const text = legacyText.trim()
    if (!text) return
    legacyDeck = shuffle([...legacyDeck, text])
    addLog(`A new legacy is added to the deck.`)
    if (solo) {
      // Solo: draw one legacy for yourself
      players[0].legacy = legacyDeck[0] ?? ''
      legacyDeck = legacyDeck.slice(1)
      phase = 'pc-turn'
      addLog(`${currentPC.name} wakes at the bonfire. Something is different.`)
    } else {
      // Draw one per player + 1, distribute, discard rest
      const drawn = legacyDeck.slice(0, players.length + 1)
      legacyDeck = legacyDeck.slice(players.length + 1)
      players.forEach((p, i) => { p.legacy = drawn[i] ?? '' })
      // PC rotates right of dead player
      currentPCIdx = (currentPCIdx + 1) % players.length
      phase = 'pc-turn'
      gmActed = players.map(() => false)
      addLog(`Legacies redistributed. ${currentPC.name} takes the torch.`)
    }
  }

  // ── MAP DRAG ─────────────────────────────────────────────────
  function startDrag(e: MouseEvent | TouchEvent, locId: string) {
    e.preventDefault()
    dragging = locId
    const pt = 'touches' in e ? e.touches[0] : e
    const loc = locations.find(l => l.id === locId)!
    if (!svgEl) return
    const svgRect = svgEl.getBoundingClientRect()
    dragOffset = { x: pt.clientX - svgRect.left - loc.x, y: pt.clientY - svgRect.top - loc.y }
  }

  function onDrag(e: MouseEvent | TouchEvent) {
    if (!dragging || !svgEl) return
    const pt = 'touches' in e ? e.touches[0] : e
    const svgRect = svgEl.getBoundingClientRect()
    const loc = locations.find(l => l.id === dragging)
    if (loc) {
      loc.x = Math.max(40, Math.min(560, pt.clientX - svgRect.left - dragOffset.x))
      loc.y = Math.max(30, Math.min(370, pt.clientY - svgRect.top - dragOffset.y))
      locations = [...locations]
    }
  }

  function endDrag() { dragging = null }

  // ── PERSIST ──────────────────────────────────────────────────
  onMount(() => {
    const saved = localStorage.getItem('age-of-fire-v1')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        solo = s.solo ?? false
        phase = s.phase; players = s.players; currentPCIdx = s.currentPCIdx
        locations = s.locations; currentLocationId = s.currentLocationId
        legacyDeck = s.legacyDeck; log = s.log
        gmActed = s.gmActed ?? players.map(() => false)
        gmDowntimeIdx = s.gmDowntimeIdx ?? 1
        legacyWriteIdx = s.legacyWriteIdx ?? 0
        legacyText = s.legacyText ?? ''
      } catch {}
    }
  })

  $effect(() => {
    if (phase !== 'setup') {
      localStorage.setItem('age-of-fire-v1', JSON.stringify({
        solo, phase, players, currentPCIdx, locations, currentLocationId,
        legacyDeck, log, gmActed, gmDowntimeIdx, legacyWriteIdx, legacyText
      }))
    }
  })

  function resetGame() {
    localStorage.removeItem('age-of-fire-v1')
    phase = 'setup'; players = []; locations = []; log = []
    setupNames = solo ? [''] : ['', '']; setupFirstLoc = 'The Bonfire'
  }
</script>

<!-- ── WRITING OVERLAY ──────────────────────────────────────── -->
{#if writingCard}
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="overlay" onclick={() => {}}>
  <div class="modal">
    <p class="modal-prompt">Write a Dark Souls style description for this <em>{writingCard.type}</em>.</p>
    <p class="modal-hint">Speak of function, origin, loss. Never explain too much.</p>
    <textarea bind:value={writingText} rows="5" placeholder="Carved from the bones of something that lived before fire..."></textarea>
    <div class="modal-actions">
      <button onclick={submitCardText} disabled={!writingText.trim()}>inscribe</button>
      <button class="ghost" onclick={() => { writingCard = null }}>later</button>
    </div>
  </div>
</div>
{/if}

<!-- ── SETUP ──────────────────────────────────────────────────── -->
{#if phase === 'setup'}
<div class="screen setup">
  <h1>Age of Fire</h1>

  <div class="mode-toggle">
    <button class="mode-btn" class:active={solo} onclick={() => { solo = true; setupNames = [''] }}>solo</button>
    <button class="mode-btn" class:active={!solo} onclick={() => { solo = false; setupNames = ['', ''] }}>together</button>
  </div>

  {#if solo}
    <p class="subtitle">You build the dungeon. You walk through it. You write what you find.</p>
    <div class="how-it-works">
      <p>Name locations. Write item descriptions. Explore what you made. When you die, everything you carried returns to where you fell. Your legacy scatters into the deck. You wake at the bonfire carrying someone else's memory — maybe your own.</p>
    </div>
  {:else}
    <p class="subtitle">One of you explores. Everyone else is the dungeon.</p>
    <div class="how-it-works">
      <p>Take turns as the PC — the one walking in the dark. Everyone else is a GM: drawing cards, writing what the PC finds, shaping the world around them. Items and threats are described when discovered, not before.</p>
      <p>You will die. When you do, everything you carried returns to where you fell. Your legacy — a fragment of who you were — scatters into the deck. Someone else will find it next time.</p>
    </div>
  {/if}

  <div class="setup-section">
    <label class="field-label" for="first-loc">First Location</label>
    <input id="first-loc" bind:value={setupFirstLoc} placeholder="The Bonfire" />
  </div>

  {#if solo}
    <div class="setup-section">
      <label class="field-label" for="solo-name">Your name</label>
      <input id="solo-name" bind:value={setupNames[0]} placeholder="Traveler" aria-label="Your name" />
    </div>
  {:else}
    <div class="setup-section">
      <label class="field-label">Players</label>
      {#each setupNames as _, i}
      <div class="player-row">
        <input bind:value={setupNames[i]} placeholder="Player {i + 1}" aria-label="Player {i + 1} name" />
        {#if setupNames.length > 2}
          <button class="ghost small" onclick={() => removePlayer(i)} aria-label="Remove player {i + 1}">×</button>
        {/if}
      </div>
      {/each}
      <button class="ghost small" onclick={addPlayer}>+ add player</button>
    </div>
  {/if}

  <button class="primary" onclick={startGame} disabled={solo ? false : setupNames.some(n => !n.trim())}>
    light the bonfire
  </button>
</div>

<!-- ── LEGACY WRITE ──────────────────────────────────────────── -->
{:else if phase === 'legacy-write'}
<div class="screen legacy">
  <div class="phase-label">Legacy</div>
  <h2>{players[legacyWriteIdx]?.name}, write your legacy.</h2>
  <p class="legacy-prompt-hint">A legacy is what remains of who you were before. Use the prompt below or replace it entirely.</p>
  <textarea bind:value={legacyText} rows="4"></textarea>
  <p class="player-count">{legacyWriteIdx + 1} of {players.length}</p>
  <button class="primary" onclick={submitLegacy} disabled={!legacyText.trim()}>seal it</button>
</div>

<!-- ── DEATH ─────────────────────────────────────────────────── -->
{:else if phase === 'death'}
<div class="screen legacy death-screen">
  <div class="phase-label death">Death</div>
  <h2>{players[legacyWriteIdx]?.name}, write a new legacy.</h2>
  <p class="legacy-prompt-hint">Something that happened, was new, or was learned during this run.</p>
  <textarea bind:value={legacyText} rows="4" placeholder="Write what will be remembered..."></textarea>
  <button class="primary" onclick={submitDeathLegacy} disabled={!legacyText.trim()}>add to the deck</button>
</div>

<!-- ── MAIN GAME ──────────────────────────────────────────────── -->
{:else}
<div class="game">

  <!-- MAP -->
  <div class="map-panel">
    <div class="map-header">
      <span class="phase-label">{phase === 'pc-turn' ? (solo ? 'Explore' : 'PC Turn') : phase === 'gm-react' ? 'GM Reactions' : (solo ? 'Build' : 'GM Downtime')}</span>
      <span class="pc-name">PC: {currentPC?.name}</span>
    </div>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <svg
      bind:this={svgEl}
      class="map-svg"
      viewBox="0 0 600 400"
      onmousemove={onDrag}
      ontouchmove={onDrag}
      onmouseup={endDrag}
      ontouchend={endDrag}
      role="img"
      aria-label="Dungeon map"
    >
      <!-- connections -->
      {#each locations as loc}
        {#each loc.connections as connId}
          {#if locations.find(l => l.id === connId)}
            {@const other = locations.find(l => l.id === connId)!}
            <line x1={loc.x} y1={loc.y} x2={other.x} y2={other.y} class="conn-line" />
          {/if}
        {/each}
      {/each}

      <!-- nodes -->
      {#each locations as loc}
        {@const isCurrent = loc.id === currentLocationId}
        {@const isAdjacent = adjacent.some(a => a.id === loc.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g
          class="loc-node {isCurrent ? 'current' : ''} {isAdjacent ? 'adjacent' : ''} {!loc.revealed ? 'hidden' : ''}"
          onmousedown={(e) => startDrag(e, loc.id)}
          ontouchstart={(e) => startDrag(e, loc.id)}
        >
          <circle cx={loc.x} cy={loc.y} r={isCurrent ? 18 : 13} />
          <text x={loc.x} y={loc.y + (isCurrent ? 30 : 24)} class="loc-label">
            {loc.revealed ? loc.name : '?'}
          </text>
          {#if loc.revealed}
            <text x={loc.x} y={loc.y + 5} class="threat-num">{loc.threat}</text>
          {/if}
        </g>
      {/each}
    </svg>
  </div>

  <!-- ACTION PANEL -->
  <div class="action-panel">

    {#if phase === 'pc-turn'}
    <!-- PC TURN -->
    <div class="panel-section">
      <div class="field-label">Current Location</div>
      <div class="loc-name">{currentLoc?.name} <span class="threat">threat {currentLoc?.threat}</span></div>
    </div>

    {#if adjacent.length > 0}
    <div class="panel-section">
      <div class="field-label">Move to</div>
      <div class="move-list">
        {#each adjacent as loc}
          <button class="loc-btn" onclick={() => movePC(loc.id)}>
            {loc.revealed ? loc.name : '???'} <span class="threat">→</span>
          </button>
        {/each}
      </div>
    </div>
    {/if}

    {#if solo && currentLoc && currentLoc.deck.length > 0}
    <div class="panel-section">
      <button onclick={() => gmDraw(0)}>
        draw from {currentLoc.name} ({currentLoc.deck.length})
      </button>
    </div>
    {/if}

    {#if solo && players[0]?.hand.length > 0}
    <div class="panel-section">
      <div class="field-label">In hand</div>
      <div class="hand">
        {#each players[0].hand as card}
          <div class="card-display">
            <span class="card-type">{card.type}</span>
            <span class="card-text">{card.text || '(blank)'}</span>
          </div>
        {/each}
      </div>
    </div>
    {/if}

    <div class="panel-section">
      <div class="field-label">{solo ? 'Journal' : 'Take Action'}</div>
      <div class="action-row">
        <input id="pc-action" type="text" placeholder={solo ? 'What happens here...' : 'Describe what you do...'} onkeydown={(e) => { if (e.key === 'Enter') { pcTakesAction((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = '' }}} />
        <button onclick={(e) => { const inp = document.getElementById('pc-action') as HTMLInputElement; pcTakesAction(inp.value); inp.value = '' }}>→</button>
      </div>
    </div>

    <div class="panel-section">
      <button class="danger" onclick={pcDies}>{solo ? 'You died' : 'PC Dies'}</button>
    </div>

    {:else if phase === 'gm-react'}
    <!-- GM REACTIONS -->
    <div class="panel-section">
      <div class="field-label">GMs — Draw &amp; React</div>
      <p class="hint">Each GM draws a card from the current location. Spend a card to make a move.</p>
    </div>

    {#each gmsInOrder as { p, i }}
    <div class="gm-row {gmActed[i] ? 'acted' : ''}">
      <div class="gm-name">{p.name} {gmActed[i] ? '✓' : ''}</div>
      <div class="gm-actions">
        {#if !gmActed[i]}
          <button class="small" onclick={() => gmDraw(i)} disabled={!currentLoc || currentLoc.deck.length === 0}>
            draw ({currentLoc?.deck.length ?? 0})
          </button>
        {/if}
        <div class="hand">
          {#each p.hand as card}
            <button class="card-btn" onclick={() => gmSpend(i, card.id)} title="Spend this card">
              <span class="card-type">{card.type}</span>
              <span class="card-text">{card.text || '(blank)'}</span>
            </button>
          {/each}
        </div>
        {#if !gmActed[i]}
          <button class="ghost small" onclick={() => gmSkipReact(i)}>pass</button>
        {/if}
      </div>
    </div>
    {/each}

    {#if allGMsActed}
      <button class="primary" onclick={proceedToDowntime}>proceed to downtime →</button>
    {/if}

    {:else if phase === 'gm-downtime'}
    <!-- GM DOWNTIME / SOLO BUILD -->
    <div class="panel-section">
      <div class="field-label">{solo ? 'Build' : `Downtime — ${players[gmDowntimeIdx]?.name}`}</div>
      <p class="hint">{solo ? 'Add to the dungeon, or move on.' : 'Take one action, or skip.'}</p>
    </div>

    {#if downtimeStep === 'choose'}
      <div class="downtime-choices">
        <button onclick={() => { downtimeStep = 'add-location'; newLocThreat = (currentLoc?.threat ?? 0) + 1 }}>Add Location</button>
        <button onclick={() => { downtimeStep = 'add-card'; newCardLocation = currentLocationId }}>Add Card</button>
        <button class="ghost" onclick={skipDowntime}>skip</button>
      </div>

    {:else if downtimeStep === 'add-location'}
      <div class="form">
        <label class="field-label">Location Name (hidden from PC)</label>
        <input bind:value={newLocName} placeholder="The Iron Keep..." />
        <label class="field-label">Threat (min {(currentLoc?.threat ?? 0) + 1})</label>
        <input type="number" bind:value={newLocThreat} min={(currentLoc?.threat ?? 0) + 1} />
        <div class="form-actions">
          <button onclick={doAddLocation} disabled={!newLocName.trim()}>place it</button>
          <button class="ghost" onclick={() => downtimeStep = 'choose'}>back</button>
        </div>
      </div>

    {:else if downtimeStep === 'add-card'}
      <div class="form">
        <label class="field-label">Card Type</label>
        <select bind:value={newCardType}>
          <option value="item">Item</option>
          <option value="threat">Threat</option>
          <option value="drop">Drop</option>
          <option value="environment">Environment</option>
        </select>
        <label class="field-label">Description</label>
        <textarea bind:value={newCardText} rows="3" placeholder="Write a Dark Souls style description..."></textarea>
        <label class="field-label">Shuffle into</label>
        <select bind:value={newCardLocation}>
          <option value="">— choose location —</option>
          {#each locations.filter(l => l.revealed) as loc}
            <option value={loc.id}>{loc.name}</option>
          {/each}
        </select>
        <div class="form-actions">
          <button onclick={doAddCard} disabled={!newCardText.trim() || !newCardLocation}>shuffle in</button>
          <button class="ghost" onclick={() => downtimeStep = 'choose'}>back</button>
        </div>
      </div>
    {/if}
    {/if}

    <!-- PLAYER LEGACIES -->
    <div class="panel-section legacy-section">
      <div class="field-label">Legacies</div>
      {#each players as p, i}
        <div class="legacy-row {i === currentPCIdx ? 'is-pc' : ''}">
          <span class="legacy-name">{p.name}{i === currentPCIdx ? ' (PC)' : ''}</span>
          <span class="legacy-text">{p.legacy || '—'}</span>
          {#if p.deaths > 0}<span class="deaths">✝{p.deaths}</span>{/if}
        </div>
      {/each}
    </div>

    <!-- LOG -->
    <div class="log-section">
      <div class="field-label">Log</div>
      <ul class="log">
        {#each log.slice(0, 8) as entry}
          <li>{entry}</li>
        {/each}
      </ul>
    </div>

    <button class="ghost small reset-btn" onclick={resetGame}>reset</button>
  </div>
</div>
{/if}

<style>
  :global(body) { background: #0e0c0a; }

  /* ── SHARED ─────────────────────────────────────────── */
  .phase-label {
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #d4891a;
    margin-bottom: 0.5rem;
    display: block;
  }
  .phase-label.death { color: #8b2020; }

  input, textarea, select {
    width: 100%;
    background: #1a1410;
    border: 1px solid #3d2b1a;
    color: #c4a882;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    font-family: inherit;
    border-radius: 2px;
    margin-bottom: 0.75rem;
    box-sizing: border-box;
  }
  textarea { resize: vertical; line-height: 1.6; font-family: Georgia, serif; }
  input::placeholder, textarea::placeholder { color: #4a3828; }

  button {
    background: #2a1e12;
    border: 1px solid #5a3d20;
    color: #c4a882;
    padding: 0.45rem 1rem;
    font-size: 0.85rem;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.1s;
    font-family: inherit;
  }
  button:hover { background: #3a2a18; border-color: #d4891a; }
  button:disabled { opacity: 0.35; cursor: default; }
  button.primary { background: #3a2200; border-color: #d4891a; color: #f0c870; }
  button.primary:hover { background: #4a2e00; }
  button.ghost { background: transparent; border-color: #3d2b1a; color: #7a6550; }
  button.ghost:hover { color: #c4a882; border-color: #5a3d20; }
  button.danger { background: #2a0808; border-color: #8b2020; color: #c47070; }
  button.danger:hover { background: #3a1010; border-color: #c04040; }
  button.small { padding: 0.3rem 0.6rem; font-size: 0.78rem; }

  .field-label {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7a6550;
    margin-bottom: 0.4rem;
    display: block;
  }

  /* ── OVERLAY ─────────────────────────────────────────── */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(8, 6, 4, 0.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
  }
  .modal {
    background: #110e0a;
    border: 1px solid #5a3d20;
    padding: 2rem;
    max-width: 480px;
    width: 90%;
  }
  .modal-prompt { color: #c4a882; margin-bottom: 0.5rem; }
  .modal-hint { font-size: 0.82rem; color: #7a6550; margin-bottom: 1rem; font-style: italic; }
  .modal-actions { display: flex; gap: 0.75rem; margin-top: 0.75rem; }

  /* ── SETUP ──────────────────────────────────────────── */
  .screen {
    max-width: 480px;
    margin: 4rem auto;
    padding: 0 2rem;
    color: #c4a882;
  }
  .screen h1 {
    font-size: 2.2rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    color: #d4891a;
    margin: 0 0 0.5rem;
  }
  .mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
  }
  .mode-btn {
    flex: 1;
    padding: 0.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid #3d2b1a;
    color: #5a4030;
    cursor: pointer;
    transition: all 0.15s;
  }
  .mode-btn:first-child { border-radius: 2px 0 0 2px; }
  .mode-btn:last-child { border-radius: 0 2px 2px 0; border-left: none; }
  .mode-btn.active {
    background: #2a1800;
    border-color: #d4891a;
    color: #f0c870;
  }
  .subtitle {
    color: #7a6550;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    font-style: italic;
  }
  .how-it-works {
    border-left: 2px solid #3a2e22;
    padding-left: 1rem;
    margin-bottom: 2rem;
  }
  .how-it-works p {
    font-size: 0.82rem;
    line-height: 1.7;
    color: #7a6550;
    margin: 0 0 0.6rem;
  }
  .how-it-works p:last-child { margin-bottom: 0; }
  .setup-section { margin-bottom: 1.5rem; }
  .player-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  .player-row input { margin: 0; }

  /* ── LEGACY ─────────────────────────────────────────── */
  .legacy h2 { font-weight: 400; color: #c4a882; margin: 0 0 0.75rem; font-size: 1.3rem; }
  .legacy-prompt-hint { font-size: 0.85rem; color: #7a6550; margin-bottom: 1rem; font-style: italic; }
  .player-count { font-size: 0.78rem; color: #5a4030; margin-bottom: 0.75rem; }
  .death-screen h2 { color: #c47070; }

  /* ── GAME ───────────────────────────────────────────── */
  .game {
    display: grid;
    grid-template-columns: 1fr 360px;
    height: 100svh;
    color: #c4a882;
    overflow: hidden;
  }

  /* MAP */
  .map-panel {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #2a1e12;
    overflow: hidden;
  }
  .map-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #2a1e12;
  }
  .pc-name { font-size: 0.8rem; color: #d4891a; }

  .map-svg {
    flex: 1;
    width: 100%;
    background: #0e0c0a;
    cursor: default;
    user-select: none;
  }

  .conn-line {
    stroke: #2a1e12;
    stroke-width: 1.5;
  }

  .loc-node circle {
    fill: #1a1410;
    stroke: #3d2b1a;
    stroke-width: 1.5;
    cursor: grab;
    transition: fill 0.15s, stroke 0.15s;
  }
  .loc-node.current circle { fill: #2a1800; stroke: #d4891a; stroke-width: 2; }
  .loc-node.adjacent circle { stroke: #8a6030; }
  .loc-node.hidden circle { stroke: #2a2020; fill: #120e0c; }
  .loc-node:hover circle { stroke: #8a6030; }

  .loc-label {
    fill: #9a8070;
    font-size: 9px;
    text-anchor: middle;
    pointer-events: none;
  }
  .loc-node.current .loc-label { fill: #d4891a; font-size: 10px; }

  .threat-num {
    fill: #8b2020;
    font-size: 8px;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
  }

  /* ACTION PANEL */
  .action-panel {
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .panel-section { margin-bottom: 1.25rem; }
  .loc-name { font-size: 1.1rem; color: #d4891a; margin-bottom: 0.25rem; }
  .threat { font-size: 0.75rem; color: #8b2020; }
  .hint { font-size: 0.8rem; color: #5a4030; font-style: italic; line-height: 1.5; margin-bottom: 0.75rem; }

  .move-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
  .loc-btn { text-align: left; }

  .action-row { display: flex; gap: 0.5rem; }
  .action-row input { margin: 0; flex: 1; }
  .action-row button { margin: 0; }

  /* GM rows */
  .gm-row {
    border: 1px solid #2a1e12;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    transition: opacity 0.2s;
  }
  .gm-row.acted { opacity: 0.45; }
  .gm-name { font-size: 0.8rem; color: #7a6550; margin-bottom: 0.5rem; }
  .gm-actions { display: flex; flex-direction: column; gap: 0.4rem; }
  .hand { display: flex; flex-direction: column; gap: 0.3rem; }
  .card-btn {
    text-align: left;
    padding: 0.4rem 0.6rem;
    border-color: #3d2b1a;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  .card-btn:hover { border-color: #d4891a; }
  .card-type { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #7a6550; }
  .card-text { font-size: 0.82rem; font-family: Georgia, serif; color: #8a9ba8; line-height: 1.4; }
  .card-display {
    padding: 0.4rem 0.6rem;
    border: 1px solid #2a1e12;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    margin-bottom: 0.3rem;
  }

  /* Downtime */
  .downtime-choices { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
  .form { display: flex; flex-direction: column; }
  .form-actions { display: flex; gap: 0.5rem; }

  /* Legacies */
  .legacy-section { border-top: 1px solid #1a1410; padding-top: 1rem; margin-top: auto; }
  .legacy-row { margin-bottom: 0.5rem; display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
  .legacy-row.is-pc .legacy-name { color: #d4891a; }
  .legacy-name { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #5a4030; min-width: 80px; }
  .legacy-text { font-size: 0.82rem; font-family: Georgia, serif; color: #8a9ba8; font-style: italic; flex: 1; }
  .deaths { font-size: 0.7rem; color: #8b2020; }

  /* Log */
  .log-section { border-top: 1px solid #1a1410; padding-top: 0.75rem; margin-top: 0.5rem; }
  .log { list-style: none; padding: 0; margin: 0; }
  .log li {
    font-size: 0.78rem;
    color: #5a4030;
    padding: 0.2rem 0;
    border-bottom: 1px solid #1a1410;
    line-height: 1.4;
  }
  .log li:first-child { color: #9a8070; }

  .reset-btn { margin-top: 1rem; align-self: flex-start; }

  /* Mobile */
  @media (max-width: 700px) {
    .game { grid-template-columns: 1fr; grid-template-rows: 240px 1fr; }
    .map-panel { border-right: none; border-bottom: 1px solid #2a1e12; }
  }
</style>
