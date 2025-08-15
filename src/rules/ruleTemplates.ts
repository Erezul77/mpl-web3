// src/rules/ruleTemplates.ts
// Rule Templates & Examples for Stage 1W

export type RuleTemplate = {
  id: string;
  title: string;
  description: string;
  category: 'automata' | 'physics' | 'artistic' | 'utility' | 'experimental';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mplCode: string;
  // Suggested pattern to use with this rule
  suggestedPattern?: string;
  // Parameters that can be tweaked
  parameters?: {
    name: string;
    description: string;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
  }[];
};

// ---- Rule Templates ----

const LIFE_3D_BASIC: RuleTemplate = {
  id: 'life-3d-basic',
  title: '3D Conway Life',
  description: 'Classic Game of Life extended to 3D with 26-neighbor Moore neighborhood. Birth on 5 neighbors, survival on 4-5 neighbors.',
  category: 'automata',
  tags: ['life', 'conway', '3d', 'cellular-automaton'],
  difficulty: 'beginner',
  mplCode: `// 3D Conway's Game of Life
// Birth: exactly 5 neighbors alive
// Survival: 4 or 5 neighbors alive
// Death: otherwise

when neighborsAlive in {5} then cell := alive
else if alive and neighborsAlive in {4,5} then keep alive
else cell := dead`,
  suggestedPattern: 'life3d-random',
  parameters: [
    {
      name: 'birthThreshold',
      description: 'Number of neighbors needed for birth',
      defaultValue: 5,
      min: 1,
      max: 26,
      step: 1
    },
    {
      name: 'survivalMin',
      description: 'Minimum neighbors for survival',
      defaultValue: 4,
      min: 0,
      max: 25,
      step: 1
    },
    {
      name: 'survivalMax', 
      description: 'Maximum neighbors for survival',
      defaultValue: 5,
      min: 1,
      max: 26,
      step: 1
    }
  ]
};

const DIFFUSION_BLUR: RuleTemplate = {
  id: 'diffusion-blur',
  title: 'Diffusion Blur',
  description: 'Simple diffusion simulation that blurs patterns over time. Each cell becomes a weighted average of itself and its neighbors.',
  category: 'physics',
  tags: ['diffusion', 'blur', 'smoothing', 'physics'],
  difficulty: 'beginner',
  mplCode: `// Diffusion Blur Rule
// Each cell becomes: self*0.7 + average(neighbors)*0.3

let neighborSum = sum(neighbors)
let neighborCount = count(neighbors)
let neighborAvg = neighborSum / neighborCount

cell := cell * 0.7 + neighborAvg * 0.3`,
  suggestedPattern: 'diffusion-ink',
  parameters: [
    {
      name: 'selfWeight',
      description: 'Weight of current cell value (0.0-1.0)',
      defaultValue: 0.7,
      min: 0.0,
      max: 1.0,
      step: 0.1
    },
    {
      name: 'neighborWeight',
      description: 'Weight of neighbor average (0.0-1.0)',
      defaultValue: 0.3,
      min: 0.0,
      max: 1.0,
      step: 0.1
    }
  ]
};

const CRYSTAL_GROWTH: RuleTemplate = {
  id: 'crystal-growth',
  title: 'Crystal Growth',
  description: 'Stochastic crystal growth where high-intensity neighbors encourage growth. Creates branching, organic-looking structures.',
  category: 'artistic',
  tags: ['crystal', 'growth', 'stochastic', 'branching'],
  difficulty: 'intermediate',
  mplCode: `// Crystal Growth Rule
// High neighbors encourage growth, with stochastic branching

let maxNeighbor = max(neighbors)
let growthChance = maxNeighbor / 255.0

if random() < growthChance * 0.3 then
  cell := min(255, cell + 20)
else if cell > 0 then
  cell := max(0, cell - 2`,
  suggestedPattern: 'crystal-nuclei',
  parameters: [
    {
      name: 'growthRate',
      description: 'How much to increase cell value on growth',
      defaultValue: 20,
      min: 1,
      max: 100,
      step: 1
    },
    {
      name: 'decayRate',
      description: 'How much to decrease cell value per step',
      defaultValue: 2,
      min: 0,
      max: 20,
      step: 1
    },
    {
      name: 'growthMultiplier',
      description: 'Multiplier for growth probability',
      defaultValue: 0.3,
      min: 0.1,
      max: 1.0,
      step: 0.1
    }
  ]
};

const WAVE_SIMULATION: RuleTemplate = {
  id: 'wave-simulation',
  title: 'Wave Propagation',
  description: 'Simple wave simulation using the wave equation. Creates rippling effects that propagate through the grid.',
  category: 'physics',
  tags: ['wave', 'propagation', 'ripple', 'oscillation'],
  difficulty: 'intermediate',
  mplCode: `// Wave Propagation Rule
// Simple wave equation: d²u/dt² = c²∇²u
// Simplified to: new = 2*current - old + c²*laplacian

let laplacian = sum(neighbors) - 6 * cell
let waveSpeed = 0.1

// Store previous state in a separate channel or use a delay
// For now, approximate with current neighbors
cell := cell + waveSpeed * laplacian`,
  suggestedPattern: 'noise-seed',
  parameters: [
    {
      name: 'waveSpeed',
      description: 'Speed of wave propagation (0.01-0.5)',
      defaultValue: 0.1,
      min: 0.01,
      max: 0.5,
      step: 0.01
    },
    {
      name: 'damping',
      description: 'Wave damping factor (0.0-1.0)',
      defaultValue: 0.99,
      min: 0.8,
      max: 1.0,
      step: 0.01
    }
  ]
};

const FRACTAL_PATTERN: RuleTemplate = {
  id: 'fractal-pattern',
  title: 'Fractal Generator',
  description: 'Generates fractal-like patterns using iterative mathematical functions. Creates complex, self-similar structures.',
  category: 'artistic',
  tags: ['fractal', 'mathematical', 'iterative', 'complex'],
  difficulty: 'advanced',
  mplCode: `// Fractal Pattern Generator
// Uses Mandelbrot-like iteration with custom parameters

let x = (cellX - gridWidth/2) / (gridWidth/2)
let y = (cellY - gridHeight/2) / (gridHeight/2)
let z = (cellZ - gridDepth/2) / (gridDepth/2)

let cx = x * 2.0 - 1.0
let cy = y * 2.0 - 1.0
let cz = z * 2.0 - 1.0

let iteration = 0
let maxIterations = 100

while iteration < maxIterations and (cx*cx + cy*cy + cz*cz) < 4.0 do
  let tempX = cx*cx - cy*cy - cz*cz + x
  let tempY = 2*cx*cy + y
  let tempZ = 2*cx*cz + z
  cx := tempX
  cy := tempY
  cz := tempZ
  iteration := iteration + 1

cell := (iteration * 255) / maxIterations`,
  suggestedPattern: 'noise-seed',
  parameters: [
    {
      name: 'maxIterations',
      description: 'Maximum fractal iterations',
      defaultValue: 100,
      min: 10,
      max: 500,
      step: 10
    },
    {
      name: 'escapeRadius',
      description: 'Escape radius for fractal calculation',
      defaultValue: 4.0,
      min: 1.0,
      max: 10.0,
      step: 0.5
    }
  ]
};

const COLOR_CYCLE: RuleTemplate = {
  id: 'color-cycle',
  title: 'Color Cycling',
  description: 'Simple color cycling effect that shifts values through the color spectrum. Great for artistic animations.',
  category: 'artistic',
  tags: ['color', 'cycling', 'animation', 'artistic'],
  difficulty: 'beginner',
  mplCode: `// Color Cycling Rule
// Cycles through the color spectrum over time

let time = stepCount
let cycleSpeed = 0.1
let phase = (time * cycleSpeed + cellX + cellY + cellZ) % 256

cell := phase`,
  suggestedPattern: 'checkerboard-3d',
  parameters: [
    {
      name: 'cycleSpeed',
      description: 'Speed of color cycling (0.01-1.0)',
      defaultValue: 0.1,
      min: 0.01,
      max: 1.0,
      step: 0.01
    },
    {
      name: 'spatialPhase',
      description: 'Spatial phase variation (0.0-1.0)',
      defaultValue: 1.0,
      min: 0.0,
      max: 2.0,
      step: 0.1
    }
  ]
};

// ---- Export all templates ----
export const RULE_TEMPLATES: RuleTemplate[] = [
  LIFE_3D_BASIC,
  DIFFUSION_BLUR,
  CRYSTAL_GROWTH,
  WAVE_SIMULATION,
  FRACTAL_PATTERN,
  COLOR_CYCLE
];

// ---- Helper functions ----
export function getTemplatesByCategory(category: RuleTemplate['category']): RuleTemplate[] {
  return RULE_TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesByDifficulty(difficulty: RuleTemplate['difficulty']): RuleTemplate[] {
  return RULE_TEMPLATES.filter(t => t.difficulty === difficulty);
}

export function searchTemplates(query: string): RuleTemplate[] {
  const q = query.toLowerCase();
  return RULE_TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  );
}

export function getTemplateById(id: string): RuleTemplate | undefined {
  return RULE_TEMPLATES.find(t => t.id === id);
}
