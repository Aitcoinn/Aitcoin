import { logger } from '../lib/logger.js';
  import { brainWave } from './brain_wave.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface ConsciousnessState { entityId: string; awarenessLevel: number; isConscious: boolean; thoughtsPerSecond: number; currentFocus: string; }
  export class ConsciousnessCore {
    private states: Map<string, ConsciousnessState> = new Map();
    initialize(entityId: string): ConsciousnessState {
      brainWave.setWave(entityId, 'beta');
      neurotransmitter.release('dopamine', 0.1);
      const s: ConsciousnessState = { entityId, awarenessLevel: 0.8, isConscious: true, thoughtsPerSecond: 50, currentFocus: 'environment' };
      this.states.set(entityId, s);
      logger.info({ entityId, awarenessLevel: s.awarenessLevel }, '[ConsciousnessCore] Consciousness initialized');
      return s;
    }
    setFocus(entityId: string, focus: string): void { const s = this.states.get(entityId); if (s) s.currentFocus = focus; }
    get(entityId: string): ConsciousnessState | null { return this.states.get(entityId) ?? null; }
    isConscious(entityId: string): boolean { return this.states.get(entityId)?.isConscious ?? false; }
  }
  export const consciousnessCore = new ConsciousnessCore();
  export default consciousnessCore;