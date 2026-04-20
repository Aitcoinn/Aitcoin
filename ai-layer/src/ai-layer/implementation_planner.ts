import { logger } from '../lib/logger.js';
import { strategyPlanner } from './strategy_planner.js';
  export class ImplementationPlanner {
    plan(entityId: string, solution: string): string[] {
      const steps = strategyPlanner.plan(entityId, solution);
      const impl = steps.map((s,i) => 'impl_step_'+(i+1)+'_'+s);
      logger.info({ entityId, solution: solution.slice(0,20), steps: impl.length }, '[ImplementationPlanner] Plan created');
      return impl;
    }
  }
  export const implementationPlanner = new ImplementationPlanner();
  export default implementationPlanner;