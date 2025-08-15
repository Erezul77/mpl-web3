// src/ui/hooks/useRuleDebugStream.ts
// Hook to read ruleDebug events and keep the latest trace (Stage 1Q)

import { useEffect, useState } from 'react';
import { eventBus } from '../../mpl-core-mock';
import type { RuleDebugTrace } from '../../mpl-core-mock';

export function useRuleDebugStream() {
  const [latestTrace, setLatestTrace] = useState<RuleDebugTrace | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Subscribe to ruleDebug events
    const unsubscribe = eventBus.on('ruleDebug', (event: any) => {
      if (event.trace) {
        setLatestTrace(event.trace);
        setIsActive(true);
      }
    });

    return () => {
      // Cleanup subscription
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Clear the current trace
  const clearTrace = () => {
    setLatestTrace(null);
    setIsActive(false);
  };

  // Get trace statistics
  const getTraceStats = () => {
    if (!latestTrace) return null;

      const rulesEvaluated = new Set<string>();
  
  for (const entry of latestTrace.entries) {
    if (entry.kind === 'start') {
      rulesEvaluated.add(entry.ruleId);
    }
  }

  const stats = {
    totalEntries: latestTrace.entries.length,
    rulesEvaluated: Array.from(rulesEvaluated),
    predicates: 0,
    actions: 0,
    matchedRules: latestTrace.summary?.matchedRules || []
  };

  for (const entry of latestTrace.entries) {
    if (entry.kind === 'predicate') {
      stats.predicates++;
    } else if (entry.kind === 'action') {
      stats.actions++;
    }
  }
    return stats;
  };

  return {
    latestTrace,
    isActive,
    clearTrace,
    getTraceStats
  };
}
