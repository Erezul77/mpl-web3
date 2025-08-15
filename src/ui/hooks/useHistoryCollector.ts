// src/ui/hooks/useHistoryCollector.ts
// Hook that subscribes to engine events and records snapshots for timeline

import { useEffect, useRef } from 'react';
import { useHistory } from '../state/history';
import { eventBus } from '../../mpl-core-mock';

export function useHistoryCollector() {
  const { addFrame, state } = useHistory();
  const lastStepRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  
  useEffect(() => {
    // Subscribe to engine events to collect snapshots
    const unsubscribers = [
      eventBus.on('tick', (event: any) => {
        // Only record frames based on stride setting
        if (frameCountRef.current % state.stride === 0) {
          // Get current snapshot from the VM (we'll need to access this)
          // For now, we'll create a mock snapshot
          const mockSnapshot = {
            size: { x: 50, y: 50, z: 1 },
            channel: new Uint8Array(50 * 50).fill(0),
            getStateAt: (x: number, y: number, z: number) => ({
              value: 0,
              position: { x, y, z },
              step: lastStepRef.current,
              timestamp: Date.now()
            })
          };
          
          addFrame(mockSnapshot, lastStepRef.current);
        }
        
        frameCountRef.current++;
        lastStepRef.current = (event.step || lastStepRef.current) + 1;
      }),
      
      eventBus.on('simulationStop', () => {
        // Reset frame counter when simulation stops
        frameCountRef.current = 0;
        lastStepRef.current = 0;
      })
    ];
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [addFrame, state.stride]);
  
  // Return nothing - this hook is purely for side effects
  return null;
}
