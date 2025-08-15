// src/engine/patternIO.ts
// Engine-side pattern I/O system (Stage 1U)

export type PatternSize = { x: number; y: number; z: number };

export type SingleLayerPattern = {
  schema: 'mpl.pattern.v1';
  size: PatternSize;
  channel: string; // base64 encoded Uint8Array
  meta: {
    name?: string;
    createdAt?: number;
    description?: string;
  };
};

export type MultiLayerPattern = {
  schema: 'mpl.pattern.layers.v1';
  layers: Array<{
    id: string;
    name: string;
    size: PatternSize;
    channel: string; // base64 encoded Uint8Array
    meta: Record<string, any>;
  }>;
  meta: {
    createdAt?: number;
    description?: string;
  };
};

export type Pattern = SingleLayerPattern | MultiLayerPattern;

export type ApplyOptions = {
  origin: { x: number; y: number; z: number };
  targetLayer?: string; // for multi-layer patterns
  mergeMode: 'replace' | 'add' | 'max';
};

export type PatternSnapshot = 
  | { kind: 'single'; snapshot: any }
  | { kind: 'layers'; layers: any[] };

class PatternIO {
  private applyHandler: ((pattern: Pattern, options: ApplyOptions) => boolean) | null = null;
  private snapshotProvider: (() => PatternSnapshot | null) | null = null;

  /**
   * Set the handler that applies patterns to the engine
   */
  setApplyHandler(handler: (pattern: Pattern, options: ApplyOptions) => boolean) {
    this.applyHandler = handler;
  }

  /**
   * Set the provider that returns current grid/layer snapshots
   */
  setSnapshotProvider(provider: () => PatternSnapshot | null) {
    this.snapshotProvider = provider;
  }

  /**
   * Apply a pattern to the engine
   */
  applyPattern(pattern: Pattern, options: ApplyOptions): boolean {
    if (!this.applyHandler) {
      console.warn('PatternIO: No apply handler set');
      return false;
    }

    try {
      return this.applyHandler(pattern, options);
    } catch (error) {
      console.error('PatternIO: Error applying pattern:', error);
      return false;
    }
  }

  /**
   * Get current grid/layer snapshot for export
   */
  getCurrentSnapshot(): PatternSnapshot | null {
    if (!this.snapshotProvider) {
      console.warn('PatternIO: No snapshot provider set');
      return null;
    }

    try {
      return this.snapshotProvider();
    } catch (error) {
      console.error('PatternIO: Error getting snapshot:', error);
      return null;
    }
  }

  /**
   * Check if pattern I/O is properly configured
   */
  isConfigured(): boolean {
    return !!this.applyHandler && !!this.snapshotProvider;
  }

  /**
   * Utility: Decode base64 channel data to Uint8Array
   */
  static decodeChannel(base64Data: string): Uint8Array {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error('PatternIO: Error decoding base64 channel:', error);
      return new Uint8Array(0);
    }
  }

  /**
   * Utility: Encode Uint8Array to base64
   */
  static encodeChannel(channel: Uint8Array): string {
    try {
      let binaryString = '';
      for (let i = 0; i < channel.length; i++) {
        binaryString += String.fromCharCode(channel[i]);
      }
      return btoa(binaryString);
    } catch (error) {
      console.error('PatternIO: Error encoding channel to base64:', error);
      return '';
    }
  }
}

export { PatternIO };
export const patternIO = new PatternIO();
