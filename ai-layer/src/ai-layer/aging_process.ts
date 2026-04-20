import { logger } from '../lib/logger.js';
  import { growthEngine } from './growth_engine.js';
  export interface AgingState { entityId: string; biologicalAge: number; agingRate: number; healthDecline: number; expectedLifespan: number; }
  export class AgingProcess {
    private states: Map<string, AgingState> = new Map();
    initAging(entityId: string, expectedLifespan = 1000): AgingState {
      const s: AgingState = { entityId, biologicalAge: 0, agingRate: 1.0, healthDecline: 0, expectedLifespan };
      this.states.set(entityId, s); return s;
    }
    age(entityId: string, delta: number): AgingState | null {
      const s = this.states.get(entityId);
      const gs = growthEngine.get(entityId);
      if (!s || !gs) return null;
      s.biologicalAge += delta * s.agingRate;
      s.healthDecline = s.biologicalAge / s.expectedLifespan;
      logger.info({ entityId, age: s.biologicalAge, decline: s.healthDecline }, '[AgingProcess] Aged');
      return s;
    }
    isNearDeath(entityId: string): boolean { return (this.states.get(entityId)?.healthDecline ?? 0) > 0.9; }
    get(entityId: string): AgingState | null { return this.states.get(entityId) ?? null; }
  }
  export const agingProcess = new AgingProcess();
  export default agingProcess;
  