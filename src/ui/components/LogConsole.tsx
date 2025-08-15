import React from 'react';
import { useLogs } from '../state/logStore';

export default function LogConsole() {
  const { logs } = useLogs();
  
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        opacity: 0.9
      }}>
        Log Console
      </div>
      
      <div style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.4'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#E5E7EB', textAlign: 'center', padding: '20px', fontSize: '14px' }}>
            No logs yet.
          </div>
        ) : (
          logs.slice(-300).map((e, i) => (
            <div key={i} style={{
              marginBottom: '8px',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              ...getLogLevelStyle(e.level)
            }}>
              <span style={{ color: '#D1D5DB', marginRight: '8px', fontWeight: '500' }}>
                {new Date(e.t).toLocaleTimeString()}
              </span>
              <span style={{ 
                marginRight: '8px',
                fontWeight: '600',
                ...getLevelColor(e.level)
              }}>
                [{e.level.toUpperCase()}]
              </span>
              {e.tag && (
                <span style={{ 
                  color: '#E5E7EB', 
                  marginRight: '8px',
                  fontStyle: 'italic'
                }}>
                  ({e.tag})
                </span>
              )}
              <span style={{ color: '#F9FAFB' }}>
                {e.msg}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getLogLevelStyle(level: string) {
  const baseStyle = {
    border: '1px solid transparent',
    borderLeft: '4px solid transparent'
  };
  
  switch (level) {
    case 'error':
      return {
        ...baseStyle,
        borderLeftColor: 'rgba(239, 68, 68, 0.8)'
      };
    case 'warn':
      return {
        ...baseStyle,
        borderLeftColor: 'rgba(245, 158, 11, 0.8)'
      };
    case 'debug':
      return {
        ...baseStyle,
        borderLeftColor: 'rgba(14, 165, 233, 0.8)'
      };
    default:
      return {
        ...baseStyle,
        borderLeftColor: 'rgba(34, 197, 94, 0.8)'
      };
  }
}

function getLevelColor(level: string) {
  switch (level) {
    case 'error':
      return { color: 'rgba(239, 68, 68, 0.9)' };
    case 'warn':
      return { color: 'rgba(245, 158, 11, 0.9)' };
    case 'debug':
      return { color: 'rgba(14, 165, 233, 0.9)' };
    default:
      return { color: 'rgba(34, 197, 94, 0.9)' };
  }
}
