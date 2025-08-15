// src/engine/ruleDebug.ts
// Engine-side instrumentation for rule debugging (Stage 1Q)

import { eventBus } from '../mpl-core-mock';
import type { VoxelPos, RuleDebugTrace, RuleDebugEntry } from '../mpl-core-mock';

class RuleDebug {
  private targetPos: VoxelPos | null = null;
  private currentTrace: RuleDebugEntry[] = [];
  private currentStep: number = 0;
  private currentPos: VoxelPos | null = null;
  private evalProvider: ((pos: VoxelPos) => void) | null = null;

  /**
   * Set the target voxel position to debug
   */
  setTarget(pos: VoxelPos | null) {
    this.targetPos = pos;
  }

  /**
   * Check if there's a target position set
   */
  hasTarget(): boolean {
    return this.targetPos !== null;
  }

  /**
   * Check if we should capture debug info for the given position
   */
  shouldCapture(pos: VoxelPos): boolean {
    if (!this.targetPos) return false;
    return pos.x === this.targetPos.x && pos.y === this.targetPos.y && pos.z === this.targetPos.z;
  }

  /**
   * Begin capturing a debug trace for a voxel
   */
  begin(step: number, pos: VoxelPos) {
    this.currentStep = step;
    this.currentPos = pos;
    this.currentTrace = [];
  }

  /**
   * Mark the start of a rule evaluation
   */
  markStart(ruleId: string) {
    this.currentTrace.push({ kind: 'start', ruleId });
  }

  /**
   * Record a predicate evaluation
   */
  predicate(ruleId: string, label: string, ok: boolean, details?: any) {
    this.currentTrace.push({ kind: 'predicate', ruleId, label, ok, details });
  }

  /**
   * Record an action execution
   */
  action(ruleId: string, desc: string, delta?: any) {
    this.currentTrace.push({ kind: 'action', ruleId, desc, delta });
  }

  /**
   * Mark the end of a rule evaluation
   */
  markEnd(ruleId: string) {
    this.currentTrace.push({ kind: 'end', ruleId });
  }

  /**
   * End the current debug trace and emit the event
   */
  end() {
    if (this.currentTrace.length === 0 || !this.currentPos) return;

    // Create summary of matched rules
    const matchedRules: string[] = [];
    const ruleStates = new Map<string, { matched: boolean; actions: number }>();

    for (const entry of this.currentTrace) {
      if (entry.kind === 'start') {
        ruleStates.set(entry.ruleId, { matched: false, actions: 0 });
      } else if (entry.kind === 'predicate' && entry.ok) {
        const state = ruleStates.get(entry.ruleId);
        if (state) state.matched = true;
      } else if (entry.kind === 'action') {
        const state = ruleStates.get(entry.ruleId);
        if (state) state.actions++;
      }
    }

    // Collect matched rules
    for (const [ruleId, state] of ruleStates) {
      if (state.matched && state.actions > 0) {
        matchedRules.push(ruleId);
      }
    }

    // Create the trace
    const trace: RuleDebugTrace = {
      step: this.currentStep,
      pos: this.currentPos,
      entries: this.currentTrace,
      summary: { matchedRules }
    };

    // Emit the ruleDebug event
    // Note: In the mock implementation, we just call the callback directly
    // In a real implementation, this would emit an event
    console.log('RuleDebug event:', { step: this.currentStep, pos: this.currentPos, trace });

    // Reset current trace
    this.currentTrace = [];
    this.currentPos = null;
  }

  /**
   * Set a function that can evaluate rules for a specific position
   * This enables the "Step once" functionality in the UI
   */
  setEvalProvider(fn: (pos: VoxelPos) => void) {
    this.evalProvider = fn;
  }

  /**
   * Trigger a single evaluation for the target position
   */
  stepOnce() {
    if (this.targetPos && this.evalProvider) {
      this.evalProvider(this.targetPos);
    }
  }

  /**
   * Get the current target position
   */
  getTarget(): VoxelPos | null {
    return this.targetPos;
  }

  /**
   * Clear the current target
   */
  clearTarget() {
    this.targetPos = null;
  }
}

export const ruleDebug = new RuleDebug();
