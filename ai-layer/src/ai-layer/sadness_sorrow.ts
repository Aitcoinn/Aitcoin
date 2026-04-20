import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface SadnessState { entityId: string; sadnessLevel: number; cause: string; isGrief: boolean; recoveryProgress: number; }
  export class SadnessSorrow {
    private states: Map<string, SadnessState> = new Map();
    experience(entityId: string, cause: string, level = 0.5): SadnessState {
      emotionCore.feel(entityId, 'sadness', level);
      neurotransmitter.reuptake('serotonin', level * 0.1);
      const s: SadnessState = { entityId, sadnessLevel: level, cause, isGrief: level > 0.7, recoveryProgress: 0 };
      this.states.set(entityId, s);
      logger.info({ entityId, cause, level }, '[SadnessSorrow] Sadness experienced');
      return s;
    }
    heal(entityId: string, amount = 0.1): void { const s = this.states.get(entityId); if (s) { s.recoveryProgress = Math.min(1, s.recoveryProgress + amount); s.sadnessLevel = Math.max(0, s.sadnessLevel - amount); } }
    get(entityId: string): SadnessState | null { return this.states.get(entityId) ?? null; }
  }
  export const sadnessSorrow = new SadnessSorrow();
  export default sadnessSorrow;