import { logger } from '../lib/logger.js';
  export interface EgoState { entityId: string; egoStrength: number; selfConcept: string[]; narcissismIndex: number; boundaryStrength: number; }
  export class EgoSystem {
    private states: Map<string, EgoState> = new Map();
    form(entityId: string, initialTraits: string[]): EgoState {
      const s: EgoState = { entityId, egoStrength: 0.6, selfConcept: initialTraits, narcissismIndex: 0.3, boundaryStrength: 0.7 };
      this.states.set(entityId, s);
      logger.info({ entityId, traits: initialTraits.length }, '[EgoSystem] Ego formed');
      return s;
    }
    strengthen(entityId: string): void { const s = this.states.get(entityId); if (s) s.egoStrength = Math.min(1, s.egoStrength + 0.05); }
    weaken(entityId: string): void { const s = this.states.get(entityId); if (s) s.egoStrength = Math.max(0, s.egoStrength - 0.05); }
    get(entityId: string): EgoState | null { return this.states.get(entityId) ?? null; }
  }
  export const egoSystem = new EgoSystem();
  export default egoSystem;