// src/presets/presets.ts
// Preset Library for Stage 1V

import type { SingleLayerPattern } from '../engine/patternIO';

export type Preset = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  // Produce a pattern sized to the chosen grid dimensions
  generate: (opts: { x: number; y: number; z: number; seed?: number }) => {
    pattern: Omit<SingleLayerPattern, 'channel'>;
    channel: Uint8Array;
  };
  // Optional MPL rule source (replace with real MPL)
  rulesSource?: string;
};

function rnd(seed: number) {
  // xorshift32
  let x = seed || 123456789;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}

function clamp(n: number, lo: number, hi: number) { 
  return Math.max(lo, Math.min(hi, n)); 
}

// ---- Generators ----
function genRandomSeedLife({ x, y, z, seed = 42 }: { x: number; y: number; z: number; seed?: number }) {
  const N = x * y * z;
  const channel = new Uint8Array(N);
  const r = rnd(seed);
  const p = 0.15; // 15% filled
  for (let i = 0; i < N; i++) channel[i] = r() < p ? 255 : 0;
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: 'Random Life Seed',
        createdAt: Date.now(),
        description: 'Random occupancy (15%) for Life-like cellular automaton'
      }
    },
    channel
  };
}

function genDiffusionInkDrop({ x, y, z }: { x: number; y: number; z: number }) {
  const N = x * y * z;
  const channel = new Uint8Array(N);
  const cx = Math.floor(x / 2), cy = Math.floor(y / 2), cz = Math.floor(z / 2);
  const radius = Math.floor(Math.min(x, y, z) * 0.18);
  const r2 = radius * radius;
  
  for (let zz = 0; zz < z; zz++) {
    for (let yy = 0; yy < y; yy++) {
      for (let xx = 0; xx < x; xx++) {
        const dx = xx - cx, dy = yy - cy, dz = zz - cz;
        const d2 = dx * dx + dy * dy + dz * dz;
        const i = xx + yy * x + zz * x * y;
        if (d2 <= r2) channel[i] = 255;
      }
    }
  }
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: 'Ink Drop',
        createdAt: Date.now(),
        description: 'Single spherical high-intensity blob at center'
      }
    },
    channel
  };
}

function genCrystalSeeds({ x, y, z, seed = 7 }: { x: number; y: number; z: number; seed?: number }) {
  const N = x * y * z;
  const channel = new Uint8Array(N);
  const r = rnd(seed);
  const seeds = Math.max(3, Math.floor((x + y + z) / 12));
  
  for (let s = 0; s < seeds; s++) {
    const sx = Math.floor(r() * x), sy = Math.floor(r() * y), sz = Math.floor(r() * z);
    const i = sx + sy * x + sz * x * y;
    channel[i] = 255;
  }
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: 'Crystal Nuclei',
        createdAt: Date.now(),
        description: 'Several random seed nuclei across the grid'
      }
    },
    channel
  };
}

function genPerlinishNoise({ x, y, z, seed = 99 }: { x: number; y: number; z: number; seed?: number }) {
  // Simple multi-octave value noise (not true Perlin, but good enough)
  const N = x * y * z;
  const channel = new Uint8Array(N);
  const r = rnd(seed);

  // pseudo 3D hash noise
  function h(xi: number, yi: number, zi: number) {
    let n = xi * 374761393 + yi * 668265263 + zi * 362437 + seed * 1013904223;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 0xffffffff;
  }
  
  function lerp(a: number, b: number, t: number) { 
    return a + (b - a) * t; 
  }
  
  function smoothstep(t: number) { 
    return t * t * (3 - 2 * t); 
  }
  
  function sample(nx: number, ny: number, nz: number) {
    const x0 = Math.floor(nx), y0 = Math.floor(ny), z0 = Math.floor(nz);
    const x1 = x0 + 1, y1 = y0 + 1, z1 = z0 + 1;
    const tx = smoothstep(nx - x0), ty = smoothstep(ny - y0), tz = smoothstep(nz - z0);
    const c000 = h(x0, y0, z0), c100 = h(x1, y0, z0), c010 = h(x0, y1, z0), c110 = h(x1, y1, z0);
    const c001 = h(x0, y0, z1), c101 = h(x1, y0, z1), c011 = h(x0, y1, z1), c111 = h(x1, y1, z1);
    const x00 = lerp(c000, c100, tx), x10 = lerp(c010, c110, tx);
    const x01 = lerp(c001, c101, tx), x11 = lerp(c011, c111, tx);
    const y0v = lerp(x00, x10, ty), y1v = lerp(x01, x11, ty);
    return lerp(y0v, y1v, tz);
  }

  const scale = 0.12;
  for (let zi = 0; zi < z; zi++) {
    for (let yi = 0; yi < y; yi++) {
      for (let xi = 0; xi < x; xi++) {
        const v =
          0.6 * sample(xi * scale, yi * scale, zi * scale) +
          0.3 * sample(xi * scale * 2, yi * scale * 2, zi * scale * 2) +
          0.1 * sample(xi * scale * 4, yi * scale * 4, zi * scale * 4);
        const i = xi + yi * x + zi * x * y;
        channel[i] = Math.floor(clamp(v, 0, 1) * 255);
      }
    }
  }
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: 'Noise Field',
        createdAt: Date.now(),
        description: 'Smooth multi-octave value noise in 3D (0..255)'
      }
    },
    channel
  };
}

function genSpiralPattern({ x, y, z }: { x: number; y: number; z: number }) {
  const N = x * y * z;
  const channel = new Uint8Array(N);
  const centerX = Math.floor(x / 2);
  const centerY = Math.floor(y / 2);
  
  for (let angle = 0; angle < 360; angle += 15) {
    const rad = angle * Math.PI / 180;
    const radius = angle / 10;
    const px = centerX + Math.floor(Math.cos(rad) * radius);
    const py = centerY + Math.floor(Math.sin(rad) * radius);
    
    if (px >= 0 && px < x && py >= 0 && py < y) {
      for (let zz = 0; zz < z; zz++) {
        const i = px + py * x + zz * x * y;
        channel[i] = 255;
      }
    }
  }
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: 'Spiral Pattern',
        createdAt: Date.now(),
        description: '3D spiral pattern expanding from center'
      }
    },
    channel
  };
}

function genCheckerboard({ x, y, z }: { x: number; y: number; z: number }) {
  const N = x * y * z;
  const channel = new Uint8Array(N);
  
  for (let zz = 0; zz < z; zz++) {
    for (let yy = 0; yy < y; yy++) {
      for (let xx = 0; xx < x; xx++) {
        const i = xx + yy * x + zz * x * y;
        channel[i] = ((xx + yy + zz) % 2 === 0) ? 255 : 0;
      }
    }
  }
  
  return {
    pattern: {
      schema: 'mpl.pattern.v1' as const, 
      size: { x, y, z }, 
      meta: {
        name: '3D Checkerboard',
        createdAt: Date.now(),
        description: 'Classic checkerboard pattern extended to 3D space'
      }
    },
    channel
  };
}

// ---- Placeholder rule sources (replace with real MPL) ----
const RULES_3D_LIFE = `// TODO: Replace with your MPL 3D Life rules
// suggestion: B5/S45 style on 26-neighborhood
// when neighborsAlive in {5} then cell := alive else if alive and neighborsAlive in {4,5} keep alive else die
`;

const RULES_DIFFUSION = `// TODO: Replace with your MPL diffusion rules
// suggestion: newValue = self*0.9 + average(neighbors)*0.1
`;

const RULES_CRYSTAL = `// TODO: Replace with your MPL crystal growth rules
// suggestion: if neighbor has high intensity -> increase self slightly; add stochastic branching
`;

// ---- Presets ----
export const PRESETS: Preset[] = [
  {
    id: 'life3d-random',
    title: '3D Life — Random Seed',
    description: 'Random occupancy (15%) for Life-like cellular automaton. Great for emergent structures.',
    tags: ['life', 'automata', '3d'],
    generate: ({ x, y, z, seed }) => genRandomSeedLife({ x, y, z, seed }),
    rulesSource: RULES_3D_LIFE,
  },
  {
    id: 'diffusion-ink',
    title: 'Diffusion — Ink Drop',
    description: 'Single spherical high-intensity blob at center; pairs with diffusion/blur rules.',
    tags: ['diffusion', 'physics'],
    generate: ({ x, y, z }) => genDiffusionInkDrop({ x, y, z }),
    rulesSource: RULES_DIFFUSION,
  },
  {
    id: 'crystal-nuclei',
    title: 'Crystal Growth — Nuclei',
    description: 'Several random seed nuclei across the grid; watch growth rules expand them.',
    tags: ['crystal', 'growth', 'stochastic'],
    generate: ({ x, y, z, seed }) => genCrystalSeeds({ x, y, z, seed }),
    rulesSource: RULES_CRYSTAL,
  },
  {
    id: 'noise-seed',
    title: 'Noise Field',
    description: 'Smooth multi-octave value noise in 3D (0..255). Useful as substrate or terrain.',
    tags: ['noise', 'terrain', 'general'],
    generate: ({ x, y, z, seed }) => genPerlinishNoise({ x, y, z, seed }),
  },
  {
    id: 'spiral-3d',
    title: '3D Spiral',
    description: 'Beautiful spiral pattern expanding from center. Great for testing 3D rendering.',
    tags: ['spiral', '3d', 'geometric'],
    generate: ({ x, y, z }) => genSpiralPattern({ x, y, z }),
  },
  {
    id: 'checkerboard-3d',
    title: '3D Checkerboard',
    description: 'Classic checkerboard pattern extended to 3D space. Perfect for testing.',
    tags: ['checkerboard', '3d', 'geometric'],
    generate: ({ x, y, z }) => genCheckerboard({ x, y, z }),
  },
];
