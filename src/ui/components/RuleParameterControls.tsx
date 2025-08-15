// src/ui/components/RuleParameterControls.tsx
// Rule Parameter Controls Component

import React, { useState } from 'react';
import type { RuleTemplate } from '../../rules/ruleTemplates';

interface RuleParameterControlsProps {
  template: RuleTemplate | null;
  onParameterChange: (name: string, value: number) => void;
  className?: string;
}

export function RuleParameterControls({ template, onParameterChange, className }: RuleParameterControlsProps) {
  const [localValues, setLocalValues] = useState<Record<string, number>>({});

  if (!template || !template.parameters || template.parameters.length === 0) {
    return (
      <div style={{
        padding: '16px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        ...(className ? { className } : {})
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎛️</div>
        <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Parameters</p>
        <p style={{ fontSize: '14px' }}>
          This template doesn't have configurable parameters
        </p>
      </div>
    );
  }

  const handleValueChange = (paramName: string, value: number) => {
    setLocalValues(prev => ({ ...prev, [paramName]: value }));
    onParameterChange(paramName, value);
  };

  const handleReset = () => {
    setLocalValues({});
    template.parameters?.forEach(param => {
      onParameterChange(param.name, param.defaultValue);
    });
  };

  const handleRandomize = () => {
    template.parameters?.forEach(param => {
      const randomValue = Math.random() * (param.max - param.min) + param.min;
      const roundedValue = Math.round(randomValue * 100) / 100;
      handleValueChange(param.name, roundedValue);
    });
  };

  const getCurrentValue = (paramName: string): number => {
    return localValues[paramName] ?? template.parameters?.find(p => p.name === paramName)?.defaultValue ?? 0;
  };

  const getParameterColor = (param: NonNullable<RuleTemplate['parameters']>[0]): string => {
    const value = getCurrentValue(param.name);
    const normalizedValue = (value - param.min) / (param.max - param.min);
    
    if (normalizedValue < 0.3) return 'rgba(34, 197, 94, 0.8)';      // Green for low values
    if (normalizedValue < 0.7) return 'rgba(245, 158, 11, 0.8)';     // Yellow for medium values
    return 'rgba(239, 68, 68, 0.8)';                                 // Red for high values
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: '0 0 12px 0'
        }}>
          Parameter Controls
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '0 0 16px 0'
        }}>
          Adjust {template.parameters?.length || 0} parameter{(template.parameters?.length || 0) !== 1 ? 's' : ''} to customize the rule behavior
        </p>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'rgba(107, 114, 128, 0.2)',
              color: 'rgba(156, 163, 175, 0.9)',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.2)'}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleRandomize}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: 'rgba(196, 181, 253, 0.9)',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
          >
            Randomize Values
          </button>
        </div>
      </div>

      {/* Parameters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {template.parameters?.map(parameter => {
          const currentValue = getCurrentValue(parameter.name);
          const normalizedValue = (currentValue - parameter.min) / (parameter.max - parameter.min);
          
          return (
            <div key={parameter.name} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {/* Parameter Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {parameter.name}
                </label>
                <span style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  background: getParameterColor(parameter),
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}>
                  {currentValue}
                </span>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 12px 0',
                lineHeight: '1.4'
              }}>
                {parameter.description}
              </p>

              {/* Slider */}
              <div style={{ marginBottom: '8px' }}>
                <input
                  type="range"
                  min={parameter.min}
                  max={parameter.max}
                  step={parameter.step}
                  value={currentValue}
                  onChange={(e) => handleValueChange(parameter.name, parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Min/Max Labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <span>Min: {parameter.min}</span>
                <span>Max: {parameter.max}</span>
              </div>

              {/* Value Input */}
              <div style={{ marginTop: '8px' }}>
                <input
                  type="number"
                  min={parameter.min}
                  max={parameter.max}
                  step={parameter.step}
                  value={currentValue}
                  onChange={(e) => handleValueChange(parameter.name, parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    fontSize: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#ffffff'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: '0 0 8px 0'
        }}>
          💡 Parameters update in real-time as you adjust them
        </p>
        <p style={{
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.6)',
          margin: 0
        }}>
          Changes are applied instantly to the active rule
        </p>
      </div>
    </div>
  );
}
