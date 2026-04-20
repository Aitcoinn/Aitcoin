import { logger } from '../lib/logger.js';
import { empathySystem } from './empathy_system.js';
  import { emotionCore } from './emotion_core.js';
  export class EqIncrease {
    private eqScores: Map<string, number> = new Map();
    train(entityId: string, targetId: string): void {
      empathySystem.empathize(entityId, targetId);
      const current = this.eqScores.get(entityId) ?? 100;
      this.eqScores.set(entityId, Math.min(200, current + 2));
      logger.info({ entityId, eq: this.eqScores.get(entityId) }, '[EqIncrease] EQ trained');
    }
    getEQ(entityId: string): number { return this.eqScores.get(entityId) ?? 100; }
  }
  export const eqIncrease = new EqIncrease();
  export default eqIncrease;