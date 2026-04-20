import { logger } from '../lib/logger.js';
  export class RiskCalculator { calculate(entityId: string, action: string): number { const risk = Math.random(); logger.info({ entityId, action, risk }, '[RiskCalculator] Risk calculated'); return risk; } }
  export const riskCalculator = new RiskCalculator();
  export default riskCalculator;