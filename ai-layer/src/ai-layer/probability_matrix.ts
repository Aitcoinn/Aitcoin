import { logger } from '../lib/logger.js';
  export class ProbabilityMatrix { buildMatrix(outcomes: string[]): Record<string,number> { const total = outcomes.length; return Object.fromEntries(outcomes.map(o => [o, 1/total])); } }
  export const probabilityMatrix = new ProbabilityMatrix();
  export default probabilityMatrix;