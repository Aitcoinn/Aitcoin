import { logger } from '../lib/logger.js';
import { intelligenceIncrease } from './intelligence_increase.js';
  import { skillAcquisition } from './skill_acquisition.js';
  export class SelfImprovement {
    private improvements: Map<string, number> = new Map();
    improve(entityId: string, domain: string): void {
      skillAcquisition.practice(entityId, domain, 5);
      intelligenceIncrease.increase(entityId, 1);
      const count = (this.improvements.get(entityId) ?? 0) + 1;
      this.improvements.set(entityId, count);
      logger.info({ entityId, domain, totalImprovements: count }, '[SelfImprovement] Improved');
    }
    getImprovementCount(entityId: string): number { return this.improvements.get(entityId) ?? 0; }
  }
  export const selfImprovement = new SelfImprovement();
  export default selfImprovement;