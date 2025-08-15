// src/engine/layersBridge.ts
// Engine↔UI bridge for multiple layers (Stage 1T) - Simplified version

import { eventBus } from '../mpl-core-mock';

// Types for multi-layer support
export type LayerSnapshot = {
  id: string;                 // stable id
  name: string;               // display name
  visible?: boolean;          // default visibility (UI can override)
  opacity?: number;           // default 0..1 (UI can override)
  size: { x: number; y: number; z: number };
  channel: Uint8Array;        // length = x*y*z (0..255), color-mapped client-side
  getStateAt?: (x: number, y: number, z: number) => Record<string, any> | undefined;
};

class LayersBridge {
  private provider: (() => LayerSnapshot[]) | null = null;
  private tickVersion = 0;
  private lastLayers: LayerSnapshot[] = [];

  setProvider(fn: () => LayerSnapshot[]) {
    this.provider = fn;
  }

  hasProvider(): boolean {
    return !!this.provider;
  }

  getLayers(): { version: number; layers: LayerSnapshot[] } {
    if (!this.provider) {
      return { version: this.tickVersion, layers: [] };
    }

    try {
      const layers = this.provider();
      this.lastLayers = layers;
      return { version: this.tickVersion, layers };
    } catch (error) {
      console.warn('LayersBridge provider error:', error);
      return { version: this.tickVersion, layers: this.lastLayers };
    }
  }

  getLayerStats(): {
    totalLayers: number;
    totalVoxels: number;
    memoryUsage: number;
    hasValidDimensions: boolean;
  } {
    const { layers } = this.getLayers();
    const totalLayers = layers.length;
    const totalVoxels = layers.reduce((sum, layer) => {
      const { x, y, z } = layer.size;
      return sum + (x * y * z);
    }, 0);
    const memoryUsage = layers.reduce((sum, layer) => sum + layer.channel.byteLength, 0);
    const hasValidDimensions = this.validateLayerDimensions();

    return {
      totalLayers,
      totalVoxels,
      memoryUsage,
      hasValidDimensions
    };
  }

  validateLayerDimensions(): boolean {
    const { layers } = this.getLayers();
    if (layers.length <= 1) return true;

    const firstSize = layers[0].size;
    return layers.every(layer => 
      layer.size.x === firstSize.x && 
      layer.size.y === firstSize.y && 
      layer.size.z === firstSize.z
    );
  }

  getCommonSize(): { x: number; y: number; z: number } | null {
    const { layers } = this.getLayers();
    if (layers.length === 0) return null;
    return layers[0].size;
  }

  constructor() {
    // Advance version on every tick for UI updates
    eventBus.on('tick', () => { 
      this.tickVersion++; 
    });
    
    // Also advance on simulation stop for UI refresh
    eventBus.on('simulationStop', () => { 
      this.tickVersion++; 
    });
  }
}

export const layersBridge = new LayersBridge();
