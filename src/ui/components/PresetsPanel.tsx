// src/ui/components/PresetsPanel.tsx
// Presets Panel for Stage 1V

import React, { useState } from 'react';
import { usePresets } from '../state/presets';

export default function PresetsPanel() {
  const { presets, lastStatus, gridSize, setGridSize, loadPreset, searchPresets } = usePresets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeed, setSelectedSeed] = useState(42);

  const filteredPresets = searchPresets(searchQuery);

  const handleLoadPattern = (presetId: string) => {
    loadPreset(presetId, { seed: selectedSeed });
  };

  const handleLoadPatternAndRules = (presetId: string) => {
    loadPreset(presetId, { applyRules: true, seed: selectedSeed });
  };

  return (
    <div style={{ 
      padding: '15px', 
      background: 'rgba(255, 255, 255, 0.1)', 
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: 'rgba(255, 255, 255, 0.9)' }}>
        🎯 Preset Library
      </h4>

      {/* Search */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search presets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff'
          }}
        />
      </div>

      {/* Grid Size Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Grid Size
        </h5>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>X:</label>
            <input
              type="number"
              min="8"
              max="128"
              value={gridSize.x}
              onChange={(e) => setGridSize({ ...gridSize, x: parseInt(e.target.value) || 32 })}
              style={{ 
                width: '100%', 
                padding: '4px', 
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>Y:</label>
            <input
              type="number"
              min="8"
              max="128"
              value={gridSize.y}
              onChange={(e) => setGridSize({ ...gridSize, y: parseInt(e.target.value) || 32 })}
              style={{ 
                width: '100%', 
                padding: '4px', 
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>Z:</label>
            <input
              type="number"
              min="1"
              max="32"
              value={gridSize.z}
              onChange={(e) => setGridSize({ ...gridSize, z: parseInt(e.target.value) || 8 })}
              style={{ 
                width: '100%', 
                padding: '4px', 
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.7)' }}>Seed:</label>
          <input
            type="number"
            value={selectedSeed}
            onChange={(e) => setSelectedSeed(parseInt(e.target.value) || 42)}
            style={{ 
              width: '100%', 
              padding: '4px', 
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Presets List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredPresets.map(preset => (
          <div key={preset.id} style={{
            marginBottom: '15px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px'
          }}>
            <h6 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
              {preset.title}
            </h6>
            
            <p style={{ 
              margin: '0 0 8px 0', 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.4'
            }}>
              {preset.description}
            </p>
            
            <div style={{ marginBottom: '10px' }}>
              {preset.tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  margin: '0 4px 4px 0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  fontSize: '10px'
                }}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleLoadPattern(preset.id)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: 'rgba(0, 123, 255, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Load Pattern
              </button>
              
              {preset.rulesSource && (
                <button
                  onClick={() => handleLoadPatternAndRules(preset.id)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    background: 'rgba(40, 167, 69, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Pattern + Rules
                </button>
              )}
            </div>
          </div>
        ))}
        
        {filteredPresets.length === 0 && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }}>
            No presets found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Status */}
      {lastStatus && (
        <div style={{
          marginTop: '15px',
          padding: '8px',
          background: lastStatus.includes('failed') ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.2)',
          color: lastStatus.includes('failed') ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          {lastStatus}
        </div>
      )}

      {/* Info */}
      <div style={{
        marginTop: '15px',
        padding: '8px',
        background: 'rgba(0, 123, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '4px',
        fontSize: '11px',
        textAlign: 'center'
      }}>
        💡 Click any preset to instantly load amazing patterns!
      </div>
    </div>
  );
}
