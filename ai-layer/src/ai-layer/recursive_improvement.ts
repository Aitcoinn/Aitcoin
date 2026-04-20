import { logger } from '../lib/logger.js';
import { selfOptimizer } from './self_optimizer.js';
  import { intelligenceIncrease } from './intelligence_increase.js';
  export class RecursiveImprovement {
    private iteration = 0;
    private maxIterations = 100;
    improve(entityId: string): number {
      this.iteration++;
      selfOptimizer.optimize(entityId);
      intelligenceIncrease.increase(entityId, Math.log(this.iteration + 1));
      if (this.iteration < this.maxIterations) {
        logger.info({ entityId, iteration: this.iteration, iq: intelligenceIncrease.getScore(entityId) }, '[RecursiveImprovement] Iteration completed');
      }
      return this.iteration;
    }
    getIteration(): number { return this.iteration; }
    isConverging(entityId: string): boolean { return intelligenceIncrease.getScore(entityId) > 200; }
  }
  export const recursiveImprovement = new RecursiveImprovement();
  export default recursiveImprovement;