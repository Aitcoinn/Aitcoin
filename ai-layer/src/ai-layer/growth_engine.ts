import { logger } from '../lib/logger.js';
  export type GrowthStage = 'embryo' | 'juvenile' | 'adolescent' | 'adult' | 'elder';
  export interface GrowthState { entityId: string; stage: GrowthStage; growthRate: number; size: number; age: number; }
  export class GrowthEngine {
    private states: Map<string, GrowthState> = new Map();
    initGrowth(entityId: string): GrowthState {
      const s: GrowthState = { entityId, stage: 'embryo', growthRate: 1.0, size: 0.1, age: 0 };
      this.states.set(entityId, s);
      return s;
    }
    tick(entityId: string, delta: number): GrowthState | null {
      const s = this.states.get(entityId);
      if (!s) return null;
      s.age += delta; s.size = Math.min(1, s.size + s.growthRate * delta * 0.01);
      if (s.age < 10) s.stage = 'embryo';
      else if (s.age < 30) s.stage = 'juvenile';
      else if (s.age < 60) s.stage = 'adolescent';
      else if (s.age < 200) s.stage = 'adult';
      else s.stage = 'elder';
      logger.info({ entityId, stage: s.stage, size: s.size }, '[GrowthEngine] Growth ticked');
      return s;
    }
    get(entityId: string): GrowthState | null { return this.states.get(entityId) ?? null; }
  }
  export const growthEngine = new GrowthEngine();
  export default growthEngine;
  