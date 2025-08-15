// src/ui/state/metrics.ts
// State management for real-time simulation metrics and charts (Stage 1R)

import React, { createContext, useContext, useReducer, useRef } from 'react';

// Types for metrics data
export interface MetricSample {
  timestamp: number;
  fps: number;
  changedVoxels: number;
  percentChanged: number;
  ruleTriggers: number;
  activeRules: string[];
}

export interface MetricsState {
  samples: MetricSample[];
  currentFPS: number;
  currentChangedVoxels: number;
  currentPercentChanged: number;
  currentRuleTriggers: number;
  bufferSize: number;
  emaSmoothing: number;
  topRules: Array<{ ruleId: string; triggers: number }>;
}

export type MetricsAction =
  | { type: 'ADD_SAMPLE'; sample: MetricSample }
  | { type: 'SET_BUFFER_SIZE'; size: number }
  | { type: 'SET_EMA_SMOOTHING'; smoothing: number }
  | { type: 'UPDATE_TOP_RULES'; rules: Array<{ ruleId: string; triggers: number }> }
  | { type: 'CLEAR_METRICS' };

// Initial state
const initialState: MetricsState = {
  samples: [],
  currentFPS: 0,
  currentChangedVoxels: 0,
  currentPercentChanged: 0,
  currentRuleTriggers: 0,
  bufferSize: 600, // Store 600 samples by default
  emaSmoothing: 0.1, // Exponential moving average smoothing factor
  topRules: [],
};

// Metrics reducer
function metricsReducer(state: MetricsState, action: MetricsAction): MetricsState {
  switch (action.type) {
    case 'ADD_SAMPLE': {
      const newSamples = [...state.samples, action.sample];
      
      // Maintain buffer size limit (ring buffer behavior)
      if (newSamples.length > state.bufferSize) {
        newSamples.splice(0, newSamples.length - state.bufferSize);
      }
      
      // Calculate EMA for current values
      const ema = state.emaSmoothing;
      const currentFPS = state.currentFPS === 0 ? action.sample.fps : 
        (ema * action.sample.fps) + ((1 - ema) * state.currentFPS);
      
      return {
        ...state,
        samples: newSamples,
        currentFPS: Math.round(currentFPS * 100) / 100,
        currentChangedVoxels: action.sample.changedVoxels,
        currentPercentChanged: Math.round(action.sample.percentChanged * 100) / 100,
        currentRuleTriggers: action.sample.ruleTriggers,
      };
    }
    
    case 'SET_BUFFER_SIZE':
      return {
        ...state,
        bufferSize: action.size,
        samples: state.samples.slice(-action.size), // Trim to new size
      };
    
    case 'SET_EMA_SMOOTHING':
      return {
        ...state,
        emaSmoothing: action.smoothing,
      };
    
    case 'UPDATE_TOP_RULES':
      return {
        ...state,
        topRules: action.rules,
      };
    
    case 'CLEAR_METRICS':
      return {
        ...state,
        samples: [],
        currentFPS: 0,
        currentChangedVoxels: 0,
        currentPercentChanged: 0,
        currentRuleTriggers: 0,
        topRules: [],
      };
    
    default:
      return state;
  }
}

// Context for metrics state
interface MetricsContextType {
  state: MetricsState;
  dispatch: React.Dispatch<MetricsAction>;
  addSample: (sample: MetricSample) => void;
  setBufferSize: (size: number) => void;
  setEMASmoothing: (smoothing: number) => void;
  updateTopRules: (rules: Array<{ ruleId: string; triggers: number }>) => void;
  clearMetrics: () => void;
  getChartData: () => Array<{ timestamp: number; fps: number; percentChanged: number }>;
}

const MetricsContext = createContext<MetricsContextType | null>(null);

// Metrics provider component
export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(metricsReducer, initialState);
  
  // Helper functions
  const addSample = (sample: MetricSample) => {
    dispatch({ type: 'ADD_SAMPLE', sample });
  };
  
  const setBufferSize = (size: number) => {
    dispatch({ type: 'SET_BUFFER_SIZE', size });
  };
  
  const setEMASmoothing = (smoothing: number) => {
    dispatch({ type: 'SET_EMA_SMOOTHING', smoothing });
  };
  
  const updateTopRules = (rules: Array<{ ruleId: string; triggers: number }>) => {
    dispatch({ type: 'UPDATE_TOP_RULES', rules });
  };
  
  const clearMetrics = () => {
    dispatch({ type: 'CLEAR_METRICS' });
  };
  
  // Get formatted data for charts
  const getChartData = () => {
    return state.samples.map(sample => ({
      timestamp: sample.timestamp,
      fps: sample.fps,
      percentChanged: sample.percentChanged,
    }));
  };
  
  const contextValue: MetricsContextType = {
    state,
    dispatch,
    addSample,
    setBufferSize,
    setEMASmoothing,
    updateTopRules,
    clearMetrics,
    getChartData,
  };
  
  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
}

// Hook to use metrics context
export function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}
