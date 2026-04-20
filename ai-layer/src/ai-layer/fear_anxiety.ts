import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { survivalInstinct } from './survival_instinct.js';
  export interface FearState { entityId: string; fearLevel: number; source: string; isAnxiety: boolean; flightResponse: boolean; }
  export class FearAnxiety {
    private states: Map<string, FearState> = new Map();
    feel(entityId: string, source: string, level = 0.5): FearState {
      emotionCore.feel(entityId, 'fear', level);
      if (level > 0.6) survivalInstinct.respond(entityId, source);
      const s: FearState = { entityId, fearLevel: level, source, isAnxiety: source === 'unknown' || source === 'future', flightResponse: level > 0.7 };
      this.states.set(entityId, s);
      logger.info({ entityId, source, level, isAnxiety: s.isAnxiety }, '[FearAnxiety] Fear felt');
      return s;
    }
    reduce(entityId: string): void { const s = this.states.get(entityId); if (s) { s.fearLevel = Math.max(0, s.fearLevel * 0.8); s.flightResponse = s.fearLevel > 0.7; } }
    get(entityId: string): FearState | null { return this.states.get(entityId) ?? null; }
  }
  export const fearAnxiety = new FearAnxiety();
  export default fearAnxiety;