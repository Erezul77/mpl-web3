// src/engine/visBridge.ts
// Minimal bridge between MPL engine state and UI visualization.
// Mock implementation to avoid mpl-core dependency issues

export type VisSnapshot = {
  size: { x: number; y: number; z: number };
  channel: Uint8Array; // flattened x-major: i = x + y*sx + z*sx*sy
  getStateAt?: (x: number, y: number, z: number) => Record<string, any> | undefined;
};

class VisBridge {
  private provider: (() => VisSnapshot) | null = null;
  private tickVersion = 0;
  private overrideSnapshot: VisSnapshot | null = null;

  setSnapshotProvider(fn: () => VisSnapshot) {
    this.provider = fn;
  }

  hasProvider() { return !!this.provider; }

  getSnapshot(): { version: number; snapshot?: VisSnapshot } {
    return { version: this.tickVersion, snapshot: this.overrideSnapshot ?? this.provider?.() };
  }

  // Mock event handling
  onTick() { this.tickVersion++; }
  onSimulationStop() { this.tickVersion++; }

  setExternalSnapshot(s: VisSnapshot | null) {
    this.overrideSnapshot = s;
    this.tickVersion++;
  }
}

export const visBridge = new VisBridge();
