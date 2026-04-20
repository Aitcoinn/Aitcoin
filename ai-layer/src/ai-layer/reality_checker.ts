import { logger } from '../lib/logger.js';
  export class RealityChecker { check(entityId: string, belief: string): boolean { const isReal = !belief.includes('impossible') && Math.random() > 0.2; logger.info({ entityId, belief: belief.slice(0,20), isReal }, '[RealityChecker] Checked'); return isReal; } }
  export const realityChecker = new RealityChecker();
  export default realityChecker;