import { logger } from '../lib/logger.js';
  export class BenefitAnalysis { analyze(entityId: string, option: string): number { const benefit = 0.3 + Math.random() * 0.7; logger.info({ entityId, option, benefit }, '[BenefitAnalysis] Benefit analyzed'); return benefit; } }
  export const benefitAnalysis = new BenefitAnalysis();
  export default benefitAnalysis;