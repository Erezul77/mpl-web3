// src/ui/hooks/useMetricsCollector.ts
// Hook that collects tick rate and counts by listening to engine events (Stage 1R)

import { useEffect, useRef } from 'react';
import { useMetrics } from '../state/metrics';
import { eventBus } from '../../mpl-core-mock';
import { visBridge } from '../../engine/visBridge';

export function useMetricsCollector() {
  const { addSample, updateTopRules } = useMetrics();
  const lastTickTime = useRef<number>(Date.now());
  const tickCount = useRef<number>(0);
  const changedVoxels = useRef<Set<string>>(new Set());
  const ruleTriggers = useRef<Map<string, number>>(new Map());
  const activeRules = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Subscribe to engine events to collect metrics
    const unsubscribers = [
      eventBus.on('tick', (event: any) => {
        const now = Date.now();
        const deltaTime = now - lastTickTime.current;
        const fps = deltaTime > 0 ? 1000 / deltaTime : 0;
        
        // Get grid size from visBridge for percentage calculation
        const snapshot = visBridge.getSnapshot().snapshot;
        const gridSize = snapshot ? snapshot.size.x * snapshot.size.y * snapshot.size.z : 2500; // Default 50x50
        
        // Calculate percentage of changed voxels
        const percentChanged = gridSize > 0 ? (changedVoxels.current.size / gridSize) * 100 : 0;
        
        // Create metric sample
        const sample = {
          timestamp: now,
          fps,
          changedVoxels: changedVoxels.current.size,
          percentChanged,
          ruleTriggers: Array.from(ruleTriggers.current.values()).reduce((sum, count) => sum + count, 0),
          activeRules: Array.from(activeRules.current),
        };
        
        addSample(sample);
        
        // Update top rules
        const sortedRules = Array.from(ruleTriggers.current.entries())
          .map(([ruleId, triggers]) => ({ ruleId, triggers }))
          .sort((a, b) => b.triggers - a.triggers)
          .slice(0, 10); // Top 10 rules
        
        updateTopRules(sortedRules);
        
        // Reset counters for next tick
        lastTickTime.current = now;
        tickCount.current++;
        changedVoxels.current.clear();
        ruleTriggers.current.clear();
        activeRules.current.clear();
      }),
      
      eventBus.on('stateChange', (event: any) => {
        // Track changed voxel positions
        if (event.position) {
          const posKey = `${event.position.x},${event.position.y},${event.position.z}`;
          changedVoxels.current.add(posKey);
        }
      }),
      
      eventBus.on('ruleApplied', (event: any) => {
        // Track rule triggers
        if (event.ruleId) {
          const currentCount = ruleTriggers.current.get(event.ruleId) || 0;
          ruleTriggers.current.set(event.ruleId, currentCount + 1);
          activeRules.current.add(event.ruleId);
        }
      }),
      
      eventBus.on('simulationStop', () => {
        // Reset counters when simulation stops
        tickCount.current = 0;
        changedVoxels.current.clear();
        ruleTriggers.current.clear();
        activeRules.current.clear();
      })
    ];
    
    return () => {
      unsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  }, [addSample, updateTopRules]);
  
  // Return nothing - this hook is purely for side effects
  return null;
}
