import { logger } from '../lib/logger.js';
  export class LieDetector { detect(statement: string, context: string): number { const suspicion = statement.includes('!') || statement.includes('never') ? 0.7 : 0.2; logger.info({ statement: statement.slice(0,20), suspicion }, '[LieDetector] Detected'); return suspicion; } }
  export const lieDetector = new LieDetector();
  export default lieDetector;