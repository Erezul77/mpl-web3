import { eventBus } from '../mpl-core-mock';
import { logger } from './logger';

export type HealthSnapshot = {
  ticks: number;
  fpsInstant: number;
  fpsEMA: number;
  dtMs: number;
  lastStep: number;
  stateChangesLastTick: number;
  ruleAppliedLastTick: number;
  errors: number;
};

class Health {
  private ticks = 0;
  private lastT: number | null = null;
  private fpsEMA = 0;
  private alpha = 0.2;
  private lastStep = 0;
  private dtMs = 0;
  private stateChanges = 0;
  private ruleApplied = 0;
  private errors = 0;

  constructor() {
    eventBus.on('tick', (event: any) => {
      this.ticks++;
      this.lastStep = event.step || 0;
      if (this.lastT != null) {
        this.dtMs = Math.max(0, event.t - this.lastT);
        const fps = this.dtMs > 0 ? 1000 / this.dtMs : 0;
        this.fpsEMA = this.fpsEMA ? (this.alpha * fps + (1 - this.alpha) * this.fpsEMA) : fps;
      }
      this.lastT = event.t;
    });
    eventBus.on('stateChange', () => { this.stateChanges++; });
    eventBus.on('ruleApplied', () => { this.ruleApplied++; });
    eventBus.on('error', (e: any) => { this.errors++; logger.error(e.message || 'engine error', e.data, 'engine'); });
  }

  snapshot(): HealthSnapshot {
    const fpsInstant = this.dtMs > 0 ? 1000 / this.dtMs : 0;
    const snap: HealthSnapshot = {
      ticks: this.ticks,
      fpsInstant,
      fpsEMA: this.fpsEMA,
      dtMs: this.dtMs,
      lastStep: this.lastStep,
      stateChangesLastTick: this.stateChanges,
      ruleAppliedLastTick: this.ruleApplied,
      errors: this.errors,
    };
    // reset per-tick counters
    this.stateChanges = 0;
    this.ruleApplied = 0;
    return snap;
  }
}

export const health = new Health();
