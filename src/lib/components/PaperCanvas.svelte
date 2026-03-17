<script lang="ts">
  import { onMount } from 'svelte'
  import { shaderParams } from '$lib/stores/shader.js'

  let canvas: HTMLCanvasElement

  const vert = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `

  const frag = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform float u_grain_scale;
    uniform float u_grain_amp;
    uniform float u_laid_amp;
    uniform float u_drift;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p = p * 2.1 + vec2(5.3, 1.7);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float t = u_time * u_drift;

      vec2 p = uv * u_grain_scale + t;
      float grain = fbm(p) + fbm(p * 2.3 + vec2(3.7, 1.1)) * 0.5;
      grain = (grain / 1.5 - 0.5) * u_grain_amp;

      float laid = sin(gl_FragCoord.y * 1.047) * u_laid_amp;

      vec3 col = vec3(0.961, 0.949, 0.925) + grain + laid;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `

  onMount(() => {
    const gl = canvas.getContext('webgl')!
    if (!gl) return

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime       = gl.getUniformLocation(prog, 'u_time')
    const uRes        = gl.getUniformLocation(prog, 'u_res')
    const uGrainScale = gl.getUniformLocation(prog, 'u_grain_scale')
    const uGrainAmp   = gl.getUniformLocation(prog, 'u_grain_amp')
    const uLaidAmp    = gl.getUniformLocation(prog, 'u_laid_amp')
    const uDrift      = gl.getUniformLocation(prog, 'u_drift')

    // Track current params without re-subscribing on every frame
    let params = { grainScale: 80, grainAmp: 0.016, laidAmp: 0.003, driftSpeed: 0.0004 }
    const unsub = shaderParams.subscribe(p => { params = p })

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    let raf: number
    const start = performance.now()
    function draw() {
      gl.uniform1f(uTime,       (performance.now() - start) / 1000)
      gl.uniform1f(uGrainScale, params.grainScale)
      gl.uniform1f(uGrainAmp,   params.grainAmp)
      gl.uniform1f(uLaidAmp,    params.laidAmp)
      gl.uniform1f(uDrift,      params.driftSpeed)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      unsub()
    }
  })
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
</style>
