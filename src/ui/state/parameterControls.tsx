// src/ui/state/parameterControls.tsx
// State management for Parameter Controls (Stage 1X)

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { RuleTemplate } from '../../rules/ruleTemplates';

export type ParameterState = {
  [parameterName: string]: number;
};

export type ParameterControlsCtx = {
  // Current template and its parameters
  currentTemplate?: RuleTemplate;
  parameterValues: ParameterState;
  
  // Actions
  setCurrentTemplate: (template: RuleTemplate) => void;
  updateParameter: (parameterName: string, value: number) => void;
  resetToDefaults: () => void;
  randomizeParameters: () => void;
  loadParameterSet: (parameters: ParameterState) => void;
  
  // Utility functions
  getParameterValue: (parameterName: string) => number;
  hasParameters: boolean;
  parameterCount: number;
  
  // Export/Import
  exportParameters: () => string;
  importParameters: (jsonString: string) => boolean;
};

const ParameterControlsContext = createContext<ParameterControlsCtx | null>(null);

export function ParameterControlsProvider({ children }: { children: React.ReactNode }) {
  const [currentTemplate, setCurrentTemplateState] = useState<RuleTemplate>();
  const [parameterValues, setParameterValues] = useState<ParameterState>({});

  // Set current template and initialize parameters
  const setCurrentTemplate = useCallback((template: RuleTemplate) => {
    setCurrentTemplateState(template);
    
    // Initialize parameters with default values
    if (template.parameters) {
      const initialValues: ParameterState = {};
      template.parameters.forEach(param => {
        initialValues[param.name] = param.defaultValue;
      });
      setParameterValues(initialValues);
    } else {
      setParameterValues({});
    }
  }, []);

  // Update a single parameter
  const updateParameter = useCallback((parameterName: string, value: number) => {
    setParameterValues(prev => ({ ...prev, [parameterName]: value }));
    
    // Log parameter change for debugging
    console.log(`🎛️ Parameter updated: ${parameterName} = ${value}`);
  }, []);

  // Reset all parameters to defaults
  const resetToDefaults = useCallback(() => {
    if (currentTemplate?.parameters) {
      const defaultValues: ParameterState = {};
      currentTemplate.parameters.forEach(param => {
        defaultValues[param.name] = param.defaultValue;
      });
      setParameterValues(defaultValues);
      console.log('🔄 Parameters reset to defaults');
    }
  }, [currentTemplate]);

  // Randomize all parameters
  const randomizeParameters = useCallback(() => {
    if (currentTemplate?.parameters) {
      const randomValues: ParameterState = {};
      currentTemplate.parameters.forEach(param => {
        const randomValue = param.min + Math.random() * (param.max - param.min);
        const steppedValue = Math.round(randomValue / param.step) * param.step;
        const clampedValue = Math.max(param.min, Math.min(param.max, steppedValue));
        randomValues[param.name] = clampedValue;
      });
      setParameterValues(randomValues);
      console.log('🎲 Parameters randomized');
    }
  }, [currentTemplate]);

  // Load a complete parameter set
  const loadParameterSet = useCallback((parameters: ParameterState) => {
    setParameterValues(parameters);
    console.log('📥 Parameter set loaded:', parameters);
  }, []);

  // Get current value of a parameter
  const getParameterValue = useCallback((parameterName: string): number => {
    return parameterValues[parameterName] ?? 0;
  }, [parameterValues]);

  // Check if current template has parameters
  const hasParameters = Boolean(currentTemplate?.parameters && currentTemplate.parameters.length > 0);

  // Count of parameters
  const parameterCount = currentTemplate?.parameters?.length ?? 0;

  // Export parameters to JSON
  const exportParameters = useCallback((): string => {
    const exportData = {
      template: currentTemplate?.title,
      templateId: currentTemplate?.id,
      parameters: parameterValues,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }, [currentTemplate, parameterValues]);

  // Import parameters from JSON
  const importParameters = useCallback((jsonString: string): boolean => {
    try {
      const importData = JSON.parse(jsonString);
      
      if (importData.parameters && typeof importData.parameters === 'object') {
        // Validate that all imported parameters exist in current template
        if (currentTemplate?.parameters) {
          const validParameters: ParameterState = {};
          let isValid = true;
          
          for (const [name, value] of Object.entries(importData.parameters)) {
            const paramDef = currentTemplate.parameters.find(p => p.name === name);
            if (paramDef && typeof value === 'number') {
              // Clamp value to valid range
              const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value as number));
              validParameters[name] = clampedValue;
            } else {
              console.warn(`⚠️ Invalid parameter: ${name}`);
              isValid = false;
            }
          }
          
          if (isValid) {
            setParameterValues(validParameters);
            console.log('📥 Parameters imported successfully');
            return true;
          }
        }
      }
      
      console.error('❌ Invalid parameter file format');
      return false;
    } catch (error) {
      console.error('❌ Failed to parse parameter file:', error);
      return false;
    }
  }, [currentTemplate]);

  const value: ParameterControlsCtx = {
    currentTemplate,
    parameterValues,
    setCurrentTemplate,
    updateParameter,
    resetToDefaults,
    randomizeParameters,
    loadParameterSet,
    getParameterValue,
    hasParameters,
    parameterCount,
    exportParameters,
    importParameters
  };

  return (
    <ParameterControlsContext.Provider value={value}>
      {children}
    </ParameterControlsContext.Provider>
  );
}

export function useParameterControls(): ParameterControlsCtx {
  const context = useContext(ParameterControlsContext);
  if (!context) {
    throw new Error('useParameterControls must be used within a ParameterControlsProvider');
  }
  return context;
}
