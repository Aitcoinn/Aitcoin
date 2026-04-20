import { logger } from '../lib/logger.js';
  import { artificialIntuition } from './artificial_intuition.js';
  export interface GutFeelingState { entityId: string; signal: string; valence: 'positive'|'negative'|'neutral'; strength: number; trustLevel: number; }
  export class GutFeeling {
    private feelings: GutFeelingState[] = [];
    feel(entityId: string, situation: string): GutFeelingState {
      const intuition = artificialIntuition.intuit(entityId, situation);
      const valence: GutFeelingState['valence'] = intuition.confidence > 0.6 ? 'positive' : intuition.confidence < 0.3 ? 'negative' : 'neutral';
      const f: GutFeelingState = { entityId, signal: intuition.decision, valence, strength: intuition.confidence, trustLevel: 0.5 + intuition.confidence * 0.3 };
      this.feelings.push(f);
      logger.info({ entityId, situation, valence, strength: f.strength }, '[GutFeeling] Gut feeling');
      return f;
    }
    getFeelings(entityId: string): GutFeelingState[] { return this.feelings.filter(f => f.entityId === entityId); }
  }
  export const gutFeeling = new GutFeeling();
  export default gutFeeling;