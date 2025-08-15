// Temporary mock of mpl-core to avoid import issues during development
// This will be replaced with the actual mpl-core once it's properly built

export class VM {
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = { data: new Array(width * height).fill(0), width, height };
    this.variables = new Map();
    this.rules = new Map();
    this.functions = new Map();
    this.logBuffer = [];
    this.stepCounter = 0;
  }

  width: number;
  height: number;
  grid: { data: number[]; width: number; height: number };
  variables: Map<string, any>;
  rules: Map<string, any>;
  functions: Map<string, any>;
  logBuffer: string[];
  stepCounter: number;

  executeCommand(command: string) {
    // Simple command execution for development
    if (command.includes('set(')) {
      const match = command.match(/set\((\d+),(\d+)\)/);
      if (match) {
        const x = parseInt(match[1]);
        const y = parseInt(match[2]);
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.grid.data[y * this.width + x] = 1;
        }
      }
    } else if (command.includes('clear()')) {
      this.grid.data.fill(0);
    } else if (command.includes('step()')) {
      this.stepCounter++;
    }
  }

  getGrid() {
    return this.grid;
  }

  getVariables() {
    return this.variables;
  }

  getRules() {
    return this.rules;
  }

  getFunctions() {
    return this.functions;
  }

  getLogBuffer() {
    return this.logBuffer;
  }

  reset() {
    this.grid.data.fill(0);
    this.variables.clear();
    this.rules.clear();
    this.functions.clear();
    this.logBuffer = [];
    this.stepCounter = 0;
  }

  createGridSnapshot() {
    const { width, height } = this.grid;
    const size = { x: width, y: height, z: 1 };
    const channel = new Uint8Array(width * height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const cellValue = this.grid.data[index];
        channel[index] = cellValue === 1 ? 255 : 0;
      }
    }

    const getStateAt = (x: number, y: number, z: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height || z !== 0) {
        return undefined;
      }
      const index = y * width + x;
      const cellValue = this.grid.data[index];
      return {
        value: cellValue,
        position: { x, y, z },
        step: this.stepCounter,
        timestamp: Date.now()
      };
    };

    return { size, channel, getStateAt };
  }
}

export function lint(code: string) {
  // Simple linting mock that returns proper diagnostic objects
  return [] as Array<{ message: string; severity: string; line?: number }>;
}

export const lintingRules = {
  builtins: ['set', 'clear', 'step', 'print'],
  keywords: ['var', 'function', 'if', 'else', 'while', 'for', 'return'],
  suggestions: ['Use meaningful variable names', 'Add comments for complex logic']
};

export function importMPLFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.readAsText(file);
  });
}

export function exportMPLFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateMPLFile(file: File) {
  return { isValid: true, error: null };
}

export function generateMPLFileName() {
  return `mpl-program-${Date.now()}.mpl`;
}

export function extractMPLMetadata(content: string) {
  const metadata: Record<string, string> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('//')) {
      const match = line.match(/\/\/\s*(\w+):\s*(.+)/);
      if (match) {
        metadata[match[1]] = match[2].trim();
      }
    }
  }
  
  return metadata;
}

// Rule debug types for Stage 1Q
export type VoxelPos = { x: number; y: number; z: number };

export type RuleDebugEntry =
  | { kind: 'start'; ruleId: string }
  | { kind: 'predicate'; ruleId: string; label: string; ok: boolean; details?: any }
  | { kind: 'action'; ruleId: string; desc: string; delta?: any }
  | { kind: 'end'; ruleId: string };

export type RuleDebugTrace = {
  step: number;
  pos: VoxelPos;
  entries: RuleDebugEntry[];
  summary?: { matchedRules: string[] };
};

// Rule hot-reload types for Stage 1S
export type RuleCompilationResult = {
  ok: boolean;
  rules?: any;
  errors?: string[];
};

export type RulesReloadedEvent = {
  at: number;
  sourceHash: string;
  byteSize: number;
};

export type RulesReloadErrorEvent = {
  at: number;
  errors: string[];
};

export const eventBus = {
  on: (event: string, callback: Function) => {
    // Simple event bus mock
    return () => {}; // Return unsubscribe function
  }
};
