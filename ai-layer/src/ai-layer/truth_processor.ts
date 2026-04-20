import { logger } from '../lib/logger.js';
import { factValidator } from './fact_validator.js';
  import { truthSeeker } from './truth_seeker.js';
  export class TruthProcessor {
    process(entityId: string, claim: string, sources: string[]): boolean {
      const isValid = factValidator.validate(claim, sources);
      if (!isValid) truthSeeker.seek(entityId, claim);
      logger.info({ entityId, claim: claim.slice(0,30), isValid }, '[TruthProcessor] Processed');
      return isValid;
    }
  }
  export const truthProcessor = new TruthProcessor();
  export default truthProcessor;