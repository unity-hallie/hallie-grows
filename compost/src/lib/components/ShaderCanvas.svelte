<script lang="ts">
  /**
   * Morning light on plaster.
   * A room facing east. Sun from upper-left, ~9am, ~4500K.
   * Warm raking light on aged plaster. Shadows receive cool sky.
   * Renders once on mount; re-renders on resize only.
   */
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let glRef: WebGLRenderingContext | null = null;
  let uResLoc: WebGLUniformLocation | null = null;

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision mediump float;
    uniform vec2 iResolution;

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

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution;
      vec2 p  = gl_FragCoord.xy;

      /* plaster texture — coarse grain + fine */
      float coarse = fbm(p * 0.007);
      float fine   = fbm(p * 0.024 + 3.7);
      float tex    = coarse * 0.60 + fine * 0.40;

      /* plaster base: aged warm cream */
      vec3 plasterBase = mix(
        vec3(0.975, 0.963, 0.948),
        vec3(0.952, 0.938, 0.922),
        tex * 0.28
      );

      /* morning light source: upper-left — a tall east-facing window */
      vec2  lightOrigin = vec2(-0.04, 1.04);
      vec2  toPixel     = uv - lightOrigin;
      float dist        = length(toPixel);

      /* radial falloff from window */
      float radial      = 1.0 - clamp(dist * 0.92, 0.0, 1.0);
      radial            = radial * radial;

      /* directional: light traveling down-right at shallow morning angle */
      vec2  lightDir    = normalize(vec2(0.62, -0.78));
      float directional = clamp(dot(normalize(toPixel), lightDir), 0.0, 1.0);

      float illumination = clamp(radial * 0.55 + directional * 0.45, 0.0, 1.0);

      /* raking texture: most visible at oblique angles */
      float raking     = illumination * (1.0 - illumination * 0.65) * 3.5;
      float texVisible = tex * raking * 0.10;

      /* ~4500K morning sun: warm gold-white */
      vec3 sunColor = vec3(0.990, 0.905, 0.720);
      /* clear sky ambient: subtle cool blue for shadows */
      vec3 skyColor = vec3(0.935, 0.960, 1.000);

      /* base: whole room lit by sky — shadows are never dark */
      vec3 baseLight = plasterBase * skyColor * 0.88;

      /* sun adds warm directional gold on top */
      float sunStrength = illumination * illumination * 0.18;
      vec3  sunLight    = plasterBase * sunColor * sunStrength;

      vec3 col = baseLight + sunLight + vec3(texVisible);

      /* soft vignette */
      vec2 vg = uv - 0.5;
      col    *= 1.0 - dot(vg, vg) * 0.14;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

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

    uResLoc = gl.getUniformLocation(prog, 'iResolution');

    function render() {
      if (!glRef || !uResLoc) return;
      glRef.uniform2f(uResLoc, canvas.width, canvas.height);
      glRef.drawArrays(glRef.TRIANGLES, 0, 6);
    }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      render();
    }

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
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
