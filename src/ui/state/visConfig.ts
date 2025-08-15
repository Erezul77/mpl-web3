// src/ui/state/visConfig.ts
import * as THREE from 'three';

// Map 0..255 → RGB in [0..1]
export function colorForChannel(v: number): THREE.ColorRepresentation & { r: number; g: number; b: number } {
  // default: a tasteful blue→cyan→yellow ramp
  const t = Math.max(0, Math.min(1, v / 255));
  // simple two-segment lerp
  const mid = 0.5;
  let r = 0, g = 0, b = 0;
  if (t <= mid) {
    const k = t / mid; // 0..1
    r = 0.0 * (1 - k) + 0.0 * k;
    g = 0.2 * (1 - k) + 0.8 * k;
    b = 0.6 * (1 - k) + 1.0 * k;
  } else {
    const k = (t - mid) / (1 - mid);
    r = 0.0 * (1 - k) + 1.0 * k;
    g = 0.8 * (1 - k) + 1.0 * k;
    b = 1.0 * (1 - k) + 0.2 * k;
  }
  return { r, g, b } as any;
}
