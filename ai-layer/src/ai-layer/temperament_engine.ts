import { logger } from '../lib/logger.js';
  import { hormoneSystem } from './hormone_system.js';
  export type Temperament = 'sanguine'|'choleric'|'melancholic'|'phlegmatic';
  export interface TemperamentState { entityId: string; type: Temperament; reactivity: number; regulationCapacity: number; }
  export class TemperamentEngine {
    private states: Map<string, TemperamentState> = new Map();
    determine(entityId: string): TemperamentState {
      const adrenaline = hormoneSystem.get('adrenaline')?.level ?? 0.3;
      const cortisol = hormoneSystem.get('cortisol')?.level ?? 0.3;
      const type: Temperament = adrenaline > 0.6 ? 'choleric' : cortisol > 0.6 ? 'melancholic' : adrenaline < 0.3 ? 'phlegmatic' : 'sanguine';
      const s: TemperamentState = { entityId, type, reactivity: adrenaline, regulationCapacity: 1 - cortisol };
      this.states.set(entityId, s);
      logger.info({ entityId, type }, '[TemperamentEngine] Temperament determined');
      return s;
    }
    get(entityId: string): TemperamentState | null { return this.states.get(entityId) ?? null; }
  }
  export const temperamentEngine = new TemperamentEngine();
  export default temperamentEngine;