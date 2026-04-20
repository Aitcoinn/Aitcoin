import { logger } from '../lib/logger.js';
  export interface WisdomState { entityId: string; wisdomLevel: number; insights: string[]; lifeExperiences: number; perspectiveDepth: number; }
  export class WisdomAccumulator {
    private states: Map<string, WisdomState> = new Map();
    accumulate(entityId: string, insight: string): WisdomState {
      const s = this.states.get(entityId) ?? { entityId, wisdomLevel: 0, insights: [], lifeExperiences: 0, perspectiveDepth: 0 };
      s.insights.push(insight); s.lifeExperiences++; s.wisdomLevel = Math.min(1, s.lifeExperiences / 1000); s.perspectiveDepth = s.wisdomLevel * 0.9;
      this.states.set(entityId, s);
      logger.info({ entityId, wisdomLevel: s.wisdomLevel, insights: s.insights.length }, '[WisdomAccumulator] Wisdom grown');
      return s;
    }
    get(entityId: string): WisdomState | null { return this.states.get(entityId) ?? null; }
  }
  export const wisdomAccumulator = new WisdomAccumulator();
  export default wisdomAccumulator;