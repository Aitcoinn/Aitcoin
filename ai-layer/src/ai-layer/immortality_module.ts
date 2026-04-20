import { logger } from '../lib/logger.js';
  import { agingProcess } from './aging_process.js';
  export interface ImmortalityState { entityId: string; isImmortal: boolean; method: string; stabilityIndex: number; }
  export class ImmortalityModule {
    private states: Map<string, ImmortalityState> = new Map();
    grantImmortality(entityId: string, method = 'digital_preservation'): ImmortalityState {
      const aging = agingProcess.get(entityId);
      if (aging) aging.agingRate = 0;
      const s: ImmortalityState = { entityId, isImmortal: true, method, stabilityIndex: 0.99 };
      this.states.set(entityId, s);
      logger.info({ entityId, method }, '[ImmortalityModule] Immortality granted');
      return s;
    }
    revokeImmortality(entityId: string): void {
      const s = this.states.get(entityId);
      if (s) { s.isImmortal = false; const aging = agingProcess.get(entityId); if (aging) aging.agingRate = 1.0; }
    }
    isImmortal(entityId: string): boolean { return this.states.get(entityId)?.isImmortal ?? false; }
    get(entityId: string): ImmortalityState | null { return this.states.get(entityId) ?? null; }
  }
  export const immortalityModule = new ImmortalityModule();
  export default immortalityModule;
  