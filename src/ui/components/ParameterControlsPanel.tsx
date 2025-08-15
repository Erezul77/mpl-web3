// src/ui/components/ParameterControlsPanel.tsx
// Parameter Controls Panel for Stage 1X

import React from 'react';
import { useParameterControls } from '../state/parameterControls';
import { RuleParameterControls } from './RuleParameterControls';

export function ParameterControlsPanel() {
  const { 
    currentTemplate, 
    hasParameters, 
    parameterCount,
    exportParameters,
    importParameters
  } = useParameterControls();

  const handleParameterChange = (parameterName: string, value: number) => {
    // This will be handled by the context
    console.log(`🎛️ Parameter changed: ${parameterName} = ${value}`);
  };

  const handleExport = () => {
    try {
      const jsonData = exportParameters();
      navigator.clipboard.writeText(jsonData);
      console.log('📋 Parameters copied to clipboard');
      // You could add a toast notification here
    } catch (error) {
      console.error('❌ Failed to export parameters:', error);
    }
  };

  const handleImport = () => {
    // Create a file input for importing parameters
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonString = e.target?.result as string;
            const success = importParameters(jsonString);
            if (success) {
              console.log('✅ Parameters imported successfully');
            } else {
              console.error('❌ Failed to import parameters');
            }
          } catch (error) {
            console.error('❌ Error reading parameter file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!hasParameters) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px 8px 0 0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '8px',
            margin: 0
          }}>
            Parameter Controls
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Interactive controls for rule template parameters
          </p>
        </div>

        {/* No Parameters Message */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px'
        }}>
          <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎛️</div>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Active Template</p>
            <p style={{ fontSize: '14px' }}>
              Load a rule template from the Rule Templates panel to see parameter controls
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px 8px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Parameter Controls
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: 'rgba(34, 197, 94, 0.2)',
                color: 'rgba(134, 239, 172, 0.9)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'}
            >
              Export
            </button>
            <button
              onClick={handleImport}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: 'rgba(147, 197, 253, 0.9)',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
            >
              Import
            </button>
          </div>
        </div>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          {parameterCount} parameter{parameterCount !== 1 ? 's' : ''} available for adjustment
        </p>
      </div>

      {/* Parameter Controls */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <RuleParameterControls
          template={currentTemplate || null}
          onParameterChange={handleParameterChange}
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0 0 8px 8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center'
        }}>
          <span>Real-time parameter adjustment</span>
          <span>Changes apply instantly</span>
        </div>
      </div>
    </div>
  );
}
