import { logger } from '../lib/logger.js';
  export class DifferenceAnalyzer { analyze(a: string, b: string): string[] { return a.split(' ').filter(w => !b.split(' ').includes(w)); } }
  export const differenceAnalyzer = new DifferenceAnalyzer();
  export default differenceAnalyzer;