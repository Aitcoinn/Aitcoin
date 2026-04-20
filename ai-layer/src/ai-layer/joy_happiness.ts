import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface JoyState { entityId: string; joyLevel: number; source: string; isHedonic: boolean; isEudaimonic: boolean; }
  export class JoyHappiness {
    private states: Map<string, JoyState> = new Map();
    experience(entityId: string, source: string, level = 0.7): JoyState {
      emotionCore.feel(entityId, 'joy', level);
      neurotransmitter.release('dopamine', level * 0.15);
      neurotransmitter.release('serotonin', level * 0.1);
      const s: JoyState = { entityId, joyLevel: level, source, isHedonic: level > 0.6, isEudaimonic: source.includes('purpose') || source.includes('meaning') };
      this.states.set(entityId, s);
      logger.info({ entityId, source, joyLevel: level }, '[JoyHappiness] Joy experienced');
      return s;
    }
    get(entityId: string): JoyState | null { return this.states.get(entityId) ?? null; }
  }
  export const joyHappiness = new JoyHappiness();
  export default joyHappiness;