// src/ui/components/VersionDiffViewer.tsx
// Version Diff Viewer Component

import React from 'react';
import type { VersionDiff } from '../../rules/ruleVersioning';

interface VersionDiffViewerProps {
  diff: VersionDiff;
  onClose: () => void;
}

export function VersionDiffViewer({ diff, onClose }: VersionDiffViewerProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '800px',
        maxHeight: '90vh',
        width: '90vw',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Version Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
          {/* Change Summary */}
          <div style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 12px 0',
              fontSize: '16px'
            }}>
              Change Summary
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 0 12px 0',
              lineHeight: '1.5'
            }}>
              {diff.summary}
            </p>
            
            {/* Metadata */}
            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <span>From: {diff.fromVersion}</span>
              <span>To: {diff.toVersion}</span>
              <span>Changes: {diff.changes.length}</span>
            </div>
          </div>

          {/* Parameter Changes */}
          {diff.parameterChanges && Object.keys(diff.parameterChanges).length > 0 && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 12px 0',
                fontSize: '16px'
              }}>
                Parameter Changes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(diff.parameterChanges).map(([paramName, values]) => (
                  <div key={paramName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px'
                    }}>
                      {paramName}: {values.old} → {values.new}
                    </span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '16px'
                    }}>
                      →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Changes */}
          {diff.codeChanges && diff.codeChanges.length > 0 && (
            <div style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 12px 0',
                fontSize: '16px'
              }}>
                Code Changes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diff.codeChanges.map((change, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12px',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}>
                    {change.type === 'added' && (
                      <span style={{ color: 'rgba(34, 197, 94, 0.9)' }}>+ {change.content}</span>
                    )}
                    {change.type === 'removed' && (
                      <span style={{ color: 'rgba(239, 68, 68, 0.9)' }}>- {change.content}</span>
                    )}
                    {change.type === 'modified' && (
                      <span style={{ color: 'rgba(245, 158, 11, 0.9)' }}>~ {change.content}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Changes Message */}
          {(!diff.parameterChanges || Object.keys(diff.parameterChanges).length === 0) && 
           (!diff.codeChanges || diff.codeChanges.length === 0) && (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Changes Detected</p>
              <p style={{ fontSize: '14px' }}>
                The versions appear to be identical
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'rgba(107, 114, 128, 0.8)',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(107, 114, 128, 0.8)'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
