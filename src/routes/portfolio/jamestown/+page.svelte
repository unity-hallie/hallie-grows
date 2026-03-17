<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { browser } from '$app/environment'

  let canvas: HTMLCanvasElement
  let cw = 0, ch = 0
  let animFrame: number
  let bullets: { x: number; y: number; vx: number; vy: number; life: number }[] = []
  let t = 0
  let spawnTimer = 0
  let burstCount = 0

  // pattern params
  let leaves   = $state(5)
  let period   = $state(4)      // frames between bursts
  let velocity = $state(2.2)    // px/frame
  let accel    = $state(0)      // velocity multiplier per frame
  let rotation = $state(0.55)   // outer wave speed rad/frame
  let modDepth = $state(0.22)   // inner sin amplitude
  let gapEvery = $state(4)      // skip i where i % gapEvery < gapWidth
  let gapWidth = $state(0)      // 0 = no gaps

  function spawn() {
    burstCount++
    const cx = cw / 2, cy = ch / 2
    const outer = t * rotation
    const inner = Math.sin(t * leaves * 0.85) * modDepth
    for (let i = 0; i < leaves; i++) {
      // per-stream gap: each stream is offset by i bursts in the gap cycle,
      // so the open corridor rotates through the ring rather than being a static cut
      if (gapWidth > 0 && (burstCount + i) % gapEvery < gapWidth) continue
      const angle = outer + (Math.PI * 2 / leaves) * i + inner
      bullets.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1.0,
      })
    }
  }

  function tick() {
    t += 0.016
    spawnTimer++
    if (spawnTimer >= period) { spawn(); spawnTimer = 0 }

    const af = 1 + accel
    bullets = bullets
      .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy, vx: b.vx * af, vy: b.vy * af, life: b.life - 0.007 }))
      .filter(b => b.life > 0 && b.x > -20 && b.x < cw + 20 && b.y > -20 && b.y < ch + 20)

    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(8, 6, 4, 0.18)'
    ctx.fillRect(0, 0, cw, ch)

    for (const b of bullets) {
      ctx.save()
      ctx.globalAlpha = b.life
      ctx.fillStyle = '#ffb84a'
      ctx.shadowColor = '#ffb84a'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    animFrame = requestAnimationFrame(tick)
  }

  onMount(() => {
    cw = canvas.offsetWidth
    ch = canvas.offsetHeight
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#080604'
    ctx.fillRect(0, 0, cw, ch)
    animFrame = requestAnimationFrame(tick)
  })

  onDestroy(() => { if (browser) cancelAnimationFrame(animFrame) })
</script>

<svelte:head><title>Jamestown — move slow, fix things</title></svelte:head>

<article>
  <a href="/portfolio" class="back">← portfolio</a>

  <div class="hero">
    <img src="/images/jamestown-header.jpg" alt="Jamestown" class="hero-img" />
  </div>

  <header>
    <div class="meta">
      <span class="year">2011</span>
      <span class="role">Co-Founder / Developer — Final Form Games</span>
    </div>
    <h1>Jamestown</h1>
    <p class="lede">A top-down scrolling shooter set on British colonial Mars in the 1600s. 1–4 players.</p>
  </header>

  <section class="body">
    <div class="screenshot">
      <img src="/images/jamestown-screenshot.jpg" alt="Jamestown gameplay screenshot" />
    </div>

    <p>I always felt like math was beautiful. With Jamestown I got to show other people.</p>

    <p>I wrote many of the early bullet patterns and the components we used to adapt them across difficulties and maintain complex stateful behavior when needed. Bullet patterns are beautiful. You have to make them legible enough so that if there are several on screen, the player can intuit them at a glance. And they still have to feel scary.</p>

    <p>The camera system is one of my crowning achievements. Enemies live in world space and screen space, four players can move across the screen with slow parallax, specific positions and velocities set at the level design stage — the system interpolates smoothly, keeps bullets and enemies from jittering.</p>

    <p>No one has ever said a word about it. That's how I know it worked.</p>

    <div class="gasket">
      <canvas bind:this={canvas} class="gasket-canvas"></canvas>

      <div class="controls">
        <label>
          <span>leaves <em>{leaves}</em></span>
          <input type="range" min="1" max="16" step="1" bind:value={leaves} />
        </label>
        <label>
          <span>period <em>{period}f</em></span>
          <input type="range" min="1" max="20" step="1" bind:value={period} />
        </label>
        <label>
          <span>velocity <em>{velocity.toFixed(1)}</em></span>
          <input type="range" min="0.5" max="6" step="0.1" bind:value={velocity} />
        </label>
        <label>
          <span>accel <em>{accel > 0 ? '+' : ''}{accel.toFixed(3)}</em></span>
          <input type="range" min="-0.02" max="0.02" step="0.001" bind:value={accel} />
        </label>
        <label>
          <span>rotation <em>{rotation.toFixed(2)}</em></span>
          <input type="range" min="0" max="2" step="0.01" bind:value={rotation} />
        </label>
        <label>
          <span>mod <em>{modDepth.toFixed(2)}</em></span>
          <input type="range" min="0" max="0.6" step="0.01" bind:value={modDepth} />
        </label>
        <label>
          <span>gap every <em>{gapEvery}</em></span>
          <input type="range" min="2" max="16" step="1" bind:value={gapEvery} />
        </label>
        <label>
          <span>gap width <em>{gapWidth}</em></span>
          <input type="range" min="0" max={Math.max(0, gapEvery - 1)} step="1" bind:value={gapWidth} />
        </label>
      </div>
    </div>

    <div class="awards">
      <span>IGF Honorable Mention 2010</span>
      <span>PAX 10 2011</span>
      <span>Co-Optimus PC Game of the Year 2011</span>
    </div>
  </section>
</article>

<style>
  article { max-width: 680px; margin: 0 auto; padding: 2rem 2rem 8rem; }

  .back {
    display: inline-block;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    opacity: 0.4;
    margin-bottom: 2rem;
    transition: opacity 0.15s;
  }
  .back:hover { opacity: 1; }

  .hero { margin-bottom: 2.5rem; }
  .hero-img { width: 100%; height: 280px; object-fit: cover; object-position: center 30%; display: block; }

  header { margin-bottom: 2.5rem; }
  .meta { display: flex; gap: 1.5rem; font-size: 0.75rem; opacity: 0.45; margin-bottom: 0.75rem; flex-wrap: wrap; }
  h1 { font-size: 1.8rem; font-weight: 400; margin: 0 0 0.75rem; }
  .lede { font-size: 1.05rem; line-height: 1.7; color: #2a1f0f; margin: 0; opacity: 0.8; }

  .body p { font-size: 1rem; line-height: 1.8; margin: 0 0 1.4rem; color: #2a1f0f; }
  .screenshot { margin: 0 0 2rem; }
  .screenshot img { width: 100%; display: block; }

  /* gasket */
  .gasket {
    margin: 2.5rem 0;
    border: 1px solid rgba(140, 120, 100, 0.15);
  }

  .gasket-canvas {
    display: block;
    width: 100%;
    height: 320px;
    background: #080604;
  }

  .controls {
    background: #0e0c0a;
    border-top: 1px solid rgba(140, 120, 100, 0.1);
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 2rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  label span {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8c7864;
  }

  label span em {
    font-style: normal;
    color: #ffb84a;
    font-family: 'Courier New', monospace;
    font-size: 0.68rem;
  }

  input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 2px;
    background: rgba(140, 120, 100, 0.2);
    outline: none;
    cursor: pointer;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ffb84a;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(255, 184, 74, 0.6);
  }
  input[type=range]::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ffb84a;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 6px rgba(255, 184, 74, 0.6);
  }

  .awards {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.45;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(140, 120, 100, 0.15);
  }
</style>
