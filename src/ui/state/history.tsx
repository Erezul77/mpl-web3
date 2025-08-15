// src/ui/state/history.ts
// State management for timeline and playback functionality

import React, { createContext, useContext, useReducer, useRef } from 'react';
import { VisSnapshot } from '../../engine/visBridge';

// Types for history state
export interface HistoryFrame {
  id: number;
  snapshot: VisSnapshot;
  timestamp: number;
  step: number;
}

export interface HistoryState {
  frames: HistoryFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  isFollowingLive: boolean;
  capacity: number;
  stride: number;
  useCompression: boolean;
}

export type HistoryAction =
  | { type: 'ADD_FRAME'; frame: HistoryFrame }
  | { type: 'SET_CURRENT_FRAME'; index: number }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_FOLLOWING_LIVE'; following: boolean }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_CAPACITY'; capacity: number }
  | { type: 'SET_STRIDE'; stride: number }
  | { type: 'SET_COMPRESSION'; useCompression: boolean };

// Initial state
const initialState: HistoryState = {
  frames: [],
  currentFrameIndex: -1,
  isPlaying: false,
  isFollowingLive: true,
  capacity: 600, // Store 600 frames by default
  stride: 1,     // Record every tick
  useCompression: true, // Use RLE compression by default
};

// History reducer
function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'ADD_FRAME': {
      const newFrames = [...state.frames, action.frame];
      
      // Maintain capacity limit (ring buffer behavior)
      if (newFrames.length > state.capacity) {
        newFrames.splice(0, newFrames.length - state.capacity);
      }
      
      return {
        ...state,
        frames: newFrames,
        currentFrameIndex: state.isFollowingLive ? newFrames.length - 1 : state.currentFrameIndex,
      };
    }
    
    case 'SET_CURRENT_FRAME':
      return {
        ...state,
        currentFrameIndex: Math.max(-1, Math.min(action.index, state.frames.length - 1)),
      };
    
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.playing,
      };
    
    case 'SET_FOLLOWING_LIVE':
      return {
        ...state,
        isFollowingLive: action.following,
        currentFrameIndex: action.following ? state.frames.length - 1 : state.currentFrameIndex,
      };
    
    case 'CLEAR_HISTORY':
      return {
        ...state,
        frames: [],
        currentFrameIndex: -1,
      };
    
    case 'SET_CAPACITY':
      return {
        ...state,
        capacity: action.capacity,
        frames: state.frames.slice(-action.capacity), // Trim to new capacity
        currentFrameIndex: Math.min(state.currentFrameIndex, action.capacity - 1),
      };
    
    case 'SET_STRIDE':
      return {
        ...state,
        stride: action.stride,
      };
    
    case 'SET_COMPRESSION':
      return {
        ...state,
        useCompression: action.useCompression,
      };
    
    default:
      return state;
  }
}

// Context for history state
interface HistoryContextType {
  state: HistoryState;
  dispatch: React.Dispatch<HistoryAction>;
  addFrame: (snapshot: VisSnapshot, step: number) => void;
  goToFrame: (index: number) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  followLive: () => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);

// History provider component
export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  
  // Helper functions
  const addFrame = (snapshot: VisSnapshot, step: number) => {
    const frame: HistoryFrame = {
      id: Date.now(),
      snapshot,
      timestamp: Date.now(),
      step,
    };
    dispatch({ type: 'ADD_FRAME', frame });
  };
  
  const goToFrame = (index: number) => {
    dispatch({ type: 'SET_CURRENT_FRAME', index });
  };
  
  const play = () => {
    dispatch({ type: 'SET_PLAYING', playing: true });
  };
  
  const pause = () => {
    dispatch({ type: 'SET_PLAYING', playing: false });
  };
  
  const stepForward = () => {
    const nextIndex = Math.min(state.currentFrameIndex + 1, state.frames.length - 1);
    dispatch({ type: 'SET_CURRENT_FRAME', index: nextIndex });
  };
  
  const stepBackward = () => {
    const prevIndex = Math.max(state.currentFrameIndex - 1, -1);
    dispatch({ type: 'SET_CURRENT_FRAME', index: prevIndex });
  };
  
  const followLive = () => {
    dispatch({ type: 'SET_FOLLOWING_LIVE', following: true });
  };
  
  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };
  
  const contextValue: HistoryContextType = {
    state,
    dispatch,
    addFrame,
    goToFrame,
    play,
    pause,
    stepForward,
    stepBackward,
    followLive,
    clearHistory,
  };
  
  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

// Hook to use history context
export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
