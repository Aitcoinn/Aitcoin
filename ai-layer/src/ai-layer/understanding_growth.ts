import { logger } from '../lib/logger.js';
import { wisdomAccumulator } from './wisdom_accumulator.js';
  export class UnderstandingGrowth {
    private levels: Map<string, number> = new Map();
    grow(entityId: string, subject: string, depth: number): void {
      const current = this.levels.get(entityId) ?? 0;
      this.levels.set(entityId, Math.min(1, current + depth));
      wisdomAccumulator.accumulate(entityId, 'understanding_of_'+subject);
      logger.info({ entityId, subject, depth, total: this.levels.get(entityId) }, '[UnderstandingGrowth] Grew');
    }
    getLevel(entityId: string): number { return this.levels.get(entityId) ?? 0; }
  }
  export const understandingGrowth = new UnderstandingGrowth();
  export default understandingGrowth;