<script lang="ts">
  /**
   * Dark room, white plaster walls.
   * Panels float on the wall. Warm neon light bleeds from behind them.
   * The plaster is only lit where the panel light actually reaches.
   */
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let animId: number;
  let glRef: WebGLRenderingContext | null = null;
  let uPanelsLoc: WebGLUniformLocation | null = null;
  let uActiveLoc: WebGLUniformLocation | null = null;
  let uTimeLoc: WebGLUniformLocation | null = null;
  let uResLoc: WebGLUniformLocation | null = null;

  const MAX_PANELS = 12;

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision mediump float;

    uniform float iTime;
    uniform vec2  iResolution;
    uniform vec4  uPanels[12];   /* x, y, w, h  — CSS pixels, y from top */
    uniform float uActive[12];   /* 1.0 = active, 0.0 = empty slot       */

    /* ── plaster micro-texture ── */
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                 mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    /* ── distance from point to outside of rect ── */
    /* 0.0 at the edge, positive outside, 0.0 inside */
    float rectOutsideDist(vec2 p, vec4 r) {
      vec2 d = max(r.xy - p, p - (r.xy + r.zw));
      return length(max(d, vec2(0.0)));
    }

    void main() {
      /* flip y so (0,0) is top-left, matching CSS getBoundingClientRect */
      vec2 p = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
      vec2 uv = gl_FragCoord.xy / iResolution;

      /* plaster texture — fine grain, almost imperceptible in the dark */
      float tex = fbm(p * 0.010) * 0.7 + fbm(p * 0.022 + 5.3) * 0.3;
      vec3 plaster = mix(
        vec3(0.975, 0.960, 0.940),   /* warm white */
        vec3(0.910, 0.895, 0.875),   /* slightly cream */
        tex * 0.35
      );

      /* accumulate light from each panel */
      float illumination = 0.0;
      for (int i = 0; i < 12; i++) {
        float active = uActive[i];
        if (active < 0.5) continue;

        float dist = rectOutsideDist(p, uPanels[i]);

        /* warm neon bleed — dialed back */
        float near  = exp(-dist * 0.014) * 0.55;
        float far   = exp(-dist * 0.004) * 0.20;
        illumination += (near + far) * active;
      }
      illumination = clamp(illumination, 0.0, 1.0);

      /* room ambient — dim but not void */
      float ambient = 0.07;

      /* plaster only visible where light reaches */
      vec3 col = plaster * (ambient + illumination * 0.90);

      /* warm neon color tint in the lit areas */
      vec3 neon = vec3(0.96, 0.82, 0.60);
      col = mix(col, col * neon, illumination * 0.18);

      /* very light vignette — corners always a bit darker */
      vec2 vg = uv - 0.5;
      col *= 1.0 - dot(vg, vg) * 0.5;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  function updatePanels() {
    if (!glRef || !uPanelsLoc || !uActiveLoc) return;
    const surfaces = Array.from(document.querySelectorAll('.surface'));
    const panelData = new Float32Array(MAX_PANELS * 4);
    const activeData = new Float32Array(MAX_PANELS);

    surfaces.slice(0, MAX_PANELS).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      panelData[i * 4 + 0] = r.left;
      panelData[i * 4 + 1] = r.top;
      panelData[i * 4 + 2] = r.width;
      panelData[i * 4 + 3] = r.height;
      activeData[i] = 1.0;
    });

    glRef.uniform4fv(uPanelsLoc, panelData);
    glRef.uniform1fv(uActiveLoc, activeData);
  }

  onMount(() => {
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef = gl;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1,  1,-1, 1,1, -1,1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uTimeLoc   = gl.getUniformLocation(prog, 'iTime');
    uResLoc    = gl.getUniformLocation(prog, 'iResolution');
    uPanelsLoc = gl.getUniformLocation(prog, 'uPanels');
    uActiveLoc = gl.getUniformLocation(prog, 'uActive');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    // Update panel positions on scroll and resize
    const onScroll = () => updatePanels();
    const onResize = () => { resize(); updatePanels(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Initial panel read — wait for layout to settle
    setTimeout(updatePanels, 100);

    const start = performance.now();
    function frame() {
      gl!.uniform1f(uTimeLoc, (performance.now() - start) / 1000);
      gl!.uniform2f(uResLoc, canvas.width, canvas.height);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
