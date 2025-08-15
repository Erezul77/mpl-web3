// src/ui/state/presets.ts
// Presets state management for Stage 1V

import React, { createContext, useContext, useState } from 'react';
import { PRESETS, Preset } from '../../presets/presets';
import { patternIO, PatternIO } from '../../engine/patternIO';

type PresetsCtx = {
  presets: Preset[];
  lastStatus: string;
  gridSize: { x: number; y: number; z: number };
  setGridSize: (s: { x: number; y: number; z: number }) => void;
  loadPreset: (id: string, opts?: { applyRules?: boolean; seed?: number }) => void;
  searchPresets: (query: string) => Preset[];
};

const Ctx = createContext<PresetsCtx | null>(null);

export function PresetsProvider({ children }: { children: React.ReactNode }) {
  const [lastStatus, setLastStatus] = useState('');
  const [gridSize, setGridSize] = useState({ x: 32, y: 32, z: 8 });

  const loadPreset = (id: string, opts?: { applyRules?: boolean; seed?: number }) => {
    const p = PRESETS.find(p => p.id === id);
    if (!p) { 
      setLastStatus('Preset not found.'); 
      return; 
    }

    try {
      // 1) Generate and apply pattern
      const result = p.generate({ ...gridSize, seed: opts?.seed });
      
      // Encode the channel data
      const encodedPattern = {
        ...result.pattern,
        channel: PatternIO.encodeChannel(result.channel)
      };
      
      const success = patternIO.applyPattern(encodedPattern, { 
        origin: { x: 0, y: 0, z: 0 }, 
        mergeMode: 'replace' 
      });
      
      if (success) {
        setLastStatus(`Pattern "${p.title}" applied successfully!`);
      } else {
        setLastStatus('Pattern apply failed.');
        return;
      }
      
      // 2) Optional rules (for now, just show in console)
      if (opts?.applyRules && p.rulesSource) {
        console.log('Rules for preset:', p.title);
        console.log(p.rulesSource);
        setLastStatus(`Pattern applied + rules loaded (see console).`);
      }
      
    } catch (e: any) {
      setLastStatus('Pattern apply failed: ' + (e?.message || e));
      return;
    }
  };

  const searchPresets = (query: string): Preset[] => {
    if (!query.trim()) return PRESETS;
    
    const lowerQuery = query.toLowerCase();
    return PRESETS.filter(preset => 
      preset.title.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const value: PresetsCtx = {
    presets: PRESETS,
    lastStatus,
    gridSize, 
    setGridSize,
    loadPreset,
    searchPresets
  };
  
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePresets() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePresets must be used within PresetsProvider');
  return ctx;
}
