<script lang="ts">
  import { shaderParams, DEFAULTS } from '$lib/stores/shader.js'

  // ── shader controls ────────────────────────────────────────
  let grain     = $state(DEFAULTS.grainAmp)
  let grainScale= $state(DEFAULTS.grainScale)
  let laid      = $state(true)
  let drift     = $state(DEFAULTS.driftSpeed)

  $effect(() => {
    shaderParams.set({
      grainScale,
      grainAmp:   grain,
      laidAmp:    laid ? DEFAULTS.laidAmp : 0,
      driftSpeed: drift,
    })
  })

  // ── graph diagram ──────────────────────────────────────────
  let hoveredNode = $state<string | null>(null)

  const gnodes = [
    { id: 'pied-piper',   label: 'The Pied Piper',    kind: 'post',      x: 160, y: 80  },
    { id: 'sec-0',        label: 'section 0',          kind: 'section',   x: 60,  y: 200 },
    { id: 'sec-1',        label: 'section 1',          kind: 'section',   x: 160, y: 220 },
    { id: 'sec-2',        label: 'section 2',          kind: 'section',   x: 260, y: 200 },
    { id: 'meaning',      label: "Why I'm Wrong",      kind: 'explainer', x: 420, y: 80  },
    { id: 'pied-piper-2', label: 'The Pied Piper',     kind: 'post',      x: 160, y: 80  },
  ]
  const gedges = [
    { from: 'pied-piper', to: 'sec-0', label: 'HAS_SECTION' },
    { from: 'pied-piper', to: 'sec-1', label: 'HAS_SECTION' },
    { from: 'pied-piper', to: 'sec-2', label: 'HAS_SECTION' },
    { from: 'pied-piper', to: 'meaning', label: 'REFERENCES' },
  ]
  const gnodes2 = [
    { id: 'pied-piper', label: 'The Pied Piper', kind: 'post',      x: 160, y: 80  },
    { id: 'sec-0',      label: 'section 0',       kind: 'section',  x: 60,  y: 200 },
    { id: 'sec-1',      label: 'section 1',       kind: 'section',  x: 160, y: 220 },
    { id: 'sec-2',      label: 'section 2',       kind: 'section',  x: 260, y: 200 },
    { id: 'meaning',    label: "Why I'm Wrong",   kind: 'explainer',x: 420, y: 80  },
  ]

  function edgeActive(e: typeof gedges[0]) {
    return hoveredNode === e.from || hoveredNode === e.to
  }
  function nodeActive(id: string) {
    if (!hoveredNode) return true
    if (id === hoveredNode) return true
    return gedges.some(e => (e.from === hoveredNode && e.to === id) || (e.to === hoveredNode && e.from === id))
  }

  const kindColor: Record<string, string> = {
    post: '#8b7355', explainer: '#4a7c6f', section: '#aaa', work: '#6b5b8a'
  }
</script>

<svelte:head><title>moveslow.info — move slow, fix things</title></svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <header>
    <div class="meta"><span class="year">2025–present</span></div>
    <h1>moveslow.info</h1>
    <p class="lede">This site. A few things about how it works.</p>
  </header>

  <!-- ── THE STACK ──────────────────────────────────────── -->
  <section>
    <h2>the stack</h2>
    <p>SvelteKit on a DigitalOcean droplet, behind Cloudflare. Content in a managed Postgres database. No CMS — posts are seeded by script, or written directly through an MCP server during Claude sessions.</p>
    <div class="detail-block">
      <div class="detail"><span class="detail-label">Frontend</span><span>SvelteKit 2, Svelte 5, TypeScript</span></div>
      <div class="detail"><span class="detail-label">Backend</span><span>SvelteKit server routes, <code>adapter-node</code>, pm2</span></div>
      <div class="detail"><span class="detail-label">Database</span><span>Managed Postgres (DigitalOcean)</span></div>
      <div class="detail"><span class="detail-label">Infra</span><span>Droplet + Cloudflare + nginx</span></div>
      <div class="detail"><span class="detail-label">Source</span><a href="https://github.com/unity-hallie/hallie-grows" target="_blank" rel="noopener noreferrer">github.com/unity-hallie/hallie-grows</a></div>
    </div>
  </section>

  <!-- ── THE PAPER ──────────────────────────────────────── -->
  <section>
    <h2>the paper</h2>
    <p>The background is a WebGL fragment shader — fractional Brownian motion noise layered to simulate cotton-rag paper fiber, plus the faint horizontal lines left by a wire mesh in handmade paper (called the <em>laid finish</em>). Both effects are kept subliminal: you feel texture without consciously registering it.</p>
    <p>The texture drifts imperceptibly over time so it never reads as a static image. The constants below control exactly how much of each effect you see — and you can change them live.</p>

    <div class="controls">
      <div class="control-row">
        <span class="ctrl-label">grain visibility</span>
        <div class="slider-wrap">
          <span class="val">0</span>
          <input type="range" min="0" max="0.06" step="0.001" bind:value={grain} />
          <span class="val">0.06</span>
        </div>
        <code class="param">u_grain_amp = {grain.toFixed(3)}</code>
      </div>
      <div class="control-row">
        <span class="ctrl-label">grain scale</span>
        <div class="slider-wrap">
          <span class="val">coarse</span>
          <input type="range" min="20" max="200" step="1" bind:value={grainScale} />
          <span class="val">fine</span>
        </div>
        <code class="param">u_grain_scale = {grainScale}</code>
      </div>
      <div class="control-row">
        <span class="ctrl-label">laid lines</span>
        <label class="switch">
          <input type="checkbox" bind:checked={laid} />
          <span class="track"></span>
        </label>
        <code class="param">u_laid_amp = {laid ? DEFAULTS.laidAmp : 0}</code>
      </div>
      <div class="control-row">
        <span class="ctrl-label">drift speed</span>
        <div class="slider-wrap">
          <span class="val">frozen</span>
          <input type="range" min="0" max="0.002" step="0.00005" bind:value={drift} />
          <span class="val">fast</span>
        </div>
        <code class="param">u_drift = {drift.toFixed(5)}</code>
      </div>
      <button class="reset" onclick={() => { grain = DEFAULTS.grainAmp; grainScale = DEFAULTS.grainScale; laid = true; drift = DEFAULTS.driftSpeed }}>reset</button>
    </div>
  </section>

  <!-- ── THE READER ─────────────────────────────────────── -->
  <section>
    <h2>the reader</h2>
    <p>Posts use a two-voice format: sections alternate between hallie (warm) and claude (cool). The reader keeps the current section fully opaque and lets everything else fade and blur as you scroll — so you're always reading one voice at a time, but you can feel the whole conversation around it.</p>
    <p>The fade/blur system is pure CSS driven by an Intersection Observer. No layout reflows, no JS animation loops.</p>
  </section>

  <!-- ── THE GRAPH ──────────────────────────────────────── -->
  <section>
    <h2>the graph</h2>
    <p>Content is stored in a knowledge graph built on <a href="https://github.com/unity-hallie/alkahest" target="_blank" rel="noopener noreferrer">alkahest</a> — a small TypeScript library for reasoning over sets of support. Every post, explainer, and work item is a node. Relationships between them are labeled edges with confidence scores.</p>
    <p>Right now most edges are <code>HAS_SECTION</code> — the graph knows which sections belong to which post, and in what order. As the site grows, semantic edges like <code>REFERENCES</code> and <code>RESPONDS_TO</code> will connect ideas across pieces.</p>

    <div class="graph-diagram" role="img" aria-label="diagram of graph nodes and edges">
      <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- edges -->
        {#each gedges as e}
          {@const from = gnodes2.find(n => n.id === e.from)!}
          {@const to   = gnodes2.find(n => n.id === e.to)!}
          {@const active = edgeActive(e)}
          <line
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={active ? '#8b7355' : 'rgba(140,115,85,0.15)'}
            stroke-width={active ? 1.5 : 0.8}
            stroke-dasharray={e.label === 'REFERENCES' ? '4 3' : undefined}
          />
          {#if active}
            {@const mx = (from.x + to.x) / 2}
            {@const my = (from.y + to.y) / 2}
            <text x={mx} y={my - 5} text-anchor="middle" fill="#8b7355"
              font-size="9" font-family="monospace" opacity="0.8">{e.label}</text>
          {/if}
        {/each}

        <!-- nodes -->
        {#each gnodes2 as n}
          {@const r = n.kind === 'section' ? 5 : 9}
          {@const active = nodeActive(n.id)}
          <circle
            cx={n.x} cy={n.y} r={r}
            fill={active ? kindColor[n.kind] : 'rgba(200,190,180,0.3)'}
            style="cursor:pointer; transition: fill 0.15s"
            onmouseenter={() => hoveredNode = n.id}
            onmouseleave={() => hoveredNode = null}
          />
          {#if n.kind !== 'section'}
            <text
              x={n.x + r + 6} y={n.y + 4}
              fill={active ? kindColor[n.kind] : 'rgba(100,80,60,0.25)'}
              font-size="11" font-family="system-ui, sans-serif"
              style="pointer-events:none; transition: fill 0.15s"
            >{n.label}</text>
          {/if}
        {/each}
      </svg>
      <p class="diagram-caption">hover a node to see its edges — solid lines are <code>HAS_SECTION</code>, dashed are <code>REFERENCES</code></p>
    </div>

    <p>Alkahest also runs an inference loop called <em>Otter</em> — a forward-chaining reasoner that takes the current set of support and derives new edges. When two posts share a tag, Otter proposes a <code>shares-tag:language</code> edge with a confidence score. A human reviews and keeps or discards it. The graph learns without being told.</p>
  </section>

  <!-- ── THE MCP ─────────────────────────────────────────── -->
  <section>
    <h2>the mcp layer</h2>
    <p>An MCP server at <code>/api/mcp</code> exposes the graph to Claude. During writing sessions, Claude can call <code>add_item</code>, <code>add_edge</code>, <code>add_section</code>, and <code>query</code> — reading from and writing to the graph in real time. This is how most of the reader content gets authored: in conversation, with Claude as co-writer.</p>
    <p>The endpoint requires a bearer token, so it's not open to the public — but the graph it produces is what the site runs on.</p>
  </section>
</article>

<style>
  article {
    max-width: 660px;
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

  header { margin-bottom: 3.5rem; }
  .meta { font-size: 0.75rem; opacity: 0.45; margin-bottom: 0.75rem; }
  h1 { font-size: 1.8rem; font-weight: 400; margin: 0 0 1.25rem; }
  .lede { font-size: 1.05rem; line-height: 1.75; margin: 0; opacity: 0.7; }

  section { margin-bottom: 3.5rem; }
  h2 {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 400;
    opacity: 0.4;
    margin: 0 0 1.25rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.85;
    margin: 0 0 1.2rem;
    color: #1a1208;
  }
  p:last-child { margin-bottom: 0; }

  a { color: inherit; text-decoration: underline; text-decoration-color: rgba(140,120,100,0.4); }
  a:hover { text-decoration-color: currentColor; }

  code {
    font-family: monospace;
    font-size: 0.88em;
    opacity: 0.75;
  }

  /* detail block */
  .detail-block {
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(140,120,100,0.15);
    border-bottom: 1px solid rgba(140,120,100,0.15);
  }
  .detail { display: flex; gap: 1.5rem; font-size: 0.88rem; align-items: baseline; }
  .detail-label {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.4;
    min-width: 72px;
    flex-shrink: 0;
  }
  .detail a { font-size: 0.88rem; }

  /* shader controls */
  .controls {
    margin-top: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(140,120,100,0.12);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .control-row {
    display: grid;
    grid-template-columns: 130px 1fr auto;
    align-items: center;
    gap: 1rem;
  }
  .ctrl-label { font-size: 0.82rem; opacity: 0.6; }

  .slider-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .slider-wrap input[type=range] {
    flex: 1;
    accent-color: #8b7355;
    cursor: pointer;
  }
  .val { font-size: 0.65rem; opacity: 0.35; white-space: nowrap; }

  /* toggle switch */
  .switch { display: flex; align-items: center; cursor: pointer; }
  .switch input { display: none; }
  .track {
    width: 36px; height: 20px;
    background: rgba(140,120,100,0.2);
    border-radius: 10px;
    position: relative;
    transition: background 0.2s;
  }
  .track::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: #aaa;
    transition: transform 0.2s, background 0.2s;
  }
  .switch input:checked + .track { background: rgba(139,115,85,0.35); }
  .switch input:checked + .track::after { transform: translateX(16px); background: #8b7355; }

  .param { font-size: 0.72rem; opacity: 0.45; white-space: nowrap; }

  .reset {
    align-self: flex-end;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: none;
    border: 1px solid rgba(140,120,100,0.2);
    color: inherit;
    padding: 0.3rem 0.8rem;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.15s;
    font-family: inherit;
  }
  .reset:hover { opacity: 1; }

  /* graph diagram */
  .graph-diagram {
    margin: 1.5rem 0;
    border: 1px solid rgba(140,120,100,0.12);
    padding: 1rem 1rem 0.5rem;
  }
  .graph-diagram svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .diagram-caption {
    font-size: 0.75rem;
    opacity: 0.4;
    margin: 0.75rem 0 0;
    font-style: italic;
  }
</style>
