// src/ui/state/ruleEditor.ts
// UI store for rule editor draft text and status (Stage 1S)

import React, { createContext, useContext, useReducer, useState } from 'react';
import type { RuleCompilationResult } from '../../mpl-core-mock';

// Types for rule editor state
export interface RuleEditorState {
  draftText: string;
  compilationResult: RuleCompilationResult | null;
  isCompiling: boolean;
  lastCompilationTime: number | null;
  compilationErrors: string[];
  hasUnsavedChanges: boolean;
}

export type RuleEditorAction =
  | { type: 'SET_DRAFT_TEXT'; text: string }
  | { type: 'SET_COMPILATION_RESULT'; result: RuleCompilationResult }
  | { type: 'SET_COMPILING'; compiling: boolean }
  | { type: 'SET_COMPILATION_ERRORS'; errors: string[] }
  | { type: 'SET_UNSAVED_CHANGES'; hasChanges: boolean }
  | { type: 'CLEAR_DRAFT' }
  | { type: 'LOAD_ACTIVE_SOURCE'; source: string };

// Initial state
const initialState: RuleEditorState = {
  draftText: '',
  compilationResult: null,
  isCompiling: false,
  lastCompilationTime: null,
  compilationErrors: [],
  hasUnsavedChanges: false,
};

// Rule editor reducer
function ruleEditorReducer(state: RuleEditorState, action: RuleEditorAction): RuleEditorState {
  switch (action.type) {
    case 'SET_DRAFT_TEXT':
      return {
        ...state,
        draftText: action.text,
        hasUnsavedChanges: action.text !== state.draftText,
      };
    
    case 'SET_COMPILATION_RESULT':
      return {
        ...state,
        compilationResult: action.result,
        compilationErrors: action.result.ok ? [] : (action.result.errors || []),
        lastCompilationTime: Date.now(),
        isCompiling: false,
      };
    
    case 'SET_COMPILING':
      return {
        ...state,
        isCompiling: action.compiling,
      };
    
    case 'SET_COMPILATION_ERRORS':
      return {
        ...state,
        compilationErrors: action.errors,
        lastCompilationTime: Date.now(),
        isCompiling: false,
      };
    
    case 'SET_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.hasChanges,
      };
    
    case 'CLEAR_DRAFT':
      return {
        ...state,
        draftText: '',
        compilationResult: null,
        compilationErrors: [],
        hasUnsavedChanges: false,
      };
    
    case 'LOAD_ACTIVE_SOURCE':
      return {
        ...state,
        draftText: action.source,
        hasUnsavedChanges: false,
      };
    
    default:
      return state;
  }
}

// Context for rule editor state
interface RuleEditorContextType {
  state: RuleEditorState;
  dispatch: React.Dispatch<RuleEditorAction>;
  setDraftText: (text: string) => void;
  setCompilationResult: (result: RuleCompilationResult) => void;
  setCompiling: (compiling: boolean) => void;
  setCompilationErrors: (errors: string[]) => void;
  clearDraft: () => void;
  loadActiveSource: (source: string) => void;
  hasValidRules: boolean;
  getCompilationStatus: () => 'idle' | 'compiling' | 'success' | 'error';
}

const RuleEditorContext = createContext<RuleEditorContextType | null>(null);

// Rule editor provider component
export function RuleEditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ruleEditorReducer, initialState);
  
  // Helper functions
  const setDraftText = (text: string) => {
    dispatch({ type: 'SET_DRAFT_TEXT', text });
  };
  
  const setCompilationResult = (result: RuleCompilationResult) => {
    dispatch({ type: 'SET_COMPILATION_RESULT', result });
  };
  
  const setCompiling = (compiling: boolean) => {
    dispatch({ type: 'SET_COMPILING', compiling });
  };
  
  const setCompilationErrors = (errors: string[]) => {
    dispatch({ type: 'SET_COMPILATION_ERRORS', errors });
  };
  
  const clearDraft = () => {
    dispatch({ type: 'CLEAR_DRAFT' });
  };
  
  const loadActiveSource = (source: string) => {
    dispatch({ type: 'LOAD_ACTIVE_SOURCE', source });
  };
  
  // Computed values
  const hasValidRules = state.compilationResult?.ok || false;
  
  const getCompilationStatus = (): 'idle' | 'compiling' | 'success' | 'error' => {
    if (state.isCompiling) return 'compiling';
    if (state.compilationResult?.ok) return 'success';
    if (state.compilationErrors.length > 0) return 'error';
    return 'idle';
  };
  
  const contextValue: RuleEditorContextType = {
    state,
    dispatch,
    setDraftText,
    setCompilationResult,
    setCompiling,
    setCompilationErrors,
    clearDraft,
    loadActiveSource,
    hasValidRules,
    getCompilationStatus,
  };
  
  return (
    <RuleEditorContext.Provider value={contextValue}>
      {children}
    </RuleEditorContext.Provider>
  );
}

// Hook to use rule editor context
export function useRuleEditor() {
  const context = useContext(RuleEditorContext);
  if (!context) {
    throw new Error('useRuleEditor must be used within a RuleEditorProvider');
  }
  return context;
}
