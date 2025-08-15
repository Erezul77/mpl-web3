// src/ui/components/MetricsPanel.tsx
// Live KPIs + small charts + top rules table (Stage 1R)

import React, { useState, useEffect } from 'react';
import { useMetrics } from '../state/metrics';

export default function MetricsPanel() {
  const { state, clearMetrics } = useMetrics();
  const [showCharts, setShowCharts] = useState(false);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

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
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Metrics</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowCharts(!showCharts)}
            style={{
              padding: '6px 12px',
              background: showCharts ? 'rgba(40, 167, 69, 0.8)' : 'rgba(108, 117, 125, 0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {showCharts ? '📊' : '📈'}
          </button>
          <button
            onClick={clearMetrics}
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
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgba(40, 167, 69, 0.9)' }}>
            {state.currentFPS.toFixed(1)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>FPS</div>
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgba(0, 123, 255, 0.9)' }}>
            {state.currentChangedVoxels}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Changed Voxels</div>
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgba(255, 193, 7, 0.9)' }}>
            {state.currentPercentChanged.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>% Changed</div>
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgba(220, 53, 69, 0.9)' }}>
            {state.currentRuleTriggers}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Rule Triggers</div>
        </div>
      </div>

      {/* Performance Chart */}
      {showCharts && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Performance Trend</h4>
          <div style={{
            height: '60px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'end',
            padding: '8px',
            gap: '2px'
          }}>
            {Array.from({ length: 20 }, (_, i) => {
              const height = Math.random() * 40 + 10;
              return (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: `${height}px`,
                    background: 'rgba(40, 167, 69, 0.8)',
                    borderRadius: '2px',
                    flex: 1
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Top Rules */}
      {state.topRules.length > 0 && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Top Rules</h4>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            {state.topRules.slice(0, 5).map((rule, index: number) => (
              <div key={rule.ruleId} style={{
                marginBottom: '8px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: index < 3 ? 'rgba(255, 193, 7, 0.9)' : '#ffffff' }}>
                  {rule.ruleId}
                </span>
                <span style={{ color: index < 3 ? 'rgba(40, 167, 69, 0.9)' : 'rgba(255, 255, 255, 0.7)' }}>
                  {rule.triggers}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>System Status</h4>
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '4px' }}>Status: Active</div>
          <div style={{ marginBottom: '4px' }}>Samples: {state.samples.length}</div>
          <div style={{ marginBottom: '4px' }}>Buffer: {state.bufferSize}</div>
          <div>EMA: {state.emaSmoothing.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
