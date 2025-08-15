// src/engine/visPlayback.ts
// Helper to put VoxelGrid3D into playback mode without touching engine code

import { visBridge } from './visBridge';
import { VisSnapshot } from './visBridge';

class VisPlayback {
  private isInPlaybackMode = false;
  
  /**
   * Enter playback mode - override the live snapshot with a historical frame
   */
  enterPlayback(snapshot: VisSnapshot) {
    visBridge.setExternalSnapshot(snapshot);
    this.isInPlaybackMode = true;
  }
  
  /**
   * Exit playback mode - resume live updates
   */
  exitPlayback() {
    visBridge.setExternalSnapshot(null);
    this.isInPlaybackMode = false;
  }
  
  /**
   * Check if currently in playback mode
   */
  isPlaying() {
    return this.isInPlaybackMode;
  }
  
  /**
   * Update the current playback frame
   */
  updateFrame(snapshot: VisSnapshot) {
    if (this.isInPlaybackMode) {
      visBridge.setExternalSnapshot(snapshot);
    }
  }
}

export const visPlayback = new VisPlayback();
