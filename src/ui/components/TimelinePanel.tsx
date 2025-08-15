// src/ui/components/TimelinePanel.tsx
// Timeline panel with playback controls and frame navigation

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from '../state/history';

export default function TimelinePanel() {
  const { state, goToFrame, play, pause, clearHistory } = useHistory();
  const { frames, currentFrameIndex, isPlaying, isFollowingLive } = state;

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleRewind = useCallback(() => {
    goToFrame(0);
  }, [goToFrame]);

  const handleFastForward = useCallback(() => {
    goToFrame(frames.length - 1);
  }, [frames.length, goToFrame]);

  const handleFrameChange = useCallback((index: number) => {
    goToFrame(index);
  }, [goToFrame]);

  const handleClear = useCallback(() => {
    clearHistory();
  }, [clearHistory]);

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Timeline</h3>
        <button
          onClick={handleClear}
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

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>
          Frame {currentFrameIndex + 1} of {frames.length}
        </div>
        
        <input
          type="range"
          min={0}
          max={Math.max(0, frames.length - 1)}
          value={currentFrameIndex}
          onChange={(e) => handleFrameChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <button
          onClick={handleRewind}
          disabled={currentFrameIndex <= 0}
          style={{
            padding: '8px 12px',
            background: currentFrameIndex <= 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 123, 255, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: currentFrameIndex <= 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: currentFrameIndex <= 0 ? 0.5 : 1
          }}
        >
          ⏮
        </button>
        
        <button
          onClick={handlePlay}
          style={{
            padding: '8px 16px',
            background: isPlaying ? 'rgba(220, 53, 69, 0.8)' : 'rgba(40, 167, 69, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button
          onClick={handleFastForward}
          disabled={currentFrameIndex >= frames.length - 1}
          style={{
            padding: '8px 12px',
            background: currentFrameIndex >= frames.length - 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 123, 255, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: currentFrameIndex >= frames.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: currentFrameIndex >= frames.length - 1 ? 0.5 : 1
          }}
        >
          ⏭
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          <input
            type="checkbox"
            checked={isFollowingLive}
            style={{ cursor: 'pointer' }}
            readOnly
          />
          Follow Live
        </label>
      </div>

      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        lineHeight: '1.4'
      }}>
        <div style={{ marginBottom: '4px' }}>Memory: ~{Math.round(frames.length * 0.1)} MB</div>
        <div style={{ marginBottom: '4px' }}>Capacity: 600 frames</div>
        <div>Stride: Every 1 tick</div>
      </div>
    </div>
  );
}
