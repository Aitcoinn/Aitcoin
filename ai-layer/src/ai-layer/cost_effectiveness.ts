import { logger } from '../lib/logger.js';
  export class CostEffectiveness { compute(entityId: string, cost: number, benefit: number): number { const ratio = benefit / Math.max(0.01, cost); logger.info({ entityId, cost, benefit, ratio }, '[CostEffectiveness] Computed'); return ratio; } }
  export const costEffectiveness = new CostEffectiveness();
  export default costEffectiveness;