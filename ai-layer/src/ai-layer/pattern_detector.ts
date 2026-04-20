import { logger } from '../lib/logger.js';
  export class PatternDetector { detect(entityId: string, data: string[]): string[] { return data.filter(d => data.filter(x => x === d).length > 1); } }
  export const patternDetector = new PatternDetector();
  export default patternDetector;