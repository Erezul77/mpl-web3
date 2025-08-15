// src/ui/components/RuleDebuggerPanel.tsx
// Live trace viewer + "Watch selected voxel" + optional "Step once" (Stage 1Q)

import React, { useState, useEffect, useCallback } from 'react';
import { ruleDebug } from '../../engine/ruleDebug';

export default function RuleDebuggerPanel() {
  const [targetVoxel, setTargetVoxel] = useState<{ x: number; y: number; z: number } | null>(null);
  const [watchedVoxels, setWatchedVoxels] = useState<Array<{ x: number; y: number; z: number }>>([]);
  const [traces, setTraces] = useState<any[]>([]);
  const [isWatching, setIsWatching] = useState(false);

  // Mock data for demo - in real app this would come from the engine
  useEffect(() => {
    if (targetVoxel) {
      // Simulate watching a voxel
      setIsWatching(true);
      setWatchedVoxels(prev => [...prev, targetVoxel]);
    }
  }, [targetVoxel]);

  const watchVoxel = useCallback((x: number, y: number, z: number) => {
    ruleDebug.setTarget({ x, y, z });
    setIsWatching(true);
  }, []);

  const unwatchVoxel = useCallback((x: number, y: number, z: number) => {
    ruleDebug.clearTarget();
    setIsWatching(false);
    setWatchedVoxels(prev => prev.filter(v => !(v.x === x && v.y === y && v.z === z)));
  }, []);

  const getWatchedVoxels = useCallback(() => {
    return watchedVoxels;
  }, [watchedVoxels]);

  const getRuleTraces = useCallback((x: number, y: number, z: number) => {
    // Mock traces - in real app this would come from the engine
    return [
      { ruleId: 'rule1', timestamp: Date.now(), result: 'matched' },
      { ruleId: 'rule2', timestamp: Date.now() - 1000, result: 'skipped' }
    ];
  }, []);

  const clearTraces = useCallback(() => {
    setTraces([]);
  }, []);

  const isWatchingVoxel = useCallback((x: number, y: number, z: number) => {
    return watchedVoxels.some(v => v.x === x && v.y === y && v.z === z);
  }, [watchedVoxels]);

  const handleWatchVoxel = useCallback(() => {
    if (targetVoxel) {
      watchVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z);
    }
  }, [targetVoxel, watchVoxel]);

  const handleUnwatchVoxel = useCallback(() => {
    if (targetVoxel) {
      unwatchVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z);
    }
  }, [targetVoxel, unwatchVoxel]);

  const handleClearTraces = useCallback(() => {
    clearTraces();
    setTraces([]);
  }, [clearTraces]);

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
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Rule Debugger</h3>
        <button
          onClick={handleClearTraces}
          style={{
            padding: '6px 12px',
            background: 'rgba(220, 53, 69, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Clear
        </button>
      </div>

      {/* Target Voxel */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Target Voxel</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', opacity: 0.8 }}>
          Click a voxel in the 3D grid to select it
        </p>
        
        {targetVoxel ? (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <input
              type="number"
              value={targetVoxel.x}
              onChange={(e) => setTargetVoxel(prev => prev ? { ...prev, x: Number(e.target.value) } : null)}
              placeholder="X"
              style={{
                width: '50px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '12px',
                textAlign: 'center'
              }}
            />
            <input
              type="number"
              value={targetVoxel.y}
              onChange={(e) => setTargetVoxel(prev => prev ? { ...prev, y: Number(e.target.value) } : null)}
              placeholder="Y"
              style={{
                width: '50px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '12px',
                textAlign: 'center'
              }}
            />
            <input
              type="number"
              value={targetVoxel.z}
              onChange={(e) => setTargetVoxel(prev => prev ? { ...prev, z: Number(e.target.value) } : null)}
              placeholder="Z"
              style={{
                width: '50px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '12px',
                textAlign: 'center'
              }}
            />
          </div>
        ) : (
          <div style={{
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            fontSize: '12px',
            opacity: 0.6,
            textAlign: 'center'
          }}>
            No voxel selected
          </div>
        )}

        {targetVoxel && (
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={handleWatchVoxel}
              disabled={isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z)}
              style={{
                padding: '6px 12px',
                background: isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z) ? 'rgba(40, 167, 69, 0.8)' : 'rgba(0, 123, 255, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z) ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z) ? 'Watching' : 'Watch'}
            </button>
            
            <button
              onClick={handleUnwatchVoxel}
              disabled={!isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z)}
              style={{
                padding: '6px 12px',
                background: !isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(220, 53, 69, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !isWatchingVoxel(targetVoxel.x, targetVoxel.y, targetVoxel.z) ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              Unwatch
            </button>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '4px' }}>
          Status: {targetVoxel ? 'Active' : 'Idle'}
        </div>
        <div style={{ marginBottom: '4px' }}>
          Target: {targetVoxel ? `(${targetVoxel.x}, ${targetVoxel.y}, ${targetVoxel.z})` : 'None'}
        </div>
        <div>
          Traces: {traces.length}
        </div>
      </div>

      {/* Watched Voxels */}
      {watchedVoxels.length > 0 && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Watched Voxels</h4>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {watchedVoxels.map((voxel, index) => (
              <div key={index} style={{
                padding: '6px 8px',
                marginBottom: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}>
                ({voxel.x}, {voxel.y}, {voxel.z})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rule Traces */}
      {traces.length > 0 && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Rule Traces</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {traces.map((trace, index) => (
              <div key={index} style={{
                padding: '8px',
                marginBottom: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                <div style={{ marginBottom: '4px', fontWeight: '500' }}>
                  Rule: {trace.ruleId}
                </div>
                <div style={{ marginBottom: '4px', opacity: 0.8 }}>
                  Time: {new Date(trace.timestamp).toLocaleTimeString()}
                </div>
                <div style={{ opacity: 0.7 }}>
                  Result: {trace.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
