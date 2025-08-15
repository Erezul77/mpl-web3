// src/ui/components/VoxelInspectorPanel.tsx
import React, { useState, useEffect } from 'react';
import { useVoxelSelection } from '../hooks/useVoxelSelection';
import { visBridge } from '../../engine/visBridge';

export default function VoxelInspectorPanel() {
  const { selection, setSelection } = useVoxelSelection();
  const [voxelData, setVoxelData] = useState<any>(null);

  useEffect(() => {
    if (selection) {
      const snapshot = visBridge.getSnapshot().snapshot;
      if (snapshot && snapshot.getStateAt) {
        const data = snapshot.getStateAt(selection.x, selection.y, selection.z);
        setVoxelData(data);
      }
    }
  }, [selection]);

  if (!selection) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>Voxel Inspector</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>Click a voxel to inspect.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Voxel Inspector</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500', opacity: 0.8 }}>Position</h4>
        <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>
          X: {selection.x}, Y: {selection.y}, Z: {selection.z}
        </div>
      </div>

      {voxelData && (
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500', opacity: 0.8 }}>Data</h4>
          <pre style={{ 
            fontSize: '12px', 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '8px', 
            borderRadius: '4px',
            margin: 0,
            overflow: 'auto',
            maxHeight: '100px'
          }}>
            {JSON.stringify(voxelData, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={() => setSelection(null)}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          background: 'rgba(220, 53, 69, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        Clear Selection
      </button>
    </div>
  );
}
