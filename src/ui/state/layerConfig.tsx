// src/ui/state/layerConfig.ts
// UI store for per-layer configuration overrides (Stage 1T)

import React, { createContext, useContext, useReducer } from 'react';
import type { LayerSnapshot } from '../../engine/layersBridge';

// Types for layer configuration
export interface LayerConfig {
  id: string;
  visible: boolean;
  opacity: number;
  colorOverride?: string; // Optional custom color override
}

export interface LayerConfigState {
  layerConfigs: Map<string, LayerConfig>;
  globalOpacity: number;
  showAllLayers: boolean;
}

export type LayerConfigAction =
  | { type: 'SET_LAYER_VISIBILITY'; layerId: string; visible: boolean }
  | { type: 'SET_LAYER_OPACITY'; layerId: string; opacity: number }
  | { type: 'SET_LAYER_COLOR'; layerId: string; color: string | undefined }
  | { type: 'SET_GLOBAL_OPACITY'; opacity: number }
  | { type: 'TOGGLE_ALL_LAYERS'; show: boolean }
  | { type: 'RESET_LAYER_CONFIG'; layerId: string }
  | { type: 'RESET_ALL_CONFIGS' }
  | { type: 'SYNC_LAYERS'; layers: LayerSnapshot[] };

// Initial state
const initialState: LayerConfigState = {
  layerConfigs: new Map(),
  globalOpacity: 1.0,
  showAllLayers: true,
};

// Layer configuration reducer
function layerConfigReducer(state: LayerConfigState, action: LayerConfigAction): LayerConfigState {
  switch (action.type) {
    case 'SET_LAYER_VISIBILITY': {
      const newConfigs = new Map(state.layerConfigs);
      const existing = newConfigs.get(action.layerId);
      
      if (existing) {
        newConfigs.set(action.layerId, { ...existing, visible: action.visible });
      } else {
        newConfigs.set(action.layerId, {
          id: action.layerId,
          visible: action.visible,
          opacity: 1.0,
        });
      }
      
      return { ...state, layerConfigs: newConfigs };
    }
    
    case 'SET_LAYER_OPACITY': {
      const newConfigs = new Map(state.layerConfigs);
      const existing = newConfigs.get(action.layerId);
      
      if (existing) {
        newConfigs.set(action.layerId, { ...existing, opacity: action.opacity });
      } else {
        newConfigs.set(action.layerId, {
          id: action.layerId,
          visible: true,
          opacity: action.opacity,
        });
      }
      
      return { ...state, layerConfigs: newConfigs };
    }
    
    case 'SET_LAYER_COLOR': {
      const newConfigs = new Map(state.layerConfigs);
      const existing = newConfigs.get(action.layerId);
      
      if (existing) {
        newConfigs.set(action.layerId, { ...existing, colorOverride: action.color });
      } else {
        newConfigs.set(action.layerId, {
          id: action.layerId,
          visible: true,
          opacity: 1.0,
          colorOverride: action.color,
        });
      }
      
      return { ...state, layerConfigs: newConfigs };
    }
    
    case 'SET_GLOBAL_OPACITY':
      return { ...state, globalOpacity: action.opacity };
    
    case 'TOGGLE_ALL_LAYERS': {
      const newConfigs = new Map();
      
      // Update all existing configs
      for (const [layerId, config] of state.layerConfigs) {
        newConfigs.set(layerId, { ...config, visible: action.show });
      }
      
      return { ...state, layerConfigs: newConfigs, showAllLayers: action.show };
    }
    
    case 'RESET_LAYER_CONFIG': {
      const newConfigs = new Map(state.layerConfigs);
      newConfigs.delete(action.layerId);
      return { ...state, layerConfigs: newConfigs };
    }
    
    case 'RESET_ALL_CONFIGS':
      return { ...initialState };
    
    case 'SYNC_LAYERS': {
      const newConfigs = new Map();
      
      // Create configs for new layers, preserve existing overrides
      for (const layer of action.layers) {
        const existing = state.layerConfigs.get(layer.id);
        newConfigs.set(layer.id, {
          id: layer.id,
          visible: existing?.visible ?? layer.visible ?? true,
          opacity: existing?.opacity ?? layer.opacity ?? 1.0,
          colorOverride: existing?.colorOverride,
        });
      }
      
      return { ...state, layerConfigs: newConfigs };
    }
    
    default:
      return state;
  }
}

// Context for layer configuration
interface LayerConfigContextType {
  state: LayerConfigState;
  dispatch: React.Dispatch<LayerConfigAction>;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setLayerColor: (layerId: string, color: string | undefined) => void;
  setGlobalOpacity: (opacity: number) => void;
  toggleAllLayers: (show: boolean) => void;
  resetLayerConfig: (layerId: string) => void;
  resetAllConfigs: () => void;
  syncLayers: (layers: LayerSnapshot[]) => void;
  getLayerConfig: (layerId: string) => LayerConfig | undefined;
  getEffectiveOpacity: (layerId: string) => number;
  getEffectiveVisibility: (layerId: string) => boolean;
}

const LayerConfigContext = createContext<LayerConfigContextType | null>(null);

// Layer configuration provider component
export function LayerConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(layerConfigReducer, initialState);
  
  // Helper functions
  const setLayerVisibility = (layerId: string, visible: boolean) => {
    dispatch({ type: 'SET_LAYER_VISIBILITY', layerId, visible });
  };
  
  const setLayerOpacity = (layerId: string, opacity: number) => {
    dispatch({ type: 'SET_LAYER_OPACITY', layerId, opacity });
  };
  
  const setLayerColor = (layerId: string, color: string | undefined) => {
    dispatch({ type: 'SET_LAYER_COLOR', layerId, color });
  };
  
  const setGlobalOpacity = (opacity: number) => {
    dispatch({ type: 'SET_GLOBAL_OPACITY', opacity });
  };
  
  const toggleAllLayers = (show: boolean) => {
    dispatch({ type: 'TOGGLE_ALL_LAYERS', show });
  };
  
  const resetLayerConfig = (layerId: string) => {
    dispatch({ type: 'RESET_LAYER_CONFIG', layerId });
  };
  
  const resetAllConfigs = () => {
    dispatch({ type: 'RESET_ALL_CONFIGS' });
  };
  
  const syncLayers = (layers: LayerSnapshot[]) => {
    dispatch({ type: 'SYNC_LAYERS', layers });
  };
  
  // Computed values
  const getLayerConfig = (layerId: string): LayerConfig | undefined => {
    return state.layerConfigs.get(layerId);
  };
  
  const getEffectiveOpacity = (layerId: string): number => {
    const config = state.layerConfigs.get(layerId);
    const layerOpacity = config?.opacity ?? 1.0;
    return layerOpacity * state.globalOpacity;
  };
  
  const getEffectiveVisibility = (layerId: string): boolean => {
    const config = state.layerConfigs.get(layerId);
    return config?.visible ?? true;
  };
  
  const contextValue: LayerConfigContextType = {
    state,
    dispatch,
    setLayerVisibility,
    setLayerOpacity,
    setLayerColor,
    setGlobalOpacity,
    toggleAllLayers,
    resetLayerConfig,
    resetAllConfigs,
    syncLayers,
    getLayerConfig,
    getEffectiveOpacity,
    getEffectiveVisibility,
  };
  
  return (
    <LayerConfigContext.Provider value={contextValue}>
      {children}
    </LayerConfigContext.Provider>
  );
}

// Hook to use layer configuration context
export function useLayerConfig() {
  const context = useContext(LayerConfigContext);
  if (!context) {
    throw new Error('useLayerConfig must be used within a LayerConfigProvider');
  }
  return context;
}
