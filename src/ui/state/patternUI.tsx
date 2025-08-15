// src/ui/state/patternUI.tsx
// Pattern UI state management (Stage 1U)

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { HeightmapParams } from '../utils/pngToPattern';

export type MergeMode = 'replace' | 'add' | 'max';

export type PatternUIOptions = {
  origin: { x: number; y: number; z: number };
  targetLayer: string;
  mergeMode: MergeMode;
  heightmapParams: HeightmapParams;
};

export type PatternUIState = {
  options: PatternUIOptions;
  importPreview: {
    size: { x: number; y: number; z: number } | null;
    name: string;
    type: 'json' | 'png' | null;
  } | null;
  isImporting: boolean;
  isExporting: boolean;
  lastError: string | null;
};

export type PatternUIAction =
  | { type: 'SET_ORIGIN'; payload: { x: number; y: number; z: number } }
  | { type: 'SET_TARGET_LAYER'; payload: string }
  | { type: 'SET_MERGE_MODE'; payload: MergeMode }
  | { type: 'SET_HEIGHTMAP_PARAMS'; payload: Partial<HeightmapParams> }
  | { type: 'SET_IMPORT_PREVIEW'; payload: PatternUIState['importPreview'] }
  | { type: 'SET_IMPORTING'; payload: boolean }
  | { type: 'SET_EXPORTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_OPTIONS' };

const initialState: PatternUIState = {
  options: {
    origin: { x: 0, y: 0, z: 0 },
    targetLayer: 'base',
    mergeMode: 'replace',
    heightmapParams: {
      zDepth: 8,
      threshold: 128,
      invert: false
    }
  },
  importPreview: null,
  isImporting: false,
  isExporting: false,
  lastError: null
};

function patternUIReducer(state: PatternUIState, action: PatternUIAction): PatternUIState {
  switch (action.type) {
    case 'SET_ORIGIN':
      return {
        ...state,
        options: {
          ...state.options,
          origin: action.payload
        }
      };
    
    case 'SET_TARGET_LAYER':
      return {
        ...state,
        options: {
          ...state.options,
          targetLayer: action.payload
        }
      };
    
    case 'SET_MERGE_MODE':
      return {
        ...state,
        options: {
          ...state.options,
          mergeMode: action.payload
        }
      };
    
    case 'SET_HEIGHTMAP_PARAMS':
      return {
        ...state,
        options: {
          ...state.options,
          heightmapParams: {
            ...state.options.heightmapParams,
            ...action.payload
          }
        }
      };
    
    case 'SET_IMPORT_PREVIEW':
      return {
        ...state,
        importPreview: action.payload
      };
    
    case 'SET_IMPORTING':
      return {
        ...state,
        isImporting: action.payload
      };
    
    case 'SET_EXPORTING':
      return {
        ...state,
        isExporting: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        lastError: action.payload
      };
    
    case 'RESET_OPTIONS':
      return {
        ...state,
        options: initialState.options
      };
    
    default:
      return state;
  }
}

const PatternUIContext = createContext<{
  state: PatternUIState;
  dispatch: React.Dispatch<PatternUIAction>;
} | null>(null);

export function PatternUIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(patternUIReducer, initialState);

  return (
    <PatternUIContext.Provider value={{ state, dispatch }}>
      {children}
    </PatternUIContext.Provider>
  );
}

export function usePatternUI() {
  const context = useContext(PatternUIContext);
  if (!context) {
    throw new Error('usePatternUI must be used within a PatternUIProvider');
  }
  return context;
}
