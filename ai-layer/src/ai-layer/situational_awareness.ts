import { logger } from '../lib/logger.js';
import { contextAwareness } from './context_awareness.js';
  export class SituationalAwareness {
    private situations: Map<string, string> = new Map();
    assess(entityId: string): string {
      const ctx = contextAwareness.get(entityId);
      const situation = Object.keys(ctx).length > 0 ? 'complex_situation_with_'+Object.keys(ctx).join('_') : 'simple_neutral_situation';
      this.situations.set(entityId, situation);
      logger.info({ entityId, situation }, '[SituationalAwareness] Assessed');
      return situation;
    }
    getCurrentSituation(entityId: string): string { return this.situations.get(entityId) ?? 'unknown'; }
  }
  export const situationalAwareness = new SituationalAwareness();
  export default situationalAwareness;