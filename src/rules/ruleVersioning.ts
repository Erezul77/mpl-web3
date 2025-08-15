// src/rules/ruleVersioning.ts
// Rule Versioning & History for Stage 1Y

export type RuleVersion = {
  id: string;
  timestamp: number;
  name: string;
  description: string;
  mplCode: string;
  parameters?: Record<string, number>;
  tags: string[];
  isAutoSave: boolean;
  parentVersionId?: string; // For branching
  isActive: boolean; // Whether this version is currently active
  createdAt: number; // Creation timestamp
  changes: string[]; // List of change descriptions
  metadata: {
    author?: string;
    executionCount: number;
    lastExecuted?: number;
    performance?: {
      avgExecutionTime: number;
      memoryUsage: number;
    };
  };
};

export type RuleSnapshot = {
  id: string;
  versionId: string;
  timestamp: number;
  versionName: string; // Name of the version when snapshot was taken
  ruleCount: number; // Number of rules in the snapshot
  capturedAt: number; // When the snapshot was captured
  gridState: {
    width: number;
    height: number;
    depth: number;
    activeVoxels: number;
    patternHash: string; // For quick comparison
    size: { x: number; y: number; z: number }; // Grid dimensions
  };
  parameters: Record<string, number>;
  executionContext: {
    stepCount: number;
    runtime: number;
    memoryUsage: number;
  };
};

export type VersionHistory = {
  versions: RuleVersion[];
  snapshots: RuleSnapshot[];
  currentVersionId?: string;
  autoSaveEnabled: boolean;
  maxVersions: number;
  maxSnapshots: number;
};

export type VersionDiff = {
  fromVersion: string; // Source version name
  toVersion: string; // Target version name
  changes: string[]; // List of change descriptions
  codeChanges: Array<{ type: 'added' | 'removed' | 'modified'; content: string }>; // Code change details
  addedLines: number[];
  removedLines: number[];
  modifiedLines: number[];
  parameterChanges: Record<string, { old: number; new: number }>;
  summary: string;
};

// Version management utilities
export class RuleVersionManager {
  private history: VersionHistory;

  constructor() {
    this.history = {
      versions: [],
      snapshots: [],
      autoSaveEnabled: true,
      maxVersions: 50,
      maxSnapshots: 100
    };
  }

  // Create a new version
  createVersion(
    mplCode: string,
    name: string,
    description: string = "",
    parameters: Record<string, number> = {},
    tags: string[] = [],
    parentVersionId?: string
  ): RuleVersion {
    const version: RuleVersion = {
      id: this.generateId(),
      timestamp: Date.now(),
      name,
      description,
      mplCode,
      parameters,
      tags,
      isAutoSave: false,
      parentVersionId,
      isActive: false, // New property
      createdAt: Date.now(), // New property
      changes: [], // New property
      metadata: {
        executionCount: 0,
        performance: {
          avgExecutionTime: 0,
          memoryUsage: 0
        }
      }
    };

    this.history.versions.push(version);
    this.history.currentVersionId = version.id;
    
    // Cleanup old versions if needed
    this.cleanupOldVersions();
    
    return version;
  }

  // Create an auto-save version
  createAutoSave(mplCode: string, parameters: Record<string, number> = {}): RuleVersion {
    const autoSave: RuleVersion = {
      id: this.generateId(),
      timestamp: Date.now(),
      name: `Auto-save ${new Date().toLocaleTimeString()}`,
      description: "Automatically saved version",
      mplCode,
      parameters,
      tags: ["auto-save"],
      isAutoSave: true,
      isActive: false, // New property
      createdAt: Date.now(), // New property
      changes: [], // New property
      metadata: {
        executionCount: 0,
        performance: {
          avgExecutionTime: 0,
          memoryUsage: 0
        }
      }
    };

    this.history.versions.push(autoSave);
    this.cleanupOldVersions();
    
    return autoSave;
  }

  // Create a snapshot of current state
  createSnapshot(
    versionId: string,
    gridState: Omit<RuleSnapshot['gridState'], 'size'> & { size: { x: number; y: number; z: number } },
    parameters: Record<string, number>,
    executionContext: RuleSnapshot['executionContext'],
    ruleCount: number = 0
  ): RuleSnapshot {
    const snapshot: RuleSnapshot = {
      id: this.generateId(),
      versionId,
      timestamp: Date.now(),
      versionName: this.getVersion(versionId)?.name || "Unknown Version",
      ruleCount,
      capturedAt: Date.now(),
      gridState: {
        ...gridState,
        size: gridState.size
      },
      parameters,
      executionContext
    };

    this.history.snapshots.push(snapshot);
    this.cleanupOldSnapshots();
    
    return snapshot;
  }

  // Get version by ID
  getVersion(versionId: string): RuleVersion | undefined {
    return this.history.versions.find(v => v.id === versionId);
  }

  // Get current version
  getCurrentVersion(): RuleVersion | undefined {
    if (!this.history.currentVersionId) return undefined;
    return this.getVersion(this.history.currentVersionId);
  }

  // Get all versions
  getAllVersions(): RuleVersion[] {
    return [...this.history.versions].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get versions by tag
  getVersionsByTag(tag: string): RuleVersion[] {
    return this.history.versions.filter(v => v.tags.includes(tag));
  }

  // Get version history (branch)
  getVersionHistory(versionId: string): RuleVersion[] {
    const history: RuleVersion[] = [];
    let current = this.getVersion(versionId);
    
    while (current) {
      history.unshift(current);
      current = current.parentVersionId ? this.getVersion(current.parentVersionId) : undefined;
    }
    
    return history;
  }

  // Compare two versions
  compareVersions(versionId1: string, versionId2: string): VersionDiff | null {
    const v1 = this.getVersion(versionId1);
    const v2 = this.getVersion(versionId2);
    
    if (!v1 || !v2) return null;

    const lines1 = v1.mplCode.split('\n');
    const lines2 = v2.mplCode.split('\n');
    
    const addedLines: number[] = [];
    const removedLines: number[] = [];
    const modifiedLines: number[] = [];
    
    // Simple line-by-line comparison
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      if (i >= lines1.length) {
        addedLines.push(i);
      } else if (i >= lines2.length) {
        removedLines.push(i);
      } else if (lines1[i] !== lines2[i]) {
        modifiedLines.push(i);
      }
    }

    // Parameter changes
    const parameterChanges: Record<string, { old: number; new: number }> = {};
    const allParams = new Set([...Object.keys(v1.parameters || {}), ...Object.keys(v2.parameters || {})]);
    
    for (const param of allParams) {
      const oldVal = v1.parameters?.[param];
      const newVal = v2.parameters?.[param];
      if (oldVal !== newVal) {
        parameterChanges[param] = { old: oldVal || 0, new: newVal || 0 };
      }
    }

    const summary = `Added ${addedLines.length} lines, removed ${removedLines.length} lines, modified ${modifiedLines.length} lines, ${Object.keys(parameterChanges).length} parameter changes`;

    return {
      fromVersion: v1.name,
      toVersion: v2.name,
      changes: [], // No specific change descriptions for this simplified comparison
      codeChanges: [], // No specific code change details for this simplified comparison
      addedLines,
      removedLines,
      modifiedLines,
      parameterChanges,
      summary
    };
  }

  // Revert to a previous version
  revertToVersion(versionId: string): RuleVersion | null {
    const targetVersion = this.getVersion(versionId);
    if (!targetVersion) return null;

    // Create a new version based on the target
    const revertedVersion = this.createVersion(
      targetVersion.mplCode,
      `${targetVersion.name} (Reverted)`,
      `Reverted from ${targetVersion.name}`,
      targetVersion.parameters,
      [...targetVersion.tags, "reverted"],
      targetVersion.id
    );

    return revertedVersion;
  }

  // Update version metadata
  updateVersionMetadata(versionId: string, updates: Partial<RuleVersion['metadata']>): boolean {
    const version = this.getVersion(versionId);
    if (!version) return false;

    Object.assign(version.metadata, updates);
    return true;
  }

  // Delete a version
  deleteVersion(versionId: string): boolean {
    const index = this.history.versions.findIndex(v => v.id === versionId);
    if (index === -1) return false;

    // Remove associated snapshots
    this.history.snapshots = this.history.snapshots.filter(s => s.versionId !== versionId);
    
    // Remove the version
    this.history.versions.splice(index, 1);
    
    // Update current version if needed
    if (this.history.currentVersionId === versionId) {
      this.history.currentVersionId = this.history.versions[this.history.versions.length - 1]?.id;
    }
    
    return true;
  }

  // Export version history
  exportHistory(): string {
    return JSON.stringify(this.history, null, 2);
  }

  // Import version history
  importHistory(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (this.validateHistory(imported)) {
        this.history = imported;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Get statistics
  getStats() {
    const totalVersions = this.history.versions.length;
    const autoSaveCount = this.history.versions.filter(v => v.isAutoSave).length;
    const manualVersions = totalVersions - autoSaveCount;
    const totalSnapshots = this.history.snapshots.length;
    const oldestVersion = this.history.versions.length > 0 ? Math.min(...this.history.versions.map(v => v.timestamp)) : 0;
    const newestVersion = this.history.versions.length > 0 ? Math.max(...this.history.versions.map(v => v.timestamp)) : 0;

    return {
      totalVersions,
      autoSaveCount,
      manualVersions,
      totalSnapshots,
      oldestVersion,
      newestVersion,
      timeSpan: newestVersion - oldestVersion
    };
  }

  // Private methods
  private generateId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private cleanupOldVersions(): void {
    if (this.history.versions.length > this.history.maxVersions) {
      // Keep manual versions, remove oldest auto-saves
      const manualVersions = this.history.versions.filter(v => !v.isAutoSave);
      const autoSaveVersions = this.history.versions.filter(v => v.isAutoSave);
      
      if (autoSaveVersions.length > this.history.maxVersions - manualVersions.length) {
        const toRemove = autoSaveVersions
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, autoSaveVersions.length - (this.history.maxVersions - manualVersions.length));
        
        toRemove.forEach(v => this.deleteVersion(v.id));
      }
    }
  }

  private cleanupOldSnapshots(): void {
    if (this.history.snapshots.length > this.history.maxSnapshots) {
      const toRemove = this.history.snapshots
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, this.history.snapshots.length - this.history.maxSnapshots);
      
      toRemove.forEach(s => {
        const index = this.history.snapshots.findIndex(snap => snap.id === s.id);
        if (index !== -1) {
          this.history.snapshots.splice(index, 1);
        }
      });
    }
  }

  private validateHistory(history: any): history is VersionHistory {
    return (
      history &&
      Array.isArray(history.versions) &&
      Array.isArray(history.snapshots) &&
      typeof history.autoSaveEnabled === 'boolean' &&
      typeof history.maxVersions === 'number' &&
      typeof history.maxSnapshots === 'number'
    );
  }
}

// Export singleton instance
export const ruleVersionManager = new RuleVersionManager();
