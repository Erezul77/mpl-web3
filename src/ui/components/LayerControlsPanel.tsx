// src/ui/components/LayerControlsPanel.tsx
// UI toggles + opacity sliders for layer control (Stage 1T)

import React, { useState, useEffect, useCallback } from 'react';
import { useLayerConfig } from '../state/layerConfig';

// Define the layer interface
interface Layer {
  id: string;
  name: string;
  description?: string;
  type: string;
  priority: string;
  visible: boolean;
  opacity: number;
}

export default function LayerControlsPanel() {
  const { 
    state, 
    setLayerVisibility, 
    setLayerOpacity, 
    toggleAllLayers,
    getEffectiveOpacity,
    getEffectiveVisibility
  } = useLayerConfig();
  
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);

  // Mock layers for demo - in real app this would come from the engine
  useEffect(() => {
    setLayers([
      { id: 'layer1', name: 'Base Layer', description: 'Foundation layer', type: 'base', priority: 'high', visible: true, opacity: 1.0 },
      { id: 'layer2', name: 'Detail Layer', description: 'Fine details', type: 'detail', priority: 'medium', visible: true, opacity: 0.8 },
      { id: 'layer3', name: 'Effect Layer', description: 'Visual effects', type: 'effect', priority: 'low', visible: false, opacity: 0.5 }
    ]);
  }, []);

  const handleToggleAll = useCallback(() => {
    const newShowAll = !state.showAllLayers;
    toggleAllLayers(newShowAll);
  }, [state.showAllLayers, toggleAllLayers]);

  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayerOpacity(layerId, opacity);
  }, [setLayerOpacity]);

  const handleVisibilityChange = useCallback((layerId: string, visible: boolean) => {
    setLayerVisibility(layerId, visible);
  }, [setLayerVisibility]);

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Layer Controls</h3>
        <button
          onClick={handleToggleAll}
          style={{
            padding: '6px 12px',
            background: state.showAllLayers ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {state.showAllLayers ? 'Hide All' : 'Show All'}
        </button>
      </div>

      {/* Layer List */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Active Layers</h4>
        {layers.length === 0 ? (
          <div style={{ opacity: 0.6, textAlign: 'center', fontSize: '12px' }}>No layers available</div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {layers.map((layer: Layer) => {
              const effectiveVisible = getEffectiveVisibility(layer.id);
              const effectiveOpacity = getEffectiveOpacity(layer.id);
              
              return (
                <div
                  key={layer.id}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: selectedLayer === layer.id ? '1px solid rgba(0, 123, 255, 0.8)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{layer.name}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ 
                        color: effectiveVisible ? 'rgba(40, 167, 69, 0.9)' : 'rgba(108, 117, 125, 0.8)', 
                        fontSize: '10px' 
                      }}>
                        {effectiveVisible ? 'VISIBLE' : 'HIDDEN'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisibilityChange(layer.id, !effectiveVisible);
                        }}
                        style={{
                          padding: '4px 8px',
                          background: effectiveVisible ? 'rgba(40, 167, 69, 0.8)' : 'rgba(108, 117, 125, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        {effectiveVisible ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    opacity: 0.8,
                    marginBottom: '8px'
                  }}>
                    {layer.description || 'No description'}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>Opacity:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={effectiveOpacity}
                      onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '2px',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '11px', opacity: 0.7, minWidth: '30px' }}>
                      {Math.round(effectiveOpacity * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Layer Properties</h4>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>ID:</strong> {selectedLayer}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong>Type:</strong> {layers.find((l: Layer) => l.id === selectedLayer)?.type || 'Unknown'}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong>Priority:</strong> {layers.find((l: Layer) => l.id === selectedLayer)?.priority || 'Normal'}
            </div>
            <div>
              <strong>Status:</strong> {getEffectiveVisibility(selectedLayer) ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => layers.forEach((layer: Layer) => setLayerOpacity(layer.id, 1))}
            style={{
              padding: '6px 12px',
              background: 'rgba(0, 123, 255, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Full Opacity
          </button>
          <button
            onClick={() => layers.forEach((layer: Layer) => setLayerOpacity(layer.id, 0.5))}
            style={{
              padding: '6px 12px',
              background: 'rgba(108, 117, 125, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Half Opacity
          </button>
          <button
            onClick={() => layers.forEach((layer: Layer) => setLayerOpacity(layer.id, 0.1))}
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 193, 7, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Low Opacity
          </button>
        </div>
      </div>
    </div>
  );
}
