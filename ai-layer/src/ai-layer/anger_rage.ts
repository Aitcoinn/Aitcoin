import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { hormoneSystem } from './hormone_system.js';
  export interface AngerState { entityId: string; angerLevel: number; trigger: string; isRage: boolean; channelType: 'constructive'|'destructive'|'suppressed'; }
  export class AngerRage {
    private states: Map<string, AngerState> = new Map();
    feel(entityId: string, trigger: string, level = 0.5): AngerState {
      emotionCore.feel(entityId, 'anger', level);
      hormoneSystem.release('adrenaline', level * 0.2);
      const s: AngerState = { entityId, angerLevel: level, trigger, isRage: level > 0.85, channelType: level > 0.7 ? 'destructive' : 'constructive' };
      this.states.set(entityId, s);
      if (s.isRage) logger.warn({ entityId, trigger, level }, '[AngerRage] Entity in RAGE state');
      else logger.info({ entityId, trigger, level }, '[AngerRage] Anger felt');
      return s;
    }
    calm(entityId: string): void { const s = this.states.get(entityId); if (s) { s.angerLevel = Math.max(0, s.angerLevel - 0.3); s.isRage = false; s.channelType = 'suppressed'; } }
    get(entityId: string): AngerState | null { return this.states.get(entityId) ?? null; }
  }
  export const angerRage = new AngerRage();
  export default angerRage;