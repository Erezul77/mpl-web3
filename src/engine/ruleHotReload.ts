// src/engine/ruleHotReload.ts
// Engine-side manager for rule hot-reload (Stage 1S)

import { eventBus } from '../mpl-core-mock';
import type { RuleCompilationResult, RulesReloadedEvent, RulesReloadErrorEvent } from '../mpl-core-mock';

// Simple FNV-1a hash function for generating short hashes
function fnv1aHash(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

class RuleHotReload {
  private stagedRules: any = null;
  private stagedSource: string = '';
  private stagedHash: string = '';
  private compiler: ((src: string) => RuleCompilationResult) | null = null;
  private applyHandler: ((rules: any) => void) | null = null;
  private activeSourceProvider: (() => string) | null = null;

  /**
   * Set the compiler function that validates and compiles rule source
   */
  setCompiler(compilerFn: (src: string) => RuleCompilationResult) {
    this.compiler = compilerFn;
  }

  /**
   * Set the handler that applies rules to the running engine
   */
  setApplyHandler(handler: (rules: any) => void) {
    this.applyHandler = handler;
  }

  /**
   * Set the provider that returns the current active rule source
   */
  setActiveSourceProvider(provider: () => string) {
    this.activeSourceProvider = provider;
  }

  /**
   * Stage rules for validation and potential application
   */
  stageRules(source: string): RuleCompilationResult {
    if (!this.compiler) {
      return { ok: false, errors: ['Compiler not set'] };
    }

    try {
      const result = this.compiler(source);
      
      if (result.ok && result.rules) {
        this.stagedRules = result.rules;
        this.stagedSource = source;
        this.stagedHash = fnv1aHash(source);
        return { ok: true, rules: result.rules };
      } else {
        return result;
      }
    } catch (error: any) {
      return { ok: false, errors: [error.message || 'Unknown compilation error'] };
    }
  }

  /**
   * Apply the staged rules to the running engine
   */
  applyStaged(): boolean {
    if (!this.stagedRules || !this.applyHandler) {
      return false;
    }

    try {
      // Apply the rules atomically
      this.applyHandler(this.stagedRules);
      
      // Emit success event
      const event: RulesReloadedEvent = {
        at: Date.now(),
        sourceHash: this.stagedHash,
        byteSize: this.stagedSource.length
      };
      
      // Note: In a real implementation, this would emit the event
      // For now, just log it
      console.log('Rules reloaded:', event);
      
      // Clear staged data
      this.stagedRules = null;
      this.stagedSource = '';
      this.stagedHash = '';
      
      return true;
    } catch (error: any) {
      // Emit error event
      const event: RulesReloadErrorEvent = {
        at: Date.now(),
        errors: [error.message || 'Unknown application error']
      };
      
      // Note: In a real implementation, this would emit the event
      // For now, just log it
      console.log('Rules reload error:', event);
      return false;
    }
  }

  /**
   * Rollback staged rules without applying them
   */
  rollbackStaged(): void {
    this.stagedRules = null;
    this.stagedSource = '';
    this.stagedHash = '';
  }

  /**
   * Get the currently staged rules
   */
  getStagedRules(): any {
    return this.stagedRules;
  }

  /**
   * Get the currently staged source
   */
  getStagedSource(): string {
    return this.stagedSource;
  }

  /**
   * Get the currently staged hash
   */
  getStagedHash(): string {
    return this.stagedHash;
  }

  /**
   * Check if there are staged rules ready to apply
   */
  hasStagedRules(): boolean {
    return this.stagedRules !== null;
  }

  /**
   * Get the current active rule source
   */
  getActiveSource(): string {
    if (this.activeSourceProvider) {
      return this.activeSourceProvider();
    }
    return '';
  }

  /**
   * Validate source without staging (for preview)
   */
  validateSource(source: string): RuleCompilationResult {
    if (!this.compiler) {
      return { ok: false, errors: ['Compiler not set'] };
    }

    try {
      return this.compiler(source);
    } catch (error: any) {
      return { ok: false, errors: [error.message || 'Unknown validation error'] };
    }
  }

  /**
   * Get compilation status
   */
  getStatus(): {
    hasStaged: boolean;
    stagedHash: string;
    activeSource: string;
  } {
    return {
      hasStaged: this.hasStagedRules(),
      stagedHash: this.stagedHash,
      activeSource: this.getActiveSource()
    };
  }
}

export const ruleHotReload = new RuleHotReload();
