import { logger } from '../lib/logger.js';
  export class PossibilityCalculator { calculate(scenario: string, conditions: string[]): number { return Math.min(1, conditions.length * 0.1 + 0.3); } }
  export const possibilityCalculator = new PossibilityCalculator();
  export default possibilityCalculator;