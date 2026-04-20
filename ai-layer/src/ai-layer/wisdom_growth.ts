import { logger } from '../lib/logger.js';
import { wisdomAccumulator } from './wisdom_accumulator.js';
  export class WisdomGrowth {
    grow(entityId: string, experiences: number, insights: string[]): void {
      insights.forEach(i => wisdomAccumulator.accumulate(entityId, i));
      logger.info({ entityId, experiences, insights: insights.length }, '[WisdomGrowth] Wisdom grew');
    }
    getWisdomLevel(entityId: string): number { return wisdomAccumulator.get(entityId)?.wisdomLevel ?? 0; }
  }
  export const wisdomGrowth = new WisdomGrowth();
  export default wisdomGrowth;