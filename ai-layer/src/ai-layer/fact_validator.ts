import { logger } from '../lib/logger.js';
  export class FactValidator { validate(fact: string, sources: string[]): boolean { const valid = sources.length > 1 && !fact.includes('always') && !fact.includes('never'); logger.info({ fact, valid }, '[FactValidator] Validated'); return valid; } }
  export const factValidator = new FactValidator();
  export default factValidator;