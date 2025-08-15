// src/ui/state/ruleVersioning.tsx
// State management for Rule Versioning (Stage 1Y)

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  ruleVersionManager, 
  type RuleVersion, 
  type RuleSnapshot, 
  type VersionDiff,
  type VersionHistory 
} from '../../rules/ruleVersioning';

export type RuleVersioningCtx = {
  // Current state
  currentVersion?: RuleVersion;
  versions: RuleVersion[];
  snapshots: RuleSnapshot[];
  
  // UI state
  selectedVersionId?: string;
  showDiffView: boolean;
  diffResult?: VersionDiff;
  searchQuery: string;
  selectedTags: string[];
  
  // Actions
  createVersion: (mplCode: string, name: string, description?: string, parameters?: Record<string, number>, tags?: string[]) => RuleVersion;
  createAutoSave: (mplCode: string, parameters?: Record<string, number>) => RuleVersion;
  createSnapshot: (gridState: any, parameters: Record<string, number>, executionContext: any) => RuleSnapshot;
  selectVersion: (versionId: string) => void;
  revertToVersion: (versionId: string) => RuleVersion | null;
  compareVersions: (versionId1: string, versionId2: string) => void;
  deleteVersion: (versionId: string) => boolean;
  updateVersionMetadata: (versionId: string, updates: Partial<RuleVersion['metadata']>) => boolean;
  
  // Filtering and search
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  getFilteredVersions: () => RuleVersion[];
  
  // Export/Import
  exportHistory: () => string;
  importHistory: (jsonData: string) => boolean;
  
  // Statistics
  getStats: () => any;
  
  // Settings
  toggleAutoSave: () => void;
  setMaxVersions: (max: number) => void;
  setMaxSnapshots: (max: number) => void;
};

const RuleVersioningContext = createContext<RuleVersioningCtx | null>(null);

export function RuleVersioningProvider({ children }: { children: React.ReactNode }) {
  const [currentVersion, setCurrentVersion] = useState<RuleVersion>();
  const [versions, setVersions] = useState<RuleVersion[]>([]);
  const [snapshots, setSnapshots] = useState<RuleSnapshot[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [showDiffView, setShowDiffView] = useState(false);
  const [diffResult, setDiffResult] = useState<VersionDiff>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Initialize from manager
  useEffect(() => {
    const current = ruleVersionManager.getCurrentVersion();
    if (current) {
      setCurrentVersion(current);
      setSelectedVersionId(current.id);
    }
    
    setVersions(ruleVersionManager.getAllVersions());
    // Note: Snapshots will be loaded when needed
  }, []);

  // Create a new version
  const createVersion = useCallback((
    mplCode: string, 
    name: string, 
    description: string = "", 
    parameters: Record<string, number> = {}, 
    tags: string[] = []
  ): RuleVersion => {
    const version = ruleVersionManager.createVersion(mplCode, name, description, parameters, tags);
    setCurrentVersion(version);
    setSelectedVersionId(version.id);
    setVersions(ruleVersionManager.getAllVersions());
    
    console.log(`📝 Version created: ${name}`);
    return version;
  }, []);

  // Create an auto-save
  const createAutoSave = useCallback((mplCode: string, parameters: Record<string, number> = {}): RuleVersion => {
    const autoSave = ruleVersionManager.createAutoSave(mplCode, parameters);
    setVersions(ruleVersionManager.getAllVersions());
    
    console.log(`💾 Auto-save created`);
    return autoSave;
  }, []);

  // Create a snapshot
  const createSnapshot = useCallback((
    gridState: any, 
    parameters: Record<string, number>, 
    executionContext: any
  ): RuleSnapshot => {
    if (!currentVersion) {
      throw new Error('No current version to create snapshot for');
    }
    
    const snapshot = ruleVersionManager.createSnapshot(
      currentVersion.id,
      {
        width: gridState.width || 50,
        height: gridState.height || 50,
        depth: gridState.depth || 1,
        activeVoxels: gridState.activeVoxels || 0,
        patternHash: gridState.patternHash || 'unknown',
        size: {
          x: gridState.width || 50,
          y: gridState.height || 50,
          z: gridState.depth || 1
        }
      },
      parameters,
      {
        stepCount: executionContext.stepCount || 0,
        runtime: executionContext.runtime || 0,
        memoryUsage: executionContext.memoryUsage || 0
      },
      0 // ruleCount
    );
    
    // Note: Snapshots are managed internally by the manager
    // We'll update the local state when needed
    
    console.log(`📸 Snapshot created for version: ${currentVersion.name}`);
    return snapshot;
  }, [currentVersion]);

  // Select a version
  const selectVersion = useCallback((versionId: string) => {
    const version = ruleVersionManager.getVersion(versionId);
    if (version) {
      setSelectedVersionId(versionId);
      console.log(`🎯 Selected version: ${version.name}`);
    }
  }, []);

  // Revert to a version
  const revertToVersion = useCallback((versionId: string): RuleVersion | null => {
    const reverted = ruleVersionManager.revertToVersion(versionId);
    if (reverted) {
      setCurrentVersion(reverted);
      setSelectedVersionId(reverted.id);
      setVersions(ruleVersionManager.getAllVersions());
      console.log(`⏪ Reverted to version: ${reverted.name}`);
    }
    return reverted;
  }, []);

  // Compare versions
  const compareVersions = useCallback((versionId1: string, versionId2: string) => {
    const diff = ruleVersionManager.compareVersions(versionId1, versionId2);
    if (diff) {
      setDiffResult(diff);
      setShowDiffView(true);
      console.log(`🔍 Version comparison: ${diff.summary}`);
    }
  }, []);

  // Delete a version
  const deleteVersion = useCallback((versionId: string): boolean => {
    const success = ruleVersionManager.deleteVersion(versionId);
    if (success) {
      setVersions(ruleVersionManager.getAllVersions());
      if (selectedVersionId === versionId) {
        setSelectedVersionId(undefined);
      }
      console.log(`🗑️ Version deleted: ${versionId}`);
    }
    return success;
  }, [selectedVersionId]);

  // Update version metadata
  const updateVersionMetadata = useCallback((
    versionId: string, 
    updates: Partial<RuleVersion['metadata']>
  ): boolean => {
    const success = ruleVersionManager.updateVersionMetadata(versionId, updates);
    if (success) {
      setVersions(ruleVersionManager.getAllVersions());
      if (currentVersion?.id === versionId) {
        setCurrentVersion(ruleVersionManager.getVersion(versionId));
      }
      console.log(`📊 Metadata updated for version: ${versionId}`);
    }
    return success;
  }, [currentVersion]);

  // Get filtered versions
  const getFilteredVersions = useCallback((): RuleVersion[] => {
    let filtered = versions;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(v => 
        selectedTags.some(tag => v.tags.includes(tag))
      );
    }
    
    return filtered;
  }, [versions, searchQuery, selectedTags]);

  // Export history
  const exportHistory = useCallback((): string => {
    const data = ruleVersionManager.exportHistory();
    console.log(`📤 History exported`);
    return data;
  }, []);

  // Import history
  const importHistory = useCallback((jsonData: string): boolean => {
    const success = ruleVersionManager.importHistory(jsonData);
    if (success) {
      setVersions(ruleVersionManager.getAllVersions());
      setCurrentVersion(ruleVersionManager.getCurrentVersion());
      console.log(`📥 History imported successfully`);
    } else {
      console.error(`❌ Failed to import history`);
    }
    return success;
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    return ruleVersionManager.getStats();
  }, []);

  // Toggle auto-save
  const toggleAutoSave = useCallback(() => {
    // This would update the manager's auto-save setting
    console.log(`🔄 Auto-save toggled`);
  }, []);

  // Set max versions
  const setMaxVersions = useCallback((max: number) => {
    // This would update the manager's max versions setting
    console.log(`📊 Max versions set to: ${max}`);
  }, []);

  // Set max snapshots
  const setMaxSnapshots = useCallback((max: number) => {
    // This would update the manager's max snapshots setting
    console.log(`📊 Max snapshots set to: ${max}`);
  }, []);

  const value: RuleVersioningCtx = {
    currentVersion,
    versions,
    snapshots,
    selectedVersionId,
    showDiffView,
    diffResult,
    searchQuery,
    selectedTags,
    createVersion,
    createAutoSave,
    createSnapshot,
    selectVersion,
    revertToVersion,
    compareVersions,
    deleteVersion,
    updateVersionMetadata,
    setSearchQuery,
    setSelectedTags,
    getFilteredVersions,
    exportHistory,
    importHistory,
    getStats,
    toggleAutoSave,
    setMaxVersions,
    setMaxSnapshots
  };

  return (
    <RuleVersioningContext.Provider value={value}>
      {children}
    </RuleVersioningContext.Provider>
  );
}

export function useRuleVersioning(): RuleVersioningCtx {
  const context = useContext(RuleVersioningContext);
  if (!context) {
    throw new Error('useRuleVersioning must be used within a RuleVersioningProvider');
  }
  return context;
}
