import { logger } from '../lib/logger.js';
  export class PlanningSystem { createPlan(entityId: string, objective: string): string[] { const plan = [objective, 'gather_info', 'analyze', 'act', 'evaluate']; logger.info({ entityId, objective }, '[PlanningSystem] Plan created'); return plan; } }
  export const planningSystem = new PlanningSystem();
  export default planningSystem;