<script lang="ts">
  // PaperCanvas — WebGL paper texture background
  //
  // A full-screen fragment shader that renders aged paper: fine grain from
  // fractional Brownian motion noise, and a faint laid finish (the horizontal
  // lines left by the wire mesh in handmade paper). Both are kept very light —
  // you feel texture without consciously registering it.
  //
  // The shader drifts imperceptibly over time (u_time * 0.0004) so it never
  // looks like a static image. The drift is slow enough that you won't notice
  // it unless you're looking for it.
  //
  // Philosophy from palimpsest (github.com/unity-hallie/palimpsest):
  // text is sacred, everything else is atmosphere.

  import { onMount } from 'svelte'

  let canvas: HTMLCanvasElement

  const vert = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `

  const frag = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_res;

    // Value noise via a sin-based hash. Fast and good enough for paper grain —
    // we don't need the quality of Perlin noise here.
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
      float t = u_time * 0.0004; // imperceptibly slow drift

      // Fine paper grain via layered fBm noise.
      // Scale of 80 puts the grain at roughly paper-fiber resolution.
      // Amplitude of 0.016 keeps it subliminal.
      vec2 p = uv * 80.0 + t;
      float grain = fbm(p) + fbm(p * 2.3 + vec2(3.7, 1.1)) * 0.5;
      grain = (grain / 1.5 - 0.5) * 0.016;

      // Laid finish: the faint horizontal lines left by the wire mesh in
      // handmade paper. Period of ~6px, amplitude of 0.003 — barely visible.
      float laid = sin(gl_FragCoord.y * 1.047) * 0.003;

      // Paper base color matches the reader's warm background (#f5f2ec).
      vec3 col = vec3(0.961, 0.949, 0.925) + grain + laid;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `

  onMount(() => {
    const gl = canvas.getContext('webgl')
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

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes  = gl.getUniformLocation(prog, 'u_res')

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
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
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
