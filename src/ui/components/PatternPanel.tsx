// src/ui/components/PatternPanel.tsx
// Pattern Import/Export Panel (Stage 1U)

import React, { useRef, useState } from 'react';
import { usePatternUI } from '../state/patternUI';
import { patternIO, PatternIO } from '../../engine/patternIO';
import { pngToPattern, validatePNGFile, getDefaultHeightmapParams } from '../utils/pngToPattern';
import type { Pattern, SingleLayerPattern, MultiLayerPattern } from '../../engine/patternIO';
import type { HeightmapParams } from '../utils/pngToPattern';

export default function PatternPanel() {
  const { state, dispatch } = usePatternUI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pngInputRef = useRef<HTMLInputElement>(null);
  const [importedPattern, setImportedPattern] = useState<Pattern | null>(null);

  // Export current grid/layers to JSON
  const handleExport = () => {
    dispatch({ type: 'SET_EXPORTING', payload: true });
    
    try {
      const snapshot = patternIO.getCurrentSnapshot();
      if (!snapshot) {
        dispatch({ type: 'SET_ERROR', payload: 'No data to export' });
        return;
      }

      let pattern: Pattern;
      
      if (snapshot.kind === 'layers') {
        // Export multi-layer pattern
        pattern = {
          schema: 'mpl.pattern.layers.v1',
          layers: snapshot.layers.map(layer => ({
            id: layer.id,
            name: layer.name || layer.id,
            size: layer.size,
            channel: PatternIO.encodeChannel(layer.channel),
            meta: layer.meta || {}
          })),
          meta: {
            createdAt: Date.now(),
            description: 'Exported from MPL Playground'
          }
        };
      } else {
        // Export single-layer pattern
        const singleSnapshot = snapshot.snapshot;
        pattern = {
          schema: 'mpl.pattern.v1',
          size: singleSnapshot.size,
          channel: PatternIO.encodeChannel(singleSnapshot.channel),
          meta: {
            name: 'Grid Pattern',
            createdAt: Date.now(),
            description: 'Exported from MPL Playground'
          }
        };
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(pattern, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mpl-pattern-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Export failed: ${error}` });
    } finally {
      dispatch({ type: 'SET_EXPORTING', payload: false });
    }
  };

  // Import JSON pattern
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch({ type: 'SET_IMPORTING', payload: true });
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const pattern: Pattern = JSON.parse(content);
        
        // Validate pattern schema
        if (pattern.schema !== 'mpl.pattern.v1' && pattern.schema !== 'mpl.pattern.layers.v1') {
          throw new Error('Invalid pattern schema');
        }

        setImportedPattern(pattern);
        
        // Set preview info
        if (pattern.schema === 'mpl.pattern.v1') {
          const singlePattern = pattern as SingleLayerPattern;
          dispatch({
            type: 'SET_IMPORT_PREVIEW',
            payload: {
              size: singlePattern.size,
              name: singlePattern.meta.name || 'Imported Pattern',
              type: 'json'
            }
          });
        } else {
          const multiPattern = pattern as MultiLayerPattern;
          const firstLayer = multiPattern.layers[0];
          dispatch({
            type: 'SET_IMPORT_PREVIEW',
            payload: {
              size: firstLayer.size,
              name: multiPattern.meta.description || 'Multi-Layer Pattern',
              type: 'json'
            }
          });
        }
        
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: `Import failed: ${error}` });
      } finally {
        dispatch({ type: 'SET_IMPORTING', payload: false });
      }
    };
    
    reader.readAsText(file);
  };

  // Import PNG heightmap
  const handleImportPNG = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validatePNGFile(file)) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid PNG file' });
      return;
    }

    dispatch({ type: 'SET_IMPORTING', payload: true });
    
    try {
      const heightmapParams = state.options.heightmapParams;
      const result = await pngToPattern(file, heightmapParams);
      
      // Create single-layer pattern from heightmap
      const pattern: SingleLayerPattern = {
        schema: 'mpl.pattern.v1',
        size: result.size,
        channel: PatternIO.encodeChannel(result.channel),
        meta: {
          name: file.name.replace(/\.[^/.]+$/, ''),
          createdAt: Date.now(),
          description: 'Imported from PNG heightmap'
        }
      };

      setImportedPattern(pattern);
      
      dispatch({
        type: 'SET_IMPORT_PREVIEW',
        payload: {
          size: result.size,
          name: pattern.meta.name || 'Heightmap Pattern',
          type: 'png'
        }
      });
      
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `PNG import failed: ${error}` });
    } finally {
      dispatch({ type: 'SET_IMPORTING', payload: false });
    }
  };

  // Apply imported pattern
  const handleApplyPattern = () => {
    if (!importedPattern) return;

    const success = patternIO.applyPattern(importedPattern, {
      origin: state.options.origin,
      targetLayer: state.options.targetLayer,
      mergeMode: state.options.mergeMode
    });

    if (success) {
      dispatch({ type: 'SET_ERROR', payload: null });
      setImportedPattern(null);
      dispatch({ type: 'SET_IMPORT_PREVIEW', payload: null });
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to apply pattern' });
    }
  };

  // Update heightmap parameters
  const updateHeightmapParams = (updates: Partial<HeightmapParams>) => {
    dispatch({ type: 'SET_HEIGHTMAP_PARAMS', payload: updates });
  };

  return (
    <div style={{ 
      padding: '15px', 
      background: 'rgba(255, 255, 255, 0.1)', 
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: 'rgba(255, 255, 255, 0.9)' }}>
        🎨 Pattern I/O
      </h4>

      {/* Export Section */}
      <div style={{ marginBottom: '20px' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Export Current State
        </h5>
        <button
          onClick={handleExport}
          disabled={state.isExporting}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(40, 167, 69, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.isExporting ? 'not-allowed' : 'pointer',
            opacity: state.isExporting ? 0.6 : 1
          }}
        >
          {state.isExporting ? 'Exporting...' : 'Export to JSON'}
        </button>
      </div>

      {/* Import JSON Section */}
      <div style={{ marginBottom: '20px' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Import JSON Pattern
        </h5>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={state.isImporting}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(0, 123, 255, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.isImporting ? 'not-allowed' : 'pointer',
            opacity: state.isImporting ? 0.6 : 1
          }}
        >
          {state.isImporting ? 'Importing...' : 'Import JSON Pattern'}
        </button>
      </div>

      {/* Import PNG Section */}
      <div style={{ marginBottom: '20px' }}>
        <h5 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
          Import PNG Heightmap
        </h5>
        <input
          ref={pngInputRef}
          type="file"
          accept="image/*"
          onChange={handleImportPNG}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => pngInputRef.current?.click()}
          disabled={state.isImporting}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(111, 66, 193, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.isImporting ? 'not-allowed' : 'pointer',
            opacity: state.isImporting ? 0.6 : 1
          }}
        >
          {state.isImporting ? 'Importing...' : 'Import PNG Heightmap'}
        </button>

        {/* Heightmap Parameters */}
        <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
          <div style={{ marginBottom: '8px' }}>
            <label>Z Depth: {state.options.heightmapParams.zDepth}</label>
            <input
              type="range"
              min="1"
              max="16"
              value={state.options.heightmapParams.zDepth}
              onChange={(e) => updateHeightmapParams({ zDepth: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label>Threshold: {state.options.heightmapParams.threshold}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={state.options.heightmapParams.threshold}
              onChange={(e) => updateHeightmapParams({ threshold: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={state.options.heightmapParams.invert}
              onChange={(e) => updateHeightmapParams({ invert: e.target.checked })}
              style={{ marginRight: '5px' }}
            />
            Invert
          </label>
        </div>
      </div>

      {/* Import Preview */}
      {state.importPreview && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px'
        }}>
          <h6 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Preview: {state.importPreview.name}
          </h6>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Size: {state.importPreview.size?.x} × {state.importPreview.size?.y} × {state.importPreview.size?.z}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Type: {state.importPreview.type?.toUpperCase()}
          </div>
        </div>
      )}

      {/* Apply Options */}
      {state.importPreview && (
        <div style={{ marginBottom: '20px' }}>
          <h6 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Apply Options
          </h6>
          
          {/* Origin */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.8)' }}>Origin X:</label>
            <input
              type="number"
              value={state.options.origin.x}
              onChange={(e) => dispatch({
                type: 'SET_ORIGIN',
                payload: { ...state.options.origin, x: parseInt(e.target.value) || 0 }
              })}
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
          
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.8)' }}>Origin Y:</label>
            <input
              type="number"
              value={state.options.origin.y}
              onChange={(e) => dispatch({
                type: 'SET_ORIGIN',
                payload: { ...state.options.origin, y: parseInt(e.target.value) || 0 }
              })}
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

          {/* Merge Mode */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', display: 'block', color: 'rgba(255, 255, 255, 0.8)' }}>Merge Mode:</label>
            <select
              value={state.options.mergeMode}
              onChange={(e) => dispatch({
                type: 'SET_MERGE_MODE',
                payload: e.target.value as any
              })}
              style={{ 
                width: '100%', 
                padding: '4px', 
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff'
              }}
            >
              <option value="replace">Replace</option>
              <option value="add">Add</option>
              <option value="max">Max</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyPattern}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(220, 53, 69, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Apply Pattern
          </button>
        </div>
      )}

      {/* Error Display */}
      {state.lastError && (
        <div style={{
          padding: '8px',
          background: 'rgba(220, 53, 69, 0.2)',
          color: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '10px'
        }}>
          {state.lastError}
        </div>
      )}
    </div>
  );
}
