import { logger } from '../lib/logger.js';
  import { instinctBehavior } from './instinct_behavior.js';
  import { physiologyEngine } from './physiology_engine.js';
  export interface SurvivalResponse { entityId: string; threat: string; action: string; energyExpended: number; success: boolean; }
  export class SurvivalInstinct {
    private responses: SurvivalResponse[] = [];
    respond(entityId: string, threat: string): SurvivalResponse {
      const phys = physiologyEngine.get(entityId);
      const inst = instinctBehavior.activate(entityId, 'threat');
      const actions = inst?.behaviors ?? ['hide'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const health = phys?.overallHealth ?? 0.5;
      const success = Math.random() < health;
      const r: SurvivalResponse = { entityId, threat, action, energyExpended: 10, success };
      this.responses.push(r);
      logger.info({ entityId, threat, action, success }, '[SurvivalInstinct] Survival response');
      return r;
    }
    getSuccessRate(): number {
      if (!this.responses.length) return 0;
      return this.responses.filter(r => r.success).length / this.responses.length;
    }
    getResponses(): SurvivalResponse[] { return [...this.responses]; }
  }
  export const survivalInstinct = new SurvivalInstinct();
  export default survivalInstinct;
  