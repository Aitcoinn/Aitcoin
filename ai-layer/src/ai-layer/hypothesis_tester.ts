import { logger } from '../lib/logger.js';
  export class HypothesisTester { test(entityId: string, hypothesis: string, data: string[]): boolean { const confirmed = data.some(d => d.includes(hypothesis.split('_')[0] ?? '')); logger.info({ entityId, hypothesis, confirmed }, '[HypothesisTester] Tested'); return confirmed; } }
  export const hypothesisTester = new HypothesisTester();
  export default hypothesisTester;