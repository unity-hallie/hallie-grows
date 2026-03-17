import { writable } from 'svelte/store'

export interface ShaderParams {
  grainScale: number   // 20–200, default 80  (lower = coarser fiber)
  grainAmp: number     // 0–0.06, default 0.016
  laidAmp: number      // 0–0.012, default 0.003
  driftSpeed: number   // 0–0.002, default 0.0004
}

export const DEFAULTS: ShaderParams = {
  grainScale: 80,
  grainAmp:   0.016,
  laidAmp:    0.003,
  driftSpeed: 0.0004,
}

export const shaderParams = writable<ShaderParams>({ ...DEFAULTS })
