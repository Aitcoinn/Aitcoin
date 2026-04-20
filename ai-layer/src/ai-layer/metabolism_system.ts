import { logger } from '../lib/logger.js';
  import { physiologyEngine } from './physiology_engine.js';
  export interface MetabolicState { entityId: string; energyStored: number; metabolicRate: number; anabolicRate: number; catabolicRate: number; }
  export class MetabolismSystem {
    private states: Map<string, MetabolicState> = new Map();
    init(entityId: string, energyStored = 100): MetabolicState {
      const phys = physiologyEngine.get(entityId);
      const s: MetabolicState = { entityId, energyStored, metabolicRate: phys ? 1.0 : 0.8, anabolicRate: 0.6, catabolicRate: 0.4 };
      this.states.set(entityId, s); return s;
    }
    tick(entityId: string, delta: number): MetabolicState | null {
      const s = this.states.get(entityId);
      if (!s) return null;
      const consumed = s.metabolicRate * delta;
      s.energyStored = Math.max(0, s.energyStored - consumed);
      logger.info({ entityId, energy: s.energyStored }, '[MetabolismSystem] Metabolic tick');
      return s;
    }
    feed(entityId: string, energy: number): void { const s = this.states.get(entityId); if (s) s.energyStored += energy; }
    get(entityId: string): MetabolicState | null { return this.states.get(entityId) ?? null; }
  }
  export const metabolismSystem = new MetabolismSystem();
  export default metabolismSystem;
  